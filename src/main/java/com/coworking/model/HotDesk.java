package com.coworking.model;

public class HotDesk extends Workspace {

    public HotDesk(long id, String name, double basePrice) {
        super(id, name, basePrice);
    }

    @Override
    public double calculatePrice(long hours) {
        return basePrice * hours;
    }
}
