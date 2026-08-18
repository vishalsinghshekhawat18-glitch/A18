import React, { useMemo } from 'react';

export type ReadingTheme = 'light' | 'sepia' | 'warm' | 'night';

interface Props {
  fontSize: number;
  theme: ReadingTheme;
  activeItemId?: string;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  onFontSizeChange: (newSize: number) => void;
  onThemeChange: (theme: ReadingTheme) => void;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  onGoHome: () => void;
}

export const ReadingControls: React.FC<Props> = ({
  fontSize,
  theme,
  activeItemId,
  isCompleted = false,
  onToggleComplete,
  onFontSizeChange,
  onThemeChange,
  onOpenSearch,
  onToggleMobileMenu,
  onGoHome
}) => {
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  }, []);

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
          style={{ cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 800, color: '#9e3b24', letterSpacing: '0.03em' }}
          title="Go to Command Center Home"
        >
          {formattedDate}
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
            className={`btn-control ${theme === 'light' ? 'active-theme' : ''}`}
            onClick={() => onThemeChange('light')}
            title="Clean Light Theme"
          >
            ☀️ Light
          </button>
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

        {/* Item Completion Action (Active when reading an item) */}
        {activeItemId && onToggleComplete && (
          <div className="control-group" style={{ marginLeft: '0.4rem' }}>
            <button
              className={`btn-control btn-completion-toggle ${isCompleted ? 'is-completed' : ''}`}
              onClick={onToggleComplete}
              aria-label={isCompleted ? "Mark item as uncompleted" : "Mark item as completed"}
              title={isCompleted ? "Marked as Completed (Click to undo)" : "Mark as Completed"}
              style={isCompleted ? {
                background: '#2e7d32',
                color: '#ffffff',
                borderColor: '#2e7d32',
                fontWeight: 700
              } : {
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              {isCompleted ? '✓ Completed' : '○ Mark Complete'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
