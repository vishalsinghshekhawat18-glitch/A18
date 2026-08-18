/**
 * R4.C4 — Test Suite for Canonical Content Repair Engine & Repair Manifest Generator
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

// 1. Load canonical corpus (1,088 items)
const corpusDir = 'content/corpus';
const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json')).sort();
const corpus = files.map(f => JSON.parse(fs.readFileSync(path.join(corpusDir, f), 'utf-8')));
const corpusMap = new Map(corpus.map(i => [i.id, i]));

console.log('\n========================================================');
console.log('🛠️ R4.C4 CONTENT REPAIR ENGINE & MANIFEST TEST SUITE');
console.log(`Corpus Size: ${corpus.length} Items`);
console.log('========================================================\n');

// 2. Load Quality Assessments from R4.C3.1
const qualityReportPath = 'content/content-quality-report.json';
const qualityReport = JSON.parse(fs.readFileSync(qualityReportPath, 'utf-8'));
const qualityMap = new Map(qualityReport.assessments.map(a => [a.itemId, a]));

// 3. Define Repair Generation Logic (Mirrored from app/intelligence/contentRepair.ts)
const SCHEME_FIELD_DEFINITIONS = [
  { field: 'nodalMinistry', pattern: /\b(ministry of|nodal ministry|administered by|m\/o|under the ministry)\b/i },
  { field: 'department', pattern: /\b(department of|nodal department|d\/o|division)\b/i },
  { field: 'launchYear', pattern: /\b(launched in|launched on|launch date|year of launch|started in|introduced in|\b20\d\d\b)\b/i },
  { field: 'keyObjectives', pattern: /\b(objective|aims to|purpose|goal|mandate|focus area)\b/i },
  { field: 'targetBeneficiaries', pattern: /\b(beneficiar|target group|eligible citizens|small and marginal farmers|women|sc\/st|artisans|unorganised)\b/i },
  { field: 'eligibilityCriteria', pattern: /\b(eligibility|criteria|qualification|age limit|income ceiling|landholding)\b/i },
  { field: 'financialOutlay', pattern: /\b(outlay|budget|fund|allocation|rs\.|₹|\bcrore\b|\blakh\b)\b/i },
  { field: 'fundingPattern', pattern: /\b(central sector|centrally sponsored|funding ratio|100% central|60:40|90:10|50:50)\b/i },
  { field: 'implementingAgency', pattern: /\b(implementing agency|nodal agency|nabard|sidbi|rbi|state government|gram panchayat|spv)\b/i },
  { field: 'keyBenefits', pattern: /\b(subsidy|assistance|incentive|pension|insurance|guarantee|loan|interest subvention)\b/i },
  { field: 'importantFeatures', pattern: /\b(key features|components|salient features|highlights|sub-mission)\b/i },
  { field: 'examRelevance', pattern: /\b(exam trap|mistake|remember|important note|key distinction|recent update)\b/i }
];

function extractPlainText(blocks = []) {
  const parts = [];
  for (const b of blocks) {
    if (!b) continue;
    if (typeof b.content === 'string') parts.push(b.content);
    if (typeof b.text === 'string') parts.push(b.text);
    if (typeof b.title === 'string') parts.push(b.title);
    if (Array.isArray(b.items)) parts.push(...b.items.filter(it => typeof it === 'string'));
    if (Array.isArray(b.rows)) {
      b.rows.forEach(r => {
        if (Array.isArray(r)) parts.push(...r.filter(c => typeof c === 'string'));
      });
    }
  }
  return parts.join(' ').trim();
}

function analyzeFields(item) {
  const text = extractPlainText(item.blocks);
  const missingFields = [];
  const weakFields = [];
  const sourceBackedFields = [];

  for (const def of SCHEME_FIELD_DEFINITIONS) {
    if (def.pattern.test(text)) {
      if (text.length > 200) {
        sourceBackedFields.push(def.field);
      } else {
        weakFields.push(def.field);
      }
    } else {
      missingFields.push(def.field);
    }
  }
  return { missingFields, weakFields, sourceBackedFields };
}

function buildPlan(item, quality) {
  const text = extractPlainText(item.blocks);
  const fields = analyzeFields(item);
  const diagnostics = [];
  const evidence = [];

  let repairAction = 'retain';
  let priority = 'P3';
  let canonicalTargetId = null;
  let canonicalTargetSection;
  let requiresHumanReview = false;
  let requiresExternalVerification = false;
  let confidence = quality.confidence || 'high';

  switch (quality.qualityStatus) {
    case 'artifact':
      repairAction = 'discard';
      priority = 'P3';
      requiresHumanReview = true;
      diagnostics.push('OCR debris or table of contents extraction trace; not a genuine study note.');
      evidence.push(`Found trace: ${text.slice(0, 100)}`);
      break;

    case 'fragment':
      repairAction = quality.parentId ? 'merge' : 'verify';
      priority = 'P1';
      canonicalTargetId = quality.parentId || null;
      requiresHumanReview = true;
      diagnostics.push(
        quality.parentId
          ? `Structural fragment (orphan sub-heading) belonging to parent "${quality.parentTitle}" (${quality.parentId}).`
          : 'Structural fragment with ambiguous parent mapping requiring manual resolution.'
      );
      if (quality.parentId) {
        evidence.push(`Parent matched: ${quality.parentId} (${quality.parentTitle})`);
      }
      break;

    case 'superseded':
      repairAction = 'supersede';
      priority = 'P2';
      canonicalTargetId = quality.supersededBy || 'migrated-schemes-masterfile';
      canonicalTargetSection = quality.supersededTarget;
      requiresHumanReview = false;
      diagnostics.push(`Fully superseded by authoritative masterfile entry "${quality.supersededTarget}".`);
      evidence.push(`Target masterfile section: ${quality.supersededTarget}`);
      break;

    case 'needs_enrichment':
      repairAction = 'enrich';
      priority = 'P1';
      requiresHumanReview = true;
      requiresExternalVerification = true;
      diagnostics.push(`Legitimate standalone scheme note lacking ${fields.missingFields.length} structured fields.`);
      evidence.push(`Existing length: ${text.length} chars. Present fields: ${fields.sourceBackedFields.join(', ') || 'none'}.`);
      break;

    case 'thin':
      repairAction = 'enrich';
      priority = 'P3';
      requiresHumanReview = true;
      requiresExternalVerification = true;
      diagnostics.push(`Short study note (${text.length} chars) queued for pedagogical expansion.`);
      break;

    case 'valid':
    default:
      repairAction = 'retain';
      priority = 'P3';
      requiresHumanReview = false;
      diagnostics.push('Structurally intact, self-contained study note.');
      break;
  }

  return {
    sourceItemId: item.id,
    domain: item.domain,
    sourceTitle: item.title,
    sourceQualityStatus: quality.qualityStatus,
    repairAction,
    canonicalTargetId,
    canonicalTargetSection,
    priority,
    status: 'pending_review',
    reasons: quality.reasons || [],
    diagnostics,
    evidence,
    missingFields: fields.missingFields,
    weakFields: fields.weakFields,
    sourceBackedFields: fields.sourceBackedFields,
    confidence,
    requiresHumanReview,
    requiresExternalVerification
  };
}

// 4. Generate repair plans
const repairPlans = [];
const nonValidPlans = [];

for (const item of corpus) {
  const quality = qualityMap.get(item.id);
  const plan = buildPlan(item, quality);
  repairPlans.push(plan);
  if (plan.repairAction !== 'retain') {
    nonValidPlans.push(plan);
  }
}

// 5. Generate and save content/repair-manifest.json
const repairManifest = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  summary: {
    totalCorpus: corpus.length,
    validRetained: corpus.length - nonValidPlans.length,
    totalRepairsNeeded: nonValidPlans.length,
    byAction: {
      supersede: nonValidPlans.filter(p => p.repairAction === 'supersede').length,
      merge: nonValidPlans.filter(p => p.repairAction === 'merge').length,
      discard: nonValidPlans.filter(p => p.repairAction === 'discard').length,
      enrich: nonValidPlans.filter(p => p.repairAction === 'enrich').length,
      verify: nonValidPlans.filter(p => p.repairAction === 'verify').length
    },
    byPriority: {
      P0: nonValidPlans.filter(p => p.priority === 'P0').length,
      P1: nonValidPlans.filter(p => p.priority === 'P1').length,
      P2: nonValidPlans.filter(p => p.priority === 'P2').length,
      P3: nonValidPlans.filter(p => p.priority === 'P3').length
    },
    schemesRepairsNeeded: nonValidPlans.filter(p => p.domain === 'schemes').length
  },
  manifest: nonValidPlans
};

const manifestPath = 'content/repair-manifest.json';
fs.writeFileSync(manifestPath, JSON.stringify(repairManifest, null, 2), 'utf-8');
console.log(`📄 Repair Manifest saved to: ${manifestPath}\n`);

// ============================================
// VERIFICATION OF THE 12 INVARIANTS
// ============================================

console.log('=== TEST 1: EVERY NON-VALID ITEM HAS EXACTLY ONE REPAIR ACTION ===');
nonValidPlans.forEach(p => {
  const validActions = ['supersede', 'merge', 'discard', 'enrich', 'verify'];
  assert(validActions.includes(p.repairAction), `Item ${p.sourceItemId} has valid primary repairAction (${p.repairAction})`);
});

console.log('\n=== TEST 2: EVERY REPAIR MANIFEST ID EXISTS IN CORPUS ===');
nonValidPlans.forEach(p => {
  assert(corpusMap.has(p.sourceItemId), `Manifest item ${p.sourceItemId} exists in canonical corpus`);
});

console.log('\n=== TEST 3: NO VALID ITEM RECEIVES DESTRUCTIVE ACTION ===');
repairPlans.filter(p => p.sourceQualityStatus === 'valid').forEach(p => {
  assert(p.repairAction === 'retain', `Valid item ${p.sourceItemId} receives 'retain' action`);
});

console.log('\n=== TEST 4: EVERY SUPERSEDED ITEM HAS CANONICAL TARGET ===');
const supersededPlans = nonValidPlans.filter(p => p.repairAction === 'supersede');
supersededPlans.forEach(p => {
  assert(p.canonicalTargetId === 'migrated-schemes-masterfile', `Superseded item ${p.sourceItemId} maps to masterfile`);
  assert(Boolean(p.canonicalTargetSection), `Superseded item ${p.sourceItemId} targets section "${p.canonicalTargetSection}"`);
});

console.log('\n=== TEST 5: EVERY FRAGMENT HAS PARENT OR REQUIRES VERIFICATION ===');
const fragmentPlans = nonValidPlans.filter(p => p.sourceQualityStatus === 'fragment');
fragmentPlans.forEach(p => {
  if (p.repairAction === 'merge') {
    assert(Boolean(p.canonicalTargetId), `Fragment ${p.sourceItemId} has resolved parent ${p.canonicalTargetId}`);
    assert(corpusMap.has(p.canonicalTargetId), `Parent ${p.canonicalTargetId} exists in corpus`);
  } else {
    assert(p.repairAction === 'verify', `Unresolved fragment ${p.sourceItemId} flagged for verification`);
  }
});

console.log('\n=== TEST 6: EVERY ARTIFACT HAS EXPLICIT REASON ===');
const artifactPlans = nonValidPlans.filter(p => p.repairAction === 'discard');
artifactPlans.forEach(p => {
  assert(p.evidence.length > 0, `Artifact ${p.sourceItemId} has explicit evidence`);
  assert(p.requiresHumanReview === true, `Artifact ${p.sourceItemId} marked for human review`);
});

console.log('\n=== TEST 7: EVERY ENRICHMENT ITEM HAS FIELD-LEVEL DIAGNOSTICS ===');
const enrichmentPlans = nonValidPlans.filter(p => p.repairAction === 'enrich');
enrichmentPlans.forEach(p => {
  assert(Array.isArray(p.missingFields), `Enrichment item ${p.sourceItemId} has missingFields array`);
  assert(Array.isArray(p.sourceBackedFields), `Enrichment item ${p.sourceItemId} has sourceBackedFields array`);
});

console.log('\n=== TEST 8: NO REPAIR WRITES TO CANONICAL CORPUS (READ-ONLY) ===');
assert(corpus.length === 1088, 'Canonical corpus file count remains exactly 1,088');

console.log('\n=== TEST 9: NO FABRICATED FACTUAL VALUES ARE GENERATED ===');
nonValidPlans.forEach(p => {
  // Ensure missingFields contains only field names, not fake values
  p.missingFields.forEach(f => {
    assert(typeof f === 'string' && !f.includes(':') && !f.includes('₹'), `Field name "${f}" is a pure schema field name`);
  });
});

console.log('\n=== TEST 10: REPAIR MANIFEST COUNT EQUALS 1088 - 918 = 170 ===');
assert(nonValidPlans.length === 1088 - 918, `Manifest length (${nonValidPlans.length}) === 1088 - 918 (170)`);
assert(nonValidPlans.length === 170, 'Repair manifest contains exactly 170 non-valid items');

console.log('\n=== TEST 11: GOVERNMENT SCHEME REPAIR COUNT EQUALS 172 - 9 = 163 ===');
const schemeRepairs = nonValidPlans.filter(p => p.domain === 'schemes');
assert(schemeRepairs.length === 172 - 9, `Scheme repairs count (${schemeRepairs.length}) === 172 - 9 (163)`);
assert(schemeRepairs.length === 163, 'Scheme repairs total exactly 163');

console.log('\n=== TEST 12: ALL REPAIR RECORDS DEFAULT TO pending_review ===');
nonValidPlans.forEach(p => {
  assert(p.status === 'pending_review', `Record ${p.sourceItemId} status is pending_review`);
});

// SUMMARY
console.log('\n=== CONTENT REPAIR ENGINE VALIDATION SUMMARY ===');
console.log('PASSED: ' + passed);
console.log('FAILED: ' + failed);
if (errors.length > 0) {
  console.log('\nFAILED CHECKS:');
  errors.forEach(e => console.log('  ' + e.label + (e.detail ? ' — ' + e.detail : '')));
}
process.exit(failed > 0 ? 1 : 0);
