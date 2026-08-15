import React from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';

interface Props {
  items: KnowledgeItem[];
  activeItemId: string;
  onSelectItem: (id: string) => void;
}

export const NavSidebar: React.FC<Props> = ({
  items,
  activeItemId,
  onSelectItem
}) => {
  const domains = [
    { key: 'economics', title: 'Core — Economics & Finance' },
    { key: 'polity', title: 'Core — Polity & Governance' },
    { key: 'quant', title: 'Quant & Reasoning' },
    { key: 'current-affairs', title: 'Current Affairs (2026)' },
    { key: 'pyqs', title: 'PYQs & Exam Papers' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Banking Command Center</div>
        <div className="sidebar-subtitle">Unified Knowledge Reader</div>
      </div>

      <nav className="sidebar-nav">
        {domains.map(d => {
          const domainItems = items.filter(i => i.domain === d.key);
          if (domainItems.length === 0) return null;

          return (
            <div key={d.key} style={{ marginBottom: '1.2rem' }}>
              <div className="nav-section-title">{d.title}</div>
              {domainItems.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeItemId === item.id ? 'active' : ''}`}
                  onClick={() => onSelectItem(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
