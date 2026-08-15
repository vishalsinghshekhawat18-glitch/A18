import React, { useState, useEffect, useMemo } from 'react';
import { KnowledgeItem } from '../schema/knowledge-item';
import { NavSidebar } from './navigation/NavSidebar';
import { ReaderView } from './reader/ReaderView';
import { ReadingControls } from './reader/ReadingControls';
import { SearchModal } from './search/SearchModal';
import { FlexSearchProvider } from './search/FlexSearchProvider';

import stressTestDoc from '../content/demo/stress-test-banking-master.json';
import polityDoc from '../content/demo/polity-eci.json';
import quantDoc from '../content/demo/quant-time-work.json';
import caDoc from '../content/demo/ca-mpc-august.json';
import pyqDoc from '../content/demo/pyq-rbi-grade-b.json';

const syntheticCorpus: KnowledgeItem[] = [
  stressTestDoc as KnowledgeItem,
  polityDoc as KnowledgeItem,
  quantDoc as KnowledgeItem,
  caDoc as KnowledgeItem,
  pyqDoc as KnowledgeItem
];

export const App: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState<string>(syntheticCorpus[0].id);
  const [fontSize, setFontSize] = useState<number>(18);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const searchService = useMemo(() => {
    const provider = new FlexSearchProvider();
    provider.indexItems(syntheticCorpus);
    return provider;
  }, []);

  const activeItem = useMemo(() => {
    return syntheticCorpus.find(i => i.id === activeItemId) || syntheticCorpus[0];
  }, [activeItemId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      <NavSidebar
        items={syntheticCorpus}
        activeItemId={activeItemId}
        onSelectItem={setActiveItemId}
      />

      <div className="main-content">
        <ReadingControls
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <ReaderView
          item={activeItem}
          allItems={syntheticCorpus}
          fontSize={fontSize}
          onNavigateItem={setActiveItemId}
        />
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchService={searchService}
        onSelectResult={item => setActiveItemId(item.id)}
      />
    </div>
  );
};
