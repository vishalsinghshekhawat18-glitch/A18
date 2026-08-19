/**
 * Current Affairs Intelligence Architecture v3 - Types & Schema
 * Reconciled for Bank PO Mains 2026 (SBI PO / IBPS PO / Regulatory Officers)
 * Built on Claude Framework v3 & Antigravity R4 Intelligence Layer
 */

export type CAZone = 'CORE' | 'LIGHT_TOUCH' | 'SKIP';

export type CATier = 'TIER_A' | 'TIER_B' | 'TIER_C';

export type CASectionNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface CASectionDefinition {
  number: CASectionNumber;
  code: `SEC${CASectionNumber}`;
  name: string;
  emoji: string;
  fullName: string;
  defaultTier: CATier;
}

export const LOCKED_CA_SECTIONS: Record<CASectionNumber, CASectionDefinition> = {
  1: { number: 1, code: 'SEC1', name: 'ESI, FINANCE & BUSINESS NEWS', emoji: '💰', fullName: '1. 💰 ESI, FINANCE & BUSINESS NEWS', defaultTier: 'TIER_A' },
  2: { number: 2, code: 'SEC2', name: 'REGULATORY BODIES NEWS', emoji: '🏛️', fullName: '2. 🏛️ REGULATORY BODIES NEWS', defaultTier: 'TIER_A' },
  3: { number: 3, code: 'SEC3', name: 'BANKING & INSURANCE NEWS', emoji: '🏦', fullName: '3. 🏦 BANKING & INSURANCE NEWS', defaultTier: 'TIER_A' },
  4: { number: 4, code: 'SEC4', name: 'NATIONAL, STATE & INTERNATIONAL NEWS', emoji: '🌐', fullName: '4. 🌐 NATIONAL, STATE & INTERNATIONAL NEWS', defaultTier: 'TIER_B' },
  5: { number: 5, code: 'SEC5', name: 'MoUs, CONFERENCES & APPOINTMENTS', emoji: '🤝', fullName: '5. 🤝 MoUs, CONFERENCES & APPOINTMENTS', defaultTier: 'TIER_B' },
  6: { number: 6, code: 'SEC6', name: 'SCIENCE, TECHNOLOGY, DEFENCE & SPORTS', emoji: '🔬', fullName: '6. 🔬 SCIENCE, TECHNOLOGY, DEFENCE & SPORTS', defaultTier: 'TIER_B' },
  7: { number: 7, code: 'SEC7', name: 'AWARDS, BOOKS, INDICES & RANKINGS', emoji: '🏆', fullName: '7. 🏆 AWARDS, BOOKS, INDICES & RANKINGS', defaultTier: 'TIER_A' },
  8: { number: 8, code: 'SEC8', name: 'IMPORTANT DAYS & PERSONS IN NEWS', emoji: '📅', fullName: '8. 📅 IMPORTANT DAYS & PERSONS IN NEWS', defaultTier: 'TIER_B' },
  9: { number: 9, code: 'SEC9', name: 'PIB, CIRCULARS & NOTIFICATIONS', emoji: '📋', fullName: '9. 📋 PIB, CIRCULARS & NOTIFICATIONS', defaultTier: 'TIER_A' },
  10: { number: 10, code: 'SEC10', name: 'MISCELLANEOUS — GOVT SCHEMES & STATIC', emoji: '📌', fullName: '10. 📌 MISCELLANEOUS — GOVT SCHEMES & STATIC', defaultTier: 'TIER_A' },
  11: { number: 11, code: 'SEC11', name: 'REVISION', emoji: '🧠', fullName: '11. 🧠 REVISION', defaultTier: 'TIER_A' }
};

export type CATemplateType = 'TEMPLATE_A_RICH' | 'TEMPLATE_B_PLUS' | 'SKIPPED_LOG';

export interface CAStaticGK {
  headquarters?: string;
  foundedOrEstablished?: string;
  mdAndCeoOrChairperson?: string;
  tagline?: string;
  parentMinistry?: string;
  extraFacts?: string[];
}

export interface CAInterviewQuestion {
  question: string;
  modelAnswer: string; // 2-line concise answer
}

export interface CAMetaIntelligence {
  zone: CAZone;
  tier: CATier;
  templateType: CATemplateType;
  section: CASectionDefinition;
  
  // Framework v3 Pedagogical Anchors
  hook?: string; // One punchy sentence with 1-2 key figures
  examAngle: string; // MANDATORY: Exact form tested in MCQs
  mnemonic?: string; // Optional short sticky trick
  interviewQ?: CAInterviewQuestion; // For RBI/SEBI/Schemes
  staticGK?: CAStaticGK;
  
  // Story Thread & Deduplication
  isUpdate?: boolean; // Continuation of prior news (🔄 UPDATE)
  duplicateOfId?: string; // Reference to prior ID if duplicate
  parentStoryId?: string; // For multi-part merged stories (A, B, C...)
  jargonGlosses?: Record<string, string>; // 3-8 word parenthetical glosses
  
  // Audit & Provenance
  claimVerificationStatus: 'VERIFIED' | 'NEEDS_ENRICHMENT' | 'UNCHECKED';
  sourceInstitution: string;
  publishedDate: string;
  referenceExamYear: number;
}
