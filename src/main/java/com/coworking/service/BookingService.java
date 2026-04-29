package com.coworking.service;

import com.coworking.database.DatabaseManager;
import com.coworking.exception.BookingConflictException;
import com.coworking.model.AddOn;
import com.coworking.model.Booking;
import com.coworking.model.BookingStatus;
import com.coworking.model.BookingStore;
import com.coworking.model.Invoice;
import com.coworking.model.Role;
import com.coworking.model.User;
import com.coworking.model.Workspace;
import com.coworking.notification.NotificationService;
import com.coworking.security.AuthorizationService;
import com.coworking.strategy.PaymentStrategy;

import java.time.LocalDateTime;
import java.util.List;

public class BookingService {
    private final AuthorizationService authorizationService = new AuthorizationService();
    private final InvoiceService invoiceService = new InvoiceService();
    private final NotificationService notificationService;

    public BookingService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public Booking bookWorkspace(User user, Workspace workspace, LocalDateTime startTime, LocalDateTime endTime,
                                 List<AddOn> addOns, PaymentStrategy paymentStrategy) {
        authorizationService.requireAnyRole(user, Role.ADMIN, Role.STAFF, Role.MEMBER);
        validateConflict(workspace, startTime, endTime);

        Invoice invoice = invoiceService.createInvoice(workspace, user, startTime, endTime, addOns);
        paymentStrategy.pay(user, invoice.getTotalAmount());

        String type = readableType(workspace);
        Booking booking = new Booking(
                workspace.getId(),
                workspace.getName(),
                type,
                invoice.getTotalAmount(),
                LocalDateTime.now(),
                startTime,
                endTime,
                user.getFullName(),
                BookingStatus.CONFIRMED
        );

        BookingStore.getInstance().addBooking(booking);
        try {
            DatabaseManager.getInstance().saveBooking(booking);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to persist booking: " + e.getMessage(), e);
        }

        notificationService.sendBookingConfirmation(user, booking);
        return booking;
    }

    private void validateConflict(Workspace workspace, LocalDateTime startTime, LocalDateTime endTime) {
        boolean hasConflict = BookingStore.getInstance().getBookings().stream()
                .filter(b -> b.getWorkspaceId() == workspace.getId() || b.getWorkspaceName().equals(workspace.getName()))
                .anyMatch(existing -> startTime.isBefore(existing.getEndTime()) && endTime.isAfter(existing.getStartTime()));
        if (hasConflict) {
            throw new BookingConflictException("Selected time slot conflicts with an existing booking.");
        }
    }

    private String readableType(Workspace workspace) {
        return switch (workspace.getClass().getSimpleName()) {
            case "HotDesk" -> "Hot Desk";
            case "MeetingRoom" -> "Meeting Room";
            case "PrivateOffice" -> "Private Office";
            default -> workspace.getClass().getSimpleName();
        };
    }
}

