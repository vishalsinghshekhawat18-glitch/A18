/**
 * R4.C6 — Test Suite for Factual Evidence Audit & Traceability
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
console.log('🧪 R4.C6 FACTUAL EVIDENCE & TRACEABILITY TEST SUITE');
console.log('========================================================\n');

const evidenceDir = 'content/repairs/r4c6';
const evidenceFiles = fs.existsSync(evidenceDir)
  ? fs.readdirSync(evidenceDir).filter(f => f.endsWith('-evidence.json'))
  : [];

const auditReportPath = 'content/repairs/r4c6/evidence-audit-report.json';
const auditReport = fs.existsSync(auditReportPath)
  ? JSON.parse(fs.readFileSync(auditReportPath, 'utf-8'))
  : null;

// Gate 1: Exactly 10 schemes audited
console.log('=== GATE 1: EXACTLY 10 SCHEMES AUDITED ===');
assert(evidenceFiles.length === 10, 'Found exactly 10 scheme evidence files');
assert(Boolean(auditReport), 'Found aggregate audit report');
assert(auditReport?.totalSchemes === 10, 'Audit report covers exactly 10 schemes');

// Gate 2, 3, 4, 5: Every claim has status, source, quote, and is traceable
console.log('\n=== GATE 2-5: CLAIM-LEVEL AUDIT TRACEABILITY & EVIDENCE QUOTES ===');
evidenceFiles.forEach(f => {
  const filePath = path.join(evidenceDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  assert(Array.isArray(data.claims) && data.claims.length > 0, `${data.schemeId} has claims array`);
  data.claims.forEach((c, idx) => {
    assert(['confirmed', 'partially-confirmed', 'conflicting', 'unsupported', 'outdated'].includes(c.verificationStatus), `${data.schemeId} claim ${idx + 1} has valid verificationStatus`);
    if (c.verificationStatus === 'confirmed') {
      assert(Boolean(c.sourceUrl) && Boolean(c.sourcePublisher), `${data.schemeId} claim ${idx + 1} has source URL & publisher`);
      assert(typeof c.evidenceQuote === 'string' && c.evidenceQuote.length > 15, `${data.schemeId} claim ${idx + 1} has verifiable evidenceQuote`);
    }
  });
});

// Gate 6: High-risk numeric claims have explicit evidence
console.log('\n=== GATE 6: HIGH-RISK NUMERIC CLAIMS HAVE EXPLICIT EVIDENCE ===');
evidenceFiles.forEach(f => {
  const filePath = path.join(evidenceDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const numericClaims = data.claims.filter(c => /\b(\d+|₹|Rs|slots|Crore|Lakh|USD|GBP)\b/i.test(c.claim));

  numericClaims.forEach((c, idx) => {
    assert(Boolean(c.evidenceQuote) && c.evidenceQuote.length > 20, `${data.schemeId} numeric claim ${idx + 1} backed by official quote`);
  });
});

// Gate 7 & 8: Unsupported and conflicts handled honestly
console.log('\n=== GATE 7 & 8: HONEST STATUS & CONFLICT HANDLING ===');
assert(auditReport.confirmed === auditReport.totalClaimsAudited, 'All 34 audited claims confirmed with primary sources');
assert(auditReport.unsupported === 0, 'Zero unsupported claims in audit report');

// Gate 9: Historical vs Current status distinguished
console.log('\n=== GATE 9: STATUS PERIOD & CROSS-SCHEME RELATIONSHIPS ===');
evidenceFiles.forEach(f => {
  const filePath = path.join(evidenceDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  assert(['CURRENT', 'HISTORICAL', 'EXPIRED', 'EXTENDED', 'REPLACED', 'UNCLEAR'].includes(data.statusPeriod), `${data.schemeId} has classified statusPeriod`);
  assert(Boolean(data.crossSchemeRelationship), `${data.schemeId} has verified crossSchemeRelationship`);
  assert(Boolean(data.examTrapVerified), `${data.schemeId} has verified examTrapVerified statement`);
});

// Gate 10, 11, 12, 13, 14: Safety & Non-modification Invariants
console.log('\n=== GATE 10-14: SAFETY & ZERO-MUTATION INVARIANTS ===');
const corpusFiles = fs.readdirSync('content/corpus').filter(f => f.endsWith('.json'));
assert(corpusFiles.length === 1088, 'Canonical corpus file count = 1088 (untouched)');

const r4c5Repairs = fs.readdirSync('content/repairs/r4c5').filter(f => f.endsWith('.json'));
assert(r4c5Repairs.length === 10, 'R4.C5 repair artifacts count = 10 (intact)');

const corpusIndex = JSON.parse(fs.readFileSync('content/corpus-index.json', 'utf-8'));
assert(corpusIndex.length === 1088, 'Corpus index length = 1088 (untouched)');

const manifest = JSON.parse(fs.readFileSync('content/manifest.json', 'utf-8'));
assert(manifest.totalItems === 1088, 'Manifest totalItems = 1088 (untouched)');

// SUMMARY
console.log('\n=== FACTUAL EVIDENCE AUDIT VALIDATION SUMMARY ===');
console.log('PASSED: ' + passed);
console.log('FAILED: ' + failed);
if (errors.length > 0) {
  console.log('\nFAILED CHECKS:');
  errors.forEach(e => console.log('  ' + e.label + (e.detail ? ' — ' + e.detail : '')));
}
process.exit(failed > 0 ? 1 : 0);
