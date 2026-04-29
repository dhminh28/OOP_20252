package com.coworking.controller;

import com.coworking.model.Booking;
import com.coworking.model.BookingStore;

import javafx.fxml.FXML;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

public class BookingController {
    @FXML
    private TableView<Booking> bookingsTable;

    @FXML
    private TableColumn<Booking, String> workspaceNameColumn;

    @FXML
    private TableColumn<Booking, String> typeColumn;

    @FXML
    private TableColumn<Booking, String> priceColumn;

    @FXML
    private TableColumn<Booking, String> bookingTimeColumn;

    @FXML
    private void initialize() {
        workspaceNameColumn.setCellValueFactory(new PropertyValueFactory<>("workspaceName"));
        typeColumn.setCellValueFactory(new PropertyValueFactory<>("type"));
        priceColumn.setCellValueFactory(new PropertyValueFactory<>("priceText"));
        bookingTimeColumn.setCellValueFactory(new PropertyValueFactory<>("bookingTimeText"));

        bookingsTable.setItems(BookingStore.getInstance().getBookings());
    }
}

