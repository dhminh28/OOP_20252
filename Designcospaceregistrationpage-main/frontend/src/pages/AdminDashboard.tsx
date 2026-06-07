import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Ban,
  Briefcase,
  Check,
  Database,
  DollarSign,
  Download,
  Edit2,
  Loader2,
  Mail,
  Lock,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Unlock,
  Upload,
  UserCheck,
  UserPlus,
  Wrench,
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
  getRechargeRequests,
  approveRechargeRequest,
  rejectRechargeRequest,
  cancelBookingByAdmin,
  createAdminMember,
  exportWorkspaceExcel,
  importWorkspaceExcel,
  scheduleWorkspaceMaintenance,
  setAdminUserBlocked,
  type AdminBooking,
  type AdminRechargeRequest,
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
import {
  bookingStatusLabel,
  equipmentLabel,
  equipmentValue,
  userNameLabel,
  userRoleLabel,
  workspaceLocationLabel,
  workspaceNameLabel,
  workspaceStatusLabel,
  workspaceTypeLabel,
} from '../utils/displayText';
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
  address: 'Tòa nhà BMT, 32 Lê Duẩn',
  floor: '3',
  capacity: 8,
  pricePerHour: 150000,
  status: 'available',
  imageUrl: '',
  equipment: ['WiFi', 'Projector', 'Air conditioner'],
};

interface AdminDashboardProps {
  onLogout?: () => void;
  onGoHome?: () => void;
}

export function AdminDashboard({ onLogout, onGoHome }: AdminDashboardProps) {
  const excelInputRef = useRef<HTMLInputElement | null>(null);
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
  const [excelWorking, setExcelWorking] = useState(false);
  const [maintenanceWorkspace, setMaintenanceWorkspace] = useState<Workspace | null>(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    startTime: '',
    endTime: '',
    reason: '',
  });
  const [maintenanceSaving, setMaintenanceSaving] = useState(false);

  const [bookings, setBookings] = useState<PageResponse<AdminBooking> | null>(null);
  const [bookingPage, setBookingPage] = useState(0);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [bookingActionId, setBookingActionId] = useState<number | null>(null);

  const [rechargeRequests, setRechargeRequests] = useState<PageResponse<AdminRechargeRequest> | null>(null);
  const [rechargePage, setRechargePage] = useState(0);
  const [rechargesLoading, setRechargesLoading] = useState(false);
  const [rechargesError, setRechargesError] = useState<string | null>(null);
  const [rechargeActionId, setRechargeActionId] = useState<number | null>(null);

  const [users, setUsers] = useState<PageResponse<AdminUser> | null>(null);
  const [userPage, setUserPage] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userSaving, setUserSaving] = useState(false);
  const [userActionId, setUserActionId] = useState<number | null>(null);
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

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
      setSummaryError(error instanceof Error ? error.message : 'Không thể tải số liệu tổng quan.');
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
      setWorkspaceError(error instanceof Error ? error.message : 'Không thể tải danh sách không gian.');
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
      setBookingsError(error instanceof Error ? error.message : 'Không thể tải danh sách đặt chỗ.');
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
      setUsersError(error instanceof Error ? error.message : 'Không thể tải danh sách thành viên.');
    } finally {
      setUsersLoading(false);
    }
  }, [userPage]);

  const loadRechargeRequests = useCallback(async () => {
    setRechargesLoading(true);
    setRechargesError(null);
    try {
      setRechargeRequests(await getRechargeRequests({ page: rechargePage, size: 10 }));
    } catch (error) {
      setRechargesError(error instanceof Error ? error.message : 'Không thể tải yêu cầu nạp tiền.');
    } finally {
      setRechargesLoading(false);
    }
  }, [rechargePage]);

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

  useEffect(() => {
    if (activeNav === 'recharges') void loadRechargeRequests();
  }, [activeNav, loadRechargeRequests]);

  const kpiItems = useMemo(
    () => [
      {
        label: 'Tổng doanh thu',
        value: `${vnd(summary?.revenue ?? 0)} ₫`,
        trend: summaryLoading ? 'Đang tải số liệu' : 'Giao dịch thanh toán qua ví',
        trendColor: '#10B981',
        iconBg: '#EFF6FF',
        icon: DollarSign,
        iconColor: '#3B82F6',
      },
      {
        label: 'Lượt đặt thành công',
        value: String(summary?.totalBookings ?? 0),
        trend: summaryLoading ? 'Đang tải số liệu' : 'Lượt đặt chỗ đã thanh toán',
        trendColor: '#10B981',
        iconBg: '#F5F3FF',
        icon: Briefcase,
        iconColor: '#A855F7',
      },
      {
        label: 'Tài khoản đã đăng ký',
        value: String(summary?.activeMembers ?? 0),
        trend: summaryLoading ? 'Đang tải số liệu' : 'Tổng số tài khoản trong hệ thống',
        trendColor: '#10B981',
        iconBg: '#F0FDF4',
        icon: UserCheck,
        iconColor: '#22C55E',
      },
      {
        label: 'Tỷ lệ sử dụng',
        value: `${Math.round(summary?.occupancyRate ?? 0)}%`,
        trend: summaryLoading ? 'Đang tải số liệu' : 'Lượt đặt thành công theo không gian',
        trendColor: '#F59E0B',
        iconBg: '#FFFBEB',
        icon: TrendingUp,
        iconColor: '#F59E0B',
      },
    ],
    [summary, summaryLoading],
  );

  const title = {
    overview: 'Tổng quan quản trị',
    spaces: 'Quản lý không gian',
    bookings: 'Quản lý đặt chỗ',
    recharges: 'Phê duyệt nạp tiền',
    members: 'Danh sách thành viên',
    reports: 'Báo cáo',
    settings: 'Cài đặt hệ thống',
  }[activeNav];

  const openCreateWorkspace = () => {
    setEditingWorkspace(null);
    setWorkspaceForm(emptyWorkspaceForm);
    setShowWorkspaceModal(true);
  };

  const openEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setWorkspaceForm({
      name: workspaceNameLabel(workspace.name),
      type: workspace.type,
      address: workspaceLocationLabel(workspace.address ?? ''),
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
      setWorkspaceError(error instanceof Error ? error.message : 'Không thể lưu thông tin không gian.');
    } finally {
      setWorkspaceSaving(false);
    }
  };

  const removeWorkspace = async (workspace: Workspace) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa không gian "${workspaceNameLabel(workspace.name)}" không?`);
    if (!confirmed) return;

    setWorkspaceError(null);
    try {
      await deleteWorkspace(workspace.id);
      await loadWorkspaces();
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : 'Không thể xóa không gian.');
    }
  };

  const importExcel = async (file: File | undefined) => {
    if (!file) return;
    setExcelWorking(true);
    setWorkspaceError(null);
    try {
      const imported = await importWorkspaceExcel(file);
      setWorkspaceError(null);
      window.alert(`Đã nhập thành công ${imported} không gian từ Excel.`);
      await loadWorkspaces();
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : 'Không thể nhập file Excel.');
    } finally {
      setExcelWorking(false);
    }
  };

  const exportExcel = async () => {
    setExcelWorking(true);
    setWorkspaceError(null);
    try {
      await exportWorkspaceExcel();
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : 'Không thể xuất file Excel.');
    } finally {
      setExcelWorking(false);
    }
  };

  const openMaintenance = (workspace: Workspace) => {
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000);
    setMaintenanceWorkspace(workspace);
    setMaintenanceForm({
      startTime: toDateTimeLocal(now),
      endTime: toDateTimeLocal(later),
      reason: '',
    });
  };

  const saveMaintenance = async () => {
    if (!maintenanceWorkspace) return;
    setMaintenanceSaving(true);
    setWorkspaceError(null);
    try {
      const result = await scheduleWorkspaceMaintenance(
        maintenanceWorkspace.id,
        maintenanceForm,
      );
      setMaintenanceWorkspace(null);
      window.alert(
        `Đã chuyển phòng sang bảo trì. ${result.cancelledBookings} lịch bị hủy, hoàn ${vnd(result.refundedAmount)} ₫.`,
      );
      await Promise.all([loadWorkspaces(), loadSummary()]);
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : 'Không thể tạo lịch bảo trì.');
    } finally {
      setMaintenanceSaving(false);
    }
  };

  const openCreateUser = () => {
    setUserForm({ fullName: '', email: '', password: '12345678', phone: '' });
    setShowUserModal(true);
  };

  const saveUser = async () => {
    setUserSaving(true);
    setUsersError(null);
    try {
      await createAdminMember({
        fullName: userForm.fullName.trim(),
        email: userForm.email.trim(),
        password: userForm.password,
        phone: userForm.phone.trim() || undefined,
      });
      setShowUserModal(false);
      await Promise.all([loadUsers(), loadSummary()]);
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : 'Không thể tạo thành viên.');
    } finally {
      setUserSaving(false);
    }
  };

  const toggleUserBlocked = async (user: AdminUser) => {
    const action = user.blocked ? 'mở khóa' : 'khóa';
    if (!window.confirm(`Bạn có chắc muốn ${action} tài khoản ${user.email}?`)) return;
    setUserActionId(user.id);
    setUsersError(null);
    try {
      await setAdminUserBlocked(user.id, !user.blocked);
      await loadUsers();
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : `Không thể ${action} tài khoản.`);
    } finally {
      setUserActionId(null);
    }
  };

  const approveRecharge = async (request: AdminRechargeRequest) => {
    if (!window.confirm(`Phê duyệt yêu cầu nạp ${vnd(request.amount)} ₫ của ${request.memberName}?`)) {
      return;
    }
    setRechargeActionId(request.id);
    setRechargesError(null);
    try {
      await approveRechargeRequest(request.id);
      await Promise.all([loadRechargeRequests(), loadSummary()]);
    } catch (error) {
      setRechargesError(error instanceof Error ? error.message : 'Không thể phê duyệt yêu cầu.');
    } finally {
      setRechargeActionId(null);
    }
  };

  const rejectRecharge = async (request: AdminRechargeRequest) => {
    const reason = window.prompt(`Lý do từ chối yêu cầu của ${request.memberName}:`);
    if (!reason?.trim()) return;

    setRechargeActionId(request.id);
    setRechargesError(null);
    try {
      await rejectRechargeRequest(request.id, reason.trim());
      await loadRechargeRequests();
    } catch (error) {
      setRechargesError(error instanceof Error ? error.message : 'Không thể từ chối yêu cầu.');
    } finally {
      setRechargeActionId(null);
    }
  };

  const cancelAdminBooking = async (booking: AdminBooking) => {
    const reason = window.prompt(`Lý do Admin hủy lịch #${booking.id}:`);
    if (!reason?.trim()) return;

    setBookingActionId(booking.id);
    setBookingsError(null);
    try {
      await cancelBookingByAdmin(booking.id, reason.trim());
      await Promise.all([loadBookings(), loadSummary()]);
    } catch (error) {
      setBookingsError(error instanceof Error ? error.message : 'Không thể hủy lịch đặt chỗ.');
    } finally {
      setBookingActionId(null);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'DM Sans, sans-serif' }}>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} onGoHome={onGoHome} onLogout={onLogout} />

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
                if (activeNav === 'recharges') void loadRechargeRequests();
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
              aria-label="Tải lại dữ liệu"
              title="Tải lại dữ liệu"
            >
              <RefreshCw size={16} />
            </button>
            <div style={{ padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#6B7280' }}>
              {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </header>

        <div style={{ padding: '24px' }}>
          {(activeNav === 'overview' || activeNav === 'reports') && (
            <>
              <StatusBanner loading={summaryLoading} error={summaryError} loadingText="Đang tải số liệu quản trị..." />
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
                title="Danh sách không gian"
                subtitle="Tạo mới, chỉnh sửa và xóa không gian đang có trong hệ thống."
                actionLabel="Thêm không gian"
                onAction={openCreateWorkspace}
              />
              <input
                ref={excelInputRef}
                type="file"
                accept=".xlsx"
                style={{ display: 'none' }}
                onChange={(event) => {
                  void importExcel(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <ActionButton
                  label={excelWorking ? 'Đang xử lý...' : 'Nhập từ Excel'}
                  icon={excelWorking ? <Loader2 size={15} /> : <Upload size={15} />}
                  onClick={() => excelInputRef.current?.click()}
                  disabled={excelWorking}
                />
                <ActionButton
                  label="Xuất Excel"
                  icon={<Download size={15} />}
                  onClick={() => void exportExcel()}
                  disabled={excelWorking}
                />
              </div>
              <StatusBanner loading={workspaceLoading} error={workspaceError} loadingText="Đang tải danh sách không gian..." />
              <WorkspaceTable
                workspaces={workspaces?.content ?? []}
                onEdit={openEditWorkspace}
                onDelete={removeWorkspace}
                onMaintenance={openMaintenance}
              />
              <Pager page={workspacePage} totalPages={workspaces?.totalPages ?? 0} onPageChange={setWorkspacePage} />
            </section>
          )}

          {activeNav === 'bookings' && (
            <section style={{ ...card, padding: '20px' }}>
              <SectionHeader title="Tất cả lượt đặt chỗ" subtitle="Dữ liệu đặt chỗ của toàn bộ thành viên và không gian." />
              <StatusBanner loading={bookingsLoading} error={bookingsError} loadingText="Đang tải danh sách đặt chỗ..." />
              <BookingsTable
                bookings={bookings?.content ?? []}
                actionId={bookingActionId}
                onCancel={cancelAdminBooking}
              />
              <Pager page={bookingPage} totalPages={bookings?.totalPages ?? 0} onPageChange={setBookingPage} />
            </section>
          )}

          {activeNav === 'recharges' && (
            <section style={{ ...card, padding: '20px' }}>
              <SectionHeader
                title="Yêu cầu nạp tiền đang chờ"
                subtitle="Tiền chỉ được cộng vào ví sau khi Admin phê duyệt yêu cầu."
              />
              <StatusBanner
                loading={rechargesLoading}
                error={rechargesError}
                loadingText="Đang tải yêu cầu nạp tiền..."
              />
              <RechargeRequestsTable
                requests={rechargeRequests?.content ?? []}
                actionId={rechargeActionId}
                onApprove={approveRecharge}
                onReject={rejectRecharge}
              />
              <Pager
                page={rechargePage}
                totalPages={rechargeRequests?.totalPages ?? 0}
                onPageChange={setRechargePage}
              />
            </section>
          )}

          {activeNav === 'members' && (
            <section style={{ ...card, padding: '20px' }}>
              <SectionHeader
                title="Thành viên và quản trị viên"
                subtitle="Các tài khoản đã đăng ký trong hệ thống."
                actionLabel="Tạo thành viên"
                onAction={openCreateUser}
              />
              <StatusBanner loading={usersLoading} error={usersError} loadingText="Đang tải danh sách thành viên..." />
              <UsersTable
                users={users?.content ?? []}
                actionId={userActionId}
                onToggleBlocked={toggleUserBlocked}
              />
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
      {maintenanceWorkspace && (
        <MaintenanceModal
          workspace={maintenanceWorkspace}
          form={maintenanceForm}
          saving={maintenanceSaving}
          onChange={setMaintenanceForm}
          onClose={() => setMaintenanceWorkspace(null)}
          onSave={saveMaintenance}
        />
      )}
      {showUserModal && (
        <CreateUserModal
          form={userForm}
          saving={userSaving}
          onChange={setUserForm}
          onClose={() => setShowUserModal(false)}
          onSave={saveUser}
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

function WorkspaceTable({
  workspaces,
  onEdit,
  onDelete,
  onMaintenance,
}: {
  workspaces: Workspace[];
  onEdit: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void;
  onMaintenance: (workspace: Workspace) => void;
}) {
  return (
    <DataTable
      headers={['Tên', 'Loại', 'Vị trí', 'Sức chứa', 'Giá mỗi giờ', 'Trạng thái', 'Thao tác']}
      emptyText="Chưa có không gian nào."
      rows={workspaces.map((workspace) => [
        <strong>{workspaceNameLabel(workspace.name)}</strong>,
        <Badge label={workspaceTypeLabel(workspace.type)} tone={workspace.type === 'Meeting Room' ? 'purple' : workspace.type === 'Hot Desk' ? 'blue' : 'amber'} />,
        workspaceLocationLabel(workspace.floor),
        `${workspace.capacity} người`,
        `${vnd(workspace.pricePerHour)} ₫`,
        <Badge label={workspaceStatusLabel(workspace.status)} tone={workspace.status === 'available' ? 'green' : workspace.status === 'maintenance' ? 'gray' : 'amber'} />,
        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton label="Chỉnh sửa" onClick={() => onEdit(workspace)} icon={<Edit2 size={14} />} />
          <IconButton label="Báo bảo trì" onClick={() => onMaintenance(workspace)} icon={<Wrench size={14} />} />
          <IconButton label="Xóa" onClick={() => onDelete(workspace)} icon={<Trash2 size={14} />} danger />
        </div>,
      ])}
    />
  );
}

function BookingsTable({
  bookings,
  actionId,
  onCancel,
}: {
  bookings: AdminBooking[];
  actionId: number | null;
  onCancel: (booking: AdminBooking) => void;
}) {
  return (
    <DataTable
      headers={['Mã', 'Thành viên', 'Không gian', 'Thời gian', 'Chi phí', 'Trạng thái', 'Ghi chú', 'Thao tác']}
      emptyText="Chưa có lượt đặt chỗ nào."
      rows={bookings.map((booking) => [
        `#${booking.id}`,
        <div>
          <strong>{userNameLabel(booking.memberName)}</strong>
          <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>{booking.memberEmail}</p>
        </div>,
        workspaceNameLabel(booking.workspaceName),
        `${formatDateTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
        `${vnd(booking.totalAmount)} ₫`,
        <Badge label={bookingStatusLabel(booking.status)} tone={booking.status === 'CANCELLED' ? 'red' : booking.status === 'PENDING' ? 'amber' : 'green'} />,
        booking.note ?? '-',
        booking.status === 'CANCELLED' ? (
          '-'
        ) : (
          <IconButton
            label={actionId === booking.id ? 'Đang hủy' : 'Admin hủy lịch'}
            onClick={() => onCancel(booking)}
            icon={actionId === booking.id ? <Loader2 size={14} /> : <Ban size={14} />}
            danger
            disabled={actionId !== null}
          />
        ),
      ])}
    />
  );
}

function RechargeRequestsTable({
  requests,
  actionId,
  onApprove,
  onReject,
}: {
  requests: AdminRechargeRequest[];
  actionId: number | null;
  onApprove: (request: AdminRechargeRequest) => void;
  onReject: (request: AdminRechargeRequest) => void;
}) {
  return (
    <DataTable
      headers={['Mã', 'Thành viên', 'Số tiền', 'Ngày yêu cầu', 'Trạng thái', 'Thao tác']}
      emptyText="Không có yêu cầu nạp tiền nào đang chờ."
      rows={requests.map((request) => [
        `#${request.id}`,
        <div>
          <strong>{userNameLabel(request.memberName)}</strong>
          <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>{request.memberEmail}</p>
        </div>,
        <strong>{vnd(request.amount)} ₫</strong>,
        formatDateTime(request.createdAt),
        <Badge label="Đang chờ" tone="amber" />,
        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton
            label={actionId === request.id ? 'Đang xử lý' : 'Phê duyệt'}
            onClick={() => onApprove(request)}
            icon={actionId === request.id ? <Loader2 size={14} /> : <Check size={14} />}
            disabled={actionId !== null}
          />
          <IconButton
            label="Từ chối"
            onClick={() => onReject(request)}
            icon={<Ban size={14} />}
            danger
            disabled={actionId !== null}
          />
        </div>,
      ])}
    />
  );
}

function UsersTable({
  users,
  actionId,
  onToggleBlocked,
}: {
  users: AdminUser[];
  actionId: number | null;
  onToggleBlocked: (user: AdminUser) => void;
}) {
  return (
    <DataTable
      headers={['Mã', 'Họ và tên', 'Thư điện tử', 'Số điện thoại', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Thao tác']}
      emptyText="Chưa có tài khoản nào."
      rows={users.map((user) => [
        `#${user.id}`,
        <strong>{userNameLabel(user.fullName)}</strong>,
        user.email,
        user.phone ?? '-',
        <Badge label={userRoleLabel(user.role)} tone={user.role === 'ADMIN' ? 'purple' : 'blue'} />,
        <Badge label={user.blocked ? 'Đã khóa' : 'Hoạt động'} tone={user.blocked ? 'red' : 'green'} />,
        formatDateTime(user.createdAt),
        user.role === 'ADMIN' ? (
          '-'
        ) : (
          <IconButton
            label={user.blocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
            icon={
              actionId === user.id
                ? <Loader2 size={14} />
                : user.blocked
                  ? <Unlock size={14} />
                  : <Lock size={14} />
            }
            onClick={() => onToggleBlocked(user)}
            danger={!user.blocked}
            disabled={actionId !== null}
          />
        ),
      ])}
    />
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        height: '34px',
        padding: '0 12px',
        borderRadius: '7px',
        border: '1px solid #D1D5DB',
        backgroundColor: '#FFFFFF',
        color: disabled ? '#9CA3AF' : '#374151',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        fontWeight: '600',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {icon}
      {label}
    </button>
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
        Trước
      </button>
      <span style={{ fontSize: '13px', color: '#6B7280' }}>
        Trang {totalPages === 0 ? 0 : page + 1} / {totalPages}
      </span>
      <button disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)} style={pagerButton(page + 1 >= totalPages)}>
        Sau
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

function IconButton({
  label,
  icon,
  onClick,
  danger = false,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
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
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? '#9CA3AF' : danger ? '#B91C1C' : '#2563EB',
        opacity: disabled ? 0.65 : 1,
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

  const equipmentText = (form.equipment ?? []).map(equipmentLabel).join(', ');

  return (
    <Modal onClose={onClose} width="620px" maxHeight="90vh">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111111' }}>{editing ? 'Chỉnh sửa không gian' : 'Thêm không gian'}</h2>
        <button onClick={onClose} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        <Field label="Tên không gian">
          <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Phòng họp A" style={inputBase} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Loại không gian">
            <select value={form.type} onChange={(event) => update('type', event.target.value as WorkspaceType)} style={inputBase}>
              <option value="Hot Desk">Bàn làm việc chung</option>
              <option value="Meeting Room">Phòng họp</option>
              <option value="Private Office">Văn phòng riêng</option>
            </select>
          </Field>
          <Field label="Trạng thái">
            <select value={form.status} onChange={(event) => update('status', event.target.value as WorkspaceStatus)} style={inputBase}>
              <option value="available">Còn trống</option>
              <option value="busy">Đang bận</option>
              <option value="maintenance">Đang bảo trì</option>
            </select>
          </Field>
        </div>
        <Field label="Địa chỉ">
          <input value={form.address} onChange={(event) => update('address', event.target.value)} style={inputBase} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
          <Field label="Tầng">
            <input value={form.floor ?? ''} onChange={(event) => update('floor', event.target.value)} style={inputBase} />
          </Field>
          <Field label="Sức chứa">
            <input type="number" value={form.capacity} onChange={(event) => update('capacity', Number(event.target.value))} style={inputBase} />
          </Field>
          <Field label="Giá mỗi giờ">
            <input type="number" value={form.pricePerHour} onChange={(event) => update('pricePerHour', Number(event.target.value))} style={inputBase} />
          </Field>
        </div>
        <Field label="Đường dẫn hình ảnh">
          <input value={form.imageUrl ?? ''} onChange={(event) => update('imageUrl', event.target.value)} placeholder="https://..." style={inputBase} />
        </Field>
        <Field label="Tiện nghi">
          <input value={equipmentText} onChange={(event) => update('equipment', splitEquipment(event.target.value))} placeholder="Wi-Fi, Máy chiếu, Bảng trắng" style={inputBase} />
        </Field>
      </div>

      <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '22px 0 18px' }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={onClose} disabled={saving} style={{ height: '36px', padding: '0 18px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#374151', fontSize: '13px', fontWeight: '600', border: '1px solid #D1D5DB', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          Hủy
        </button>
        <button onClick={onSave} disabled={saving || !form.name || !form.address} style={{ height: '36px', padding: '0 18px', borderRadius: '8px', backgroundColor: saving ? '#9CA3AF' : '#111111', color: '#FFFFFF', fontSize: '13px', fontWeight: '600', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {saving ? <Loader2 size={15} /> : <Save size={15} />}
          {editing ? 'Lưu thay đổi' : 'Tạo không gian'}
        </button>
      </div>
    </Modal>
  );
}

function MaintenanceModal({
  workspace,
  form,
  saving,
  onChange,
  onClose,
  onSave,
}: {
  workspace: Workspace;
  form: { startTime: string; endTime: string; reason: string };
  saving: boolean;
  onChange: (form: { startTime: string; endTime: string; reason: string }) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Modal onClose={onClose} width="520px">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#111111' }}>Báo bảo trì</h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
            {workspaceNameLabel(workspace.name)}
          </p>
        </div>
        <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}>
          <X size={20} />
        </button>
      </div>
      <div style={{ display: 'grid', gap: '14px' }}>
        <Field label="Bắt đầu bảo trì">
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(event) => onChange({ ...form, startTime: event.target.value })}
            style={inputBase}
          />
        </Field>
        <Field label="Kết thúc bảo trì">
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(event) => onChange({ ...form, endTime: event.target.value })}
            style={inputBase}
          />
        </Field>
        <Field label="Lý do">
          <textarea
            value={form.reason}
            onChange={(event) => onChange({ ...form, reason: event.target.value })}
            rows={4}
            placeholder="Ví dụ: Bảo trì hệ thống điều hòa"
            style={{ ...inputBase, height: 'auto', padding: '10px', resize: 'vertical' }}
          />
        </Field>
      </div>
      <div style={{ padding: '12px', marginTop: '16px', borderRadius: '8px', backgroundColor: '#FFFBEB', color: '#92400E', fontSize: '12px', lineHeight: 1.5 }}>
        Các lịch thành công bị trùng khoảng bảo trì sẽ bị hủy, hoàn tiền và gửi thông báo tự động.
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '9px', marginTop: '20px' }}>
        <ActionButton label="Đóng" icon={<X size={14} />} onClick={onClose} disabled={saving} />
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !form.startTime || !form.endTime || !form.reason.trim()}
          style={{
            height: '36px',
            padding: '0 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: saving ? '#9CA3AF' : '#B91C1C',
            color: '#FFFFFF',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}
        >
          {saving ? <Loader2 size={15} /> : <Wrench size={15} />}
          Xác nhận bảo trì
        </button>
      </div>
    </Modal>
  );
}

function CreateUserModal({
  form,
  saving,
  onChange,
  onClose,
  onSave,
}: {
  form: { fullName: string; email: string; password: string; phone: string };
  saving: boolean;
  onChange: (form: { fullName: string; email: string; password: string; phone: string }) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Modal onClose={onClose} width="520px">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#111111' }}>Tạo thành viên</h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Tạo tài khoản member và ví trống đi kèm.</p>
        </div>
        <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}>
          <X size={20} />
        </button>
      </div>
      <div style={{ display: 'grid', gap: '14px' }}>
        <Field label="Họ và tên">
          <input value={form.fullName} onChange={(event) => onChange({ ...form, fullName: event.target.value })} style={inputBase} />
        </Field>
        <Field label="Thư điện tử">
          <input type="email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} style={inputBase} />
        </Field>
        <Field label="Số điện thoại">
          <input value={form.phone} onChange={(event) => onChange({ ...form, phone: event.target.value })} style={inputBase} />
        </Field>
        <Field label="Mật khẩu ban đầu">
          <input type="text" value={form.password} onChange={(event) => onChange({ ...form, password: event.target.value })} style={inputBase} />
        </Field>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '9px', marginTop: '20px' }}>
        <ActionButton label="Hủy" icon={<X size={14} />} onClick={onClose} disabled={saving} />
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !form.fullName.trim() || !form.email.trim() || form.password.length < 8}
          style={{
            height: '36px',
            padding: '0 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: saving ? '#9CA3AF' : '#111111',
            color: '#FFFFFF',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}
        >
          {saving ? <Loader2 size={15} /> : <UserPlus size={15} />}
          Tạo thành viên
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
      <SectionHeader title="Trung tâm quản trị" subtitle="Các chức năng trong thanh bên được kết nối với dữ liệu thực tế của hệ thống." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <InfoTile icon={<Database size={18} />} title="Dữ liệu trực tiếp" text="Không gian, đặt chỗ và thành viên được đọc từ PostgreSQL thông qua API Spring Boot." />
        <InfoTile icon={<ShieldCheck size={18} />} title="Bảo vệ bằng JWT" text="API quản trị yêu cầu mã xác thực hợp lệ từ phiên đăng nhập." />
        <InfoTile icon={<Mail size={18} />} title="Thư điện tử bất đồng bộ" text="Thông báo xác nhận đặt chỗ được gửi mà không làm gián đoạn giao dịch chính." />
      </div>
    </div>
  );
}

function ReportsPanel({ summary }: { summary: DashboardSummary | null }) {
  return (
    <div style={{ ...card, padding: '20px' }}>
      <SectionHeader title="Báo cáo vận hành" subtitle="Số liệu được tổng hợp từ giao dịch ví, đặt chỗ, người dùng và không gian." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <ReportStat label="Doanh thu" value={`${vnd(summary?.revenue ?? 0)} ₫`} />
        <ReportStat label="Lượt đặt chỗ" value={String(summary?.totalBookings ?? 0)} />
        <ReportStat label="Người dùng" value={String(summary?.activeMembers ?? 0)} />
        <ReportStat label="Tỷ lệ sử dụng" value={`${Math.round(summary?.occupancyRate ?? 0)}%`} />
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
      <SectionHeader title="Cài đặt vận hành" subtitle="Các tùy chọn thể hiện cách máy chủ hiện đang được cấu hình." />
      <SettingToggle
        title="Thư xác nhận đặt chỗ"
        text="Hệ thống gửi thư điện tử bất đồng bộ sau khi thanh toán thành công."
        checked={settings.emailNotifications}
        onChange={(checked) => onChange({ ...settings, emailNotifications: checked })}
      />
      <SettingToggle
        title="Lưu đệm danh sách không gian công khai"
        text="Danh sách không gian công khai sử dụng bộ nhớ đệm của Spring để tải nhanh hơn."
        checked={settings.publicWorkspaceCache}
        onChange={(checked) => onChange({ ...settings, publicWorkspaceCache: checked })}
      />
      <SettingToggle
        title="Yêu cầu JWT cho thanh toán và hồ sơ"
        text="Spring Security xác thực JWT trước khi cho phép truy cập các API được bảo vệ."
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
    .map(equipmentValue)
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

function toDateTimeLocal(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}
