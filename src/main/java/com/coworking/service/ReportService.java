package com.coworking.service;

import com.coworking.model.Booking;
import com.coworking.model.BookingStore;

import java.util.Map;
import java.util.stream.Collectors;

public class ReportService {
    public double totalRevenue() {
        return BookingStore.getInstance().getBookings().stream()
                .mapToDouble(Booking::getPrice)
                .sum();
    }

    public Map<String, Long> usageFrequencyByWorkspaceType() {
        return BookingStore.getInstance().getBookings().stream()
                .collect(Collectors.groupingBy(Booking::getType, Collectors.counting()));
    }
}

