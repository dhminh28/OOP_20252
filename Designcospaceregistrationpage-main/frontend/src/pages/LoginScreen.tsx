import { FormEvent, useState } from 'react';
import { ArrowLeft, Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { login } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.css';

interface LoginScreenProps {
  onLogin: () => void;
  onAdminLogin: () => void;
  onSwitchToRegister: () => void;
  onGoHome: () => void;
}

export function LoginScreen({ onLogin, onAdminLogin, onSwitchToRegister, onGoHome }: LoginScreenProps) {
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(email.trim(), password);
      setSession(result.user, result.token);

      if (result.user.role === 'admin') {
        onAdminLogin();
      } else {
        onLogin();
      }
    } catch {
      setError('Địa chỉ thư điện tử hoặc mật khẩu không chính xác. Vui lòng thử lại.');
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
          <p>Không gian linh hoạt</p>
          <h2>Làm việc hiệu quả trong một không gian phù hợp với bạn.</h2>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-shell">
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
            <p className="auth-eyebrow">Chào mừng trở lại</p>
            <h1>Đăng nhập</h1>
            <p>Đăng nhập để quản lý lịch đặt chỗ và ví CoSpace của bạn.</p>
          </div>

          <form className="auth-form" onSubmit={submitLogin}>
            <div className="auth-field">
              <label htmlFor="login-email">Địa chỉ thư điện tử</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Nhập địa chỉ thư điện tử"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Mật khẩu</label>
              <div className="auth-password">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
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

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading && <Loader2 className="auth-spinner" size={18} />}
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="auth-switch">
            Chưa có tài khoản?{' '}
            <button type="button" onClick={onSwitchToRegister}>
              Đăng ký ngay
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
