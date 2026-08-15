import { BatchMigrator } from './batch-migrator';

const migrator = new BatchMigrator();
const result = migrator.runBatch({
  batchNumber: 4,
  batchSize: 25,
  dryRun: false
});

if (result.overallStatus !== 'PASS') {
  console.error('❌ Batch 004 failed gates. Halting migration.');
  process.exit(1);
} else {
  console.log('🎉 Batch 004 successfully migrated and verified!');
}
