package com.cospace.controller;

import com.cospace.config.OpenApiConfig;
import com.cospace.dto.request.LoginRequest;
import com.cospace.dto.request.RegisterRequest;
import com.cospace.dto.response.ApiResponse;
import com.cospace.dto.response.AuthResponse;
import com.cospace.dto.response.UserResponse;
import com.cospace.security.CurrentUser;
import com.cospace.security.JwtProvider;
import com.cospace.security.TokenBlacklistService;
import com.cospace.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Register, login, and authenticated user profile APIs.")
public class AuthController {

    private static final String BEARER_PREFIX = "Bearer ";

    private final AuthService authService;
    private final JwtProvider jwtProvider;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthController(
            AuthService authService,
            JwtProvider jwtProvider,
            TokenBlacklistService tokenBlacklistService
    ) {
        this.authService = authService;
        this.jwtProvider = jwtProvider;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @PostMapping("/register")
    @Operation(
            summary = "Register a member account",
            description = "Creates a new member account, hashes the password, creates an empty wallet, and returns a JWT.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    description = "Member registration data.",
                    content = @Content(schema = @Schema(implementation = RegisterRequest.class))
            )
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Registration succeeded. Response body is ApiResponse<AuthResponse>.",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data or duplicated email.")
    })
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(
            summary = "Login",
            description = "Verifies email and password, then returns authenticated user data and a JWT token.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    description = "Login credentials.",
                    content = @Content(schema = @Schema(implementation = LoginRequest.class))
            )
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Login succeeded. Response body is ApiResponse<AuthResponse>.",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid email or password.")
    })
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(authService.login(request));
    }

    @PostMapping("/logout")
    @Operation(
            summary = "Logout",
            description = "Immediately revokes the current JWT until its original expiration time.",
            security = @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "JWT revoked."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Missing or invalid JWT.")
    })
    public ApiResponse<Void> logout(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader
    ) {
        String token = authorizationHeader.substring(BEARER_PREFIX.length()).trim();
        tokenBlacklistService.blacklistToken(token, jwtProvider.getExpiration(token));
        return ApiResponse.ok(null);
    }

    @GetMapping("/me")
    @Operation(
            summary = "Get current authenticated user",
            description = "Returns the user profile resolved from the JWT bearer token.",
            security = @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Current user profile. Response body is ApiResponse<UserResponse>.",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Missing or invalid JWT."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found.")
    })
    public ApiResponse<UserResponse> me(@AuthenticationPrincipal CurrentUser currentUser) {
        return ApiResponse.ok(authService.getCurrentUser(currentUser.id()));
    }
}
