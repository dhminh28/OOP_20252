package com.cospace.security;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

class TokenBlacklistServiceTest {

    private final TokenBlacklistService tokenBlacklistService = new TokenBlacklistService();

    @Test
    void blacklistToken_keepsTokenRevokedUntilExpiration() {
        String token = "active-token";
        Date expiration = new Date(System.currentTimeMillis() + 60_000);

        tokenBlacklistService.blacklistToken(token, expiration);

        assertThat(tokenBlacklistService.isBlacklisted(token)).isTrue();
    }

    @Test
    void blacklistToken_ignoresAlreadyExpiredToken() {
        String token = "expired-token";
        Date expiration = new Date(System.currentTimeMillis() - 1);

        tokenBlacklistService.blacklistToken(token, expiration);

        assertThat(tokenBlacklistService.isBlacklisted(token)).isFalse();
    }
}
