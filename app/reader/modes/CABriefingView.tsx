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

export const CABriefingView: React.FC<Props> = ({
  item,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  // Separate blocks for 2-column briefing grid
  const mainBlocks = item.blocks.filter((b: SemanticBlock) => b.type === 'paragraph' || b.type === 'bullet_list' || b.type === 'table' || b.type === 'comparison');
  const sideBlocks = item.blocks.filter((b: SemanticBlock) => b.type === 'key_concept' || b.type === 'exam_trap' || b.type === 'quote');

  // Stream Navigation (find previous and next CA notes)
  const caItems = allItems.filter(i => i.domain === 'current-affairs' && !i.id.includes('scheme'));
  const currentIndex = caItems.findIndex(i => i.id === item.id);
  const prevItem = currentIndex > 0 ? caItems[currentIndex - 1] : null;
  const nextItem = currentIndex < caItems.length - 1 ? caItems[currentIndex + 1] : null;

  return (
    <div className="layout-ca-briefing">
      <div className="ca-briefing-container" style={{ fontSize: `${fontSize}px` }}>
        {/* Top Header Card */}
        <header className="ca-header-card">
          <div className="ca-metadata-bar">
            {item.metadata?.date && <span className="ca-date-chip">📅 {item.metadata.date}</span>}
            {item.metadata?.category && <span className="ca-category-chip">{item.metadata.category}</span>}
            <span className="ca-domain-chip">CURRENT AFFAIRS BRIEFING</span>
          </div>

          <h1 className="ca-title">{item.title}</h1>

          {item.summary && (
            <div className="ca-hook-box">
              <span className="ca-hook-label">EXECUTIVE BRIEFING:</span> {item.summary}
            </div>
          )}
        </header>

        {/* 2-Column Side-by-Side Grid (Collapses to 1 full-width column when sideBlocks are absent) */}
        <div
          className="ca-grid-layout"
          style={{ gridTemplateColumns: sideBlocks.length > 0 ? undefined : '1fr' }}
        >
          <div className="ca-main-column">
            {mainBlocks.map((block: SemanticBlock, idx: number) => (
              <BlockRenderer key={idx} block={block} blockIndex={idx} />
            ))}
          </div>

          {sideBlocks.length > 0 && (
            <aside className="ca-side-column">
              {sideBlocks.map((block: SemanticBlock, idx: number) => (
                <BlockRenderer key={idx} block={block} blockIndex={100 + idx} />
              ))}
            </aside>
          )}
        </div>

        {/* Stream Navigation Footer */}
        <footer className="ca-stream-footer">
          {prevItem ? (
            <button className="btn-stream-nav" onClick={() => onNavigateItem(prevItem.id)}>
              ← Previous: {prevItem.title.substring(0, 35)}...
            </button>
          ) : <div />}

          {nextItem ? (
            <button className="btn-stream-nav" onClick={() => onNavigateItem(nextItem.id)}>
              Next Briefing: {nextItem.title.substring(0, 35)}... →
            </button>
          ) : <div />}
        </footer>

        <RelationshipLinks
          relationships={item.relationships}
          allItems={allItems}
          onNavigate={onNavigateItem}
        />
      </div>
    </div>
  );
};
