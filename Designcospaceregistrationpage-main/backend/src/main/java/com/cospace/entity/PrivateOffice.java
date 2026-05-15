package com.cospace.entity;

import com.cospace.enums.WorkspaceType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.math.BigDecimal;

@Entity
@DiscriminatorValue("PRIVATE_OFFICE")
public class PrivateOffice extends Workspace {

    public PrivateOffice() {
        setType(WorkspaceType.PRIVATE_OFFICE);
    }

    @Override
    public BigDecimal calculatePrice(int hours) {
        int billableHours = Math.max(hours, 2);
        return getPricePerHour().multiply(BigDecimal.valueOf(billableHours));
    }
}
