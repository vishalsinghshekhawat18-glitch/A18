import React from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { resolveLayoutMode } from './modes/layout-resolver';
import { BookChapterView } from './modes/BookChapterView';
import { CABriefingView } from './modes/CABriefingView';
import { SchemeReferenceView } from './modes/SchemeReferenceView';
import { StaticGAReferenceView } from './modes/StaticGAReferenceView';
import { QuantStudioView } from './modes/QuantStudioView';
import { PYQPracticeView } from './modes/PYQPracticeView';

interface Props {
  item: KnowledgeItem;
  allItems: KnowledgeItem[];
  fontSize: number;
  onNavigateItem: (id: string) => void;
}

export const ReaderShell: React.FC<Props> = ({
  item,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  const mode = resolveLayoutMode(item);

  switch (mode) {
    case 'news_briefing':
      return (
        <CABriefingView
          item={item}
          allItems={allItems}
          fontSize={fontSize}
          onNavigateItem={onNavigateItem}
        />
      );
    case 'scheme_reference':
      return (
        <SchemeReferenceView
          item={item}
          allItems={allItems}
          fontSize={fontSize}
          onNavigateItem={onNavigateItem}
        />
      );
    case 'static_ga_reference':
      return (
        <StaticGAReferenceView
          item={item}
          allItems={allItems}
          fontSize={fontSize}
          onNavigateItem={onNavigateItem}
        />
      );
    case 'quant_studio':
      return (
        <QuantStudioView
          item={item}
          allItems={allItems}
          fontSize={fontSize}
          onNavigateItem={onNavigateItem}
        />
      );
    case 'pyq_practice':
      return (
        <PYQPracticeView
          item={item}
          allItems={allItems}
          fontSize={fontSize}
          onNavigateItem={onNavigateItem}
        />
      );
    case 'book_chapter':
    default:
      return (
        <BookChapterView
          item={item}
          allItems={allItems}
          fontSize={fontSize}
          onNavigateItem={onNavigateItem}
        />
      );
  }
};
