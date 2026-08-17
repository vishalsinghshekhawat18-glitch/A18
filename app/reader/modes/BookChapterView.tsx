import React, { useState, useEffect } from 'react';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';
import { BlockRenderer } from '../../components/renderers/BlockRenderer';
import { InPageTOCMobile } from '../InPageTOC';
import { RelationshipLinks } from '../RelationshipLinks';
import { loadFullKnowledgeItem } from '../../contentLoader';
import { isItemInSubject } from '../../navigation/subjectMapper';

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
  const [loadedChapters, setLoadedChapters] = useState<KnowledgeItem[]>([item]);

  // Resolve subject items and load subsequent chapters continuously
  useEffect(() => {
    let isMounted = true;
    const currentDomain = item.domain || 'economics';
    
    // Find all items belonging to the current subject domain
    const siblings = allItems.filter(i => isItemInSubject(i, currentDomain) || i.domain === currentDomain);
    const startIndex = siblings.findIndex(i => i.id === item.id);
    const itemsToLoad = startIndex >= 0 ? siblings.slice(startIndex) : [item];

    setLoadedChapters([item]);

    // Async lazy load full blocks for all subject items sequentially
    Promise.all(itemsToLoad.map(s => loadFullKnowledgeItem(s.id))).then(fullItems => {
      if (isMounted) {
        const validItems = fullItems.filter((i): i is KnowledgeItem => i !== null);
        if (validItems.length > 0) {
          setLoadedChapters(validItems);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [item.id, item.domain, allItems]);

  return (
    <div className="layout-book-chapter">
      <div className="book-chapter-flex-container">
        {/* Main Centered Reading Container with increased width */}
        <main className="reading-container" style={{ fontSize: `${fontSize}px` }}>
          {loadedChapters.map((chItem, chIdx) => (
            <article key={chItem.id || chIdx} className="article-chapter-block" id={`chapter-${chItem.id}`}>
              {chIdx > 0 && (
                <div className="infinite-chapter-divider">
                  <span className="chapter-divider-label">NEXT CHAPTER IN {chItem.domain?.toUpperCase() || 'SUBJECT'}</span>
                </div>
              )}

              <header className="article-header">
                <span className="domain-badge">{chItem.domain}</span>
                <h1 className="article-title">{chItem.title}</h1>
                {chItem.summary && <div className="article-summary">{chItem.summary}</div>}

                {chItem.metadata && (
                  <div className="in-this-chapter-bar">
                    <span className="in-this-chapter-label">In this chapter:</span>
                    <span className="in-this-chapter-list">
                      {chItem.metadata.tags && chItem.metadata.tags.length > 0
                        ? chItem.metadata.tags.join(' • ')
                        : chItem.title}
                    </span>
                    {chItem.metadata.date && (
                      <span className="in-this-chapter-date">📅 {chItem.metadata.date}</span>
                    )}
                  </div>
                )}

                {/* Mobile Inline TOC */}
                {chIdx === 0 && <InPageTOCMobile blocks={chItem.blocks} />}
              </header>

              {chItem.blocks?.map((block: SemanticBlock, idx: number) => (
                <BlockRenderer key={idx} block={block} blockIndex={idx} />
              ))}

              <RelationshipLinks
                relationships={chItem.relationships}
                allItems={allItems}
                onNavigate={onNavigateItem}
              />
            </article>
          ))}
        </main>
      </div>
    </div>
  );
};
