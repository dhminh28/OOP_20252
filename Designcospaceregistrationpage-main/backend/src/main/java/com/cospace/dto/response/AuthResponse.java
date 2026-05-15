package com.cospace.dto.response;

public record AuthResponse(
        UserResponse user,
        String token
) {
}
