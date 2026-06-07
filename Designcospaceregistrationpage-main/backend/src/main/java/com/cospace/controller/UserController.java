package com.cospace.controller;

import com.cospace.dto.request.ProfileUpdateRequest;
import com.cospace.dto.response.ApiResponse;
import com.cospace.dto.response.UserResponse;
import com.cospace.security.CurrentUser;
import com.cospace.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/profile")
    public ApiResponse<UserResponse> updateProfile(
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        return ApiResponse.ok(userService.updateProfile(currentUser.id(), request));
    }
}
