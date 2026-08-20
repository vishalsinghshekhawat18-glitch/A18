/**
 * Clean Single-Pass Deduplication & Publishing for Claude August 1-17 Notes
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
    .substring(0, 45)
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
  console.log('🧹 Purging all existing August CA notes first...');

  // 1. Delete all ca-2026-08 files from corpus
  const allCorpusFiles = fs.readdirSync(corpusDir);
  let deletedFiles = 0;
  allCorpusFiles.forEach(f => {
    if (f.startsWith('ca-2026-08') && f.endsWith('.json')) {
      fs.unlinkSync(path.join(corpusDir, f));
      deletedFiles++;
    }
  });
  console.log(`Deleted ${deletedFiles} old August JSON files.`);

  // 2. Read raw Claude notes
  const rawMd = fs.readFileSync(inputPath, 'utf-8');
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
  const seenTitles = new Set();
  let itemSeq = 0;

  for (const sec of sectionChunks) {
    const rawBlocks = sec.text.split(/\n---\n/).map(s => s.trim()).filter(Boolean);

    for (let bIdx = 0; bIdx < rawBlocks.length; bIdx++) {
      let block = rawBlocks[bIdx];
      block = block.replace(/^##\s+[^\n]+\n+/, '').trim();
      if (!block) continue;

      const lines = block.split('\n');

      // Title
      let title = '';
      const newsLine = lines.find(l => l.includes('📰'));
      const h3Line = lines.find(l => l.startsWith('### '));

      if (newsLine) {
        title = newsLine.replace(/^.*📰\s*(\*\*)?/, '').replace(/(\*\*)?\s*$/, '').trim();
      } else if (h3Line) {
        title = h3Line.replace(/^###\s+/, '').trim();
      } else {
        const firstLine = lines.find(l => l.trim().length > 0) || '';
        title = firstLine.replace(/^[*#\-_|\s]+/, '').replace(/[*#\-_|\s]+$/, '').trim();
      }

      if (!title || title.length < 3) {
        title = `${sec.title} — Unit ${bIdx + 1}`;
      }

      // Exact deduplication check
      const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seenTitles.has(normTitle)) {
        console.log(`Skipping duplicate item: "${title}"`);
        continue;
      }
      seenTitles.add(normTitle);

      itemSeq++;

      // Hook
      let hook = '';
      const hookLine = lines.find(l => l.startsWith('🪝'));
      if (hookLine) {
        hook = hookLine.replace(/^🪝\s*/, '').trim();
      }

      // Bullets, Tables, Focus/Traps, Paragraphs
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

        // Table
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

      const semanticBlocks = [];

      if (hook) {
        semanticBlocks.push({
          id: `blk-${itemSeq}-hook`,
          type: 'paragraph',
          content: hook
        });
      }

      nonBulletParagraphs.forEach((p, pIdx) => {
        semanticBlocks.push({
          id: `blk-${itemSeq}-p${pIdx + 1}`,
          type: 'paragraph',
          content: p
        });
      });

      if (bullets.length > 0) {
        semanticBlocks.push({
          id: `blk-${itemSeq}-bullets`,
          type: 'bullet_list',
          items: bullets
        });
      }

      tables.forEach((tbl, tIdx) => {
        semanticBlocks.push({
          id: `blk-${itemSeq}-tbl${tIdx + 1}`,
          type: 'table',
          headers: tbl.headers,
          rows: tbl.rows
        });
      });

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
    }
  }

  // 3. Section 11 Unit
  const sec11Item = {
    id: 'ca-2026-08-sec11-rapid-revision-sheet',
    type: 'ca_note',
    domain: 'current-affairs',
    title: '🧠 August 2026 (1st–17th) Rapid Revision & Core Exam Traps Matrix',
    summary: 'Master Section 11 rapid recall cheat-sheet covering all 10 sections from 1st–17th August 2026.',
    blocks: [
      {
        id: 'blk-sec11-intro',
        type: 'paragraph',
        content: 'High-speed rapid recall matrix synthesized from Claude Framework v3.1 Core Notes for SBI PO Mains, IBPS PO Mains & Regulatory Officers 2026.'
      },
      {
        id: 'blk-sec11-tbl',
        type: 'table',
        headers: ['Section / Theme', 'Key Milestone / Outlay', 'Nodal Authority / Act', 'High-Yield Trap Alert 🎯'],
        rows: [
          ['1. ESI & Energy', '300.50 GW Non-Fossil Capacity', 'Ministry of Power / MNRE', '300.50 GW national capacity vs Brookfield $600M Lumara vs $32B total India investment.'],
          ['1. Microfinance', 'CGSMFI 2.0 (15% lending floor)', 'NCGTC / Govt of India', 'Lending floor raised to 15% of ₹20,000 Cr corpus.'],
          ['1. Banking Safety', 'Zero PSB locker thefts in FY26', 'RBI Circular / 12 PSBs', '100x annual locker rent liability cap on banks.'],
          ['1. Geographical Indications', '10,000 GI registrations by 2030', 'GI Act 1999 / DPIIT', 'UP (81) > Tamil Nadu (76) > Maharashtra (55). Darjeeling Tea = 1st GI.'],
          ['1. Digital Stack', 'DPDPA 2023 / SEBI CSCRF', 'MeitY / RBI / SEBI', 'Penalties: ₹250 Cr (security failure) + ₹200 Cr (breach notification failure).'],
          ['2. Regulatory (RBI)', 'NBFC-UL Scale Based Regs', 'RBI / Scale-Based Framework', 'Tata Sons required to list or surrender NBFC-UL classification.'],
          ['2. Capital Markets', 'Basel III Pillar 3 Disclosures', 'BCBS / RBI Guidelines', 'Unified qualitative and quantitative risk disclosure format.'],
          ['3. Banking & Deals', 'Jio Credit – BofA Deal (₹18,268 Cr)', 'Reliance Retail / BofA', '49.9% strategic stake acquisition.'],
          ['4. Environment', '101 Ramsar Sites in India', 'MoEFCC / Ramsar Convention', 'India reaches 101 registered Ramsar wetland sites.'],
          ['5. Apex Appointments', 'Varsha Aglawe (54th DG, GSI)', 'Geological Survey of India', '1st woman DG of GSI in its 176-year history.'],
          ['6. Defence & Tech', 'Agni-4 / EVEREST Engine / GARUDA', 'DRDO / ISRO / Indian Army', 'Agni-4 intermediate range ballistic missile successful flight test.'],
          ['7. Indices & Reports', 'Henley Passport / Food Security', 'Henley & Partners / EIU', 'Track India visa-free destinations and ranking progression.'],
          ['8. Key Observances', 'Organ Donation (Aug 3) / Handloom (Aug 7)', 'National Health / Textiles', 'Organ Donation Day moved to Aug 3 (1994 first heart transplant).'],
          ['9. Legislation', 'Prevention of Insults (Amendment) 2026', 'Ministry of Home Affairs', 'Vande Mataram protocol and standing statutory amendments.'],
          ['10. Govt Schemes', 'PM-SETU / PM-RAHAT / NAMASTE', 'MoSDE / MoRTH / MoSJE', 'PM-SETU ₹60,000 Cr ITI overhaul; RAHAT ₹1.5 Lakh Golden Hour trauma cover.']
        ]
      },
      {
        id: 'blk-sec11-focus',
        type: 'exam_trap',
        content: '🎯 Exam Focus: Review this sheet 48 hours prior to SBI PO Mains and IBPS PO Mains. Section 11 items are cross-linked across the homepage Rapid Revision Vault.'
      }
    ],
    metadata: {
      exam: ['SBI PO Mains 2026', 'IBPS PO Mains 2026', 'RBI Grade B 2026'],
      tags: ['current-affairs', '2026-08', 'sec11', 'rapid-revision', 'claude-v3'],
      category: 'SEC11',
      sectionCode: 'SEC11',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-17',
      provenance: {
        sourceSystem: 'Claude',
        sourceFile: 'current_affairs_Aug1-17_2026_CORE.md',
        sourceTitle: 'August 2026 Section 11 Rapid Revision Sheet'
      }
    },
    relationships: []
  };

  const sec11Path = path.join(corpusDir, `${sec11Item.id}.json`);
  fs.writeFileSync(sec11Path, JSON.stringify(sec11Item, null, 2), 'utf-8');
  createdItems.push(sec11Item);

  console.log(`✅ Generated ${createdItems.length} strictly unique August items (Sections 1 to 11).`);

  // 4. Update corpus-index.json without duplicates
  const currentIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const nonAugItems = currentIndex.filter(i => !i.id.startsWith('ca-2026-08'));
  const newIndexEntries = createdItems.map(i => ({
    id: i.id,
    domain: i.domain,
    title: i.title,
    summary: i.summary,
    metadata: i.metadata
  }));

  const finalIndex = [...nonAugItems, ...newIndexEntries];
  fs.writeFileSync(indexPath, JSON.stringify(finalIndex, null, 2), 'utf-8');
  console.log(`Updated corpus-index.json: Total records = ${finalIndex.length}`);

  // 5. Update manifest.json
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  manifest.totalRecords = finalIndex.length;
  manifest.lastUpdated = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Updated manifest.json.');
}

main();
