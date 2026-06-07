package com.cospace.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface EmailService {
    void sendBookingConfirmation(
            String email,
            Long bookingId,
            String workspaceName,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BigDecimal totalAmount
    );
}
