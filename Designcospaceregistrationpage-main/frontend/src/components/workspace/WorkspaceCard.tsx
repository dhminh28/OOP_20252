import { MapPin, Monitor, Printer, Users, Wifi, Wind } from 'lucide-react';
import { WorkspaceTypeBadge } from '../common/Badge';
import { vnd } from '../../utils/formatCurrency';
import type { Workspace } from '../../types/workspace';

interface WorkspaceCardProps {
  space: Workspace;
  onBook?: () => void;
  onOpenDetail?: () => void;
}

const EQUIPMENT_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={10} />,
  Projector: <Monitor size={10} />,
  'Air conditioner': <Wind size={10} />,
  Printer: <Printer size={10} />,
};

const STATUS_CONFIG = {
  available: { color: '#10B981', label: 'Available' },
  busy: { color: '#EF4444', label: 'Busy' },
  maintenance: { color: '#9CA3AF', label: 'Maintenance' },
};

export function WorkspaceCard({ space, onBook, onOpenDetail }: WorkspaceCardProps) {
  const isDisabled = space.status === 'busy' || space.status === 'maintenance';
  const statusConfig = STATUS_CONFIG[space.status];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.15s',
        cursor: onOpenDetail ? 'pointer' : 'default',
      }}
      onClick={onOpenDetail}
      onMouseEnter={(event) => {
        if (!isDisabled) event.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ position: 'relative', height: '200px', backgroundColor: '#E5E7EB', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={space.image}
          alt={space.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: isDisabled ? 'grayscale(40%) brightness(0.9)' : 'none',
            transition: 'transform 0.2s',
          }}
        />
        <span style={{ position: 'absolute', top: '8px', left: '8px' }}>
          <WorkspaceTypeBadge type={space.type} />
        </span>
      </div>

      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <p style={{ fontSize: '16px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          {space.name}
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
          <MapPin size={12} style={{ color: '#9CA3AF', flexShrink: 0, marginTop: '1px' }} />
          <span
            style={{
              fontSize: '12px',
              color: '#6B7280',
              fontFamily: 'DM Sans, sans-serif',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {space.floor}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 }}>
            <Users size={13} style={{ color: '#9CA3AF', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
              {space.capacity} people
            </span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: isDisabled ? '#9CA3AF' : '#111111', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
            VND {vnd(space.pricePerHour)}/h
          </span>
        </div>

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', minHeight: '23px' }}>
          {space.equipment.map((equipment) => (
            <span
              key={equipment}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '3px 8px',
                backgroundColor: '#F3F4F6',
                borderRadius: '5px',
                fontSize: '11px',
                color: '#6B7280',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {EQUIPMENT_ICONS[equipment]}
              {equipment}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: statusConfig.color, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: statusConfig.color, fontWeight: '500', fontFamily: 'DM Sans, sans-serif' }}>
            {statusConfig.label}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <button
          disabled={isDisabled}
          style={{
            width: '100%',
            height: '38px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'DM Sans, sans-serif',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            border: isDisabled ? '1.5px solid #E5E7EB' : '1.5px solid #111111',
            backgroundColor: '#FFFFFF',
            color: isDisabled ? '#D1D5DB' : '#111111',
            transition: 'all 0.15s',
            marginTop: '4px',
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (!isDisabled) onBook?.();
          }}
          onMouseEnter={(event) => {
            if (!isDisabled) {
              event.currentTarget.style.backgroundColor = '#111111';
              event.currentTarget.style.color = '#FFFFFF';
            }
          }}
          onMouseLeave={(event) => {
            if (!isDisabled) {
              event.currentTarget.style.backgroundColor = '#FFFFFF';
              event.currentTarget.style.color = '#111111';
            }
          }}
        >
          {isDisabled ? statusConfig.label : 'Book now'}
        </button>
      </div>
    </div>
  );
}
