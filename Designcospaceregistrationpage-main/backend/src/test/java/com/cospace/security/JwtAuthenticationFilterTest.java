package com.cospace.security;

import com.cospace.entity.Member;
import com.cospace.repository.UserRepository;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private TokenBlacklistService tokenBlacklistService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FilterChain filterChain;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilter_whenTokenIsBlacklisted_doesNotAuthenticateRequest() throws Exception {
        String token = "revoked-token";
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse response = new MockHttpServletResponse();
        when(tokenBlacklistService.isBlacklisted(token)).thenReturn(true);
        JwtAuthenticationFilter filter =
                new JwtAuthenticationFilter(
                        jwtProvider,
                        tokenBlacklistService,
                        userRepository
                );

        filter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(jwtProvider, never()).validateToken(token);
        verify(jwtProvider, never()).getCurrentUser(token);
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilter_whenAccountIsBlocked_returnsForbiddenWithoutContinuing() throws Exception {
        String token = "valid-token";
        CurrentUser currentUser = new CurrentUser(1L, "member@cospace.vn", "MEMBER");
        Member member = new Member();
        member.setBlocked(true);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse response = new MockHttpServletResponse();
        when(tokenBlacklistService.isBlacklisted(token)).thenReturn(false);
        when(jwtProvider.validateToken(token)).thenReturn(true);
        when(jwtProvider.getCurrentUser(token)).thenReturn(currentUser);
        when(userRepository.findById(1L)).thenReturn(Optional.of(member));
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(
                jwtProvider,
                tokenBlacklistService,
                userRepository
        );

        filter.doFilter(request, response, filterChain);

        assertThat(response.getStatus()).isEqualTo(403);
        assertThat(response.getContentAsString())
                .contains("Tài khoản của bạn đã bị khóa");
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain, never()).doFilter(request, response);
    }
}
