package com.coworking.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Booking {
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final long workspaceId;
    private final String workspaceName;
    private final String type;
    private final double price;
    private final LocalDateTime bookingTime;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private final String memberName;
    private final BookingStatus status;

    public Booking(String workspaceName, String type, double price, LocalDateTime bookingTime) {
        this(0L, workspaceName, type, price, bookingTime, bookingTime, bookingTime.plusHours(3), "Guest", BookingStatus.CONFIRMED);
    }

    public Booking(long workspaceId, String workspaceName, String type, double price,
                   LocalDateTime bookingTime, LocalDateTime startTime, LocalDateTime endTime,
                   String memberName, BookingStatus status) {
        this.workspaceId = workspaceId;
        this.workspaceName = workspaceName;
        this.type = type;
        this.price = price;
        this.bookingTime = bookingTime;
        this.startTime = startTime;
        this.endTime = endTime;
        this.memberName = memberName;
        this.status = status;
    }

    public long getWorkspaceId() {
        return workspaceId;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public String getType() {
        return type;
    }

    public double getPrice() {
        return price;
    }

    public String getPriceText() {
        return String.format("$%.2f", price);
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public String getMemberName() {
        return memberName;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public String getBookingTimeText() {
        return bookingTime.format(TIME_FORMATTER);
    }
}

