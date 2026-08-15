/// <reference types="vite/client" />
import React, { useState, useEffect, useMemo } from 'react';
import { KnowledgeItem } from '../schema/knowledge-item';
import { parseHash, buildHash, RouteState } from './navigation/router';
import { isItemInSubject } from './navigation/subjectMapper';
import { NavSidebar } from './navigation/NavSidebar';
import { CommandCenterHome } from './hubs/CommandCenterHome';
import { ReaderShell } from './reader/ReaderShell';
import { ReadingControls, ReadingTheme } from './reader/ReadingControls';
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
  const hasCorpus = rawItems.some(i => i.id.startsWith('migrated-'));
  if (hasCorpus) {
    // Isolate canonical migrated corpus items (926 total) and filter out synthetic demo/pilot duplicates
    return rawItems.filter(i => i.id.startsWith('migrated-'));
  }

  const map = new Map<string, KnowledgeItem>();
  for (const item of rawItems) {
    const sys = item.metadata?.provenance?.sourceSystem || 'unknown';
    const id = item.metadata?.provenance?.sourceId || item.id;
    const canonicalKey = `${sys}::${id}`;

    if (!map.has(canonicalKey)) {
      map.set(canonicalKey, item);
    }
  }

  return Array.from(map.values());
}

export const App: React.FC = () => {
  // Deduplicated canonical corpus map
  const allCorpusMap = useMemo(() => {
    return deduplicateKnowledgeItems(rawModulesList);
  }, []);

  // Routing State & Reading Controls State
  const [routeState, setRouteState] = useState<RouteState>(() => parseHash(window.location.hash));
  const [fontSize, setFontSize] = useState<number>(18);
  const [theme, setTheme] = useState<ReadingTheme>('sepia');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [lastOpenedItemId, setLastOpenedItemId] = useState<string | null>(() => {
    return localStorage.getItem('bcc_last_opened_item');
  });

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    const matched = allCorpusMap.filter(i => isItemInSubject(i, subId));
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
          theme={theme}
          onFontSizeChange={setFontSize}
          onThemeChange={setTheme}
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
