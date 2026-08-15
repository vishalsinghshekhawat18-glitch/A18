/// <reference types="vite/client" />
import React, { useState, useEffect, useMemo } from 'react';
import { KnowledgeItem } from '../schema/knowledge-item';
import { parseHash, buildHash, RouteState } from './navigation/router';
import { NavSidebar } from './navigation/NavSidebar';
import { CommandCenterHome } from './hubs/CommandCenterHome';
import { SubjectHubView } from './hubs/SubjectHubView';
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
 * Ensures duplicate pilot/demo copies do not appear as independent entries.
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

  // Routing State
  const [routeState, setRouteState] = useState<RouteState>(() => parseHash(window.location.hash));
  const [fontSize, setFontSize] = useState<number>(18);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [lastOpenedItemId, setLastOpenedItemId] = useState<string | null>(() => {
    return localStorage.getItem('bcc_last_opened_item');
  });

  // Handle Hash Changes
  useEffect(() => {
    const handleHashChange = () => {
      setRouteState(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Search Service
  const searchService = useMemo(() => {
    const provider = new FlexSearchProvider();
    provider.indexItems(allCorpusMap);
    return provider;
  }, [allCorpusMap]);

  // Active Item Resolution
  const activeItemId = routeState.type === 'read' ? routeState.itemId || allCorpusMap[0].id : allCorpusMap[0].id;

  const activeItem = useMemo(() => {
    return allCorpusMap.find(i => i.id === activeItemId) || allCorpusMap[0];
  }, [allCorpusMap, activeItemId]);

  // Navigation Handlers
  const handleGoHome = () => {
    window.location.hash = buildHash({ type: 'home' });
  };

  const handleSelectSubject = (subjectId: string) => {
    window.location.hash = buildHash({ type: 'subject', subjectId });
  };

  const handleSelectItem = (itemId: string) => {
    localStorage.setItem('bcc_last_opened_item', itemId);
    setLastOpenedItemId(itemId);
    window.location.hash = buildHash({ type: 'read', itemId });
  };

  // Keyboard Shortcuts (Ctrl+K for search)
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
        activeSubjectId={routeState.type === 'subject' ? routeState.subjectId : undefined}
        currentNavDepth={routeState.type}
        onGoHome={handleGoHome}
        onSelectSubject={handleSelectSubject}
        onSelectItem={handleSelectItem}
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

        {/* Level 1: Command Center Home Surface */}
        {routeState.type === 'home' && (
          <CommandCenterHome
            items={allCorpusMap}
            lastOpenedItemId={lastOpenedItemId}
            onSelectSubject={handleSelectSubject}
            onSelectItem={handleSelectItem}
          />
        )}

        {/* Level 2: Subject Hub Navigation View (Directly renders CAFeedSurface for current-affairs) */}
        {routeState.type === 'subject' && routeState.subjectId && (
          routeState.subjectId === 'current-affairs' ? (
            <ReaderShell
              item={allCorpusMap.find(i => i.domain === 'current-affairs' && !i.id.includes('scheme')) || activeItem}
              allItems={allCorpusMap}
              fontSize={fontSize}
              onNavigateItem={handleSelectItem}
            />
          ) : (
            <SubjectHubView
              subjectId={routeState.subjectId}
              items={allCorpusMap}
              onBackHome={handleGoHome}
              onSelectItem={handleSelectItem}
            />
          )
        )}

        {/* Level 3: Content Reader Surface */}
        {routeState.type === 'read' && (
          <ReaderShell
            item={activeItem}
            allItems={allCorpusMap}
            fontSize={fontSize}
            onNavigateItem={handleSelectItem}
          />
        )}
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchService={searchService}
        onSelectResult={item => handleSelectItem(item.id)}
      />
    </div>
  );
};
