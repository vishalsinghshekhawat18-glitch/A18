import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { LegacySourceIndex } from '../migration/source-index';

const corpusDir = 'C:\\Users\\visha\\OneDrive\\Documents\\banking-command-center\\content\\corpus';

export function runIndependentBatch002Reconciliation() {
  console.log('🔬 EXECUTING INDEPENDENT READ-ONLY RECONCILIATION ON BATCH 002 (25 CROSS-SOURCE ITEMS)...\n');

  const sourceIndex = new LegacySourceIndex();

  const batch002TargetIds = [
    'migrated-core-pol-ch-35',
    'migrated-core-his-ch-20',
    'migrated-core-geo-ch-5',
    'migrated-core-sci-ch-3',
    'migrated-core-rev-ch-1',
    'migrated-ca-note-sec1-1',
    'migrated-ca-note-sec1-2',
    'migrated-ca-note-sec1-3',
    'migrated-ca-note-sec1-4',
    'migrated-ca-note-sec1-5',
    'migrated-schemes-scheme-1',
    'migrated-schemes-scheme-2',
    'migrated-schemes-scheme-3',
    'migrated-schemes-scheme-4',
    'migrated-schemes-scheme-5',
    'migrated-staticga-ch1-sub1',
    'migrated-staticga-ch1-sub2',
    'migrated-staticga-ch2-sub1',
    'migrated-staticga-ch3-sub1',
    'migrated-staticga-ch4-sub1',
    'migrated-quant-qsec1-1',
    'migrated-quant-qsec1-2',
    'migrated-quant-qsec2-1',
    'migrated-quant-qsec2-2',
    'migrated-pyqs-qsec8-2'
  ];

  const reconciliationRows: any[] = [];
  const familyCounts: Record<string, number> = {
    Core: 0,
    CA: 0,
    Schemes: 0,
    StaticGA: 0,
    Quant: 0,
    PYQs: 0
  };

  let failCount = 0;

  for (const tid of batch002TargetIds) {
    const filePath = path.join(corpusDir, `${tid}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing corpus file for ${tid}`);
      failCount++;
      continue;
    }

    const targetJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const prov = targetJson.metadata?.provenance;

    const sourceSystem = prov?.sourceSystem;
    const realSourceId = prov?.sourceId;

    if (sourceSystem && familyCounts[sourceSystem] !== undefined) {
      familyCounts[sourceSystem]++;
    }

    const srcRecord = sourceIndex.getEntity(sourceSystem, realSourceId);

    let status = 'PASS';
    const issues: string[] = [];

    if (!srcRecord) {
      status = 'FAIL';
      issues.push(`Legacy source entity not found for ${sourceSystem}:${realSourceId}`);
    } else {
      // Title match
      if (targetJson.title !== srcRecord.sourceTitle) {
        status = 'FAIL';
        issues.push(`Title mismatch: legacy "${srcRecord.sourceTitle}" vs target "${targetJson.title}"`);
      }

      // Checksum match
      const calcHash = crypto.createHash('sha256').update(JSON.stringify(srcRecord.rawPayload)).digest('hex');
      if (prov.sourceChecksum !== calcHash) {
        status = 'FAIL';
        issues.push(`Checksum mismatch: calculated "${calcHash}" vs stored "${prov.sourceChecksum}"`);
      }

      // Blocks check
      if (!targetJson.blocks || targetJson.blocks.length === 0) {
        status = 'FAIL';
        issues.push('Zero semantic blocks generated');
      }
    }

    if (status === 'FAIL') failCount++;

    reconciliationRows.push({
      SourceSystem: sourceSystem || 'N/A',
      SourceID: realSourceId || 'UNMAPPED',
      SourceTitle: srcRecord ? (srcRecord.sourceTitle.length > 30 ? srcRecord.sourceTitle.substring(0, 30) + '...' : srcRecord.sourceTitle) : 'MISSING',
      DestinationID: targetJson.id,
      BlocksCount: targetJson.blocks?.length || 0,
      ChecksumMatch: srcRecord && prov.sourceChecksum === crypto.createHash('sha256').update(JSON.stringify(srcRecord.rawPayload)).digest('hex') ? 'MATCH' : 'MISMATCH',
      AuditStatus: status
    });
  }

  console.log('📋 CROSS-SOURCE ACCOUNTING TABLE (BATCH 002 — 25 ITEMS):');
  console.table(reconciliationRows);

  console.log('\n------------------------------------------------------------');
  console.log('📊 COUNTS BY SOURCE FAMILY:');
  console.log(`   - Core:      ${familyCounts.Core}`);
  console.log(`   - CA:        ${familyCounts.CA}`);
  console.log(`   - Schemes:   ${familyCounts.Schemes}`);
  console.log(`   - Static GA: ${familyCounts.StaticGA}`);
  console.log(`   - Quant:     ${familyCounts.Quant}`);
  console.log(`   - PYQs:      ${familyCounts.PYQs}`);
  console.log(`   - TOTAL:     ${Object.values(familyCounts).reduce((a, b) => a + b, 0)}`);
  console.log('------------------------------------------------------------\n');

  console.log(`============================================================`);
  console.log(`INDEPENDENT BATCH 002 RECONCILIATION VERDICT: ${failCount === 0 ? '🟢 GREEN (25/25 PASSED)' : '🔴 RED (' + failCount + ' FAILED)'}`);
  console.log(`============================================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runIndependentBatch002Reconciliation();
