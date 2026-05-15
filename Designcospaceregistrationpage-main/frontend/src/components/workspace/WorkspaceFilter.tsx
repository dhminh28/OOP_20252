import type { WorkspaceType } from '../../types/workspace';

export type WorkspaceFilterType = 'All' | WorkspaceType;

interface WorkspaceFilterProps {
  filters: WorkspaceFilterType[];
  activeFilter: WorkspaceFilterType;
  onChange: (filter: WorkspaceFilterType) => void;
}

export function WorkspaceFilter({ filters, activeFilter, onChange }: WorkspaceFilterProps) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            style={{
              height: '32px',
              padding: '0 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: isActive ? '600' : '500',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              border: isActive ? 'none' : '1px solid #D1D5DB',
              backgroundColor: isActive ? '#111111' : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#374151',
              transition: 'all 0.12s',
            }}
            onMouseEnter={(event) => {
              if (!isActive) event.currentTarget.style.backgroundColor = '#F9FAFB';
            }}
            onMouseLeave={(event) => {
              if (!isActive) event.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
