const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', 'content', 'corpus');
const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));

console.log(`Auditing ${files.length} corpus files line by line...\n`);

const issues = [];

files.forEach(file => {
  const filePath = path.join(corpusDir, file);
  let item;
  try {
    item = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    issues.push({ file, type: 'JSON_PARSE_ERROR', detail: err.message });
    return;
  }

  const noteNumber = item.metadata?.noteNumber || 'N/A';
  const title = item.title || '';

  // Check Title
  if (title.includes('**') || title.includes('— [') || title.includes('*(') || title.includes('— Tier')) {
    issues.push({ file, noteNumber, type: 'TITLE_MARKDOWN_POLLUTION', detail: title });
  }
  if (title.length > 90) {
    issues.push({ file, noteNumber, type: 'TITLE_TOO_LONG', detail: `Length: ${title.length} chars | "${title}"` });
  }

  const blocks = item.blocks || [];

  blocks.forEach((block, bIdx) => {
    // Check paragraphs
    if (block.type === 'paragraph' && 'content' in block) {
      const content = block.content;
      
      // Check for unparsed raw tags
      if (content.includes('🧠 Mnemonic') && block.id && !block.id.includes('mnemonic')) {
        issues.push({ file, noteNumber, type: 'RAW_MNEMONIC_IN_PARAGRAPH', detail: content.substring(0, 80) });
      }
      if (content.includes('💼 Interview Q') && block.id && !block.id.includes('interview')) {
        issues.push({ file, noteNumber, type: 'RAW_INTERVIEW_Q_IN_PARAGRAPH', detail: content.substring(0, 80) });
      }
      if (content.includes('🎯 Exam Angle') && block.type !== 'exam_trap') {
        issues.push({ file, noteNumber, type: 'EXAM_ANGLE_NOT_IN_TRAP_BLOCK', detail: content.substring(0, 80) });
      }
      if (content.includes('🚫 Skipped')) {
        issues.push({ file, noteNumber, type: 'SKIPPED_LOG_LEAK', detail: content.substring(0, 80) });
      }
      // Check for broken unicode
      if (/[\uFFFD]|â€™|â€”|Ã©|Â/.test(content)) {
        issues.push({ file, noteNumber, type: 'BROKEN_UNICODE', detail: content.substring(0, 80) });
      }
      // Check for trailing broken punctuation
      if (/[,\-—\(]$/.test(content.trim())) {
        issues.push({ file, noteNumber, type: 'TRAILING_BROKEN_PUNCTUATION', detail: content.slice(-30) });
      }
    }

    // Check bullet lists
    if (block.type === 'bullet_list' && 'items' in block) {
      block.items.forEach((bullet, itemIdx) => {
        // Bullet too long (> 300 chars) with multiple semicolons
        if (bullet.length > 300 && (bullet.split('; ').length > 2 || bullet.split(' — ').length > 2)) {
          issues.push({
            file,
            noteNumber,
            type: 'GIANT_UNSPLIT_BULLET',
            detail: `Item ${itemIdx + 1} (${bullet.length} chars): ${bullet.substring(0, 100)}...`
          });
        }
        // Month tags inside bullet text
        if (bullet.includes('— [Jan]') || bullet.includes('— [Feb]') || bullet.includes('— [Mar]') || bullet.includes('*(standing exception)*')) {
          issues.push({
            file,
            noteNumber,
            type: 'MONTH_TAG_IN_BULLET',
            detail: bullet.substring(0, 80)
          });
        }
        // Raw tags in bullet
        if (bullet.startsWith('🧠 Mnemonic') || bullet.startsWith('🎯 Exam Angle') || bullet.startsWith('💼 Interview Q') || bullet.startsWith('⏰ Status')) {
          issues.push({
            file,
            noteNumber,
            type: 'RAW_TAG_IN_BULLET',
            detail: bullet.substring(0, 80)
          });
        }
        // Trailing broken punctuation
        if (/[,\-—\(]$/.test(bullet.trim())) {
          issues.push({
            file,
            noteNumber,
            type: 'TRAILING_BROKEN_PUNCTUATION_BULLET',
            detail: bullet.slice(-30)
          });
        }
      });
    }

    // Check exam trap block
    if (block.type === 'exam_trap' && 'content' in block) {
      const content = block.content;
      if (content.length < 15) {
        issues.push({ file, noteNumber, type: 'EMPTY_OR_TINY_EXAM_TRAP', detail: content });
      }
      if (content.includes('🧠 Mnemonic')) {
        issues.push({ file, noteNumber, type: 'MNEMONIC_MERGED_IN_TRAP', detail: content });
      }
    }
  });
});

console.log(`Total Issues Found Across All Notes: ${issues.length}\n`);

const grouped = {};
issues.forEach(iss => {
  if (!grouped[iss.type]) grouped[iss.type] = [];
  grouped[iss.type].push(iss);
});

for (const [type, list] of Object.entries(grouped)) {
  console.log(`\n=== ${type} (${list.length} instances) ===`);
  list.slice(0, 8).forEach(item => {
    console.log(`- [Note #${item.noteNumber}] ${item.file}\n  Detail: ${item.detail}`);
  });
}
