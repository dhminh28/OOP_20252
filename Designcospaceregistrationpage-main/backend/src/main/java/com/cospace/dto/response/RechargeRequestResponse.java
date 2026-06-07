package com.cospace.dto.response;

import com.cospace.enums.RechargeRequestStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RechargeRequestResponse(
        Long id,
        Long memberId,
        String memberName,
        String memberEmail,
        BigDecimal amount,
        RechargeRequestStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String note
) {
}
