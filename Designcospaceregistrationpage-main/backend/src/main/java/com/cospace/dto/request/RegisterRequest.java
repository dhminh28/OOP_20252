package com.cospace.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Họ và tên không được để trống") String fullName,
        @Email(message = "Địa chỉ thư điện tử không đúng định dạng")
        @NotBlank(message = "Địa chỉ thư điện tử không được để trống")
        String email,
        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 8, message = "Mật khẩu phải dài tối thiểu 8 ký tự")
        String password,
        String phone
) {
}
