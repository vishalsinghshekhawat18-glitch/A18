/**
 * Universal Verbatim Ingestion Pipeline for Claude's August 1-17 Current Affairs Note
 * Captures all sections (SEC1 to SEC10) including special table clusters (SEC5 MoUs/Appointments, SEC8 Days).
 */
const fs = require('fs');
const path = require('path');

const inputPath = path.resolve('Claude/current_affairs_Aug1-17_2026_CORE.md');
const corpusDir = path.resolve('content/corpus');
const indexPath = path.resolve('content/corpus-index.json');
const manifestPath = path.resolve('content/manifest.json');

function extractDate(text, defaultDay) {
  const dateRegex = /(?:as of\s+|effective\s+|eff\.\s+|on\s+|from\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(Aug(?:ust)?|Jul(?:y)?|Jun(?:e)?|Sep(?:tember)?)\s*(2026)?/i;
  const match = text.match(dateRegex);
  if (match) {
    const day = match[1].padStart(2, '0');
    return `2026-08-${day}`;
  }
  const dayStr = String(defaultDay).padStart(2, '0');
  return `2026-08-${dayStr}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 40)
    .replace(/^-+|-+$/g, '');
}

function parseMarkdownTable(tableText) {
  const lines = tableText.trim().split('\n');
  if (lines.length < 2) return null;
  const headers = lines[0].split('|').map(c => c.trim()).filter(Boolean);
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length > 0) rows.push(cells);
  }
  return { headers, rows };
}

function main() {
  console.log('🚀 Parsing Claude August 1-17 Notes into 10 Locked Sections...');

  const rawMd = fs.readFileSync(inputPath, 'utf-8');

  // Strip trailing meta sections: Status Check, Skipped Log, Consolidated Coverage Update
  const endCutIndex = rawMd.indexOf('## ⏰ STATUS CHECK');
  const mainContent = endCutIndex !== -1 ? rawMd.substring(0, endCutIndex) : rawMd;

  const sectionDefs = [
    { secCode: 'SEC1', headerPattern: /##\s+1️⃣\s+💰\s+ESI,\s+FINANCE/i, title: '1. 💰 ESI, FINANCE & BUSINESS NEWS' },
    { secCode: 'SEC2', headerPattern: /##\s+2️⃣\s+🏛️\s+REGULATORY\s+BODIES/i, title: '2. 🏛️ REGULATORY BODIES NEWS' },
    { secCode: 'SEC3', headerPattern: /##\s+3️⃣\s+🏦\s+BANKING\s+&\s+INSURANCE/i, title: '3. 🏦 BANKING & INSURANCE NEWS' },
    { secCode: 'SEC4', headerPattern: /##\s+4️⃣\s+🌐\s+NATIONAL,\s+STATE/i, title: '4. 🌐 NATIONAL, STATE & INTERNATIONAL NEWS' },
    { secCode: 'SEC5', headerPattern: /##\s+5️⃣\s+🤝\s+MoUs,\s+CONFERENCES/i, title: '5. 🤝 MoUs, CONFERENCES & APPOINTMENTS' },
    { secCode: 'SEC6', headerPattern: /##\s+6️⃣\s+🔬\s+SCIENCE,\s+TECHNOLOGY/i, title: '6. 🔬 SCIENCE, TECHNOLOGY, DEFENCE & SPORTS' },
    { secCode: 'SEC7', headerPattern: /##\s+7️⃣\s+🏆\s+AWARDS,\s+BOOKS/i, title: '7. 🏆 AWARDS, BOOKS, INDICES & RANKINGS' },
    { secCode: 'SEC8', headerPattern: /##\s+8️⃣\s+📅\s+IMPORTANT\s+DAYS/i, title: '8. 📅 IMPORTANT DAYS & PERSONS IN NEWS' },
    { secCode: 'SEC9', headerPattern: /##\s+9️⃣\s+📋\s+PIB,\s+CIRCULARS/i, title: '9. 📋 PIB, CIRCULARS & NOTIFICATIONS' },
    { secCode: 'SEC10', headerPattern: /##\s+🔟\s+📌\s+MISCELLANEOUS/i, title: '10. 📌 MISCELLANEOUS — GOVT SCHEMES & STATIC' }
  ];

  // Split text by section
  const sectionChunks = [];
  for (let i = 0; i < sectionDefs.length; i++) {
    const current = sectionDefs[i];
    const match = mainContent.search(current.headerPattern);
    if (match !== -1) {
      let nextMatch = mainContent.length;
      for (let j = i + 1; j < sectionDefs.length; j++) {
        const nMatch = mainContent.search(sectionDefs[j].headerPattern);
        if (nMatch !== -1 && nMatch > match) {
          nextMatch = nMatch;
          break;
        }
      }
      const chunkText = mainContent.substring(match, nextMatch);
      sectionChunks.push({ ...current, text: chunkText });
    }
  }

  const createdItems = [];
  const indexEntries = [];
  let itemSeq = 0;

  for (const sec of sectionChunks) {
    // Split chunk into items by "---"
    const rawBlocks = sec.text.split(/\n---\n/).map(s => s.trim()).filter(Boolean);

    for (let bIdx = 0; bIdx < rawBlocks.length; bIdx++) {
      let block = rawBlocks[bIdx];

      // Remove the section header line if present at start
      block = block.replace(/^##\s+[^\n]+\n+/, '').trim();
      if (!block) continue;

      itemSeq++;
      const lines = block.split('\n');

      // 1. Identify Title
      let title = '';
      const newsLine = lines.find(l => l.includes('📰'));
      const h3Line = lines.find(l => l.startsWith('### '));

      if (newsLine) {
        title = newsLine.replace(/^.*📰\s*(\*\*)?/, '').replace(/(\*\*)?\s*$/, '').trim();
      } else if (h3Line) {
        title = h3Line.replace(/^###\s+/, '').trim();
      } else {
        // Look for first non-empty line
        const firstLine = lines.find(l => l.trim().length > 0) || '';
        title = firstLine.replace(/^[*#\-_|\s]+/, '').replace(/[*#\-_|\s]+$/, '').trim();
      }

      if (!title || title.length < 3) {
        title = `${sec.title} — Unit ${bIdx + 1}`;
      }

      // 2. Identify Hook
      let hook = '';
      const hookLine = lines.find(l => l.startsWith('🪝'));
      if (hookLine) {
        hook = hookLine.replace(/^🪝\s*/, '').trim();
      }

      // 3. Extract Bullets, Tables, Focus/Traps, Paragraphs
      const bullets = [];
      const nonBulletParagraphs = [];
      const tables = [];
      let isInsideTable = false;
      let currentTableLines = [];

      let examAngleText = '';
      let interviewQText = '';
      let trapAlertText = '';

      for (let li = 0; li < lines.length; li++) {
        const line = lines[li];
        const trimmed = line.trim();

        if (line.includes('🎯 Exam Angle')) {
          examAngleText = trimmed;
          continue;
        }
        if (line.includes('💼 Interview Q')) {
          interviewQText = trimmed;
          if (lines[li + 1] && lines[li + 1].trim().startsWith('>')) {
            interviewQText += '\n' + lines[li + 1].trim();
            li++;
          }
          continue;
        }
        if (line.includes('⚠️ Trap Alert') || line.includes('⚠️') || line.includes('⏰ Status:')) {
          trapAlertText += (trapAlertText ? '\n' : '') + trimmed;
          continue;
        }

        // Table detection
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          isInsideTable = true;
          currentTableLines.push(trimmed);
          continue;
        } else if (isInsideTable) {
          isInsideTable = false;
          const parsedTbl = parseMarkdownTable(currentTableLines.join('\n'));
          if (parsedTbl) tables.push(parsedTbl);
          currentTableLines = [];
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          bullets.push(trimmed.replace(/^[-*]\s+/, '').trim());
        } else if (
          !trimmed.startsWith('##') &&
          !trimmed.startsWith('###') &&
          !trimmed.startsWith('📰') &&
          !trimmed.startsWith('🪝') &&
          trimmed.length > 0
        ) {
          nonBulletParagraphs.push(trimmed);
        }
      }

      if (isInsideTable && currentTableLines.length > 0) {
        const parsedTbl = parseMarkdownTable(currentTableLines.join('\n'));
        if (parsedTbl) tables.push(parsedTbl);
      }

      const dateEstimated = extractDate(block, Math.min(17, Math.max(1, bIdx + 1)));

      // Semantic Blocks
      const semanticBlocks = [];

      // Hook
      if (hook) {
        semanticBlocks.push({
          id: `blk-${itemSeq}-hook`,
          type: 'paragraph',
          content: hook
        });
      }

      // Paragraphs
      nonBulletParagraphs.forEach((p, pIdx) => {
        semanticBlocks.push({
          id: `blk-${itemSeq}-p${pIdx + 1}`,
          type: 'paragraph',
          content: p
        });
      });

      // Bullets
      if (bullets.length > 0) {
        semanticBlocks.push({
          id: `blk-${itemSeq}-bullets`,
          type: 'bullet_list',
          items: bullets
        });
      }

      // Tables
      tables.forEach((tbl, tIdx) => {
        semanticBlocks.push({
          id: `blk-${itemSeq}-tbl${tIdx + 1}`,
          type: 'table',
          headers: tbl.headers,
          rows: tbl.rows
        });
      });

      // Bottom Focus Block
      const focusParts = [];
      if (examAngleText) focusParts.push(examAngleText);
      if (trapAlertText) focusParts.push(trapAlertText);
      if (interviewQText) focusParts.push(interviewQText);

      if (focusParts.length > 0) {
        semanticBlocks.push({
          id: `blk-${itemSeq}-focus`,
          type: 'exam_trap',
          content: focusParts.join('\n\n')
        });
      }

      const itemId = `ca-2026-08-${sec.secCode.toLowerCase()}-${slugify(title)}`;

      const knowledgeItem = {
        id: itemId,
        type: 'ca_note',
        domain: 'current-affairs',
        title: title,
        summary: hook || (bullets[0] ? bullets[0].substring(0, 240) + '...' : title),
        blocks: semanticBlocks,
        metadata: {
          exam: ['SBI PO Mains 2026', 'IBPS PO Mains 2026', 'RBI Grade B 2026'],
          tags: ['current-affairs', '2026-08', sec.secCode.toLowerCase(), 'claude-core-v3'],
          category: sec.secCode,
          sectionCode: sec.secCode,
          difficulty: 'advanced',
          relevanceTier: 'TIER_A',
          noteTier: 'TIER_A',
          date: dateEstimated,
          provenance: {
            sourceSystem: 'Claude',
            sourceFile: 'current_affairs_Aug1-17_2026_CORE.md',
            sourceTitle: title
          }
        },
        relationships: []
      };

      const itemPath = path.join(corpusDir, `${itemId}.json`);
      fs.writeFileSync(itemPath, JSON.stringify(knowledgeItem, null, 2), 'utf-8');

      createdItems.push(knowledgeItem);
      indexEntries.push({
        id: knowledgeItem.id,
        domain: knowledgeItem.domain,
        title: knowledgeItem.title,
        summary: knowledgeItem.summary,
        metadata: knowledgeItem.metadata
      });
    }
  }

  console.log(`✅ Ingested ${createdItems.length} total units across all 10 active sections!`);

  // Update corpus-index.json
  const currentIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const updatedIndex = [...currentIndex.filter(i => !createdItems.some(ci => ci.id === i.id)), ...indexEntries];
  fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2), 'utf-8');
  console.log(`Updated corpus-index.json: Total records = ${updatedIndex.length}`);

  // Update manifest.json
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  manifest.totalRecords = updatedIndex.length;
  manifest.lastUpdated = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Updated manifest.json.');
}

main();
