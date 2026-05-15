import { useEffect, useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { TopUpModal } from '../components/profile/TopUpModal';
import { RegisterScreen } from '../pages/RegisterScreen';
import { LoginScreen } from '../pages/LoginScreen';
import { SpacesScreen } from '../pages/SpacesScreen';
import { BookingFormScreen } from '../pages/BookingFormScreen';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ProfileScreen } from '../pages/ProfileScreen';
import { getBalance, recharge } from '../services/walletService';
import { useAuth } from '../hooks/useAuth';
import type { Workspace } from '../types/workspace';

type ActiveScreen = 'register' | 'login' | 'spaces' | 'profile' | 'booking-form' | 'admin';

export default function App() {
  const { token, clearSession } = useAuth();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(500_000);
  const [customAmount, setCustomAmount] = useState('500.000');
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(() => (token ? 'spaces' : 'login'));
  const [balance, setBalance] = useState(0);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  const showMemberShell = !['admin', 'register', 'login'].includes(activeScreen);
  const activeNav = activeScreen === 'spaces' ? 'spaces' : 'booking';

  const refreshWallet = async () => {
    if (!token) {
      setBalance(0);
      return;
    }

    setWalletLoading(true);
    setWalletError(null);
    try {
      const wallet = await getBalance();
      setBalance(wallet.balance);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : 'Khong the tai so du vi');
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      setSelectedWorkspace(null);
      setActiveScreen('login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [clearSession]);

  useEffect(() => {
    if (showMemberShell) {
      void refreshWallet();
    }
  }, [showMemberShell, token]);

  const openBookingForm = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setActiveScreen('booking-form');
  };

  const handleTopUp = async (amount: number) => {
    const wallet = await recharge(amount);
    setBalance(wallet.balance);
  };

  return (
    <>
      {activeScreen === 'register' && (
        <RegisterScreen
          onRegister={() => setActiveScreen('spaces')}
          onSwitchToLogin={() => setActiveScreen('login')}
        />
      )}

      {activeScreen === 'login' && (
        <LoginScreen
          onLogin={() => setActiveScreen('spaces')}
          onAdminLogin={() => setActiveScreen('admin')}
          onSwitchToRegister={() => setActiveScreen('register')}
        />
      )}

      {activeScreen === 'admin' && (
        <AdminDashboard onLogout={() => setActiveScreen('login')} />
      )}

      {showMemberShell && (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'DM Sans, sans-serif' }}>
          <Navbar
            activeNav={activeNav}
            balance={balance}
            onGoToSpaces={() => setActiveScreen('spaces')}
            onGoToProfile={() => setActiveScreen('profile')}
            onOpenWallet={() => setShowTopUpModal(true)}
          />

          {walletError && (
            <div style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', padding: '10px 40px', fontSize: '13px' }}>
              {walletError}
            </div>
          )}

          {activeScreen === 'spaces' && (
            <SpacesScreen onBook={openBookingForm} />
          )}

          {activeScreen === 'booking-form' && (
            <BookingFormScreen
              workspace={selectedWorkspace}
              walletBalance={balance}
              walletLoading={walletLoading}
              onBookingCompleted={refreshWallet}
              onBack={() => setActiveScreen('spaces')}
            />
          )}

          {activeScreen === 'profile' && (
            <ProfileScreen balance={balance} onTopUp={() => setShowTopUpModal(true)} />
          )}
        </div>
      )}

      {showTopUpModal && (
        <TopUpModal
          onClose={() => setShowTopUpModal(false)}
          balance={balance}
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          customAmount={customAmount}
          setCustomAmount={setCustomAmount}
          onTopUp={handleTopUp}
        />
      )}
    </>
  );
}
