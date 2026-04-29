package com.coworking.notification;

import com.coworking.model.Booking;
import com.coworking.model.User;

public interface NotificationService {
    void sendBookingConfirmation(User user, Booking booking);
}

