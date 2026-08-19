/**
 * Claim Extractor & Source Conflict Engine (R5)
 * Extracts structured facts and isolates contradictions between sources.
 */

import { SourceRecord, ExtractedClaim, SourceConflict } from './types';
import { normalizeEntity } from './entityNormalizer';

export function extractClaimsFromSource(record: SourceRecord): ExtractedClaim[] {
  const text = record.rawText;
  const claims: ExtractedClaim[] = [];

  // Multi-story splitting if distinct bullet points or separated paragraphs exist
  const paragraphs = text.split(/\n\s*\n|(?<=\.)\s+(?=[A-Z0-9])/).filter(p => p.trim().length > 15);

  paragraphs.forEach((p, idx) => {
    const lower = p.toLowerCase();

    // 1. Detect Category
    let category: ExtractedClaim['category'] = 'GENERAL';
    if (lower.includes('rbi') || lower.includes('sebi') || lower.includes('repo') || lower.includes('dicgc')) {
      category = 'REGULATORY';
    } else if (lower.includes('budget') || lower.includes('gdp') || lower.includes('inflation') || lower.includes('cpi')) {
      category = 'MACRO';
    } else if (lower.includes('bank') || lower.includes('upi') || lower.includes('cbdc') || lower.includes('fdi')) {
      category = 'BANKING';
    } else if (lower.includes('scheme') || lower.includes('yojana') || lower.includes('fund') || lower.includes('ramsar')) {
      category = 'SCHEME';
    } else if (lower.includes('appointed') || lower.includes('chairman') || lower.includes('take over')) {
      category = 'APPOINTMENT';
    } else if (lower.includes('index') || lower.includes('rank') || lower.includes('padma') || lower.includes('award')) {
      category = 'INDEX';
    } else if (lower.includes('defence') || lower.includes('rafale') || lower.includes('genome') || lower.includes('isro')) {
      category = 'DEFENCE';
    } else if (lower.includes('world cup') || lower.includes('tennis') || lower.includes('tournament')) {
      category = 'SPORTS';
    }

    // 2. Extract Entity
    let rawEntity = 'Government';
    if (lower.includes('rbi') || lower.includes('reserve bank')) rawEntity = 'RBI';
    else if (lower.includes('sebi')) rawEntity = 'SEBI';
    else if (lower.includes('sbi') || lower.includes('state bank')) rawEntity = 'SBI';
    else if (lower.includes('npci') || lower.includes('upi')) rawEntity = 'NPCI';
    else if (lower.includes('nso') || lower.includes('mospi')) rawEntity = 'NSO';
    else if (lower.includes('imf')) rawEntity = 'IMF';
    else if (lower.includes('ministry of finance') || lower.includes('finmin')) rawEntity = 'Ministry of Finance';
    else if (lower.includes('ministry of mines')) rawEntity = 'Ministry of Mines';
    else if (lower.includes('icar')) rawEntity = 'ICAR';

    // 3. Extract Numerical Values
    const numRegex = /(?:₹|Rs\.?|\$)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|crore|billion|trillion|percent|%|paise)?/gi;
    const numericValues: ExtractedClaim['numericValues'] = [];
    let match;
    while ((match = numRegex.exec(p)) !== null) {
      if (match[0].trim().length > 1) {
        numericValues.push({
          value: match[1],
          context: match[0].trim()
        });
      }
    }

    claims.push({
      claimId: `claim-${record.sourceId}-${idx + 1}`,
      sourceId: record.sourceId,
      entity: rawEntity,
      normalizedEntity: normalizeEntity(rawEntity),
      action: 'Reported development',
      numericValues,
      dates: [{ dateStr: '2026', type: 'ANNOUNCEMENT' }],
      category,
      rawSnippet: p.trim()
    });
  });

  return claims;
}

export function detectSourceConflicts(claimA: ExtractedClaim, claimB: ExtractedClaim): SourceConflict | null {
  // Check if they discuss the same entity and metric but differ in numbers
  if (claimA.normalizedEntity === claimB.normalizedEntity && claimA.category === claimB.category) {
    const valA = claimA.numericValues[0]?.value;
    const valB = claimB.numericValues[0]?.value;

    if (valA && valB && valA !== valB) {
      // Differentiate methodological difference (e.g. GDP $4.18T NSO vs $3.92T IMF)
      const isMethodological = (claimA.rawSnippet.includes('IMF') && claimB.rawSnippet.includes('NSO')) ||
                               (claimA.rawSnippet.includes('Nominal') && claimB.rawSnippet.includes('Real'));

      return {
        field: 'numerical_value',
        claimA: { sourceId: claimA.sourceId, value: valA },
        claimB: { sourceId: claimB.sourceId, value: valB },
        conflictType: isMethodological ? 'METHODOLOGICAL_DIFFERENCE' : 'NUMERICAL_DISCREPANCY',
        resolution: isMethodological ? 'Keep distinct: NSO Official National Accounts vs IMF Comparative Outlook' : undefined
      };
    }
  }
  return null;
}
