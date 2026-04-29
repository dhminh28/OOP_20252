package com.coworking.model;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

public class BookingStore {
    private static final BookingStore INSTANCE = new BookingStore();

    private final ObservableList<Booking> bookings = FXCollections.observableArrayList();

    private BookingStore() {
    }

    public static BookingStore getInstance() {
        return INSTANCE;
    }

    public ObservableList<Booking> getBookings() {
        return bookings;
    }

    public void addBooking(Booking booking) {
        bookings.add(booking);
    }
}

