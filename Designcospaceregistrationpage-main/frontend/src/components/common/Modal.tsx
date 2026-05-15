import type { CSSProperties, ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  width?: CSSProperties['width'];
  maxHeight?: CSSProperties['maxHeight'];
  zIndex?: number;
}

export function Modal({ children, onClose, width = '440px', maxHeight, zIndex = 200 }: ModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width,
          maxHeight,
          overflowY: maxHeight ? 'auto' : undefined,
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
