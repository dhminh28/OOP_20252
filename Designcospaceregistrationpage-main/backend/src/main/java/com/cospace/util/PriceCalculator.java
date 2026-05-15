package com.cospace.util;

import com.cospace.entity.Workspace;

import java.math.BigDecimal;

public final class PriceCalculator {

    private PriceCalculator() {
    }

    public static BigDecimal calculate(Workspace workspace, int hours) {
        return workspace.calculatePrice(hours);
    }
}
