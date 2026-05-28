package com.cospace.dto.response;

import java.math.BigDecimal;

public record MonthlyRevenueResponse(
        String period,
        BigDecimal revenue
) {
    public MonthlyRevenueResponse(Object period, Number revenue) {
        this(String.valueOf(period), toBigDecimal(revenue));
    }

    private static BigDecimal toBigDecimal(Number value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal;
        }
        return BigDecimal.valueOf(value.doubleValue());
    }
}
