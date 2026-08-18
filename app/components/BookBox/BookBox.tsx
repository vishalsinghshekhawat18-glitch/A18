import React, { useState, useMemo, useEffect } from 'react';
import { privateBooksData } from './privateBooksData';
import './BookBox.css';

export const BookBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedItemId) {
          setSelectedItemId(null);
        } else {
          setIsOpen(false);
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedItemId]);

  const filteredItems = useMemo(() => {
    return privateBooksData.filter(item => {
      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchMood = selectedMood === 'all' || item.mood === selectedMood;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.coreTruth.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchMood && matchSearch;
    });
  }, [selectedType, selectedMood, searchQuery]);

  const activeItem = useMemo(() => {
    return privateBooksData.find(i => i.id === selectedItemId) || null;
  }, [selectedItemId]);

  return (
    <>
      {/* --- Floating Bottom Trigger (Compact & Private) --- */}
      <div className="bookbox-bottom-trigger-container">
        <button
          className="bookbox-bottom-pill-btn"
          onClick={() => setIsOpen(true)}
          title="Open Private Book Box & Knowledge Vault"
          aria-label="Open Private Book Box"
        >
          <span className="bookbox-pill-icon">📚</span>
          <span className="bookbox-pill-title">Private Book Box</span>
          <span className="bookbox-pill-badge">{privateBooksData.length}</span>
        </button>
      </div>

      {/* --- Isolated Private Modal / Drawer --- */}
      {isOpen && (
        <div className="bookbox-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="bookbox-modal-window"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="bookbox-modal-header">
              <div className="bookbox-modal-title-group">
                <span className="bookbox-lock-badge">🔒 STRICTLY PRIVATE</span>
                <h2 className="bookbox-modal-heading">Private Book Box & Knowledge Vault</h2>
                <p className="bookbox-modal-subtitle">
                  Standalone Second Brain • Books, Shers, Quotes, Poems, Research Papers
                </p>
              </div>

              <button
                className="bookbox-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close Private Book Box (Esc)"
              >
                ✕
              </button>
            </div>

            {/* If an item is selected, show its full reading view */}
            {activeItem ? (
              <div className="bookbox-reader-container">
                <div className="bookbox-reader-top-bar">
                  <button
                    className="bookbox-back-btn"
                    onClick={() => setSelectedItemId(null)}
                  >
                    ← Back to Library
                  </button>
                  <div className="bookbox-item-meta-pills">
                    <span className="bookbox-tag-pill">{activeItem.readTime}</span>
                    <span className="bookbox-tag-pill mood-pill">Mood: {activeItem.mood}</span>
                    <span className="bookbox-tag-pill lang-pill">{activeItem.language}</span>
                  </div>
                </div>

                <article className="bookbox-article">
                  <header className="bookbox-article-header">
                    <h1 className="bookbox-article-title">{activeItem.title}</h1>
                    <div className="bookbox-article-author">
                      By <strong>{activeItem.author}</strong> {activeItem.year ? `(${activeItem.year})` : ''}
                    </div>

                    <div className="bookbox-feynman-box">
                      <div className="bookbox-feynman-label">⚡ First-Principle Truth</div>
                      <div className="bookbox-feynman-text">{activeItem.coreTruth}</div>
                    </div>
                  </header>

                  <div className="bookbox-sections-body">
                    {activeItem.sections.map((sec, sIdx) => {
                      if (sec.isCallout) {
                        return (
                          <div key={sIdx} className="bookbox-callout-card">
                            <div className="bookbox-callout-icon">{sec.calloutIcon || '💡'}</div>
                            <div className="bookbox-callout-text">
                              <h4 className="bookbox-callout-heading">{sec.heading}</h4>
                              <p>{sec.content}</p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={sIdx} className="bookbox-section-block">
                          {sec.level === 3 ? (
                            <h3 className="bookbox-h3">{sec.heading}</h3>
                          ) : (
                            <h2 className="bookbox-h2">{sec.heading}</h2>
                          )}
                          <div className="bookbox-paragraph">
                            {sec.content.split('\n').map((line, lIdx) => (
                              <p key={lIdx}>{line}</p>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </div>
            ) : (
              /* Otherwise, show the Grid & Search list view */
              <div className="bookbox-main-content">
                {/* Search & Filter Controls */}
                <div className="bookbox-controls-bar">
                  <div className="bookbox-search-wrapper">
                    <span className="bookbox-search-icon">🔍</span>
                    <input
                      type="text"
                      className="bookbox-search-input"
                      placeholder="Search books, authors, shers, quotes, or themes..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        className="bookbox-clear-search-btn"
                        onClick={() => setSearchQuery('')}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="bookbox-filter-row">
                    <div className="bookbox-filter-group">
                      <span className="bookbox-filter-label">Type:</span>
                      {['all', 'book', 'sher_shayari', 'quote', 'poem', 'research_paper'].map(type => (
                        <button
                          key={type}
                          className={`bookbox-filter-pill ${selectedType === type ? 'active' : ''}`}
                          onClick={() => setSelectedType(type)}
                        >
                          {type === 'all'
                            ? `All (${privateBooksData.length})`
                            : type === 'book'
                            ? '📖 Books'
                            : type === 'sher_shayari'
                            ? '📜 Shers & Shayaris'
                            : type === 'quote'
                            ? '💬 Quotes'
                            : type === 'poem'
                            ? '🖋️ Poems'
                            : '🔬 Papers'}
                        </button>
                      ))}
                    </div>

                    <div className="bookbox-filter-group">
                      <span className="bookbox-filter-label">Mood:</span>
                      {['all', 'wisdom', 'tanhai', 'veerta', 'love_ishq', 'grief'].map(mood => (
                        <button
                          key={mood}
                          className={`bookbox-filter-pill mood ${selectedMood === mood ? 'active' : ''}`}
                          onClick={() => setSelectedMood(mood)}
                        >
                          {mood === 'all' ? 'All Moods' : mood}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="bookbox-grid">
                  {filteredItems.length === 0 ? (
                    <div className="bookbox-empty-state">
                      <p>No private notes found matching your search/filter.</p>
                    </div>
                  ) : (
                    filteredItems.map(item => (
                      <div
                        key={item.id}
                        className="bookbox-card"
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        <div className="bookbox-card-header">
                          <span className="bookbox-card-type-badge">
                            {item.type === 'book' ? '📖 Masterclass' : item.type}
                          </span>
                          <span className="bookbox-card-mood-badge">{item.mood}</span>
                        </div>

                        <h3 className="bookbox-card-title">{item.title}</h3>
                        <div className="bookbox-card-author">{item.author}</div>

                        <p className="bookbox-card-truth">{item.coreTruth}</p>

                        <div className="bookbox-card-footer">
                          <span className="bookbox-card-time">⏱️ {item.readTime}</span>
                          <span className="bookbox-card-arrow">Read Masterclass →</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
