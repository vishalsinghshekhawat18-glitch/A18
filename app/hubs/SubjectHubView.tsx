import React from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';

interface Props {
  subjectId: string;
  items: KnowledgeItem[];
  onBackHome: () => void;
  onSelectItem: (itemId: string) => void;
}

// Subject display metadata mapping
const SUBJECT_METADATA: Record<string, { title: string; icon: string; badge: string; desc: string }> = {
  'economics': { title: 'Economics', icon: '📚', badge: 'Book Chapter Reader', desc: 'Core Economics Chapters & Financial System Notes.' },
  'polity': { title: 'Polity & Governance', icon: '⚖️', badge: 'Book Chapter Reader', desc: 'Constitutional Acts, Statutory Bodies & ECI.' },
  'history': { title: 'History & Culture', icon: '📜', badge: 'Book Chapter Reader', desc: 'Freedom Struggle, Regional Movements & Culture.' },
  'geography': { title: 'Geography & Environment', icon: '🌍', badge: 'Book Chapter Reader', desc: 'Atmospheric Composition & Physical Geography.' },
  'science': { title: 'Science & Bio-Tech', icon: '🔬', badge: 'Book Chapter Reader', desc: 'CRISPR-Cas9, Recombinant DNA & Bio-Tech.' },
  'revision': { title: 'Rapid Revision Traps', icon: '⚡', badge: 'Book Chapter Reader', desc: 'High-Yield Trap Summaries & Exam Reminders.' },
  'current-affairs': { title: 'Current Affairs', icon: '📰', badge: 'Briefing Feed', desc: 'Daily Banking & Financial CA Briefings stacked by Month.' },
  'schemes': { title: 'Government Schemes', icon: '🏛️', badge: 'Reference Grid', desc: 'Central Welfare Schemes, Ministries & Guidelines.' },
  'static-ga': { title: 'Static GA Superbook', icon: '📌', badge: 'Reference Sheet', desc: 'Regulatory Bodies (RBI, SEBI) & Base Year Stats.' },
  'quant': { title: 'Quant & Reasoning', icon: '📐', badge: 'Problem Studio', desc: 'Core Formulas, Mensuration & Worked Examples.' },
  'pyqs': { title: 'Previous Year Questions', icon: '🎓', badge: 'Practice Cards', desc: 'Memory PYQs from Bank PO & RBI Grade B Exams.' }
};

export const SubjectHubView: React.FC<Props> = ({
  subjectId,
  items,
  onBackHome,
  onSelectItem
}) => {
  const meta = SUBJECT_METADATA[subjectId] || {
    title: subjectId.toUpperCase(),
    icon: '📖',
    badge: 'Knowledge Surface',
    desc: 'Available migrated items for this subject.'
  };

  // Filter items matching this subject
  const subjectItems = items.filter(i => {
    if (subjectId === 'economics') return i.domain === 'economics' || i.id.includes('eco-ch');
    if (subjectId === 'polity') return i.domain === 'polity' || i.id.includes('pol-ch');
    if (subjectId === 'history') return i.domain === 'history' || i.id.includes('his-ch');
    if (subjectId === 'geography') return i.domain === 'geography' || i.id.includes('geo-ch');
    if (subjectId === 'science') return i.domain === 'science' || i.id.includes('sci-ch');
    if (subjectId === 'revision') return i.domain === 'revision' || i.id.includes('rev-ch');
    if (subjectId === 'current-affairs') return i.domain === 'current-affairs' && !i.id.includes('scheme');
    if (subjectId === 'schemes') return i.id.includes('scheme');
    if (subjectId === 'static-ga') return i.domain === 'static-ga' || i.id.includes('static');
    if (subjectId === 'quant') return i.domain === 'quant' && !i.id.includes('pyq');
    if (subjectId === 'pyqs') return i.domain === 'pyqs' || i.id.includes('pyq');
    return i.domain === subjectId;
  });

  return (
    <div className="subject-hub-view">
      <div className="subject-hub-container">
        {/* Navigation Breadcrumb */}
        <div className="hub-breadcrumb">
          <button className="btn-back-home" onClick={onBackHome}>
            ← Back to Command Center
          </button>
        </div>

        {/* Hub Header */}
        <header className="hub-header">
          <div className="hub-badge-row">
            <span className="hub-icon">{meta.icon}</span>
            <span className="hub-surface-badge">{meta.badge}</span>
            <span className="hub-count-chip">{subjectItems.length} Real Available Items</span>
          </div>

          <h1 className="hub-title">{meta.title} Hub</h1>
          <p className="hub-desc">{meta.desc}</p>
        </header>

        {/* Available Items List */}
        <div className="hub-items-list">
          {subjectItems.map((item, idx) => (
            <div
              key={item.id}
              className="hub-item-card"
              onClick={() => onSelectItem(item.id)}
            >
              <div className="hub-item-index">#{idx + 1}</div>
              <div className="hub-item-content">
                <h3 className="hub-item-title">{item.title}</h3>
                {item.summary && <p className="hub-item-summary">{item.summary}</p>}
                <div className="hub-item-meta">
                  {item.metadata?.date && <span className="tag-pill">📅 {item.metadata.date}</span>}
                  {item.metadata?.category && <span className="tag-pill">{item.metadata.category}</span>}
                  <span className="tag-pill">ID: {item.id}</span>
                </div>
              </div>
              <div className="hub-item-arrow">Read →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
