package com.coworking.model;

public class PrivateOffice extends Workspace {
    private int capacity;

    public PrivateOffice(long id, String name, double basePrice, int capacity) {
        super(id, name, basePrice);
        this.capacity = capacity;
    }

    public int getCapacity() {
        return capacity;
    }

    @Override
    public double calculatePrice(long hours) {
        return basePrice * hours * 1.2;
    }
}
