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

export const QuantStudioView: React.FC<Props> = ({
  item,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  return (
    <div className="layout-quant-studio">
      <div className="quant-studio-container" style={{ fontSize: `${fontSize}px` }}>
        <header className="quant-studio-header">
          <span className="quant-badge">📐 QUANT & REASONING STUDIO</span>
          <h1 className="quant-title">{item.title}</h1>
          {item.summary && <div className="quant-summary">{item.summary}</div>}
        </header>

        <div className="quant-studio-body">
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
