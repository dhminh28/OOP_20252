package com.cospace.dto.response;

import com.cospace.enums.UserRole;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        UserRole role,
        boolean blocked,
        String avatar
) {
}
