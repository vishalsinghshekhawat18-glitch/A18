import React from 'react';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';
import { BlockRenderer } from '../../components/renderers/BlockRenderer';
import { InPageTOCMobile, InPageTOCDesktop } from '../InPageTOC';
import { RelationshipLinks } from '../RelationshipLinks';

interface Props {
  item: KnowledgeItem;
  allItems: KnowledgeItem[];
  fontSize: number;
  onNavigateItem: (id: string) => void;
}

export const BookChapterView: React.FC<Props> = ({
  item,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  return (
    <div className="layout-book-chapter">
      <div className="book-chapter-flex-container">
        {/* Main Centered Reading Container (68ch wide) */}
        <main className="reading-container" style={{ fontSize: `${fontSize}px` }}>
          <article className="article-header">
            <span className="domain-badge">{item.domain}</span>
            <h1 className="article-title">{item.title}</h1>
            {item.summary && <div className="article-summary">{item.summary}</div>}

            {item.metadata && (
              <div className="metadata-row">
                {item.metadata.exam?.map((e: string) => (
                  <span key={e} className="tag-pill" style={{ fontWeight: 'bold' }}>🎓 {e}</span>
                ))}
                {item.metadata.tags?.map((t: string) => (
                  <span key={t} className="tag-pill">#{t}</span>
                ))}
                {item.metadata.date && (
                  <span className="tag-pill">📅 {item.metadata.date}</span>
                )}
              </div>
            )}

            {/* Mobile Inline TOC */}
            <InPageTOCMobile blocks={item.blocks} />
          </article>

          {item.blocks.map((block: SemanticBlock, idx: number) => (
            <BlockRenderer key={idx} block={block} blockIndex={idx} />
          ))}

          <RelationshipLinks
            relationships={item.relationships}
            allItems={allItems}
            onNavigate={onNavigateItem}
          />
        </main>

        {/* Outer Right Margin Secondary Sticky TOC Panel (Desktop) */}
        <aside className="book-chapter-toc-pane">
          <InPageTOCDesktop blocks={item.blocks} />
        </aside>
      </div>
    </div>
  );
};
