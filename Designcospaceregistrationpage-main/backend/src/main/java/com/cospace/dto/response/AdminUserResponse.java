package com.cospace.dto.response;

import com.cospace.enums.UserRole;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        UserRole role,
        LocalDateTime createdAt
) {
}
