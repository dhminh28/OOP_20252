import { apiFetch, apiFetchBlob } from './api';
import type { PageResponse } from '../types/pagination';

export interface MonthlyRevenue {
  period: string;
  revenue: number;
}

export interface BookingStatusSummary {
  status: 'PENDING' | 'SUCCESS' | 'CONFIRMED' | 'CANCELLED';
  count: number;
}

export interface DashboardSummary {
  revenue: number;
  totalBookings: number;
  activeMembers: number;
  occupancyRate: number;
  monthlyRevenue: MonthlyRevenue[];
  bookingStatusSummary: BookingStatusSummary[];
}

export interface AdminBooking {
  id: number;
  memberId: number;
  memberName: string;
  memberEmail: string;
  workspaceId: number;
  workspaceName: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: 'PENDING' | 'SUCCESS' | 'CONFIRMED' | 'CANCELLED';
  note?: string | null;
}

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  role: 'MEMBER' | 'ADMIN';
  createdAt: string;
  blocked: boolean;
  avatar?: string | null;
}

export interface WorkspaceMaintenanceResult {
  workspaceId: number;
  workspaceName: string;
  startTime: string;
  endTime: string;
  cancelledBookings: number;
  refundedAmount: number;
}

export type RechargeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminRechargeRequest {
  id: number;
  memberId: number;
  memberName: string;
  memberEmail: string;
  amount: number;
  status: RechargeRequestStatus;
  createdAt: string;
  updatedAt?: string | null;
  note?: string | null;
}

interface BackendDashboardSummary {
  revenue: number;
  totalBookings: number;
  activeMembers: number;
  occupancyRate: number;
  monthlyRevenue?: MonthlyRevenue[];
  bookingStatusSummary?: BookingStatusSummary[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const summary = await apiFetch<BackendDashboardSummary>('/admin/dashboard');

  return {
    revenue: Number(summary.revenue),
    totalBookings: Number(summary.totalBookings),
    activeMembers: Number(summary.activeMembers),
    occupancyRate: Number(summary.occupancyRate),
    monthlyRevenue: (summary.monthlyRevenue ?? []).map((item) => ({
      period: item.period,
      revenue: Number(item.revenue),
    })),
    bookingStatusSummary: (summary.bookingStatusSummary ?? []).map((item) => ({
      status: item.status,
      count: Number(item.count),
    })),
  };
}

export async function getAdminBookings(query: { page?: number; size?: number } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(query.page ?? 0));
  params.set('size', String(query.size ?? 10));
  params.set('sort', 'startTime,desc');

  const page = await apiFetch<PageResponse<AdminBooking>>(`/admin/bookings?${params.toString()}`);
  return {
    ...page,
    content: page.content.map((booking) => ({
      ...booking,
      totalAmount: Number(booking.totalAmount),
    })),
  };
}

export async function getAdminUsers(query: { page?: number; size?: number } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(query.page ?? 0));
  params.set('size', String(query.size ?? 10));
  params.set('sort', 'createdAt,desc');

  return apiFetch<PageResponse<AdminUser>>(`/admin/users?${params.toString()}`);
}

export async function getRechargeRequests(query: { page?: number; size?: number } = {}) {
  const params = new URLSearchParams();
  params.set('status', 'PENDING');
  params.set('page', String(query.page ?? 0));
  params.set('size', String(query.size ?? 10));
  params.set('sort', 'createdAt,asc');

  const page = await apiFetch<PageResponse<AdminRechargeRequest>>(
    `/admin/recharge-requests?${params.toString()}`,
  );
  return {
    ...page,
    content: page.content.map((request) => ({
      ...request,
      amount: Number(request.amount),
    })),
  };
}

export function approveRechargeRequest(requestId: number) {
  return apiFetch<AdminRechargeRequest>(
    `/admin/recharge-requests/${requestId}/approve`,
    { method: 'PATCH' },
  );
}

export function rejectRechargeRequest(requestId: number, reason: string) {
  return apiFetch<AdminRechargeRequest>(
    `/admin/recharge-requests/${requestId}/reject`,
    {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    },
  );
}

export function cancelBookingByAdmin(bookingId: number, reason: string) {
  return apiFetch<AdminBooking>(`/admin/bookings/${bookingId}/cancel-by-admin`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

export function createAdminMember(payload: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}) {
  return apiFetch<AdminUser>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function setAdminUserBlocked(userId: number, blocked: boolean) {
  return apiFetch<AdminUser>(
    `/admin/users/${userId}/${blocked ? 'block' : 'unblock'}`,
    { method: 'PATCH' },
  );
}

export function importWorkspaceExcel(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<number>('/admin/workspaces/import', {
    method: 'POST',
    body: formData,
  });
}

export async function exportWorkspaceExcel() {
  const blob = await apiFetchBlob('/admin/workspaces/export');
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `cospace-workspaces-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function scheduleWorkspaceMaintenance(
  workspaceId: number,
  payload: { startTime: string; endTime: string; reason: string },
) {
  return apiFetch<WorkspaceMaintenanceResult>(
    `/admin/workspaces/${workspaceId}/maintenance`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}
