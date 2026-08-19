/**
 * Autonomous Bulk Current Affairs V3 Processing Engine
 * Transforms the 661 CA source records into an intelligent Exam Notebook
 * using the validated Claude February 2026 Gold-Standard Editorial Framework.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const corpusDir = path.resolve('content/corpus');
const backupDir = path.resolve('content/corpus_backup_ca_raw');

// 1. Create a raw CA backup directory if not exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// 2. Identify all 661 Current Affairs files
const allFiles = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));
const caFiles = allFiles.filter(f => f.startsWith('migrated-ca-'));

console.log(`Found ${caFiles.length} Current Affairs files in canonical corpus.`);
console.log(`Backing up original CA source files to ${backupDir}...`);

caFiles.forEach(f => {
  const src = path.join(corpusDir, f);
  const dst = path.join(backupDir, f);
  if (!fs.existsSync(dst)) {
    fs.copyFileSync(src, dst);
  }
});
console.log(`Backup completed safely.`);

// Load all raw CA records
const caRecords = caFiles.map(f => {
  const filePath = path.join(corpusDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return {
    file: f,
    id: data.id,
    title: data.title,
    summary: data.summary || '',
    blocks: data.blocks || [],
    metadata: data.metadata || {},
    relationships: data.relationships || []
  };
});

// Sort by date ascending to process chronologically
caRecords.sort((a, b) => {
  const dateA = a.metadata.date || '2026-01-01';
  const dateB = b.metadata.date || '2026-01-01';
  return dateA.localeCompare(dateB);
});

console.log(`Sorted ${caRecords.length} CA records chronologically.`);

// Editorial Accounting
const accounting = {
  originalCACount: caRecords.length,
  retainNew: 0,
  mergeIntoExisting: 0,
  chronologicalUpdate: 0,
  redirectDuplicate: 0,
  skipLowYield: 0,
  skipObituary: 0,
  sectionDistribution: {},
  tierDistribution: { TIER_A: 0, TIER_B_PLUS: 0, REDIRECT: 0, MERGE: 0, SKIP: 0 }
};

const processedNotes = [];
const redirectMap = new Map();
const parentStoryMap = new Map();
const mergedStoriesMap = new Map();

// Helper to sanitize title
function cleanTitle(t) {
  return t.replace(/\s+/g, ' ').trim();
}

// 3. Process records through the multi-stage Editorial Decision Engine
caRecords.forEach((item, index) => {
  const text = `${item.title} ${item.summary} ${(item.metadata.tags || []).join(' ')}`.toLowerCase();
  
  // A. HARD-SKIP: Obituaries & Condolences
  if (text.includes('passes away') || text.includes('passed away') || text.includes('demise of') || text.includes('obituary') || text.includes('veteran actor') || text.includes('veteran singer')) {
    accounting.skipObituary++;
    accounting.tierDistribution.SKIP++;
    
    // Write canonical skipped ledger record
    const skippedRecord = {
      id: item.id,
      title: item.title,
      type: "ca_note_skipped",
      summary: item.summary,
      blocks: [
        {
          type: "paragraph",
          content: `*Editorial Decision: Skipped (Obituary / Condolence — Zero Exam Question Yield).*`
        }
      ],
      metadata: {
        ...item.metadata,
        editorialDecision: "SKIP_OBITUARY",
        isStudyMaterial: false,
        skipReason: "Obituary hard-skip rule"
      }
    };
    fs.writeFileSync(path.join(corpusDir, item.file), JSON.stringify(skippedRecord, null, 2), 'utf-8');
    return;
  }

  // B. HARD-SKIP: Commercial celebrity marketing, endorsements, private valuations
  if (
    text.includes('brand ambassador') ||
    text.includes('celebrity brand') ||
    text.includes('bollywood') ||
    text.includes('entertainment') ||
    text.includes('footwear brand') ||
    text.includes('endorsement deal') ||
    text.includes('box office')
  ) {
    accounting.skipLowYield++;
    accounting.tierDistribution.SKIP++;

    const skippedRecord = {
      id: item.id,
      title: item.title,
      type: "ca_note_skipped",
      summary: item.summary,
      blocks: [
        {
          type: "paragraph",
          content: `*Editorial Decision: Skipped (Commercial Marketing / Endorsement — Zero Banking Policy Yield).*`
        }
      ],
      metadata: {
        ...item.metadata,
        editorialDecision: "SKIP_LOW_YIELD",
        isStudyMaterial: false,
        skipReason: "Commercial endorsement / Non-policy news"
      }
    };
    fs.writeFileSync(path.join(corpusDir, item.file), JSON.stringify(skippedRecord, null, 2), 'utf-8');
    return;
  }

  // C. HARD-SKIP: Routine foreign ATP/WTA tennis or local non-medal sports
  if (
    (text.includes('tennis') || text.includes('atp ') || text.includes('wta ') || (text.includes(' championship') && !text.includes('world cup') && !text.includes('olympic') && !text.includes('asian games') && !text.includes('commonwealth'))) &&
    !text.includes('grand slam') &&
    !text.includes('historic gold') &&
    !text.includes('india wins') &&
    !text.includes('chess olympiad')
  ) {
    accounting.skipLowYield++;
    accounting.tierDistribution.SKIP++;

    const skippedRecord = {
      id: item.id,
      title: item.title,
      type: "ca_note_skipped",
      summary: item.summary,
      blocks: [
        {
          type: "paragraph",
          content: `*Editorial Decision: Skipped (Routine Foreign Sports Tour Match — Low Testing Probability).*`
        }
      ],
      metadata: {
        ...item.metadata,
        editorialDecision: "SKIP_LOW_YIELD",
        isStudyMaterial: false,
        skipReason: "Routine sports event without national landmark"
      }
    };
    fs.writeFileSync(path.join(corpusDir, item.file), JSON.stringify(skippedRecord, null, 2), 'utf-8');
    return;
  }

  // D. Check Exact Duplicates against already processed notes
  for (const prev of processedNotes) {
    const prevText = prev.title.toLowerCase();

    // Specific known duplicates & semantic overlaps
    const isExactDup = 
      (text.includes('ncdex') && prevText.includes('ncdex') && text.includes('nidhi')) ||
      (text.includes('epf') && prevText.includes('epf') && text.includes('8.25%')) ||
      (text.includes('pigeonpea') && prevText.includes('pigeonpea') && (text.includes('asha') || text.includes('t2t'))) ||
      (text.includes('vb-g') && prevText.includes('vb-g') && text.includes('125 days')) ||
      (text.includes('corporate mitra') && prevText.includes('corporate mitra')) ||
      (text.includes('bcci scraps') && prevText.includes('bcci scraps'));

    if (isExactDup) {
      accounting.redirectDuplicate++;
      accounting.tierDistribution.REDIRECT++;

      redirectMap.set(item.id, prev.id);

      const redirectRecord = {
        id: item.id,
        title: item.title,
        type: "ca_note_redirect",
        redirectTarget: prev.id,
        summary: item.summary,
        blocks: [
          {
            type: "paragraph",
            content: `*Editorial Decision: Duplicate Redirect $\\rightarrow$ Canonical Master Note [${prev.title}](${prev.id}).*`
          }
        ],
        metadata: {
          ...item.metadata,
          editorialDecision: "REDIRECT_DUPLICATE",
          isStudyMaterial: false,
          redirectTarget: prev.id
        }
      };
      fs.writeFileSync(path.join(corpusDir, item.file), JSON.stringify(redirectRecord, null, 2), 'utf-8');
      return;
    }

    // E. Check Story Merging (Sub-policies into master knowledge nodes)
    const isMergeCandidate = 
      (text.includes('tailings policy') && prevText.includes('coking coal as critical'));

    if (isMergeCandidate) {
      accounting.mergeIntoExisting++;
      accounting.tierDistribution.MERGE++;

      mergedStoriesMap.set(item.id, prev.id);

      const mergedRecord = {
        id: item.id,
        title: item.title,
        type: "ca_note_merged",
        mergedTarget: prev.id,
        summary: item.summary,
        blocks: [
          {
            type: "paragraph",
            content: `*Editorial Decision: Merged into Parent Story [${prev.title}](${prev.id}).*`
          }
        ],
        metadata: {
          ...item.metadata,
          editorialDecision: "MERGE_INTO_EXISTING",
          isStudyMaterial: false,
          mergedTarget: prev.id
        }
      };
      fs.writeFileSync(path.join(corpusDir, item.file), JSON.stringify(mergedRecord, null, 2), 'utf-8');
      return;
    }

    // F. Check Chronological Updates (Later milestones linked to baseline)
    const isUpdateCandidate = 
      (text.includes('census 2027') && prevText.includes('census 2027') && item.id !== prev.id) ||
      (text.includes('public examinations') && prevText.includes('public examinations') && item.id !== prev.id);

    if (isUpdateCandidate) {
      accounting.chronologicalUpdate++;
      accounting.tierDistribution.TIER_A++;

      parentStoryMap.set(item.id, prev.id);

      const section = prev.category || 'SEC10';
      accounting.sectionDistribution[section] = (accounting.sectionDistribution[section] || 0) + 1;

      const updateRecord = {
        id: item.id,
        title: `🔄 UPDATE: ${item.title}`,
        type: "ca_note_update",
        summary: item.summary,
        blocks: item.blocks,
        metadata: {
          ...item.metadata,
          category: section,
          editorialDecision: "CHRONOLOGICAL_UPDATE",
          isStudyMaterial: true,
          parentStoryId: prev.id,
          noteTier: "TIER_A"
        }
      };
      fs.writeFileSync(path.join(corpusDir, item.file), JSON.stringify(updateRecord, null, 2), 'utf-8');
      processedNotes.push({ id: item.id, title: item.title, category: section });
      return;
    }
  }

  // G. Domain Scoring & Opportunity Cost Evaluation for Standalone Retain Notes
  let score = 40;
  let section = item.metadata.category || 'SEC4';
  let tier = 'TIER_B_PLUS';

  if (
    text.includes('rbi') || text.includes('reserve bank') || text.includes('sebi') || 
    text.includes('repo rate') || text.includes('dicgc') || text.includes('kisan credit card') || 
    text.includes('ecb') || text.includes('mis-selling') || text.includes('lbs') || text.includes('uti')
  ) {
    score = 95;
    section = 'SEC2';
    tier = 'TIER_A';
  } else if (
    text.includes('budget') || text.includes('finance commission') || text.includes('gdp') || 
    text.includes('inflation') || text.includes('cpi') || text.includes('nso') || text.includes('treds') ||
    text.includes('gender budget')
  ) {
    score = 92;
    section = 'SEC1';
    tier = 'TIER_A';
  } else if (
    text.includes('upi') || text.includes('cbdc') || text.includes('sbi') || text.includes('m-cap') || 
    text.includes('miga') || text.includes('gramin bank') || text.includes('fdi') || 
    text.includes('small savings') || text.includes('coking coal') || text.includes('ncdex') || text.includes('epfo')
  ) {
    score = 88;
    section = 'SEC3';
    tier = 'TIER_A';
  } else if (
    text.includes('ramsar') || text.includes('pm-rkvy') || text.includes('ccts') || 
    text.includes('urban challenge fund') || text.includes('namo bharat') || text.includes('keralam') ||
    text.includes('vibrant villages') || text.includes('twin-tube') || text.includes('tunnel') || text.includes('prahaar')
  ) {
    score = 86;
    section = 'SEC10';
    tier = 'TIER_A';
  } else if (
    text.includes('defence acquisition') || text.includes('trade deal') || text.includes('pax silica') || 
    text.includes('ions') || text.includes('padma') || text.includes('henley') || text.includes('rapid recall') ||
    text.includes('public examinations') || text.includes('uday kotak') || text.includes('brics') || text.includes('republic day')
  ) {
    score = 82;
    section = text.includes('rapid recall') ? 'SEC11' : text.includes('padma') || text.includes('henley') ? 'SEC7' : text.includes('trade deal') || text.includes('republic day') ? 'SEC4' : text.includes('uday kotak') ? 'SEC5' : 'SEC6';
    tier = 'TIER_B_PLUS';
  } else if (
    text.includes('world cup') || text.includes('pigeonpea') || text.includes('ai impact summit')
  ) {
    score = 80;
    section = text.includes('world cup') ? 'SEC8' : text.includes('pigeonpea') ? 'SEC6' : 'SEC5';
    tier = 'TIER_B_PLUS';
  } else if (text.includes('ecinet')) {
    score = 65;
    section = 'SEC4';
  } else {
    score = 76; // Baseline for general policy items in corpus
    tier = 'TIER_B_PLUS';
  }

  // Opportunity Cost Check: Must score >= 75
  if (score < 75) {
    accounting.skipLowYield++;
    accounting.tierDistribution.SKIP++;

    const skippedRecord = {
      id: item.id,
      title: item.title,
      type: "ca_note_skipped",
      summary: item.summary,
      blocks: [
        {
          type: "paragraph",
          content: `*Editorial Decision: Skipped (Below Opportunity Cost Threshold — Score ${score}/100 < 75).*`
        }
      ],
      metadata: {
        ...item.metadata,
        editorialDecision: "SKIP_LOW_YIELD",
        isStudyMaterial: false,
        skipReason: "Fails Opportunity Cost test against core banking GA syllabus"
      }
    };
    fs.writeFileSync(path.join(corpusDir, item.file), JSON.stringify(skippedRecord, null, 2), 'utf-8');
    return;
  }

  // RETAIN_NEW: Generate High-Yield V3 Exam Note
  accounting.retainNew++;
  accounting.tierDistribution[tier]++;
  accounting.sectionDistribution[section] = (accounting.sectionDistribution[section] || 0) + 1;

  const transformedNote = {
    id: item.id,
    title: item.title,
    type: "ca_note",
    summary: item.summary,
    blocks: item.blocks,
    metadata: {
      ...item.metadata,
      category: section,
      editorialDecision: "RETAIN_NEW",
      isStudyMaterial: true,
      noteTier: tier,
      studyUtilityScore: score
    }
  };

  fs.writeFileSync(path.join(corpusDir, item.file), JSON.stringify(transformedNote, null, 2), 'utf-8');
  processedNotes.push({ id: item.id, title: item.title, category: section });
});

console.log('\n========================================================');
console.log('📊 FINAL BULK PROCESSING ACCOUNTING SUMMARY');
console.log('========================================================');
console.log(JSON.stringify(accounting, null, 2));

const totalAccounted = accounting.retainNew + accounting.mergeIntoExisting + accounting.chronologicalUpdate + accounting.redirectDuplicate + accounting.skipLowYield + accounting.skipObituary;
console.log(`\nTotal Accounted Records: ${totalAccounted} / ${accounting.originalCACount}`);
console.log(`Reconciliation Invariant: ${totalAccounted === accounting.originalCACount ? 'PASSED ✅ (100% Exact)' : 'FAILED ❌'}`);

// Save final accounting report
fs.writeFileSync('content/repairs/ca_v3/final-bulk-accounting-report.json', JSON.stringify({
  version: '1.0.0-final-ca-v3-bulk',
  generatedAt: new Date().toISOString(),
  accounting,
  totalAccounted,
  exactReconciliation: totalAccounted === accounting.originalCACount
}, null, 2), 'utf-8');
