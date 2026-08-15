import { KnowledgeItem } from '../../../schema/knowledge-item';

export type LayoutMode =
  | 'book_chapter'
  | 'news_briefing'
  | 'scheme_reference'
  | 'static_ga_reference'
  | 'quant_studio'
  | 'pyq_practice';

export function resolveLayoutMode(item: KnowledgeItem): LayoutMode {
  if (item.type === 'ca_note' && !item.id.includes('scheme')) {
    return 'news_briefing';
  }
  if (item.id.includes('scheme')) {
    return 'scheme_reference';
  }
  if (item.domain === 'static-ga' || item.type === 'static_note') {
    return 'static_ga_reference';
  }
  if (item.domain === 'pyqs' || item.type === 'pyq_item' || item.id.includes('pyq')) {
    return 'pyq_practice';
  }
  if (item.domain === 'quant' || item.type === 'quant_topic') {
    return 'quant_studio';
  }
  return 'book_chapter';
}
