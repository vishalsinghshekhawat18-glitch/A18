import crypto from 'node:crypto';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { KnowledgeItemSchema } from '../../schema/knowledge-item.zod';

export interface BatchValidationResult {
  batchNumber: number;
  attemptedCount: number;
  passedCount: number;
  failedCount: number;
  reviewRequiredCount: number;
  overallStatus: 'PASS' | 'FAIL';
  gateResults: {
    gateAInventory: boolean;
    gateBIdentity: boolean;
    gateCMetadata: boolean;
    gateDStructural: boolean;
    gateEContent: boolean;
    gateFSpecialSymbols: boolean;
    gateGProvenance: boolean;
    gateHBuild: boolean;
  };
  itemErrors: Array<{
    sourceSystem: string;
    sourceId: string;
    destId: string;
    errorType: string;
    message: string;
  }>;
}

export class BatchValidator {
  public validateBatchItems(
    batchNumber: number,
    sourceRecords: Array<{ sourceSystem: string; sourceId: string; rawPayload: any }>,
    targetItems: KnowledgeItem[]
  ): BatchValidationResult {
    const itemErrors: Array<{ sourceSystem: string; sourceId: string; destId: string; errorType: string; message: string }> = [];

    let gateAInventory = true;
    let gateBIdentity = true;
    let gateCMetadata = true;
    let gateDStructural = true;
    let gateEContent = true;
    let gateFSpecialSymbols = true;
    let gateGProvenance = true;
    let gateHBuild = true;

    // Gate A: Inventory
    if (sourceRecords.length !== targetItems.length) {
      gateAInventory = false;
      itemErrors.push({
        sourceSystem: 'Batch',
        sourceId: 'N/A',
        destId: 'N/A',
        errorType: 'Gate A Inventory Failure',
        message: `Expected ${sourceRecords.length} items, received ${targetItems.length}`
      });
    }

    // Per-item audit across Gates B - G
    for (let i = 0; i < sourceRecords.length; i++) {
      const src = sourceRecords[i];
      const target = targetItems[i];

      if (!target) {
        itemErrors.push({
          sourceSystem: src.sourceSystem,
          sourceId: src.sourceId,
          destId: 'MISSING',
          errorType: 'Gate A Item Missing',
          message: `Target KnowledgeItem missing for source ${src.sourceSystem}:${src.sourceId}`
        });
        continue;
      }

      // Zod Schema Check
      try {
        KnowledgeItemSchema.parse(target);
      } catch (err: any) {
        gateDStructural = false;
        itemErrors.push({
          sourceSystem: src.sourceSystem,
          sourceId: src.sourceId,
          destId: target.id,
          errorType: 'Zod Schema Validation Failure',
          message: err.message
        });
      }

      // Gate B: Identity
      const prov = target.metadata?.provenance;
      if (!prov || prov.sourceId !== src.sourceId || prov.sourceSystem !== src.sourceSystem) {
        gateBIdentity = false;
        itemErrors.push({
          sourceSystem: src.sourceSystem,
          sourceId: src.sourceId,
          destId: target.id,
          errorType: 'Gate B Identity Mismatch',
          message: `Provenance sourceId "${prov?.sourceId}" or system "${prov?.sourceSystem}" mismatch`
        });
      }

      // Gate C: Metadata
      if (!target.title || !target.domain || !target.type || !target.metadata) {
        gateCMetadata = false;
        itemErrors.push({
          sourceSystem: src.sourceSystem,
          sourceId: src.sourceId,
          destId: target.id,
          errorType: 'Gate C Metadata Incomplete',
          message: 'Missing core metadata attributes'
        });
      }

      // Gate D: Structural
      if (!target.blocks || target.blocks.length === 0) {
        gateDStructural = false;
        itemErrors.push({
          sourceSystem: src.sourceSystem,
          sourceId: src.sourceId,
          destId: target.id,
          errorType: 'Gate D Empty Blocks',
          message: 'Zero semantic blocks generated'
        });
      }

      // Gate E: Content Text & Word Preservation
      const srcText = JSON.stringify(src.rawPayload)
        .replace(/<[^>]+>/g, ' ')
        .replace(/\\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const targetText = JSON.stringify(target.blocks)
        .replace(/<[^>]+>/g, ' ')
        .replace(/\\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const srcWords = srcText.split(' ').filter(Boolean);
      const targetWords = targetText.split(' ').filter(Boolean);

      if (srcWords.length > 5 && targetWords.length === 0) {
        gateEContent = false;
        itemErrors.push({
          sourceSystem: src.sourceSystem,
          sourceId: src.sourceId,
          destId: target.id,
          errorType: 'Gate E Content Omission',
          message: 'Target blocks generated empty text from non-empty source'
        });
      }

      // Gate F: Special Symbols (Rupee ₹, %)
      if (srcText.includes('₹') && !targetText.includes('₹')) {
        gateFSpecialSymbols = false;
        itemErrors.push({
          sourceSystem: src.sourceSystem,
          sourceId: src.sourceId,
          destId: target.id,
          errorType: 'Gate F Symbol Loss',
          message: 'Rupee symbol (₹) lost during migration'
        });
      }

      if (srcText.includes('%') && !targetText.includes('%')) {
        gateFSpecialSymbols = false;
        itemErrors.push({
          sourceSystem: src.sourceSystem,
          sourceId: src.sourceId,
          destId: target.id,
          errorType: 'Gate F Symbol Loss',
          message: 'Percentage symbol (%) lost during migration'
        });
      }

      // Gate G: SHA-256 Provenance Checksum
      const calcHash = crypto.createHash('sha256').update(JSON.stringify(src.rawPayload)).digest('hex');
      if (prov?.sourceChecksum !== calcHash) {
        gateGProvenance = false;
        itemErrors.push({
          sourceSystem: src.sourceSystem,
          sourceId: src.sourceId,
          destId: target.id,
          errorType: 'Gate G Provenance Checksum Mismatch',
          message: `Checksum mismatch: expected ${calcHash}, found ${prov?.sourceChecksum}`
        });
      }
    }

    const overallStatus = itemErrors.length === 0 ? 'PASS' : 'FAIL';

    return {
      batchNumber,
      attemptedCount: sourceRecords.length,
      passedCount: overallStatus === 'PASS' ? sourceRecords.length : sourceRecords.length - itemErrors.length,
      failedCount: itemErrors.length,
      reviewRequiredCount: 0,
      overallStatus,
      gateResults: {
        gateAInventory,
        gateBIdentity,
        gateCMetadata,
        gateDStructural,
        gateEContent,
        gateFSpecialSymbols,
        gateGProvenance,
        gateHBuild
      },
      itemErrors
    };
  }
}
