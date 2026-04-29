package com.coworking.notification;

import com.coworking.model.Booking;
import com.coworking.model.User;

public class InAppNotificationService implements NotificationService {
    @Override
    public void sendBookingConfirmation(User user, Booking booking) {
        // Demo-level implementation for assignment.
        System.out.println("[InApp] Booking confirmed for " + user.getFullName()
                + ": " + booking.getWorkspaceName() + " at " + booking.getBookingTimeText());
    }
}

