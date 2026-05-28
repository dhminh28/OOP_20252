import {
  BarChart3,
  Building2,
  Calendar,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  Users,
} from 'lucide-react';

export type AdminNav = 'overview' | 'spaces' | 'bookings' | 'members' | 'reports' | 'settings';

interface SidebarProps {
  activeNav: AdminNav;
  onNavChange: (nav: AdminNav) => void;
  onLogout?: () => void;
}

const NAV_ITEMS: Array<{ id: AdminNav; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Tong quan', icon: LayoutDashboard },
  { id: 'spaces', label: 'Khong gian', icon: MapPin },
  { id: 'bookings', label: 'Dat cho', icon: Calendar },
  { id: 'members', label: 'Thanh vien', icon: Users },
  { id: 'reports', label: 'Bao cao', icon: BarChart3 },
  { id: 'settings', label: 'Cai dat', icon: Settings },
];

export function Sidebar({ activeNav, onNavChange, onLogout }: SidebarProps) {
  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#111827',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Building2 size={20} style={{ color: '#FFFFFF' }} />
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>CoSpace</span>
        </div>
        <p style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '28px' }}>Quan tri vien</p>
      </div>

      <div style={{ height: '1px', backgroundColor: '#374151', margin: '16px 0' }} />

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeNav === id;

          return (
            <button
              key={id}
              onClick={() => onNavChange(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '44px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: isActive ? '#1F2937' : 'transparent',
                color: isActive ? '#FFFFFF' : '#9CA3AF',
                border: 'none',
                borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          A
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>Admin</p>
          <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.3 }}>admin@cospace.vn</p>
        </div>
        <button
          onClick={onLogout}
          title="Dang xuat"
          aria-label="Dang xuat"
          style={{ border: 'none', background: 'none', padding: 0, color: '#9CA3AF', cursor: 'pointer' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
