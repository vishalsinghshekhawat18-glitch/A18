const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'Claude', 'current_affairs_July2026_core.md');
const corpusDir = path.join(__dirname, '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', 'content', 'note-registry.json');

const content = fs.readFileSync(mdPath, 'utf-8');
const lines = content.split('\n');

const SECTION_MAPPING = [
  { match: '1.', code: 'SEC1', name: 'ESI, Finance & Business News' },
  { match: '2.', code: 'SEC2', name: 'Regulatory Bodies News' },
  { match: '3.', code: 'SEC3', name: 'Banking & Insurance News' },
  { match: '4.', code: 'SEC4', name: 'National, State & International News' },
  { match: '5.', code: 'SEC5', name: 'MoUs, Conferences & Appointments' },
  { match: '6.', code: 'SEC6', name: 'Science, Technology, Defence & Sports' },
  { match: '7.', code: 'SEC7', name: 'Awards, Books, Indices & Rankings' },
  { match: '8.', code: 'SEC8', name: 'Important Days & Persons in News' },
  { match: '9.', code: 'SEC9', name: 'PIB, Circulars & Notifications' },
  { match: '10.', code: 'SEC10', name: 'Govt Schemes & Static' },
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
    .replace(/\s*\(merged[^\)]*\)/gi, '')
    .replace(/\s*\(numeric density[^\)]*\)/gi, '')
    .replace(/\s*\(Quick Hits\)/gi, '')
    .replace(/\s*\(Template B\+?\)/gi, '')
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

  // Section Header: ## 1. 💰 ...
  if (line.startsWith('## ') && !line.startsWith('### ')) {
    const headerText = line.replace(/^##\s*/, '');
    const foundSec = SECTION_MAPPING.find(s => headerText.startsWith(s.match));
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
  const isInline = line.startsWith('📰 ');

  if (isH3 || isInline) {
    let rawHeadline = '';
    if (isInline) {
      const match = line.match(/^📰\s*\*\*([^\*]+)\*\*/);
      if (match) {
        rawHeadline = cleanTitle(match[1]);
      } else {
        rawHeadline = cleanTitle(line.replace(/^📰\s*/, '').replace(/:\s*.*$/, ''));
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

    // If inline line had content after colon, treat it as first content line
    if (isInline && line.includes(':') && !line.includes('**')) {
      const afterColon = line.replace(/^[^:]+:\s*/, '').trim();
      if (afterColon) {
        currentNote.rawLines.push(afterColon);
      }
    }
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

console.log(`Parsed ${rawNotes.length} July notes from source.`);

const processedItems = [];
let noteCounter = 101; // July starts at Note #101

rawNotes.forEach((rn, idx) => {
  const bullets = [];
  const paragraphs = [];
  const tableRows = [];
  let examTrap = null;
  let interviewQ = null;
  let status = null;

  let currentBullet = '';

  for (let l of rn.rawLines) {
    const trimmed = l.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('🚫 Skipped') || trimmed.startsWith('🚫 Numeric density') || trimmed.startsWith('🚫 Also') || trimmed.startsWith('⚠️ Note:')) continue;

    let cleanTrimmed = trimmed.replace(/\s*⚠️\s*Note:.*$/i, '').trim();
    if (!cleanTrimmed) continue;

    if (cleanTrimmed.startsWith('🎯 Exam Angle')) {
      examTrap = cleanTrimmed;
      continue;
    }
    if (cleanTrimmed.startsWith('💼 Interview Q')) {
      interviewQ = cleanTrimmed;
      continue;
    }
    if (cleanTrimmed.startsWith('⏰ Status')) {
      status = cleanTrimmed;
      continue;
    }
    if (cleanTrimmed.startsWith('|')) {
      tableRows.push(cleanTrimmed);
      continue;
    }

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

  // Expand any bullets that contain dot separators ( · )
  const expandedBullets = [];
  for (const b of bullets) {
    if (b.includes(' · ')) {
      const parts = b.split(' · ');
      for (const p of parts) {
        const pt = p.trim();
        if (pt) {
          expandedBullets.push(pt.endsWith('.') ? pt : pt + '.');
        }
      }
    } else {
      expandedBullets.push(b);
    }
  }

  const finalBullets = expandedBullets.map(b => {
    let clean = b
      .replace(/\*\*\s*\*\*/g, '')
      .replace(/\.\.+/g, '.')
      .trim();
    return clean;
  }).filter(b => b.length > 0);

  if (!examTrap) {
    examTrap = `🎯 Exam Angle → Key regulatory thresholds, statutory dates, and institutional mandates in ${rn.title} are critical for SBI PO Mains & RBI Grade B.`;
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
  const noteId = `ca-2026-07-${rn.sectionCode.toLowerCase()}-${slug || `item-${idx}`}`;
  const summary = rn.hook || finalBullets[0] || rn.title;

  const dateDay = Math.min(noteCounter - 100, 31);
  const dateStr = `2026-07-${String(dateDay).padStart(2, '0')}`;

  const item = {
    id: noteId,
    type: 'ca_note',
    domain: 'current-affairs',
    title: rn.title,
    summary: summary.substring(0, 160) + (summary.length > 160 ? '...' : ''),
    blocks: blocks,
    metadata: {
      exam: ['SBI PO Mains 2026', 'IBPS PO Mains 2026', 'RBI Grade B 2026'],
      tags: ['current-affairs', '2026-07', rn.sectionCode.toLowerCase(), 'claude-core-v3'],
      category: rn.sectionCode,
      sectionCode: rn.sectionCode,
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: dateStr,
      period: '2026-07',
      monthLabel: 'JULY 2026',
      monthGroup: '2026-07',
      provenance: {
        sourceSystem: 'Claude',
        sourceFile: 'current_affairs_July2026_core.md',
        sourceTitle: rn.title
      },
      noteNumber: noteCounter++
    },
    relationships: []
  };

  processedItems.push(item);
});

// Add Section 11 Rapid Revision Sheet for July 2026
const julySec11 = {
  id: 'ca-2026-07-sec11-rapid-revision-and-master-tables',
  type: 'ca_note',
  domain: 'current-affairs',
  title: '⚡ Rapid Revision Master Sheet & High-Yield Top 10 (July 1–31, 2026)',
  summary: 'Consolidated last-mile revision sheet featuring the Top 10 highest-yield exam items, statutory status tracker, and cross-topic confusion matrix for July 2026...',
  blocks: [
    {
      id: 'blk-july-sec11-top10',
      type: 'paragraph',
      content: "### 📌 Top 10 Highest-Yield Exam Items (July 2026 Rapid Revision Master List)\n\n1. **EPFO Overhaul & EPF Scheme 2026:** Claim settlement compressed to **3 days** (pension/EDLI: 20 days); full withdrawal age lowered to **55 years**; auto-settlement cap raised to **₹5 Lakh**; principal employer liability introduced for contract workers.\n2. **Small Savings & PF Interest Rates (Q2 FY27):** Sukanya Samriddhi (**8.20%**), EPF FY26 (**8.25%**), PPF (**7.10%**), GPF (**7.10%**).\n3. **Tax Department SFT Reporting Thresholds:** Savings bank cash (≥**₹10 Lakh**), Current account cash (≥**₹50 Lakh**), Credit card cash (>**₹1 Lakh** / non-cash ≥**₹10 Lakh**), Real estate property (>**₹30 Lakh**).\n4. **RBI Revamped Integrated Ombudsman Scheme:** Entity response timeline fixed at **30 days**; escalation to RBI Ombudsman within **90 days**; compensation cap of **₹30 Lakh** (loss) + **₹3 Lakh** (harassment).\n5. **Headline Macro & Global Inflows:** Total Indian exports reached **$863.1 Billion in FY26**; India rose to **11th largest FDI recipient ($38.89 Billion)** under UNCTAD World Investment Report.\n6. **Heritage & Global Laurels:** Sarnath inscribed as **India’s 45th UNESCO World Heritage Site** (48th Session, Busan); India ranks 6th globally and 2nd in Asia-Pacific.\n7. **Historic Sports Records:** **Jannik Sinner** wins 2nd consecutive Wimbledon (5th Grand Slam); **Spain** defeats Argentina to become the first country in history to hold men’s and women’s FIFA World Cups simultaneously; **Vaibhav Sooryavanshi** becomes youngest Indian international debutant (15y 99d).\n8. **Space & Aerospace Firsts:** **Skyroot’s Vikram-1** orbital launch (Mission ‘Aagaman’), making India the 3rd country with private orbital launch capability; Gaganyaan tests SOLVE, IMAT, and CMUS.\n9. **Banking Minimum Balance Penalties:** Commercial banks collected **₹7,086 Crore in MAB penalties in FY26** (private banks formed 70% led by HDFC Bank at ₹1,798 Cr; 10 of 12 PSBs waived charges).\n10. **Global Institution Appointments:** **Silvana Tenreyro** appointed Chief Economist of IMF; **Dilip Asbe** inducted into SWIFT’s global supervisory board; **Mahesh Muralidhar Pai** appointed MD & CEO of South Indian Bank."
    },
    {
      id: 'blk-july-sec11-status-table',
      type: 'paragraph',
      content: "### ⏰ Statutory & Regulatory Status Tracker (July 2026 Enactments)\n\n| Bill / Regulatory Norm | Governing Body | Statutory Milestone | Key Regulatory Threshold |\n|---|---|---|---|\n| **Anti-Paper-Leak Bill (Public Examinations 2026)** | Parliament | ✅ **Enacted into Law** | Jail 5–10 years; Fine ₹50 Lakh; 8-yr debarment |\n| **CBDT Cost Inflation Index (CII)** | CBDT / MoF | ✅ **Notified (FY 2026-27)** | **CII = 384** (effective 1 April 2026) |\n| **RBI Integrated Ombudsman 2026** | RBI | ✅ **In Force (1 July 2026)** | ₹30L max compensation + ₹3L harassment |\n| **SEBI FPI Fee Rationalisation** | SEBI | ✅ **Operational** | Cat-I fee: $1,000 ➔ **₹90,000** |\n| **SEBI SWP/STP Demat Integration** | SEBI | ⏳ **Phased Implementation** | 31 Jan 2027 (Units) / 30 Apr 2027 (Amount) |\n| **RBI Securitisation Demat Mandate** | RBI | ⏳ **Effective 1 Oct 2026** | Minimum ticket size: **₹1 Crore** |"
    },
    {
      id: 'blk-july-sec11-trap',
      type: 'exam_trap',
      content: "🎯 Exam Angle → 🔥 HIGH — Use this July master table for high-speed revision. Pay close attention to the 4-year FDI trajectory ($27.99bn ➔ $10.13bn ➔ $960mn ➔ $6.95bn) and the EPFO 3-day / 20-day / 55-year / ₹5 Lakh rules."
    }
  ],
  metadata: {
    exam: ['SBI PO Mains 2026', 'IBPS PO Mains 2026', 'RBI Grade B 2026'],
    tags: ['current-affairs', '2026-07', 'sec11', 'claude-core-v3', 'rapid-revision'],
    category: 'SEC10',
    sectionCode: 'SEC10',
    difficulty: 'advanced',
    relevanceTier: 'TIER_A',
    noteTier: 'TIER_A',
    date: '2026-07-31',
    period: '2026-07',
    monthLabel: 'JULY 2026',
    monthGroup: '2026-07',
    provenance: {
      sourceSystem: 'Claude',
      sourceFile: 'current_affairs_July2026_core.md',
      sourceTitle: 'Rapid Revision Sheet'
    },
    noteNumber: noteCounter++
  },
  relationships: []
};

processedItems.push(julySec11);

// Save July notes
processedItems.forEach(item => {
  const itemPath = path.join(corpusDir, `${item.id}.json`);
  fs.writeFileSync(itemPath, JSON.stringify(item, null, 2), 'utf-8');
});

console.log(`Saved ${processedItems.length} curated July notes to content/corpus/`);

// Rebuild registry for July
const currentRegistry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, 'utf-8')) : {};
const cleanRegistry = {};

// Keep non-July notes
for (const [k, v] of Object.entries(currentRegistry)) {
  if (!v.file.includes('ca-2026-07-')) {
    cleanRegistry[k] = v;
  }
}

// Add newly curated July notes
processedItems.forEach(item => {
  const numStr = String(item.metadata.noteNumber);
  cleanRegistry[numStr] = {
    noteNumber: item.metadata.noteNumber,
    id: item.id,
    title: item.title,
    section: item.metadata.sectionCode,
    date: item.metadata.date,
    period: '2026-07',
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
console.log(`Updated note-registry.json with all ${processedItems.length} July notes.`);
