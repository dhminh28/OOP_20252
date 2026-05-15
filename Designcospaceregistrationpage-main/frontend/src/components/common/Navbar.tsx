import { ChevronDown } from 'lucide-react';
import logo from '../../assets/logo.svg';
import { vnd } from '../../utils/formatCurrency';

interface NavbarProps {
  activeNav: 'spaces' | 'booking';
  balance: number;
  onGoToSpaces: () => void;
  onGoToProfile: () => void;
  onOpenWallet: () => void;
}

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

export function Navbar({ activeNav, balance, onGoToSpaces, onGoToProfile, onOpenWallet }: NavbarProps) {
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
          onClick={onGoToSpaces}
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
            { key: 'booking', label: 'Đặt chỗ của tôi', onClick: onGoToProfile },
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
          ₫ {vnd(balance)}
        </button>

        <button
          onClick={onGoToProfile}
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
            }}
          >
            M
          </span>
          <ChevronDown size={14} style={{ color: '#6B7280' }} />
        </button>
      </div>
    </nav>
  );
}
