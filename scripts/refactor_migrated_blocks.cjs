const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', 'content', 'corpus');

function parseMarkdownTable(text) {
  const lines = text.trim().split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 2) return null;

  const headerLine = lines[0];
  const headers = headerLine.split('|').map(h => h.trim()).filter(h => h.length > 0);
  
  // Find separator line index
  let dataStartIdx = 1;
  if (lines[1].includes('---') || lines[1].includes('|--')) {
    dataStartIdx = 2;
  }

  const rows = [];
  for (let i = dataStartIdx; i < lines.length; i++) {
    const rowCells = lines[i].split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length);
    if (rowCells.length > 0) {
      // pad or trim to header length
      while (rowCells.length < headers.length) rowCells.push('');
      rows.push(rowCells.slice(0, headers.length));
    }
  }

  return {
    type: 'table',
    headers,
    rows
  };
}

function decomposeBlock(block) {
  if (block.type !== 'heading' && block.type !== 'paragraph') {
    return [block];
  }

  const rawText = block.type === 'heading' ? block.text : block.content;
  if (!rawText || !rawText.includes('\n')) {
    return [block];
  }

  const lines = rawText.split('\n');
  const resultBlocks = [];
  let currentParagraphLines = [];
  let currentBulletItems = [];
  let currentTableLines = [];

  function flushParagraph() {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join('\n').trim();
      if (text.startsWith('$$') && text.endsWith('$$')) {
        resultBlocks.push({
          type: 'formula',
          latex: text.replace(/^\$\$|\$\$$/g, '').trim(),
          explanation: ''
        });
      } else if (text.toLowerCase().includes('exam trap') || text.startsWith('⚠️') || text.startsWith('🎯')) {
        resultBlocks.push({
          type: 'exam_trap',
          content: text
        });
      } else {
        resultBlocks.push({
          type: 'paragraph',
          content: text
        });
      }
      currentParagraphLines = [];
    }
  }

  function flushBullets() {
    if (currentBulletItems.length > 0) {
      resultBlocks.push({
        type: 'bullet_list',
        items: currentBulletItems
      });
      currentBulletItems = [];
    }
  }

  function flushTable() {
    if (currentTableLines.length > 0) {
      const tableBlock = parseMarkdownTable(currentTableLines.join('\n'));
      if (tableBlock) {
        resultBlocks.push(tableBlock);
      } else {
        resultBlocks.push({
          type: 'paragraph',
          content: currentTableLines.join('\n')
        });
      }
      currentTableLines = [];
    }
  }

  // If initial line was a heading title
  let startIdx = 0;
  if (block.type === 'heading') {
    const firstLine = lines[0].trim();
    const headingLevel = block.level || 2;
    resultBlocks.push({
      type: 'heading',
      level: headingLevel,
      text: firstLine.replace(/^#+\s*/, '')
    });
    startIdx = 1;
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushBullets();
      flushTable();
      flushParagraph();
      continue;
    }

    // Check if line is a table row
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushBullets();
      flushParagraph();
      currentTableLines.push(trimmed);
      continue;
    } else if (currentTableLines.length > 0) {
      flushTable();
    }

    // Check if line is a bullet item
    if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      flushParagraph();
      const bulletText = trimmed.replace(/^[-*•]\s+|\d+\.\s+/, '');
      if (bulletText.toLowerCase().includes('exam trap') || bulletText.startsWith('⚠️')) {
        flushBullets();
        resultBlocks.push({
          type: 'exam_trap',
          content: bulletText
        });
      } else {
        currentBulletItems.push(bulletText);
      }
      continue;
    } else if (currentBulletItems.length > 0 && !line.startsWith('   ') && !line.startsWith('\t')) {
      flushBullets();
    }

    // Check if line is a sub-heading (### or ⚡ or 📖 or 🏛️)
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.match(/^[⚡📖🏛️🧮⚖️❓📌]\s+\d+\./)) {
      flushBullets();
      flushTable();
      flushParagraph();
      resultBlocks.push({
        type: 'heading',
        level: 3,
        text: trimmed.replace(/^#+\s*/, '')
      });
      continue;
    }

    // Otherwise standard paragraph content
    currentParagraphLines.push(line);
  }

  flushBullets();
  flushTable();
  flushParagraph();

  return resultBlocks.length > 0 ? resultBlocks : [block];
}

// Refactor all economics files first
const ecoFiles = fs.readdirSync(corpusDir).filter(f => f.startsWith('migrated-core-eco-'));
let refactoredFiles = 0;
let totalDecomposedBlocks = 0;

ecoFiles.forEach(file => {
  const filePath = path.join(corpusDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const originalCount = data.blocks.length;

  const newBlocks = [];
  data.blocks.forEach(b => {
    const decomposed = decomposeBlock(b);
    newBlocks.push(...decomposed);
  });

  data.blocks = newBlocks;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  refactoredFiles++;
  totalDecomposedBlocks += (newBlocks.length - originalCount);
});

console.log(`🎉 Successfully refactored ${refactoredFiles} Economics chapters!`);
console.log(`✨ Generated ${totalDecomposedBlocks} structured semantic blocks (headings, tables, bullet lists, exam traps)!`);
