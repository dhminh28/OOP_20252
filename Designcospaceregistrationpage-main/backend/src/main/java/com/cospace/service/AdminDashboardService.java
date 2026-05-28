package com.cospace.service;

import com.cospace.dto.response.AdminBookingResponse;
import com.cospace.dto.response.AdminUserResponse;
import com.cospace.dto.response.DashboardSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminDashboardService {
    DashboardSummaryResponse getSummary();

    Page<AdminBookingResponse> getBookings(Pageable pageable);

    Page<AdminUserResponse> getUsers(Pageable pageable);
}
