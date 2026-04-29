package com.coworking.controller;

import com.coworking.model.Workspace;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

import java.util.function.Consumer;

public class WorkspaceCardController {
    private Workspace workspace;
    private Consumer<Workspace> onBookNow;

    @FXML
    private ImageView typeIconImageView;

    @FXML
    private Label nameLabel;

    @FXML
    private Label priceLabel;

    @FXML
    private Button bookNowButton;

    @FXML
    private void initialize() {
        // Wire the button in code so the card can load without any onAction handlers in FXML.
        bookNowButton.setOnAction(event -> {
            if (workspace == null) {
                return;
            }

            double total = workspace.calculatePrice(3);
            String message = "You have booked " + workspace.getName()
                    + ". Total price for 3 hours is: " + String.format("%.2f", total);

            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle("Booking Confirmed");
            alert.setHeaderText(null);
            alert.setContentText(message);
            alert.showAndWait();

            if (onBookNow != null) {
                onBookNow.accept(workspace);
            }

            // After confirmation, lock the card to prevent repeated bookings.
            bookNowButton.setText("Occupied");
            bookNowButton.setDisable(true);
            bookNowButton.setStyle(
                    "-fx-background-color: #b0b0b0; " +
                    "-fx-background-radius: 10; " +
                    "-fx-text-fill: white; "
            );
        });
    }

    public void setWorkspace(Workspace workspace) {
        this.workspace = workspace;
    }

    public void setOnBookNow(Consumer<Workspace> onBookNow) {
        this.onBookNow = onBookNow;
    }

    public void setWorkspaceName(String workspaceName) {
        nameLabel.setText(workspaceName);
    }

    public void setPriceText(String priceText) {
        priceLabel.setText(priceText);
    }

    public void setTypeIcon(Image iconImage) {
        typeIconImageView.setImage(iconImage);
    }

    public Button getBookNowButton() {
        return bookNowButton;
    }
}
