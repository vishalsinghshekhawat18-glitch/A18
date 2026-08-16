import React, { useMemo, useState } from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { isItemInSubject, groupCAItemsByMonth } from './subjectMapper';

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
}

const SUBJECT_LIST = [
  { id: 'economics', title: 'Economics', icon: '📚' },
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
  onCloseMobile
}) => {
  // State for collapsible month accordions in Current Affairs sidebar
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
    // 1. Activate month filter pill if present
    const monthPillBtn = document.querySelector(`.ca-month-pill-btn[data-month="${monthKey}"]`) as HTMLButtonElement;
    if (monthPillBtn && !monthPillBtn.classList.contains('active')) {
      monthPillBtn.click();
    }

    // 2. Smooth-scroll to target section header
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

  // Filter items if inside a subject or reader
  const targetSubject = activeSubjectId || (activeItemId ? items.find(i => i.id === activeItemId)?.domain : undefined);

  const contextItems = useMemo(() => {
    return targetSubject ? items.filter(i => isItemInSubject(i, targetSubject)) : [];
  }, [items, targetSubject]);

  const caMonthGroups = useMemo(() => {
    if (targetSubject === 'current-affairs') {
      return groupCAItemsByMonth(contextItems);
    }
    return [];
  }, [targetSubject, contextItems]);

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpenMobile && (
        <div className="sidebar-overlay" onClick={onCloseMobile} />
      )}

      <aside className={`sidebar ${isOpenMobile ? 'mobile-open' : ''} ${isSidebarClosed ? 'is-closed-desktop' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="sidebar-title" onClick={onGoHome} style={{ cursor: 'pointer' }}>
              Banking Command Center
            </div>
            {onCloseMobile && (
              <button
                className="btn-close-sidebar"
                onClick={onCloseMobile}
                title="Close Sidebar"
                aria-label="Close Sidebar"
              >
                ✕
              </button>
            )}
          </div>
          <div className="sidebar-subtitle">Exam Study System</div>
        </div>

        {/* Contextual Breadcrumb Header */}
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
          {/* DEPTH 1: Home View -> Show Subjects Only */}
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

          {/* DEPTH 2 & 3: Inside Subject Hub or Reader */}
          {currentNavDepth !== 'home' && (
            <div className="nav-folder-group">
              <div className="nav-section-title">
                {targetSubject?.toUpperCase() || 'SUBJECT'} INDEX ({contextItems.length})
              </div>

              {/* Special Month & Section Hierarchy for Current Affairs */}
              {targetSubject === 'current-affairs' ? (
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
                /* Standard Subject Index for Non-CA Subjects */
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
