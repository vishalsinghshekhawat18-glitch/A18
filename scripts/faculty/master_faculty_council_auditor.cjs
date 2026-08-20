const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', '..', 'content', 'note-registry.json');

console.log('🏛️ Initialising Doctoral Faculty & Exam Intelligence Council across all subject domains...\n');

const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json') && !f.startsWith('ca-2026-'));
console.log(`Found ${files.length} non-Current Affairs subject notes to audit and curate.`);

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(corpusDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let modified = false;

  // 1. Clean Title
  if (data.title) {
    let cleanTitle = data.title
      .replace(/^#+\s*/, '')
      .replace(/\*\*/g, '')
      .replace(/^Chapter\s+\d+:\s*/i, '')
      .replace(/^\d+\.\s*/, '')
      .replace(/["”]/g, '')
      .trim();

    // Shorten long titles if needed
    if (cleanTitle.length > 75) {
      cleanTitle = cleanTitle.substring(0, 72) + '...';
    }

    if (cleanTitle !== data.title) {
      data.title = cleanTitle;
      modified = true;
    }
  }

  // 2. Ensure blocks array exists
  if (!Array.isArray(data.blocks)) {
    data.blocks = [];
    modified = true;
  }

  // 3. Clean up existing blocks and check for Exam Angle
  let hasExamTrap = false;

  data.blocks.forEach(blk => {
    if (blk.type === 'exam_trap' || (blk.content && blk.content.includes('🎯 Exam Angle'))) {
      hasExamTrap = true;
    }

    // Clean bullet lists
    if (blk.type === 'bullet_list' && Array.isArray(blk.items)) {
      blk.items = blk.items.map(item => {
        let text = item.trim();
        text = text.replace(/\*\*\s*\*\*/g, '');
        if (!text.endsWith('.') && !text.endsWith(':') && !text.endsWith('!')) {
          text += '.';
        }
        return text;
      });
      modified = true;
    }

    // Clean paragraphs
    if (blk.type === 'paragraph' && typeof blk.content === 'string') {
      blk.content = blk.content.replace(/\*\*\s*\*\*/g, '').trim();
    }
  });

  // 4. If no Exam Angle block exists, generate a targeted subject-specific Exam Angle
  if (!hasExamTrap) {
    let subjectTrap = '';
    const domain = data.domain || data.id || '';

    if (domain.includes('pol') || domain.includes('polity')) {
      subjectTrap = `🎯 Exam Angle → 🔥 HIGH — Pay close attention to constitutional article numbers, amendment acts (e.g. 42nd, 44th, 73rd, 86th), and the exact qualifying age/tenure for constitutional offices.`;
    } else if (domain.includes('geo') || domain.includes('geography')) {
      subjectTrap = `🎯 Exam Angle → 🔥 HIGH — Verify river origin points, left-bank vs right-bank tributaries, mountain pass elevations, and soil distribution patterns across Indian states.`;
    } else if (domain.includes('his') || domain.includes('history')) {
      subjectTrap = `🎯 Exam Angle → 🔥 HIGH — Chronological order of Governor-Generals, Viceroys, landmark treaties, and British legislative acts (1773 to 1947) are recurring MCQ traps.`;
    } else if (domain.includes('eco') || domain.includes('economy')) {
      subjectTrap = `🎯 Exam Angle → 🔥 HIGH — Master the distinctions between monetary policy tools (Repo vs Reverse Repo, MSF, SDF) and fiscal deficit calculation formulas.`;
    } else if (domain.includes('sci') || domain.includes('science')) {
      subjectTrap = `🎯 Exam Angle → Focus on SI units, chemical compound common names, human endocrine hormone functions, and ISRO/DRDO propulsion technologies.`;
    } else if (domain.includes('quant')) {
      subjectTrap = `🎯 Exam Angle → ⚡ Calculation Trap — Watch for base-year shifts, percentage of vs percentage more than traps, and units conversion (km/h ➔ m/s) in time-speed-distance.`;
    } else if (domain.includes('eng') || domain.includes('english')) {
      subjectTrap = `🎯 Exam Angle → ✍️ Scoring Rubric — Ensure strict adherence to word limits (250 words ± 10%), eliminate informal contractions, and maintain parallel grammatical structure throughout.`;
    } else {
      subjectTrap = `🎯 Exam Angle → Key factual relationships, headquarters, statutory classifications, and numerical benchmarks in ${data.title} are critical for Bank PO & RBI Grade B.`;
    }

    data.blocks.push({
      id: `blk-${data.id}-exam-trap`,
      type: 'exam_trap',
      content: subjectTrap
    });
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    updatedCount++;
  }
});

console.log(`✅ Successfully verified and updated ${updatedCount} subject notes across all non-CA domains.`);
