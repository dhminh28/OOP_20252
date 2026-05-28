import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Briefcase,
  Database,
  DollarSign,
  Edit2,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  TrendingUp,
  UserCheck,
  X,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { Sidebar, type AdminNav } from '../components/common/Sidebar';
import { BookingStatsChart } from '../components/dashboard/BookingStatsChart';
import { KPICard } from '../components/dashboard/KPICard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import {
  getAdminBookings,
  getAdminUsers,
  getDashboardSummary,
  type AdminBooking,
  type AdminUser,
  type DashboardSummary,
} from '../services/adminService';
import {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  type WorkspaceMutationPayload,
} from '../services/workspaceService';
import { vnd } from '../utils/formatCurrency';
import type { PageResponse } from '../types/pagination';
import type { Workspace, WorkspaceStatus, WorkspaceType } from '../types/workspace';

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

const emptyWorkspaceForm: WorkspaceMutationPayload = {
  name: '',
  type: 'Meeting Room',
  address: 'BMT Building, 32 Le Duan',
  floor: '3',
  capacity: 8,
  pricePerHour: 150000,
  status: 'available',
  imageUrl: '',
  equipment: ['WiFi', 'Projector', 'Air conditioner'],
};

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeNav, setActiveNav] = useState<AdminNav>('overview');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [workspaces, setWorkspaces] = useState<PageResponse<Workspace> | null>(null);
  const [workspacePage, setWorkspacePage] = useState(0);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [workspaceForm, setWorkspaceForm] = useState<WorkspaceMutationPayload>(emptyWorkspaceForm);
  const [workspaceSaving, setWorkspaceSaving] = useState(false);

  const [bookings, setBookings] = useState<PageResponse<AdminBooking> | null>(null);
  const [bookingPage, setBookingPage] = useState(0);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [users, setUsers] = useState<PageResponse<AdminUser> | null>(null);
  const [userPage, setUserPage] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    publicWorkspaceCache: true,
    requireJwtForPayments: true,
  });

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      setSummary(await getDashboardSummary());
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : 'Unable to load dashboard metrics');
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadWorkspaces = useCallback(async () => {
    setWorkspaceLoading(true);
    setWorkspaceError(null);
    try {
      setWorkspaces(await getAllWorkspaces({ page: workspacePage, size: 8 }));
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : 'Unable to load workspaces');
    } finally {
      setWorkspaceLoading(false);
    }
  }, [workspacePage]);

  const loadBookings = useCallback(async () => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      setBookings(await getAdminBookings({ page: bookingPage, size: 10 }));
    } catch (error) {
      setBookingsError(error instanceof Error ? error.message : 'Unable to load bookings');
    } finally {
      setBookingsLoading(false);
    }
  }, [bookingPage]);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      setUsers(await getAdminUsers({ page: userPage, size: 10 }));
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : 'Unable to load members');
    } finally {
      setUsersLoading(false);
    }
  }, [userPage]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    if (activeNav === 'spaces') void loadWorkspaces();
  }, [activeNav, loadWorkspaces]);

  useEffect(() => {
    if (activeNav === 'bookings') void loadBookings();
  }, [activeNav, loadBookings]);

  useEffect(() => {
    if (activeNav === 'members') void loadUsers();
  }, [activeNav, loadUsers]);

  const kpiItems = useMemo(
    () => [
      {
        label: 'Total revenue',
        value: `VND ${vnd(summary?.revenue ?? 0)}`,
        trend: summaryLoading ? 'Loading live metrics' : 'Wallet payment transactions',
        trendColor: '#10B981',
        iconBg: '#EFF6FF',
        icon: DollarSign,
        iconColor: '#3B82F6',
      },
      {
        label: 'Successful bookings',
        value: String(summary?.totalBookings ?? 0),
        trend: summaryLoading ? 'Loading live metrics' : 'Paid bookings in database',
        trendColor: '#10B981',
        iconBg: '#F5F3FF',
        icon: Briefcase,
        iconColor: '#A855F7',
      },
      {
        label: 'Registered users',
        value: String(summary?.activeMembers ?? 0),
        trend: summaryLoading ? 'Loading live metrics' : 'All accounts in users table',
        trendColor: '#10B981',
        iconBg: '#F0FDF4',
        icon: UserCheck,
        iconColor: '#22C55E',
      },
      {
        label: 'Occupancy rate',
        value: `${Math.round(summary?.occupancyRate ?? 0)}%`,
        trend: summaryLoading ? 'Loading live metrics' : 'Successful bookings per workspace',
        trendColor: '#F59E0B',
        iconBg: '#FFFBEB',
        icon: TrendingUp,
        iconColor: '#F59E0B',
      },
    ],
    [summary, summaryLoading],
  );

  const title = {
    overview: 'Admin Overview',
    spaces: 'Workspace Management',
    bookings: 'Booking Operations',
    members: 'Member Directory',
    reports: 'Reports',
    settings: 'System Settings',
  }[activeNav];

  const openCreateWorkspace = () => {
    setEditingWorkspace(null);
    setWorkspaceForm(emptyWorkspaceForm);
    setShowWorkspaceModal(true);
  };

  const openEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setWorkspaceForm({
      name: workspace.name,
      type: workspace.type,
      address: workspace.address ?? '',
      floor: workspace.rawFloor ?? '',
      capacity: workspace.capacity,
      pricePerHour: workspace.pricePerHour,
      status: workspace.status,
      imageUrl: workspace.image.startsWith('http') ? workspace.image : '',
      equipment: workspace.equipment,
    });
    setShowWorkspaceModal(true);
  };

  const saveWorkspace = async () => {
    setWorkspaceSaving(true);
    setWorkspaceError(null);
    try {
      if (editingWorkspace) {
        await updateWorkspace(editingWorkspace.id, workspaceForm);
      } else {
        await createWorkspace(workspaceForm);
      }
      setShowWorkspaceModal(false);
      await loadWorkspaces();
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : 'Unable to save workspace');
    } finally {
      setWorkspaceSaving(false);
    }
  };

  const removeWorkspace = async (workspace: Workspace) => {
    const confirmed = window.confirm(`Delete workspace "${workspace.name}"?`);
    if (!confirmed) return;

    setWorkspaceError(null);
    try {
      await deleteWorkspace(workspace.id);
      await loadWorkspaces();
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : 'Unable to delete workspace');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'DM Sans, sans-serif' }}>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} onLogout={onLogout} />

      <main style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
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
          }}
        >
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111111' }}>{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => {
                if (activeNav === 'overview' || activeNav === 'reports') void loadSummary();
                if (activeNav === 'spaces') void loadWorkspaces();
                if (activeNav === 'bookings') void loadBookings();
                if (activeNav === 'members') void loadUsers();
              }}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                color: '#6B7280',
                cursor: 'pointer',
              }}
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <div style={{ position: 'relative' }}>
              <Bell size={20} style={{ color: '#6B7280', cursor: 'pointer' }} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            </div>
            <div style={{ padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#6B7280' }}>
              {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </header>

        <div style={{ padding: '24px' }}>
          {(activeNav === 'overview' || activeNav === 'reports') && (
            <>
              <StatusBanner loading={summaryLoading} error={summaryError} loadingText="Loading admin metrics..." />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(160px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {kpiItems.map((kpi) => (
                  <KPICard key={kpi.label} {...kpi} />
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(320px, 2fr)', gap: '20px', marginBottom: '20px' }}>
                <RevenueChart data={summary?.monthlyRevenue ?? []} />
                <BookingStatsChart data={summary?.bookingStatusSummary ?? []} />
              </div>
              {activeNav === 'overview' ? <OverviewNotes /> : <ReportsPanel summary={summary} />}
            </>
          )}

          {activeNav === 'spaces' && (
            <section style={{ ...card, padding: '20px' }}>
              <SectionHeader
                title="Workspaces"
                subtitle="Create, edit, and remove rooms from the live workspace table."
                actionLabel="Add workspace"
                onAction={openCreateWorkspace}
              />
              <StatusBanner loading={workspaceLoading} error={workspaceError} loadingText="Loading workspaces..." />
              <WorkspaceTable
                workspaces={workspaces?.content ?? []}
                onEdit={openEditWorkspace}
                onDelete={removeWorkspace}
              />
              <Pager page={workspacePage} totalPages={workspaces?.totalPages ?? 0} onPageChange={setWorkspacePage} />
            </section>
          )}

          {activeNav === 'bookings' && (
            <section style={{ ...card, padding: '20px' }}>
              <SectionHeader title="All bookings" subtitle="Live booking records across every member and workspace." />
              <StatusBanner loading={bookingsLoading} error={bookingsError} loadingText="Loading bookings..." />
              <BookingsTable bookings={bookings?.content ?? []} />
              <Pager page={bookingPage} totalPages={bookings?.totalPages ?? 0} onPageChange={setBookingPage} />
            </section>
          )}

          {activeNav === 'members' && (
            <section style={{ ...card, padding: '20px' }}>
              <SectionHeader title="Members and admins" subtitle="Accounts registered in the users table." />
              <StatusBanner loading={usersLoading} error={usersError} loadingText="Loading members..." />
              <UsersTable users={users?.content ?? []} />
              <Pager page={userPage} totalPages={users?.totalPages ?? 0} onPageChange={setUserPage} />
            </section>
          )}

          {activeNav === 'settings' && (
            <SettingsPanel settings={settings} onChange={setSettings} />
          )}
        </div>
      </main>

      {showWorkspaceModal && (
        <WorkspaceModal
          form={workspaceForm}
          editing={Boolean(editingWorkspace)}
          saving={workspaceSaving}
          onChange={setWorkspaceForm}
          onClose={() => setShowWorkspaceModal(false)}
          onSave={saveWorkspace}
        />
      )}
    </div>
  );
}

function StatusBanner({ loading, error, loadingText }: { loading: boolean; error: string | null; loadingText: string }) {
  if (loading) {
    return (
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', marginBottom: '16px', color: '#4B5563', fontSize: '13px' }}>
        <Loader2 size={16} />
        {loadingText}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', marginBottom: '16px', border: '1px solid #FCA5A5', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '13px' }}>
        <AlertTriangle size={16} />
        {error}
      </div>
    );
  }

  return null;
}

function SectionHeader({ title, subtitle, actionLabel, onAction }: { title: string; subtitle: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111111', marginBottom: '4px' }}>{title}</h2>
        <p style={{ fontSize: '13px', color: '#6B7280' }}>{subtitle}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
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
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function WorkspaceTable({ workspaces, onEdit, onDelete }: { workspaces: Workspace[]; onEdit: (workspace: Workspace) => void; onDelete: (workspace: Workspace) => void }) {
  return (
    <DataTable
      headers={['Name', 'Type', 'Location', 'Capacity', 'Price/hour', 'Status', 'Actions']}
      emptyText="No workspaces found."
      rows={workspaces.map((workspace) => [
        <strong>{workspace.name}</strong>,
        <Badge label={workspace.type} tone={workspace.type === 'Meeting Room' ? 'purple' : workspace.type === 'Hot Desk' ? 'blue' : 'amber'} />,
        workspace.floor,
        `${workspace.capacity} people`,
        `VND ${vnd(workspace.pricePerHour)}`,
        <Badge label={workspace.status} tone={workspace.status === 'available' ? 'green' : workspace.status === 'maintenance' ? 'gray' : 'amber'} />,
        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton label="Edit" onClick={() => onEdit(workspace)} icon={<Edit2 size={14} />} />
          <IconButton label="Delete" onClick={() => onDelete(workspace)} icon={<Trash2 size={14} />} danger />
        </div>,
      ])}
    />
  );
}

function BookingsTable({ bookings }: { bookings: AdminBooking[] }) {
  return (
    <DataTable
      headers={['ID', 'Member', 'Workspace', 'Time', 'Amount', 'Status', 'Note']}
      emptyText="No bookings found."
      rows={bookings.map((booking) => [
        `#${booking.id}`,
        <div>
          <strong>{booking.memberName}</strong>
          <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>{booking.memberEmail}</p>
        </div>,
        booking.workspaceName,
        `${formatDateTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
        `VND ${vnd(booking.totalAmount)}`,
        <Badge label={booking.status} tone={booking.status === 'CANCELLED' ? 'red' : booking.status === 'PENDING' ? 'amber' : 'green'} />,
        booking.note ?? '-',
      ])}
    />
  );
}

function UsersTable({ users }: { users: AdminUser[] }) {
  return (
    <DataTable
      headers={['ID', 'Name', 'Email', 'Phone', 'Role', 'Created']}
      emptyText="No users found."
      rows={users.map((user) => [
        `#${user.id}`,
        <strong>{user.fullName}</strong>,
        user.email,
        user.phone ?? '-',
        <Badge label={user.role} tone={user.role === 'ADMIN' ? 'purple' : 'blue'} />,
        formatDateTime(user.createdAt),
      ])}
    />
  );
}

function DataTable({ headers, rows, emptyText }: { headers: string[]; rows: React.ReactNode[][]; emptyText: string }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map((heading) => (
              <th key={heading} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6B7280', borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap' }}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: rowIndex < rows.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ padding: '12px', fontSize: '13px', color: '#111111', verticalAlign: 'middle' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div style={{ padding: '34px 0', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>{emptyText}</div>
      )}
    </div>
  );
}

function Pager({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
      <button disabled={page <= 0} onClick={() => onPageChange(page - 1)} style={pagerButton(page <= 0)}>
        Previous
      </button>
      <span style={{ fontSize: '13px', color: '#6B7280' }}>
        Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
      </span>
      <button disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)} style={pagerButton(page + 1 >= totalPages)}>
        Next
      </button>
    </div>
  );
}

function pagerButton(disabled: boolean): React.CSSProperties {
  return {
    height: '32px',
    padding: '0 12px',
    borderRadius: '6px',
    border: '1px solid #E5E7EB',
    backgroundColor: disabled ? '#F9FAFB' : '#FFFFFF',
    color: disabled ? '#9CA3AF' : '#374151',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '12px',
    fontWeight: '600',
  };
}

function Badge({ label, tone }: { label: string; tone: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'gray' }) {
  const colors = {
    blue: ['#EFF6FF', '#2563EB'],
    green: ['#DCFCE7', '#16A34A'],
    amber: ['#FFFBEB', '#D97706'],
    purple: ['#F5F3FF', '#7C3AED'],
    red: ['#FEE2E2', '#B91C1C'],
    gray: ['#F3F4F6', '#6B7280'],
  }[tone];
  return (
    <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: colors[0], color: colors[1], whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function IconButton({ label, icon, onClick, danger = false }: { label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      style={{
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        background: '#FFFFFF',
        cursor: 'pointer',
        color: danger ? '#B91C1C' : '#6B7280',
      }}
    >
      {icon}
    </button>
  );
}

function WorkspaceModal({
  form,
  editing,
  saving,
  onChange,
  onClose,
  onSave,
}: {
  form: WorkspaceMutationPayload;
  editing: boolean;
  saving: boolean;
  onChange: (form: WorkspaceMutationPayload) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const update = <K extends keyof WorkspaceMutationPayload>(key: K, value: WorkspaceMutationPayload[K]) => {
    onChange({ ...form, [key]: value });
  };

  const equipmentText = (form.equipment ?? []).join(', ');

  return (
    <Modal onClose={onClose} width="620px" maxHeight="90vh">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111111' }}>{editing ? 'Edit workspace' : 'Add workspace'}</h2>
        <button onClick={onClose} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        <Field label="Workspace name">
          <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Meeting Room A" style={inputBase} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Type">
            <select value={form.type} onChange={(event) => update('type', event.target.value as WorkspaceType)} style={inputBase}>
              <option>Hot Desk</option>
              <option>Meeting Room</option>
              <option>Private Office</option>
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(event) => update('status', event.target.value as WorkspaceStatus)} style={inputBase}>
              <option value="available">available</option>
              <option value="busy">busy</option>
              <option value="maintenance">maintenance</option>
            </select>
          </Field>
        </div>
        <Field label="Address">
          <input value={form.address} onChange={(event) => update('address', event.target.value)} style={inputBase} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
          <Field label="Floor">
            <input value={form.floor ?? ''} onChange={(event) => update('floor', event.target.value)} style={inputBase} />
          </Field>
          <Field label="Capacity">
            <input type="number" value={form.capacity} onChange={(event) => update('capacity', Number(event.target.value))} style={inputBase} />
          </Field>
          <Field label="Price/hour">
            <input type="number" value={form.pricePerHour} onChange={(event) => update('pricePerHour', Number(event.target.value))} style={inputBase} />
          </Field>
        </div>
        <Field label="Image URL">
          <input value={form.imageUrl ?? ''} onChange={(event) => update('imageUrl', event.target.value)} placeholder="https://..." style={inputBase} />
        </Field>
        <Field label="Equipment">
          <input value={equipmentText} onChange={(event) => update('equipment', splitEquipment(event.target.value))} placeholder="WiFi, Projector, Whiteboard" style={inputBase} />
        </Field>
      </div>

      <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '22px 0 18px' }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={onClose} disabled={saving} style={{ height: '36px', padding: '0 18px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#374151', fontSize: '13px', fontWeight: '600', border: '1px solid #D1D5DB', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          Cancel
        </button>
        <button onClick={onSave} disabled={saving || !form.name || !form.address} style={{ height: '36px', padding: '0 18px', borderRadius: '8px', backgroundColor: saving ? '#9CA3AF' : '#111111', color: '#FFFFFF', fontSize: '13px', fontWeight: '600', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {saving ? <Loader2 size={15} /> : <Save size={15} />}
          {editing ? 'Save changes' : 'Create workspace'}
        </button>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</span>
      {children}
    </label>
  );
}

function OverviewNotes() {
  return (
    <div style={{ ...card, padding: '20px' }}>
      <SectionHeader title="Admin command center" subtitle="Sidebar modules now route to live management screens instead of static placeholders." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <InfoTile icon={<Database size={18} />} title="Live database" text="Workspace, booking, and member views read from PostgreSQL through Spring Boot APIs." />
        <InfoTile icon={<ShieldCheck size={18} />} title="JWT protected" text="Admin APIs require an authenticated token from the login flow." />
        <InfoTile icon={<Mail size={18} />} title="Async email" text="Booking confirmation notifications are handled outside the main transaction." />
      </div>
    </div>
  );
}

function ReportsPanel({ summary }: { summary: DashboardSummary | null }) {
  return (
    <div style={{ ...card, padding: '20px' }}>
      <SectionHeader title="Operational report" subtitle="Summary numbers calculated from wallet transactions, bookings, users, and workspace records." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <ReportStat label="Revenue" value={`VND ${vnd(summary?.revenue ?? 0)}`} />
        <ReportStat label="Bookings" value={String(summary?.totalBookings ?? 0)} />
        <ReportStat label="Users" value={String(summary?.activeMembers ?? 0)} />
        <ReportStat label="Occupancy" value={`${Math.round(summary?.occupancyRate ?? 0)}%`} />
      </div>
    </div>
  );
}

function SettingsPanel({
  settings,
  onChange,
}: {
  settings: { emailNotifications: boolean; publicWorkspaceCache: boolean; requireJwtForPayments: boolean };
  onChange: (settings: { emailNotifications: boolean; publicWorkspaceCache: boolean; requireJwtForPayments: boolean }) => void;
}) {
  return (
    <section style={{ ...card, padding: '20px', maxWidth: '840px' }}>
      <SectionHeader title="Runtime settings" subtitle="Project-level switches that explain how the current backend is configured." />
      <SettingToggle
        title="Email booking confirmation"
        text="BookingService triggers EmailService asynchronously after successful payment."
        checked={settings.emailNotifications}
        onChange={(checked) => onChange({ ...settings, emailNotifications: checked })}
      />
      <SettingToggle
        title="Cache public workspace list"
        text="WorkspaceService uses Spring cache for public workspace queries."
        checked={settings.publicWorkspaceCache}
        onChange={(checked) => onChange({ ...settings, publicWorkspaceCache: checked })}
      />
      <SettingToggle
        title="Require JWT for payments and profile APIs"
        text="Spring Security runs stateless JWT authentication before protected endpoints."
        checked={settings.requireJwtForPayments}
        onChange={(checked) => onChange({ ...settings, requireJwtForPayments: checked })}
      />
    </section>
  );
}

function SettingToggle({ title, text, checked, onChange }: { title: string; text: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: '16px 0', borderTop: '1px solid #F3F4F6', cursor: 'pointer' }}>
      <div>
        <p style={{ fontSize: '14px', fontWeight: '700', color: '#111111', marginBottom: '4px' }}>{title}</p>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.45 }}>{text}</p>
      </div>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#111111' }} />
    </label>
  );
}

function InfoTile({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px' }}>
      <div style={{ color: '#2563EB', marginBottom: '10px' }}>{icon}</div>
      <p style={{ fontSize: '14px', fontWeight: '700', color: '#111111', marginBottom: '6px' }}>{title}</p>
      <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.45 }}>{text}</p>
    </div>
  );
}

function ReportStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px' }}>
      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '18px', fontWeight: '700', color: '#111111' }}>{value}</p>
    </div>
  );
}

function splitEquipment(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')} ${formatTime(value)}`;
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(11, 16);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
