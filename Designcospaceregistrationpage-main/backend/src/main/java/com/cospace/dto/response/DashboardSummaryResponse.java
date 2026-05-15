package com.cospace.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummaryResponse(
        BigDecimal revenue,
        long totalBookings,
        long activeMembers,
        double occupancyRate,
        List<MonthlyRevenueResponse> monthlyRevenue,
        List<BookingStatusSummaryResponse> bookingStatusSummary
) {
}
