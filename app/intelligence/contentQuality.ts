import { KnowledgeItem, Domain } from '../../schema/knowledge-item';

export type QualityStatus =
  | 'valid'
  | 'thin'
  | 'fragment'
  | 'artifact'
  | 'superseded'
  | 'needs_enrichment';

export type QualityAction =
  | 'keep'
  | 'merge'
  | 'supersede'
  | 'discard-artifact'
  | 'enrich';

export interface ContentQualityAssessment {
  itemId: string;
  domain: Domain;
  title: string;
  qualityStatus: QualityStatus;
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
  missingFields: string[];
  parentId?: string;
  parentTitle?: string;
  supersededBy?: string;
  supersededTarget?: string;
  recommendedAction: QualityAction;
}

// Generic patterns indicating OCR debris, table of contents citations, or channel watermarks
const ARTIFACT_REGEX = /(?:Page\s+No\.?\s*\d+|--\s*\d+\s+of\s+\d+\s*--|ONE STOP SOLUTION FOR IAS|Youtube\s+Telegram|MINISTRY OF [A-Z\s]+Page No)/i;

// Generic patterns indicating an orphan section heading or sub-component bullet
const FRAGMENT_TITLE_REGEX = /^(?:Launch & Approval|Key Objectives|Special Focus|Infrastructure|Education|Economic Empowerment|Economic Growth|Pre Matric|Post Matric|Higher Education|Merit Improvement|Nationwide|Rs\.\s*\d+|Legal Ownership|Energy:\s*\d+%|Electricity\s*\(\d+%\)|Samarthya|Sambal|Improving waste management|Enable digital monitoring|Expansion of Cities)/i;

// Known masterfile registry for schemes superseded by migrated-schemes-masterfile.json
const SCHEMES_MASTERFILE_MAP: Record<string, { targetName: string; section: string }> = {
  'JAN DHAN': { targetName: 'PMJDY', section: 'Bucket 1: Problem Map 1 & MoF Quick-Map' },
  'PMJDY': { targetName: 'PMJDY', section: 'Bucket 1: Problem Map 1 & MoF Quick-Map' },
  'PM-KISAN': { targetName: 'PM-KISAN', section: 'Bucket 1: Core Problem 2 & MoA&FW Quick-Map' },
  'JEEVAN JYOTI': { targetName: 'PMJJBY', section: 'Bucket 1: Problem Map 3 & MoF Quick-Map & Trap 2' },
  'PMJJBY': { targetName: 'PMJJBY', section: 'Bucket 1: Problem Map 3 & MoF Quick-Map & Trap 2' },
  'SURAKSHA BIMA': { targetName: 'PMSBY', section: 'Bucket 1: Problem Map 3 & MoF Quick-Map' },
  'PMSBY': { targetName: 'PMSBY', section: 'Bucket 1: Problem Map 3 & MoF Quick-Map' },
  'ATAL PENSION': { targetName: 'APY', section: 'MoF Quick-Map' },
  'APY': { targetName: 'APY', section: 'MoF Quick-Map' },
  'MUDRA': { targetName: 'PM MUDRA Yojana', section: 'Table 2: Funding Pattern, MoF Quick-Map, Trap 1' },
  'STAND UP INDIA': { targetName: 'Stand Up India Scheme', section: 'MoF Quick-Map' },
  'SOVEREIGN GOLD': { targetName: 'SGB', section: 'MoF Quick-Map' },
  'SGB': { targetName: 'SGB', section: 'MoF Quick-Map' },
  'GOLD MONETISATION': { targetName: 'GMS', section: 'MoF Quick-Map' },
  'SENIOR CITIZENS': { targetName: 'SCSS', section: 'MoF Quick-Map' },
  'JAN SAMARTH': { targetName: 'Jan Samarth Portal', section: 'MoF Quick-Map' },
  'NATIONAL INFRASTRUCTURE PIPELINE': { targetName: 'NIP', section: 'MoF Quick-Map' },
  'NIP': { targetName: 'NIP', section: 'MoF Quick-Map' },
  'NATIONAL MONETIZATION PIPELINE': { targetName: 'NMP', section: 'MoF Quick-Map' },
  'NMP': { targetName: 'NMP', section: 'MoF Quick-Map' },
  'FASAL BIMA': { targetName: 'PMFBY', section: 'MoA&FW Quick-Map' },
  'PMFBY': { targetName: 'PMFBY', section: 'MoA&FW Quick-Map' },
  'KRISHI SINCHAYEE': { targetName: 'PMKSY', section: 'MoA&FW Quick-Map' },
  'PMKSY': { targetName: 'PMKSY', section: 'MoA&FW Quick-Map' },
  'E-NAM': { targetName: 'e-NAM', section: 'MoA&FW Quick-Map' },
  'ENAM': { targetName: 'e-NAM', section: 'MoA&FW Quick-Map' },
  'PARAMPARAGAT': { targetName: 'PKVY', section: 'MoA&FW Quick-Map' },
  'PKVY': { targetName: 'PKVY', section: 'MoA&FW Quick-Map' },
  'SOIL HEALTH': { targetName: 'Soil Health Card Scheme', section: 'MoA&FW Quick-Map' },
  'RKVY': { targetName: 'RKVY-RAFTAAR', section: 'MoA&FW Quick-Map' },
  'KISAN CREDIT CARD': { targetName: 'KCC', section: 'MoA&FW Quick-Map' },
  'KCC': { targetName: 'KCC', section: 'MoA&FW Quick-Map' },
  'MGNREGS': { targetName: 'MGNREGS', section: 'Bucket 1: Table 1, Table 2 Funding, MoRD Quick-Map, Trap 9' },
  'MAHATMA GANDHI NATIONAL RURAL': { targetName: 'MGNREGS', section: 'Bucket 1: Table 1, Table 2 Funding, MoRD Quick-Map, Trap 9' },
  'AWAS YOJANA (GRAMIN)': { targetName: 'PMAY-G', section: 'Bucket 1: Table 1, Table 2 Funding, MoRD Quick-Map' },
  'PMAY-G': { targetName: 'PMAY-G', section: 'Bucket 1: Table 1, Table 2 Funding, MoRD Quick-Map' },
  'AWAS YOJANA (URBAN)': { targetName: 'PMAY-U', section: 'Bucket 1: Table 1, MoHUA Quick-Map, Trap 3' },
  'PMAY-U': { targetName: 'PMAY-U', section: 'Bucket 1: Table 1, MoHUA Quick-Map, Trap 3' },
  'GRAM SADAK': { targetName: 'PMGSY', section: 'Table 2 Funding, MoRD Quick-Map' },
  'PMGSY': { targetName: 'PMGSY', section: 'Table 2 Funding, MoRD Quick-Map' },
  'DAY-NRLM': { targetName: 'DAY-NRLM', section: 'MoRD Quick-Map' },
  'LAKHPATI DIDI': { targetName: 'Lakhpati Didi', section: 'MoRD Quick-Map' },
  'PMGDISHA': { targetName: 'PMGDISHA', section: 'MoRD Quick-Map' },
  'SMART CITIES': { targetName: 'Smart Cities Mission', section: 'MoHUA Quick-Map' },
  'SMART CITY': { targetName: 'Smart Cities Mission', section: 'MoHUA Quick-Map' },
  'AMRUT': { targetName: 'AMRUT 2.0', section: 'MoHUA Quick-Map' },
  'SWACHH BHARAT': { targetName: 'Swachh Bharat Mission', section: 'MoHUA Quick-Map' },
  'HRIDAY': { targetName: 'HRIDAY Mission', section: 'MoHUA Quick-Map' },
  'DAY-NULM': { targetName: 'DAY-NULM', section: 'MoHUA Quick-Map' },
  'SVANIDHI': { targetName: 'PM SVANidhi', section: 'MoHUA Quick-Map' },
  'DIGITAL INDIA': { targetName: 'Digital India', section: 'Bucket 1: Table 1, MeitY Quick-Map' },
  'DIGILOCKER': { targetName: 'DigiLocker', section: 'MeitY Quick-Map' },
  'UMANG': { targetName: 'UMANG App', section: 'MeitY Quick-Map' },
  'COMMON SERVICE CENTRES': { targetName: 'CSC 2.0', section: 'MeitY Quick-Map' },
  'CSC': { targetName: 'CSC 2.0', section: 'MeitY Quick-Map' },
  'INDIASTACK': { targetName: 'IndiaStack & UPI', section: 'MeitY Quick-Map, Trap 6' },
  'ONDC': { targetName: 'ONDC', section: 'MeitY / DPIIT Quick-Map, Trap 7' },
  'BHARATNET': { targetName: 'BharatNet', section: 'Bucket 1: Table 1, DoT Quick-Map, Trap 8' },
  'PM-WANI': { targetName: 'PM-WANI', section: 'Bucket 1: Table 1' },
  'KAUSHAL VIKAS': { targetName: 'PMKVY 4.0', section: 'Bucket 1: Table 1' },
  'PMKVY': { targetName: 'PMKVY 4.0', section: 'Bucket 1: Table 1' },
  'AYUSHMAN BHARAT': { targetName: 'Ayushman Bharat PM-JAY', section: 'Bucket 1: Table 1 & Master Trap Table' },
  'NATIONAL HEALTH MISSION': { targetName: 'NHM', section: 'Table 2 Funding Pattern (90:10)' },
  'NHM': { targetName: 'NHM', section: 'Table 2 Funding Pattern (90:10)' },
  'KUSUM': { targetName: 'PM-KUSUM', section: 'Master Trap Table 4' },
  'PM-KUSUM': { targetName: 'PM-KUSUM', section: 'Master Trap Table 4' },
  'SVAMITVA': { targetName: 'SVAMITVA', section: 'Master Trap Table 5' },
  'SHRAM YOGI': { targetName: 'PM-SYM', section: 'Master Trap Table 10' },
  'PM-SYM': { targetName: 'PM-SYM', section: 'Master Trap Table 10' },
  'VISHWAKARMA': { targetName: 'PM Vishwakarma', section: 'MoF / MSME Flagship' },
  'GATI SHAKTI': { targetName: 'PM Gati Shakti', section: 'Logistics Master Framework' },
  'BHARATMALA': { targetName: 'Bharatmala Pariyojana', section: 'MoRTH Highways Framework' },
  'SAGARMALA': { targetName: 'Sagarmala Programme', section: 'MoPSW Ports Framework' },
  'JAL JEEVAN': { targetName: 'Jal Jeevan Mission', section: 'Ministry of Jal Shakti Flagship' },
  'SUKANYA SAMRIDDHI': { targetName: 'Sukanya Samriddhi (SSY)', section: 'MoF / MoWCD Small Savings' },
  'BETI BACHAO': { targetName: 'Beti Bachao Beti Padhao', section: 'MoWCD National Mission' },
  'MATRU VANDANA': { targetName: 'PMMVY', section: 'MoWCD DBT Maternity Benefit' },
  'PMMVY': { targetName: 'PMMVY', section: 'MoWCD DBT Maternity Benefit' },
  'POSHAN': { targetName: 'Poshan Abhiyaan', section: 'MoWCD Nutrition Mission' },
  'MISSION SHAKTI': { targetName: 'Mission Shakti', section: 'MoWCD Women Empowerment' },
  'PM SHRI': { targetName: 'PM SHRI Schools', section: 'Ministry of Education National Mission' },
  'NIPUN BHARAT': { targetName: 'NIPUN Bharat', section: 'Ministry of Education Foundational Literacy' },
  'STARS': { targetName: 'STARS Scheme', section: 'Ministry of Education & World Bank' },
  'VIBRANT VILLAGE': { targetName: 'Vibrant Villages Programme', section: 'MHA Border Infrastructure' },
  'GARIB KALYAN ANNA': { targetName: 'PMGKAY', section: 'NFSA / MoCAF&PD Free Foodgrains' },
  'PMGKAY': { targetName: 'PMGKAY', section: 'NFSA / MoCAF&PD Free Foodgrains' },
  'UJJWALA': { targetName: 'PM Ujjwala Yojana (PMUY)', section: 'MoPNG Clean Cooking LPG' },
  'PMUY': { targetName: 'PM Ujjwala Yojana (PMUY)', section: 'MoPNG Clean Cooking LPG' }
};

/**
 * Extracts plain text across all blocks in a knowledge item
 */
export function extractItemPlainText(blocks: any[] = []): string {
  const parts: string[] = [];
  for (const b of blocks) {
    if (!b) continue;
    if (typeof b.content === 'string') parts.push(b.content);
    if (typeof b.text === 'string') parts.push(b.text);
    if (typeof b.title === 'string') parts.push(b.title);
    if (Array.isArray(b.items)) parts.push(...b.items.filter((it: any) => typeof it === 'string'));
    if (Array.isArray(b.rows)) {
      b.rows.forEach((r: any) => {
        if (Array.isArray(r)) parts.push(...r.filter((c: any) => typeof c === 'string'));
      });
    }
  }
  return parts.join(' ').trim();
}

/**
 * Evaluates the content quality of any KnowledgeItem in the corpus.
 * Pure, reusable across all 12 knowledge domains.
 */
export function assessContentQuality(
  item: KnowledgeItem,
  corpusMap: KnowledgeItem[] = []
): ContentQualityAssessment {
  const plainText = extractItemPlainText(item.blocks);
  const textLength = plainText.length;
  const title = (item.title || '').trim();
  const titleUpper = title.toUpperCase();

  // 1. Artifact Detection (True debris stubs: short length <150 chars AND contains OCR/TOC traces)
  const isPureArtifact = (textLength < 150 && ARTIFACT_REGEX.test(plainText)) || ARTIFACT_REGEX.test(title);
  if (isPureArtifact) {
    return {
      itemId: item.id,
      domain: item.domain,
      title: item.title,
      qualityStatus: 'artifact',
      confidence: 'high',
      reasons: ['Contains OCR headers, table of contents citations, or channel extraction noise.'],
      missingFields: [],
      recommendedAction: 'discard-artifact'
    };
  }

  // 2. Fragment Detection (Orphan sub-headings, split bullets)
  if (item.domain === 'schemes' && FRAGMENT_TITLE_REGEX.test(title)) {
    // Deterministic parent resolution from predecessor stubs
    let parentId: string | undefined;
    let parentTitle: string | undefined;

    if (item.id.startsWith('migrated-schemes-scheme-')) {
      const currentNum = parseInt(item.id.replace('migrated-schemes-scheme-', ''), 10);
      for (let prevNum = currentNum - 1; prevNum >= Math.max(1, currentNum - 6); prevNum--) {
        const candidateId = `migrated-schemes-scheme-${prevNum}`;
        const candidate = corpusMap.find(i => i.id === candidateId);
        if (candidate && !FRAGMENT_TITLE_REGEX.test(candidate.title) && !ARTIFACT_REGEX.test(candidate.title)) {
          parentId = candidate.id;
          parentTitle = candidate.title;
          break;
        }
      }
    }

    return {
      itemId: item.id,
      domain: item.domain,
      title: item.title,
      qualityStatus: 'fragment',
      confidence: 'high',
      reasons: ['Orphan sub-heading or section bullet point belonging to a parent flagship scheme.'],
      missingFields: [],
      parentId,
      parentTitle,
      recommendedAction: 'merge'
    };
  }

  // 3. Redundancy / Superseded Detection (Covered in consolidated masterfile)
  if (item.domain === 'schemes' && item.id !== 'migrated-schemes-masterfile') {
    for (const [key, val] of Object.entries(SCHEMES_MASTERFILE_MAP)) {
      if (titleUpper.includes(key)) {
        return {
          itemId: item.id,
          domain: item.domain,
          title: item.title,
          qualityStatus: 'superseded',
          confidence: 'high',
          reasons: [`Fully represented with funding patterns and trap analysis in masterfile under "${val.targetName}".`],
          missingFields: [],
          supersededBy: 'migrated-schemes-masterfile',
          supersededTarget: val.targetName,
          recommendedAction: 'supersede'
        };
      }
    }
  }

  // 4. Standalone Thin Schemes Needing Factual Enrichment
  if (item.domain === 'schemes' && item.id !== 'migrated-schemes-masterfile') {
    const hasMinistry = /ministry|department/i.test(plainText);
    const hasObjectives = /objective|aim|focus|goal/i.test(plainText);
    const hasBeneficiaries = /beneficiar|eligib|target/i.test(plainText);
    const isThin = textLength < 400 || !hasMinistry || !hasObjectives || !hasBeneficiaries;

    if (isThin) {
      const missing: string[] = [];
      if (!hasMinistry) missing.push('nodalMinistry');
      if (!hasObjectives) missing.push('keyObjectives');
      if (!hasBeneficiaries) missing.push('targetBeneficiaries');
      if (!/launch|launched|year|date|period/i.test(plainText)) missing.push('launchYear');
      if (!/outlay|budget|fund|rs\.|crore/i.test(plainText)) missing.push('financialOutlay');

      return {
        itemId: item.id,
        domain: item.domain,
        title: item.title,
        qualityStatus: 'needs_enrichment',
        confidence: 'high',
        reasons: ['Legitimate standalone government scheme lacking comprehensive structured fields.'],
        missingFields: missing.length > 0 ? missing : ['comprehensiveStructuredCoverage'],
        recommendedAction: 'enrich'
      };
    }
  }

  // 5. General Thin Notes in Other Domains (<100 chars)
  if (textLength < 100 && item.id !== 'migrated-schemes-masterfile') {
    return {
      itemId: item.id,
      domain: item.domain,
      title: item.title,
      qualityStatus: 'thin',
      confidence: 'medium',
      reasons: [`Note content is suspiciously short (${textLength} chars).`],
      missingFields: ['contentExpansion'],
      recommendedAction: 'enrich'
    };
  }

  // 6. Valid, Fully Usable Knowledge Unit
  return {
    itemId: item.id,
    domain: item.domain,
    title: item.title,
    qualityStatus: 'valid',
    confidence: 'high',
    reasons: ['Independently understandable, structurally intact study unit with meaningful content blocks.'],
    missingFields: [],
    recommendedAction: 'keep'
  };
}

/**
 * Audits the entire corpus and produces a comprehensive quality assessment report
 */
export function auditCorpusQuality(corpus: KnowledgeItem[]): {
  summary: {
    totalItems: number;
    validCount: number;
    thinCount: number;
    fragmentCount: number;
    artifactCount: number;
    supersededCount: number;
    needsEnrichmentCount: number;
  };
  assessments: ContentQualityAssessment[];
  enrichmentQueue: ContentQualityAssessment[];
} {
  const assessments = corpus.map(item => assessContentQuality(item, corpus));

  const validCount = assessments.filter(a => a.qualityStatus === 'valid').length;
  const thinCount = assessments.filter(a => a.qualityStatus === 'thin').length;
  const fragmentCount = assessments.filter(a => a.qualityStatus === 'fragment').length;
  const artifactCount = assessments.filter(a => a.qualityStatus === 'artifact').length;
  const supersededCount = assessments.filter(a => a.qualityStatus === 'superseded').length;
  const needsEnrichmentCount = assessments.filter(a => a.qualityStatus === 'needs_enrichment').length;

  const enrichmentQueue = assessments.filter(
    a => a.qualityStatus === 'needs_enrichment' || a.qualityStatus === 'thin'
  );

  return {
    summary: {
      totalItems: corpus.length,
      validCount,
      thinCount,
      fragmentCount,
      artifactCount,
      supersededCount,
      needsEnrichmentCount
    },
    assessments,
    enrichmentQueue
  };
}
