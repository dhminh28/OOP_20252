package com.cospace.controller;

import com.cospace.dto.response.ApiResponse;
import com.cospace.dto.response.DashboardSummaryResponse;
import com.cospace.service.AdminDashboardService;
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
}
