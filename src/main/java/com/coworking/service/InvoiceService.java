package com.coworking.service;

import com.coworking.model.AddOn;
import com.coworking.model.Invoice;
import com.coworking.model.User;
import com.coworking.model.Workspace;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

public class InvoiceService {
    public Invoice createInvoice(Workspace workspace, User user, LocalDateTime startTime, LocalDateTime endTime, List<AddOn> addOns) {
        long hours = Math.max(1, Duration.between(startTime, endTime).toHours());
        double baseAmount = workspace.calculatePrice(hours);
        double addOnAmount = addOns.stream().mapToDouble(AddOn::getFee).sum();
        double discount = (baseAmount + addOnAmount) * user.getMembershipTier().getDiscountRate();
        double total = Math.max(0.0, baseAmount + addOnAmount - discount);
        return new Invoice(baseAmount, addOnAmount, discount, total);
    }
}

