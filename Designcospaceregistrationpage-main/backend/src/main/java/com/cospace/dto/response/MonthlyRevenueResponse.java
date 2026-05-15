package com.cospace.dto.response;

import java.math.BigDecimal;

public record MonthlyRevenueResponse(
        String period,
        BigDecimal revenue
) {
}
