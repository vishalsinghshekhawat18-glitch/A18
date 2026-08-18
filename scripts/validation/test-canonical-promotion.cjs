/**
 * R4.C7 — Validation Test Suite for Canonical Promotion Gate
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
console.log('🏛️ R4.C7 CANONICAL PROMOTION GATE VALIDATION SUITE');
console.log('========================================================\n');

const r4c7Dir = 'content/repairs/r4c7';
const promotedDir = path.join(r4c7Dir, 'promoted');
const manifestPath = path.join(r4c7Dir, 'promotion-manifest.json');
const diffReportPath = path.join(r4c7Dir, 'promotion-diff-report.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const diffReport = JSON.parse(fs.readFileSync(diffReportPath, 'utf-8'));
const promotedFiles = fs.readdirSync(promotedDir).filter(f => f.endsWith('.json'));

// Invariant 1 & 2: R4.C5 repair artifact & R4.C6 evidence audit exist for every item
console.log('=== INVARIANT 1 & 2: PREREQUISITE ARTIFACTS EXIST ===');
manifest.manifest.forEach(item => {
  const repairPath = item.repairFile;
  const evidencePath = item.evidenceFiles[0];
  assert(fs.existsSync(repairPath), `${item.itemId} has R4.C5 repair artifact at ${repairPath}`);
  assert(fs.existsSync(evidencePath), `${item.itemId} has R4.C6 evidence audit at ${evidencePath}`);
});

// Invariant 3 & 4: Every factual claim has evidence, no unsupported claims
console.log('\n=== INVARIANT 3 & 4: 100% CLAIM EVIDENCE BACKING ===');
manifest.manifest.forEach(item => {
  const evidenceData = JSON.parse(fs.readFileSync(item.evidenceFiles[0], 'utf-8'));
  assert(evidenceData.claims.length > 0, `${item.itemId} has audited claims`);
  evidenceData.claims.forEach(c => {
    assert(c.verificationStatus === 'confirmed', `${item.itemId} claim "${c.claim.slice(0, 40)}..." is confirmed`);
    assert(Boolean(c.evidenceQuote) && c.evidenceQuote.length > 15, `${item.itemId} claim backed by quote`);
  });
});

// Invariant 5 & 6: Temporal status and cross-scheme relationships represented
console.log('\n=== INVARIANT 5 & 6: TEMPORAL & CROSS-SCHEME MAPPING ===');
manifest.manifest.forEach(item => {
  assert(['current', 'historical', 'expired', 'superseded', 'changed', 'unclear'].includes(item.temporalStatus), `${item.itemId} has valid temporalStatus`);
  assert(Boolean(item.temporalNote), `${item.itemId} has temporalNote explanation`);
  assert(['PRIMARY', 'COMPONENT', 'DUPLICATE', 'SUPERSEDED', 'COMPLEMENTARY'].includes(item.crossSchemeRole), `${item.itemId} has crossSchemeRole`);
});

// Invariant 7-11: Structural integrity of promoted files
console.log('\n=== INVARIANT 7-11: STRUCTURAL INTEGRITY OF PROMOTED FILES ===');
promotedFiles.forEach(f => {
  const filePath = path.join(promotedDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  assert(Boolean(data.title) && data.title.length > 10, `${f} has complete title`);
  assert(Array.isArray(data.blocks) && data.blocks.length >= 5, `${f} has rich structured blocks`);

  // Check no empty blocks
  const hasEmptyBlock = data.blocks.some(b => !b || (b.type === 'bullet_list' && b.items?.length === 0));
  assert(!hasEmptyBlock, `${f} has zero empty blocks`);

  // Check no OCR debris
  const allText = JSON.stringify(data.blocks);
  assert(!allText.includes('-- 30 of 47 --') && !allText.includes('ONE STOP SOLUTION'), `${f} is free of OCR debris`);

  // Check no orphan heading
  const lastBlock = data.blocks[data.blocks.length - 1];
  assert(lastBlock.type !== 'heading', `${f} has no trailing orphan heading`);

  // Check metadata
  assert(data.metadata?.promotionGate === 'R4.C7-passed', `${f} metadata promotionGate confirmed`);
});

// Invariant 12-14: Canonical corpus, index, and manifest remain untouched
console.log('\n=== INVARIANT 12-14: ZERO MUTATION OF CANONICAL CORPUS ===');
const corpusFiles = fs.readdirSync('content/corpus').filter(f => f.endsWith('.json'));
assert(corpusFiles.length === 1088, 'Canonical corpus file count = 1088 (untouched)');

const corpusIndex = JSON.parse(fs.readFileSync('content/corpus-index.json', 'utf-8'));
assert(corpusIndex.length === 1088, 'Corpus index length = 1088 (untouched)');

const manifestFile = JSON.parse(fs.readFileSync('content/manifest.json', 'utf-8'));
assert(manifestFile.totalItems === 1088, 'Manifest totalItems = 1088 (untouched)');

// Invariant 15 & 16: Only approved items in promoted/, human-review items excluded
console.log('\n=== INVARIANT 15 & 16: PROMOTION ACCESS CONTROL ===');
manifest.manifest.forEach(item => {
  const promotedPath = path.join(promotedDir, `${item.itemId}.json`);
  if (item.promotionStatus === 'approved' || item.promotionStatus === 'approved-with-warning') {
    assert(fs.existsSync(promotedPath), `Approved item ${item.itemId} staged in promoted/`);
  } else {
    assert(!fs.existsSync(promotedPath), `Non-approved item ${item.itemId} NOT in promoted/`);
  }
});

// SUMMARY
console.log('\n=== CANONICAL PROMOTION GATE VALIDATION SUMMARY ===');
console.log('PASSED: ' + passed);
console.log('FAILED: ' + failed);
if (errors.length > 0) {
  console.log('\nFAILED CHECKS:');
  errors.forEach(e => console.log('  ' + e.label + (e.detail ? ' — ' + e.detail : '')));
}
process.exit(failed > 0 ? 1 : 0);
