import React from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { SUBJECT_DEFS, isItemInSubject } from '../navigation/subjectMapper';

interface Props {
  items: KnowledgeItem[];
  lastOpenedItemId: string | null;
  onSelectSubject: (subjectId: string) => void;
  onSelectItem: (itemId: string) => void;
}

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
          <div className="home-badge">🏛️ BANKING COMMAND CENTER | EXAM STUDY SYSTEM</div>
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

        {/* Subject Grid (11 Subject Tiles - Compact & Study-Oriented) */}
        <section className="subjects-grid">
          {SUBJECT_DEFS.map(def => {
            const count = items.filter(i => isItemInSubject(i, def.id)).length;
            if (count === 0) return null;

            return (
              <div
                key={def.id}
                className="subject-card compact-tile"
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
