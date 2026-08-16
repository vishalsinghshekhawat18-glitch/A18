import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LegacySourceIndex } from './source-index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestPath = path.resolve(__dirname, '../../content/manifest.json');

export type MigrationStatus = 'pending' | 'migrated' | 'review_required' | 'failed';

export interface ManifestEntry {
  sourceSystem: 'Core' | 'CA' | 'Schemes' | 'StaticGA' | 'Quant' | 'PYQs';
  sourceFile: string;
  sourceId: string;
  sourceTitle: string;
  sourceDomain: string;
  sourceType: string;
  sourceChecksum: string;
  migrationStatus: MigrationStatus;
  destinationId?: string;
  lastValidationStatus?: 'PASS' | 'FAIL' | 'UNTESTED';
  batchNumber?: number;
  lastUpdated?: string;
}

export interface MasterManifestSchema {
  version: string;
  totalItems: number;
  migratedCount: number;
  pendingCount: number;
  reviewRequiredCount: number;
  failedCount: number;
  lastUpdated: string;
  entries: ManifestEntry[];
}

export class ManifestManager {
  private manifest: MasterManifestSchema;

  constructor() {
    this.manifest = this.loadOrGenerateManifest();
  }

  private loadOrGenerateManifest(): MasterManifestSchema {
    if (fs.existsSync(manifestPath)) {
      try {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        return JSON.parse(content);
      } catch (e) {
        console.warn('⚠️ Could not parse existing manifest.json. Regenerating...');
      }
    }

    const index = new LegacySourceIndex();
    const entities = index.getAllEntities();
    const nowISO = new Date().toISOString();

    const entries: ManifestEntry[] = entities.map(e => ({
      sourceSystem: e.sourceSystem,
      sourceFile: e.sourceFile,
      sourceId: e.sourceId,
      sourceTitle: e.sourceTitle,
      sourceDomain: e.sourceDomain,
      sourceType: e.sourceType,
      sourceChecksum: e.sourceChecksum,
      migrationStatus: 'pending',
      lastValidationStatus: 'UNTESTED',
      lastUpdated: nowISO
    }));

    const newManifest: MasterManifestSchema = {
      version: '1.0.0-phase5',
      totalItems: entries.length,
      migratedCount: 0,
      pendingCount: entries.length,
      reviewRequiredCount: 0,
      failedCount: 0,
      lastUpdated: nowISO,
      entries
    };

    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, JSON.stringify(newManifest, null, 2));
    console.log(`📋 MASTER MIGRATION MANIFEST GENERATED AT: ${manifestPath} (${entries.length} items registered in PENDING state).\n`);
    return newManifest;
  }

  public getManifest(): MasterManifestSchema {
    return this.manifest;
  }

  public updateEntryStatus(
    sourceSystem: string,
    sourceId: string,
    status: MigrationStatus,
    destId?: string,
    valStatus?: 'PASS' | 'FAIL' | 'UNTESTED',
    batchNum?: number
  ): void {
    const entry = this.manifest.entries.find(e => e.sourceSystem === sourceSystem && e.sourceId === sourceId);
    if (!entry) {
      throw new Error(`CRITICAL MANIFEST ERROR: Entry not found for ${sourceSystem}:${sourceId}`);
    }

    entry.migrationStatus = status;
    if (destId) entry.destinationId = destId;
    if (valStatus) entry.lastValidationStatus = valStatus;
    if (batchNum !== undefined) entry.batchNumber = batchNum;
    entry.lastUpdated = new Date().toISOString();

    this.recalculateCounts();
    this.save();
  }

  private recalculateCounts(): void {
    this.manifest.totalItems = this.manifest.entries.length;
    this.manifest.migratedCount = this.manifest.entries.filter(e => e.migrationStatus === 'migrated').length;
    this.manifest.pendingCount = this.manifest.entries.filter(e => e.migrationStatus === 'pending').length;
    this.manifest.reviewRequiredCount = this.manifest.entries.filter(e => e.migrationStatus === 'review_required').length;
    this.manifest.failedCount = this.manifest.entries.filter(e => e.migrationStatus === 'failed').length;
    this.manifest.lastUpdated = new Date().toISOString();
  }

  private save(): void {
    fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2));
  }
}
