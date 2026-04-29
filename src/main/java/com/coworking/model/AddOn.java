package com.coworking.model;

public class AddOn {
    private final String name;
    private final double fee;

    public AddOn(String name, double fee) {
        this.name = name;
        this.fee = fee;
    }

    public String getName() {
        return name;
    }

    public double getFee() {
        return fee;
    }
}

