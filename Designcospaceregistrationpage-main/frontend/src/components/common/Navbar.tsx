import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import logo from '../../assets/logo.svg';
import { vnd } from '../../utils/formatCurrency';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  activeNav: 'spaces' | 'bookings' | null;
  balance: number;
  onGoHome: () => void;
  onGoToSpaces: () => void;
  onGoToBookings: () => void;
  onGoToProfile: () => void;
  onOpenWallet: () => void;
  onNotificationsOpen?: () => void;
  onLogout: () => void;
}

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

export function Navbar({
  activeNav,
  balance,
  onGoHome,
  onGoToSpaces,
  onGoToBookings,
  onGoToProfile,
  onOpenWallet,
  onNotificationsOpen,
  onLogout,
}: NavbarProps) {
  const { user } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const openProfile = () => {
    setProfileMenuOpen(false);
    onGoToProfile();
  };

  const logout = () => {
    setProfileMenuOpen(false);
    onLogout();
  };

  return (
    <nav
      style={{
        ...card,
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        padding: '0 40px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <button
          onClick={onGoHome}
          title="Trang chủ"
          aria-label="Trang chủ"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            padding: 0,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          <img src={logo} alt="CoSpace" style={{ width: '22px', height: '22px' }} />
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#111111', letterSpacing: '-0.3px' }}>
            CoSpace
          </span>
        </button>

        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { key: 'spaces', label: 'Không gian', onClick: onGoToSpaces },
            { key: 'bookings', label: 'Đặt chỗ của tôi', onClick: onGoToBookings },
          ].map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: activeNav === item.key ? '600' : '400',
                color: activeNav === item.key ? '#111111' : '#6B7280',
                background: 'none',
                border: 'none',
                borderBottom: activeNav === item.key ? '2px solid #111111' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <NotificationBell onOpen={onNotificationsOpen} />
        <button
          onClick={onOpenWallet}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 13px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            backgroundColor: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '500',
            color: '#111111',
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.backgroundColor = '#F9FAFB';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          {vnd(balance)} ₫
        </button>

        <div ref={profileMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileMenuOpen((open) => !open)}
            title="Menu tài khoản"
            aria-label="Menu tài khoản"
            aria-expanded={profileMenuOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              padding: 0,
            }}
          >
            <span
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
                overflow: 'hidden',
              }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                (user?.name?.trim().charAt(0) || 'M').toUpperCase()
              )}
            </span>
            <ChevronDown
              size={14}
              style={{
                color: '#6B7280',
                transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s',
              }}
            />
          </button>

          {profileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '44px',
                width: '190px',
                padding: '6px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 16px 32px rgba(17, 24, 39, 0.12)',
                zIndex: 80,
              }}
            >
              <button
                onClick={openProfile}
                style={{
                  width: '100%',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '0 10px',
                  border: 'none',
                  borderRadius: '6px',
                  background: 'none',
                  color: '#111111',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px',
                  fontWeight: '500',
                  textAlign: 'left',
                }}
              >
                <User size={15} />
                Hồ sơ cá nhân
              </button>
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '0 10px',
                  border: 'none',
                  borderRadius: '6px',
                  background: 'none',
                  color: '#B91C1C',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px',
                  fontWeight: '500',
                  textAlign: 'left',
                }}
              >
                <LogOut size={15} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
