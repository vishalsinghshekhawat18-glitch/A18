import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KnowledgeItemSchema } from '../../schema/knowledge-item.zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demoDir = path.resolve(__dirname, '../../content/demo');

function validateAllDemoFiles() {
  console.log('🔍 Executing Zod Schema Validation on Repo C Synthetic Corpus...\n');

  if (!fs.existsSync(demoDir)) {
    console.error(`❌ Demo directory not found at: ${demoDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(demoDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.error('❌ No demo JSON files found to validate.');
    process.exit(1);
  }

  const allIds = new Set<string>();
  let passedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = path.join(demoDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(content);

      const parsed = KnowledgeItemSchema.parse(json);

      if (allIds.has(parsed.id)) {
        console.error(`❌ ID Collision detected: "${parsed.id}" in file ${file}`);
        errorCount++;
      } else {
        allIds.add(parsed.id);
      }

      console.log(`✅ [PASS] ${file} (ID: ${parsed.id}, Domain: ${parsed.domain}, Blocks: ${parsed.blocks.length})`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${file}:`);
      if (err.errors) {
        err.errors.forEach((e: any) => {
          console.error(`   - Path: ${e.path.join('.')} | Error: ${e.message}`);
        });
      } else {
        console.error(`   - ${err.message}`);
      }
      errorCount++;
    }
  }

  console.log('\n----------------------------------------');
  console.log(`Validation Summary: ${passedCount} passed, ${errorCount} failed out of ${files.length} files.`);

  if (errorCount > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All synthetic demo files passed structural Zod validation!\n');
  }
}

validateAllDemoFiles();
