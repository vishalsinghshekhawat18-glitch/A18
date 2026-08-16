import React from 'react';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';
import { BlockRenderer } from '../../components/renderers/BlockRenderer';
import { RelationshipLinks } from '../RelationshipLinks';
import { InPageTOCMobile, InPageTOCDesktop } from '../InPageTOC';
import { formatInlineText } from '../../components/renderers/formatInline';

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
  // Extract key statutory metadata fields
  const category = item.metadata?.category || 'Central Sector Welfare Scheme';
  const examBadges = item.metadata?.exam || ['RBI Grade B', 'NABARD Grade A', 'SBI PO'];
  const tags = item.metadata?.tags || [];

  // Extract key concept / exam trap blocks for statutory callout highlights
  const keyConcepts = item.blocks.filter(b => b.type === 'key_concept');
  const examTraps = item.blocks.filter(b => b.type === 'exam_trap');
  const regularBlocks = item.blocks.filter(b => b.type !== 'key_concept' && b.type !== 'exam_trap');

  return (
    <div className="layout-scheme-reference">
      <div className="scheme-container-grid-layout" style={{ fontSize: `${fontSize}px` }}>
        {/* Main Content Area */}
        <main className="scheme-main-content">
          {/* Header & Nodal Ministry Banner */}
          <header className="scheme-header-banner">
            <div className="scheme-badge-row">
              <span className="scheme-domain-badge">🏛️ GOVERNMENT SCHEME REFERENCE</span>
              <span className="scheme-category-chip">{category}</span>
              {examBadges.map((e: string) => (
                <span key={e} className="tag-pill bold-pill">🎓 {e}</span>
              ))}
            </div>

            <h1 className="scheme-title">{item.title}</h1>

            {item.summary && (
              <div className="scheme-summary-card">
                <span className="scheme-summary-label">OBJECTIVE & SCOPE:</span> {formatInlineText(item.summary)}
              </div>
            )}
          </header>

          {/* 2-Column Statutory Metrics & Key Parameters Grid */}
          <section className="scheme-metrics-grid">
            <div className="scheme-metric-card">
              <span className="metric-label">NODAL MINISTRY / AUTHORITY</span>
              <span className="metric-value">{category}</span>
            </div>
            <div className="scheme-metric-card">
              <span className="metric-label">SCHEME TYPE & DOMAIN</span>
              <span className="metric-value">Central Welfare & Development</span>
            </div>
            <div className="scheme-metric-card">
              <span className="metric-label">TARGET EXAMS</span>
              <span className="metric-value">{examBadges.join(' • ')}</span>
            </div>
            <div className="scheme-metric-card">
              <span className="metric-label">TAGS & REFERENCE KEYS</span>
              <span className="metric-value">{tags.length > 0 ? tags.map(t => `#${t}`).join(' ') : '#gov-scheme'}</span>
            </div>
          </section>

          {/* Mobile In-Page TOC */}
          <InPageTOCMobile blocks={item.blocks} />

          {/* Statutory Highlight Callouts (Outlay, Eligibility, Key Takeaways) */}
          {keyConcepts.length > 0 && (
            <div className="scheme-highlights-section">
              <div className="scheme-section-title">💡 STATUTORY HIGHLIGHTS & OUTLAY</div>
              {keyConcepts.map((b, idx) => (
                <BlockRenderer key={idx} block={b} blockIndex={100 + idx} />
              ))}
            </div>
          )}

          {/* Exam Traps & Statutory Distinctions */}
          {examTraps.length > 0 && (
            <div className="scheme-traps-section">
              <div className="scheme-section-title">⚠️ EXAM TRAPS & STATUTORY DISTINCTIONS</div>
              {examTraps.map((b, idx) => (
                <BlockRenderer key={idx} block={b} blockIndex={200 + idx} />
              ))}
            </div>
          )}

          {/* Main Structured Scheme Body Blocks */}
          <div className="scheme-blocks-body">
            <div className="scheme-section-title">📜 FULL SCHEME DETAILS & PROVISIONS</div>
            {regularBlocks.map((block: SemanticBlock, idx: number) => (
              <BlockRenderer key={idx} block={block} blockIndex={idx} />
            ))}
          </div>

          <RelationshipLinks
            relationships={item.relationships}
            allItems={allItems}
            onNavigate={onNavigateItem}
          />
        </main>

        {/* Desktop Sticky In-Page TOC Side Pane */}
        <aside className="scheme-toc-aside">
          <InPageTOCDesktop blocks={item.blocks} />
        </aside>
      </div>
    </div>
  );
};
