package com.coworking.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import com.coworking.exception.BookingConflictException;
import com.coworking.factory.WorkspaceFactory;
import com.coworking.model.AddOn;
import com.coworking.model.MembershipTier;
import com.coworking.model.Role;
import com.coworking.model.User;
import com.coworking.model.Workspace;
import com.coworking.notification.InAppNotificationService;
import com.coworking.service.BookingService;
import com.coworking.strategy.PaymentStrategy;
import com.coworking.strategy.PostPaidStrategy;
import com.coworking.strategy.WalletPaymentStrategy;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.layout.StackPane;
import javafx.scene.control.TextField;
import javafx.scene.layout.FlowPane;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;

public class DashboardController {
    @FXML
    private FlowPane workspaceFlowPane;

    @FXML
    private TextField searchField;

    @FXML
    private StackPane mainContent;

    @FXML
    private void initialize() {
        WorkspaceFactory workspaceFactory = new WorkspaceFactory();
        allWorkspaces = List.of(
                workspaceFactory.create("HOT_DESK", 1L, "Hot Desk - A1", 8.0),
                workspaceFactory.create("HOT_DESK", 2L, "Hot Desk - B4", 9.0),
                workspaceFactory.create("MEETING_ROOM", 3L, "Meeting Room - Orion", 25.0),
                workspaceFactory.create("PRIVATE_OFFICE", 4L, "Private Office - P2", 30.0)
        );

        // Rebuild cards on search text changes.
        if (searchField != null) {
            searchField.textProperty().addListener((obs, oldText, newText) -> refreshCards(newText));
        }
        refreshCards(searchField != null ? searchField.getText() : "");

        // Keep a reference to the dashboard view so we can return to it.
        dashboardView = (mainContent != null && !mainContent.getChildren().isEmpty())
                ? (mainContent.getChildren().get(0) instanceof Parent p ? p : null)
                : null;
    }

    private List<Workspace> allWorkspaces;
    private Parent dashboardView;
    private final User currentUser = new User(1001L, "Demo Member", Role.MEMBER, MembershipTier.GOLD, 500.0);
    private final BookingService bookingService = new BookingService(new InAppNotificationService());

    private void refreshCards(String rawQuery) {
        workspaceFlowPane.getChildren().clear();

        String query = rawQuery == null ? "" : rawQuery.trim().toLowerCase();
        for (Workspace workspace : allWorkspaces) {
            if (query.isEmpty() || workspace.getName().toLowerCase().contains(query)) {
                addWorkspaceCard(workspace);
            }
        }
    }

    private void addWorkspaceCard(Workspace workspace) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/coworking/workspace_card.fxml"));
            Parent card = loader.load();

            WorkspaceCardController cardController = loader.getController();
            cardController.setWorkspace(workspace);
            cardController.setWorkspaceName(workspace.getName());
            cardController.setPriceText(String.format("$%.2f / hour", workspace.calculatePrice(1)));
            cardController.setOnBookNow(this::createBooking);

            workspaceFlowPane.getChildren().add(card);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to load workspace card FXML", e);
        }
    }

    private void createBooking(Workspace workspace) {
        LocalDateTime start = LocalDateTime.now().plusHours(1);
        LocalDateTime end = start.plusHours(3);
        List<AddOn> addOns = List.of(new AddOn("Coffee Service", 5.0));
        PaymentStrategy paymentStrategy = currentUser.getRole() == Role.MEMBER
                ? new WalletPaymentStrategy()
                : new PostPaidStrategy();
        try {
            bookingService.bookWorkspace(currentUser, workspace, start, end, addOns, paymentStrategy);
        } catch (BookingConflictException e) {
            Alert alert = new Alert(AlertType.WARNING);
            alert.setTitle("Booking Conflict");
            alert.setHeaderText(null);
            alert.setContentText(e.getMessage());
            alert.showAndWait();
        } catch (Exception e) {
            Alert alert = new Alert(AlertType.ERROR);
            alert.setTitle("Booking Error");
            alert.setHeaderText(null);
            alert.setContentText("Unable to complete booking: " + e.getMessage());
            alert.showAndWait();
        }
    }

    @FXML
    public void showDashboard() {
        if (mainContent == null || dashboardView == null) {
            return;
        }
        mainContent.getChildren().setAll(dashboardView);
    }

    @FXML
    public void showBookings() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/coworking/bookings.fxml"));
            Parent bookingsView = loader.load();
            mainContent.getChildren().setAll(bookingsView);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to load bookings FXML", e);
        }
    }
}
