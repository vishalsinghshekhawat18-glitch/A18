/**
 * R5.5 Final Canonical Integration & Publishing Engine
 * Integrates 43 validated High-Density Student Revision Notes into content/corpus/
 * Rebuilds corpus-index.json and manifest.json
 */

const fs = require('fs');
const path = require('path');

const studentNotesDir = path.resolve('content/repairs/ca_v3/final-student-notes');
const corpusDir = path.resolve('content/corpus');
const indexPath = path.resolve('content/corpus-index.json');
const manifestPath = path.resolve('content/manifest.json');

console.log('🚀 PUBLISHING R5.5 CURRENT AFFAIRS TO APPLICATION LAYER...');

// 1. Load the 43 validated student notes
const noteFiles = fs.readdirSync(studentNotesDir).filter(f => f.endsWith('.json'));
const studentNotes = noteFiles.map(f => JSON.parse(fs.readFileSync(path.join(studentNotesDir, f), 'utf-8')));

console.log(`Loaded ${studentNotes.length} validated student notes from final-student-notes.`);

// 2. Remove previous February placeholder files from content/corpus/
const existingFebFiles = fs.readdirSync(corpusDir).filter(f => f.includes('2026-02'));
console.log(`Clearing ${existingFebFiles.length} outdated February placeholder files from content/corpus/...`);
existingFebFiles.forEach(f => {
  fs.unlinkSync(path.join(corpusDir, f));
});

// 3. Map the 43 notes into canonical KnowledgeItem records
const categoryCounters = {};
const publishedItems = [];

// Sort by section (SEC1 .. SEC10) then Tier A before Tier B+
const sortedNotes = [...studentNotes].sort((a, b) => {
  const catCompare = a.category.localeCompare(b.category, undefined, { numeric: true });
  if (catCompare !== 0) return catCompare;
  if (a.tier === 'TIER_A' && b.tier !== 'TIER_A') return -1;
  if (a.tier !== 'TIER_A' && b.tier === 'TIER_A') return 1;
  return a.title.localeCompare(b.title);
});

sortedNotes.forEach(note => {
  const sec = note.category.toLowerCase();
  categoryCounters[sec] = (categoryCounters[sec] || 0) + 1;
  const canonicalId = `migrated-ca-2026-02-${sec}-${categoryCounters[sec]}`;

  const knowledgeItem = {
    id: canonicalId,
    title: note.title,
    type: 'ca_note',
    domain: 'current-affairs',
    summary: note.summary,
    blocks: note.blocks,
    metadata: {
      exam: ['RBI Grade B', 'NABARD Grade A', 'SBI PO'],
      tags: [sec, 'Current Affairs 2026', 'February 2026', note.tier],
      date: '2026-02-15',
      category: note.category,
      difficulty: note.tier === 'TIER_A' ? 'hard' : 'intermediate',
      lastUpdated: new Date().toISOString(),
      provenance: {
        sourceSystem: 'CA',
        sourceFile: 'Feb2026.pdf',
        sourceId: note.id,
        sourceTitle: note.title,
        provenancePages: note.metadata?.provenancePages || [],
        constituentArticleCount: note.metadata?.constituentArticleCount || 1,
        migrationTimestamp: new Date().toISOString(),
        normalizationRuleVersion: '5.5.0-r5-production'
      },
      caFrameworkVersion: 'v5.5.0-r5-production',
      relevanceTier: note.tier,
      temporalZone: 'CORE',
      sectionCode: note.category,
      relationshipDecision: 'UNIQUE_STANDALONE',
      editorialDecision: 'RETAIN_NEW',
      isStudyMaterial: true,
      noteTier: note.tier,
      studyUtilityScore: note.tier === 'TIER_A' ? 95 : 85
    },
    relationships: []
  };

  const targetPath = path.join(corpusDir, `${canonicalId}.json`);
  fs.writeFileSync(targetPath, JSON.stringify(knowledgeItem, null, 2), 'utf-8');
  publishedItems.push(knowledgeItem);
});

console.log(`✅ Wrote ${publishedItems.length} canonical February KnowledgeItem records to content/corpus/.`);

// 4. Rebuild content/corpus-index.json
console.log('📦 Rebuilding lightweight corpus-index.json...');
const allCorpusFiles = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));
const stubs = [];

for (const file of allCorpusFiles) {
  const filePath = path.join(corpusDir, file);
  const item = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

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

fs.writeFileSync(indexPath, JSON.stringify(stubs, null, 2), 'utf-8');
console.log(`✅ Rebuilt corpus-index.json with ${stubs.length} total entries.`);

// 5. Update content/manifest.json
console.log('📦 Updating content/manifest.json...');
const manifestObj = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
manifestObj.lastUpdated = new Date().toISOString();
manifestObj.caFrameworkVersion = 'v5.5.0-r5-production';
manifestObj.totalRecords = stubs.length;
fs.writeFileSync(manifestPath, JSON.stringify(manifestObj, null, 2), 'utf-8');

console.log('\n========================================================');
console.log('🎉 R5.5 PRODUCTION INTEGRATION COMPLETE');
console.log(`Published Notes:     ${publishedItems.length} Notes`);
console.log(`Tier A Master Notes: ${publishedItems.filter(p => p.metadata.relevanceTier === 'TIER_A').length}`);
console.log(`Tier B+ Notes:       ${publishedItems.filter(p => p.metadata.relevanceTier === 'TIER_B_PLUS').length}`);
console.log(`Total Corpus Size:   ${stubs.length} Canonical Records`);
console.log('========================================================\n');
