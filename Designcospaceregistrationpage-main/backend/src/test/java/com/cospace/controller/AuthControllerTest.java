package com.cospace.controller;

import com.cospace.dto.response.ApiResponse;
import com.cospace.security.JwtProvider;
import com.cospace.security.TokenBlacklistService;
import com.cospace.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private TokenBlacklistService tokenBlacklistService;

    @InjectMocks
    private AuthController authController;

    @Test
    void logout_blacklistsBearerTokenUntilJwtExpiration() {
        String token = "valid-token";
        Date expiration = new Date(System.currentTimeMillis() + 60_000);
        when(jwtProvider.getExpiration(token)).thenReturn(expiration);

        ApiResponse<Void> response = authController.logout("Bearer " + token);

        assertThat(response.success()).isTrue();
        assertThat(response.data()).isNull();
        verify(tokenBlacklistService).blacklistToken(token, expiration);
    }
}
