import { apiFetch } from './api';

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
