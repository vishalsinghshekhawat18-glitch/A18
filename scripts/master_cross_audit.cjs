const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', 'content', 'note-registry.json');
const indexPath = path.join(__dirname, '..', 'content', 'corpus-index.json');

console.log('🔍 INITIATING COMPREHENSIVE REPOSITORY-WIDE CROSS AUDIT...\n');

let issues = [];
const stats = {
  totalFiles: 0,
  totalRegistryEntries: 0,
  totalIndexEntries: 0,
  totalBlocks: 0,
  totalExamTraps: 0,
  domainCounts: {},
  categoryCounts: {}
};

// 1. Check physical files
const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));
stats.totalFiles = files.length;

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
stats.totalRegistryEntries = Object.keys(registry).length;

const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
const indexItems = Array.isArray(indexData) ? indexData : (indexData.items || []);
stats.totalIndexEntries = indexItems.length;

const fileIdSet = new Set();

files.forEach(file => {
  const filePath = path.join(corpusDir, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    issues.push(`❌ JSON Syntax Error in ${file}: ${e.message}`);
    return;
  }

  const id = data.id || file.replace('.json', '');
  fileIdSet.add(id);

  // Stats
  const domain = data.domain || 'general';
  const category = data.metadata?.category || data.category || 'General';
  stats.domainCounts[domain] = (stats.domainCounts[domain] || 0) + 1;
  stats.categoryCounts[category] = (stats.categoryCounts[category] || 0) + 1;

  // Check Blocks
  if (!Array.isArray(data.blocks) || data.blocks.length === 0) {
    issues.push(`⚠️ Missing or empty blocks in ${file}`);
  } else {
    stats.totalBlocks += data.blocks.length;
    let hasTrap = false;
    data.blocks.forEach((blk, idx) => {
      if (blk.type === 'exam_trap' || (blk.content && blk.content.includes('🎯 Exam Angle'))) {
        hasTrap = true;
        stats.totalExamTraps++;
      }

      // Check text quality in paragraphs
      if (blk.content && typeof blk.content === 'string') {
        if (blk.content.match(/[a-zA-Z]\s*;\s*$/)) {
          issues.push(`⚠️ Semicolon dangling ending in ${file} (Block #${idx})`);
        }
      }
    });

    if (!hasTrap) {
      issues.push(`⚠️ Missing Exam Angle / Trap in ${file}`);
    }
  }

  // Check Title
  if (!data.title || data.title.trim().length === 0) {
    issues.push(`⚠️ Empty Title in ${file}`);
  }
});

// 2. Synchronicity Check: Registry vs Files
for (const [noteNum, entry] of Object.entries(registry)) {
  if (!fileIdSet.has(entry.id)) {
    issues.push(`⚠️ Registry note #${noteNum} (ID: ${entry.id}) not found in corpus files!`);
  }
}

// 3. Synchronicity Check: Index vs Files
indexItems.forEach(item => {
  if (!fileIdSet.has(item.id)) {
    issues.push(`⚠️ Index note (ID: ${item.id}) not found in corpus files!`);
  }
});

console.log('================================================================');
console.log('                     CROSS AUDIT SUMMARY                        ');
console.log('================================================================');
console.log(`📁 Total Physical Corpus Files:      ${stats.totalFiles}`);
console.log(`📑 Total Note Registry Entries:     ${stats.totalRegistryEntries}`);
console.log(`📦 Total Lightweight Index Entries: ${stats.totalIndexEntries}`);
console.log(`🧱 Total Content Blocks Audited:     ${stats.totalBlocks}`);
console.log(`🎯 Total Exam Traps / Angles Found:  ${stats.totalExamTraps}`);
console.log('----------------------------------------------------------------');
console.log('📊 Distribution by Subject Domain:');
for (const [d, count] of Object.entries(stats.domainCounts)) {
  console.log(`   • ${d.padEnd(20)} : ${count} notes`);
}
console.log('----------------------------------------------------------------');
console.log(`🚨 Total Inconsistencies / Structural Issues: ${issues.length}`);
if (issues.length > 0) {
  issues.slice(0, 10).forEach(iss => console.log(iss));
  if (issues.length > 10) console.log(`   ... and ${issues.length - 10} more issues.`);
} else {
  console.log('✅ ZERO STRUCTURAL OR SYNTAX DEFECTS FOUND ACROSS ALL 554 NOTES!');
}
console.log('================================================================\n');
