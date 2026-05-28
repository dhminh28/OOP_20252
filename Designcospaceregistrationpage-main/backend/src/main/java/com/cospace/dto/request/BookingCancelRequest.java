package com.cospace.dto.request;

import jakarta.validation.constraints.Size;

public record BookingCancelRequest(
        @Size(max = 500, message = "Cancel reason must be at most 500 characters")
        String reason
) {
}
