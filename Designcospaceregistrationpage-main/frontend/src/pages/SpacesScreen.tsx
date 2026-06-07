import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, RefreshCcw, Search } from 'lucide-react';
import { WorkspaceCard } from '../components/workspace/WorkspaceCard';
import { WorkspaceDetailModal } from '../components/workspace/WorkspaceDetailModal';
import { WorkspaceFilter, type WorkspaceFilterType } from '../components/workspace/WorkspaceFilter';
import { getAllWorkspaces } from '../services/workspaceService';
import type { Workspace } from '../types/workspace';

const FILTERS: WorkspaceFilterType[] = ['All', 'Hot Desk', 'Meeting Room', 'Private Office'];
const PAGE_SIZE = 6;

const inputStyle: React.CSSProperties = {
  height: '38px',
  padding: '0 12px',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  fontSize: '14px',
  color: '#111111',
  fontFamily: 'DM Sans, sans-serif',
  backgroundColor: '#FFFFFF',
  outline: 'none',
  boxSizing: 'border-box',
};

export function SpacesScreen({ onBook }: { onBook?: (workspace: Workspace) => void }) {
  const [activeFilter, setActiveFilter] = useState<WorkspaceFilterType>('All');
  const [search, setSearch] = useState('');
  const [minCapacity, setMinCapacity] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedSpace, setSelectedSpace] = useState<Workspace | null>(null);
  const [spaces, setSpaces] = useState<Workspace[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSpaces = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllWorkspaces({
        page: page - 1,
        size: PAGE_SIZE,
        type: activeFilter,
        minCapacity,
        maxPrice,
      });
      setSpaces(result.content);
      setCurrentPage(result.number + 1);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải danh sách không gian.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSpaces(currentPage);
  }, [activeFilter, minCapacity, maxPrice, currentPage]);

  const visibleSpaces = spaces.filter((space) => {
    const searchText = search.toLowerCase().trim();
    if (!searchText) {
      return true;
    }

    return (
      space.name.toLowerCase().includes(searchText) ||
      space.type.toLowerCase().includes(searchText) ||
      space.floor.toLowerCase().includes(searchText)
    );
  });

  const handleFilterChange = (filter: WorkspaceFilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleBook = (workspace: Workspace) => {
    setSelectedSpace(null);
    onBook?.(workspace);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.max(totalPages, 1) || page === currentPage) {
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 40px 72px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif', margin: 0, letterSpacing: '0' }}>
            Không gian làm việc
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif', margin: '4px 0 0' }}>
            Hiển thị {visibleSpaces.length} trong tổng số {totalElements} không gian phù hợp.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '11px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none',
              }}
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm trong trang hiện tại..."
              style={{ ...inputStyle, width: '100%', paddingLeft: '34px' }}
            />
          </div>

          <button
            onClick={() => void loadSpaces(currentPage)}
            disabled={loading}
            title="Tải lại"
            aria-label="Tải lại danh sách không gian"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {loading ? <Loader2 size={16} /> : <RefreshCcw size={15} />}
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 140px 170px',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '14px',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <WorkspaceFilter filters={FILTERS} activeFilter={activeFilter} onChange={handleFilterChange} />
        <input
          type="number"
          min="1"
          value={minCapacity}
          onChange={(event) => {
            setMinCapacity(event.target.value === '' ? '' : Number(event.target.value));
            setCurrentPage(1);
          }}
          placeholder="Sức chứa từ"
          style={{ ...inputStyle, width: '100%' }}
        />
        <input
          type="number"
          min="0"
          step="50000"
          value={maxPrice}
          onChange={(event) => {
            setMaxPrice(event.target.value === '' ? '' : Number(event.target.value));
            setCurrentPage(1);
          }}
          placeholder="Giá tối đa"
          style={{ ...inputStyle, width: '100%' }}
        />
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px', color: '#6B7280', gap: '10px' }}>
          <Loader2 size={18} />
          <span>Đang tải danh sách không gian...</span>
        </div>
      ) : visibleSpaces.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px' }}>
          {visibleSpaces.map((space) => (
            <WorkspaceCard
              key={space.id}
              space={space}
              onBook={() => handleBook(space)}
              onOpenDetail={() => setSelectedSpace(space)}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#9CA3AF', fontSize: '15px', fontFamily: 'DM Sans, sans-serif' }}>
          Không có không gian nào phù hợp với bộ lọc hiện tại.
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '22px' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          style={pageButtonStyle(false, currentPage <= 1 || loading)}
        >
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontSize: '13px', color: '#6B7280', minWidth: '110px', textAlign: 'center' }}>
          Trang {totalPages === 0 ? 0 : currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          style={pageButtonStyle(false, currentPage >= totalPages || loading)}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {selectedSpace && (
        <WorkspaceDetailModal
          space={selectedSpace}
          onClose={() => setSelectedSpace(null)}
          onBook={() => handleBook(selectedSpace)}
        />
      )}
    </div>
  );
}

function pageButtonStyle(active: boolean, disabled = false): React.CSSProperties {
  return {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: active ? '600' : '500',
    backgroundColor: active ? '#111111' : '#FFFFFF',
    color: disabled ? '#D1D5DB' : active ? '#FFFFFF' : '#374151',
    border: active ? 'none' : '1px solid #D1D5DB',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}
