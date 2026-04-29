package com.coworking.factory;

import com.coworking.model.HotDesk;
import com.coworking.model.MeetingRoom;
import com.coworking.model.PrivateOffice;
import com.coworking.model.Workspace;

public class WorkspaceFactory {
    public Workspace create(String type, long id, String name, double basePrice) {
        return switch (type.toUpperCase()) {
            case "HOT_DESK" -> new HotDesk(id, name, basePrice);
            case "MEETING_ROOM" -> new MeetingRoom(id, name, basePrice, true);
            case "PRIVATE_OFFICE" -> new PrivateOffice(id, name, basePrice, 4);
            default -> throw new IllegalArgumentException("Unsupported workspace type: " + type);
        };
    }
}

