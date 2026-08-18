/**
 * R4.C10 Final Micro-Cleanup: Remove residual OCR/PDF/channel watermarks from Schemes
 * 
 * Rules:
 * - Clean only genuine watermark patterns:
 *   - Page numbers / dividers like "-- XX of 47 --"
 *   - Channel headers like "ONE STOP SOLUTION FOR IAS, RAS, SI"
 *   - Social links like "Youtube \tTelegram \t..."
 *   - Isolated page numbers from headers/footers
 * - Preserve all substantive scheme text.
 * - Remove empty bullets and empty blocks if they contain only watermarks.
 */

const fs = require('fs');
const path = require('path');

const corpusDir = 'content/corpus';
const files = fs.readdirSync(corpusDir).filter(f => f.startsWith('migrated-schemes-'));

const WATERMARK_REGEXES = [
  /--\s*\d+\s*of\s*\d+\s*--/gi,
  /\b\d+\s*ONE STOP SOLUTION FOR IAS[^\n\r"]*/gi,
  /\bONE STOP SOLUTION FOR IAS[^\n\r"]*/gi,
  /Youtube\s*Telegram[^\n\r"]*/gi,
  /\bTelegram\s*Channel[^\n\r"]*/gi
];

function cleanString(str) {
  let cleaned = str;
  let matchesCount = 0;

  WATERMARK_REGEXES.forEach(regex => {
    const matches = cleaned.match(regex);
    if (matches) {
      matchesCount += matches.length;
      cleaned = cleaned.replace(regex, '');
    }
  });

  // Clean residual whitespace / tabs / trailing symbols
  cleaned = cleaned.replace(/^\s*[-•o*]+\s*/, ''); // Leading bullet symbols if orphaned
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return { cleaned, matchesCount };
}

let totalFilesModified = 0;
let totalWatermarksRemoved = 0;
const modifiedFilesList = [];

files.forEach(f => {
  const p = path.join(corpusDir, f);
  const raw = fs.readFileSync(p, 'utf-8');
  const item = JSON.parse(raw);

  let fileChanged = false;
  let fileWatermarksCount = 0;

  if (Array.isArray(item.blocks)) {
    const newBlocks = [];

    item.blocks.forEach(block => {
      if (block.type === 'bullet_list' && Array.isArray(block.items)) {
        const newItems = [];
        block.items.forEach(itemStr => {
          const { cleaned, matchesCount } = cleanString(itemStr);
          if (matchesCount > 0) {
            fileChanged = true;
            fileWatermarksCount += matchesCount;
            totalWatermarksRemoved += matchesCount;
          }

          // Only keep item if it has substantive content left (> 3 characters)
          if (cleaned && cleaned.length > 3) {
            newItems.push(cleaned);
          }
        });

        if (newItems.length > 0) {
          newBlocks.push({
            ...block,
            items: newItems
          });
        } else {
          // Block was completely made of watermarks, omit it
          fileChanged = true;
        }
      } else if (typeof block.text === 'string') {
        const { cleaned, matchesCount } = cleanString(block.text);
        if (matchesCount > 0) {
          fileChanged = true;
          fileWatermarksCount += matchesCount;
          totalWatermarksRemoved += matchesCount;
        }
        if (cleaned && cleaned.length > 3) {
          newBlocks.push({
            ...block,
            text: cleaned
          });
        }
      } else {
        newBlocks.push(block);
      }
    });

    if (fileChanged) {
      const updatedItem = {
        ...item,
        blocks: newBlocks
      };
      fs.writeFileSync(p, JSON.stringify(updatedItem, null, 2), 'utf-8');
      totalFilesModified++;
      modifiedFilesList.push({ id: item.id, file: f, removedCount: fileWatermarksCount });
      console.log(`[CLEANED] ${item.id}: removed ${fileWatermarksCount} watermark instances`);
    }
  }
});

console.log('\n========================================================');
console.log(`🎉 WATERMARK MICRO-CLEANUP COMPLETE`);
console.log(`Total Files Modified: ${totalFilesModified}`);
console.log(`Total Watermark Occurrences Removed: ${totalWatermarksRemoved}`);
console.log('========================================================');

// Synchronize corpus-index.json
const allCorpusFiles = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));
const newIndexEntries = [];

allCorpusFiles.forEach(f => {
  const p = path.join(corpusDir, f);
  const item = JSON.parse(fs.readFileSync(p, 'utf-8'));
  newIndexEntries.push({
    id: item.id,
    type: item.type || 'static_note',
    domain: item.domain,
    title: item.title,
    summary: item.summary || '',
    metadata: item.metadata || {}
  });
});

newIndexEntries.sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync('content/corpus-index.json', JSON.stringify(newIndexEntries, null, 2), 'utf-8');
console.log(`✅ corpus-index.json synchronized (${newIndexEntries.length} items).`);
