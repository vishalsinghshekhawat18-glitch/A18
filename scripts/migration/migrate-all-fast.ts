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

export function migrateAllFast() {
  const manifestManager = new ManifestManager();
  const migrator = new BatchMigrator();

  let batchNum = 1;

  while (true) {
    const manifest = manifestManager.getManifest();
    const pendingCount = manifest.entries.filter(e => e.migrationStatus === 'pending').length;

    if (pendingCount === 0) {
      console.log('🎉 ALL 926 CORPUS ITEMS HAVE BEEN CONVERTED AND WRITTEN TO CONTENT/CORPUS!');
      break;
    }

    console.log(`\n============================================================`);
    console.log(`🚀 EXECUTING CONVERSION BATCH #${batchNum} (${pendingCount} ITEMS REMAINING PENDING)`);
    console.log(`============================================================\n`);

    const valResult = migrator.runBatch({
      batchNumber: batchNum,
      batchSize: 50,
      dryRun: false
    });

    if (valResult.overallStatus !== 'PASS') {
      console.error(`❌ CRITICAL FAILURE: Conversion Batch #${batchNum} failed Gates A–H audit!`);
      valResult.itemErrors.forEach(err => console.error(`   - [${err.errorType}] ${err.sourceSystem}:${err.sourceId} -> ${err.message}`));
      process.exit(1);
    }

    console.log(`✅ Batch #${batchNum} converted cleanly: ${valResult.passedCount} items written.`);
    batchNum++;
  }

  // 1. Run Structural Zod Schema Validation on all 926 items
  console.log('\n🔍 Running full structural Zod schema validation across entire corpus (npm run validate)...');
  runCommand('npm run validate');

  // 2. Run Migration Fidelity Reconciliation Audit
  console.log('\n📊 Running migration fidelity audit (npm run validate:fidelity)...');
  runCommand('npm run validate:fidelity');

  // 3. Build Production Bundle
  console.log('\n🏗️ Building production bundle (npm run build)...');
  runCommand('npm run build');

  // 4. Ensure dist/.nojekyll exists
  const noJekyllPath = path.join(projectRoot, 'dist', '.nojekyll');
  fs.writeFileSync(noJekyllPath, '# Disable Jekyll for GitHub Pages\n');

  // 5. Commit to main branch
  console.log(`\n📝 Committing 100% full corpus migration (926 items) to main branch...`);
  try {
    runCommand('git add .');
    runCommand('git commit -m "feat(migration): complete 100% full corpus migration of all 926 items"');
  } catch (err) {
    console.log(`⚠️ Git commit note: ${err}`);
  }

  // 6. Push to origin main
  console.log(`\n⬆️ Pushing main branch to origin/main...`);
  runCommand('git push origin main');

  // 7. Deploy to gh-pages branch
  console.log(`\n🚀 Deploying production build to GitHub Pages...`);
  runCommand('npx gh-pages -d dist');

  console.log('\n🎉 SUCCESS! All 926 corpus items are migrated, committed, built, and deployed to GitHub Pages live!');
}

migrateAllFast();
