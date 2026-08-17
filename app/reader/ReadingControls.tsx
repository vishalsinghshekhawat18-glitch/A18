import React from 'react';

export type ReadingTheme = 'sepia' | 'warm' | 'night';

interface Props {
  fontSize: number;
  theme: ReadingTheme;
  onFontSizeChange: (newSize: number) => void;
  onThemeChange: (theme: ReadingTheme) => void;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  onGoHome: () => void;
}

export const ReadingControls: React.FC<Props> = ({
  fontSize,
  theme,
  onFontSizeChange,
  onThemeChange,
  onOpenSearch,
  onToggleMobileMenu,
  onGoHome
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
        <button
          className="btn-control"
          onClick={onGoHome}
          title="Go to Command Center Home"
          style={{ fontWeight: 700 }}
        >
          🏠 Home
        </button>
        <div
          className="reader-header-title"
          onClick={onGoHome}
          style={{ cursor: 'pointer' }}
          title="Go to Command Center Home"
        >
          🏛️ Banking Command Center
        </div>
      </div>

      <div className="reading-controls">
        <button className="btn-search" onClick={onOpenSearch}>
          🔍 <span>Search</span> <kbd className="search-kbd">Ctrl+K</kbd>
        </button>

        {/* Theme Selector */}
        <div className="control-group">
          <span>Theme:</span>
          <button
            className={`btn-control ${theme === 'sepia' ? 'active-theme' : ''}`}
            onClick={() => onThemeChange('sepia')}
            title="Kindle Sepia"
          >
            📜 Sepia
          </button>
          <button
            className={`btn-control ${theme === 'warm' ? 'active-theme' : ''}`}
            onClick={() => onThemeChange('warm')}
            title="Kindle Warm Paper"
          >
            📄 Warm
          </button>
          <button
            className={`btn-control ${theme === 'night' ? 'active-theme' : ''}`}
            onClick={() => onThemeChange('night')}
            title="Kindle Night"
          >
            🌙 Night
          </button>
        </div>

        {/* Font Controls */}
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
