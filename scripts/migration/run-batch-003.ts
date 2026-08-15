import { BatchMigrator } from './batch-migrator';

const migrator = new BatchMigrator();
const result = migrator.runBatch({
  batchNumber: 3,
  batchSize: 25,
  dryRun: false
});

if (result.overallStatus !== 'PASS') {
  console.error('❌ Batch 003 failed gates. Halting migration.');
  process.exit(1);
} else {
  console.log('🎉 Batch 003 successfully migrated and verified!');
}
