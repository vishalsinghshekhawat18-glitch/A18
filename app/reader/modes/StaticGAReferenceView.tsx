import React from 'react';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';
import { BlockRenderer } from '../../components/renderers/BlockRenderer';
import { RelationshipLinks } from '../RelationshipLinks';
import { InPageTOCMobile } from '../InPageTOC';
import { formatInlineText } from '../../components/renderers/formatInline';

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
  // Determine apex regulatory body icon and badge
  const titleLower = item.title.toLowerCase();
  let apexBadge = '📌 APEX REGULATORY BODY';
  let apexIcon = '📌';

  if (titleLower.includes('rbi') || titleLower.includes('reserve bank')) {
    apexBadge = '🏛️ RBI — APEX MONETARY AUTHORITY';
    apexIcon = '🏛️';
  } else if (titleLower.includes('sebi') || titleLower.includes('securities')) {
    apexBadge = '⚖️ SEBI — APEX CAPITAL MARKET REGULATOR';
    apexIcon = '⚖️';
  } else if (titleLower.includes('nabard') || titleLower.includes('agriculture')) {
    apexBadge = '🌾 NABARD — RURAL DEVELOPMENT BANK';
    apexIcon = '🌾';
  } else if (titleLower.includes('irdai') || titleLower.includes('insurance')) {
    apexBadge = '🛡️ IRDAI — INSURANCE REGULATOR';
    apexIcon = '🛡️';
  } else if (titleLower.includes('pfrda') || titleLower.includes('pension')) {
    apexBadge = '👴 PFRDA — PENSION FUND REGULATOR';
    apexIcon = '👴';
  }

  const tables = item.blocks.filter(b => b.type === 'table' || b.type === 'comparison');
  const genericBlocks = item.blocks.filter(b => b.type !== 'table' && b.type !== 'comparison');

  return (
    <div className="layout-static-ga-reference">
      <div className="static-ga-grid-container" style={{ fontSize: `${fontSize}px` }}>
        <main className="static-ga-main-content">
          {/* Regulatory Apex Body Header Banner */}
          <header className="static-ga-header-banner">
            <div className="static-ga-badge-row">
              <span className="static-ga-apex-badge">{apexBadge}</span>
            </div>

            {item.metadata?.tags && item.metadata.tags.length > 0 && (
              <div className="in-this-chapter-bar">
                <span className="in-this-chapter-label">In this chapter:</span>
                <span className="in-this-chapter-list">{item.metadata.tags.join(' • ')}</span>
              </div>
            )}

            <h1 className="static-ga-title">{apexIcon} {item.title}</h1>
            {item.summary && (
              <div className="static-ga-summary">
                <span className="summary-label">REGULATORY BRIEF:</span> {formatInlineText(item.summary)}
              </div>
            )}
          </header>

          {/* Mobile In-Page TOC */}
          <InPageTOCMobile blocks={item.blocks} />

          {/* Statutory Tables & Policy Statistics Layout */}
          {tables.length > 0 && (
            <div className="static-ga-tables-section">
              <div className="static-ga-section-label">📊 STATUTORY TABLES & POLICY STATISTICS</div>
              {tables.map((b, idx) => (
                <BlockRenderer key={idx} block={b} blockIndex={100 + idx} />
              ))}
            </div>
          )}

          {/* Main Topic Body */}
          <div className="static-ga-body-blocks">
            <div className="static-ga-section-label">📜 TOPIC PROVISIONS & DETAILS</div>
            {genericBlocks.map((block: SemanticBlock, idx: number) => (
              <BlockRenderer key={idx} block={block} blockIndex={idx} />
            ))}
          </div>

          <RelationshipLinks
            relationships={item.relationships}
            allItems={allItems}
            onNavigate={onNavigateItem}
          />
        </main>

      </div>
    </div>
  );
};
