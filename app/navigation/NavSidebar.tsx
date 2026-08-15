import React, { useState, useEffect } from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';

interface Props {
  items: KnowledgeItem[];
  activeItemId: string;
  onSelectItem: (id: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface FolderGroup {
  id: string;
  title: string;
  icon: string;
  subgroups: Array<{
    id: string;
    title: string;
    items: KnowledgeItem[];
  }>;
}

export const NavSidebar: React.FC<Props> = ({
  items,
  activeItemId,
  onSelectItem,
  isOpenMobile = false,
  onCloseMobile
}) => {
  // Helper to structure 50-926 items into Hierarchical Groups
  const coreEco = items.filter(i => i.domain === 'economics' || i.id.includes('eco-ch'));
  const corePol = items.filter(i => i.domain === 'polity' || i.id.includes('pol-ch'));
  const coreHis = items.filter(i => i.domain === 'history' || i.id.includes('his-ch'));
  const coreGeo = items.filter(i => i.domain === 'geography' || i.id.includes('geo-ch'));
  const coreSci = items.filter(i => i.domain === 'science' || i.id.includes('sci-ch'));
  const coreRev = items.filter(i => i.domain === 'revision' || i.id.includes('rev-ch'));

  const caNotes = items.filter(i => i.domain === 'current-affairs' && !i.id.includes('scheme'));
  const schemeNotes = items.filter(i => i.id.includes('scheme'));
  const staticGaNotes = items.filter(i => i.domain === 'static-ga' || i.id.includes('static'));
  const quantNotes = items.filter(i => i.domain === 'quant' && !i.id.includes('pyq'));
  const pyqNotes = items.filter(i => i.domain === 'pyqs' || i.id.includes('pyq'));

  const folderGroups: FolderGroup[] = [
    {
      id: 'group-core',
      title: 'Core All-Subjects',
      icon: '📚',
      subgroups: [
        { id: 'sub-eco', title: 'Economics & Financial System', items: coreEco },
        { id: 'sub-pol', title: 'Polity & Governance', items: corePol },
        { id: 'sub-his', title: 'History & Culture', items: coreHis },
        { id: 'sub-geo', title: 'Geography & Environment', items: coreGeo },
        { id: 'sub-sci', title: 'Science & Bio-Tech', items: coreSci },
        { id: 'sub-rev', title: 'Rapid Revision Traps', items: coreRev }
      ].filter(sg => sg.items.length > 0)
    },
    {
      id: 'group-ca',
      title: 'Current Affairs (2026)',
      icon: '📰',
      subgroups: [
        { id: 'sub-ca-all', title: 'Banking & Macro CA Notes', items: caNotes }
      ].filter(sg => sg.items.length > 0)
    },
    {
      id: 'group-schemes',
      title: 'Government Schemes',
      icon: '🏛️',
      subgroups: [
        { id: 'sub-schemes-all', title: 'Central Welfare & Credit Schemes', items: schemeNotes }
      ].filter(sg => sg.items.length > 0)
    },
    {
      id: 'group-static',
      title: 'Static GA Superbook',
      icon: '📌',
      subgroups: [
        { id: 'sub-static-all', title: 'Apex Bodies & Policy Subsections', items: staticGaNotes }
      ].filter(sg => sg.items.length > 0)
    },
    {
      id: 'group-quant',
      title: 'Quant & Reasoning',
      icon: '📐',
      subgroups: [
        { id: 'sub-quant-topics', title: 'Core Formulas & Shortcuts', items: quantNotes },
        { id: 'sub-pyqs-all', title: 'SBI/IBPS/RBI Memory PYQs', items: pyqNotes }
      ].filter(sg => sg.items.length > 0)
    }
  ];

  // State to track expanded folders
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'group-core': true,
    'group-ca': true,
    'group-schemes': true,
    'group-static': true,
    'group-quant': true
  });

  // Auto-expand group containing active item
  useEffect(() => {
    folderGroups.forEach(g => {
      const hasActive = g.subgroups.some(sg => sg.items.some(i => i.id === activeItemId));
      if (hasActive) {
        setExpandedGroups(prev => ({ ...prev, [g.id]: true }));
      }
    });
  }, [activeItemId]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
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
          {folderGroups.map(group => {
            if (group.subgroups.length === 0) return null;
            const isExpanded = !!expandedGroups[group.id];

            return (
              <div key={group.id} className="nav-folder-group">
                <button
                  className="nav-folder-header"
                  onClick={() => toggleGroup(group.id)}
                >
                  <span>{group.icon} {group.title}</span>
                  <span className="folder-chevron">{isExpanded ? '▾' : '▸'}</span>
                </button>

                {isExpanded && (
                  <div className="nav-folder-content">
                    {group.subgroups.map(sub => (
                      <div key={sub.id} className="nav-subgroup">
                        <div className="nav-subgroup-title">{sub.title}</div>
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
