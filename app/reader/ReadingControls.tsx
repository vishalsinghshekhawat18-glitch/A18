import React from 'react';

interface Props {
  fontSize: number;
  onFontSizeChange: (newSize: number) => void;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
}

export const ReadingControls: React.FC<Props> = ({
  fontSize,
  onFontSizeChange,
  onOpenSearch,
  onToggleMobileMenu
}) => {
  return (
    <header className="reader-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <button
          className="btn-hamburger"
          onClick={onToggleMobileMenu}
          aria-label="Open Navigation Menu"
        >
          ☰
        </button>
        <div className="reader-header-title">
          📖 Kindle Reading Mode
        </div>
      </div>

      <div className="reading-controls">
        <button className="btn-search" onClick={onOpenSearch}>
          🔍 <span>Search</span> <kbd className="search-kbd">Ctrl+K</kbd>
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
