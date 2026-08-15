import React, { useEffect, useRef } from 'react';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';
import { BlockRenderer } from '../../components/renderers/BlockRenderer';
import { formatInlineText } from '../../components/renderers/formatInline';
import { RelationshipLinks } from '../RelationshipLinks';

interface Props {
  activeItemId: string;
  allItems: KnowledgeItem[];
  fontSize: number;
  onNavigateItem: (id: string) => void;
}

export const CAFeedSurface: React.FC<Props> = ({
  activeItemId,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  // Extract all Current Affairs notes for continuous feed stream
  const caNotes = allItems.filter(i => i.domain === 'current-affairs' && !i.id.includes('scheme'));
  const highlightedRef = useRef<string | null>(null);

  // Smooth-scroll & highlight target card when activeItemId changes
  useEffect(() => {
    if (!activeItemId) return undefined;

    const targetEl = document.getElementById(activeItemId);
    if (!targetEl) return undefined;

    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    targetEl.classList.add('card-target-highlight');
    highlightedRef.current = activeItemId;

    const timer = setTimeout(() => {
      targetEl.classList.remove('card-target-highlight');
    }, 2500);

    return () => clearTimeout(timer);
  }, [activeItemId]);

  return (
    <div className="layout-ca-feed-surface">
      <div className="ca-feed-container" style={{ fontSize: `${fontSize}px` }}>
        {/* Compact Continuous Feed Banner */}
        <header className="ca-feed-header-compact">
          <div className="ca-feed-badge-row">
            <span className="ca-feed-domain-badge">📰 CURRENT AFFAIRS BRIEFING STREAM</span>
            <span className="ca-feed-count-badge">August 2026 • {caNotes.length} High-Yield Notes</span>
          </div>
          <h1 className="ca-feed-title-compact">August 2026 Continuous Briefing Stream</h1>
        </header>

        {/* Continuous Feed Stream Stack */}
        <div className="ca-feed-stream-stack">
          {caNotes.map((item, idx) => {
            const mainBlocks = item.blocks.filter((b: SemanticBlock) => b.type === 'paragraph' || b.type === 'bullet_list' || b.type === 'table' || b.type === 'comparison' || b.type === 'heading' || b.type === 'statistic' || b.type === 'timeline');
            const annotationBlocks = item.blocks.filter((b: SemanticBlock) => b.type === 'key_concept' || b.type === 'exam_trap' || b.type === 'quote');

            const isTarget = item.id === activeItemId;

            return (
              <article
                key={item.id}
                id={item.id}
                className={`ca-feed-card-compact ${isTarget ? 'is-active-target' : ''}`}
              >
                {/* Card Header & Title */}
                <div className="ca-card-header-compact">
                  <div className="ca-card-meta-bar">
                    <span className="ca-card-num">NOTE #{idx + 1}</span>
                    {item.metadata?.date && <span className="ca-date-chip">📅 {item.metadata.date}</span>}
                    {item.metadata?.category && <span className="ca-category-chip">{item.metadata.category}</span>}
                  </div>

                  <h2 className="ca-card-title-compact">{item.title}</h2>

                  {item.summary && (
                    <div className="ca-card-hook-compact">
                      <span className="ca-hook-label">EXECUTIVE BRIEFING:</span> {formatInlineText(item.summary)}
                    </div>
                  )}
                </div>

                {/* Main News Content (Full Width Unobstructed Reading) */}
                <div className="ca-main-news-content">
                  {mainBlocks.map((block: SemanticBlock, bIdx: number) => (
                    <BlockRenderer key={bIdx} block={block} blockIndex={bIdx} />
                  ))}
                </div>

                {/* Supporting Annotation Blocks Placed BELOW Main News Item (Compact Typography) */}
                {annotationBlocks.length > 0 && (
                  <div className="ca-bottom-annotations-container">
                    {annotationBlocks.map((block: SemanticBlock, bIdx: number) => (
                      <BlockRenderer key={bIdx} block={block} blockIndex={100 + bIdx} />
                    ))}
                  </div>
                )}

                {/* Relationships if present */}
                <RelationshipLinks
                  relationships={item.relationships}
                  allItems={allItems}
                  onNavigate={onNavigateItem}
                />
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
