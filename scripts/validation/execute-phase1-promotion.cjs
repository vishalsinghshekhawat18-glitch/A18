/**
 * R4.C9 — Phase 1 Pilot Promotion Execution Engine
 * Promotes ONLY the 10 verified pilot scheme notes into content/corpus/
 * Updates corpus-index.json and manifest.json with deterministic ordering.
 * Generates an immutable promotion execution audit log.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

const PROMOTED_IDS = [
  'migrated-schemes-scheme-10',
  'migrated-schemes-scheme-100',
  'migrated-schemes-scheme-102',
  'migrated-schemes-scheme-107',
  'migrated-schemes-scheme-108',
  'migrated-schemes-scheme-109',
  'migrated-schemes-scheme-11',
  'migrated-schemes-scheme-110',
  'migrated-schemes-scheme-111',
  'migrated-schemes-scheme-112'
];

const r4c9PromotedDir = 'content/repairs/r4c9/promoted';
const corpusDir = 'content/corpus';
const planFile = 'content/repairs/canonical-promotion-plan.json';

const executionAudit = [];

console.log('\n========================================================');
console.log('🚀 EXECUTING PHASE 1 PILOT CANONICAL PROMOTION');
console.log('========================================================\n');

PROMOTED_IDS.forEach((id, idx) => {
  const stagedPath = path.join(r4c9PromotedDir, `${id}.json`);
  const canonicalPath = path.join(corpusDir, `${id}.json`);

  if (!fs.existsSync(stagedPath)) {
    throw new Error(`Staged promoted file missing: ${stagedPath}`);
  }
  if (!fs.existsSync(canonicalPath)) {
    throw new Error(`Canonical target file missing: ${canonicalPath}`);
  }

  const originalRaw = fs.readFileSync(canonicalPath, 'utf-8');
  const originalData = JSON.parse(originalRaw);
  const originalHash = sha256(originalRaw);

  const stagedRaw = fs.readFileSync(stagedPath, 'utf-8');
  const stagedData = JSON.parse(stagedRaw);
  const stagedHash = sha256(stagedRaw);

  // Safety checks
  if (stagedData.id !== originalData.id) {
    throw new Error(`ID Mismatch! Staged: ${stagedData.id} vs Original: ${originalData.id}`);
  }
  if (stagedData.domain !== 'schemes') {
    throw new Error(`Domain corrupted! Staged domain: ${stagedData.domain}`);
  }

  // Record audit log entry
  const auditEntry = {
    step: idx + 1,
    itemId: id,
    canonicalFile: `content/corpus/${id}.json`,
    stagedFile: `content/repairs/r4c9/promoted/${id}.json`,
    originalSha256: originalHash,
    promotedSha256: stagedHash,
    action: 'replace',
    reason: 'Promoted R4.C9 fine-tuned verified canonical note with component-level temporal lifecycle.',
    evidenceSources: stagedData.blocks.find(b => b.type === 'bullet_list' && b.items.some(i => i.includes('http') || i.includes('gov.in') || i.includes('PIB')))?.items || [],
    temporalStatus: stagedData.metadata.overallTemporalStatus,
    promotedTimestamp: new Date().toISOString()
  };

  executionAudit.push(auditEntry);

  // Execute in-place file replacement
  fs.writeFileSync(canonicalPath, JSON.stringify(stagedData, null, 2), 'utf-8');
  console.log(`✅ [${idx + 1}/10] Promoted: ${id} (${stagedData.title})`);
});

// Save promotion execution log
fs.writeFileSync('content/repairs/phase1-promotion-execution-audit.json', JSON.stringify({
  version: '1.0.0-phase1-execution',
  executedAt: new Date().toISOString(),
  totalPromoted: executionAudit.length,
  items: executionAudit
}, null, 2), 'utf-8');

console.log('\n=== REGENERATING CORPUS INDEX & MANIFEST ===');

// Rebuild corpus-index.json with exact full metadata schema and deterministic sorting
const allFiles = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));
const newIndexEntries = [];

allFiles.forEach(f => {
  const p = path.join(corpusDir, f);
  const item = JSON.parse(fs.readFileSync(p, 'utf-8'));
  newIndexEntries.push({
    id: item.id,
    type: item.type || 'static_note',
    domain: item.domain,
    title: item.title,
    summary: item.summary || '',
    metadata: item.metadata || {}
  });
});

// Deterministic sort by id
newIndexEntries.sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync('content/corpus-index.json', JSON.stringify(newIndexEntries, null, 2), 'utf-8');
console.log(`✅ corpus-index.json updated with ${newIndexEntries.length} entries.`);

// Rebuild manifest.json
const currentManifest = JSON.parse(fs.readFileSync('content/manifest.json', 'utf-8'));
const updatedManifest = {
  ...currentManifest,
  lastUpdated: new Date().toISOString(),
  totalItems: newIndexEntries.length
};
fs.writeFileSync('content/manifest.json', JSON.stringify(updatedManifest, null, 2), 'utf-8');
console.log(`✅ manifest.json updated with totalItems = ${updatedManifest.totalItems}.`);

console.log('\n========================================================');
console.log('🎉 PHASE 1 PROMOTION COMPLETED CLEANLY');
console.log('========================================================');
