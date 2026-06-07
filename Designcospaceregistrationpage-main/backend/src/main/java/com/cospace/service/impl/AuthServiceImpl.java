package com.cospace.service.impl;

import com.cospace.dto.request.LoginRequest;
import com.cospace.dto.request.RegisterRequest;
import com.cospace.dto.response.AuthResponse;
import com.cospace.dto.response.UserResponse;
import com.cospace.entity.Member;
import com.cospace.entity.User;
import com.cospace.entity.Wallet;
import com.cospace.exception.BusinessException;
import com.cospace.exception.AccountBlockedException;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.UserRepository;
import com.cospace.repository.WalletRepository;
import com.cospace.security.JwtProvider;
import com.cospace.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthServiceImpl(
            UserRepository userRepository,
            WalletRepository walletRepository,
            PasswordEncoder passwordEncoder,
            JwtProvider jwtProvider
    ) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("Email is already registered");
        }

        Member member = new Member();
        member.setFullName(request.fullName());
        member.setEmail(email);
        member.setPasswordHash(passwordEncoder.encode(request.password()));
        member.setPhone(request.phone());

        User savedUser = userRepository.save(member);
        Wallet wallet = new Wallet();
        wallet.setMember(member);
        walletRepository.save(wallet);

        return new AuthResponse(toUserResponse(savedUser), jwtProvider.generateToken(savedUser));
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.email()))
                .orElseThrow(() -> new BusinessException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException("Invalid email or password");
        }
        if (user.isBlocked()) {
            throw new AccountBlockedException("Tài khoản của bạn đã bị khóa");
        }

        return new AuthResponse(toUserResponse(user), jwtProvider.generateToken(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toUserResponse(user);
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

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
