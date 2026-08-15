import React, { useState } from 'react';
import { SemanticBlock } from '../../schema/knowledge-item';

interface TOCItem {
  id: string;
  label: string;
  kind: 'heading' | 'worked_example' | 'table' | 'key_concept' | 'exam_trap';
  level?: number;
}

interface Props {
  blocks: SemanticBlock[];
}

export const InPageTOC: React.FC<Props> = ({ blocks }) => {
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const tocItems: TOCItem[] = [];

  blocks.forEach((block, idx) => {
    const id = `block-${idx}`;
    if (block.type === 'heading') {
      tocItems.push({
        id,
        label: block.text,
        kind: 'heading',
        level: block.level
      });
    } else if (block.type === 'worked_example') {
      tocItems.push({
        id,
        label: `📐 ${block.title || 'Worked Example'}`,
        kind: 'worked_example'
      });
    } else if (block.type === 'key_concept') {
      tocItems.push({
        id,
        label: `💡 ${block.title || 'Key Concept'}`,
        kind: 'key_concept'
      });
    } else if (block.type === 'exam_trap') {
      tocItems.push({
        id,
        label: `⚠️ ${block.title || 'Exam Trap'}`,
        kind: 'exam_trap'
      });
    } else if (block.type === 'table' || block.type === 'comparison') {
      if ('title' in block && block.title) {
        tocItems.push({
          id,
          label: `📊 ${block.title}`,
          kind: 'table'
        });
      }
    }
  });

  if (tocItems.length < 2) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Inline TOC */}
      <div className="in-page-toc-mobile">
        <button
          className="toc-mobile-toggle"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
        >
          📍 In This Chapter ({tocItems.length} sections) {isOpenMobile ? '▲' : '▼'}
        </button>

        {isOpenMobile && (
          <div className="toc-mobile-dropdown">
            {tocItems.map(item => (
              <button
                key={item.id}
                className="toc-mobile-item"
                style={{ paddingLeft: item.level ? `${(item.level - 1) * 0.8 + 0.8}rem` : '0.8rem' }}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sticky Floating TOC */}
      <nav className="in-page-toc-desktop">
        <div className="toc-desktop-title">IN THIS CHAPTER</div>
        <div className="toc-desktop-list">
          {tocItems.map(item => (
            <button
              key={item.id}
              className={`toc-desktop-item ${item.kind}`}
              style={{ paddingLeft: item.level ? `${(item.level - 1) * 0.5 + 0.5}rem` : '0.5rem' }}
              onClick={() => scrollTo(item.id)}
              title={item.label}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};
