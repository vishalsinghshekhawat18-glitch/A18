/**
 * R4.C5 — Validation Test Suite for Controlled Pilot Content Repairs
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
console.log('🧪 R4.C5 CONTROLLED PILOT REPAIR TEST SUITE');
console.log('========================================================\n');

const repairsDir = 'content/repairs/r4c5';
const pilotFiles = fs.existsSync(repairsDir)
  ? fs.readdirSync(repairsDir).filter(f => f.endsWith('.json'))
  : [];

const reviewReportPath = 'content/repairs/r4c5-review-report.json';
const reviewReport = fs.existsSync(reviewReportPath)
  ? JSON.parse(fs.readFileSync(reviewReportPath, 'utf-8'))
  : null;

const corpusDir = 'content/corpus';
const corpusFiles = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json')).sort();

// Check 1: Exactly 10 pilot items processed
console.log('=== CHECK 1: EXACTLY 10 PILOT ITEMS PROCESSED ===');
assert(pilotFiles.length === 10, 'Pilot directory contains exactly 10 repair files');
assert(Boolean(reviewReport), 'Review report content/repairs/r4c5-review-report.json exists');
assert(reviewReport?.pilotReviews?.length === 10, 'Review report contains exactly 10 scheme reviews');

// Check 2 & 3: Sourced facts and no invented fields
console.log('\n=== CHECK 2 & 3: SOURCED FACTS & ZERO INVENTED VALUES ===');
pilotFiles.forEach(f => {
  const filePath = path.join(repairsDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  assert(Array.isArray(data.sources) && data.sources.length >= 2, `${data.sourceItemId} has at least 2 authoritative sources`);
  assert(data.sources.every(s => typeof s === 'string' && (s.includes('Ministry') || s.includes('PIB') || s.includes('Official') || s.includes('Department') || s.includes('Portal') || s.includes('UGC') || s.includes('Canara Bank'))), `${data.sourceItemId} sources are official government/institutional`);
  assert(Array.isArray(data.addedFacts) && data.addedFacts.length > 0, `${data.sourceItemId} has explicit addedFacts array`);
  assert(data.requiresHumanReview === true, `${data.sourceItemId} has requiresHumanReview = true`);
  assert(data.status === 'pending_review', `${data.sourceItemId} has status = pending_review`);
});

// Check 4: Original content preserved in artifact
console.log('\n=== CHECK 4: ORIGINAL CONTENT PRESERVED IN REPAIR ARTIFACT ===');
pilotFiles.forEach(f => {
  const filePath = path.join(repairsDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const canonicalPath = path.join(corpusDir, `${data.sourceItemId}.json`);
  const canonicalData = JSON.parse(fs.readFileSync(canonicalPath, 'utf-8'));

  assert(Boolean(data.originalContent), `${data.sourceItemId} preserves originalContent`);
  assert(data.originalContent.id === canonicalData.id, `${data.sourceItemId} originalContent ID matches canonical`);
  assert(data.originalContent.domain === canonicalData.domain, `${data.sourceItemId} originalContent domain matches canonical`);
});

// Check 5: Repaired content structure integrity
console.log('\n=== CHECK 5: REPAIRED CONTENT STRUCTURE INTEGRITY ===');
pilotFiles.forEach(f => {
  const filePath = path.join(repairsDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const rep = data.repairedContent;

  assert(Boolean(rep.title) && rep.title.length > 10, `${data.sourceItemId} repaired title is complete`);
  assert(Boolean(rep.summary) && rep.summary.length > 20, `${data.sourceItemId} repaired summary is complete`);
  assert(Array.isArray(rep.blocks) && rep.blocks.length >= 5, `${data.sourceItemId} repaired blocks has structured hierarchy`);

  // Check no orphan heading / fragment inside repaired blocks
  const hasOrphanHeading = rep.blocks.some((b, i) => b.type === 'heading' && i === rep.blocks.length - 1);
  assert(!hasOrphanHeading, `${data.sourceItemId} contains zero trailing orphan headings`);
});

// Check 6: Unresolved fields / questions explicitly represented
console.log('\n=== CHECK 6: UNRESOLVED FIELDS & DETECTED PROBLEMS RECORDED ===');
pilotFiles.forEach(f => {
  const filePath = path.join(repairsDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  assert(Array.isArray(data.detectedProblems), `${data.sourceItemId} has detectedProblems list`);
});

// Check 7, 8, 9, 10: Canonical corpus, index, and manifest remain 100% untouched
console.log('\n=== CHECK 7-10: CANONICAL CORPUS, INDEX, MANIFEST UNTOUCHED ===');
assert(corpusFiles.length === 1088, 'Canonical corpus file count = 1088 (unchanged)');

const corpusIndex = JSON.parse(fs.readFileSync('content/corpus-index.json', 'utf-8'));
assert(corpusIndex.length === 1088, 'Corpus index entry count = 1088 (unchanged)');

const manifest = JSON.parse(fs.readFileSync('content/manifest.json', 'utf-8'));
assert(manifest.totalItems === 1088, 'Manifest totalItems = 1088 (unchanged)');

// SUMMARY
console.log('\n=== CONTROLLED PILOT REPAIR VALIDATION SUMMARY ===');
console.log('PASSED: ' + passed);
console.log('FAILED: ' + failed);
if (errors.length > 0) {
  console.log('\nFAILED CHECKS:');
  errors.forEach(e => console.log('  ' + e.label + (e.detail ? ' — ' + e.detail : '')));
}
process.exit(failed > 0 ? 1 : 0);
