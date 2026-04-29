package com.coworking.model;

public class MeetingRoom extends Workspace {
    private boolean hasProjector;

    public MeetingRoom(long id, String name, double basePrice, boolean hasProjector) {
        super(id, name, basePrice);
        this.hasProjector = hasProjector;
    }

    public boolean hasProjector() {
        return hasProjector;
    }

    @Override
    public double calculatePrice(long hours) {
        return (basePrice * hours) + (hasProjector ? 20.0 : 0.0);
    }
}
