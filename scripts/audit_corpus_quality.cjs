const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', 'content', 'corpus');
const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));

console.log(`Total corpus files found: ${files.length}\n`);

const issues = {
  titleMarkdownLeaks: [],
  shortOrStubNotes: [],
  unstructuredTextWalls: [],
  missingOrCutoffExamTraps: [],
  duplicateTitles: [],
  sectionMismatch: []
};

const seenTitles = new Map();

files.forEach(file => {
  const filePath = path.join(corpusDir, file);
  let item;
  try {
    item = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`Error parsing JSON: ${file}`);
    return;
  }

  // 1. Check title quality
  const title = item.title || '';
  if (title.includes('**') || title.includes('*(') || title.includes('— [') || title.endsWith('**') || title.length > 100) {
    issues.titleMarkdownLeaks.push({
      file,
      noteNumber: item.metadata?.noteNumber,
      title
    });
  }

  // Duplicate title check
  const cleanTitle = title.toLowerCase().replace(/[^\w\s]/g, '').trim();
  if (seenTitles.has(cleanTitle)) {
    issues.duplicateTitles.push({
      title,
      file1: seenTitles.get(cleanTitle),
      file2: file
    });
  } else {
    seenTitles.set(cleanTitle, file);
  }

  // 2. Check block content length & structure
  const blocks = item.blocks || [];
  const totalChars = blocks.map(b => {
    if ('content' in b) return b.content.length;
    if ('items' in b) return b.items.join(' ').length;
    return 0;
  }).reduce((a, b) => a + b, 0);

  if (totalChars < 80) {
    issues.shortOrStubNotes.push({
      file,
      noteNumber: item.metadata?.noteNumber,
      title,
      totalChars,
      blockCount: blocks.length
    });
  }

  // 3. Check for text walls (paragraphs with multiple bullets inside or > 400 chars unbulleted)
  blocks.forEach(b => {
    if (b.type === 'paragraph' && 'content' in b) {
      if ((b.content.includes('\n\n') || b.content.includes('• ') || b.content.includes('; ') || b.content.includes(' — ')) && b.content.length > 350) {
        issues.unstructuredTextWalls.push({
          file,
          noteNumber: item.metadata?.noteNumber,
          title,
          contentPreview: b.content.substring(0, 120) + '...'
        });
      }
    }
  });

  // 4. Check for exam traps
  const hasTrapBlock = blocks.some(b => b.type === 'exam_trap');
  if (!hasTrapBlock && item.domain === 'current-affairs') {
    issues.missingOrCutoffExamTraps.push({
      file,
      noteNumber: item.metadata?.noteNumber,
      title
    });
  }
});

console.log('=== CORPUS QUALITY AUDIT RESULTS ===\n');
console.log(`1. Title Markdown Leaks / Long Raw Titles: ${issues.titleMarkdownLeaks.length}`);
issues.titleMarkdownLeaks.slice(0, 15).forEach(i => console.log(`   - [Note #${i.noteNumber}] ${i.title}`));

console.log(`\n2. Potential Stubs / Very Short Notes (<80 chars): ${issues.shortOrStubNotes.length}`);
issues.shortOrStubNotes.slice(0, 10).forEach(i => console.log(`   - [Note #${i.noteNumber}] (${i.totalChars} chars): ${i.title}`));

console.log(`\n3. Unstructured Walls of Text / Merged Bullets: ${issues.unstructuredTextWalls.length}`);
issues.unstructuredTextWalls.slice(0, 10).forEach(i => console.log(`   - [Note #${i.noteNumber}] ${i.title}\n     Snippet: ${i.contentPreview}`));

console.log(`\n4. Notes Missing Exam Traps: ${issues.missingOrCutoffExamTraps.length}`);
issues.missingOrCutoffExamTraps.slice(0, 10).forEach(i => console.log(`   - [Note #${i.noteNumber}] ${i.title}`));

console.log(`\n5. Duplicate / Overlapping Notes: ${issues.duplicateTitles.length}`);
issues.duplicateTitles.slice(0, 10).forEach(i => console.log(`   - "${i.title}"\n     File 1: ${i.file1}\n     File 2: ${i.file2}`));
