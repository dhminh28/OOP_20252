package com.cospace.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WorkspaceMaintenanceResponse(
        Long workspaceId,
        String workspaceName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        int cancelledBookings,
        BigDecimal refundedAmount
) {
}
