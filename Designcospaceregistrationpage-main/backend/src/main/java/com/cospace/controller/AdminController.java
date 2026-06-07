package com.cospace.controller;

import com.cospace.dto.request.AdminBookingCancelRequest;
import com.cospace.dto.request.AdminCreateUserRequest;
import com.cospace.dto.request.RechargeRejectRequest;
import com.cospace.dto.request.WorkspaceMaintenanceRequest;
import com.cospace.dto.response.ApiResponse;
import com.cospace.dto.response.AdminBookingResponse;
import com.cospace.dto.response.AdminUserResponse;
import com.cospace.dto.response.BookingResponse;
import com.cospace.dto.response.DashboardSummaryResponse;
import com.cospace.dto.response.RechargeRequestResponse;
import com.cospace.dto.response.WorkspaceMaintenanceResponse;
import com.cospace.enums.RechargeRequestStatus;
import com.cospace.service.AdminDashboardService;
import com.cospace.service.BookingService;
import com.cospace.service.WalletService;
import com.cospace.service.UserService;
import com.cospace.service.WorkspaceExcelService;
import com.cospace.service.WorkspaceMaintenanceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final WalletService walletService;
    private final BookingService bookingService;
    private final UserService userService;
    private final WorkspaceExcelService workspaceExcelService;
    private final WorkspaceMaintenanceService workspaceMaintenanceService;

    public AdminController(
            AdminDashboardService adminDashboardService,
            WalletService walletService,
            BookingService bookingService,
            UserService userService,
            WorkspaceExcelService workspaceExcelService,
            WorkspaceMaintenanceService workspaceMaintenanceService
    ) {
        this.adminDashboardService = adminDashboardService;
        this.walletService = walletService;
        this.bookingService = bookingService;
        this.userService = userService;
        this.workspaceExcelService = workspaceExcelService;
        this.workspaceMaintenanceService = workspaceMaintenanceService;
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

    @PostMapping("/users")
    public ApiResponse<AdminUserResponse> createUser(
            @Valid @RequestBody AdminCreateUserRequest request
    ) {
        return ApiResponse.ok(userService.createMember(request));
    }

    @PatchMapping("/users/{id}/block")
    public ApiResponse<AdminUserResponse> blockUser(@PathVariable Long id) {
        return ApiResponse.ok(userService.setBlocked(id, true));
    }

    @PatchMapping("/users/{id}/unblock")
    public ApiResponse<AdminUserResponse> unblockUser(@PathVariable Long id) {
        return ApiResponse.ok(userService.setBlocked(id, false));
    }

    @PostMapping(
            value = "/workspaces/import",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<Integer> importWorkspaces(
            @RequestPart("file") MultipartFile file
    ) {
        return ApiResponse.ok(workspaceExcelService.importWorkspaces(file));
    }

    @GetMapping("/workspaces/export")
    public ResponseEntity<byte[]> exportWorkspaces() {
        String filename = "cospace-workspaces-" + LocalDate.now() + ".xlsx";
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\""
                )
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ))
                .body(workspaceExcelService.exportWorkspaces());
    }

    @PostMapping("/workspaces/{id}/maintenance")
    public ApiResponse<WorkspaceMaintenanceResponse> scheduleMaintenance(
            @PathVariable Long id,
            @Valid @RequestBody WorkspaceMaintenanceRequest request
    ) {
        return ApiResponse.ok(
                workspaceMaintenanceService.scheduleMaintenance(id, request)
        );
    }

    @GetMapping("/recharge-requests")
    public ApiResponse<Page<RechargeRequestResponse>> getRechargeRequests(
            @RequestParam(defaultValue = "PENDING") RechargeRequestStatus status,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ApiResponse.ok(walletService.getRechargeRequests(status, pageable));
    }

    @PatchMapping("/recharge-requests/{id}/approve")
    public ApiResponse<RechargeRequestResponse> approveRecharge(
            @PathVariable Long id
    ) {
        return ApiResponse.ok(walletService.approveRecharge(id));
    }

    @PatchMapping("/recharge-requests/{id}/reject")
    public ApiResponse<RechargeRequestResponse> rejectRecharge(
            @PathVariable Long id,
            @Valid @RequestBody RechargeRejectRequest request
    ) {
        return ApiResponse.ok(walletService.rejectRecharge(id, request.reason()));
    }

    @PatchMapping("/bookings/{id}/cancel-by-admin")
    public ApiResponse<BookingResponse> cancelBookingByAdmin(
            @PathVariable Long id,
            @Valid @RequestBody AdminBookingCancelRequest request
    ) {
        return ApiResponse.ok(
                bookingService.cancelByAdmin(id, request.reason())
        );
    }
}
