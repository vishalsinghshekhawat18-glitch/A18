import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';
const corpusDir = 'C:\\Users\\visha\\OneDrive\\Documents\\banking-command-center\\content\\corpus';

export function runIndependentBatch001Reconciliation() {
  console.log('🔬 EXECUTING INDEPENDENT READ-ONLY RECONCILIATION ON BATCH 001 (25 ITEMS)...\n');

  // Load Legacy Core Chapters directly from index.html
  const indexPath = path.join(legacyDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const startIdx = indexContent.indexOf('const rawBookData =');
  const endIdx = indexContent.indexOf('let selectedSubject =', startIdx);
  const rawSnippet = indexContent.substring(startIdx + 'const rawBookData ='.length, endIdx);
  const lastBracketIdx = rawSnippet.lastIndexOf(']');
  const cleanArrayStr = rawSnippet.substring(0, lastBracketIdx + 1).trim();
  const allCoreChapters: any[] = JSON.parse(cleanArrayStr);

  const corpusFiles = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));

  if (corpusFiles.length !== 25) {
    console.error(`❌ INVENTORY RECONCILIATION ERROR: Expected 25 migrated files in content/corpus/, found ${corpusFiles.length}`);
    process.exit(1);
  }

  const reconciliationRows: any[] = [];
  let failCount = 0;

  for (const cFile of corpusFiles) {
    const filePath = path.join(corpusDir, cFile);
    const targetJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const prov = targetJson.metadata?.provenance;

    // 1. Find exact legacy source object by real legacy source ID
    const realSourceId = prov?.sourceId;
    const legacySource = allCoreChapters.find(c => c.id === realSourceId);

    let status = 'PASS';
    const issues: string[] = [];

    if (!legacySource) {
      status = 'FAIL';
      issues.push(`Legacy source object not found for ID "${realSourceId}"`);
    } else {
      // 2. Title Match Check
      if (targetJson.title !== legacySource.title) {
        status = 'FAIL';
        issues.push(`Title mismatch: legacy "${legacySource.title}" vs target "${targetJson.title}"`);
      }

      // 3. SHA-256 Checksum Verification
      const calcHash = crypto.createHash('sha256').update(JSON.stringify(legacySource)).digest('hex');
      if (prov.sourceChecksum !== calcHash) {
        status = 'FAIL';
        issues.push(`SHA-256 Checksum mismatch: legacy calculated "${calcHash}" vs stored provenance "${prov.sourceChecksum}"`);
      }

      // 4. Domain & Type Check
      if (targetJson.domain !== 'economics' || targetJson.type !== 'chapter') {
        status = 'FAIL';
        issues.push(`Domain/Type mismatch: expected domain "economics" & type "chapter", found domain "${targetJson.domain}" & type "${targetJson.type}"`);
      }

      // 5. Semantic Blocks Check
      if (!targetJson.blocks || targetJson.blocks.length === 0) {
        status = 'FAIL';
        issues.push('Target JSON contains zero semantic blocks');
      }

      // 6. Word Containment Check
      const legacyCleanText = legacySource.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const targetCleanText = JSON.stringify(targetJson.blocks).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const legacyWords = legacyCleanText.split(' ').filter(Boolean);
      const targetWords = targetCleanText.split(' ').filter(Boolean);

      if (legacyWords.length > 10 && targetWords.length === 0) {
        status = 'FAIL';
        issues.push('Target blocks generated 0 words from non-empty legacy body');
      }
    }

    if (status === 'FAIL') failCount++;

    reconciliationRows.push({
      TargetID: targetJson.id,
      SourceID: realSourceId || 'UNMAPPED',
      LegacyTitle: legacySource ? (legacySource.title.length > 35 ? legacySource.title.substring(0, 35) + '...' : legacySource.title) : 'MISSING',
      BlocksCount: targetJson.blocks?.length || 0,
      ChecksumMatch: legacySource && prov.sourceChecksum === crypto.createHash('sha256').update(JSON.stringify(legacySource)).digest('hex') ? 'MATCH' : 'MISMATCH',
      Status: status,
      Issues: issues.length > 0 ? issues.join(' | ') : 'None'
    });
  }

  console.log('📋 INDEPENDENT RECONCILIATION TABLE (BATCH 001 — 25 ITEMS):');
  console.table(reconciliationRows);

  console.log(`\n============================================================`);
  console.log(`INDEPENDENT RECONCILIATION VERDICT: ${failCount === 0 ? '🟢 GREEN (25/25 PASSED)' : '🔴 RED (' + failCount + ' FAILED)'}`);
  console.log(`============================================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runIndependentBatch001Reconciliation();
