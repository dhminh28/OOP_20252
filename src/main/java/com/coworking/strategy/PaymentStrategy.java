package com.coworking.strategy;

import com.coworking.model.User;

public interface PaymentStrategy {
    void pay(User user, double amount);
    String name();
}

