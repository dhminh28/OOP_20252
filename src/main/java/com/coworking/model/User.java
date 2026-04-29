package com.coworking.model;

public class User {
    private final long id;
    private final String fullName;
    private final Role role;
    private final MembershipTier membershipTier;
    private double walletBalance;

    public User(long id, String fullName, Role role, MembershipTier membershipTier, double walletBalance) {
        this.id = id;
        this.fullName = fullName;
        this.role = role;
        this.membershipTier = membershipTier;
        this.walletBalance = walletBalance;
    }

    public long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public Role getRole() {
        return role;
    }

    public MembershipTier getMembershipTier() {
        return membershipTier;
    }

    public double getWalletBalance() {
        return walletBalance;
    }

    public void debitWallet(double amount) {
        if (amount > walletBalance) {
            throw new IllegalStateException("Insufficient wallet balance.");
        }
        walletBalance -= amount;
    }
}

