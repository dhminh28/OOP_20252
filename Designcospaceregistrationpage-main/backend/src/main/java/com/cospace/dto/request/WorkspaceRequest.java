package com.cospace.dto.request;

import com.cospace.enums.WorkspaceStatus;
import com.cospace.enums.WorkspaceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public record WorkspaceRequest(
        @NotBlank String name,
        @NotNull WorkspaceType type,
        @NotBlank String address,
        String floor,
        @Positive Integer capacity,
        @NotNull BigDecimal pricePerHour,
        WorkspaceStatus status,
        String imageUrl,
        List<String> equipment
) {
}
