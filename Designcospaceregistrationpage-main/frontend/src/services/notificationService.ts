import { apiFetch } from './api';
import type { PageResponse } from '../types/pagination';

export interface Notification {
  id: number;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export function getNotifications(page = 0, size = 10) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: 'createdAt,desc',
  });
  return apiFetch<PageResponse<Notification>>(`/notifications?${params.toString()}`);
}

export async function getUnreadNotificationCount() {
  const response = await apiFetch<{ unreadCount: number }>('/notifications/unread-count');
  return Number(response.unreadCount);
}

export function markNotificationAsRead(notificationId: number) {
  return apiFetch<Notification>(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
}

export function markAllNotificationsAsRead() {
  return apiFetch<number>('/notifications/read-all', {
    method: 'PATCH',
  });
}
