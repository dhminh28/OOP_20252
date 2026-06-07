package com.cospace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @NotBlank
        @Size(max = 255)
        String fullName,

        @Size(max = 50)
        String phone,

        @Size(max = 2_800_000, message = "Ảnh đại diện không được vượt quá 2 MB")
        @Pattern(
                regexp = "^$|^data:image/(png|jpeg);base64,[A-Za-z0-9+/=\\r\\n]+$",
                message = "Ảnh đại diện phải là dữ liệu PNG hoặc JPEG hợp lệ"
        )
        String avatar
) {
}
