/**
 * Editorial Quality Audit & Retain Rate Challenge Suite
 * Analyzes the 661 CA records with deterministic 100-item sampling,
 * opportunity-cost filtering, duplicity graphs, density metrics, and section realism.
 */

const fs = require('fs');
const path = require('path');

const corpusDir = path.resolve('content/corpus');
const allFiles = fs.readdirSync(corpusDir).filter(f => f.startsWith('migrated-ca-') && f.endsWith('.json'));

console.log(`Loaded ${allFiles.length} canonical Current Affairs records for Read-Only Audit.`);

const caRecords = allFiles.map(f => {
  const p = path.join(corpusDir, f);
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  return {
    file: f,
    id: data.id,
    title: data.title || '',
    summary: data.summary || '',
    blocks: data.blocks || [],
    metadata: data.metadata || {}
  };
});

// 1. Deterministic Sampling of 100 Notes (Seed = 42)
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rng = seededRandom(42);
const shuffled = [...caRecords].sort(() => 0.5 - rng());
const sample100 = shuffled.slice(0, 100);

console.log(`Selected deterministic 100-item sample for deep Opportunity-Cost evaluation.\n`);

// 2. Strict Opportunity-Cost Independent Evaluation
const sampleResults = {
  CORE_RETAIN: [],
  COMPACT_RETAIN: [],
  MERGE_CANDIDATE: [],
  UPDATE_CANDIDATE: [],
  DUPLICATE_CANDIDATE: [],
  LOW_YIELD_SHOULD_SKIP: []
};

sample100.forEach((item, idx) => {
  const text = `${item.title} ${item.summary}`.toLowerCase();

  // A. Hard Low-Yield / Skip
  const isRoutineSports = (text.includes('tennis') || text.includes('open 2026') || text.includes('doubles') || text.includes('championship')) && !text.includes('world cup') && !text.includes('india wins');
  const isCommercialPR = text.includes('brand ambassador') || text.includes('celebrity brand') || text.includes('footwear') || text.includes('endorsement');
  const isObituary = text.includes('passes away') || text.includes('passed away') || text.includes('demise');
  const isRoutineGovEvent = text.includes('inaugurates 3-day exhibition') || text.includes('cultural festival') || text.includes('local branch') || text.includes('foundation stone laid for regional');

  if (isRoutineSports || isCommercialPR || isObituary || isRoutineGovEvent) {
    sampleResults.LOW_YIELD_SHOULD_SKIP.push({
      id: item.id,
      title: item.title,
      reason: isRoutineSports ? 'Routine sports foreign tour tournament result' : isCommercialPR ? 'Commercial PR / celebrity marketing' : isObituary ? 'Obituary' : 'Routine ceremonial/local festival'
    });
    return;
  }

  // B. Core Retain (Tier A: Mandatory Banking / Regulatory / Budget / Macro / Flagship Schemes)
  const isRegulatoryCore = text.includes('rbi') || text.includes('sebi') || text.includes('irdai') || text.includes('pfrda') || text.includes('repo rate') || text.includes('dicgc');
  const isMacroCore = text.includes('budget') || text.includes('finance commission') || text.includes('gdp') || text.includes('cpi') || text.includes('inflation');
  const isBankingCore = text.includes('upi') || text.includes('cbdc') || text.includes('sbi m-cap') || text.includes('insurance fdi');
  const isFlagshipScheme = text.includes('ramsar') || text.includes('pm-rkvy') || text.includes('urban challenge fund') || text.includes('ccts');

  if (isRegulatoryCore || isMacroCore || isBankingCore || isFlagshipScheme) {
    sampleResults.CORE_RETAIN.push({
      id: item.id,
      title: item.title,
      reason: 'Mandatory syllabus domain for Banking/Regulatory Mains (Score: 90-95)'
    });
    return;
  }

  // C. Compact Retain (Tier B+: High-Yield National / Defence / Indices / Appointments)
  const isHighYieldCompact = text.includes('padma') || text.includes('henley') || text.includes('trade deal') || text.includes('pax silica') || text.includes('ions') || text.includes('world cup');
  if (isHighYieldCompact) {
    sampleResults.COMPACT_RETAIN.push({
      id: item.id,
      title: item.title,
      reason: 'High-frequency MCQ fact / durable static-GK anchor (Score: 80-84)'
    });
    return;
  }

  // D. Generic News / Low-Yield Policy (Opportunity Cost Failure)
  // Non-core regional announcements, routine state visits, minor MoUs
  if (text.includes('mou signed between') || text.includes('cooperation agreement') || text.includes('portal launched') || text.includes('app launched')) {
    sampleResults.LOW_YIELD_SHOULD_SKIP.push({
      id: item.id,
      title: item.title,
      reason: 'Minor MoU / administrative portal without direct monetary or macro significance'
    });
    return;
  }

  // Otherwise, default compact retain for remaining standard news
  sampleResults.COMPACT_RETAIN.push({
    id: item.id,
    title: item.title,
    reason: 'Standard national/economic development'
  });
});

console.log('--- 100-ITEM SAMPLE CLASSIFICATION BREAKDOWN ---');
console.log(`CORE_RETAIN (Tier A):            ${sampleResults.CORE_RETAIN.length}`);
console.log(`COMPACT_RETAIN (Tier B+):        ${sampleResults.COMPACT_RETAIN.length}`);
console.log(`MERGE_CANDIDATE:                 ${sampleResults.MERGE_CANDIDATE.length}`);
console.log(`UPDATE_CANDIDATE:                ${sampleResults.UPDATE_CANDIDATE.length}`);
console.log(`DUPLICATE_CANDIDATE:             ${sampleResults.DUPLICATE_CANDIDATE.length}`);
console.log(`LOW_YIELD_SHOULD_SKIP:           ${sampleResults.LOW_YIELD_SHOULD_SKIP.length}`);

// 3. Full 661 Duplicity & Semantic Relationship Graph Search
console.log('\n--- FULL CORPUS DUPLICITY & MERGE GRAPH SCAN (661 NOTES) ---');
const duplicatePairs = [];
const potentialMerges = [];
const potentialUpdates = [];

for (let i = 0; i < caRecords.length; i++) {
  const itemA = caRecords[i];
  const textA = itemA.title.toLowerCase();
  const wordsA = new Set(textA.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 3));

  for (let j = i + 1; j < caRecords.length; j++) {
    const itemB = caRecords[j];
    const textB = itemB.title.toLowerCase();
    const wordsB = new Set(textB.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 3));

    let common = 0;
    wordsA.forEach(w => { if (wordsB.has(w)) common++; });
    const sim = common / new Set([...wordsA, ...wordsB]).size;

    if (sim >= 0.55) {
      duplicatePairs.push({
        idA: itemA.id,
        titleA: itemA.title,
        idB: itemB.id,
        titleB: itemB.title,
        sim: Math.round(sim * 100) / 100
      });
    } else if (sim >= 0.35 && sim < 0.55) {
      if (textA.includes('rbi') && textB.includes('rbi')) {
        potentialMerges.push({ idA: itemA.id, titleA: itemA.title, idB: itemB.id, titleB: itemB.title });
      } else if (textA.includes('census') && textB.includes('census')) {
        potentialUpdates.push({ idA: itemA.id, titleA: itemA.title, idB: itemB.id, titleB: itemB.title });
      }
    }
  }
}

console.log(`High-confidence Duplicate Pairs Found: ${duplicatePairs.length}`);
console.log(`Potential Story Merges Found:          ${potentialMerges.length}`);
console.log(`Potential Chronological Updates Found:  ${potentialUpdates.length}`);

// 4. Note Density & Template Quality Audit
console.log('\n--- NOTE DENSITY & QUALITY METRICS ---');
let totalWords = 0;
let totalBlocks = 0;
let genericStaticCount = 0;

caRecords.forEach(r => {
  let wordCount = r.summary.split(/\s+/).length;
  r.blocks.forEach(b => {
    totalBlocks++;
    if (b.content) wordCount += b.content.split(/\s+/).length;
    if (b.items) wordCount += b.items.join(' ').split(/\s+/).length;
  });
  totalWords += wordCount;
});

const avgWords = Math.round(totalWords / caRecords.length);
console.log(`Total Word Count across 661 Notes:   ${totalWords}`);
console.log(`Average Word Count per Note:         ${avgWords} words`);
console.log(`Average Blocks per Note:             ${(totalBlocks / caRecords.length).toFixed(1)} blocks`);

// 5. Section Distribution Check
console.log('\n--- SECTION DISTRIBUTION CHECK ---');
const sectionCounts = {};
caRecords.forEach(r => {
  const cat = r.metadata.category || 'UNKNOWN';
  sectionCounts[cat] = (sectionCounts[cat] || 0) + 1;
});
console.log(JSON.stringify(sectionCounts, null, 2));

// Save Read-Only Audit Artifact
fs.writeFileSync('content/repairs/ca_v3/retain-rate-challenge-audit.json', JSON.stringify({
  version: '1.0.0-retain-rate-challenge',
  generatedAt: new Date().toISOString(),
  sample100Breakdown: {
    coreRetain: sampleResults.CORE_RETAIN.length,
    compactRetain: sampleResults.COMPACT_RETAIN.length,
    mergeCandidate: sampleResults.MERGE_CANDIDATE.length,
    updateCandidate: sampleResults.UPDATE_CANDIDATE.length,
    duplicateCandidate: sampleResults.DUPLICATE_CANDIDATE.length,
    lowYieldShouldSkip: sampleResults.LOW_YIELD_SHOULD_SKIP.length
  },
  estimatedTrueRetainRate: `${sampleResults.CORE_RETAIN.length + sampleResults.COMPACT_RETAIN.length}%`,
  estimatedSkipRate: `${sampleResults.LOW_YIELD_SHOULD_SKIP.length}%`,
  highConfidenceDuplicatesCount: duplicatePairs.length,
  duplicatePairsSample: duplicatePairs.slice(0, 10),
  noteDensity: {
    avgWordsPerNote: avgWords,
    avgBlocksPerNote: (totalBlocks / caRecords.length).toFixed(1)
  },
  sectionDistribution: sectionCounts
}, null, 2), 'utf-8');

console.log('\nAudit complete. Saved to content/repairs/ca_v3/retain-rate-challenge-audit.json');
