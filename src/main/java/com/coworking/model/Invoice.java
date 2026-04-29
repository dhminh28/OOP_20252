package com.coworking.model;

public class Invoice {
    private final double baseAmount;
    private final double addOnAmount;
    private final double membershipDiscount;
    private final double totalAmount;

    public Invoice(double baseAmount, double addOnAmount, double membershipDiscount, double totalAmount) {
        this.baseAmount = baseAmount;
        this.addOnAmount = addOnAmount;
        this.membershipDiscount = membershipDiscount;
        this.totalAmount = totalAmount;
    }

    public double getBaseAmount() {
        return baseAmount;
    }

    public double getAddOnAmount() {
        return addOnAmount;
    }

    public double getMembershipDiscount() {
        return membershipDiscount;
    }

    public double getTotalAmount() {
        return totalAmount;
    }
}

