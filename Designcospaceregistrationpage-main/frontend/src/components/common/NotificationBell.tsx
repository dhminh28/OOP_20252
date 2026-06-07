import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from '../../services/notificationService';

interface NotificationBellProps {
  onOpen?: () => void;
}

export function NotificationBell({ onOpen }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const loadUnreadCount = async () => {
    try {
      setUnreadCount(await getUnreadNotificationCount());
    } catch {
      // A temporary polling error should not interrupt the current screen.
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const [page, count] = await Promise.all([
        getNotifications(0, 10),
        getUnreadNotificationCount(),
      ]);
      setNotifications(page.content);
      setUnreadCount(count);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải thông báo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUnreadCount();
    const intervalId = window.setInterval(() => {
      void loadUnreadCount();
    }, 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const toggle = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      void loadNotifications();
      onOpen?.();
    }
  };

  const markOneRead = async (notification: Notification) => {
    if (notification.read) return;
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((items) =>
        items.map((item) => (item.id === notification.id ? { ...item, read: true } : item)),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (markError) {
      setError(markError instanceof Error ? markError.message : 'Không thể cập nhật thông báo.');
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch (markError) {
      setError(markError instanceof Error ? markError.message : 'Không thể cập nhật thông báo.');
    }
  };

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={toggle}
        title="Thông báo"
        aria-label={`Thông báo, ${unreadCount} chưa đọc`}
        aria-expanded={open}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
          color: '#4B5563',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              minWidth: '18px',
              height: '18px',
              padding: '0 4px',
              borderRadius: '9px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
              fontSize: '10px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '44px',
            width: 'min(380px, calc(100vw - 24px))',
            maxHeight: '480px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 18px 40px rgba(17, 24, 39, 0.16)',
            overflow: 'hidden',
            zIndex: 90,
          }}
        >
          <div
            style={{
              minHeight: '52px',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #F3F4F6',
            }}
          >
            <strong style={{ fontSize: '14px', color: '#111827' }}>Thông báo</strong>
            <button
              type="button"
              onClick={() => void markAllRead()}
              disabled={unreadCount === 0}
              style={{
                border: 'none',
                background: 'none',
                color: unreadCount === 0 ? '#9CA3AF' : '#2563EB',
                fontSize: '12px',
                fontWeight: '600',
                cursor: unreadCount === 0 ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <CheckCheck size={14} />
              Đánh dấu tất cả đã đọc
            </button>
          </div>

          <div style={{ maxHeight: '426px', overflowY: 'auto' }}>
            {loading && (
              <div style={{ padding: '28px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                <Loader2 size={18} style={{ marginBottom: '8px' }} />
                <div>Đang tải thông báo...</div>
              </div>
            )}
            {!loading && error && (
              <div style={{ padding: '18px', color: '#B91C1C', fontSize: '13px' }}>{error}</div>
            )}
            {!loading && !error && notifications.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                Bạn chưa có thông báo nào.
              </div>
            )}
            {!loading &&
              !error &&
              notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  onClick={() => void markOneRead(notification)}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '1px solid #F3F4F6',
                    backgroundColor: notification.read ? '#FFFFFF' : '#EFF6FF',
                    padding: '13px 14px',
                    textAlign: 'left',
                    cursor: notification.read ? 'default' : 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        marginTop: '6px',
                        flexShrink: 0,
                        backgroundColor: notification.read ? 'transparent' : '#2563EB',
                      }}
                    />
                    <span style={{ minWidth: 0 }}>
                      <strong style={{ display: 'block', color: '#111827', fontSize: '13px', marginBottom: '4px' }}>
                        {notification.title}
                      </strong>
                      <span style={{ display: 'block', color: '#4B5563', fontSize: '12px', lineHeight: 1.5 }}>
                        {notification.content}
                      </span>
                      <span style={{ display: 'block', color: '#9CA3AF', fontSize: '11px', marginTop: '6px' }}>
                        {formatNotificationTime(notification.createdAt)}
                      </span>
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatNotificationTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
