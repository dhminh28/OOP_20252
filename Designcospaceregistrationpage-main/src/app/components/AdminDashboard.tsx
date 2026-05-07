import { useState } from 'react';
import {
  Building2, LayoutDashboard, MapPin, Calendar, Users, BarChart3, Settings,
  LogOut, Bell, DollarSign, Briefcase, UserCheck, TrendingUp, Edit2, Trash2,
  Plus, X, ChevronLeft, ChevronRight
} from 'lucide-react';

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

const inputBase: React.CSSProperties = {
  height: '38px',
  borderRadius: '6px',
  border: '1px solid #D1D5DB',
  padding: '0 10px',
  fontSize: '14px',
  color: '#111111',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeNav, setActiveNav] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [amenities, setAmenities] = useState({
    wifi: true,
    projector: true,
    ac: true,
    whiteboard: true,
    tv: false,
    printer: false,
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside style={{
        width: '240px',
        backgroundColor: '#111827',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Building2 size={20} style={{ color: '#FFFFFF' }} />
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>CoSpace</span>
          </div>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '28px' }}>Quản trị viên</p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#374151', margin: '16px 0' }} />

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {[
            { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
            { id: 'spaces', label: 'Không gian', icon: MapPin },
            { id: 'bookings', label: 'Đặt chỗ', icon: Calendar },
            { id: 'members', label: 'Thành viên', icon: Users },
            { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
            { id: 'settings', label: 'Cài đặt', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '44px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: activeNav === id ? '#1F2937' : 'transparent',
                color: activeNav === id ? '#FFFFFF' : '#9CA3AF',
                border: 'none',
                borderLeft: activeNav === id ? '3px solid #3B82F6' : '3px solid transparent',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                fontWeight: activeNav === id ? '600' : '400',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
          <div style={{
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
          }}>
            A
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>Admin</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.3 }}>admin@cospace.vn</p>
          </div>
          <LogOut
            size={16}
            style={{ color: '#9CA3AF', cursor: 'pointer' }}
            onClick={onLogout}
          />
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <header style={{
          ...card,
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111111' }}>Tổng quan</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Bell size={20} style={{ color: '#6B7280', cursor: 'pointer' }} />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
              }} />
            </div>
            <div style={{
              padding: '6px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#6B7280',
            }}>
              14/05/2026
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>Xin chào, Admin 👋</p>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: '24px' }}>

          {/* ══════════ KPI CARDS ══════════ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {[
              {
                label: 'Doanh thu tháng 5',
                value: '₫ 12.400.000',
                trend: '↑ 18% so với tháng trước',
                trendColor: '#10B981',
                iconBg: '#EFF6FF',
                icon: DollarSign,
                iconColor: '#3B82F6',
              },
              {
                label: 'Tổng đặt chỗ',
                value: '134',
                trend: '↑ 9% so với tháng trước',
                trendColor: '#10B981',
                iconBg: '#F5F3FF',
                icon: Briefcase,
                iconColor: '#A855F7',
              },
              {
                label: 'Thành viên hoạt động',
                value: '47',
                trend: '↑ 5 thành viên mới',
                trendColor: '#10B981',
                iconBg: '#F0FDF4',
                icon: UserCheck,
                iconColor: '#22C55E',
              },
              {
                label: 'Tỉ lệ lấp đầy',
                value: '73%',
                trend: '↔ Ổn định',
                trendColor: '#F59E0B',
                iconBg: '#FFFBEB',
                icon: TrendingUp,
                iconColor: '#F59E0B',
              },
            ].map((kpi) => (
              <div key={kpi.label} style={{ ...card, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>{kpi.label}</p>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: kpi.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <kpi.icon size={18} style={{ color: kpi.iconColor }} />
                  </div>
                </div>
                <p style={{ fontSize: '26px', fontWeight: '700', color: '#111111', marginBottom: '6px' }}>{kpi.value}</p>
                <p style={{ fontSize: '12px', color: kpi.trendColor, fontWeight: '500' }}>{kpi.trend}</p>
              </div>
            ))}
          </div>

          {/* ══════════ TWO COLUMN ROW ══════════ */}
          <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '20px', marginBottom: '20px' }}>

            {/* Revenue Chart */}
            <div style={{ ...card, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#111111' }}>Doanh thu 6 tháng gần nhất</h2>
                <button style={{
                  fontSize: '13px',
                  color: '#3B82F6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: '500',
                }}>
                  Xem chi tiết →
                </button>
              </div>

              {/* Chart */}
              <div style={{ position: 'relative', height: '240px', paddingLeft: '40px', paddingBottom: '30px' }}>
                {/* Y-axis labels */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', width: '35px' }}>
                  {['15tr', '10tr', '5tr', '0'].map((label) => (
                    <span key={label} style={{ fontSize: '12px', color: '#9CA3AF' }}>{label}</span>
                  ))}
                </div>

                {/* Grid lines */}
                <div style={{ position: 'absolute', left: '40px', right: 0, top: 0, bottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ height: '1px', borderTop: '1px dashed #F3F4F6', width: '100%' }} />
                  ))}
                </div>

                {/* Bars */}
                <div style={{ position: 'absolute', left: '40px', right: 0, bottom: '30px', height: '210px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                  {[
                    { month: 'T12', value: 8, height: 112 },
                    { month: 'T1', value: 6, height: 84 },
                    { month: 'T2', value: 10, height: 140 },
                    { month: 'T3', value: 7, height: 98 },
                    { month: 'T4', value: 11, height: 154 },
                    { month: 'T5', value: 12.4, height: 174 },
                  ].map((bar, i) => (
                    <div key={bar.month} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '48px',
                        height: `${bar.height}px`,
                        backgroundColor: '#3B82F6',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        position: 'relative',
                      }}>
                        {i === 5 && (
                          <div style={{
                            position: 'absolute',
                            top: '-40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '6px 12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#111111',
                            whiteSpace: 'nowrap',
                          }}>
                            Tháng 5: ₫ 12.400.000
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div style={{ ...card, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#111111' }}>Đặt chỗ gần đây</h2>
                <button style={{
                  fontSize: '13px',
                  color: '#3B82F6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: '500',
                }}>
                  Xem tất cả →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Thành viên', 'Phòng', 'Thời gian', 'Trạng thái', 'Số tiền'].map((h) => (
                        <th key={h} style={{
                          padding: '8px 6px',
                          textAlign: 'left',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#6B7280',
                          borderBottom: '1px solid #F3F4F6',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { member: 'Nguyễn Văn A', room: 'Phòng họp A', time: '14/05 09:00–12:00', status: 'confirmed', amount: '₫ 405.000' },
                      { member: 'Trần Thị B', room: 'Desk 101', time: '14/05 08:00–10:00', status: 'confirmed', amount: '₫ 100.000' },
                      { member: 'Lê Văn C', room: 'VP Riêng 01', time: '13/05 13:00–17:00', status: 'confirmed', amount: '₫ 720.000' },
                      { member: 'Phạm Văn D', room: 'Phòng họp B', time: '13/05 10:00–12:00', status: 'cancelled', amount: '₫ 300.000' },
                      { member: 'Hoàng Thị E', room: 'Desk 102', time: '12/05 09:00–11:00', status: 'pending', amount: '₫ 100.000' },
                    ].map((booking, i) => (
                      <tr key={i} style={{ borderBottom: i < 4 ? '1px solid #F3F4F6' : 'none' }}>
                        <td style={{ padding: '10px 6px', fontSize: '14px', color: '#111111' }}>{booking.member}</td>
                        <td style={{ padding: '10px 6px', fontSize: '14px', color: '#111111' }}>{booking.room}</td>
                        <td style={{ padding: '10px 6px', fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap' }}>{booking.time}</td>
                        <td style={{ padding: '10px 6px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: booking.status === 'confirmed' ? '#DCFCE7' : booking.status === 'cancelled' ? '#FEE2E2' : '#FEF9C3',
                            color: booking.status === 'confirmed' ? '#16A34A' : booking.status === 'cancelled' ? '#DC2626' : '#CA8A04',
                            whiteSpace: 'nowrap',
                          }}>
                            ● {booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 6px', fontSize: '14px', fontWeight: '600', color: '#111111', whiteSpace: 'nowrap' }}>{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', marginTop: '12px' }}>
                <button style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}>‹</button>
                {[1, 2, 3].map((p) => (
                  <button key={p} style={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    background: p === 1 ? '#111111' : 'none',
                    color: p === 1 ? '#FFFFFF' : '#6B7280',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: p === 1 ? '600' : '400',
                  }}>{p}</button>
                ))}
                <button style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}>›</button>
              </div>
            </div>
          </div>

          {/* ══════════ WORKSPACE MANAGEMENT ══════════ */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#111111' }}>Quản lý không gian</h2>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '36px',
                  padding: '0 16px',
                  borderRadius: '8px',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <Plus size={16} />
                Thêm phòng
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Tên phòng', 'Loại', 'Địa chỉ', 'Sức chứa', 'Giá/giờ', 'Trạng thái', 'Thao tác'].map((h) => (
                      <th key={h} style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#6B7280',
                        borderBottom: '1px solid #F3F4F6',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Phòng họp A', type: 'Meeting Room', typeBg: '#F5F3FF', typeColor: '#7C3AED', address: 'Tầng 3, Tòa nhà BMT, 32 Lê Duẩn', capacity: '8 người', price: '₫ 150.000', status: 'Còn trống', statusBg: '#DCFCE7', statusColor: '#16A34A' },
                    { name: 'Desk 101', type: 'Hot Desk', typeBg: '#EFF6FF', typeColor: '#3B82F6', address: 'Tầng 2, Tòa nhà BMT, 32 Lê Duẩn', capacity: '1 người', price: '₫ 50.000', status: 'Còn trống', statusBg: '#DCFCE7', statusColor: '#16A34A' },
                    { name: 'VP Riêng 01', type: 'Private Office', typeBg: '#FFFBEB', typeColor: '#D97706', address: 'Tầng 4, Tòa nhà BMT, 32 Lê Duẩn', capacity: '4 người', price: '₫ 200.000', status: 'Còn trống', statusBg: '#DCFCE7', statusColor: '#16A34A' },
                    { name: 'Phòng họp B', type: 'Meeting Room', typeBg: '#F5F3FF', typeColor: '#7C3AED', address: 'Tầng 3, Tòa nhà BMT, 32 Lê Duẩn', capacity: '6 người', price: '₫ 120.000', status: 'Bảo trì', statusBg: '#F3F4F6', statusColor: '#6B7280' },
                  ].map((room, i) => (
                    <tr key={i} style={{ borderBottom: i < 3 ? '1px solid #F3F4F6' : 'none' }}>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#111111' }}>{room.name}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: room.typeBg,
                          color: room.typeColor,
                          whiteSpace: 'nowrap',
                        }}>
                          {room.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6B7280' }}>{room.address}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#111111' }}>{room.capacity}</td>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#111111', whiteSpace: 'nowrap' }}>{room.price}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: room.statusBg,
                          color: room.statusColor,
                          whiteSpace: 'nowrap',
                        }}>
                          {room.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            cursor: 'pointer',
                            color: '#6B7280',
                          }}>
                            <Edit2 size={14} />
                          </button>
                          <button style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            cursor: 'pointer',
                            color: '#6B7280',
                          }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════ ADD ROOM MODAL ══════════ */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            width: '580px',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111111' }}>Thêm không gian mới</h2>
              <button onClick={() => setShowAddModal(false)} style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#6B7280',
              }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginBottom: '20px' }} />

            {/* Form */}
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Row 1 - Full width */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Tên phòng
                </label>
                <input placeholder="VD: Phòng họp A" style={inputBase} />
              </div>

              {/* Row 2 - Two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Loại không gian
                  </label>
                  <select style={{ ...inputBase, cursor: 'pointer' }}>
                    <option>Meeting Room</option>
                    <option>Hot Desk</option>
                    <option>Private Office</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Sức chứa (người)
                  </label>
                  <input type="number" defaultValue="8" style={inputBase} />
                </div>
              </div>

              {/* Row 3 - Two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Giá/giờ (₫)
                  </label>
                  <input type="number" defaultValue="150000" style={inputBase} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Tầng
                  </label>
                  <input defaultValue="3" style={inputBase} />
                </div>
              </div>

              {/* Row 4 - Two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Tên tòa nhà
                  </label>
                  <input defaultValue="Tòa nhà BMT" style={inputBase} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Địa chỉ đường
                  </label>
                  <input defaultValue="32 Lê Duẩn" style={inputBase} />
                </div>
              </div>

              {/* Row 5 - Two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Quận/Huyện
                  </label>
                  <input defaultValue="Hai Bà Trưng" style={inputBase} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Thành phố
                  </label>
                  <input defaultValue="Hà Nội" style={inputBase} />
                </div>
              </div>

              {/* Row 6 - Two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Giờ mở cửa
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input defaultValue="07:00" style={{ ...inputBase, width: '80px' }} />
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>đến</span>
                    <input defaultValue="22:00" style={{ ...inputBase, width: '80px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Trạng thái
                  </label>
                  <select style={{ ...inputBase, cursor: 'pointer' }}>
                    <option>Còn trống</option>
                    <option>Đã đặt</option>
                    <option>Bảo trì</option>
                  </select>
                </div>
              </div>

              {/* Row 7 - Amenities */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '10px' }}>
                  Thiết bị có sẵn
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { key: 'wifi', label: 'WiFi' },
                    { key: 'projector', label: 'Máy chiếu' },
                    { key: 'ac', label: 'Điều hòa' },
                    { key: 'whiteboard', label: 'Bảng trắng' },
                    { key: 'tv', label: 'TV' },
                    { key: 'printer', label: 'Máy in' },
                  ].map((item) => (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={amenities[item.key as keyof typeof amenities]}
                        onChange={(e) => setAmenities({ ...amenities, [item.key]: e.target.checked })}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 8 - Description */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Mô tả
                </label>
                <textarea
                  placeholder="Mô tả tiện ích, vị trí, đặc điểm nổi bật..."
                  style={{
                    ...inputBase,
                    height: '80px',
                    resize: 'none',
                    padding: '10px',
                  }}
                />
              </div>

              {/* Row 9 - Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Hình ảnh
                </label>
                <div style={{
                  height: '80px',
                  border: '2px dashed #D1D5DB',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>📷 Kéo thả ảnh hoặc click để chọn</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '24px 0 20px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowAddModal(false)} style={{
                height: '36px',
                padding: '0 18px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                fontSize: '13px',
                fontWeight: '600',
                border: '1px solid #D1D5DB',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                Hủy
              </button>
              <button style={{
                height: '36px',
                padding: '0 18px',
                borderRadius: '8px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                Tạo phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
