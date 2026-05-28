package com.cospace.dto.response;

import com.cospace.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminBookingResponse(
        Long id,
        Long memberId,
        String memberName,
        String memberEmail,
        Long workspaceId,
        String workspaceName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        BigDecimal totalAmount,
        BookingStatus status,
        String note
) {
}
