import React from 'react';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';
import { BlockRenderer } from '../../components/renderers/BlockRenderer';
import { RelationshipLinks } from '../RelationshipLinks';

interface Props {
  item: KnowledgeItem;
  allItems: KnowledgeItem[];
  fontSize: number;
  onNavigateItem: (id: string) => void;
}

export const SchemeReferenceView: React.FC<Props> = ({
  item,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  return (
    <div className="layout-scheme-reference">
      <div className="scheme-container" style={{ fontSize: `${fontSize}px` }}>
        {/* Top Reference Card */}
        <header className="scheme-header-banner">
          <div className="scheme-badge-row">
            <span className="scheme-domain-badge">GOVERNMENT SCHEME REFERENCE</span>
            {item.metadata?.tags?.map((t: string) => (
              <span key={t} className="tag-pill">#{t}</span>
            ))}
          </div>

          <h1 className="scheme-title">🏛️ {item.title}</h1>

          {item.summary && (
            <div className="scheme-summary-card">
              <span className="scheme-summary-label">OBJECTIVE & OVERVIEW:</span> {item.summary}
            </div>
          )}
        </header>

        {/* Structured Content Blocks */}
        <div className="scheme-blocks-body">
          {item.blocks.map((block: SemanticBlock, idx: number) => (
            <BlockRenderer key={idx} block={block} blockIndex={idx} />
          ))}
        </div>

        <RelationshipLinks
          relationships={item.relationships}
          allItems={allItems}
          onNavigate={onNavigateItem}
        />
      </div>
    </div>
  );
};
