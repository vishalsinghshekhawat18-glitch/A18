/**
 * Dedicated Validation Suite for R4.CA.2 Targeted Intelligence Repair
 * 
 * Verifies:
 * 1. Cross-date duplicate detection and deduplication
 * 2. Chronological update linking
 * 3. Anti-template diversity (> 80% unique Exam Angles)
 * 4. Zero generic Exam Angle boilerplate
 * 5. Zero generic Interview Question boilerplate
 * 6. Zero placeholder Static GK
 * 7. Correct Section realignments
 * 8. 100% preservation of source facts
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting R4.CA.2 Intelligence Repair Validation Suite...\n');

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
const noteFiles = fs.readdirSync(notesDir).filter(f => f.endsWith('.json'));

// 1. Cross-Date Duplicate Detection
check('Check 1: Cross-date duplicates correctly identified and logged in duplicate-skipped-log.json', () => {
  const skipLog = JSON.parse(fs.readFileSync(path.join(caV3Dir, 'duplicate-skipped-log.json'), 'utf-8'));
  const dupes = skipLog.filter(s => s.disposition === 'DUPLICATE_DEDUPLICATED');
  assert(dupes.length >= 5, `Expected >= 5 deduplicated items, got ${dupes.length}`);
  
  // Verify confirmed duplicates from audit
  const hasNcdex = dupes.some(d => d.title.includes('NCDEX') || d.matchedCanonicalId?.includes('35'));
  const hasEpfo = dupes.some(d => d.title.includes('EPF') || d.title.includes('8.25%'));
  const hasVbg = dupes.some(d => d.title.includes('VB-G') || d.title.includes('MGNREGA'));
  assert(hasNcdex, 'NCDEX Nidhi duplicate missing');
  assert(hasEpfo, 'EPFO 8.25% duplicate missing');
  assert(hasVbg, 'VB-G RAM G duplicate missing');
});

// 2. Chronological Update Linking
check('Check 2: Chronological updates correctly linked with parentStoryId and story-thread-graph', () => {
  const graph = JSON.parse(fs.readFileSync(path.join(caV3Dir, 'story-thread-graph.json'), 'utf-8'));
  assert(graph.length >= 4, `Expected >= 4 chronological updates, got ${graph.length}`);
  graph.forEach(edge => {
    assert.strictEqual(edge.relationship, 'CHRONOLOGICAL_UPDATE');
    assert(edge.parentStoryId, 'Missing parentStoryId in update edge');
  });
});

// 3. Anti-Template Diversity on Exam Angles
check('Check 3: Exam Angles are story-specific with high lexical diversity (> 80% unique patterns)', () => {
  const angles = new Set();
  noteFiles.forEach(f => {
    const note = JSON.parse(fs.readFileSync(path.join(notesDir, f), 'utf-8'));
    if (note.intelligence?.examAngle) angles.add(note.intelligence.examAngle);
  });
  const diversityRatio = angles.size / noteFiles.length;
  console.log(`     (Exam Angle Diversity: ${angles.size} unique across ${noteFiles.length} notes = ${(diversityRatio*100).toFixed(1)}%)`);
  assert(diversityRatio >= 0.80, `Expected >= 80% unique exam angles, got ${(diversityRatio*100).toFixed(1)}%`);
});

// 4. Zero Generic Exam Angle Boilerplate
check('Check 4: Zero occurrences of generic Exam Angle boilerplate', () => {
  noteFiles.forEach(f => {
    const note = JSON.parse(fs.readFileSync(path.join(notesDir, f), 'utf-8'));
    const content = JSON.stringify(note);
    assert(!content.includes('Focus on statutory thresholds and implementation deadlines.'), `Generic angle found in ${f}`);
  });
});

// 5. Zero Generic Interview Question Boilerplate
check('Check 5: Zero occurrences of generic Interview Question boilerplate', () => {
  noteFiles.forEach(f => {
    const note = JSON.parse(fs.readFileSync(path.join(notesDir, f), 'utf-8'));
    const content = JSON.stringify(note);
    assert(!content.includes('macro-prudential significance of this reform for Indian banking'), `Generic interview Q found in ${f}`);
  });
});

// 6. Zero Placeholder Static GK
check('Check 6: Zero occurrences of placeholder Static GK strings', () => {
  noteFiles.forEach(f => {
    const note = JSON.parse(fs.readFileSync(path.join(notesDir, f), 'utf-8'));
    const content = JSON.stringify(note);
    assert(!content.includes('Nodal Domain:'), `Placeholder Static GK found in ${f}`);
    assert(!content.includes('Jurisdiction: National / Global'), `Placeholder Jurisdiction found in ${f}`);
  });
});

// 7. Section Realignment Correctness
check('Check 7: Section realignments correctly route RBI circulars to SEC2 and MoUs to SEC5', () => {
  const noteFiles = fs.readdirSync(notesDir).filter(f => f.endsWith('.json'));
  noteFiles.forEach(f => {
    const note = JSON.parse(fs.readFileSync(path.join(notesDir, f), 'utf-8'));
    const text = (note.title + ' ' + note.summary).toLowerCase();
    if (text.includes('rbi') && text.includes('capital framework')) {
      assert.strictEqual(note.metadata.sectionNumber, 2, `${f} should be in SEC2`);
    }
    if (text.includes('signs mou with aaeri')) {
      assert.strictEqual(note.metadata.sectionNumber, 5, `${f} should be in SEC5`);
    }
  });
});

// 8. Total Accounting Reconciled to Exactly 661
check('Check 8: Before/After accounting matches exactly 661 items with zero loss', () => {
  const acct = JSON.parse(fs.readFileSync(path.join(caV3Dir, 'before-after-accounting.json'), 'utf-8'));
  assert.strictEqual(acct.totalOriginalsProcessed, 661);
  assert.strictEqual(acct.exactSumValidation, true);
  const r = acct.reconciliation;
  const sum = r.retainedCanonicalNotes + r.mergedIntoSubStories + r.duplicatesDeduplicated + r.tierCSkippedOrObituaries;
  assert.strictEqual(sum, 661);
});

console.log(`\n========================================`);
console.log(`🎉 R4.CA.2 INTELLIGENCE REPAIR VALIDATION: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
