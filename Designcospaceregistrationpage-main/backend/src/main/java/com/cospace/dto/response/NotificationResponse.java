package com.cospace.dto.response;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String content,
        boolean read,
        LocalDateTime createdAt
) {
}
