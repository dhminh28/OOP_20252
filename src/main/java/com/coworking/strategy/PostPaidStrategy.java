package com.coworking.strategy;

import com.coworking.model.User;

public class PostPaidStrategy implements PaymentStrategy {
    @Override
    public void pay(User user, double amount) {
        // Post-paid flow: amount will be reconciled later.
    }

    @Override
    public String name() {
        return "POSTPAID";
    }
}

