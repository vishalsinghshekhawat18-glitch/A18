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

export const PYQPracticeView: React.FC<Props> = ({
  item,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  return (
    <div className="layout-pyq-practice">
      <div className="pyq-practice-container" style={{ fontSize: `${fontSize}px` }}>
        <header className="pyq-header">
          <div className="pyq-badge-row">
            <span className="pyq-badge">🎓 PREVIOUS YEAR QUESTION (PYQ)</span>
            {item.metadata?.exam?.map((e: string) => (
              <span key={e} className="tag-pill" style={{ fontWeight: 'bold' }}>{e}</span>
            ))}
          </div>

          <h1 className="pyq-title">{item.title}</h1>
          {item.summary && <div className="pyq-summary">{item.summary}</div>}
        </header>

        <div className="pyq-body">
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
