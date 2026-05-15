import { apiFetch } from './api';
import type { Booking } from '../types/booking';
import type { PageResponse } from '../types/pagination';

interface BookingPayload {
  workspaceId: number;
  startTime: string;
  endTime: string;
  note?: string;
}

interface BackendBooking {
  id: number;
  workspaceId: number;
  workspaceName: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: 'PENDING' | 'SUCCESS' | 'CONFIRMED' | 'CANCELLED';
  note?: string | null;
}

export async function createBooking(payload: BookingPayload) {
  const booking = await apiFetch<BackendBooking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapBooking(booking);
}

export async function cancelBooking(id: string) {
  const booking = await apiFetch<BackendBooking>(`/bookings/${id}/cancel`, {
    method: 'PATCH',
  });

  return mapBooking(booking);
}

export async function getMyBookings(query: { page?: number; size?: number } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(query.page ?? 0));
  params.set('size', String(query.size ?? 10));
  params.set('sort', 'startTime,desc');

  const page = await apiFetch<PageResponse<BackendBooking>>(`/bookings/my?${params.toString()}`);
  return {
    ...page,
    content: page.content.map(mapBooking),
  };
}

function mapBooking(booking: BackendBooking): Booking {
  return {
    id: String(booking.id),
    workspaceId: booking.workspaceId,
    workspaceName: booking.workspaceName,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status === 'CANCELLED' ? 'cancelled' : booking.status === 'PENDING' ? 'pending' : 'confirmed',
    totalAmount: Number(booking.totalAmount),
    note: booking.note ?? undefined,
  };
}
