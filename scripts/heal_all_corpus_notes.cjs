const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', 'content', 'corpus');
const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));

console.log(`Starting deep healing across ${files.length} corpus files...\n`);

let healedCount = 0;

files.forEach(file => {
  const filePath = path.join(corpusDir, file);
  let item;
  try {
    item = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`Error reading ${file}`);
    return;
  }

  let modified = false;

  // 1. Clean Title
  if (item.title) {
    const origTitle = item.title;
    let cleanT = item.title
      .replace(/\s*—\s*\[(Jan|Feb|Mar)\].*$/i, '')
      .replace(/\s*\[(Jan|Feb|Mar)\].*$/i, '')
      .replace(/\s*\*\([^\)]*\)\*/g, '')
      .replace(/\s*\*\([^\)]*$/g, '')
      .replace(/\s*\(merged[^\)]*\)/gi, '')
      .replace(/\s*\(Tier\s*[A-C]\+?\)/gi, '')
      .replace(/\s*—\s*Tier\s*[A-C]\+?/gi, '')
      .replace(/^\*\*/, '')
      .replace(/\*\*$/, '')
      .replace(/["”]/g, '')
      .trim();

    if (item.id.includes('bhawana-kanth')) {
      cleanT = 'Sqn Ldr Bhawana Kanth — 1st Woman IAF Fighter Combat Leader';
    }

    if (cleanT !== origTitle) {
      item.title = cleanT;
      modified = true;
    }
  }

  // 2. Clean Blocks
  if (item.blocks && Array.isArray(item.blocks)) {
    const cleanedBlocks = [];

    item.blocks.forEach((block, bIdx) => {
      // Clean Paragraphs
      if (block.type === 'paragraph' && 'content' in block) {
        let content = block.content;

        // Skip skipped logs completely
        if (content.trim().startsWith('🚫 Skipped') || content.trim().startsWith('🚫 Numeric density')) {
          modified = true;
          return; // omit this block
        }

        // Clean internal skipped logs if present in multiline paragraph
        if (content.includes('🚫 Skipped') || content.includes('🚫 Numeric density')) {
          content = content
            .split('\n')
            .filter(l => !l.trim().startsWith('🚫 Skipped') && !l.trim().startsWith('🚫 Numeric density'))
            .join('\n');
          modified = true;
        }

        // Clean standalone '---'
        content = content
          .split('\n')
          .filter(l => l.trim() !== '---')
          .join('\n')
          .trim();

        // Clean month tags
        content = content
          .replace(/\s*—\s*\[(Jan|Feb|Mar)\]/gi, '')
          .replace(/\s*\[(Jan|Feb|Mar)\]/gi, '')
          .replace(/\s*\*\([^\)]*\)\*/g, '');

        if (content.length > 0) {
          block.content = content;
          cleanedBlocks.push(block);
        } else {
          modified = true;
        }
      } 
      // Clean Bullet Lists
      else if (block.type === 'bullet_list' && 'items' in block) {
        const cleanedItems = [];

        block.items.forEach(bullet => {
          // Skip skipped logs
          if (bullet.trim().startsWith('🚫 Skipped') || bullet.trim().startsWith('🚫 Numeric density')) {
            modified = true;
            return;
          }

          let cleanB = bullet
            .replace(/\s*—\s*\[(Jan|Feb|Mar)\].*$/i, '')
            .replace(/\s*—\s*\[(Jan|Feb|Mar)\]/gi, '')
            .replace(/\s*\[(Jan|Feb|Mar)\]/gi, '')
            .replace(/\s*\*\([^\)]*\)\*/g, '')
            .replace(/\s*—\s*Tier\s*[A-C]\+?/gi, '')
            .trim();

          // Split giant compound bullets (> 300 chars with multiple semicolons)
          if (cleanB.length > 280 && cleanB.split('; ').length > 2 && !cleanB.includes('|')) {
            const subBullets = cleanB.split('; ');
            subBullets.forEach(sb => {
              const trimmedSb = sb.trim();
              if (trimmedSb.length > 0) {
                cleanedItems.push(trimmedSb.endsWith('.') ? trimmedSb : trimmedSb + '.');
              }
            });
            modified = true;
          } else if (cleanB.length > 0) {
            cleanedItems.push(cleanB);
          }
        });

        if (cleanedItems.length > 0) {
          block.items = cleanedItems;
          cleanedBlocks.push(block);
        } else {
          modified = true;
        }
      }
      // Clean Exam Trap Blocks
      else if (block.type === 'exam_trap' && 'content' in block) {
        let trapContent = block.content
          .replace(/\s*—\s*\[(Jan|Feb|Mar)\]/gi, '')
          .replace(/\s*\[(Jan|Feb|Mar)\]/gi, '')
          .replace(/\s*\*\([^\)]*\)\*/g, '')
          .trim();

        block.content = trapContent;
        cleanedBlocks.push(block);
      } else {
        cleanedBlocks.push(block);
      }
    });

    item.blocks = cleanedBlocks;
  }

  // Write back if modified
  fs.writeFileSync(filePath, JSON.stringify(item, null, 2), 'utf-8');
  healedCount++;
});

console.log(`✅ Deep line-by-line healing complete across all ${healedCount} corpus files.`);
