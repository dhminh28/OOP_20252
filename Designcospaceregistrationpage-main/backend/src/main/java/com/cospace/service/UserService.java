package com.cospace.service;

import com.cospace.dto.request.AdminCreateUserRequest;
import com.cospace.dto.request.ProfileUpdateRequest;
import com.cospace.dto.response.AdminUserResponse;
import com.cospace.dto.response.UserResponse;

public interface UserService {

    AdminUserResponse createMember(AdminCreateUserRequest request);

    AdminUserResponse setBlocked(Long userId, boolean blocked);

    UserResponse updateProfile(Long userId, ProfileUpdateRequest request);
}
