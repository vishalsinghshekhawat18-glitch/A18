import React, { useState } from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { ISearchService, SearchResult } from './SearchService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  searchService: ISearchService;
  onSelectResult: (item: KnowledgeItem) => void;
}

export const SearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  searchService,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);

  if (!isOpen) return null;

  const handleSearch = (text: string, domain?: string) => {
    setQuery(text);
    const filterObj = domain ? { domain } : undefined;
    const res = searchService.search(text, filterObj);
    setResults(res);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-header">
          <span>🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search Banking Command Center (Title, Body, Formula, Tags)..."
            value={query}
            onChange={e => handleSearch(e.target.value, domainFilter)}
            autoFocus
          />
          <button className="btn-control" onClick={onClose}>ESC</button>
        </div>

        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Filter Domain:</span>
          {['', 'polity', 'economics', 'quant', 'current-affairs', 'pyqs'].map(d => (
            <button
              key={d}
              className={`tag-pill ${domainFilter === d ? 'active' : ''}`}
              style={{ cursor: 'pointer', fontWeight: domainFilter === d ? 'bold' : 'normal' }}
              onClick={() => {
                setDomainFilter(d);
                handleSearch(query, d);
              }}
            >
              {d || 'All Domains'}
            </button>
          ))}
        </div>

        <div className="search-results-list">
          {results.length === 0 && query.trim() !== '' && (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matching knowledge items found for "{query}"
            </div>
          )}

          {results.map(({ item }) => (
            <div
              key={item.id}
              className="search-result-item"
              onClick={() => {
                onSelectResult(item);
                onClose();
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="search-result-title">{item.title}</span>
                <span className="domain-badge" style={{ fontSize: '0.65rem' }}>{item.domain}</span>
              </div>
              {item.summary && <div className="search-result-summary">{item.summary}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
