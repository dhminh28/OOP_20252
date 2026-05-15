package com.cospace.entity;

import com.cospace.enums.WorkspaceType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.math.BigDecimal;

@Entity
@DiscriminatorValue("HOT_DESK")
public class HotDesk extends Workspace {

    public HotDesk() {
        setType(WorkspaceType.HOT_DESK);
    }

    @Override
    public BigDecimal calculatePrice(int hours) {
        return getPricePerHour().multiply(BigDecimal.valueOf(hours));
    }
}
