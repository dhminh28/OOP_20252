package com.cospace.dto.response;

import com.cospace.enums.WorkspaceStatus;
import com.cospace.enums.WorkspaceType;

import java.math.BigDecimal;
import java.util.List;

public record WorkspaceResponse(
        Long id,
        String name,
        WorkspaceType type,
        String address,
        String floor,
        Integer capacity,
        BigDecimal pricePerHour,
        WorkspaceStatus status,
        String imageUrl,
        List<String> equipment
) {
}
