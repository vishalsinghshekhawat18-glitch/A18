import { BatchMigrator } from './batch-migrator';

export function runBatch001() {
  console.log('🚀 EXECUTING PRODUCTION MIGRATION FOR BATCH 001 (25 CORE ECONOMICS ITEMS)...\n');

  const migrator = new BatchMigrator();
  const result = migrator.runBatch({
    batchNumber: 1,
    batchSize: 25,
    dryRun: false,
    filterSystem: 'Core'
  });

  if (result.overallStatus === 'PASS') {
    console.log('\n🟢 BATCH 001 MIGRATION SUCCESSFUL: All 25 items migrated and passed 8-gate validation.');
  } else {
    console.error('\n🔴 BATCH 001 MIGRATION FAILED: Fail-closed validation gate triggered.');
    process.exit(1);
  }
}

runBatch001();
