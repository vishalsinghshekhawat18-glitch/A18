/**
 * Relevance & Zone Classification Engine for Bank PO Mains (Framework v3)
 */

import { CAZone, CATier, LOCKED_CA_SECTIONS, CASectionDefinition, CASectionNumber } from './types';

export function deriveCAZone(dateStr: string, isRegulatoryCircularOrBudget: boolean = false): CAZone {
  if (isRegulatoryCircularOrBudget) {
    return 'CORE'; // Standing exception: 1 full year core tracking for RBI/SEBI/Budget
  }

  // Parse YYYY-MM
  const match = dateStr.match(/(\d{4})-(\d{2})/);
  if (!match) return 'CORE';

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);

  // April 2026 onwards = CORE ZONE (Exam date window Sept/Oct 2026)
  if (year > 2026 || (year === 2026 && month >= 4)) {
    return 'CORE';
  }

  // Oct 2025 – March 2026 = LIGHT TOUCH ZONE
  if ((year === 2025 && month >= 10) || (year === 2026 && month < 4)) {
    return 'LIGHT_TOUCH';
  }

  // Before Oct 2025 = SKIP
  return 'SKIP';
}

export interface ClassificationRuleResult {
  tier: CATier;
  reason: string;
  isObituary: boolean;
  section: CASectionDefinition;
}

export function classifyRelevance(
  title: string,
  summary: string,
  categoryOrSectionCode?: string,
  tags: string[] = []
): ClassificationRuleResult {
  const text = `${title} ${summary} ${tags.join(' ')}`.toLowerCase();

  // 1. Hard Rule: Obituaries are ALWAYS SKIPPED entirely
  if (
    text.includes('passes away') ||
    text.includes('passed away') ||
    text.includes('demise of') ||
    text.includes('obituary') ||
    text.includes('veteran actor passes') ||
    text.includes('former chief minister passes')
  ) {
    return {
      tier: 'TIER_C',
      reason: 'Obituary hard-skip rule (never logged)',
      isObituary: true,
      section: LOCKED_CA_SECTIONS[8]
    };
  }

  // 2. High-Priority Tier A Triggers
  const isTierA =
    text.includes('rbi') ||
    text.includes('reserve bank') ||
    text.includes('sebi') ||
    text.includes('irdai') ||
    text.includes('nabard') ||
    text.includes('monetary policy') ||
    text.includes('repo rate') ||
    text.includes('inflation') ||
    text.includes('gdp growth') ||
    text.includes('fiscal deficit') ||
    text.includes('forex reserves') ||
    text.includes('upi') ||
    text.includes('cbdc') ||
    text.includes('rupay') ||
    text.includes('cgtmse') ||
    text.includes('pradhan mantri') ||
    text.includes('yojana') ||
    text.includes('global index') ||
    text.includes('rank') ||
    text.includes('score') ||
    text.includes('appointed as md & ceo') ||
    text.includes('governor') ||
    text.includes('deputy governor') ||
    text.includes('mahāratna') ||
    text.includes('navratna') ||
    text.includes('miniratna') ||
    text.includes('gi tag') ||
    text.includes('first-ever') ||
    text.includes('world bank') ||
    text.includes('imf') ||
    text.includes('fatf');

  // 3. Tier C (Low Yield Skip) Triggers
  const isTierC =
    text.includes('entertainment') ||
    text.includes('bollywood') ||
    text.includes('celebrity') ||
    text.includes('csr award') ||
    text.includes('routine appointment at private') ||
    text.includes('brand ambassador') && !text.includes('sbi') && !text.includes('rbi');

  let sectionNumber: CASectionNumber = 4;

  if (categoryOrSectionCode) {
    const secMatch = categoryOrSectionCode.match(/SEC(\d+)/i);
    if (secMatch) {
      const num = parseInt(secMatch[1], 10) as CASectionNumber;
      if (num >= 1 && num <= 11) {
        sectionNumber = num;
      }
    }
  }

  if (isTierC && !isTierA) {
    return {
      tier: 'TIER_C',
      reason: 'Low exam yield; lacks regulatory or economic policy depth',
      isObituary: false,
      section: LOCKED_CA_SECTIONS[sectionNumber]
    };
  }

  if (isTierA) {
    return {
      tier: 'TIER_A',
      reason: 'Core banking/regulatory/economic high-yield item',
      isObituary: false,
      section: LOCKED_CA_SECTIONS[sectionNumber]
    };
  }

  return {
    tier: 'TIER_B',
    reason: 'Standard national/institutional achievement; Template B+ expanded format',
    isObituary: false,
    section: LOCKED_CA_SECTIONS[sectionNumber]
  };
}
