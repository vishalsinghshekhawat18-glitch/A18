import React, { useMemo, useState } from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { isItemInSubject, groupCAItemsByMonth, naturalChapterSort } from './subjectMapper';

interface Props {
  items: KnowledgeItem[];
  activeItemId: string;
  activeSubjectId?: string;
  currentNavDepth: 'home' | 'subject' | 'read';
  onGoHome: () => void;
  onSelectSubject: (subjectId: string) => void;
  onSelectItem: (id: string) => void;
  isOpenMobile?: boolean;
  isSidebarClosed?: boolean;
  onCloseMobile?: () => void;
  onCloseSidebar?: () => void;
}

const SUBJECT_LIST = [
  { id: 'iibf-regulations', title: 'IIBF & Banking Regulations', icon: '🏛️' },
  { id: 'economics', title: 'Indian Economy & Macro', icon: '📚' },
  { id: 'english', title: 'English Language', icon: '✍️' },
  { id: 'polity', title: 'Polity & Governance', icon: '⚖️' },
  { id: 'history', title: 'History & Culture', icon: '📜' },
  { id: 'geography', title: 'Geography & Environment', icon: '🌍' },
  { id: 'science', title: 'Science & Bio-Tech', icon: '🔬' },
  { id: 'revision', title: 'Rapid Revision Traps', icon: '⚡' },
  { id: 'current-affairs', title: 'Current Affairs', icon: '📰' },
  { id: 'schemes', title: 'Government Schemes', icon: '🏛️' },
  { id: 'static-ga', title: 'Static GA Superbook', icon: '📌' },
  { id: 'quant', title: 'Quant & Reasoning', icon: '📐' },
  { id: 'pyqs', title: 'Previous Year Questions', icon: '🎓' }
];

export const NavSidebar: React.FC<Props> = ({
  items,
  activeItemId,
  activeSubjectId,
  currentNavDepth,
  onGoHome,
  onSelectSubject,
  onSelectItem,
  isOpenMobile = false,
  isSidebarClosed = false,
  onCloseMobile,
  onCloseSidebar
}) => {
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  const handleSelectSub = (id: string) => {
    onSelectSubject(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSelectItem = (id: string) => {
    onSelectItem(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleToggleMonth = (monthKey: string, defaultOpen: boolean) => {
    setExpandedMonths((prev: Record<string, boolean>) => {
      const current = prev[monthKey] !== undefined ? prev[monthKey] : defaultOpen;
      return { ...prev, [monthKey]: !current };
    });
  };

  const handleScrollToSection = (monthKey: string, secId: string) => {
    const monthPillBtn = document.querySelector(`.ca-month-pill-btn[data-month="${monthKey}"]`) as HTMLButtonElement;
    if (monthPillBtn && !monthPillBtn.classList.contains('active')) {
      monthPillBtn.click();
    }

    setTimeout(() => {
      const secEl = document.getElementById(`sec-${monthKey}-${secId}`);
      if (secEl) {
        secEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const monthEl = document.getElementById(`month-section-${monthKey}`);
        if (monthEl) monthEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);

    if (onCloseMobile) onCloseMobile();
  };

  const targetSubject = activeSubjectId || (activeItemId ? items.find(i => i.id === activeItemId)?.domain : undefined);

  const contextItems = useMemo(() => {
    if (!targetSubject) return [];
    const matched = items.filter(i => isItemInSubject(i, targetSubject));
    return matched.sort(naturalChapterSort);
  }, [items, targetSubject]);

  const caMonthGroups = useMemo(() => {
    if (targetSubject === 'current-affairs') {
      return groupCAItemsByMonth(contextItems);
    }
    return [];
  }, [targetSubject, contextItems]);

  const englishSidebarGroups = useMemo(() => {
    if (targetSubject === 'english') {
      const partsMap: Record<string, Record<string, KnowledgeItem[]>> = {};
      contextItems.forEach(item => {
        const part = item.metadata?.part || 'PART I - Writing';
        const sec = item.metadata?.section || 'Section A - Essay Writing';
        if (!partsMap[part]) partsMap[part] = {};
        if (!partsMap[part][sec]) partsMap[part][sec] = [];
        partsMap[part][sec].push(item);
      });
      return partsMap;
    }
    return null;
  }, [targetSubject, contextItems]);

  const economicsSidebarGroups = useMemo(() => {
    if (targetSubject === 'economics') {
      const booksMap: Record<string, KnowledgeItem[]> = {};
      contextItems.forEach(item => {
        let bookName = item.metadata?.category || 'General';
        if (item.id.startsWith('ras-eco')) {
          bookName = 'Book VI: State Economic Review & Flagship Schemes';
        }
        if (!booksMap[bookName]) booksMap[bookName] = [];
        booksMap[bookName].push(item);
      });
      for (const k of Object.keys(booksMap)) {
        booksMap[k].sort(naturalChapterSort);
      }
      return booksMap;
    }
    return null;
  }, [targetSubject, contextItems]);

  const iibfSidebarGroups = useMemo(() => {
    if (targetSubject === 'iibf-regulations') {
      const modMap: Record<string, KnowledgeItem[]> = {};
      contextItems.forEach(item => {
        let modName = item.metadata?.category || 'Banking Regulations Compendiums';
        if (!modMap[modName]) modMap[modName] = [];
        modMap[modName].push(item);
      });
      for (const k of Object.keys(modMap)) {
        modMap[k].sort(naturalChapterSort);
      }
      return modMap;
    }
    return null;
  }, [targetSubject, contextItems]);

  const handleManualClose = () => {
    if (onCloseSidebar) {
      onCloseSidebar();
    } else if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {isOpenMobile && (
        <div className="sidebar-overlay" onClick={onCloseMobile} />
      )}

      <aside className={`sidebar ${isOpenMobile ? 'mobile-open' : ''} ${isSidebarClosed ? 'is-closed-desktop' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="sidebar-title" onClick={onGoHome} style={{ cursor: 'pointer' }}>
              Banking Command Center
            </div>
            <button
              className="btn-close-sidebar"
              onClick={handleManualClose}
              title="Collapse Sidebar"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="sidebar-context-bar">
          <button className="nav-breadcrumb-btn" onClick={onGoHome}>
            🏠 Command Center Home
          </button>

          {currentNavDepth !== 'home' && targetSubject && (
            <button
              className="nav-breadcrumb-btn active"
              onClick={() => handleSelectSub(targetSubject)}
            >
              ↳ {targetSubject.toUpperCase()} Hub
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {currentNavDepth === 'home' && (
            <div className="nav-folder-group">
              <div className="nav-section-title">SUBJECT DIRECTORY</div>
              {SUBJECT_LIST.map(sub => (
                <button
                  key={sub.id}
                  className={`nav-item ${activeSubjectId === sub.id ? 'active' : ''}`}
                  onClick={() => handleSelectSub(sub.id)}
                >
                  <span>{sub.icon} {sub.title}</span>
                </button>
              ))}
            </div>
          )}

          {currentNavDepth !== 'home' && (
            <div className="nav-folder-group">
              <div className="nav-section-title">
                {targetSubject?.toUpperCase() || 'SUBJECT'} INDEX ({contextItems.length})
              </div>

              {/* Special Hierarchy for IIBF & Banking Regulations */}
              {targetSubject === 'iibf-regulations' && iibfSidebarGroups ? (
                <div className="iibf-sidebar-groups" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {Object.entries(iibfSidebarGroups).map(([modName, modItems]) => (
                    <div key={modName} className="iibf-sidebar-mod-block">
                      <div className="iibf-sidebar-mod-title" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-accent, #1e3a8a)', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        🏛️ {modName} ({modItems.length})
                      </div>
                      <div className="iibf-sidebar-items-list" style={{ marginLeft: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        {modItems.map(item => (
                          <button
                            key={item.id}
                            className={`nav-item ${activeItemId === item.id ? 'active' : ''}`}
                            onClick={() => handleSelectItem(item.id)}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : targetSubject === 'economics' && economicsSidebarGroups ? (
                /* Special Hierarchy for Economics */
                <div className="economics-sidebar-groups" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {Object.entries(economicsSidebarGroups).map(([bookName, bookItems]) => (
                    <div key={bookName} className="eco-sidebar-book-block">
                      <div className="eco-sidebar-book-title" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-accent, #1e3a8a)', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        📘 {bookName} ({bookItems.length})
                      </div>
                      <div className="eco-sidebar-items-list" style={{ marginLeft: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        {bookItems.map(item => (
                          <button
                            key={item.id}
                            className={`nav-item ${activeItemId === item.id ? 'active' : ''}`}
                            onClick={() => handleSelectItem(item.id)}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : targetSubject === 'english' && englishSidebarGroups ? (
                /* Special Hierarchy for English Language */
                <div className="english-sidebar-groups" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {Object.entries(englishSidebarGroups).map(([partName, secMap]) => (
                    <div key={partName} className="english-sidebar-part-block">
                      <div className="english-sidebar-part-title" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 800, color: '#9e3b24', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        📌 {partName}
                      </div>
                      {Object.entries(secMap).map(([secName, secItems]) => (
                        <div key={secName} className="english-sidebar-sec-block" style={{ marginLeft: '0.5rem', marginBottom: '0.5rem' }}>
                          <div className="english-sidebar-sec-title" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-accent)', marginBottom: '0.2rem' }}>
                            📝 {secName} ({secItems.length})
                          </div>
                          <div className="english-sidebar-items-list" style={{ marginLeft: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            {secItems.map(item => (
                              <button
                                key={item.id}
                                className={`nav-item ${activeItemId === item.id ? 'active' : ''}`}
                                onClick={() => handleSelectItem(item.id)}
                              >
                                {item.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : targetSubject === 'current-affairs' ? (
                /* Special Month & Section Hierarchy for Current Affairs */
                <div className="ca-sidebar-month-groups">
                  {caMonthGroups.map((group, idx) => {
                    const isDefaultOpen = idx === 0;
                    const isOpen = expandedMonths[group.monthKey] !== undefined
                      ? expandedMonths[group.monthKey]
                      : isDefaultOpen;

                    return (
                      <div key={group.monthKey} className="ca-sidebar-month-block">
                        <button
                          className={`ca-sidebar-month-header-btn ${isOpen ? 'open' : ''}`}
                          onClick={() => handleToggleMonth(group.monthKey, isDefaultOpen)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="ca-month-arrow">{isOpen ? '▼' : '►'}</span>
                            <span>📅 {group.monthLabel}</span>
                          </div>
                          <span className="ca-sidebar-month-badge">{group.items.length}</span>
                        </button>

                        {isOpen && (
                          <div className="ca-sidebar-sections-list">
                            {group.sections.map(secGroup => (
                              <button
                                key={secGroup.secId}
                                className="ca-sidebar-sec-btn"
                                onClick={() => handleScrollToSection(group.monthKey, secGroup.secId)}
                              >
                                <span className="ca-sidebar-sec-title">
                                  {secGroup.emoji} {secGroup.title}
                                </span>
                                <span className="ca-sidebar-sec-count">
                                  ({secGroup.items.length})
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Standard Subject Index with natural sorting */
                contextItems.map(item => (
                  <button
                    key={item.id}
                    className={`nav-item ${activeItemId === item.id ? 'active' : ''}`}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    {item.title}
                  </button>
                ))
              )}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};
