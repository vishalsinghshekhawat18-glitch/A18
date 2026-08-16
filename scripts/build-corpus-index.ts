import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function buildCorpusIndex() {
  console.log('📦 BUILDING LIGHTWEIGHT CORPUS INDEX (WITHOUT BLOCKS)...');

  const corpusDir = path.resolve(__dirname, '../content/corpus');
  const indexFile = path.resolve(__dirname, '../content/corpus-index.json');

  if (!fs.existsSync(corpusDir)) {
    console.error('❌ Error: content/corpus directory missing.');
    return;
  }

  const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));
  const stubs: any[] = [];

  for (const file of files) {
    const filePath = path.join(corpusDir, file);
    const item = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Create lightweight stub preserving all metadata/title/domain but excluding heavy blocks
    stubs.push({
      id: item.id,
      type: item.type,
      domain: item.domain,
      title: item.title,
      summary: item.summary || '',
      metadata: item.metadata || {},
      relationships: item.relationships || []
    });
  }

  fs.writeFileSync(indexFile, JSON.stringify(stubs, null, 2));
  const sizeKb = (fs.statSync(indexFile).size / 1024).toFixed(1);
  console.log(`✅ Lightweight Index Built: ${stubs.length} items (${sizeKb} KB uncompressed).\n`);
}

if (process.argv[1] && process.argv[1].includes('build-corpus-index')) {
  buildCorpusIndex();
}
