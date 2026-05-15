import type { BookingStatus } from '../../types/booking';
import type { WorkspaceType } from '../../types/workspace';

interface BadgeProps {
  label: string;
  backgroundColor: string;
  color: string;
  rounded?: string;
}

export function Badge({ label, backgroundColor, color, rounded = '12px' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 9px',
        borderRadius: rounded,
        fontSize: '11.5px',
        fontWeight: '500',
        backgroundColor,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

const BOOKING_STATUS_MAP: Record<BookingStatus, BadgeProps> = {
  confirmed: { label: 'Confirmed', backgroundColor: '#D1FAE5', color: '#065F46' },
  pending: { label: 'Pending', backgroundColor: '#FEF3C7', color: '#92400E' },
  cancelled: { label: 'Cancelled', backgroundColor: '#FEE2E2', color: '#991B1B' },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge {...BOOKING_STATUS_MAP[status]} />;
}

const WORKSPACE_TYPE_MAP: Record<WorkspaceType, BadgeProps> = {
  'Hot Desk': { label: 'Hot Desk', backgroundColor: '#3B82F6', color: '#FFFFFF', rounded: '6px' },
  'Meeting Room': { label: 'Meeting Room', backgroundColor: '#7C3AED', color: '#FFFFFF', rounded: '6px' },
  'Private Office': { label: 'Private Office', backgroundColor: '#D97706', color: '#FFFFFF', rounded: '6px' },
};

export function WorkspaceTypeBadge({ type }: { type: WorkspaceType }) {
  return <Badge {...WORKSPACE_TYPE_MAP[type]} />;
}
