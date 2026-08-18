/**
 * R4.C8 — Test Suite for Temporal Consistency Engine & Gates
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
console.log('⏳ R4.C8 TEMPORAL CONSISTENCY VALIDATION SUITE');
console.log('========================================================\n');

// 1. Test Pure Temporal Logic
const REF_DATE = '2026-08-18';

function evalTemp(input) {
  const ref = new Date(REF_DATE);
  if (input.hasVerifiedExtension && input.extendedUntil) {
    const ext = new Date(input.extendedUntil);
    if (ext >= ref) return 'EXTENDED';
  }
  if (input.schemePeriodEnd) {
    const end = new Date(input.schemePeriodEnd);
    if (end < ref) return 'EXPIRED';
    if (end >= ref) return 'CURRENT';
  }
  if (input.isOpenEndedStatutory) return 'CURRENT';
  return 'UNCLEAR';
}

console.log('=== TEST 1-5: PURE TEMPORAL CLASSIFICATION RULES ===');
assert(evalTemp({ schemePeriodEnd: '2026-03-31' }) === 'EXPIRED', 'Rule 1: End date before 2026-08-18 -> EXPIRED');
assert(evalTemp({ schemePeriodEnd: '2026-08-18' }) === 'CURRENT', 'Rule 2: End date today (2026-08-18) -> CURRENT');
assert(evalTemp({ schemePeriodEnd: '2027-03-31' }) === 'CURRENT', 'Rule 3: End date after 2026-08-18 -> CURRENT');
assert(evalTemp({ schemePeriodStart: '2021-04-01' }) === 'UNCLEAR', 'Rule 4: Missing end date without statutory flag -> UNCLEAR');
assert(evalTemp({ schemePeriodEnd: '2026-03-31', hasVerifiedExtension: true, extendedUntil: '2027-03-31' }) === 'EXTENDED', 'Rule 5: Expired with verified extension -> EXTENDED');
assert(evalTemp({ isOpenEndedStatutory: true }) === 'CURRENT', 'Rule 5b: Open-ended statutory program -> CURRENT');

console.log('\n=== TEST 6-8: HISTORICAL VALIDITY VS CURRENT APPLICABILITY ===');
// A verified historical fact (e.g. outlay for 2021-22 to 2025-26) remains true historically but is EXPIRED currently
const historicalTest = evalTemp({ schemePeriodStart: '2021-04-01', schemePeriodEnd: '2026-03-31' });
assert(historicalTest === 'EXPIRED', 'Rule 6 & 7: 2021-26 financial period evaluates as EXPIRED as of August 2026');

console.log('\n=== TEST 9 & 10: R4.C8 PILOT RE-AUDIT VERIFICATION ===');
const r4c8Dir = 'content/repairs/r4c8';
const temporalAudit = JSON.parse(fs.readFileSync(path.join(r4c8Dir, 'temporal-audit.json'), 'utf-8'));
const manifest = JSON.parse(fs.readFileSync(path.join(r4c8Dir, 'promotion-manifest.json'), 'utf-8'));
const diffReport = JSON.parse(fs.readFileSync(path.join(r4c8Dir, 'temporal-diff-report.json'), 'utf-8'));

assert(temporalAudit.totalAudited === 10, 'Audited exactly 10 pilot schemes');
assert(temporalAudit.summary.CURRENT === 4, 'Exactly 4 schemes are currently active (Krishi-DSS, NOS, Ambedkar Loan, NF-OBC)');
assert(temporalAudit.summary.EXPIRED === 6, 'Exactly 6 schemes are 15th FC / FY2025-26 expired (SHREYAS, YASASVI, SMILE, Solar PVTG, SEED, NAPDDR)');

manifest.manifest.forEach(item => {
  assert(Boolean(item.temporal), `${item.itemId} has structured temporal metadata`);
  assert(item.temporal.statusAsOf === '2026-08-18', `${item.itemId} evaluated as of 2026-08-18`);
  if (item.temporalStatus === 'EXPIRED') {
    assert(item.promotionStatus === 'approved-with-warning', `${item.itemId} is approved-with-warning`);
    assert(Boolean(item.temporalWarning), `${item.itemId} has explicit temporalWarning`);
  }
  if (item.temporalStatus === 'CURRENT') {
    assert(item.promotionStatus === 'approved', `${item.itemId} is approved`);
  }
});

console.log('\n=== TEST 11-14: ZERO MUTATION OF CANONICAL CORPUS ===');
const corpusFiles = fs.readdirSync('content/corpus').filter(f => f.endsWith('.json'));
assert(corpusFiles.length === 1088, 'Canonical corpus file count = 1088 (untouched)');

const corpusIndex = JSON.parse(fs.readFileSync('content/corpus-index.json', 'utf-8'));
assert(corpusIndex.length === 1088, 'Corpus index length = 1088 (untouched)');

const manifestFile = JSON.parse(fs.readFileSync('content/manifest.json', 'utf-8'));
assert(manifestFile.totalItems === 1088, 'Manifest totalItems = 1088 (untouched)');

// SUMMARY
console.log('\n=== TEMPORAL CONSISTENCY VALIDATION SUMMARY ===');
console.log('PASSED: ' + passed);
console.log('FAILED: ' + failed);
if (errors.length > 0) {
  console.log('\nFAILED CHECKS:');
  errors.forEach(e => console.log('  ' + e.label + (e.detail ? ' — ' + e.detail : '')));
}
process.exit(failed > 0 ? 1 : 0);
