import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LegacySourceIndex } from './source-index';
import { ManifestManager } from './migration-manifest';
import { BatchValidator, BatchValidationResult } from './batch-validator';
import { transformCoreChapterToKnowledgeItem } from './extractors/core-extractor';
import { transformCANoteToKnowledgeItem } from './extractors/ca-extractor';
import { transformQuantStaticToKnowledgeItem } from './extractors/quant-static-extractor';
import { KnowledgeItem } from '../../schema/knowledge-item';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface BatchRunConfig {
  batchNumber: number;
  batchSize: number;
  dryRun: boolean;
  filterSystem?: 'Core' | 'CA' | 'Schemes' | 'StaticGA' | 'Quant' | 'PYQs';
}

export class BatchMigrator {
  private sourceIndex: LegacySourceIndex;
  private manifestManager: ManifestManager;
  private validator: BatchValidator;

  constructor() {
    this.sourceIndex = new LegacySourceIndex();
    this.manifestManager = new ManifestManager();
    this.validator = new BatchValidator();
  }

  public runBatch(config: BatchRunConfig): BatchValidationResult {
    console.log(`\n============================================================`);
    console.log(`🚀 EXECUTING MIGRATION BATCH #${config.batchNumber} (${config.dryRun ? 'DRY-RUN MODE' : 'LIVE MODE'})`);
    console.log(`============================================================\n`);

    const manifest = this.manifestManager.getManifest();
    let pendingEntries = manifest.entries.filter(e => e.migrationStatus === 'pending');

    if (config.filterSystem) {
      pendingEntries = pendingEntries.filter(e => e.sourceSystem === config.filterSystem);
    }

    const batchEntries = pendingEntries.slice(0, config.batchSize);

    if (batchEntries.length === 0) {
      console.log('ℹ️ No pending items found for this batch configuration.');
      return {
        batchNumber: config.batchNumber,
        attemptedCount: 0,
        passedCount: 0,
        failedCount: 0,
        reviewRequiredCount: 0,
        overallStatus: 'PASS',
        gateResults: {
          gateAInventory: true,
          gateBIdentity: true,
          gateCMetadata: true,
          gateDStructural: true,
          gateEContent: true,
          gateFSpecialSymbols: true,
          gateGProvenance: true,
          gateHBuild: true
        },
        itemErrors: []
      };
    }

    console.log(`📋 Selected ${batchEntries.length} items for Batch #${config.batchNumber}:`);
    batchEntries.forEach((e, idx) => console.log(`   ${idx + 1}. [${e.sourceSystem}] ${e.sourceId}: "${e.sourceTitle.substring(0, 45)}..."`));

    const sourceRecords: Array<{ sourceSystem: string; sourceId: string; rawPayload: any }> = [];
    const targetItems: KnowledgeItem[] = [];

    for (const entry of batchEntries) {
      const srcRecord = this.sourceIndex.getEntity(entry.sourceSystem, entry.sourceId);
      if (!srcRecord) {
        throw new Error(`CRITICAL BATCH MIGRATION ERROR: Source payload missing for ${entry.sourceSystem}:${entry.sourceId}`);
      }

      sourceRecords.push({
        sourceSystem: entry.sourceSystem,
        sourceId: entry.sourceId,
        rawPayload: srcRecord.rawPayload
      });

      // Transform payload to Repo C KnowledgeItem
      const destId = `migrated-${entry.sourceSystem.toLowerCase()}-${entry.sourceId.replace(/[^a-zA-Z0-9-]/g, '-')}`;
      let targetItem: KnowledgeItem;

      if (entry.sourceSystem === 'Core') {
        targetItem = transformCoreChapterToKnowledgeItem({ ...srcRecord.rawPayload, id: destId, realSourceId: entry.sourceId }, srcRecord.rawPayload);
      } else if (entry.sourceSystem === 'CA') {
        targetItem = transformCANoteToKnowledgeItem({ ...srcRecord.rawPayload, id: destId, realSourceId: entry.sourceId }, srcRecord.rawPayload);
      } else {
        targetItem = transformQuantStaticToKnowledgeItem(
          {
            ...srcRecord.rawPayload,
            id: destId,
            subId: destId,
            realSourceId: entry.sourceId,
            title: srcRecord.sourceTitle || srcRecord.rawPayload.title || srcRecord.rawPayload.schemeName
          },
          entry.sourceSystem as any,
          srcRecord.sourceFile,
          srcRecord.rawPayload
        );
      }

      targetItems.push(targetItem);
    }

    // Validate Batch
    const valResult = this.validator.validateBatchItems(config.batchNumber, sourceRecords, targetItems);

    console.log(`\n------------------------------------------------------------`);
    console.log(`📊 BATCH #${config.batchNumber} VALIDATION AUDIT RESULTS:`);
    console.log(`   - Attempted: ${valResult.attemptedCount}`);
    console.log(`   - Passed:    ${valResult.passedCount}`);
    console.log(`   - Failed:    ${valResult.failedCount}`);
    console.log(`   - Status:    ${valResult.overallStatus === 'PASS' ? '🟢 PASS' : '🔴 FAIL'}`);
    console.log(`------------------------------------------------------------\n`);

    if (valResult.overallStatus === 'FAIL') {
      console.error('❌ BATCH FAILED FAIL-CLOSED GATE AUDIT! Errors:');
      valResult.itemErrors.forEach(err => {
        console.error(`   - [${err.errorType}] ${err.sourceSystem}:${err.sourceId} -> ${err.message}`);
        this.manifestManager.updateEntryStatus(err.sourceSystem, err.sourceId, 'failed', err.destId, 'FAIL', config.batchNumber);
      });
      return valResult;
    }

    if (!config.dryRun) {
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
        this.manifestManager.updateEntryStatus(prov.sourceSystem, prov.sourceId, 'migrated', item.id, 'PASS', config.batchNumber);
      }
      console.log(`💾 Batch #${config.batchNumber} files written to content/corpus/ and manifest updated.\n`);
    } else {
      console.log(`🧪 Dry-run complete. Zero files written to disk.\n`);
    }

    return valResult;
  }
}
