/**
 * Ingests validated GKToday items into canonical corpus JSON files
 * categorized by month and section (SEC1 to SEC11).
 */
const fs = require('fs');
const path = require('path');

const corpusDir = path.resolve('content/corpus');
const indexPath = path.resolve('content/corpus-index.json');
const manifestPath = path.resolve('content/manifest.json');

// Helper to convert date string "August 19, 2026" to "2026-08-19"
function normalizeDate(dateStr) {
  if (!dateStr) return '2026-08-15';
  const monthMap = {
    'january': '01', 'february': '02', 'march': '03', 'april': '04',
    'may': '05', 'june': '06', 'july': '07', 'august': '08',
    'september': '09', 'october': '10', 'november': '11', 'december': '12',
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
    'jun': '06', 'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  };

  const parts = dateStr.replace(/,/g, '').split(/\s+/);
  if (parts.length >= 3) {
    const mStr = parts[0].toLowerCase();
    const month = monthMap[mStr] || '08';
    const day = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return '2026-08-15';
}

function generateCleanId(title, secId, dateFormatted, idx) {
  const [y, m] = dateFormatted.split('-');
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 30)
    .replace(/^-+|-+$/g, '');
  return `migrated-ca-${y}-${m}-${secId.toLowerCase()}-gkt-${slug || idx}`;
}

async function main() {
  console.log('🚀 Publishing GKToday Canonical Items into Corpus...');

  const rawArticles = JSON.parse(fs.readFileSync('content/repairs/gktoday_raw_articles.json', 'utf-8'));
  const currentIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const existingTitles = new Set(currentIndex.map(i => i.title.toLowerCase()));

  // Read the master review script logic
  const { execSync } = require('child_process');

  // Let's parse the structured items from GKTODAY_CURRENT_AFFAIRS_MASTER_REVIEW.md
  const mdContent = fs.readFileSync('GKTODAY_CURRENT_AFFAIRS_MASTER_REVIEW.md', 'utf-8');
  const sections = mdContent.split(/\n##\s+/);

  let addedCount = 0;
  let skippedDuplicates = 0;
  const newIndexEntries = [];

  const sectionCodeMap = {
    '1.': 'SEC1',
    '2.': 'SEC2',
    '3.': 'SEC3',
    '4.': 'SEC4',
    '5.': 'SEC5',
    '6.': 'SEC6',
    '7.': 'SEC7',
    '8.': 'SEC8',
    '9.': 'SEC9',
    '10.': 'SEC10',
    '11.': 'SEC11'
  };

  for (const sectionBlock of sections) {
    const lines = sectionBlock.split('\n');
    const header = lines[0].trim();
    
    // Find section code
    let secCode = 'SEC10';
    for (const [prefix, code] of Object.entries(sectionCodeMap)) {
      if (header.startsWith(prefix)) {
        secCode = code;
        break;
      }
    }

    if (header.includes('SKIPPED LOG') || header.includes('REVISION')) continue;

    // Split items by "### 📰 "
    const itemBlocks = sectionBlock.split(/\n###\s+📰\s+/).slice(1);

    for (let idx = 0; idx < itemBlocks.length; idx++) {
      const block = itemBlocks[idx];
      const itemLines = block.split('\n');
      const title = itemLines[0].trim();

      // Duplicate check against existing items
      const cleanTitleCheck = title.toLowerCase().replace(/[^a-z0-9]/g, ' ');
      const isDuplicate = Array.from(existingTitles).some(et => {
        const words = et.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 4);
        if (words.length < 3) return false;
        const matches = words.filter(w => cleanTitleCheck.includes(w)).length;
        return matches / words.length > 0.8;
      });

      if (isDuplicate) {
        skippedDuplicates++;
        continue;
      }

      // Extract Date, Tier, Hook, Bullets, Static GK, Exam Angle
      const metaLine = itemLines.find(l => l.startsWith('*Date:')) || '';
      const dateMatch = metaLine.match(/Date:\s*([^|]+)/i);
      const rawDate = dateMatch ? dateMatch[1].trim() : 'August 15, 2026';
      const formattedDate = normalizeDate(rawDate);

      const tierMatch = metaLine.match(/Tier:\s*([^|]+)/i);
      const isTierA = tierMatch ? tierMatch[1].includes('Tier A') : true;

      const hookLine = itemLines.find(l => l.startsWith('**🪝 Hook:**')) || '';
      const hookText = hookLine.replace('**🪝 Hook:**', '').trim();

      // Extract bullets
      const bullets = [];
      itemLines.forEach(l => {
        if (l.trim().startsWith('- **') && l.trim().endsWith('**')) {
          bullets.push(l.trim().replace(/^- \*\*|\*\*$/g, '').trim());
        } else if (l.trim().startsWith('- ')) {
          bullets.push(l.trim().replace(/^- /, '').trim());
        }
      });

      // Extract Exam Angle & Interview Q
      const examAngleLine = itemLines.find(l => l.startsWith('🎯 **Exam Angle:**')) || '';
      const examAngleText = examAngleLine.replace('🎯 **Exam Angle:**', '').trim();

      const interviewQIndex = itemLines.findIndex(l => l.startsWith('💼 **Interview Q:**'));
      let interviewQText = '';
      if (interviewQIndex !== -1) {
        interviewQText = itemLines.slice(interviewQIndex, interviewQIndex + 3).join('\n');
      }

      const itemId = generateCleanId(title, secCode, formattedDate, idx + 1);

      // Build Semantic Blocks
      const semanticBlocks = [
        {
          id: 'blk-1',
          type: 'paragraph',
          content: hookText || title
        }
      ];

      if (bullets.length > 0) {
        semanticBlocks.push({
          id: 'blk-2',
          type: 'bullet_list',
          items: bullets
        });
      }

      // Static GK Tag
      semanticBlocks.push({
        id: 'blk-3',
        type: 'definition',
        term: 'Static Regulatory Framework',
        definition: `Regulator / Apex Category: ${secCode} · Sourced from official GKToday Banking Archives.`
      });

      // Concluding Focus Block (Exam Angle + Interview Q) placed underneath
      let focusContent = `🎯 Exam Angle: ${examAngleText || 'High-yield fact verification for Bank PO Mains.'}`;
      if (interviewQText) {
        focusContent += `\n\n${interviewQText.replace(/[*#>`]/g, '')}`;
      }

      semanticBlocks.push({
        id: 'blk-4',
        type: 'exam_trap',
        content: focusContent
      });

      const knowledgeItem = {
        id: itemId,
        type: 'ca_note',
        domain: 'current-affairs',
        title: title,
        summary: hookText ? hookText.substring(0, 240) + '...' : title,
        blocks: semanticBlocks,
        metadata: {
          exam: ['SBI PO', 'IBPS PO', 'RBI Grade B', 'NABARD Grade A'],
          tags: ['current-affairs', 'gktoday', secCode.toLowerCase(), isTierA ? 'tier-a' : 'tier-b-plus', formattedDate.substring(0, 7)],
          category: secCode,
          sectionCode: secCode,
          difficulty: isTierA ? 'advanced' : 'intermediate',
          relevanceTier: isTierA ? 'TIER_A' : 'TIER_B',
          noteTier: isTierA ? 'TIER_A' : 'TIER_B_PLUS',
          date: formattedDate,
          provenance: {
            sourceSystem: 'CA',
            sourceFile: 'gktoday.in',
            sourceTitle: title,
            statutoryConcept: title
          }
        },
        relationships: []
      };

      // Write to corpus
      const filePath = path.join(corpusDir, `${itemId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(knowledgeItem, null, 2), 'utf-8');

      newIndexEntries.push({
        id: knowledgeItem.id,
        domain: knowledgeItem.domain,
        title: knowledgeItem.title,
        summary: knowledgeItem.summary,
        metadata: knowledgeItem.metadata
      });

      addedCount++;
    }
  }

  console.log(`✅ Ingested ${addedCount} fresh unique items into corpus (${skippedDuplicates} duplicates filtered out).`);

  // Update corpus-index.json
  const updatedIndex = [...currentIndex.filter(item => !newIndexEntries.some(ne => ne.id === item.id)), ...newIndexEntries];
  fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2), 'utf-8');
  console.log(`Updated corpus-index.json: Total records = ${updatedIndex.length}`);

  // Update manifest.json
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  manifest.totalRecords = updatedIndex.length;
  manifest.lastUpdated = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Updated manifest.json.');
}

main().catch(console.error);
