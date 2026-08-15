/// <reference types="vite/client" />
import React, { useState, useEffect, useMemo } from 'react';
import { KnowledgeItem } from '../schema/knowledge-item';
import { parseHash, buildHash, RouteState } from './navigation/router';
import { NavSidebar } from './navigation/NavSidebar';
import { CommandCenterHome } from './hubs/CommandCenterHome';
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
  const resolveItemForSubject = (subId: string): KnowledgeItem => {
    const matched = allCorpusMap.filter(i => {
      if (subId === 'economics') return i.domain === 'economics' || i.id.includes('eco-ch');
      if (subId === 'polity') return i.domain === 'polity' || i.id.includes('pol-ch');
      if (subId === 'history') return i.domain === 'history' || i.id.includes('his-ch');
      if (subId === 'geography') return i.domain === 'geography' || i.id.includes('geo-ch');
      if (subId === 'science') return i.domain === 'science' || i.id.includes('sci-ch');
      if (subId === 'revision') return i.domain === 'revision' || i.id.includes('rev-ch');
      if (subId === 'current-affairs') return i.domain === 'current-affairs' && !i.id.includes('scheme');
      if (subId === 'schemes') return i.id.includes('scheme');
      if (subId === 'static-ga') return i.domain === 'static-ga' || i.id.includes('static');
      if (subId === 'quant') return i.domain === 'quant' && !i.id.includes('pyq');
      if (subId === 'pyqs') return i.domain === 'pyqs' || i.id.includes('pyq');
      return i.domain === subId;
    });

    return matched[0] || allCorpusMap[0];
  };

  const activeItemId = useMemo(() => {
    if (routeState.type === 'read' && routeState.itemId) {
      return routeState.itemId;
    }
    if (routeState.type === 'subject' && routeState.subjectId) {
      return resolveItemForSubject(routeState.subjectId).id;
    }
    return allCorpusMap[0].id;
  }, [routeState, allCorpusMap]);

  const activeItem = useMemo(() => {
    return allCorpusMap.find(i => i.id === activeItemId) || allCorpusMap[0];
  }, [allCorpusMap, activeItemId]);

  // Navigation Handlers
  const handleGoHome = () => {
    window.location.hash = buildHash({ type: 'home' });
  };

  const handleSelectSubject = (subjectId: string) => {
    const targetItem = resolveItemForSubject(subjectId);
    handleSelectItem(targetItem.id);
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
        activeSubjectId={routeState.type === 'subject' ? routeState.subjectId : activeItem.domain}
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
        {routeState.type === 'home' ? (
          <CommandCenterHome
            items={allCorpusMap}
            lastOpenedItemId={lastOpenedItemId}
            onSelectSubject={handleSelectSubject}
            onSelectItem={handleSelectItem}
          />
        ) : (
          /* Level 2 & 3: Direct Content Surface Rendering Across All Subjects (Zero Intermediate Index Cards) */
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
