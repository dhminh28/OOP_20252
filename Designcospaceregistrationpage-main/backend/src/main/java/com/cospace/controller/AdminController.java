package com.cospace.controller;

import com.cospace.dto.response.ApiResponse;
import com.cospace.dto.response.AdminBookingResponse;
import com.cospace.dto.response.AdminUserResponse;
import com.cospace.dto.response.DashboardSummaryResponse;
import com.cospace.service.AdminDashboardService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminDashboardService adminDashboardService;

    public AdminController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/dashboard")
    public ApiResponse<DashboardSummaryResponse> getDashboard() {
        return ApiResponse.ok(adminDashboardService.getSummary());
    }

    @GetMapping("/bookings")
    public ApiResponse<Page<AdminBookingResponse>> getBookings(
            @PageableDefault(size = 10, sort = "startTime") Pageable pageable
    ) {
        return ApiResponse.ok(adminDashboardService.getBookings(pageable));
    }

    @GetMapping("/users")
    public ApiResponse<Page<AdminUserResponse>> getUsers(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ApiResponse.ok(adminDashboardService.getUsers(pageable));
    }
}
