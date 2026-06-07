package com.cospace.service.impl;

import com.cospace.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final String fromAddress;

    public EmailServiceImpl(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${app.mail.from:no-reply@cospace.local}") String fromAddress
    ) {
        this.mailSenderProvider = mailSenderProvider;
        this.fromAddress = fromAddress;
    }

    @Override
    @Async
    public void sendBookingConfirmation(
            String email,
            Long bookingId,
            String workspaceName,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BigDecimal totalAmount
    ) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            LOGGER.warn("Mail sender is not configured; skipped booking confirmation email for booking {}", bookingId);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(email);
            message.setSubject("CoSpace booking confirmation #" + bookingId);
            message.setText("""
                    Your CoSpace booking has been confirmed.

                    Workspace: %s
                    Start: %s
                    End: %s
                    Total amount: %s VND

                    Thank you for using CoSpace.
                    """.formatted(
                    workspaceName,
                    startTime,
                    endTime,
                    totalAmount
            ));
            mailSender.send(message);
        } catch (RuntimeException exception) {
            LOGGER.warn("Failed to send booking confirmation email for booking {}", bookingId, exception);
        }
    }
}
