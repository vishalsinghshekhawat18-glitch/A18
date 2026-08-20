import React, { useState, useEffect, useRef, useMemo } from 'react';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';
import { BlockRenderer } from '../../components/renderers/BlockRenderer';
import { RelationshipLinks } from '../RelationshipLinks';
import { isItemInSubject, groupCAItemsByMonth } from '../../navigation/subjectMapper';
import { loadAllCorpusItemsForSearch } from '../../contentLoader';
import { ExplainSimplyCard } from '../components/ExplainSimplyCard';
import { SchemeDeepDiveCard } from '../components/SchemeDeepDiveCard';

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
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    loadAllCorpusItemsForSearch().then(fullItems => {
      if (isMounted) {
        setFullCaNotes(fullItems.filter(i => isItemInSubject(i, 'current-affairs')));
        setIsLoadingNotes(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Extract all Current Affairs notes for continuous feed stream
  const caNotes = useMemo(() => {
    if (fullCaNotes.length > 0) return fullCaNotes;
    return allItems.filter(i => isItemInSubject(i, 'current-affairs'));
  }, [allItems, fullCaNotes]);

  // Dynamically group notes into month/year sections (Newest month first)
  const monthGroups = useMemo(() => {
    return groupCAItemsByMonth(caNotes);
  }, [caNotes]);

  // State for month filtering (default to 'all' for full continuous feed, or specific monthKey)
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('all');

  // Always scroll to top of Current Affairs feed on initial launch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const headerEl = document.getElementById('ca-feed-header');
    if (headerEl) {
      headerEl.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, []);

  // If activeItemId belongs to a specific month, ensure that month is filtered and scrolled into view
  useEffect(() => {
    if (!activeItemId) return;
    const targetGroup = monthGroups.find(g => g.items.some(i => i.id === activeItemId));
    if (targetGroup) {
      setSelectedMonthKey(targetGroup.monthKey);
      setTimeout(() => {
        const targetEl = document.getElementById(`month-section-${targetGroup.monthKey}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }, [activeItemId, monthGroups]);

  const visibleMonthGroups = useMemo(() => {
    if (selectedMonthKey === 'all') return monthGroups;
    return monthGroups.filter(g => g.monthKey === selectedMonthKey);
  }, [monthGroups, selectedMonthKey]);

  const highlightedRef = useRef<string | null>(null);
  const prevActiveItemIdRef = useRef<string | null>(null);
  const isInitialLaunchRef = useRef<boolean>(true);

  // Smooth-scroll & highlight target card ONLY when an individual item is explicitly clicked (e.g. via search)
  useEffect(() => {
    if (!activeItemId) return undefined;
    if (isInitialLaunchRef.current) {
      isInitialLaunchRef.current = false;
      return undefined;
    }
    if (prevActiveItemIdRef.current === activeItemId) return undefined;
    prevActiveItemIdRef.current = activeItemId;

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

  const handleSelectMonthFilter = (monthKey: string) => {
    setSelectedMonthKey(monthKey);
    requestAnimationFrame(() => {
      const headerEl = document.getElementById('ca-feed-header');
      if (headerEl) {
        headerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  if (isLoadingNotes && fullCaNotes.length === 0) {
    return (
      <div className="layout-ca-feed-surface">
        <div className="ca-feed-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
            📜 Loading Current Affairs Briefing Stream...
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'var(--font-ui)' }}>
            Preparing full briefing cards and domain blocks
          </div>
        </div>
      </div>
    );
  }

  let globalNoteIdx = 0;

  return (
    <div className="layout-ca-feed-surface">
      <div className="ca-feed-container" style={{ fontSize: `${fontSize}px` }}>
        {/* Compact Continuous Feed Banner */}
        <header className="ca-feed-header-compact" id="ca-feed-header">
          <div className="ca-feed-badge-row">
            <span className="ca-feed-domain-badge">📰 CURRENT AFFAIRS BRIEFING STREAM</span>
            <span className="ca-feed-count-badge">
              {selectedMonthKey === 'all'
                ? `${caNotes.length} High-Yield Notes • All Months`
                : `${visibleMonthGroups[0]?.monthLabel || ''} (${visibleMonthGroups[0]?.items.length || 0} Notes)`
              }
            </span>
          </div>
          <h1 className="ca-feed-title-compact">
            {selectedMonthKey === 'all'
              ? 'Continuous Banking & Financial CA Feed'
              : `${visibleMonthGroups[0]?.monthLabel || ''} Briefing Stream`
            }
          </h1>

          {/* Compact Month Selection Navigator */}
          <div className="ca-top-month-navigator">
            <span className="ca-nav-label">SHOW MONTH:</span>
            <div className="ca-month-pills-row">
              <button
                className={`ca-month-pill-btn ${selectedMonthKey === 'all' ? 'active' : ''}`}
                onClick={() => handleSelectMonthFilter('all')}
                data-month="all"
              >
                🌟 ALL MONTHS <span className="ca-pill-count">({caNotes.length})</span>
              </button>
              {monthGroups.map(group => (
                <button
                  key={group.monthKey}
                  className={`ca-month-pill-btn ${selectedMonthKey === group.monthKey ? 'active' : ''}`}
                  onClick={() => handleSelectMonthFilter(group.monthKey)}
                  data-month={group.monthKey}
                >
                  📅 {group.monthLabel} <span className="ca-pill-count">({group.items.length})</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Continuous Feed Stream Stack Divided by Month Sections */}
        <div className="ca-feed-stream-stack">
          {visibleMonthGroups.map(group => (
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

              {/* Month Cards Stack Organized by Section Category */}
              <div className="ca-month-cards-stack">
                {group.sections.map(secGroup => (
                  <div key={secGroup.secId} className="ca-section-block">
                    {/* Compact Section Sub-Header */}
                    <div className="ca-section-header" id={`sec-${group.monthKey}-${secGroup.secId}`}>
                      <span className="ca-section-icon">{secGroup.emoji}</span>
                      <span className="ca-section-title">{secGroup.title}</span>
                      <span className="ca-section-count">({secGroup.items.length})</span>
                    </div>

                    {/* Section Notes Cards Stack */}
                    <div className="ca-section-notes-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      {secGroup.items.map(item => {
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
                            <div className="study-card-header">
                              <div className="card-header-locked">
                                <div>
                                  {item.metadata?.noteNumber ? `NOTE ${String(item.metadata.noteNumber).padStart(2, '0')}` : (item.metadata?.sectionCode === 'SEC11' ? 'REVISION NOTE' : `NOTE ${String(noteNumber).padStart(2, '0')}`)}
                                  {item.metadata?.date && ` · ${item.metadata.date}`}
                                  {item.metadata?.category && ` · ${item.metadata.category}`}
                                </div>
                                {/* Header Right Actions: Scheme Deep-Dive + Explain Bulb */}
                                <div className="header-actions-right">
                                  <SchemeDeepDiveCard item={item} />
                                  <ExplainSimplyCard item={item} />
                                </div>
                              </div>

                              <h2 className="news-title-locked">{item.title}</h2>
                            </div>

                            {/* News Content (Paragraphs, Bullets, Tables) */}
                            <div className="ca-main-col-compact">
                              {mainBlocks.map((block: SemanticBlock, bIdx: number) => (
                                <BlockRenderer key={bIdx} block={block} blockIndex={bIdx} />
                              ))}
                            </div>

                            {/* Exam Focus & Pitfalls / Traps placed below news as an extra line/section */}
                            {sideBlocks.length > 0 && (
                              <div className="ca-bottom-col-compact" style={{ marginTop: '1rem' }}>
                                {sideBlocks.map((block: SemanticBlock, bIdx: number) => (
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
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
