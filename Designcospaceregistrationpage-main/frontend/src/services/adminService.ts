import { apiFetch } from './api';
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
