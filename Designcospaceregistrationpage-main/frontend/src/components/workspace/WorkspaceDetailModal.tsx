import { MapPin, Monitor, Printer, Users, Wifi, Wind, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { WorkspaceTypeBadge } from '../common/Badge';
import { vnd } from '../../utils/formatCurrency';
import type { Workspace } from '../../types/workspace';

interface WorkspaceDetailModalProps {
  space: Workspace;
  onClose: () => void;
  onBook?: () => void;
}

const EQUIPMENT_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={13} />,
  'Máy chiếu': <Monitor size={13} />,
  'Điều hòa': <Wind size={13} />,
  'In ấn': <Printer size={13} />,
};

const STATUS_CONFIG = {
  available: { color: '#10B981', label: 'Còn trống' },
  busy: { color: '#EF4444', label: 'Đang bận' },
  maintenance: { color: '#9CA3AF', label: 'Bảo trì' },
};

export function WorkspaceDetailModal({ space, onClose, onBook }: WorkspaceDetailModalProps) {
  const isDisabled = space.status === 'busy' || space.status === 'maintenance';
  const statusConfig = STATUS_CONFIG[space.status];

  return (
    <Modal onClose={onClose} width="560px">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111111', margin: 0 }}>{space.name}</h2>
            <WorkspaceTypeBadge type={space.type} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusConfig.color }} />
            <span style={{ fontSize: '13px', color: statusConfig.color, fontWeight: '600' }}>{statusConfig.label}</span>
          </div>
        </div>
        <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ height: '240px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#E5E7EB', marginBottom: '16px' }}>
        <img src={space.image} alt={space.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
          <MapPin size={15} style={{ color: '#9CA3AF', marginTop: '2px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>{space.floor}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Users size={15} style={{ color: '#9CA3AF' }} />
          <span style={{ fontSize: '13px', color: '#6B7280' }}>Sức chứa: {space.capacity} người</span>
        </div>
      </div>

      <div style={{ marginBottom: '18px' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Thiết bị có sẵn</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {space.equipment.map((equipment) => (
            <span
              key={equipment}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '7px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                fontSize: '13px',
              }}
            >
              {EQUIPMENT_ICONS[equipment]}
              {equipment}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '3px' }}>Giá thuê</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#111111' }}>₫ {vnd(space.pricePerHour)}/giờ</p>
        </div>
        <button
          disabled={isDisabled}
          onClick={() => {
            if (!isDisabled) onBook?.();
          }}
          style={{
            height: '42px',
            padding: '0 22px',
            borderRadius: '8px',
            backgroundColor: isDisabled ? '#F3F4F6' : '#111111',
            color: isDisabled ? '#9CA3AF' : '#FFFFFF',
            border: 'none',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {isDisabled ? statusConfig.label : 'Đặt ngay'}
        </button>
      </div>
    </Modal>
  );
}
