/**
 * R4.C9 — Test Suite for Component-Level Temporal Intelligence
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, label, detail) {
  if (condition) {
    passed++;
    console.log('  PASS: ' + label);
  } else {
    failed++;
    errors.push({ label, detail });
    console.log('  FAIL: ' + label + (detail ? ' — ' + detail : ''));
  }
}

console.log('\n========================================================');
console.log('🧩 R4.C9 COMPONENT TEMPORAL INTELLIGENCE TEST SUITE');
console.log('========================================================\n');

// 1. Test derivation logic
function derive(components) {
  const statuses = new Set(components.map(c => c.status));
  if (statuses.has('UNCLEAR') && statuses.size === 1) return 'UNCLEAR';
  const hasCurrent = statuses.has('CURRENT') || statuses.has('EXTENDED');
  const hasExpired = statuses.has('EXPIRED') || statuses.has('HISTORICAL');
  if (hasCurrent && hasExpired) return 'MIXED';
  if (hasCurrent && !hasExpired) return statuses.has('EXTENDED') && !statuses.has('CURRENT') ? 'EXTENDED' : 'CURRENT';
  if (hasExpired && !hasCurrent) return 'EXPIRED';
  return 'UNCLEAR';
}

console.log('=== TEST 1-8: COMPONENT DERIVATION INVARIANTS ===');
assert(derive([{ status: 'CURRENT' }, { status: 'CURRENT' }]) === 'CURRENT', 'Test 1: All current -> CURRENT');
assert(derive([{ status: 'EXPIRED' }, { status: 'EXPIRED' }]) === 'EXPIRED', 'Test 2: All expired -> EXPIRED');
assert(derive([{ status: 'CURRENT' }, { status: 'EXPIRED' }]) === 'MIXED', 'Test 3: Current + expired -> MIXED');
assert(derive([{ status: 'EXPIRED', type: 'financial-cycle' }, { status: 'CURRENT', type: 'mission' }]) === 'MIXED', 'Test 4: Expired financial cycle + current mission -> MIXED');
assert(derive([{ status: 'HISTORICAL' }]) === 'EXPIRED', 'Test 5: Historical only -> EXPIRED');
assert(derive([{ status: 'UNCLEAR' }]) === 'UNCLEAR', 'Test 7: Missing/unclear -> UNCLEAR');
assert(derive([{ status: 'EXTENDED' }]) === 'EXTENDED', 'Test 8: Explicit extension -> EXTENDED');

console.log('\n=== TEST 9: SCHEME-11 FIXTURE (SOLAR PVTG) ===');
const scheme11Components = [
  { name: 'MNRE ₹515 Cr Package', status: 'EXPIRED', type: 'financial-cycle' },
  { name: 'PM-JANMAN Tribal Mission', status: 'CURRENT', type: 'mission' }
];
assert(derive(scheme11Components) === 'MIXED', 'scheme-11 derives MIXED temporal status');

console.log('\n=== TEST 10: SCHEME-112 FIXTURE (NAPDDR / NMBA) ===');
const scheme112Components = [
  { name: 'NAPDDR 7-Year Plan (2018-2025)', status: 'EXPIRED', type: 'financial-cycle' },
  { name: 'NMBA Nationwide Campaign', status: 'CURRENT', type: 'campaign' }
];
assert(derive(scheme112Components) === 'MIXED', 'scheme-112 derives MIXED temporal status');

console.log('\n=== TEST 11-14: R4.C9 PROMOTED ARTIFACTS VERIFICATION ===');
const r4c9Dir = 'content/repairs/r4c9';
const audit = JSON.parse(fs.readFileSync(path.join(r4c9Dir, 'component-temporal-audit.json'), 'utf-8'));
const manifest = JSON.parse(fs.readFileSync(path.join(r4c9Dir, 'promotion-manifest.json'), 'utf-8'));
const diffReport = JSON.parse(fs.readFileSync(path.join(r4c9Dir, 'temporal-component-diff.json'), 'utf-8'));
const promotedFiles = fs.readdirSync(path.join(r4c9Dir, 'promoted')).filter(f => f.endsWith('.json'));

assert(audit.totalAudited === 10, 'All 10 pilot schemes audited at component level');
assert(audit.summary.CURRENT === 4, 'Exactly 4 schemes are pure CURRENT');
assert(audit.summary.MIXED === 6, 'Exactly 6 schemes are MIXED (expired financial cycle + active mission/portal)');
assert(promotedFiles.length === 10, 'All 10 notes staged in content/repairs/r4c9/promoted/');

promotedFiles.forEach(f => {
  const filePath = path.join(r4c9Dir, 'promoted', f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  assert(Boolean(data.metadata?.overallTemporalStatus), `${f} metadata has overallTemporalStatus`);
  assert(Boolean(data.temporal?.components), `${f} has temporal.components array`);
  assert(data.temporal.components.length >= 2, `${f} contains at least 2 granular components`);

  const hasComponentTable = data.blocks.some(b => b.type === 'table' && b.headers?.includes('Component / Pillar'));
  assert(hasComponentTable, `${f} contains structured component lifecycle table`);
});

console.log('\n=== TEST 15-17: ZERO CORPUS MUTATION INVARIANTS ===');
const corpusFiles = fs.readdirSync('content/corpus').filter(f => f.endsWith('.json'));
assert(corpusFiles.length === 1088, 'Canonical corpus file count = 1088 (untouched)');

const corpusIndex = JSON.parse(fs.readFileSync('content/corpus-index.json', 'utf-8'));
assert(corpusIndex.length === 1088, 'Corpus index length = 1088 (untouched)');

const manifestFile = JSON.parse(fs.readFileSync('content/manifest.json', 'utf-8'));
assert(manifestFile.totalItems === 1088, 'Manifest totalItems = 1088 (untouched)');

// SUMMARY
console.log('\n=== COMPONENT TEMPORAL VALIDATION SUMMARY ===');
console.log('PASSED: ' + passed);
console.log('FAILED: ' + failed);
if (errors.length > 0) {
  console.log('\nFAILED CHECKS:');
  errors.forEach(e => console.log('  ' + e.label + (e.detail ? ' — ' + e.detail : '')));
}
process.exit(failed > 0 ? 1 : 0);
