import { useEffect, useRef, useState } from 'react';
import { Calendar, Camera, Loader2, Save } from 'lucide-react';
import { WalletCard } from '../components/profile/WalletCard';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../services/userService';

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

const readonlyInput: React.CSSProperties = {
  ...inputBase,
  backgroundColor: '#F9FAFB',
  color: '#6B7280',
  border: '1px solid #E5E7EB',
};

interface ProfileScreenProps {
  balance: number;
  onTopUp: () => void;
}

export function ProfileScreen({ balance, onTopUp }: ProfileScreenProps) {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fullName, setFullName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setFullName(user?.name ?? '');
    setPhone(user?.phone ?? '');
    setAvatar(user?.avatar ?? '');
  }, [user]);

  const initials = (user?.name ?? 'Thành viên')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const selectAvatar = (file: File | undefined) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Chỉ chấp nhận ảnh JPG, JPEG hoặc PNG.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Ảnh đại diện không được vượt quá 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(String(reader.result));
      setError(null);
      setSuccess(null);
    };
    reader.onerror = () => setError('Không thể đọc tệp ảnh đã chọn.');
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!fullName.trim()) {
      setError('Họ và tên không được để trống.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updatedUser = await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        avatar: avatar || undefined,
      });
      updateUser(updatedUser);
      setSuccess('Thông tin cá nhân đã được lưu.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu hồ sơ.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 24px 72px' }}>
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111111', marginBottom: '6px' }}>
          Hồ sơ cá nhân
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          Quản lý thông tin tài khoản và số dư ví của bạn.
        </p>
      </div>

      <div style={{ ...card, padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#111111' }}>Thông tin cá nhân</span>
        </div>

        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Ảnh đại diện"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                initials || 'M'
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              style={{ display: 'none' }}
              onChange={(event) => {
                selectAvatar(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                fontSize: '12px',
                color: '#3B82F6',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Camera size={12} />
              Đổi ảnh
            </button>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Họ và tên</label>
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} style={inputBase} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Địa chỉ thư điện tử</label>
              <input value={user?.email ?? ''} readOnly style={readonlyInput} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Số điện thoại</label>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} style={inputBase} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Nguồn tài khoản</label>
              <div style={{ position: 'relative' }}>
                <input value="Tài khoản hệ thống" readOnly style={{ ...readonlyInput, paddingRight: '32px' }} />
                <Calendar size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
        </div>

        {(error || success) && (
          <div
            style={{
              marginTop: '18px',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: error ? '#FEF2F2' : '#F0FDF4',
              color: error ? '#B91C1C' : '#166534',
              fontSize: '13px',
            }}
          >
            {error ?? success}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
          <button
            type="button"
            onClick={() => void saveProfile()}
            disabled={saving}
            style={{
              height: '38px',
              padding: '0 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: saving ? '#9CA3AF' : '#111111',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '700',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {saving ? <Loader2 size={15} /> : <Save size={15} />}
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <WalletCard balance={balance} onTopUp={onTopUp} />
    </main>
  );
}
