package com.coworking.model;

public enum MembershipTier {
    STANDARD(0.0),
    SILVER(0.05),
    GOLD(0.10),
    PLATINUM(0.15);

    private final double discountRate;

    MembershipTier(double discountRate) {
        this.discountRate = discountRate;
    }

    public double getDiscountRate() {
        return discountRate;
    }
}

