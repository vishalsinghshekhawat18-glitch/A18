/**
 * Entity Normalization Engine (R5)
 * Maps variable source strings, abbreviations, and institutional aliases to canonical entity IDs.
 */

const ENTITY_DICTIONARY: Record<string, string> = {
  'reserve bank of india': 'ENTITY:RBI',
  'reserve bank': 'ENTITY:RBI',
  'rbi': 'ENTITY:RBI',
  'sebi': 'ENTITY:SEBI',
  'securities and exchange board of india': 'ENTITY:SEBI',
  'irdai': 'ENTITY:IRDAI',
  'insurance regulatory and development authority': 'ENTITY:IRDAI',
  'pfrda': 'ENTITY:PFRDA',
  'pension fund regulatory and development authority': 'ENTITY:PFRDA',
  'dicgc': 'ENTITY:DICGC',
  'deposit insurance and credit guarantee corporation': 'ENTITY:DICGC',
  'npci': 'ENTITY:NPCI',
  'national payments corporation of india': 'ENTITY:NPCI',
  'sbi': 'ENTITY:SBI',
  'state bank of india': 'ENTITY:SBI',
  'ministry of finance': 'ENTITY:MOF',
  'finmin': 'ENTITY:MOF',
  'finance ministry': 'ENTITY:MOF',
  'ministry of mines': 'ENTITY:MIN_MINES',
  'election commission of india': 'ENTITY:ECI',
  'eci': 'ENTITY:ECI',
  'nso': 'ENTITY:NSO',
  'national statistical office': 'ENTITY:NSO',
  'mospi': 'ENTITY:MOSPI',
  'imf': 'ENTITY:IMF',
  'international monetary fund': 'ENTITY:IMF',
  'world bank': 'ENTITY:WORLD_BANK',
  'miga': 'ENTITY:MIGA',
  'icar': 'ENTITY:ICAR',
  'indian council of agricultural research': 'ENTITY:ICAR',
  'bcci': 'ENTITY:BCCI',
  'gift city': 'ENTITY:GIFT_CITY',
  'gujarat international finance tec-city': 'ENTITY:GIFT_CITY'
};

export function normalizeEntity(rawName: string): string {
  const clean = rawName.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  if (ENTITY_DICTIONARY[clean]) {
    return ENTITY_DICTIONARY[clean];
  }
  for (const [alias, canonical] of Object.entries(ENTITY_DICTIONARY)) {
    if (clean.includes(alias)) {
      return canonical;
    }
  }
  return `ENTITY:${clean.toUpperCase().replace(/\s+/g, '_')}`;
}
