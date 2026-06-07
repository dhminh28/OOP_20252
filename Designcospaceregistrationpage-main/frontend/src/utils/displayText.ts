import type { BookingStatus } from '../types/booking';
import type { WorkspaceStatus, WorkspaceType } from '../types/workspace';

const WORKSPACE_TYPE_LABELS: Record<WorkspaceType, string> = {
  'Hot Desk': 'Bàn làm việc chung',
  'Meeting Room': 'Phòng họp',
  'Private Office': 'Văn phòng riêng',
};

const WORKSPACE_STATUS_LABELS: Record<WorkspaceStatus, string> = {
  available: 'Còn trống',
  busy: 'Đang bận',
  maintenance: 'Đang bảo trì',
};

const BOOKING_STATUS_LABELS: Record<string, string> = {
  confirmed: 'Đã xác nhận',
  pending: 'Đang chờ',
  cancelled: 'Đã hủy',
  CONFIRMED: 'Đã xác nhận',
  PENDING: 'Đang chờ',
  CANCELLED: 'Đã hủy',
  SUCCESS: 'Thành công',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  WiFi: 'Wi-Fi',
  Projector: 'Máy chiếu',
  'Air conditioner': 'Điều hòa',
  Printer: 'Máy in',
  Whiteboard: 'Bảng trắng',
};

const EQUIPMENT_VALUES: Record<string, string> = Object.fromEntries(
  Object.entries(EQUIPMENT_LABELS).map(([value, label]) => [label.toLocaleLowerCase('vi-VN'), value]),
);

export function workspaceTypeLabel(type: WorkspaceType) {
  return WORKSPACE_TYPE_LABELS[type] ?? type;
}

export function workspaceStatusLabel(status: WorkspaceStatus) {
  return WORKSPACE_STATUS_LABELS[status] ?? status;
}

export function bookingStatusLabel(status: BookingStatus | string) {
  return BOOKING_STATUS_LABELS[status] ?? status;
}

export function equipmentLabel(equipment: string) {
  return EQUIPMENT_LABELS[equipment] ?? equipment;
}

export function equipmentValue(label: string) {
  return EQUIPMENT_VALUES[label.trim().toLocaleLowerCase('vi-VN')] ?? label.trim();
}

export function workspaceNameLabel(name: string) {
  return name
    .replace(/^Desk\b/i, 'Bàn làm việc')
    .replace(/^Meeting Room\b/i, 'Phòng họp')
    .replace(/^Private Office\b/i, 'Văn phòng riêng');
}

export function workspaceLocationLabel(location: string) {
  return location
    .replace(/^Tang\b/i, 'Tầng')
    .replace(/\bBMT Building\b/gi, 'Tòa nhà BMT')
    .replace(/\bLe Duan\b/gi, 'Lê Duẩn');
}

export function userRoleLabel(role: string) {
  return role.toUpperCase() === 'ADMIN' ? 'Quản trị viên' : 'Thành viên';
}

export function userNameLabel(name: string) {
  if (name === 'Demo Member') return 'Thành viên mẫu';
  if (name === 'Demo Admin') return 'Quản trị viên mẫu';
  return name;
}
