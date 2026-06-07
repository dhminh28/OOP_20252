package com.cospace.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmailServiceImplTest {

    @Mock
    private ObjectProvider<JavaMailSender> mailSenderProvider;

    @Mock
    private JavaMailSender mailSender;

    private EmailServiceImpl emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailServiceImpl(mailSenderProvider, "no-reply@cospace.vn");
    }

    @Test
    void sendBookingConfirmation_buildsMessageFromDetachedValues() {
        LocalDateTime startTime = LocalDateTime.of(2026, 6, 7, 9, 0);
        LocalDateTime endTime = LocalDateTime.of(2026, 6, 7, 12, 0);
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);

        emailService.sendBookingConfirmation(
                "member@cospace.vn",
                99L,
                "Meeting Room A",
                startTime,
                endTime,
                new BigDecimal("450000")
        );

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());
        SimpleMailMessage message = messageCaptor.getValue();

        assertThat(message.getFrom()).isEqualTo("no-reply@cospace.vn");
        assertThat(message.getTo()).containsExactly("member@cospace.vn");
        assertThat(message.getSubject()).isEqualTo("CoSpace booking confirmation #99");
        assertThat(message.getText())
                .contains("Workspace: Meeting Room A")
                .contains("Start: " + startTime)
                .contains("End: " + endTime)
                .contains("Total amount: 450000 VND");
    }
}
