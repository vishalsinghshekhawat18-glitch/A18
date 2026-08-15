import React from 'react';
import { KnowledgeItem, Relationship } from '../../schema/knowledge-item';

interface Props {
  relationships?: Relationship[];
  allItems: KnowledgeItem[];
  onNavigate: (id: string) => void;
}

export const RelationshipLinks: React.FC<Props> = ({
  relationships,
  allItems,
  onNavigate
}) => {
  if (!relationships || relationships.length === 0) return null;

  const getRelBadgeText = (type: string) => {
    switch (type) {
      case 'updated_by': return '🔄 Updated By';
      case 'has_pyq': return '📝 Has PYQ';
      case 'prerequisite': return '📚 Prerequisite';
      case 'current_affairs_of': return '📰 Current Affairs Link';
      case 'revision_of': return '🔁 Revision Target';
      default: return '🔗 Related Knowledge';
    }
  };

  return (
    <div className="relationship-container">
      <div className="relationship-title">Knowledge Relationships & Contextual Links</div>
      <div className="relationship-grid">
        {relationships.map((rel, idx) => {
          const target = allItems.find(i => i.id === rel.targetId);
          const titleText = rel.label || target?.title || rel.targetId;

          return (
            <div
              key={idx}
              className="relationship-chip"
              onClick={() => onNavigate(rel.targetId)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span className="rel-type-badge">{getRelBadgeText(rel.type)}</span>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{titleText}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Jump ➔</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
