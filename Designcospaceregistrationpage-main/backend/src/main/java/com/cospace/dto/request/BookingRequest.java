package com.cospace.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record BookingRequest(
        @NotNull Long workspaceId,
        @NotNull LocalDateTime startTime,
        @NotNull LocalDateTime endTime,
        String note
) {
}
