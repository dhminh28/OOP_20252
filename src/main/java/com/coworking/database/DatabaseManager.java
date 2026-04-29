package com.coworking.database;

import com.coworking.model.Booking;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

public class DatabaseManager {

    private static volatile DatabaseManager instance;

    private final String jdbcUrl;
    private final String username;
    private final String password;

    private DatabaseManager() {
        this.jdbcUrl = "jdbc:postgresql://localhost:5432/coworking_db";
        this.username = "postgres";
        this.password = "admin";
    }

    public static DatabaseManager getInstance() {
        if (instance == null) {
            synchronized (DatabaseManager.class) {
                if (instance == null) {
                    instance = new DatabaseManager();
                }
            }
        }
        return instance;
    }

    public void saveBooking(Booking booking) throws SQLException {
        String sql = """
                INSERT INTO bookings (workspace_name, workspace_type, total_price, booking_date)
                VALUES (?, ?, ?, ?)
                """;

        try (Connection connection = getConnection();
             PreparedStatement ps = connection.prepareStatement(sql)) {

            ps.setString(1, booking.getWorkspaceName());
            ps.setString(2, booking.getType());
            ps.setDouble(3, booking.getPrice());

            LocalDateTime bookingTime = booking.getBookingTime();
            ps.setTimestamp(4, bookingTime != null ? Timestamp.valueOf(bookingTime) : null);

            ps.executeUpdate();
        }
    }

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(jdbcUrl, username, password);
    }
}

