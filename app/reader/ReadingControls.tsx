import React from 'react';

interface Props {
  fontSize: number;
  onFontSizeChange: (newSize: number) => void;
  onOpenSearch: () => void;
}

export const ReadingControls: React.FC<Props> = ({
  fontSize,
  onFontSizeChange,
  onOpenSearch
}) => {
  return (
    <header className="reader-header">
      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        📖 Kindle Reading Mode (Warm Paper)
      </div>

      <div className="reading-controls">
        <button className="btn-search" onClick={onOpenSearch}>
          🔍 <span>Search</span> <kbd style={{ fontSize: '0.75rem', opacity: 0.7 }}>Ctrl+K</kbd>
        </button>

        <div className="control-group">
          <span>Font:</span>
          <button className="btn-control" onClick={() => onFontSizeChange(Math.max(14, fontSize - 1))}>A-</button>
          <span style={{ minWidth: '2.2ch', textAlign: 'center' }}>{fontSize}px</span>
          <button className="btn-control" onClick={() => onFontSizeChange(Math.min(24, fontSize + 1))}>A+</button>
        </div>
      </div>
    </header>
  );
};
