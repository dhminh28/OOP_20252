import { useState } from 'react';
import { Search, MapPin, Users, Wifi, Monitor, Wind, Printer } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

type SpaceType = 'Hot Desk' | 'Meeting Room' | 'Private Office';
type SpaceStatus = 'available' | 'busy' | 'maintenance';

interface Space {
  id: number;
  name: string;
  type: SpaceType;
  floor: string;
  capacity: number;
  pricePerHour: number;
  status: SpaceStatus;
  equipment: string[];
  image: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const SPACES: Space[] = [
  {
    id: 1,
    name: 'Desk 101',
    type: 'Hot Desk',
    floor: 'Tầng 2, Tòa nhà BMT, 32 Lê Duẩn, Q.Hai Bà Trưng, HN',
    capacity: 1,
    pricePerHour: 50_000,
    status: 'available',
    equipment: ['WiFi', 'Điều hòa'],
    image: 'https://images.unsplash.com/photo-1765366417033-5d74f04ca77a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  },
  {
    id: 2,
    name: 'Desk 102',
    type: 'Hot Desk',
    floor: 'Tầng 2, Tòa nhà BMT, 32 Lê Duẩn, Q.Hai Bà Trưng, HN',
    capacity: 1,
    pricePerHour: 50_000,
    status: 'busy',
    equipment: ['WiFi', 'Điều hòa'],
    image: 'https://images.unsplash.com/photo-1632923943930-d2f53d09313a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  },
  {
    id: 3,
    name: 'Phòng họp A',
    type: 'Meeting Room',
    floor: 'Tầng 3, Tòa nhà BMT, 32 Lê Duẩn, Q.Hai Bà Trưng, HN',
    capacity: 8,
    pricePerHour: 150_000,
    status: 'available',
    equipment: ['WiFi', 'Máy chiếu', 'Điều hòa'],
    image: 'https://images.unsplash.com/photo-1687945727613-a4d06cc41024?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  },
  {
    id: 4,
    name: 'Phòng họp B',
    type: 'Meeting Room',
    floor: 'Tầng 3, Tòa nhà BMT, 32 Lê Duẩn, Q.Hai Bà Trưng, HN',
    capacity: 6,
    pricePerHour: 120_000,
    status: 'busy',
    equipment: ['WiFi', 'Máy chiếu', 'Điều hòa'],
    image: 'https://images.unsplash.com/photo-1766802981801-4b4a9a1d8f1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  },
  {
    id: 5,
    name: 'VP Riêng 01',
    type: 'Private Office',
    floor: 'Tầng 4, Tòa nhà BMT, 32 Lê Duẩn, Q.Hai Bà Trưng, HN',
    capacity: 4,
    pricePerHour: 200_000,
    status: 'available',
    equipment: ['WiFi', 'Máy chiếu', 'Điều hòa', 'In ấn'],
    image: 'https://images.unsplash.com/photo-1746021451691-4385f318ec13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  },
  {
    id: 6,
    name: 'VP Riêng 02',
    type: 'Private Office',
    floor: 'Tầng 4, Tòa nhà BMT, 32 Lê Duẩn, Q.Hai Bà Trưng, HN',
    capacity: 4,
    pricePerHour: 200_000,
    status: 'maintenance',
    equipment: ['WiFi', 'Máy chiếu', 'Điều hòa', 'In ấn'],
    image: 'https://images.unsplash.com/photo-1771147372799-d94991e92ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function vnd(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const TYPE_COLORS: Record<SpaceType, string> = {
  'Hot Desk': '#3B82F6',
  'Meeting Room': '#7C3AED',
  'Private Office': '#D97706',
};

const EQUIPMENT_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={10} />,
  'Máy chiếu': <Monitor size={10} />,
  'Điều hòa': <Wind size={10} />,
  'In ấn': <Printer size={10} />,
};

// ── Space Card ────────────────────────────────────────────────────────────────

function SpaceCard({ space, onBook }: { space: Space; onBook?: () => void }) {
  const isDisabled = space.status === 'busy' || space.status === 'maintenance';

  const statusConfig = {
    available: { color: '#10B981', label: 'Còn trống' },
    busy: { color: '#EF4444', label: 'Đang bận' },
    maintenance: { color: '#9CA3AF', label: 'Bảo trì' },
  }[space.status];

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
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Photo area */}
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
        {/* Type badge */}
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: TYPE_COLORS[space.type],
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '600',
            padding: '4px 10px',
            borderRadius: '6px',
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '0.1px',
          }}
        >
          {space.type}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {/* Name */}
        <p
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#111111',
            fontFamily: 'DM Sans, sans-serif',
            margin: 0,
          }}
        >
          {space.name}
        </p>

        {/* Location */}
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

        {/* Capacity + Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={13} style={{ color: '#9CA3AF' }} />
            <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
              Sức chứa: {space.capacity} người
            </span>
          </div>
          <span
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: isDisabled ? '#9CA3AF' : '#111111',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            ₫ {vnd(space.pricePerHour)}/giờ
          </span>
        </div>

        {/* Equipment pills */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {space.equipment.map((eq) => (
            <span
              key={eq}
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
              {EQUIPMENT_ICONS[eq]}
              {eq}
            </span>
          ))}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: statusConfig.color,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '13px',
              color: statusConfig.color,
              fontWeight: '500',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Book button */}
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
          onClick={() => { if (!isDisabled && onBook) onBook(); }}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#111111';
              (e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF';
              (e.currentTarget as HTMLButtonElement).style.color = '#111111';
            }
          }}
        >
          {isDisabled ? (space.status === 'busy' ? 'Đang bận' : 'Bảo trì') : 'Đặt ngay'}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

type FilterType = 'Tất cả' | SpaceType;
const FILTERS: FilterType[] = ['Tất cả', 'Hot Desk', 'Meeting Room', 'Private Office'];

export function SpacesScreen({ onBook }: { onBook?: () => void }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tất cả');
  const [search, setSearch] = useState('');

  const filtered = SPACES.filter((s) => {
    const matchType = activeFilter === 'Tất cả' || s.type === activeFilter;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 40px 72px' }}>
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#111111',
              fontFamily: 'DM Sans, sans-serif',
              margin: 0,
              letterSpacing: '-0.5px',
            }}
          >
            Không gian làm việc
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#6B7280',
              fontFamily: 'DM Sans, sans-serif',
              margin: '4px 0 0',
            }}
          >
            Tìm và đặt không gian phù hợp
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '11px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
              pointerEvents: 'none',
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm phòng..."
            style={{
              width: '100%',
              height: '38px',
              paddingLeft: '34px',
              paddingRight: '12px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '14px',
              color: '#111111',
              fontFamily: 'DM Sans, sans-serif',
              backgroundColor: '#FFFFFF',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.target.style.border = '1px solid #3B82F6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid #E5E7EB';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* ── Filter pills ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                height: '32px',
                padding: '0 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '500',
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                border: isActive ? 'none' : '1px solid #D1D5DB',
                backgroundColor: isActive ? '#111111' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#374151',
                transition: 'all 0.12s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF';
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {filtered.map((space) => (
            <SpaceCard key={space.id} space={space} onBook={onBook} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 0',
            color: '#9CA3AF',
            fontSize: '15px',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Không tìm thấy không gian phù hợp.
        </div>
      )}
    </div>
  );
}