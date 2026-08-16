import React, { useState, useEffect, useRef, useMemo } from 'react';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';
import { BlockRenderer } from '../../components/renderers/BlockRenderer';
import { formatInlineText } from '../../components/renderers/formatInline';
import { RelationshipLinks } from '../RelationshipLinks';
import { isItemInSubject, groupCAItemsByMonth } from '../../navigation/subjectMapper';
import { loadAllCorpusItemsForSearch } from '../../contentLoader';

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
  const [fullCaNotes, setFullCaNotes] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    loadAllCorpusItemsForSearch().then(fullItems => {
      if (isMounted) {
        setFullCaNotes(fullItems.filter(i => isItemInSubject(i, 'current-affairs')));
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Extract all Current Affairs notes for continuous feed stream (505 canonical items)
  const caNotes = useMemo(() => {
    if (fullCaNotes.length > 0) return fullCaNotes;
    return allItems.filter(i => isItemInSubject(i, 'current-affairs'));
  }, [allItems, fullCaNotes]);

  // Dynamically group notes into month/year sections (Newest month first)
  const monthGroups = useMemo(() => {
    return groupCAItemsByMonth(caNotes);
  }, [caNotes]);

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

  const handleScrollToMonth = (monthKey: string) => {
    const el = document.getElementById(`month-section-${monthKey}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  let globalNoteIdx = 0;

  return (
    <div className="layout-ca-feed-surface">
      <div className="ca-feed-container" style={{ fontSize: `${fontSize}px` }}>
        {/* Compact Continuous Feed Banner */}
        <header className="ca-feed-header-compact">
          <div className="ca-feed-badge-row">
            <span className="ca-feed-domain-badge">📰 CURRENT AFFAIRS BRIEFING STREAM</span>
            <span className="ca-feed-count-badge">{caNotes.length} High-Yield Notes • {monthGroups.length} Months</span>
          </div>
          <h1 className="ca-feed-title-compact">Continuous Banking & Financial CA Feed</h1>

          {/* Compact Quick Month Jump Navigator */}
          <div className="ca-top-month-navigator">
            <span className="ca-nav-label">JUMP TO MONTH:</span>
            <div className="ca-month-pills-row">
              {monthGroups.map(group => (
                <button
                  key={group.monthKey}
                  className="ca-month-pill-btn"
                  onClick={() => handleScrollToMonth(group.monthKey)}
                >
                  📅 {group.monthLabel} <span className="ca-pill-count">({group.items.length})</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Continuous Feed Stream Stack Divided by Month Sections */}
        <div className="ca-feed-stream-stack">
          {monthGroups.map(group => (
            <section
              key={group.monthKey}
              id={`month-section-${group.monthKey}`}
              className="ca-month-section"
            >
              {/* Section Divider / Month Header */}
              <div className="ca-month-header">
                <div className="ca-month-title-row">
                  <span className="ca-month-icon">📅</span>
                  <span className="ca-month-title">{group.monthLabel}</span>
                  <span className="ca-month-count-badge">{group.items.length} Briefings</span>
                </div>
              </div>

              {/* Month Cards Stack */}
              <div className="ca-month-cards-stack">
                {group.items.map(item => {
                  globalNoteIdx += 1;
                  const noteNumber = globalNoteIdx;

                  const mainBlocks = item.blocks.filter(
                    (b: SemanticBlock) =>
                      b.type !== 'key_concept' && b.type !== 'exam_trap' && b.type !== 'quote'
                  );
                  const sideBlocks = item.blocks.filter(
                    (b: SemanticBlock) =>
                      b.type === 'key_concept' || b.type === 'exam_trap' || b.type === 'quote'
                  );

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
                          <span className="ca-card-num">NOTE #{noteNumber}</span>
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

                      {/* Adaptive Grid Layout */}
                      <div
                        className="ca-card-grid-compact"
                        style={{ gridTemplateColumns: sideBlocks.length > 0 ? undefined : '1fr' }}
                      >
                        <div className="ca-main-col-compact">
                          {mainBlocks.map((block: SemanticBlock, bIdx: number) => (
                            <BlockRenderer key={bIdx} block={block} blockIndex={bIdx} />
                          ))}
                        </div>

                        {sideBlocks.length > 0 && (
                          <aside className="ca-side-col-compact">
                            {sideBlocks.map((block: SemanticBlock, bIdx: number) => (
                              <BlockRenderer key={bIdx} block={block} blockIndex={100 + bIdx} />
                            ))}
                          </aside>
                        )}
                      </div>

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
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
