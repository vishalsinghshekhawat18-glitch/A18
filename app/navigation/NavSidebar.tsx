import React, { useState, useEffect } from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';

interface Props {
  items: KnowledgeItem[];
  activeItemId: string;
  onSelectItem: (id: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface SubGroup {
  id: string;
  title: string;
  items: KnowledgeItem[];
}

interface TopGroup {
  id: string;
  title: string;
  icon: string;
  subgroups?: SubGroup[];
  items?: KnowledgeItem[];
}

export const NavSidebar: React.FC<Props> = ({
  items,
  activeItemId,
  onSelectItem,
  isOpenMobile = false,
  onCloseMobile
}) => {
  // 1. CORE Sub-Categories
  const ecoItems = items.filter(i => i.domain === 'economics' || i.id.includes('eco-ch'));
  const polItems = items.filter(i => i.domain === 'polity' || i.id.includes('pol-ch'));
  const hisItems = items.filter(i => i.domain === 'history' || i.id.includes('his-ch'));
  const geoItems = items.filter(i => i.domain === 'geography' || i.id.includes('geo-ch'));
  const sciItems = items.filter(i => i.domain === 'science' || i.id.includes('sci-ch'));
  const revItems = items.filter(i => i.domain === 'revision' || i.id.includes('rev-ch'));

  // 2. CURRENT AFFAIRS Month Grouping
  const caAll = items.filter(i => i.domain === 'current-affairs' && !i.id.includes('scheme'));
  const caAugust = caAll.filter(i => i.metadata?.date?.startsWith('2026-08') || i.title.includes('August') || i.title.includes('July 2026') || !i.metadata?.date);
  const caJuly = caAll.filter(i => i.metadata?.date?.startsWith('2026-07'));
  const caJune = caAll.filter(i => i.metadata?.date?.startsWith('2026-06'));

  // 3. SCHEMES, STATIC GA, QUANT, PYQS
  const schemeItems = items.filter(i => i.id.includes('scheme'));
  const staticGaItems = items.filter(i => i.domain === 'static-ga' || i.id.includes('static'));
  const quantItems = items.filter(i => i.domain === 'quant' && !i.id.includes('pyq'));
  const pyqItems = items.filter(i => i.domain === 'pyqs' || i.id.includes('pyq'));

  const topGroups: TopGroup[] = [
    {
      id: 'group-core',
      title: 'CORE',
      icon: '📚',
      subgroups: [
        { id: 'sub-eco', title: 'Economics', items: ecoItems },
        { id: 'sub-pol', title: 'Polity', items: polItems },
        { id: 'sub-his', title: 'History', items: hisItems },
        { id: 'sub-geo', title: 'Geography', items: geoItems },
        { id: 'sub-sci', title: 'Science', items: sciItems },
        { id: 'sub-rev', title: 'Revision', items: revItems }
      ].filter(sg => sg.items.length > 0)
    },
    {
      id: 'group-ca',
      title: 'CURRENT AFFAIRS',
      icon: '📰',
      subgroups: [
        { id: 'sub-ca-aug', title: 'August 2026', items: caAugust.length > 0 ? caAugust : caAll },
        { id: 'sub-ca-jul', title: 'July 2026', items: caJuly },
        { id: 'sub-ca-jun', title: 'June 2026', items: caJune }
      ].filter(sg => sg.items.length > 0)
    },
    {
      id: 'group-schemes',
      title: 'SCHEMES',
      icon: '🏛️',
      items: schemeItems
    },
    {
      id: 'group-static',
      title: 'STATIC GA',
      icon: '📌',
      items: staticGaItems
    },
    {
      id: 'group-quant',
      title: 'QUANT',
      icon: '📐',
      items: quantItems
    },
    {
      id: 'group-pyqs',
      title: 'PYQs',
      icon: '🎓',
      items: pyqItems
    }
  ];

  // State to track expanded top groups & sub folders
  const [expandedTop, setExpandedTop] = useState<Record<string, boolean>>({
    'group-core': true,
    'group-ca': true,
    'group-schemes': true,
    'group-static': true,
    'group-quant': true,
    'group-pyqs': true
  });

  const [expandedSub, setExpandedSub] = useState<Record<string, boolean>>({
    'sub-eco': true,
    'sub-pol': true,
    'sub-his': true,
    'sub-geo': true,
    'sub-sci': true,
    'sub-rev': true,
    'sub-ca-aug': true
  });

  // Auto-expand group containing active item
  useEffect(() => {
    topGroups.forEach(g => {
      if (g.subgroups) {
        const hasActive = g.subgroups.some(sg => sg.items.some(i => i.id === activeItemId));
        if (hasActive) {
          setExpandedTop(prev => ({ ...prev, [g.id]: true }));
        }
      } else if (g.items) {
        if (g.items.some(i => i.id === activeItemId)) {
          setExpandedTop(prev => ({ ...prev, [g.id]: true }));
        }
      }
    });
  }, [activeItemId]);

  const toggleTop = (id: string) => {
    setExpandedTop(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSub = (id: string) => {
    setExpandedSub(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = (id: string) => {
    onSelectItem(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpenMobile && (
        <div
          className="sidebar-overlay"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="sidebar-title">Banking Command Center</div>
            {onCloseMobile && (
              <button className="btn-close-mobile" onClick={onCloseMobile}>✕</button>
            )}
          </div>
          <div className="sidebar-subtitle">Unified Knowledge Reader</div>
        </div>

        <nav className="sidebar-nav">
          {topGroups.map(group => {
            const hasSub = group.subgroups && group.subgroups.length > 0;
            const hasDirectItems = group.items && group.items.length > 0;
            if (!hasSub && !hasDirectItems) return null;

            const isTopOpen = !!expandedTop[group.id];

            return (
              <div key={group.id} className="nav-folder-group">
                <button
                  className="nav-folder-header"
                  onClick={() => toggleTop(group.id)}
                >
                  <span>{group.icon} {group.title}</span>
                  <span className="folder-chevron">{isTopOpen ? '▾' : '▸'}</span>
                </button>

                {isTopOpen && (
                  <div className="nav-folder-content">
                    {/* Render Subgroups if present */}
                    {hasSub && group.subgroups!.map(sub => {
                      const isSubOpen = expandedSub[sub.id] !== false;

                      return (
                        <div key={sub.id} className="nav-subgroup">
                          <button
                            className="nav-subfolder-header"
                            onClick={() => toggleSub(sub.id)}
                          >
                            <span>├─ {sub.title}</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{isSubOpen ? '▾' : '▸'}</span>
                          </button>

                          {isSubOpen && (
                            <div className="nav-subfolder-items">
                              {sub.items.map(item => (
                                <button
                                  key={item.id}
                                  className={`nav-item ${activeItemId === item.id ? 'active' : ''}`}
                                  onClick={() => handleSelect(item.id)}
                                >
                                  {item.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Render Direct Items if present */}
                    {hasDirectItems && group.items!.map(item => (
                      <button
                        key={item.id}
                        className={`nav-item ${activeItemId === item.id ? 'active' : ''}`}
                        onClick={() => handleSelect(item.id)}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
