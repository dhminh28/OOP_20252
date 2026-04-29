package com.coworking.strategy;

import com.coworking.model.User;

public class WalletPaymentStrategy implements PaymentStrategy {
    @Override
    public void pay(User user, double amount) {
        user.debitWallet(amount);
    }

    @Override
    public String name() {
        return "WALLET";
    }
}

