package com.cospace.service;

import com.cospace.entity.Booking;

public interface EmailService {
    void sendBookingConfirmation(Booking booking);
}
