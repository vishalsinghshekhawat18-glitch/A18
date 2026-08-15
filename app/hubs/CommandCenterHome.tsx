import React from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';

interface Props {
  items: KnowledgeItem[];
  lastOpenedItemId: string | null;
  onSelectSubject: (subjectId: string) => void;
  onSelectItem: (itemId: string) => void;
}

interface SubjectCardDef {
  id: string;
  title: string;
  icon: string;
  domainMatch: (item: KnowledgeItem) => boolean;
  surfaceBadge: string;
  description: string;
}

const SUBJECT_DEFS: SubjectCardDef[] = [
  {
    id: 'economics',
    title: 'Economics',
    icon: '📚',
    domainMatch: i => i.domain === 'economics' || i.id.includes('eco-ch'),
    surfaceBadge: 'Book Chapter Reader',
    description: 'Core Macroeconomics, Banking System, Monetary Policy & Fiscal Trajectories.'
  },
  {
    id: 'polity',
    title: 'Polity & Governance',
    icon: '⚖️',
    domainMatch: i => i.domain === 'polity' || i.id.includes('pol-ch'),
    surfaceBadge: 'Book Chapter Reader',
    description: 'Constitutional Acts, Statutory Bodies, ECI & Parliamentary Governance.'
  },
  {
    id: 'history',
    title: 'History & Culture',
    icon: '📜',
    domainMatch: i => i.domain === 'history' || i.id.includes('his-ch'),
    surfaceBadge: 'Book Chapter Reader',
    description: 'Freedom Struggle, Regional Movements, Ancient & Medieval Indian History.'
  },
  {
    id: 'geography',
    title: 'Geography & Environment',
    icon: '🌍',
    domainMatch: i => i.domain === 'geography' || i.id.includes('geo-ch'),
    surfaceBadge: 'Book Chapter Reader',
    description: 'Atmospheric Science, Physical Geography & Environmental Policy.'
  },
  {
    id: 'science',
    title: 'Science & Bio-Tech',
    icon: '🔬',
    domainMatch: i => i.domain === 'science' || i.id.includes('sci-ch'),
    surfaceBadge: 'Book Chapter Reader',
    description: 'CRISPR-Cas9, Recombinant DNA, Gene Editing & Frontier Science.'
  },
  {
    id: 'revision',
    title: 'Rapid Revision Traps',
    icon: '⚡',
    domainMatch: i => i.domain === 'revision' || i.id.includes('rev-ch'),
    surfaceBadge: 'Book Chapter Reader',
    description: 'High-Yield Exam Trap Summaries & Memory Retention Notes.'
  },
  {
    id: 'current-affairs',
    title: 'Current Affairs',
    icon: '📰',
    domainMatch: i => i.domain === 'current-affairs' && !i.id.includes('scheme'),
    surfaceBadge: 'Briefing Feed',
    description: 'Daily Banking & Financial CA Briefings stacked by Month.'
  },
  {
    id: 'schemes',
    title: 'Government Schemes',
    icon: '🏛️',
    domainMatch: i => i.id.includes('scheme'),
    surfaceBadge: 'Reference Grid',
    description: 'Central Welfare Schemes, Nodal Ministries, Outlays & Eligibility.'
  },
  {
    id: 'static-ga',
    title: 'Static GA Superbook',
    icon: '📌',
    domainMatch: i => i.domain === 'static-ga' || i.id.includes('static'),
    surfaceBadge: 'Reference Sheet',
    description: 'Regulatory Apex Bodies (RBI, SEBI), Base Years & Policy Stats.'
  },
  {
    id: 'quant',
    title: 'Quant & Reasoning',
    icon: '📐',
    domainMatch: i => i.domain === 'quant' && !i.id.includes('pyq'),
    surfaceBadge: 'Problem Studio',
    description: 'Core Formulas, Mensuration, Shortcuts & Step-by-Step Worked Methods.'
  },
  {
    id: 'pyqs',
    title: 'Previous Year Questions',
    icon: '🎓',
    domainMatch: i => i.domain === 'pyqs' || i.id.includes('pyq'),
    surfaceBadge: 'Practice Cards',
    description: 'Memory PYQs from RBI Grade B, SBI PO & IBPS PO Exams.'
  }
];

export const CommandCenterHome: React.FC<Props> = ({
  items,
  lastOpenedItemId,
  onSelectSubject,
  onSelectItem
}) => {
  // Resolve last opened item for Continue Studying card
  const lastItem = lastOpenedItemId ? items.find(i => i.id === lastOpenedItemId) : null;

  return (
    <div className="command-center-home">
      <div className="home-container">
        {/* Header Title & Orientation Subtitle */}
        <header className="home-header">
          <div className="home-badge">🏛️ BANKING COMMAND CENTER</div>
          <h1 className="home-title">What do you want to study?</h1>
          <p className="home-subtitle">Select a subject or continue your last active study session.</p>
        </header>

        {/* Continue Studying Persistence Card */}
        {lastItem && (
          <section className="continue-studying-card" onClick={() => onSelectItem(lastItem.id)}>
            <div className="continue-label-row">
              <span className="continue-badge">⚡ CONTINUE STUDYING</span>
              <span className="continue-domain">{lastItem.domain.toUpperCase()}</span>
            </div>
            <h2 className="continue-title">{lastItem.title}</h2>
            {lastItem.summary && <p className="continue-summary">{lastItem.summary}</p>}
            <div className="continue-btn-row">
              <button className="btn-continue">Continue Reading →</button>
            </div>
          </section>
        )}

        {/* Subject Grid (10 Subject Tiles) */}
        <section className="subjects-grid">
          {SUBJECT_DEFS.map(def => {
            const count = items.filter(def.domainMatch).length;
            if (count === 0) return null;

            return (
              <div
                key={def.id}
                className="subject-card"
                onClick={() => onSelectSubject(def.id)}
              >
                <div className="subject-card-top">
                  <span className="subject-icon">{def.icon}</span>
                  <span className="subject-count-pill">{count} {count === 1 ? 'item' : 'items'}</span>
                </div>
                <h3 className="subject-card-title">{def.title}</h3>
                <p className="subject-card-desc">{def.description}</p>
                <div className="subject-card-footer">
                  <span className="subject-surface-badge">{def.surfaceBadge}</span>
                  <span className="subject-arrow">→</span>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};
