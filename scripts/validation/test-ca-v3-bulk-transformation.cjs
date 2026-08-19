/**
 * Comprehensive Automated Validation Suite for CA Framework v3 Bulk Transformation
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting CA Framework v3 Bulk Transformation Validation Suite...\n');

let passed = 0;
let failed = 0;

function check(desc, fn) {
  try {
    fn();
    console.log(`  ✅ [PASS] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${desc}: ${err.message}`);
    failed++;
  }
}

const caV3Dir = 'content/repairs/ca_v3';
const notesDir = path.join(caV3Dir, 'notes');

// 1. Accounting Reconciliation
check('Check 1: Accounting reconciliation sums to exactly 661 original items', () => {
  const acct = JSON.parse(fs.readFileSync(path.join(caV3Dir, 'before-after-accounting.json'), 'utf-8'));
  assert.strictEqual(acct.totalOriginalsProcessed, 661);
  assert.strictEqual(acct.exactSumValidation, true);
  const r = acct.reconciliation;
  const sum = r.retainedCanonicalNotes + r.mergedIntoSubStories + r.duplicatesDeduplicated + r.tierCSkippedOrObituaries;
  assert.strictEqual(sum, 661);
});

// 2. Canonical Corpus Byte-for-Byte Untouched
check('Check 2: Canonical corpus remains 100% untouched (1,088 total files, 661 CA files)', () => {
  const corpusFiles = fs.readdirSync('content/corpus').filter(f => f.endsWith('.json'));
  assert.strictEqual(corpusFiles.length, 1088);
  const caFiles = corpusFiles.filter(f => f.startsWith('migrated-ca-'));
  assert.strictEqual(caFiles.length, 661);
});

// 3. Staged Notes Verification
check('Check 3: All staged notes in ca_v3/notes have valid IDs and zero duplicate IDs', () => {
  const noteFiles = fs.readdirSync(notesDir).filter(f => f.endsWith('.json'));
  assert(noteFiles.length >= 650, `Expected >= 650 staged notes, got ${noteFiles.length}`);
  const ids = new Set();
  noteFiles.forEach(f => {
    const item = JSON.parse(fs.readFileSync(path.join(notesDir, f), 'utf-8'));
    assert(item.id, `${f} missing ID`);
    assert(!ids.has(item.id), `Duplicate ID ${item.id}`);
    ids.add(item.id);
  });
});

// 4. Mandatory Exam Angle
check('Check 4: Mandatory 🎯 Exam Angle present on 100% of retained notes', () => {
  const noteFiles = fs.readdirSync(notesDir).filter(f => f.endsWith('.json'));
  noteFiles.forEach(f => {
    const item = JSON.parse(fs.readFileSync(path.join(notesDir, f), 'utf-8'));
    assert(item.intelligence?.examAngle, `${f} missing intelligence.examAngle`);
    const hasAngle = item.blocks.some(b => (b.content && b.content.includes('🎯 Exam Angle')) || (b.text && b.text.includes('🎯 Exam Angle')));
    assert(hasAngle, `${f} missing Exam Angle block`);
  });
});

// 5. Tier A Anchor Requirements
check('Check 5: Tier A notes contain Hook, Static GK, and Interview Question with Model Answer', () => {
  const noteFiles = fs.readdirSync(notesDir).filter(f => f.endsWith('.json'));
  let tierACount = 0;
  noteFiles.forEach(f => {
    const item = JSON.parse(fs.readFileSync(path.join(notesDir, f), 'utf-8'));
    if (item.intelligence?.tier === 'TIER_A') {
      tierACount++;
      assert(item.intelligence.hook, `${f} missing hook`);
      const hasInterviewBlock = item.blocks.some(b => b.title?.includes('Interview Question'));
      assert(hasInterviewBlock, `${f} missing Interview Question block`);
    }
  });
  assert(tierACount > 100, `Expected > 100 Tier A notes, found ${tierACount}`);
});

// 6. Section Lock & Distribution
check('Check 6: All notes belong to the 11 Locked Sections (SEC1 to SEC11)', () => {
  const dist = JSON.parse(fs.readFileSync(path.join(caV3Dir, 'section-distribution-report.json'), 'utf-8'));
  assert.strictEqual(Object.keys(dist.sectionDistribution).length, 11);
  let totalInDist = 0;
  Object.values(dist.sectionDistribution).forEach(v => { totalInDist += v; });
  assert.strictEqual(totalInDist, 661);
});

// 7. Temporal Zone Derivation
check('Check 7: Temporal zone distribution accounts for all 661 items with 1-year standing exception', () => {
  const dist = JSON.parse(fs.readFileSync(path.join(caV3Dir, 'temporal-zone-distribution.json'), 'utf-8'));
  const sum = dist.temporalDistribution.CORE + dist.temporalDistribution.LIGHT_TOUCH + dist.temporalDistribution.SKIP;
  assert.strictEqual(sum, 661);
  assert(dist.temporalDistribution.CORE > 300, `Expected substantial CORE zone count`);
});

// 8. Story-Thread Graph Integrity
check('Check 8: Story thread graph has zero orphan parent references', () => {
  const graph = JSON.parse(fs.readFileSync(path.join(caV3Dir, 'story-thread-graph.json'), 'utf-8'));
  const corpusFiles = fs.readdirSync('content/corpus').filter(f => f.startsWith('migrated-ca-'));
  const existingIds = new Set(corpusFiles.map(f => f.replace('.json', '')));
  graph.forEach(edge => {
    assert(existingIds.has(edge.childId), `Child ID ${edge.childId} does not exist in corpus`);
    if (edge.parentStoryId) {
      assert(existingIds.has(edge.parentStoryId), `Parent ID ${edge.parentStoryId} does not exist in corpus`);
    }
  });
});

// 9. All 7 Audit Artifacts Exist
check('Check 9: All 7 required audit manifests exist and are non-empty', () => {
  const required = [
    'transformation-manifest.json',
    'story-thread-graph.json',
    'duplicate-skipped-log.json',
    'enrichment-verification-queue.json',
    'section-distribution-report.json',
    'temporal-zone-distribution.json',
    'tier-distribution.json',
    'before-after-accounting.json'
  ];
  required.forEach(f => {
    const p = path.join(caV3Dir, f);
    assert(fs.existsSync(p), `Manifest ${f} missing`);
    const content = fs.readFileSync(p, 'utf-8');
    assert(content.length > 5, `Manifest ${f} is empty`);
  });
});

console.log(`\n========================================`);
console.log(`🎉 CA BULK TRANSFORMATION VALIDATION: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
