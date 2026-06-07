package com.cospace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminBookingCancelRequest(
        @NotBlank
        @Size(max = 500)
        String reason
) {
}
