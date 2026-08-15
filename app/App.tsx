/// <reference types="vite/client" />
import React, { useState, useEffect, useMemo } from 'react';
import { KnowledgeItem } from '../schema/knowledge-item';
import { NavSidebar } from './navigation/NavSidebar';
import { ReaderShell } from './reader/ReaderShell';
import { ReadingControls } from './reader/ReadingControls';
import { SearchModal } from './search/SearchModal';
import { FlexSearchProvider } from './search/FlexSearchProvider';

const demoModules = import.meta.glob('../content/demo/*.json', { eager: true });
const pilotModules = import.meta.glob('../content/pilot/*.json', { eager: true });
const corpusModules = import.meta.glob('../content/corpus/*.json', { eager: true });

// Raw concatenated modules
const rawModulesList: KnowledgeItem[] = [
  ...Object.values(corpusModules).map((mod: any) => mod.default || mod),
  ...Object.values(pilotModules).map((mod: any) => mod.default || mod),
  ...Object.values(demoModules).map((mod: any) => mod.default || mod),
];

/**
 * Deterministic Deduplication Layer
 * Maps legacy (sourceSystem + sourceId) to exactly ONE canonical KnowledgeItem.
 * Ensures pilot/demo duplicate copies do not appear as independent entries.
 */
function deduplicateKnowledgeItems(rawItems: KnowledgeItem[]): KnowledgeItem[] {
  const map = new Map<string, KnowledgeItem>();

  for (const item of rawItems) {
    const sys = item.metadata?.provenance?.sourceSystem || 'unknown';
    const id = item.metadata?.provenance?.sourceId || item.id;
    const canonicalKey = `${sys}::${id}`;

    if (!map.has(canonicalKey)) {
      map.set(canonicalKey, item);
    } else {
      const existing = map.get(canonicalKey)!;
      // Prefer official migrated- corpus item over pilot/demo items
      if (item.id.startsWith('migrated-') && !existing.id.startsWith('migrated-')) {
        map.set(canonicalKey, item);
      }
    }
  }

  return Array.from(map.values());
}

export const App: React.FC = () => {
  // Deduplicated canonical corpus map
  const allCorpusMap = useMemo(() => {
    return deduplicateKnowledgeItems(rawModulesList);
  }, []);

  const [activeItemId, setActiveItemId] = useState<string>(allCorpusMap[0]?.id || '');
  const [fontSize, setFontSize] = useState<number>(18);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const searchService = useMemo(() => {
    const provider = new FlexSearchProvider();
    provider.indexItems(allCorpusMap);
    return provider;
  }, [allCorpusMap]);

  const activeItem = useMemo(() => {
    return allCorpusMap.find(i => i.id === activeItemId) || allCorpusMap[0];
  }, [allCorpusMap, activeItemId]);

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
        items={allCorpusMap}
        activeItemId={activeItemId}
        onSelectItem={setActiveItemId}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      <div className="main-content">
        <ReadingControls
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => setIsOpenMobile(!isOpenMobile)}
        />

        <ReaderShell
          item={activeItem}
          allItems={allCorpusMap}
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
