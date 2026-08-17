import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { SUBJECT_DEFS, isItemInSubject, groupCAItemsByMonth } from '../../app/navigation/subjectMapper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corpusDir = path.resolve(__dirname, '../../content/corpus');
const manifestPath = path.resolve(__dirname, '../../content/manifest.json');

function runNavigationIntegrityTest() {
  console.log('🧪 Starting Navigation & Mapping Integrity Test (Phase R1 Reconciled)...\n');

  let failureCount = 0;
  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      if (detail) console.error(`     Reason: ${detail}`);
      failureCount++;
    }
  }

  // Load Manifest
  if (!fs.existsSync(manifestPath)) {
    console.error(`❌ Manifest missing at ${manifestPath}`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const canonicalTotal = manifest.totalItems || 1082;

  // Derive expected domain counts dynamically from manifest entries
  const manifestDomainCounts: Record<string, number> = {};
  for (const entry of manifest.entries) {
    const dom = entry.sourceDomain || 'unknown';
    manifestDomainCounts[dom] = (manifestDomainCounts[dom] || 0) + 1;
  }

  // Load Corpus Files
  const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));
  const corpusItems: KnowledgeItem[] = [];
  const corpusIds = new Set<string>();

  for (const file of files) {
    const filePath = path.join(corpusDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const item: KnowledgeItem = JSON.parse(content);
      corpusItems.push(item);
      corpusIds.add(item.id);
    } catch (err: any) {
      assert(false, `Read corpus file ${file}`, err.message);
    }
  }

  console.log(`📊 Loaded ${corpusItems.length} corpus items from ${corpusDir}\n`);

  // --- CHECK 1: All 1,082 canonical items are discoverable ---
  assert(
    corpusItems.length === canonicalTotal && corpusIds.size === canonicalTotal,
    'Check 1: Canonical Corpus Item Count',
    `Expected exactly ${canonicalTotal} unique items, found ${corpusItems.length} items (${corpusIds.size} unique IDs)`
  );

  // --- CHECK 2 & 4: Every item maps to exactly one valid subject ---
  const itemSubjectMap = new Map<string, string[]>();
  for (const item of corpusItems) {
    const matchedSubjects: string[] = [];
    for (const subDef of SUBJECT_DEFS) {
      if (isItemInSubject(item, subDef.id)) {
        matchedSubjects.push(subDef.id);
      }
    }
    itemSubjectMap.set(item.id, matchedSubjects);
  }

  let unmappedCount = 0;
  let multiMappedCount = 0;
  for (const [id, matches] of itemSubjectMap.entries()) {
    if (matches.length === 0) unmappedCount++;
    if (matches.length > 1) multiMappedCount++;
  }

  assert(
    unmappedCount === 0,
    'Check 2a: All items map to at least one subject',
    `Found ${unmappedCount} unmapped items`
  );

  assert(
    multiMappedCount === 0,
    'Check 2b / Check 4: No item maps to multiple subjects (No duplication)',
    `Found ${multiMappedCount} items mapped to multiple subjects`
  );

  // --- CHECK 3: No canonical IDs disappear during subject mapping ---
  const allMappedIds = new Set<string>();
  for (const subDef of SUBJECT_DEFS) {
    const subItems = corpusItems.filter(item => isItemInSubject(item, subDef.id));
    subItems.forEach(i => allMappedIds.add(i.id));
  }

  assert(
    allMappedIds.size === corpusIds.size,
    'Check 3: All canonical IDs preserved across subject maps',
    `Mapped ${allMappedIds.size} unique IDs out of ${corpusIds.size} canonical IDs`
  );

  // --- CHECK 5: Current Affairs preserves all 661 items ---
  const caItems = corpusItems.filter(item => isItemInSubject(item, 'current-affairs'));
  assert(
    caItems.length === 661,
    'Check 5: Current Affairs item count',
    `Expected 661 CA items, found ${caItems.length}`
  );

  // --- CHECK 6: Current Affairs month grouping breakdown ---
  const caGroups = groupCAItemsByMonth(caItems);

  // Map month key / month label to item count
  const monthCounts: Record<string, number> = {};
  for (const group of caGroups) {
    monthCounts[group.monthLabel] = group.items.length;
  }

  const augCount = monthCounts['AUGUST 2026'] || 0;
  const julCount = monthCounts['JULY 2026'] || 0;
  const junCount = monthCounts['JUNE 2026'] || 0;
  const mayCount = monthCounts['MAY 2026'] || 0;
  const aprCount = monthCounts['APRIL 2026'] || 0;
  const marCount = monthCounts['MARCH 2026'] || 0;
  const febCount = monthCounts['FEBRUARY 2026'] || 0;
  const janCount = monthCounts['JANUARY 2026'] || 0;
  const janMarSum = janCount + febCount + marCount;

  const totalGrouped = caGroups.reduce((acc, g) => acc + g.items.length, 0);

  assert(
    augCount === 272 && julCount === 173 && junCount === 60 && mayCount === 36 && aprCount === 38 && janMarSum === 82 && totalGrouped === 661,
    'Check 6: Current Affairs month grouping totals',
    `Aug: ${augCount} (exp 272), Jul: ${julCount} (exp 173), Jun: ${junCount} (exp 60), May: ${mayCount} (exp 36), Apr: ${aprCount} (exp 38), Jan-Mar: ${janMarSum} (exp 82), Total: ${totalGrouped} (exp 661)`
  );

  // --- CHECK 7: Current Affairs section grouping preserves all 661 items ---
  let caSectionTotal = 0;
  for (const group of caGroups) {
    for (const sec of group.sections) {
      caSectionTotal += sec.items.length;
    }
  }

  assert(
    caSectionTotal === 661,
    'Check 7: Current Affairs section grouping preservation',
    `Expected 661 section-grouped items, found ${caSectionTotal}`
  );

  // --- CHECK 8: Flattening navigation produces identical ID set ---
  const flattenedIds = new Set<string>();
  for (const subDef of SUBJECT_DEFS) {
    const subItems = corpusItems.filter(item => isItemInSubject(item, subDef.id));
    if (subDef.id === 'current-affairs') {
      const monthGroups = groupCAItemsByMonth(subItems);
      for (const mGroup of monthGroups) {
        for (const sec of mGroup.sections) {
          for (const item of sec.items) {
            flattenedIds.add(item.id);
          }
        }
      }
    } else {
      for (const item of subItems) {
        flattenedIds.add(item.id);
      }
    }
  }

  const missingIds = [...corpusIds].filter(id => !flattenedIds.has(id));
  assert(
    missingIds.length === 0 && flattenedIds.size === corpusIds.size,
    'Check 8: Flattened navigation ID set equality',
    `Missing IDs: ${missingIds.length}, Flattened unique IDs: ${flattenedIds.size} vs Canonical: ${corpusIds.size}`
  );

  console.log('\n========================================');
  if (failureCount === 0) {
    console.log('🎉 ALL 8 NAVIGATION & MAPPING INTEGRITY TESTS PASSED!');
    console.log('========================================\n');
  } else {
    console.error(`💥 NAVIGATION INTEGRITY TEST FAILED with ${failureCount} failure(s).`);
    console.error('========================================\n');
    process.exit(1);
  }
}

runNavigationIntegrityTest();
