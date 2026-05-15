package com.cospace.dto.response;

import com.cospace.enums.BookingStatus;

public record BookingStatusSummaryResponse(
        BookingStatus status,
        long count
) {
}
