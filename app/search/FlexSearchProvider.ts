import FlexSearch from 'flexsearch';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { ISearchService, SearchFilters, SearchResult } from './SearchService';

export class FlexSearchProvider implements ISearchService {
  private index: any;
  private itemMap: Map<string, KnowledgeItem> = new Map();

  constructor() {
    this.index = new FlexSearch.Document({
      document: {
        id: 'id',
        index: ['title', 'summary', 'body', 'tags']
      },
      tokenize: 'forward'
    });
  }

  public indexItems(items: KnowledgeItem[]): void {
    this.clear();
    for (const item of items) {
      this.itemMap.set(item.id, item);
      const bodyText = item.blocks
        .map(b => ('content' in b ? b.content : 'text' in b ? b.text : ''))
        .join(' ');
      const tagsText = item.metadata?.tags?.join(' ') || '';

      this.index.add({
        id: item.id,
        title: item.title,
        summary: item.summary || '',
        body: bodyText,
        tags: tagsText
      });
    }
  }

  public search(query: string, filters?: SearchFilters): SearchResult[] {
    if (!query.trim()) return [];

    const rawResults = this.index.search(query, { limit: 20 });
    const matchedIds = new Set<string>();

    if (Array.isArray(rawResults)) {
      for (const fieldRes of rawResults) {
        if (fieldRes.result) {
          fieldRes.result.forEach((id: string) => matchedIds.add(id));
        }
      }
    }

    const results: SearchResult[] = [];
    for (const id of matchedIds) {
      const item = this.itemMap.get(id);
      if (!item) continue;

      if (filters?.domain && item.domain !== filters.domain) continue;
      if (filters?.exam && !item.metadata?.exam?.includes(filters.exam)) continue;

      results.push({ item });
    }

    return results;
  }

  public clear(): void {
    this.itemMap.clear();
  }
}
