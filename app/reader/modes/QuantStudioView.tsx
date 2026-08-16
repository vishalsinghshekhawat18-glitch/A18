import React, { useState } from 'react';
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

export const QuantStudioView: React.FC<Props> = ({
  item,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'formulas' | 'examples'>('all');

  const formulaBlocks = item.blocks.filter(b => b.type === 'formula');
  const workedBlocks = item.blocks.filter(b => b.type === 'worked_example');

  const filteredBlocks = item.blocks.filter(b => {
    if (activeFilter === 'formulas') return b.type === 'formula';
    if (activeFilter === 'examples') return b.type === 'worked_example';
    return true;
  });

  return (
    <div className="layout-quant-studio">
      <div className="quant-studio-grid-container" style={{ fontSize: `${fontSize}px` }}>
        <main className="quant-studio-main">
          {/* Top Header Banner */}
          <header className="quant-studio-header">
            <div className="quant-badge-row">
              <span className="quant-domain-badge">📐 QUANT & REASONING PROBLEM STUDIO</span>
              <span className="quant-metrics-badge">
                {formulaBlocks.length} Formulas • {workedBlocks.length} Worked Examples
              </span>
            </div>

            <h1 className="quant-title">{item.title}</h1>

            {item.summary && (
              <div className="quant-summary">
                <span className="summary-label">STUDIO CONCEPT OVERVIEW:</span> {formatInlineText(item.summary)}
              </div>
            )}

            {/* Problem Studio Filter Toolbar */}
            <div className="quant-studio-toolbar">
              <span className="toolbar-label">WORKSPACE VIEW:</span>
              <div className="toolbar-btn-group">
                <button
                  className={`toolbar-btn ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  📖 All Content ({item.blocks.length})
                </button>
                <button
                  className={`toolbar-btn ${activeFilter === 'formulas' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('formulas')}
                >
                  ⚡ Formulas & Shortcuts ({formulaBlocks.length})
                </button>
                <button
                  className={`toolbar-btn ${activeFilter === 'examples' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('examples')}
                >
                  📝 Worked Problems ({workedBlocks.length})
                </button>
              </div>
            </div>
          </header>

          {/* Mobile In-Page TOC */}
          <InPageTOCMobile blocks={item.blocks} />

          {/* Render Filtered Blocks */}
          <div className="quant-studio-body">
            {filteredBlocks.map((block: SemanticBlock, idx: number) => (
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
        <aside className="quant-toc-aside">
          <InPageTOCDesktop blocks={item.blocks} />
        </aside>
      </div>
    </div>
  );
};
