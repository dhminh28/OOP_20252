package com.cospace.service;

import com.cospace.dto.request.LoginRequest;
import com.cospace.dto.request.RegisterRequest;
import com.cospace.dto.response.AuthResponse;
import com.cospace.dto.response.UserResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getCurrentUser(Long userId);
}
