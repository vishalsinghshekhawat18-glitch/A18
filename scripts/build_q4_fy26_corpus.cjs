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
    .substring(0, 50);
}

let currentSec = null;
const rawNotes = [];
let currentNote = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Section Header: ## 1️⃣ ...
  if (line.startsWith('## ') && !line.startsWith('### ')) {
    const foundSec = SECTION_MAPPING.find(s => line.includes(s.match));
    if (foundSec) {
      currentSec = foundSec;
    }
    continue;
  }

  // End of sections (status check / coverage update)
  if (line.startsWith('## ⏰') || line.startsWith('## 📊')) {
    currentSec = null;
  }

  if (!currentSec) continue;

  // News Header: ### 📰 Title or 📰 **Title**
  const isH3 = line.startsWith('### 📰 ') || line.startsWith('### ');
  const isInline = line.startsWith('📰 **');

  if (isH3 || isInline) {
    if (currentNote && currentNote.contentLines.length > 0) {
      rawNotes.push(currentNote);
    }

    let title = line
      .replace(/^###\s*📰\s*/, '')
      .replace(/^###\s*/, '')
      .replace(/^📰\s*\*\*/, '')
      .replace(/\*\*\s*$/, '')
      .replace(/^\*\*/, '')
      .replace(/\*\*$/, '')
      .trim();

    // Determine month from tag if present
    let itemDate = '2026-03-31';
    if (line.includes('[Jan]')) itemDate = '2026-01-20';
    else if (line.includes('[Feb]')) itemDate = '2026-02-20';
    else if (line.includes('[Mar]')) itemDate = '2026-03-20';

    currentNote = {
      sectionCode: currentSec.code,
      sectionName: currentSec.name,
      title: title,
      date: itemDate,
      contentLines: []
    };
    continue;
  }

  if (currentNote) {
    // Skip empty separator lines at start
    if (line === '---') {
      continue;
    }
    currentNote.contentLines.push(lines[i]);
  }
}

if (currentNote && currentNote.contentLines.length > 0) {
  rawNotes.push(currentNote);
}

console.log(`Parsed ${rawNotes.length} total raw notes across all 10 sections.`);

// Clean and convert raw notes into KnowledgeItems
const generatedItems = [];
let noteCounter = 201; // Start Q4 note counter at 201

rawNotes.forEach((rn, idx) => {
  const bullets = [];
  let examTrap = null;
  let mnemonic = null;
  let interviewQ = null;
  const paragraphs = [];

  let currentBlock = [];

  for (let l of rn.contentLines) {
    const trimmed = l.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('🚫 Skipped')) continue; // Skip skipped logs

    if (trimmed.startsWith('🎯 Exam Angle')) {
      examTrap = trimmed;
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

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      bullets.push(trimmed.substring(2).trim());
    } else {
      paragraphs.push(trimmed);
    }
  }

  const blocks = [];

  if (paragraphs.length > 0) {
    blocks.push({
      id: `blk-q4-${idx}-p`,
      type: 'paragraph',
      content: paragraphs.join('\n\n')
    });
  }

  if (bullets.length > 0) {
    blocks.push({
      id: `blk-q4-${idx}-bullets`,
      type: 'bullet_list',
      items: bullets
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

  if (examTrap) {
    blocks.push({
      id: `blk-q4-${idx}-trap`,
      type: 'exam_trap',
      content: examTrap
    });
  }

  if (blocks.length === 0) {
    blocks.push({
      id: `blk-q4-${idx}-empty`,
      type: 'paragraph',
      content: rn.title
    });
  }

  const slug = slugify(rn.title);
  const noteId = `ca-2026-q4-${rn.sectionCode.toLowerCase()}-${slug || `item-${idx}`}`;

  const summary = bullets[0] || paragraphs[0] || rn.title;

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

  generatedItems.push(item);
});

console.log(`\nGenerated ${generatedItems.length} KnowledgeItems.`);

// Write items to content/corpus
let writtenCount = 0;
generatedItems.forEach(item => {
  const itemPath = path.join(corpusDir, `${item.id}.json`);
  fs.writeFileSync(itemPath, JSON.stringify(item, null, 2), 'utf-8');
  writtenCount++;
});
console.log(`Saved ${writtenCount} files to content/corpus/`);

// Update note-registry.json
const registry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, 'utf-8')) : {};

generatedItems.forEach(item => {
  const numStr = String(item.metadata.noteNumber);
  registry[numStr] = {
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

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
console.log(`Updated note-registry.json with all ${generatedItems.length} Q4 notes.`);
