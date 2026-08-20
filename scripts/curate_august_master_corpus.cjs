const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'Claude', 'current_affairs_Aug1-17_2026_CORE.md');
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
    .replace(/\s*—\s*Tier\s*[A-C]\+?/gi, '')
    .replace(/\s*\(Tier\s*[A-C]\+?\)/gi, '')
    .replace(/\s*\*\([^\)]*\)\*/g, '')
    .replace(/["”]/g, '')
    .trim();
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
    if (isInline) {
      const match = line.match(/^📰\s*\*\*([^\*]+)\*\*/);
      if (match) {
        rawHeadline = cleanTitle(match[1]);
      } else {
        rawHeadline = cleanTitle(line.replace(/^📰\s*/, ''));
      }
    } else {
      rawHeadline = cleanTitle(line);
    }

    if (!rawHeadline) continue;

    if (currentNote && (currentNote.rawLines.length > 0 || currentNote.hook)) {
      rawNotes.push(currentNote);
    }

    currentNote = {
      sectionCode: currentSec.code,
      sectionName: currentSec.name,
      title: rawHeadline,
      hook: null,
      rawLines: []
    };
    continue;
  }

  if (line.startsWith('🪝')) {
    if (currentNote) {
      currentNote.hook = line.replace(/^🪝\s*/, '').trim();
    }
    continue;
  }

  if (currentNote) {
    if (line === '---') continue;
    if (!line) continue;
    currentNote.rawLines.push(line);
  }
}

if (currentNote && (currentNote.rawLines.length > 0 || currentNote.hook)) {
  rawNotes.push(currentNote);
}

console.log(`Parsed ${rawNotes.length} August notes from source.`);

const processedItems = [];
let noteCounter = 1;

rawNotes.forEach((rn, idx) => {
  const bullets = [];
  const paragraphs = [];
  const tableRows = [];
  let examTrap = null;
  let mnemonic = null;
  let interviewQ = null;
  let status = null;

  let currentBullet = '';

  for (let l of rn.rawLines) {
    const trimmed = l.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('🚫 Skipped') || trimmed.startsWith('🚫 Numeric density') || trimmed.startsWith('🚫 Also') || trimmed.startsWith('⚠️ Note:')) continue;
    
    // Strip trailing inline author warning note if present
    let cleanTrimmed = trimmed.replace(/\s*⚠️\s*Note:.*$/i, '').trim();
    if (!cleanTrimmed) continue;

    if (trimmed.startsWith('🎯 Exam Angle')) {
      examTrap = trimmed.trim();
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
    const isBulletLine = cleanTrimmed.startsWith('- ') || cleanTrimmed.startsWith('* ') || cleanTrimmed.startsWith('• ');

    if (isBulletLine) {
      if (currentBullet) {
        bullets.push(currentBullet.endsWith('.') ? currentBullet : currentBullet + '.');
      }
      currentBullet = cleanTrimmed.replace(/^[-*•]\s*/, '').trim();
    } else {
      if (currentBullet) {
        currentBullet += ' ' + cleanTrimmed;
      } else {
        paragraphs.push(cleanTrimmed);
      }
    }
  }

  if (currentBullet) {
    bullets.push(currentBullet.endsWith('.') ? currentBullet : currentBullet + '.');
  }

  // Ensure every bullet is complete and has lead-in if missing
  const finalBullets = bullets.map(b => {
    let clean = b
      .replace(/\*\*\s*\*\*/g, '')
      .replace(/\.\.+/g, '.')
      .trim();
    return clean;
  }).filter(b => b.length > 0);

  if (!examTrap) {
    examTrap = `🎯 Exam Angle → Key data points, dates, and statutory provisions in ${rn.title} are critical for SBI PO Mains & RBI Grade B.`;
  }

  const blocks = [];

  if (rn.hook) {
    blocks.push({
      id: `blk-${idx}-hook`,
      type: 'paragraph',
      content: rn.hook
    });
  }

  if (tableRows.length > 0) {
    blocks.push({
      id: `blk-${idx}-table`,
      type: 'paragraph',
      content: tableRows.join('\n')
    });
  }

  if (paragraphs.length > 0) {
    blocks.push({
      id: `blk-${idx}-p`,
      type: 'paragraph',
      content: paragraphs.join('\n\n')
    });
  }

  if (finalBullets.length > 0) {
    blocks.push({
      id: `blk-${idx}-bullets`,
      type: 'bullet_list',
      items: finalBullets
    });
  }

  if (mnemonic) {
    blocks.push({
      id: `blk-${idx}-mnemonic`,
      type: 'paragraph',
      content: mnemonic
    });
  }

  if (interviewQ) {
    blocks.push({
      id: `blk-${idx}-interview`,
      type: 'paragraph',
      content: interviewQ
    });
  }

  if (status) {
    blocks.push({
      id: `blk-${idx}-status`,
      type: 'paragraph',
      content: status
    });
  }

  if (examTrap) {
    blocks.push({
      id: `blk-${idx}-trap`,
      type: 'exam_trap',
      content: examTrap
    });
  }

  const slug = slugify(rn.title);
  const noteId = `ca-2026-08-${rn.sectionCode.toLowerCase()}-${slug || `item-${idx}`}`;
  const summary = rn.hook || finalBullets[0] || rn.title;

  const dateDay = Math.min(noteCounter, 17);
  const dateStr = `2026-08-${String(dateDay).padStart(2, '0')}`;

  const item = {
    id: noteId,
    type: 'ca_note',
    domain: 'current-affairs',
    title: rn.title,
    summary: summary.substring(0, 160) + (summary.length > 160 ? '...' : ''),
    blocks: blocks,
    metadata: {
      exam: ['SBI PO Mains 2026', 'IBPS PO Mains 2026', 'RBI Grade B 2026'],
      tags: ['current-affairs', '2026-08', rn.sectionCode.toLowerCase(), 'claude-core-v3'],
      category: rn.sectionCode,
      sectionCode: rn.sectionCode,
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: dateStr,
      period: '2026-08',
      monthLabel: 'AUGUST 2026',
      monthGroup: '2026-08',
      provenance: {
        sourceSystem: 'Claude',
        sourceFile: 'current_affairs_Aug1-17_2026_CORE.md',
        sourceTitle: rn.title
      },
      noteNumber: noteCounter++
    },
    relationships: []
  };

  processedItems.push(item);
});

// Clear old August files
const existingAug = fs.readdirSync(corpusDir).filter(f => f.startsWith('ca-2026-08-'));
console.log(`Clearing ${existingAug.length} old August files...`);
existingAug.forEach(f => fs.unlinkSync(path.join(corpusDir, f)));

// Save new August items
processedItems.forEach(item => {
  const itemPath = path.join(corpusDir, `${item.id}.json`);
  fs.writeFileSync(itemPath, JSON.stringify(item, null, 2), 'utf-8');
});

console.log(`Saved ${processedItems.length} curated August notes to content/corpus/`);

// Rebuild registry for August
const currentRegistry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, 'utf-8')) : {};
const cleanRegistry = {};

// Keep non-August notes
for (const [k, v] of Object.entries(currentRegistry)) {
  if (!v.file.includes('ca-2026-08-')) {
    cleanRegistry[k] = v;
  }
}

// Add newly curated August notes
processedItems.forEach(item => {
  const numStr = String(item.metadata.noteNumber);
  cleanRegistry[numStr] = {
    noteNumber: item.metadata.noteNumber,
    id: item.id,
    title: item.title,
    section: item.metadata.sectionCode,
    date: item.metadata.date,
    period: '2026-08',
    category: item.metadata.sectionCode,
    file: `content/corpus/${item.id}.json`
  };
});

// Sort numeric keys
const sortedRegistry = {};
Object.keys(cleanRegistry).map(Number).sort((a, b) => a - b).forEach(k => {
  sortedRegistry[String(k)] = cleanRegistry[String(k)];
});

fs.writeFileSync(registryPath, JSON.stringify(sortedRegistry, null, 2), 'utf-8');
console.log(`Updated note-registry.json with all ${processedItems.length} August notes.`);
