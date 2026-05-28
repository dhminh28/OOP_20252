export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface BookingHistoryItem {
  id: string;
  room: string;
  addr: string;
  time: string;
  dur: string;
  amt: string;
  status: BookingStatus;
}

export interface Booking {
  id: string;
  workspaceId: number;
  workspaceName?: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalAmount: number;
  note?: string;
}
