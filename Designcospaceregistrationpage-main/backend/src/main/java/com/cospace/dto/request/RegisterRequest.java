package com.cospace.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @NotBlank
        @Size(min = 8, message = "Mật khẩu phải dài tối thiểu 8 ký tự")
        String password,
        String phone
) {
}
