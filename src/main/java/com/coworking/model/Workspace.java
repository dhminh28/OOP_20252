package com.coworking.model;

public abstract class Workspace {
    protected long id;
    protected String name;
    protected double basePrice;

    public Workspace(long id, String name, double basePrice) {
        this.id = id;
        this.name = name;
        this.basePrice = basePrice;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public abstract double calculatePrice(long hours);
}
