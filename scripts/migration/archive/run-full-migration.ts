import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BatchMigrator } from './batch-migrator';
import { ManifestManager } from './migration-manifest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

function runCommand(cmd: string) {
  console.log(`\n💻 Executing: ${cmd}`);
  execSync(cmd, { cwd: projectRoot, stdio: 'inherit' });
}

export function runFullCorpusMigration() {
  const manifestManager = new ManifestManager();
  const migrator = new BatchMigrator();

  let batchNum = 5;

  while (true) {
    const manifest = manifestManager.getManifest();
    const pendingCount = manifest.entries.filter(e => e.migrationStatus === 'pending').length;

    if (pendingCount === 0) {
      console.log('🎉 ALL 926 CORPUS ITEMS HAVE BEEN FULLY MIGRATED AND VERIFIED!');
      break;
    }

    console.log(`\n============================================================`);
    console.log(`🚀 STARTING BATCH #${batchNum} (${pendingCount} ITEMS REMAINING IN PENDING QUEUE)`);
    console.log(`============================================================\n`);

    // 1. Run Batch Migrator with Gates A–H
    const valResult = migrator.runBatch({
      batchNumber: batchNum,
      batchSize: 25,
      dryRun: false
    });

    if (valResult.overallStatus !== 'PASS') {
      console.error(`❌ CRITICAL FAILURE: Batch #${batchNum} failed Gates A–H audit! Halting migration pipeline.`);
      valResult.itemErrors.forEach(err => console.error(`   - [${err.errorType}] ${err.sourceSystem}:${err.sourceId} -> ${err.message}`));
      process.exit(1);
    }

    // 2. Run Zod Schema Validation
    console.log('\n🔍 Running structural Zod schema validation (npm run validate)...');
    try {
      runCommand('npm run validate');
    } catch (err) {
      console.error(`❌ CRITICAL FAILURE: Batch #${batchNum} failed npm run validate! Halting migration pipeline.`);
      process.exit(1);
    }

    // 3. Run Migration Fidelity Reconciliation Audit
    console.log('\n📊 Running migration fidelity audit (npm run validate:fidelity)...');
    try {
      runCommand('npm run validate:fidelity');
    } catch (err) {
      console.error(`❌ CRITICAL FAILURE: Batch #${batchNum} failed npm run validate:fidelity! Halting migration pipeline.`);
      process.exit(1);
    }

    // 4. Build Production Bundle
    console.log('\n🏗️ Building production bundle (npm run build)...');
    try {
      runCommand('npm run build');
    } catch (err) {
      console.error(`❌ CRITICAL FAILURE: Batch #${batchNum} failed npm run build! Halting migration pipeline.`);
      process.exit(1);
    }

    // 5. Ensure dist/.nojekyll exists
    const noJekyllPath = path.join(projectRoot, 'dist', '.nojekyll');
    fs.writeFileSync(noJekyllPath, '# Disable Jekyll for GitHub Pages\n');

    // 6. Commit to main branch
    console.log(`\n📝 Committing Batch #${batchNum} to main branch...`);
    try {
      runCommand('git add .');
      runCommand(`git commit -m "feat(migration): execute Batch #${batchNum} migration (${valResult.passedCount} items) and update manifest"`);
    } catch (err) {
      console.error(`⚠️ Git commit note: ${err}`);
    }

    // 7. Push to remote origin main
    console.log(`\n⬆️ Pushing Batch #${batchNum} commit to origin/main...`);
    try {
      runCommand('git push origin main');
    } catch (err) {
      console.error(`❌ CRITICAL FAILURE: Git push origin main failed for Batch #${batchNum}!`);
      process.exit(1);
    }

    // 8. Deploy to gh-pages branch
    console.log(`\n🚀 Deploying Batch #${batchNum} production build to GitHub Pages...`);
    try {
      runCommand('npx gh-pages -d dist');
    } catch (err) {
      console.error(`❌ CRITICAL FAILURE: Deployment to gh-pages failed for Batch #${batchNum}!`);
      process.exit(1);
    }

    console.log(`\n✅ BATCH #${batchNum} COMPLETED & DEPLOYED SUCCESSFULLY! (${manifestManager.getManifest().migratedCount} / 926 items migrated)`);
    batchNum++;
  }
}

runFullCorpusMigration();
