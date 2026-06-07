package com.cospace.service;

import com.cospace.dto.response.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    NotificationResponse sendNotification(Long userId, String title, String content);

    Page<NotificationResponse> getMyNotifications(Long userId, Pageable pageable);

    NotificationResponse markAsRead(Long userId, Long notificationId);

    int markAllAsRead(Long userId);

    long countUnread(Long userId);
}
