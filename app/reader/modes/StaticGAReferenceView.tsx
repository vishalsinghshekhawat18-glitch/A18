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

export const StaticGAReferenceView: React.FC<Props> = ({
  item,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  return (
    <div className="layout-static-ga-reference">
      <div className="static-ga-container" style={{ fontSize: `${fontSize}px` }}>
        <header className="static-ga-header">
          <span className="static-ga-badge">📌 STATIC GA SUPERBOOK</span>
          <h1 className="static-ga-title">{item.title}</h1>
          {item.summary && <div className="static-ga-summary">{item.summary}</div>}
        </header>

        <div className="static-ga-body">
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
