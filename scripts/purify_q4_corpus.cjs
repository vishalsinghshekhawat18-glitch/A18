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
      // Check if this is just a category sub-header (e.g. ### Appointments)
      if (CATEGORY_SUBHEADERS.has(lineWithoutH3.toLowerCase().trim())) {
        continue; // Skip purely organizational subheaders
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

    if (currentNote && (currentNote.bullets.length > 0 || currentNote.paragraphs.length > 0 || currentNote.leadIn)) {
      rawNotes.push(currentNote);
    }

    // Determine month from tag if present
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
      bullets: [],
      paragraphs: [],
      examTrap: null,
      mnemonic: null,
      interviewQ: null,
      status: null
    };
    continue;
  }

  if (currentNote) {
    if (line === '---') continue;
    if (!line) continue;
    if (line.startsWith('🚫 Skipped')) continue;

    if (line.startsWith('🎯 Exam Angle')) {
      currentNote.examTrap = line;
      continue;
    }
    if (line.startsWith('🧠 Mnemonic')) {
      currentNote.mnemonic = line;
      continue;
    }
    if (line.startsWith('💼 Interview Q')) {
      currentNote.interviewQ = line;
      continue;
    }
    if (line.startsWith('⏰ Status')) {
      currentNote.status = line;
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      currentNote.bullets.push(line.replace(/^[-*•]\s*/, '').trim());
    } else {
      currentNote.paragraphs.push(line);
    }
  }
}

if (currentNote && (currentNote.bullets.length > 0 || currentNote.paragraphs.length > 0 || currentNote.leadIn)) {
  rawNotes.push(currentNote);
}

console.log(`Parsed ${rawNotes.length} clean raw notes with separated headlines and bullets.`);

// Delete previous ca-2026-q4-*.json files from corpusDir
const existingFiles = fs.readdirSync(corpusDir).filter(f => f.startsWith('ca-2026-q4-'));
console.log(`Clearing ${existingFiles.length} old Q4 files...`);
existingFiles.forEach(f => fs.unlinkSync(path.join(corpusDir, f)));

// Custom enrichments for key complex sagas
const ENRICHMENTS = {
  '16th-finance-commission': {
    title: '16th Finance Commission Report Tabled — Complete Devolution & Structural Framework',
    bullets: [
      '**Constitutional Basis & Tenet:** Constituted on 31 December 2023 under **Article 280** of the Constitution of India; Award Period covers 5 financial years from **1 April 2026 to 31 March 2031**.',
      '**Apex Leadership & Team:** Chaired by **Dr. Arvind Panagariya** (former Vice-Chairman, NITI Aayog); Secretary is **Ritvik Ranjanam Pandey**; Full-time Members include A.N. Jha, Annie George Mathew, Niranjan Rajadhyaksha, and Dr. Soumya Kanti Ghosh.',
      '**Vertical Devolution (Centre to States):** Recommends retaining **41% share** of the divisible central tax pool for States (unchanged since the 15th FC post-J&K reorganisation, where 1% was adjusted for UTs of J&K and Ladakh).',
      '**Horizontal Devolution Criteria & Weights:** Income Distance (45%), Population 2011 Census (15%), Geographic Area (15%), Forest & Ecology (10%), Demographic Performance (12.5%), and Tax & Fiscal Effort (2.5%).',
      '**Grants-in-Aid & Disaster Financing:** Recommends targeted Sector-Specific & Performance Grants, Urban/Rural Local Body Grants, and Disaster Risk Management funding (SDRMF/NDRMF maintaining the 80:20 cost-sharing formula).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — "41% vertical share, Dr. Arvind Panagariya, Article 280, 2026-2031 award period" is the non-negotiable core trio; don\'t confuse 41% with 42% (14th FC).'
  },

  'gdp-cpi-iip-growth-saga': {
    title: 'GDP, CPI, IIP & Fiscal Deficit Base-Year Saga (Consolidated Multi-Month Trajectory)',
    bullets: [
      '📊 **Base-Year Master Matrix (Deliberate Examiner Traps):**\n• **CPI Inflation:** New series with base **2024 = 100** (Released 12 Feb 2026).\n• **GDP Series:** New series with base **2022-23 = 100** (Released 27 Feb 2026).\n• **IIP Series:** New series with base **2022-23 = 100** (Effective 28 May 2026).\n• **WPI Inflation:** Base year **unchanged at 2011-12 = 100** (Deliberate trap against CPI\'s new 2024 base!).',
      '📈 **Quarterly Growth & Inflation Trajectory (Jan ➔ Feb ➔ Mar):**\n• **GDP Growth (NSO 1st Advance Estimates):** Pegs real GDP growth at **7.4%** for FY26 (vs 6.5% FY25); India officially became the world’s **4th-largest economy (~$4.18 Trillion)**, overtaking Japan and on track to surpass Germany by 2030.\n• **CPI Inflation (2024 Base):** Jan 2026 at **2.75%** ➔ Feb 2026 rose to **3.21%** (Rural: 3.37%, Urban: 3.02%, Food Inflation: 3.47%).\n• **IIP Output:** Dec 2025 touched a 26-month high of **7.8%** ➔ Jan 2026 slowed down to **4.8% YoY** (sharp trend reversal).\n• **Eight Core Industries (ICI):** Jan 2026 grew **+4.0%** ➔ Feb 2026 eased to **+2.3%** (Core industries constitute **40.27%** of total IIP weight).\n• **WPI Inflation (2011-12 Base):** Jan 2026 at **1.81%** ➔ Feb 2026 at **2.13%**.',
      '⚖️ **Fiscal Deficit Revisions (Impact of New 2022-23 GDP Base):**\n• **FY25 Fiscal Deficit:** Revised from 4.80% ➔ **4.90%** of GDP (Nominal GDP = ₹318.07 Lakh Cr).\n• **FY24 Fiscal Deficit:** Revised from 5.63% ➔ **5.70%** of GDP (Nominal GDP = ₹289.84 Lakh Cr).\n• **FY23 Fiscal Deficit:** Revised from 6.40% ➔ **6.70%** of GDP.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — 1) Three distinct base years (CPI=2024, WPI=2011-12, GDP/IIP=2022-23); 2) IIP trend reversal (7.8% ➔ 4.8%); 3) CPI direction (2.75% ➔ 3.21% is an upward move); 4) Upward revised fiscal deficit trio (4.8➔4.9 / 5.63➔5.7 / 6.4➔6.7).'
  },

  'key-scheme-decisions': {
    title: 'Key National Scheme Reforms & Financial Milestones (Jan–Feb Consolidated)',
    bullets: [
      '👩 **Lakhpati Didi Initiative (DAY-NRLM):** National target doubled from 3 Crore ➔ **6 Crore Lakhpati Didis by March 2029** (achieved initial 3 Cr target ahead of March 2027 deadline; enables rural SHG women to earn ≥₹1 Lakh/year).',
      '🌾 **Agriculture Infrastructure Fund (AIF):** Loan target doubled from ₹1 Lakh Crore ➔ **₹2 Lakh Crore** (Ministry of Agriculture; 3% interest subvention on loans up to ₹2 Crore for 7 years; Punjab leads national state leaderboard in sanctioned projects).',
      '🏦 **SIDBI Equity Capital Support:** Union Cabinet approved **₹5,000 Crore equity support** to SIDBI in 3 annual tranches via the Department of Financial Services (DFS) to expand credit flow to MSMEs.',
      '⛏️ **National Tailings Policy for Critical Minerals:** Government approved India’s first comprehensive framework for secondary extraction of critical minerals (Lithium, Cobalt, Rare Earth Elements) from legacy mine waste dumps (administered by IBM, CMPDI, AMD).',
      '💳 **Historic Bank Credit Milestone:** Total outstanding bank credit crossed **₹200 Lakh Crore** for the first time in Indian history (reached **₹203.2 Lakh Crore** at end-Dec 2025, recording +14.5% YoY growth).',
      '📊 **Labour Force Employment:** All-India Unemployment Rate stood at **4.8%** in December 2025 as per PLFS monthly indicators.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Lakhpati Didi target is 6 Crore by March 2029 (not 2027); AIF loan target is ₹2 Lakh Crore with 3% subvention; Bank credit milestone crossed ₹200 Lakh Crore.'
  }
};

const generatedItems = [];
let noteCounter = 201;

rawNotes.forEach((rn, idx) => {
  const finalBullets = [];
  let examTrap = rn.examTrap;

  const rawTitleLower = rn.title.toLowerCase();

  // Custom enrichment check
  let custom = null;
  if (rawTitleLower.includes('16th finance commission')) {
    custom = ENRICHMENTS['16th-finance-commission'];
  } else if (rawTitleLower.includes('gdp/cpi/iip') || rawTitleLower.includes('growth saga')) {
    custom = ENRICHMENTS['gdp-cpi-iip-growth-saga'];
  } else if (rawTitleLower.includes('key scheme decisions') || (rawTitleLower.includes('scheme') && rawTitleLower.includes('milestones'))) {
    custom = ENRICHMENTS['key-scheme-decisions'];
  }

  if (custom) {
    rn.title = custom.title;
    finalBullets.push(...custom.bullets);
    examTrap = custom.examTrap;
  } else {
    // If there is a lead-in from the headline line, process it as primary bullet(s)
    if (rn.leadIn) {
      if (rn.leadIn.includes('; ') && !rn.leadIn.includes('|')) {
        const parts = rn.leadIn.split('; ');
        parts.forEach(p => finalBullets.push(p.trim()));
      } else {
        finalBullets.push(rn.leadIn);
      }
    }

    // Process additional bullets
    rn.bullets.forEach(b => {
      if (b.includes('; ') && b.length > 250 && !b.includes('|')) {
        const subParts = b.split('; ');
        subParts.forEach(sp => finalBullets.push(sp.trim()));
      } else {
        finalBullets.push(b);
      }
    });

    // Process paragraphs into bullets if they look like bulleted items
    rn.paragraphs.forEach(p => {
      if (p.startsWith('**A)') || p.startsWith('**B)') || p.startsWith('**[') || p.startsWith('•')) {
        finalBullets.push(p.replace(/^•\s*/, ''));
      } else if (p.includes('|---|') || p.includes('| Person |') || p.includes('| Index |') || p.includes('| Festival |')) {
        // Keep tables in paragraphs
      } else {
        finalBullets.push(p);
      }
    });
  }

  // If still no exam trap, generate one from title & section
  if (!examTrap) {
    examTrap = `🎯 Exam Angle → Key data points, statutory provisions, and figures in ${rn.title} are tested in SBI PO Mains & RBI Grade B.`;
  }

  const blocks = [];

  // Check for table content in paragraphs
  const tableParagraphs = rn.paragraphs.filter(p => p.includes('|---|') || p.includes('| --- |'));
  if (tableParagraphs.length > 0) {
    blocks.push({
      id: `blk-q4-${idx}-table`,
      type: 'paragraph',
      content: tableParagraphs.join('\n\n')
    });
  }

  if (finalBullets.length > 0) {
    blocks.push({
      id: `blk-q4-${idx}-bullets`,
      type: 'bullet_list',
      items: finalBullets
    });
  }

  if (rn.mnemonic) {
    blocks.push({
      id: `blk-q4-${idx}-mnemonic`,
      type: 'paragraph',
      content: rn.mnemonic
    });
  }

  if (rn.interviewQ) {
    blocks.push({
      id: `blk-q4-${idx}-interview`,
      type: 'paragraph',
      content: rn.interviewQ
    });
  }

  if (rn.status) {
    blocks.push({
      id: `blk-q4-${idx}-status`,
      type: 'paragraph',
      content: rn.status
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
  const summary = finalBullets[0] || rn.title;

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

console.log(`Generated ${generatedItems.length} purified KnowledgeItems.`);

// Write purified items to content/corpus/
generatedItems.forEach(item => {
  const itemPath = path.join(corpusDir, `${item.id}.json`);
  fs.writeFileSync(itemPath, JSON.stringify(item, null, 2), 'utf-8');
});
console.log(`Saved ${generatedItems.length} purified files to content/corpus/`);

// Rebuild note-registry.json
const currentRegistry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, 'utf-8')) : {};
const cleanRegistry = {};

for (const [k, v] of Object.entries(currentRegistry)) {
  if (!v.file.includes('ca-2026-q4-')) {
    cleanRegistry[k] = v;
  }
}

generatedItems.forEach(item => {
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
console.log(`Cleaned and updated note-registry.json with all ${generatedItems.length} purified Q4 notes.`);
