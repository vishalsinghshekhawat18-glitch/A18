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
import { corpusStubs, loadFullKnowledgeItem, loadAllCorpusItemsForSearch } from './contentLoader';

export const App: React.FC = () => {
  // Lightweight corpus stubs for Home Page grid & Sidebar navigation
  const allCorpusMap = corpusStubs;

  // Routing State & Reading Controls State
  const [routeState, setRouteState] = useState<RouteState>(() => parseHash(window.location.hash));
  const [fontSize, setFontSize] = useState<number>(18);
  const [theme, setTheme] = useState<ReadingTheme>('sepia');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isSidebarClosed, setIsSidebarClosed] = useState<boolean>(false);
  const [lastOpenedItemId, setLastOpenedItemId] = useState<string | null>(() => {
    return localStorage.getItem('bcc_last_opened_item');
  });

  // Active loaded item with full blocks
  const [activeFullItem, setActiveFullItem] = useState<KnowledgeItem | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);

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

  // Lazy-load search items when search modal opens
  useEffect(() => {
    if (isSearchOpen) {
      loadAllCorpusItemsForSearch().then(fullItems => {
        searchService.indexItems(fullItems);
      });
    }
  }, [isSearchOpen, searchService]);

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
    return allCorpusMap[0]?.id || 'migrated-core-eco-ch-1';
  }, [routeState, allCorpusMap]);

  // Lazy-load full active item on demand
  useEffect(() => {
    if (routeState.type !== 'home' && activeItemId) {
      setIsLoadingContent(true);
      loadFullKnowledgeItem(activeItemId).then(item => {
        setActiveFullItem(item);
        setIsLoadingContent(false);
      });
    }
  }, [activeItemId, routeState.type]);

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

  const fallbackActiveItem = activeFullItem || allCorpusMap.find(i => i.id === activeItemId) || allCorpusMap[0];

  return (
    <div className="app-container">
      <NavSidebar
        items={allCorpusMap}
        activeItemId={activeItemId}
        activeSubjectId={routeState.type === 'subject' ? routeState.subjectId : fallbackActiveItem?.domain}
        currentNavDepth={routeState.type}
        onGoHome={handleGoHome}
        onSelectSubject={handleSelectSubject}
        onSelectItem={handleSelectItem}
        isOpenMobile={isOpenMobile}
        isSidebarClosed={isSidebarClosed}
        onCloseMobile={() => {
          setIsOpenMobile(false);
          setIsSidebarClosed(true);
        }}
      />

      <div className="main-content">
        <ReadingControls
          fontSize={fontSize}
          theme={theme}
          onFontSizeChange={setFontSize}
          onThemeChange={setTheme}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => {
            if (isOpenMobile || !isSidebarClosed) {
              setIsOpenMobile(false);
              setIsSidebarClosed(true);
            } else {
              setIsOpenMobile(true);
              setIsSidebarClosed(false);
            }
          }}
        />

        {/* Level 1: Command Center Home Surface */}
        {routeState.type === 'home' ? (
          <CommandCenterHome
            items={allCorpusMap}
            lastOpenedItemId={lastOpenedItemId}
            onSelectSubject={handleSelectSubject}
            onSelectItem={handleSelectItem}
          />
        ) : isLoadingContent || !activeFullItem ? (
          /* Loading Indicator State */
          <div className="reader-loading-container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-accent)', marginBottom: '0.5rem' }}>
              📖 Loading Briefing...
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Fetching study module on demand
            </div>
          </div>
        ) : (
          /* Level 2 & 3: Direct Content Surface Rendering Across All Subjects */
          <ReaderShell
            item={activeFullItem}
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
