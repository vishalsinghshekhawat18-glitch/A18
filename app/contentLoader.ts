import { KnowledgeItem } from '../schema/knowledge-item';
import corpusIndexJson from '../content/corpus-index.json';

// Lazy dynamic import map for all 926 corpus items (NO eager: true)
const corpusGlob = import.meta.glob('../content/corpus/*.json');

// Memory cache for fetched full items with blocks
const loadedItemCache = new Map<string, KnowledgeItem>();

/**
 * Lightweight stubs for fast Home Page & Sidebar navigation (zero block overhead)
 */
export const corpusStubs: KnowledgeItem[] = (corpusIndexJson as any[]).map(stub => ({
  ...stub,
  blocks: stub.blocks || []
}));

/**
 * Loader lookup map
 */
const loaderMap = new Map<string, () => Promise<any>>();
for (const [filePath, loader] of Object.entries(corpusGlob)) {
  const fileName = filePath.split('/').pop()?.replace('.json', '');
  if (fileName) {
    loaderMap.set(fileName, loader as () => Promise<any>);
  }
}

/**
 * Lazy loads a full KnowledgeItem (with blocks) on demand
 */
export async function loadFullKnowledgeItem(itemId: string): Promise<KnowledgeItem | null> {
  if (loadedItemCache.has(itemId)) {
    return loadedItemCache.get(itemId)!;
  }

  const loader = loaderMap.get(itemId);
  if (!loader) {
    const stub = corpusStubs.find(i => i.id === itemId);
    return stub || null;
  }

  try {
    const module = await loader();
    const fullItem = (module.default || module) as KnowledgeItem;
    loadedItemCache.set(itemId, fullItem);
    return fullItem;
  } catch (err) {
    console.error(`Failed to lazy load content item ${itemId}:`, err);
    return corpusStubs.find(i => i.id === itemId) || null;
  }
}

/**
 * Lazy loads all items required for FlexSearch indexing on first search interaction
 */
export async function loadAllCorpusItemsForSearch(): Promise<KnowledgeItem[]> {
  const allLoaded: KnowledgeItem[] = [];
  const loadPromises: Promise<void>[] = [];

  for (const stub of corpusStubs) {
    if (loadedItemCache.has(stub.id)) {
      allLoaded.push(loadedItemCache.get(stub.id)!);
    } else {
      const loader = loaderMap.get(stub.id);
      if (loader) {
        loadPromises.push(
          loader().then(mod => {
            const item = mod.default || mod;
            loadedItemCache.set(stub.id, item);
            allLoaded.push(item);
          }).catch(err => {
            console.error(`Failed loading item ${stub.id} for search:`, err);
          })
        );
      }
    }
  }

  if (loadPromises.length > 0) {
    await Promise.all(loadPromises);
  }

  return allLoaded;
}
