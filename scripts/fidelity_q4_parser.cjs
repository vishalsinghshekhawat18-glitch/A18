const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'Claude', 'Q4 FY26_Jan to March.md');
const corpusDir = path.join(__dirname, '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', 'content', 'note-registry.json');

const content = fs.readFileSync(mdPath, 'utf-8');
const lines = content.split('\n');

const SECTION_MAPPING = [
  { match: '1️⃣', code: 'SEC1', name: 'ESI, Finance & Business News' },
  { match: '2️⃣', code: 'SEC2', name: 'Regulatory Bodies News' },
  { match: '3️⃣', code: 'SEC3', name: 'Banking & Insurance News' },
  { match: '4️⃣', code: 'SEC4', name: 'National, State & International News' },
  { match: '5️⃣', code: 'SEC5', name: 'MoUs, Conferences & Appointments' },
  { match: '6️⃣', code: 'SEC6', name: 'Science, Technology, Defence & Sports' },
  { match: '7️⃣', code: 'SEC7', name: 'Awards, Books, Indices & Rankings' },
  { match: '8️⃣', code: 'SEC8', name: 'Important Days & Persons in News' },
  { match: '9️⃣', code: 'SEC9', name: 'PIB, Circulars & Notifications' },
  { match: '🔟', code: 'SEC10', name: 'Govt Schemes & Static' },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .substring(0, 45);
}

function cleanTitle(raw) {
  return raw
    .replace(/^###\s*📰\s*/, '')
    .replace(/^###\s*/, '')
    .replace(/^📰\s*/, '')
    .replace(/^\*\*/, '')
    .replace(/\*\*$/, '')
    .replace(/\s*—\s*\[(Jan|Feb|Mar)\].*$/i, '')
    .replace(/\s*\[(Jan|Feb|Mar)\].*$/i, '')
    .replace(/\s*\*\([^\)]*\)\*/g, '')
    .replace(/\s*\*\([^\)]*$/g, '')
    .replace(/\s*\(merged[^\)]*\)/gi, '')
    .replace(/\s*\(Tier\s*[A-C]\+?\)/gi, '')
    .replace(/\s*—\s*Tier\s*[A-C]\+?/gi, '')
    .replace(/\*\*$/, '')
    .replace(/["”]/g, '')
    .trim();
}

const CATEGORY_SUBHEADERS = new Set([
  'appointments', 'mergers & acquisitions', 'mergers & acquisitions (mar)',
  'defence', 'sports', 'science & technology', 'reports', 'books', 'awards',
  'festivals', 'banking', 'insurance', 'national', 'state', 'international',
  'conferences', 'mous'
]);

let currentSec = null;
const rawNotes = [];
let currentNote = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // End of sections (status check / coverage update / conclusion)
  if (line.startsWith('## ⏰') || line.startsWith('## 📊') || (line.startsWith('---') && lines[i+1]?.startsWith('## ⏰'))) {
    if (currentNote && (currentNote.rawLines.length > 0 || currentNote.leadIn)) {
      rawNotes.push(currentNote);
      currentNote = null;
    }
    currentSec = null;
    continue;
  }

  // Section Header: ## 1️⃣ ...
  if (line.startsWith('## ') && !line.startsWith('### ')) {
    const foundSec = SECTION_MAPPING.find(s => line.includes(s.match));
    if (foundSec) {
      currentSec = foundSec;
    } else {
      currentSec = null;
    }
    continue;
  }

  if (!currentSec) continue;

  // News Header Detection
  const isH3 = line.startsWith('### 📰 ') || line.startsWith('### ');
  const isInline = line.startsWith('📰 **') || (line.startsWith('📰 ') && line.includes('**'));

  if (isH3 || isInline) {
    let rawHeadline = '';
    let trailingBullet = '';

    if (isInline) {
      const match = line.match(/^📰\s*\*\*([^\*]+)\*\*\s*(?:—|-)?\s*(.*)/);
      if (match) {
        rawHeadline = cleanTitle(match[1]);
        trailingBullet = match[2]?.trim();
      } else {
        rawHeadline = cleanTitle(line.replace(/^📰\s*/, ''));
      }
    } else {
      const lineWithoutH3 = line.replace(/^###\s*📰?\s*/, '');
      if (CATEGORY_SUBHEADERS.has(lineWithoutH3.toLowerCase().trim())) {
        continue;
      }

      const match = lineWithoutH3.match(/^\*\*([^\*]+)\*\*\s*(?:—|-)?\s*(.*)/);
      if (match) {
        rawHeadline = cleanTitle(match[1]);
        trailingBullet = match[2]?.trim();
      } else {
        const parts = lineWithoutH3.split(/\s*—\s*/);
        rawHeadline = cleanTitle(parts[0]);
        if (parts.length > 1 && !parts[1].startsWith('[') && !parts[1].startsWith('*(')) {
          trailingBullet = parts.slice(1).join(' — ').trim();
        }
      }
    }

    if (!rawHeadline || CATEGORY_SUBHEADERS.has(rawHeadline.toLowerCase().trim())) {
      continue;
    }

    if (currentNote && (currentNote.rawLines.length > 0 || currentNote.leadIn)) {
      rawNotes.push(currentNote);
    }

    let itemDate = '2026-03-31';
    if (line.includes('[Jan]')) itemDate = '2026-01-20';
    else if (line.includes('[Feb]')) itemDate = '2026-02-20';
    else if (line.includes('[Mar]')) itemDate = '2026-03-20';

    currentNote = {
      sectionCode: currentSec.code,
      sectionName: currentSec.name,
      title: rawHeadline,
      date: itemDate,
      leadIn: trailingBullet,
      rawLines: []
    };
    continue;
  }

  if (currentNote) {
    if (line === '---') continue;
    if (!line) continue;
    currentNote.rawLines.push(line);
  }
}

if (currentNote && (currentNote.rawLines.length > 0 || currentNote.leadIn)) {
  rawNotes.push(currentNote);
}

console.log(`Parsed ${rawNotes.length} notes from source.`);

// High-fidelity processor for each note
const processedItems = [];
let noteCounter = 201;

rawNotes.forEach((rn, idx) => {
  const bullets = [];
  const paragraphs = [];
  const tableRows = [];
  let examTrap = null;
  let mnemonic = null;
  let interviewQ = null;
  let status = null;

  // If there is a lead-in description on the title line, clean and add as bullet 1
  if (rn.leadIn && rn.leadIn.trim()) {
    let cleanLeadIn = rn.leadIn
      .replace(/\s*—\s*\[(Jan|Feb|Mar)\].*$/i, '')
      .replace(/\s*—\s*\[(Jan|Feb|Mar)\]/gi, '')
      .replace(/\s*\[(Jan|Feb|Mar)\]/gi, '')
      .replace(/\s*\*\([^\)]*\)\*/g, '')
      .trim();

    if (cleanLeadIn) {
      bullets.push(cleanLeadIn.endsWith('.') ? cleanLeadIn : cleanLeadIn + '.');
    }
  }

  // Process rawLines respecting the author's lines
  let currentBullet = '';

  for (let l of rn.rawLines) {
    const trimmed = l.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('🚫 Skipped') || trimmed.startsWith('🚫 Numeric density') || trimmed.startsWith('🚫 Also')) continue;

    if (trimmed.startsWith('🎯 Exam Angle')) {
      examTrap = trimmed.replace(/\s*—\s*\[(Jan|Feb|Mar)\]/gi, '').trim();
      continue;
    }
    if (trimmed.startsWith('🧠 Mnemonic')) {
      mnemonic = trimmed;
      continue;
    }
    if (trimmed.startsWith('💼 Interview Q')) {
      interviewQ = trimmed;
      continue;
    }
    if (trimmed.startsWith('⏰ Status')) {
      status = trimmed;
      continue;
    }
    if (trimmed.startsWith('|')) {
      tableRows.push(trimmed);
      continue;
    }

    // Check if line is an explicit bullet point
    const isBulletLine = trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ');

    if (isBulletLine) {
      if (currentBullet) {
        bullets.push(currentBullet.endsWith('.') ? currentBullet : currentBullet + '.');
      }
      currentBullet = trimmed.replace(/^[-*•]\s*/, '').trim();
    } else {
      // If previous line was a bullet, this line is a continuation of that bullet
      if (currentBullet) {
        currentBullet += ' ' + trimmed;
      } else {
        // Standalone paragraph text
        paragraphs.push(trimmed);
      }
    }
  }

  if (currentBullet) {
    bullets.push(currentBullet.endsWith('.') ? currentBullet : currentBullet + '.');
  }

  // Clean raw tags inside bullets without splitting them
  const finalBullets = bullets.map(b => {
    return b
      .replace(/\s*—\s*\[(Jan|Feb|Mar)\].*$/i, '.')
      .replace(/\s*—\s*\[(Jan|Feb|Mar)\]/gi, '')
      .replace(/\s*\[(Jan|Feb|Mar)\]/gi, '')
      .replace(/\s*\*\([^\)]*\)\*/g, '')
      .replace(/\s*—\s*Tier\s*[A-C]\+?/gi, '')
      .replace(/\*\*\s*\*\*/g, '')
      .replace(/\.\.+/g, '.')
      .trim();
  }).filter(b => b.length > 0);

  if (!examTrap) {
    examTrap = `🎯 Exam Angle → Key data points, dates, and provisions in ${rn.title} are critical for SBI PO Mains & RBI Grade B.`;
  }

  const blocks = [];

  if (tableRows.length > 0) {
    blocks.push({
      id: `blk-q4-${idx}-table`,
      type: 'paragraph',
      content: tableRows.join('\n')
    });
  }

  if (paragraphs.length > 0) {
    blocks.push({
      id: `blk-q4-${idx}-p`,
      type: 'paragraph',
      content: paragraphs.join('\n\n')
    });
  }

  if (finalBullets.length > 0) {
    blocks.push({
      id: `blk-q4-${idx}-bullets`,
      type: 'bullet_list',
      items: finalBullets
    });
  }

  if (mnemonic) {
    blocks.push({
      id: `blk-q4-${idx}-mnemonic`,
      type: 'paragraph',
      content: mnemonic
    });
  }

  if (interviewQ) {
    blocks.push({
      id: `blk-q4-${idx}-interview`,
      type: 'paragraph',
      content: interviewQ
    });
  }

  if (status) {
    blocks.push({
      id: `blk-q4-${idx}-status`,
      type: 'paragraph',
      content: status
    });
  }

  if (examTrap) {
    blocks.push({
      id: `blk-q4-${idx}-trap`,
      type: 'exam_trap',
      content: examTrap
    });
  }

  const slug = slugify(rn.title);
  const noteId = `ca-2026-q4-${rn.sectionCode.toLowerCase()}-${slug || `item-${idx}`}`;
  const summary = finalBullets[0] || paragraphs[0] || rn.title;

  const item = {
    id: noteId,
    type: 'ca_note',
    domain: 'current-affairs',
    title: rn.title,
    summary: summary.substring(0, 160) + (summary.length > 160 ? '...' : ''),
    blocks: blocks,
    metadata: {
      exam: ['SBI PO Mains 2026', 'IBPS PO Mains 2026', 'RBI Grade B 2026'],
      tags: ['current-affairs', '2026-q4', 'jan-mar-2026', rn.sectionCode.toLowerCase(), 'claude-consolidated'],
      category: rn.sectionCode,
      sectionCode: rn.sectionCode,
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: rn.date,
      period: '2026-Q4',
      monthLabel: 'JANUARY – MARCH 2026',
      monthGroup: '2026-01-03',
      provenance: {
        sourceSystem: 'Claude',
        sourceFile: 'Q4 FY26_Jan to March.md',
        sourceTitle: rn.title
      },
      noteNumber: noteCounter++
    },
    relationships: []
  };

  processedItems.push(item);
});

// Clear old Q4 corpus files
const existingQ4 = fs.readdirSync(corpusDir).filter(f => f.startsWith('ca-2026-q4-'));
console.log(`Clearing ${existingQ4.length} old Q4 files...`);
existingQ4.forEach(f => fs.unlinkSync(path.join(corpusDir, f)));

// Save new high-fidelity items
processedItems.forEach(item => {
  const itemPath = path.join(corpusDir, `${item.id}.json`);
  fs.writeFileSync(itemPath, JSON.stringify(item, null, 2), 'utf-8');
});

console.log(`Saved ${processedItems.length} high-fidelity notes to content/corpus/`);

// Rebuild registry
const currentRegistry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, 'utf-8')) : {};
const cleanRegistry = {};

for (const [k, v] of Object.entries(currentRegistry)) {
  if (!v.file.includes('ca-2026-q4-')) {
    cleanRegistry[k] = v;
  }
}

processedItems.forEach(item => {
  const numStr = String(item.metadata.noteNumber);
  cleanRegistry[numStr] = {
    noteNumber: item.metadata.noteNumber,
    id: item.id,
    title: item.title,
    section: item.metadata.sectionCode,
    date: item.metadata.date,
    period: '2026-Q4',
    category: item.metadata.sectionCode,
    file: `content/corpus/${item.id}.json`
  };
});

fs.writeFileSync(registryPath, JSON.stringify(cleanRegistry, null, 2), 'utf-8');
console.log(`Updated note-registry.json with ${processedItems.length} notes.`);
