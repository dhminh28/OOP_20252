package com.cospace.controller;

import com.cospace.dto.response.ApiResponse;
import com.cospace.dto.response.NotificationResponse;
import com.cospace.dto.response.UnreadNotificationCountResponse;
import com.cospace.security.CurrentUser;
import com.cospace.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ApiResponse<Page<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ApiResponse.ok(
                notificationService.getMyNotifications(currentUser.id(), pageable)
        );
    }

    @GetMapping("/unread-count")
    public ApiResponse<UnreadNotificationCountResponse> getUnreadCount(
            @AuthenticationPrincipal CurrentUser currentUser
    ) {
        return ApiResponse.ok(
                new UnreadNotificationCountResponse(
                        notificationService.countUnread(currentUser.id())
                )
        );
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<NotificationResponse> markAsRead(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long id
    ) {
        return ApiResponse.ok(
                notificationService.markAsRead(currentUser.id(), id)
        );
    }

    @PatchMapping("/read-all")
    public ApiResponse<Integer> markAllAsRead(
            @AuthenticationPrincipal CurrentUser currentUser
    ) {
        return ApiResponse.ok(
                notificationService.markAllAsRead(currentUser.id())
        );
    }
}
