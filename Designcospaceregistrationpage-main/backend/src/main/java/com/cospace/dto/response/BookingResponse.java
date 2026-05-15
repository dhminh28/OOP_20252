package com.cospace.dto.response;

import com.cospace.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        Long workspaceId,
        String workspaceName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        BigDecimal totalAmount,
        BookingStatus status,
        String note
) {
}
