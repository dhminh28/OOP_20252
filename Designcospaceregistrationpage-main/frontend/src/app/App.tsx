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
import { getWorkspaceById } from '../services/workspaceService';
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
const ACTIVE_SCREEN_KEY = 'activeScreen';
const BOOKING_WORKSPACE_ID_KEY = 'bookingWorkspaceId';

function getInitialActiveScreen(): ActiveScreen {
  const storedScreen = sessionStorage.getItem(ACTIVE_SCREEN_KEY);
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
  const [restoringBookingWorkspace, setRestoringBookingWorkspace] = useState(
    () => getInitialActiveScreen() === 'booking-form',
  );

  const showMemberShell = !['home', 'admin', 'register', 'login'].includes(activeScreen);
  const activeNav = activeScreen === 'my-bookings' ? 'bookings' : activeScreen === 'spaces' || activeScreen === 'booking-form' ? 'spaces' : null;

  useEffect(() => {
    if (skipActiveScreenPersistence.current) {
      skipActiveScreenPersistence.current = false;
      return;
    }

    sessionStorage.setItem(ACTIVE_SCREEN_KEY, activeScreen);
  }, [activeScreen]);

  useEffect(() => {
    if (activeScreen !== 'booking-form' || selectedWorkspace) {
      setRestoringBookingWorkspace(false);
      return;
    }

    const storedWorkspaceId = Number(sessionStorage.getItem(BOOKING_WORKSPACE_ID_KEY));
    if (!Number.isInteger(storedWorkspaceId) || storedWorkspaceId <= 0) {
      sessionStorage.removeItem(BOOKING_WORKSPACE_ID_KEY);
      setRestoringBookingWorkspace(false);
      setActiveScreen('spaces');
      return;
    }

    let cancelled = false;
    setRestoringBookingWorkspace(true);
    void getWorkspaceById(storedWorkspaceId)
      .then((workspace) => {
        if (!cancelled) {
          setSelectedWorkspace(workspace);
        }
      })
      .catch(() => {
        if (!cancelled) {
          sessionStorage.removeItem(BOOKING_WORKSPACE_ID_KEY);
          setActiveScreen('spaces');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setRestoringBookingWorkspace(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeScreen, selectedWorkspace]);

  useEffect(() => {
    if (activeScreen === 'booking-form' || !selectedWorkspace) {
      return;
    }
    sessionStorage.removeItem(BOOKING_WORKSPACE_ID_KEY);
    setSelectedWorkspace(null);
  }, [activeScreen, selectedWorkspace]);

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
      sessionStorage.removeItem(BOOKING_WORKSPACE_ID_KEY);
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
    sessionStorage.setItem(BOOKING_WORKSPACE_ID_KEY, String(workspace.id));
    setActiveScreen('booking-form');
  };

  const leaveBookingForm = () => {
    sessionStorage.removeItem(BOOKING_WORKSPACE_ID_KEY);
    setSelectedWorkspace(null);
    setActiveScreen('spaces');
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
      sessionStorage.removeItem(ACTIVE_SCREEN_KEY);
      sessionStorage.removeItem(BOOKING_WORKSPACE_ID_KEY);
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
            restoringBookingWorkspace ? (
              <div style={{ padding: '80px 24px', textAlign: 'center', color: '#6B7280' }}>
                Đang khôi phục thông tin đặt chỗ...
              </div>
            ) : (
              <BookingFormScreen
                workspace={selectedWorkspace}
                walletBalance={balance}
                walletLoading={walletLoading}
                onBookingCompleted={refreshWallet}
                onBack={leaveBookingForm}
              />
            )
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
