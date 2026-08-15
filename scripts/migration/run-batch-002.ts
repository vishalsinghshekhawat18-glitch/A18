import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LegacySourceIndex } from './source-index';
import { ManifestManager } from './migration-manifest';
import { BatchValidator } from './batch-validator';
import { transformCoreChapterToKnowledgeItem } from './extractors/core-extractor';
import { transformCANoteToKnowledgeItem } from './extractors/ca-extractor';
import { transformQuantStaticToKnowledgeItem } from './extractors/quant-static-extractor';
import { KnowledgeItem } from '../../schema/knowledge-item';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runBatch002() {
  console.log('🚀 EXECUTING BATCH 002 PRODUCTION CROSS-SOURCE MIGRATION (25 ITEMS)...\n');

  const sourceIndex = new LegacySourceIndex();
  const manifestManager = new ManifestManager();
  const validator = new BatchValidator();

  // Define the exact 25 cross-source target specs
  const batch002Specs: Array<{ sourceSystem: 'Core' | 'CA' | 'Schemes' | 'StaticGA' | 'Quant' | 'PYQs'; realSourceId: string }> = [
    // Core All-Subjects (5 items)
    { sourceSystem: 'Core', realSourceId: 'pol-ch-35' },
    { sourceSystem: 'Core', realSourceId: 'his-ch-20' },
    { sourceSystem: 'Core', realSourceId: 'geo-ch-5' },
    { sourceSystem: 'Core', realSourceId: 'sci-ch-3' },
    { sourceSystem: 'Core', realSourceId: 'rev-ch-1' },

    // Current Affairs (5 items)
    { sourceSystem: 'CA', realSourceId: 'note-sec1-1' },
    { sourceSystem: 'CA', realSourceId: 'note-sec1-2' },
    { sourceSystem: 'CA', realSourceId: 'note-sec1-3' },
    { sourceSystem: 'CA', realSourceId: 'note-sec1-4' },
    { sourceSystem: 'CA', realSourceId: 'note-sec1-5' },

    // Government Schemes (5 items)
    { sourceSystem: 'Schemes', realSourceId: 'scheme-1' },
    { sourceSystem: 'Schemes', realSourceId: 'scheme-2' },
    { sourceSystem: 'Schemes', realSourceId: 'scheme-3' },
    { sourceSystem: 'Schemes', realSourceId: 'scheme-4' },
    { sourceSystem: 'Schemes', realSourceId: 'scheme-5' },

    // Static GA (5 items)
    { sourceSystem: 'StaticGA', realSourceId: 'ch1-sub1' },
    { sourceSystem: 'StaticGA', realSourceId: 'ch1-sub2' },
    { sourceSystem: 'StaticGA', realSourceId: 'ch2-sub1' },
    { sourceSystem: 'StaticGA', realSourceId: 'ch3-sub1' },
    { sourceSystem: 'StaticGA', realSourceId: 'ch4-sub1' },

    // Quant & PYQs (5 items)
    { sourceSystem: 'Quant', realSourceId: 'qsec1-1' },
    { sourceSystem: 'Quant', realSourceId: 'qsec1-2' },
    { sourceSystem: 'Quant', realSourceId: 'qsec2-1' },
    { sourceSystem: 'Quant', realSourceId: 'qsec2-2' },
    { sourceSystem: 'PYQs', realSourceId: 'qsec8-2' }
  ];

  console.log(`📋 Selected ${batch002Specs.length} cross-source items for Batch #2:`);

  const sourceRecords: Array<{ sourceSystem: string; sourceId: string; rawPayload: any }> = [];
  const targetItems: KnowledgeItem[] = [];

  for (const spec of batch002Specs) {
    const srcRecord = sourceIndex.getEntity(spec.sourceSystem, spec.realSourceId);
    if (!srcRecord) {
      throw new Error(`CRITICAL BATCH 002 ERROR: Could not resolve explicit source entity for ${spec.sourceSystem}:${spec.realSourceId}`);
    }

    sourceRecords.push({
      sourceSystem: spec.sourceSystem,
      sourceId: spec.realSourceId,
      rawPayload: srcRecord.rawPayload
    });

    const destId = `migrated-${spec.sourceSystem.toLowerCase()}-${spec.realSourceId.replace(/[^a-zA-Z0-9-]/g, '-')}`;
    let targetItem: KnowledgeItem;

    if (spec.sourceSystem === 'Core') {
      targetItem = transformCoreChapterToKnowledgeItem({ ...srcRecord.rawPayload, id: destId, realSourceId: spec.realSourceId }, srcRecord.rawPayload);
    } else if (spec.sourceSystem === 'CA') {
      targetItem = transformCANoteToKnowledgeItem({ ...srcRecord.rawPayload, id: destId, realSourceId: spec.realSourceId }, srcRecord.rawPayload);
    } else {
      targetItem = transformQuantStaticToKnowledgeItem(
        {
          id: destId,
          subId: destId,
          realSourceId: spec.realSourceId,
          title: srcRecord.sourceTitle,
          headers: srcRecord.rawPayload.headers,
          rows: srcRecord.rawPayload.rows,
          formulas: srcRecord.rawPayload.formulas,
          workedExamples: srcRecord.rawPayload.workedExamples,
          items: srcRecord.rawPayload.items,
          shortcuts: srcRecord.rawPayload.shortcuts,
          traps: srcRecord.rawPayload.traps,
          category: srcRecord.rawPayload.category
        },
        spec.sourceSystem as any,
        srcRecord.sourceFile,
        srcRecord.rawPayload
      );
    }

    targetItems.push(targetItem);
    console.log(`   * [${spec.sourceSystem}] ${spec.realSourceId} -> ${targetItem.id}: "${targetItem.title.substring(0, 40)}..."`);
  }

  // Validate Batch 002 through 8 Fail-Closed Gates
  const valResult = validator.validateBatchItems(2, sourceRecords, targetItems);

  console.log(`\n------------------------------------------------------------`);
  console.log(`📊 BATCH 002 VALIDATION AUDIT RESULTS:`);
  console.log(`   - Attempted: ${valResult.attemptedCount}`);
  console.log(`   - Passed:    ${valResult.passedCount}`);
  console.log(`   - Failed:    ${valResult.failedCount}`);
  console.log(`   - Status:    ${valResult.overallStatus === 'PASS' ? '🟢 PASS' : '🔴 FAIL'}`);
  console.log(`------------------------------------------------------------\n`);

  if (valResult.overallStatus === 'FAIL') {
    console.error('❌ BATCH 002 FAILED FAIL-CLOSED AUDIT! Errors:');
    valResult.itemErrors.forEach(err => console.error(`   - [${err.errorType}] ${err.sourceSystem}:${err.sourceId} -> ${err.message}`));
    process.exit(1);
  }

  // Write batch items to disk under content/corpus/
  const corpusDir = path.resolve(__dirname, '../../content/corpus');
  if (!fs.existsSync(corpusDir)) {
    fs.mkdirSync(corpusDir, { recursive: true });
  }

  for (const item of targetItems) {
    fs.writeFileSync(
      path.join(corpusDir, `${item.id}.json`),
      JSON.stringify(item, null, 2)
    );
    const prov = item.metadata!.provenance!;
    manifestManager.updateEntryStatus(prov.sourceSystem, prov.sourceId, 'migrated', item.id, 'PASS', 2);
  }

  console.log(`💾 Batch 002 files written to content/corpus/ and manifest updated.`);
}

runBatch002();
