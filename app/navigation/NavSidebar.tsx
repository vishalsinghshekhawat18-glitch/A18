import React from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';

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

  // Filter items if inside a subject or reader
  const targetSubject = activeSubjectId || (activeItemId ? items.find(i => i.id === activeItemId)?.domain : undefined);

  const contextItems = targetSubject ? items.filter(i => {
    if (targetSubject === 'economics') return i.domain === 'economics' || i.id.includes('eco-ch');
    if (targetSubject === 'polity') return i.domain === 'polity' || i.id.includes('pol-ch');
    if (targetSubject === 'history') return i.domain === 'history' || i.id.includes('his-ch');
    if (targetSubject === 'geography') return i.domain === 'geography' || i.id.includes('geo-ch');
    if (targetSubject === 'science') return i.domain === 'science' || i.id.includes('sci-ch');
    if (targetSubject === 'revision') return i.domain === 'revision' || i.id.includes('rev-ch');
    if (targetSubject === 'current-affairs') return i.domain === 'current-affairs' && !i.id.includes('scheme');
    if (targetSubject === 'schemes') return i.id.includes('scheme');
    if (targetSubject === 'static-ga') return i.domain === 'static-ga' || i.id.includes('static');
    if (targetSubject === 'quant') return i.domain === 'quant' && !i.id.includes('pyq');
    if (targetSubject === 'pyqs') return i.domain === 'pyqs' || i.id.includes('pyq');
    return i.domain === targetSubject;
  }) : [];

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

          {/* DEPTH 2 & 3: Inside Subject Hub or Reader -> Show Contextual Subject Items Only */}
          {currentNavDepth !== 'home' && (
            <div className="nav-folder-group">
              <div className="nav-section-title">
                {targetSubject?.toUpperCase() || 'SUBJECT'} INDEX ({contextItems.length})
              </div>
              {contextItems.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeItemId === item.id ? 'active' : ''}`}
                  onClick={() => handleSelectItem(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};
