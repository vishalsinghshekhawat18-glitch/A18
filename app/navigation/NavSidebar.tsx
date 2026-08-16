import React, { useMemo } from 'react';
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
  onCloseMobile
}) => {
  const handleSelectSub = (id: string) => {
    onSelectSubject(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSelectItem = (id: string) => {
    onSelectItem(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleScrollToMonth = (monthKey: string) => {
    const pillBtn = document.querySelector(`.ca-month-pill-btn[data-month="${monthKey}"]`) as HTMLButtonElement;
    if (pillBtn) {
      pillBtn.click();
    } else {
      const el = document.getElementById(`month-section-${monthKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

      <aside className={`sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="sidebar-title" onClick={onGoHome} style={{ cursor: 'pointer' }}>
              Banking Command Center
            </div>
            {onCloseMobile && (
              <button className="btn-close-mobile" onClick={onCloseMobile}>✕</button>
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

              {/* Special Month-Wise Hierarchy for Current Affairs */}
              {targetSubject === 'current-affairs' ? (
                <div className="ca-sidebar-month-groups">
                  {caMonthGroups.map(group => (
                    <div key={group.monthKey} className="ca-sidebar-month-block">
                      <button
                        className="ca-sidebar-month-header-btn"
                        onClick={() => handleScrollToMonth(group.monthKey)}
                      >
                        <span>📅 {group.monthLabel}</span>
                        <span className="ca-sidebar-month-badge">{group.items.length}</span>
                      </button>

                      <div className="ca-sidebar-notes-list">
                        {group.items.map(item => (
                          <button
                            key={item.id}
                            className={`nav-item ca-note-item ${activeItemId === item.id ? 'active' : ''}`}
                            onClick={() => handleSelectItem(item.id)}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
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
