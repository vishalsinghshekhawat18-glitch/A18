import { KnowledgeItem } from '../../schema/knowledge-item';

export interface SearchResult {
  item: KnowledgeItem;
  score?: number;
  matches?: string[];
}

export interface SearchFilters {
  domain?: string;
  exam?: string;
  dateRange?: { start?: string; end?: string };
}

export interface ISearchService {
  indexItems(items: KnowledgeItem[]): void;
  search(query: string, filters?: SearchFilters): SearchResult[];
  clear(): void;
}
