package com.cospace.service.impl;

import com.cospace.dto.request.AdminCreateUserRequest;
import com.cospace.dto.request.ProfileUpdateRequest;
import com.cospace.dto.response.AdminUserResponse;
import com.cospace.dto.response.UserResponse;
import com.cospace.entity.Member;
import com.cospace.entity.User;
import com.cospace.entity.Wallet;
import com.cospace.enums.UserRole;
import com.cospace.exception.BusinessException;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.UserRepository;
import com.cospace.repository.WalletRepository;
import com.cospace.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            WalletRepository walletRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AdminUserResponse createMember(AdminCreateUserRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("Email is already registered");
        }

        Member member = new Member();
        member.setFullName(request.fullName().trim());
        member.setEmail(email);
        member.setPasswordHash(passwordEncoder.encode(request.password()));
        member.setPhone(normalizeOptional(request.phone()));
        userRepository.save(member);

        Wallet wallet = new Wallet();
        wallet.setMember(member);
        walletRepository.save(wallet);
        return toAdminResponse(member);
    }

    @Override
    public AdminUserResponse setBlocked(Long userId, boolean blocked) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() != UserRole.MEMBER) {
            throw new BusinessException("Only member accounts can be blocked");
        }

        user.setBlocked(blocked);
        return toAdminResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFullName(request.fullName().trim());
        user.setPhone(normalizeOptional(request.phone()));
        user.setAvatar(normalizeOptional(request.avatar()));
        return toUserResponse(userRepository.save(user));
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private AdminUserResponse toAdminResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt(),
                user.isBlocked(),
                user.getAvatar()
        );
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isBlocked(),
                user.getAvatar()
        );
    }
}
