package com.cospace.entity;

import com.cospace.enums.WorkspaceType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.math.BigDecimal;

@Entity
@DiscriminatorValue("MEETING_ROOM")
public class MeetingRoom extends Workspace {

    public MeetingRoom() {
        setType(WorkspaceType.MEETING_ROOM);
    }

    @Override
    public BigDecimal calculatePrice(int hours) {
        BigDecimal total = getPricePerHour().multiply(BigDecimal.valueOf(hours));
        if (hours >= 4) {
            return total.multiply(BigDecimal.valueOf(0.9));
        }
        return total;
    }
}
