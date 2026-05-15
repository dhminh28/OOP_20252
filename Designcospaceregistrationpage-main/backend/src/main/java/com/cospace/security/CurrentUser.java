package com.cospace.security;

public record CurrentUser(
        Long id,
        String email,
        String role
) {
}
