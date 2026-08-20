/**
 * Assigns Universal, Persistent Sequential Note Numbers across all 10 Core Sections.
 * Excludes Section 11 (Revision) from numbering.
 * Creates content/note-registry.json for instant lookup.
 */
const fs = require('fs');
const path = require('path');

const corpusDir = path.resolve('content/corpus');
const indexPath = path.resolve('content/corpus-index.json');
const manifestPath = path.resolve('content/manifest.json');
const registryPath = path.resolve('content/note-registry.json');

function main() {
  console.log('🔢 Assigning Universal Note Numbers across Sections 1 to 10...');

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const caItems = index.filter(i => i.domain === 'current-affairs');

  // Define section ordering strictly
  const secOrder = {
    'SEC1': 1,
    'SEC2': 2,
    'SEC3': 3,
    'SEC4': 4,
    'SEC5': 5,
    'SEC6': 6,
    'SEC7': 7,
    'SEC8': 8,
    'SEC9': 9,
    'SEC10': 10,
    'SEC11': 11
  };

  // Separate non-sec11 and sec11
  const coreCaItems = caItems.filter(i => (i.metadata?.sectionCode || '') !== 'SEC11');
  const sec11Items = caItems.filter(i => (i.metadata?.sectionCode || '') === 'SEC11');

  // Sort core CA items: Month -> Section 1-10 -> Date ascending -> ID
  coreCaItems.sort((a, b) => {
    const dateA = a.metadata?.date || '';
    const dateB = b.metadata?.date || '';
    const monthA = dateA.substring(0, 7);
    const monthB = dateB.substring(0, 7);

    if (monthA !== monthB) return monthA.localeCompare(monthB);

    const secA = secOrder[a.metadata?.sectionCode || ''] || 99;
    const secB = secOrder[b.metadata?.sectionCode || ''] || 99;
    if (secA !== secB) return secA - secB;

    if (dateA !== dateB) return dateA.localeCompare(dateB);
    return a.id.localeCompare(b.id);
  });

  const registry = {};
  let currentNoteNum = 1;

  for (const item of coreCaItems) {
    const noteNumber = currentNoteNum++;
    const filePath = path.join(corpusDir, `${item.id}.json`);

    if (fs.existsSync(filePath)) {
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (!fileData.metadata) fileData.metadata = {};
      fileData.metadata.noteNumber = noteNumber;
      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf-8');
    }

    if (!item.metadata) item.metadata = {};
    item.metadata.noteNumber = noteNumber;

    registry[noteNumber] = {
      noteNumber: noteNumber,
      id: item.id,
      title: item.title,
      section: item.metadata?.sectionCode || '',
      date: item.metadata?.date || '',
      category: item.metadata?.category || '',
      file: `content/corpus/${item.id}.json`
    };
  }

  // Handle Section 11 items: remove noteNumber if present
  for (const item of sec11Items) {
    const filePath = path.join(corpusDir, `${item.id}.json`);
    if (fs.existsSync(filePath)) {
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (fileData.metadata && fileData.metadata.noteNumber) {
        delete fileData.metadata.noteNumber;
        fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf-8');
      }
    }
    if (item.metadata && item.metadata.noteNumber) {
      delete item.metadata.noteNumber;
    }
  }

  // Update corpus-index.json
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`✅ Assigned unique Note Numbers #1 to #${currentNoteNum - 1} across ${coreCaItems.length} core notes!`);

  // Write note-registry.json
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
  console.log(`✅ Saved registry to ${registryPath}`);

  // Update manifest.json
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  manifest.totalNotesNumbered = currentNoteNum - 1;
  manifest.lastUpdated = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
}

main();
