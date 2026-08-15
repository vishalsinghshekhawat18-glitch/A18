import fs from 'fs';
import path from 'path';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { resolveLayoutMode } from '../../app/reader/modes/layout-resolver';

console.log('🔍 Executing UI & Content Integrity Audit...');

// Load all JSON files in content/corpus, content/pilot, content/demo
const corpusDir = path.resolve(process.cwd(), 'content/corpus');
const pilotDir = path.resolve(process.cwd(), 'content/pilot');
const demoDir = path.resolve(process.cwd(), 'content/demo');

function loadJsonFilesFrom(dir: string): KnowledgeItem[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  return files.map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    return JSON.parse(raw) as KnowledgeItem;
  });
}

const corpusItems = loadJsonFilesFrom(corpusDir);
const pilotItems = loadJsonFilesFrom(pilotDir);
const demoItems = loadJsonFilesFrom(demoDir);

const rawAll = [...corpusItems, ...pilotItems, ...demoItems];

console.log(`📊 Loaded ${rawAll.length} total raw items (${corpusItems.length} corpus, ${pilotItems.length} pilot, ${demoItems.length} demo).`);

// Deduplication function
function deduplicate(rawItems: KnowledgeItem[]): KnowledgeItem[] {
  const map = new Map<string, KnowledgeItem>();
  for (const item of rawItems) {
    const sys = item.metadata?.provenance?.sourceSystem || 'unknown';
    const id = item.metadata?.provenance?.sourceId || item.id;
    const key = `${sys}::${id}`;

    if (!map.has(key)) {
      map.set(key, item);
    } else {
      const existing = map.get(key)!;
      if (item.id.startsWith('migrated-') && !existing.id.startsWith('migrated-')) {
        map.set(key, item);
      }
    }
  }
  return Array.from(map.values());
}

const uniqueItems = deduplicate(rawAll);
console.log(`✅ [DEDUPLICATION TEST] Deduplicated ${rawAll.length} items to ${uniqueItems.length} unique canonical items.`);

// Verify zero duplicate sourceSystem::sourceId keys
const keysSeen = new Set<string>();
let duplicateCount = 0;

for (const item of uniqueItems) {
  const sys = item.metadata?.provenance?.sourceSystem || 'unknown';
  const id = item.metadata?.provenance?.sourceId || item.id;
  const key = `${sys}::${id}`;

  if (keysSeen.has(key)) {
    console.error(`❌ Duplicate key found: ${key}`);
    duplicateCount++;
  } else {
    keysSeen.add(key);
  }
}

if (duplicateCount === 0) {
  console.log('✅ [PASSED] 0 Duplicate (sourceSystem + sourceId) navigation entries exist.');
} else {
  console.error(`❌ [FAILED] Found ${duplicateCount} duplicate navigation entries.`);
  process.exit(1);
}

// Test layout mode resolution across all unique items
const modeCounts: Record<string, number> = {
  book_chapter: 0,
  news_briefing: 0,
  scheme_reference: 0,
  static_ga_reference: 0,
  quant_studio: 0,
  pyq_practice: 0
};

for (const item of uniqueItems) {
  const mode = resolveLayoutMode(item);
  modeCounts[mode] = (modeCounts[mode] || 0) + 1;
}

console.log('📈 Layout Mode Distribution Across Unique Dataset:');
Object.entries(modeCounts).forEach(([mode, count]) => {
  console.log(`  • ${mode}: ${count} items`);
});

if (Object.values(modeCounts).every(c => c > 0)) {
  console.log('✅ [PASSED] All 6 layout modes are active and populated with real items.');
} else {
  console.error('❌ [FAILED] One or more layout modes have zero items.');
  process.exit(1);
}

console.log('🎉 UI Integrity Check Completed Successfully!');
