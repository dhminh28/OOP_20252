import { useEffect, useRef, useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { TopUpModal } from '../components/profile/TopUpModal';
import { RegisterScreen } from '../pages/RegisterScreen';
import { LoginScreen } from '../pages/LoginScreen';
import { SpacesScreen } from '../pages/SpacesScreen';
import { BookingFormScreen } from '../pages/BookingFormScreen';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ProfileScreen } from '../pages/ProfileScreen';
import { MyBookingsScreen } from '../pages/MyBookingsScreen';
import { HomeScreen } from '../pages/HomeScreen';
import { getBalance, recharge } from '../services/walletService';
import { logout } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import type { Workspace } from '../types/workspace';

type ActiveScreen = 'home' | 'register' | 'login' | 'spaces' | 'my-bookings' | 'profile' | 'booking-form' | 'admin';

const ACTIVE_SCREENS: ActiveScreen[] = [
  'home',
  'register',
  'login',
  'spaces',
  'my-bookings',
  'profile',
  'booking-form',
  'admin',
];

function getInitialActiveScreen(): ActiveScreen {
  const storedScreen = sessionStorage.getItem('activeScreen');
  return ACTIVE_SCREENS.includes(storedScreen as ActiveScreen)
    ? (storedScreen as ActiveScreen)
    : 'home';
}

export default function App() {
  const { user, token, clearSession } = useAuth();
  const skipActiveScreenPersistence = useRef(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(getInitialActiveScreen);
  const [balance, setBalance] = useState(0);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  const showMemberShell = !['home', 'admin', 'register', 'login'].includes(activeScreen);
  const activeNav = activeScreen === 'my-bookings' ? 'bookings' : activeScreen === 'spaces' || activeScreen === 'booking-form' ? 'spaces' : null;

  useEffect(() => {
    if (skipActiveScreenPersistence.current) {
      skipActiveScreenPersistence.current = false;
      return;
    }

    sessionStorage.setItem('activeScreen', activeScreen);
  }, [activeScreen]);

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
      setWalletError(error instanceof Error ? error.message : 'Không thể tải số dư ví.');
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

  const handleLogout = async () => {
    try {
      if (token) {
        await logout();
      }
    } catch {
      // Local logout must still complete when the backend is temporarily unavailable.
    } finally {
      skipActiveScreenPersistence.current = true;
      sessionStorage.removeItem('activeScreen');
      clearSession();
      setSelectedWorkspace(null);
      setShowTopUpModal(false);
      setActiveScreen('home');
    }
  };

  const handleTopUp = async (amount: number) => {
    await recharge(amount);
  };

  return (
    <>
      {activeScreen === 'home' && (
        <HomeScreen
          user={user}
          onLogin={() => setActiveScreen('login')}
          onRegister={() => setActiveScreen('register')}
          onEnterMember={() => setActiveScreen('spaces')}
          onEnterAdmin={() => setActiveScreen('admin')}
          onBookWorkspace={openBookingForm}
        />
      )}

      {activeScreen === 'register' && (
        <RegisterScreen
          onRegister={() => setActiveScreen('spaces')}
          onSwitchToLogin={() => setActiveScreen('login')}
          onGoHome={() => setActiveScreen('home')}
        />
      )}

      {activeScreen === 'login' && (
        <LoginScreen
          onLogin={() => setActiveScreen('spaces')}
          onAdminLogin={() => setActiveScreen('admin')}
          onSwitchToRegister={() => setActiveScreen('register')}
          onGoHome={() => setActiveScreen('home')}
        />
      )}

      {activeScreen === 'admin' && (
        <AdminDashboard onLogout={handleLogout} onGoHome={() => setActiveScreen('home')} />
      )}

      {showMemberShell && (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'DM Sans, sans-serif' }}>
          <Navbar
            activeNav={activeNav}
            balance={balance}
            onGoHome={() => setActiveScreen('home')}
            onGoToSpaces={() => setActiveScreen('spaces')}
            onGoToBookings={() => setActiveScreen('my-bookings')}
            onGoToProfile={() => setActiveScreen('profile')}
            onOpenWallet={() => setShowTopUpModal(true)}
            onNotificationsOpen={() => void refreshWallet()}
            onLogout={handleLogout}
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

          {activeScreen === 'my-bookings' && (
            <MyBookingsScreen />
          )}
        </div>
      )}

      {showTopUpModal && (
        <TopUpModal
          onClose={() => setShowTopUpModal(false)}
          balance={balance}
          onTopUp={handleTopUp}
        />
      )}
    </>
  );
}
