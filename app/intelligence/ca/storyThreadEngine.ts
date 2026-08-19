/**
 * Multi-Signal Story Thread & Relationship Decision Engine (Framework v3)
 * 
 * Uses multi-dimensional heuristics rather than simple cosine/string similarity:
 * 1. Primary Entity / Institution overlap (RBI, SEBI, MoF, SBI, NPCI, etc.)
 * 2. Event & Statutory Domain (Monetary policy vs Penalty vs Facility vs MoU)
 * 3. Named Policy / Scheme / Instrument (Repo, UPI, MPS, PM-KUSUM, ECB, BER)
 * 4. Key Metrics & Numerical Facts (₹ amounts, %, dates, volume figures)
 * 5. Temporal Chronology & Publication Window
 * 
 * Possible Relationship Decisions:
 * - EXACT_DUPLICATE: Identical event, same window, same figures -> 🚫 Skipped Log (Duplicate)
 * - NEAR_DUPLICATE_REWORDED: Same underlying fact reworded by different press -> Deduplicate
 * - MULTI_PART_STORY: Same entity, same policy package/meeting window -> Merge A/B/C sub-sections
 * - CHRONOLOGICAL_UPDATE: Same continuing story with new milestone/decision -> 🔄 UPDATE + cross-link
 * - SEPARATE_SAME_INSTITUTION: Same body, but distinct regulatory acts -> SEPARATE (Anti-False-Merge)
 * - SEPARATE_SIMILAR_TITLE: High lexical overlap, but distinct subjects -> SEPARATE (Anti-False-Merge)
 * - UNIQUE_STANDALONE: Independent item
 */

export type StoryRelationshipDecision =
  | 'EXACT_DUPLICATE'
  | 'NEAR_DUPLICATE_REWORDED'
  | 'MULTI_PART_STORY'
  | 'CHRONOLOGICAL_UPDATE'
  | 'SEPARATE_SAME_INSTITUTION'
  | 'SEPARATE_SIMILAR_TITLE'
  | 'UNIQUE_STANDALONE';

export interface MultiSignalAnalysis {
  decision: StoryRelationshipDecision;
  confidence: number;
  reason: string;
  matchedId?: string;
  parentStoryId?: string;
  retainedFacts: string[];
  discardedFacts: string[];
  signals: {
    entityOverlap: boolean;
    namedInstrumentOverlap: boolean;
    eventTypeMatch: boolean;
    dateDistanceDays: number;
    lexicalSimilarity: number;
    numericalFactMismatch: boolean;
  };
}

export interface CandidateItem {
  id: string;
  title: string;
  summary: string;
  date?: string;
  category?: string;
  entities?: string[];
  instruments?: string[];
}

const INSTITUTIONS = [
  'rbi', 'reserve bank', 'sebi', 'irdai', 'nabard', 'nhb', 'pfrda', 'sbi', 'npci',
  'ministry of finance', 'niti aayog', 'world bank', 'imf', 'adb', 'wto', 'fatf'
];

const INSTRUMENTS = [
  'repo rate', 'vrr', 'sdf', 'msf', 'crr', 'slr', 'upi', 'cbdc', 'ecb', 'mps',
  'mutual fund', 'aum', 'gdp', 'inflation', 'cpi', 'wpi', 'cgtmse', 'psl'
];

function extractSignals(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase();
  
  const foundEntities = INSTITUTIONS.filter(inst => text.includes(inst));
  const foundInstruments = INSTRUMENTS.filter(inst => text.includes(inst));
  
  // Extract key numbers (e.g. ₹2.15 Lakh Crore, 5.25%, $1 Billion)
  const numbers = text.match(/(?:₹|\$|rs\.?|inr)?\s*\d+(?:\.\d+)?\s*(?:lakh|crore|billion|trillion|percent|%|bps)?/gi) || [];

  return {
    foundEntities,
    foundInstruments,
    numbers: Array.from(new Set(numbers.map(n => n.trim())))
  };
}

export function evaluateStoryRelationship(
  newItem: CandidateItem,
  existingItem: CandidateItem
): MultiSignalAnalysis {
  const sigA = extractSignals(newItem.title, newItem.summary);
  const sigB = extractSignals(existingItem.title, existingItem.summary);

  const entityOverlap = sigA.foundEntities.some(e => sigB.foundEntities.includes(e));
  const instrumentOverlap = sigA.foundInstruments.some(i => sigB.foundInstruments.includes(i));

  // Lexical similarity (Jaccard on non-stop words)
  const wordsA = new Set(newItem.title.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 3));
  const wordsB = new Set(existingItem.title.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 3));
  
  let commonWords = 0;
  wordsA.forEach(w => { if (wordsB.has(w)) commonWords++; });
  const totalUnique = new Set([...wordsA, ...wordsB]).size;
  const lexicalSimilarity = totalUnique > 0 ? commonWords / totalUnique : 0;

  // Date Distance Calculation
  let dateDistanceDays = 0;
  if (newItem.date && existingItem.date) {
    const dA = new Date(newItem.date).getTime();
    const dB = new Date(existingItem.date).getTime();
    dateDistanceDays = Math.abs(Math.round((dA - dB) / (1000 * 60 * 60 * 24)));
  }

  // Check numerical fact collision
  const sharedNumbers = sigA.numbers.filter(n => sigB.numbers.includes(n));
  const numericalFactMismatch = sigA.numbers.length > 0 && sigB.numbers.length > 0 && sharedNumbers.length === 0;

  // MULTI-SIGNAL DECISION MATRIX:

  // Rule 1: Exact / Near Duplicate
  if (lexicalSimilarity > 0.80 && dateDistanceDays === 0 && (!numericalFactMismatch || sharedNumbers.length > 0)) {
    return {
      decision: 'EXACT_DUPLICATE',
      confidence: 0.98,
      reason: `Identical reporting on ${newItem.date} with matching core figures (${sharedNumbers.join(', ')})`,
      matchedId: existingItem.id,
      retainedFacts: [`Canonical source ${existingItem.id}`],
      discardedFacts: ['Duplicate text'],
      signals: { entityOverlap, namedInstrumentOverlap: instrumentOverlap, eventTypeMatch: true, dateDistanceDays, lexicalSimilarity, numericalFactMismatch: false }
    };
  }

  // Rule 2: Same Story, Different Phrasing on Same Date
  if (entityOverlap && instrumentOverlap && dateDistanceDays <= 1 && lexicalSimilarity > 0.45 && sharedNumbers.length > 0) {
    return {
      decision: 'NEAR_DUPLICATE_REWORDED',
      confidence: 0.92,
      reason: `Reworded coverage of the same ${sigA.foundEntities[0] || ''} announcement on ${newItem.date}`,
      matchedId: existingItem.id,
      retainedFacts: [`All factual parameters merged into ${existingItem.id}`],
      discardedFacts: ['Redundant phrasing'],
      signals: { entityOverlap, namedInstrumentOverlap: instrumentOverlap, eventTypeMatch: true, dateDistanceDays, lexicalSimilarity, numericalFactMismatch: false }
    };
  }

  // Rule 3: Chronological Update (Same Scheme / Metric over time)
  if (instrumentOverlap && entityOverlap && dateDistanceDays > 5) {
    return {
      decision: 'CHRONOLOGICAL_UPDATE',
      confidence: 0.90,
      reason: `Later milestone/metric for ${sigA.foundInstruments[0] || 'instrument'} (${existingItem.date} -> ${newItem.date}). Chronology and distinct figures preserved.`,
      matchedId: existingItem.id,
      retainedFacts: [`New figures: ${sigA.numbers.join(', ')}`, `New date: ${newItem.date}`],
      discardedFacts: [],
      signals: { entityOverlap, namedInstrumentOverlap: instrumentOverlap, eventTypeMatch: true, dateDistanceDays, lexicalSimilarity, numericalFactMismatch }
    };
  }

  // Rule 4: Multi-Part Story (Same institution, same release package on same day)
  if (entityOverlap && dateDistanceDays <= 2 && lexicalSimilarity > 0.30 && !numericalFactMismatch) {
    return {
      decision: 'MULTI_PART_STORY',
      confidence: 0.85,
      reason: `Constituent sub-component of ${sigA.foundEntities[0] || 'regulatory'} policy package on ${newItem.date}. Merged with A/B/C sub-sections.`,
      parentStoryId: existingItem.id,
      retainedFacts: [`Sub-component facts: ${sigA.numbers.join(', ')}`],
      discardedFacts: ['Duplicate static institutional boilerplate'],
      signals: { entityOverlap, namedInstrumentOverlap: instrumentOverlap, eventTypeMatch: true, dateDistanceDays, lexicalSimilarity, numericalFactMismatch: false }
    };
  }

  // Rule 5: ANTI-FALSE-MERGE — Same Institution, Distinct Statutory Actions
  if (entityOverlap && (numericalFactMismatch || !instrumentOverlap) && lexicalSimilarity < 0.40) {
    return {
      decision: 'SEPARATE_SAME_INSTITUTION',
      confidence: 0.95,
      reason: `Both involve ${sigA.foundEntities[0] || 'institution'}, but address distinct regulatory domains. Kept strictly separate.`,
      retainedFacts: [`Full independent note for ${newItem.id}`],
      discardedFacts: [],
      signals: { entityOverlap, namedInstrumentOverlap: instrumentOverlap, eventTypeMatch: false, dateDistanceDays, lexicalSimilarity, numericalFactMismatch: true }
    };
  }

  // Rule 6: ANTI-FALSE-MERGE — Similar Title wording, but distinct events/states/treaties
  if (lexicalSimilarity > 0.50 && (!entityOverlap || numericalFactMismatch)) {
    return {
      decision: 'SEPARATE_SIMILAR_TITLE',
      confidence: 0.92,
      reason: `High word overlap, but distinct underlying entities or metrics. Kept strictly separate.`,
      retainedFacts: [`Full independent note for ${newItem.id}`],
      discardedFacts: [],
      signals: { entityOverlap, namedInstrumentOverlap: instrumentOverlap, eventTypeMatch: false, dateDistanceDays, lexicalSimilarity, numericalFactMismatch: true }
    };
  }

  // Default: Unique Standalone
  return {
    decision: 'UNIQUE_STANDALONE',
    confidence: 0.90,
    reason: 'Unique standalone news event.',
    retainedFacts: [`Full content preserved`],
    discardedFacts: [],
    signals: { entityOverlap, namedInstrumentOverlap: instrumentOverlap, eventTypeMatch: false, dateDistanceDays, lexicalSimilarity, numericalFactMismatch: false }
  };
}

/**
 * Standard 3-8 word parenthetical gloss dictionary for banking exams
 */
export const STANDARD_JARGON_GLOSSES: Record<string, string> = {
  'OFS': 'promoters sell existing shares via exchange',
  'LCOE': 'levelized cost of producing electricity',
  'CBDC': 'central bank digital sovereign currency',
  'NACH': 'automated recurring bulk payments system',
  'NDTL': 'net demand and time liabilities of banks',
  'SDF': 'standing deposit facility without collateral',
  'MSF': 'marginal standing facility for emergency borrowing',
  'LAF': 'liquidity adjustment facility for repo operations',
  'CGTMSE': 'credit guarantee trust for micro/small enterprises',
  'MCLR': 'marginal cost of funds-based lending rate',
  'PCA': 'prompt corrective action framework for stressed banks',
  'FPI': 'foreign portfolio investors holding liquid financial assets',
  'FDI': 'foreign direct investment with lasting management interest',
  'AUM': 'total market value of assets managed by fund',
  'CRAR': 'capital to risk-weighted assets ratio',
  'AT1': 'additional tier 1 perpetual loss-absorbing bonds',
  'WPI': 'wholesale price index tracking producer-level inflation',
  'CPI': 'consumer price index tracking retail basket inflation',
  'IIP': 'index of industrial production measuring physical output'
};

export function applyJargonGlossing(text: string): { glossedText: string; glossesApplied: Record<string, string> } {
  let glossedText = text;
  const glossesApplied: Record<string, string> = {};

  Object.entries(STANDARD_JARGON_GLOSSES).forEach(([term, gloss]) => {
    const regex = new RegExp(`\\b${term}\\b(?!\\s*\\()`, 'i');
    if (regex.test(glossedText)) {
      glossedText = glossedText.replace(regex, `${term} (${gloss})`);
      glossesApplied[term] = gloss;
    }
  });

  return { glossedText, glossesApplied };
}

