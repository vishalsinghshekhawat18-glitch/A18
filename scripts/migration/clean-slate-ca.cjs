/**
 * Removes all Current Affairs notes (Jan to Aug) from the corpus,
 * preparing a clean slate for verbatim Claude notes.
 */
const fs = require('fs');
const path = require('path');

const corpusDir = path.resolve('content/corpus');
const indexPath = path.resolve('content/corpus-index.json');
const manifestPath = path.resolve('content/manifest.json');

function main() {
  console.log('🧹 Purging all Current Affairs notes from corpus...');

  const currentIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  let caCount = 0;
  let nonCaCount = 0;

  const keptIndex = [];
  const caFileIds = new Set();

  currentIndex.forEach(item => {
    const isCA = item.domain === 'current-affairs' || 
                 item.type === 'ca_note' || 
                 item.id.startsWith('migrated-ca-') || 
                 item.id.startsWith('ca-');

    if (isCA) {
      caCount++;
      caFileIds.add(item.id);
    } else {
      nonCaCount++;
      keptIndex.push(item);
    }
  });

  console.log(`Found ${caCount} CA items to delete. Retaining ${nonCaCount} other items.`);

  // Delete matching JSON files from content/corpus
  const allFiles = fs.readdirSync(corpusDir);
  let deletedFiles = 0;
  allFiles.forEach(file => {
    if (file.endsWith('.json')) {
      const id = file.replace('.json', '');
      if (caFileIds.has(id) || file.startsWith('migrated-ca-') || file.startsWith('ca-')) {
        try {
          fs.unlinkSync(path.join(corpusDir, file));
          deletedFiles++;
        } catch (e) {
          console.warn(`Could not delete ${file}:`, e.message);
        }
      }
    }
  });

  console.log(`Deleted ${deletedFiles} CA JSON files from content/corpus.`);

  // Update corpus-index.json
  fs.writeFileSync(indexPath, JSON.stringify(keptIndex, null, 2), 'utf-8');
  console.log(`Updated corpus-index.json: Remaining records = ${keptIndex.length}`);

  // Update manifest.json
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  manifest.totalRecords = keptIndex.length;
  manifest.lastUpdated = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Updated manifest.json.');
}

main();
