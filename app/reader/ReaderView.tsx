import React from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { BlockRenderer } from '../components/renderers/BlockRenderer';
import { RelationshipLinks } from './RelationshipLinks';
import { InPageTOC } from './InPageTOC';

interface Props {
  item: KnowledgeItem;
  allItems: KnowledgeItem[];
  fontSize: number;
  onNavigateItem: (id: string) => void;
}

export const ReaderView: React.FC<Props> = ({
  item,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  return (
    <div className="reader-scroll-container">
      <div className="reader-layout-wrapper">
        <main className="reading-container" style={{ fontSize: `${fontSize}px` }}>
          <article className="article-header">
            <span className="domain-badge">{item.domain}</span>
            <h1 className="article-title">{item.title}</h1>
            {item.summary && <div className="article-summary">{item.summary}</div>}

            {item.metadata && (
              <div className="metadata-row">
                {item.metadata.exam?.map(e => (
                  <span key={e} className="tag-pill" style={{ fontWeight: 'bold' }}>🎓 {e}</span>
                ))}
                {item.metadata.tags?.map(t => (
                  <span key={t} className="tag-pill">#{t}</span>
                ))}
                {item.metadata.date && (
                  <span className="tag-pill">📅 {item.metadata.date}</span>
                )}
              </div>
            )}

            {/* Mobile Inline TOC */}
            <InPageTOC blocks={item.blocks} />
          </article>

          {item.blocks.map((block, idx) => (
            <BlockRenderer key={idx} block={block} blockIndex={idx} />
          ))}

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
