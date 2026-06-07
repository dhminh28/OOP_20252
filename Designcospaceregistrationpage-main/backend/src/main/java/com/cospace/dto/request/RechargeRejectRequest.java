package com.cospace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RechargeRejectRequest(
        @NotBlank
        @Size(max = 500)
        String reason
) {
}
