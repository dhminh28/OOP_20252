import { FormEvent, useState } from 'react';
import { ArrowLeft, Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { register } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.css';

interface RegisterScreenProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
  onGoHome: () => void;
}

export function RegisterScreen({ onRegister, onSwitchToLogin, onGoHome }: RegisterScreenProps) {
  const { setSession } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!agreed) {
      setError('Bạn cần đồng ý với điều khoản sử dụng.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      setSession(result.user, result.token);
      onRegister();
    } catch {
      setError('Không thể tạo tài khoản. Địa chỉ thư điện tử có thể đã được sử dụng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Không gian làm việc CoSpace">
        <img
          src="https://images.unsplash.com/photo-1687945727613-a4d06cc41024?auto=format&fit=crop&w=1400&q=88"
          alt="Không gian làm việc hiện đại với ánh sáng tự nhiên"
        />
        <div className="auth-visual-shade" />
        <div className="auth-visual-brand">
          <span className="auth-logo-mark">
            <Building2 size={22} strokeWidth={2.2} />
          </span>
          <span>CoSpace</span>
        </div>
        <div className="auth-visual-copy">
          <p>Bắt đầu cùng CoSpace</p>
          <h2>Một tài khoản cho mọi lịch đặt chỗ và giao dịch của bạn.</h2>
        </div>
      </section>

      <section className="auth-panel auth-panel-register">
        <div className="auth-form-shell auth-form-shell-wide">
          <button type="button" className="auth-back" onClick={onGoHome}>
            <ArrowLeft size={17} />
            Về trang chủ
          </button>

          <div className="auth-mobile-brand">
            <span className="auth-logo-mark">
              <Building2 size={20} strokeWidth={2.2} />
            </span>
            <span>CoSpace</span>
          </div>

          <div className="auth-heading">
            <p className="auth-eyebrow">Tham gia CoSpace</p>
            <h1>Tạo tài khoản</h1>
            <p>Đăng ký để bắt đầu tìm kiếm và đặt không gian làm việc phù hợp.</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-field-grid">
              <div className="auth-field">
                <label htmlFor="register-name">Họ và tên</label>
                <input
                  id="register-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="register-phone">Số điện thoại</label>
                <input
                  id="register-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  type="tel"
                  placeholder="0912 345 678"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Địa chỉ thư điện tử</label>
              <input
                id="register-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="Nhập địa chỉ thư điện tử"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field-grid">
              <div className="auth-field">
                <label htmlFor="register-password">Mật khẩu</label>
                <div className="auth-password">
                  <input
                    id="register-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tạo mật khẩu"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
                <div className="auth-password">
                  <input
                    id="register-confirm-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((current) => !current)}
                    aria-label={showConfirm ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                    title={showConfirm ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <label className="auth-agreement">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
              />
              <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật của CoSpace.</span>
            </label>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading && <Loader2 className="auth-spinner" size={18} />}
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          <p className="auth-switch">
            Đã có tài khoản?{' '}
            <button type="button" onClick={onSwitchToLogin}>
              Đăng nhập
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
