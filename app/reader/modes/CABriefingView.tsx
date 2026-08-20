import React from 'react';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';
import { BlockRenderer } from '../../components/renderers/BlockRenderer';
import { RelationshipLinks } from '../RelationshipLinks';
import { ExplainSimplyCard } from '../components/ExplainSimplyCard';
import { MentorDeconstruct } from '../components/MentorDeconstruct';
import { PrerequisiteBridge } from '../components/PrerequisiteBridge';

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
        <header className="study-card-header">
          <div className="card-header-locked">
            <div>
              {item.metadata?.noteNumber ? `NOTE ${String(item.metadata.noteNumber).padStart(2, '0')}` : 'REVISION NOTE'}
              {item.metadata?.date && ` · ${item.metadata.date}`}
              {item.metadata?.category && ` · ${item.metadata.category}`}
            </div>
            {/* 💡 Top-right Hint Bulb */}
            <ExplainSimplyCard item={item} />
          </div>

          <h1 className="news-title-locked">{item.title}</h1>

          {item.summary && (
            <p className="exec-hook">
              {item.summary}
            </p>
          )}
        </header>

        {/* Main News Content (Paragraphs, Bullets, Tables) */}
        <main className="ca-main-content">
          {mainBlocks.map((block: SemanticBlock, idx: number) => (
            <BlockRenderer key={idx} block={block} blockIndex={idx} />
          ))}
        </main>

        {/* 🧠 Feature 4: 3-Question Mentor Deconstruct (Why, Impact, Exam Trap) */}
        <MentorDeconstruct item={item} />

        {/* 🔗 Feature 3: Prerequisite Fundamental Knowledge Bridge */}
        <PrerequisiteBridge item={item} onNavigateItem={onNavigateItem} />

        {/* Exam Focus & Pitfalls / Traps placed below news as an extra section */}
        {sideBlocks.length > 0 && (
          <section className="ca-bottom-focus-section" style={{ marginTop: '1.5rem' }}>
            {sideBlocks.map((block: SemanticBlock, idx: number) => (
              <BlockRenderer key={idx} block={block} blockIndex={100 + idx} />
            ))}
          </section>
        )}

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
