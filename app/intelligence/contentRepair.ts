import { KnowledgeItem, Domain } from '../../schema/knowledge-item';
import {
  ContentQualityAssessment,
  QualityStatus,
  assessContentQuality,
  extractItemPlainText
} from './contentQuality';

export type RepairAction =
  | 'retain'
  | 'supersede'
  | 'merge'
  | 'discard'
  | 'enrich'
  | 'verify';

export type RepairPriority = 'P0' | 'P1' | 'P2' | 'P3';

export type RepairStatus = 'pending_review' | 'approved' | 'rejected' | 'completed';

export interface FieldDiagnostics {
  missingFields: string[];
  weakFields: string[];
  sourceBackedFields: string[];
}

export interface ContentRepairPlan {
  sourceItemId: string;
  domain: Domain;
  sourceTitle: string;
  sourceQualityStatus: QualityStatus;
  repairAction: RepairAction;
  canonicalTargetId: string | null;
  canonicalTargetSection?: string;
  priority: RepairPriority;
  status: RepairStatus;
  reasons: string[];
  diagnostics: string[];
  evidence: string[];
  missingFields: string[];
  weakFields: string[];
  sourceBackedFields: string[];
  confidence: 'high' | 'medium' | 'low';
  requiresHumanReview: boolean;
  requiresExternalVerification: boolean;
}

// Standard structured scheme fields according to official banking exam syllabus
const SCHEME_FIELD_DEFINITIONS: { field: string; pattern: RegExp; minLen?: number }[] = [
  { field: 'nodalMinistry', pattern: /\b(ministry of|nodal ministry|administered by|m\/o|under the ministry)\b/i },
  { field: 'department', pattern: /\b(department of|nodal department|d\/o|division)\b/i },
  { field: 'launchYear', pattern: /\b(launched in|launched on|launch date|year of launch|started in|introduced in|\b20\d\d\b)\b/i },
  { field: 'keyObjectives', pattern: /\b(objective|aims to|purpose|goal|mandate|focus area)\b/i },
  { field: 'targetBeneficiaries', pattern: /\b(beneficiar|target group|eligible citizens|small and marginal farmers|women|sc\/st|artisans|unorganised)\b/i },
  { field: 'eligibilityCriteria', pattern: /\b(eligibility|criteria|qualification|age limit|income ceiling|landholding)\b/i },
  { field: 'financialOutlay', pattern: /\b(outlay|budget|fund|allocation|rs\.|₹|\bcrore\b|\blakh\b)\b/i },
  { field: 'fundingPattern', pattern: /\b(central sector|centrally sponsored|funding ratio|100% central|60:40|90:10|50:50)\b/i },
  { field: 'implementingAgency', pattern: /\b(implementing agency|nodal agency|nabard|sidbi|rbi|state government|gram panchayat|spv)\b/i },
  { field: 'keyBenefits', pattern: /\b(subsidy|assistance|incentive|pension|insurance|guarantee|loan|interest subvention)\b/i },
  { field: 'importantFeatures', pattern: /\b(key features|components|salient features|highlights|sub-mission)\b/i },
  { field: 'examRelevance', pattern: /\b(exam trap|mistake|remember|important note|key distinction|recent update)\b/i }
];

/**
 * Analyzes field-level completeness of an item without fabricating any information
 */
export function analyzeFieldDiagnostics(item: KnowledgeItem): FieldDiagnostics {
  const plainText = extractItemPlainText(item.blocks);
  const missingFields: string[] = [];
  const weakFields: string[] = [];
  const sourceBackedFields: string[] = [];

  for (const def of SCHEME_FIELD_DEFINITIONS) {
    if (def.pattern.test(plainText)) {
      // Check if it's merely a keyword or has substantive content
      const match = plainText.match(def.pattern);
      if (match && plainText.length > 200) {
        sourceBackedFields.push(def.field);
      } else {
        weakFields.push(def.field);
      }
    } else {
      missingFields.push(def.field);
    }
  }

  return {
    missingFields,
    weakFields,
    sourceBackedFields
  };
}

/**
 * Generates a deterministic, provenance-aware repair plan for a given corpus item
 */
export function generateContentRepairPlan(
  item: KnowledgeItem,
  quality: ContentQualityAssessment
): ContentRepairPlan {
  const plainText = extractItemPlainText(item.blocks);
  const fieldDiagnostics = analyzeFieldDiagnostics(item);
  const diagnostics: string[] = [];
  const evidence: string[] = [];

  let repairAction: RepairAction = 'retain';
  let priority: RepairPriority = 'P3';
  let canonicalTargetId: string | null = null;
  let canonicalTargetSection: string | undefined;
  let requiresHumanReview = false;
  let requiresExternalVerification = false;
  let confidence: 'high' | 'medium' | 'low' = quality.confidence;

  switch (quality.qualityStatus) {
    case 'artifact':
      repairAction = 'discard';
      priority = 'P3';
      requiresHumanReview = true;
      diagnostics.push('OCR debris or table of contents extraction trace; not a genuine study note.');
      evidence.push(`Found pattern: ${plainText.slice(0, 100)}`);
      break;

    case 'fragment':
      repairAction = quality.parentId ? 'merge' : 'verify';
      priority = 'P1';
      canonicalTargetId = quality.parentId || null;
      requiresHumanReview = true;
      diagnostics.push(
        quality.parentId
          ? `Structural fragment (orphan sub-heading) belonging to parent "${quality.parentTitle}" (${quality.parentId}).`
          : 'Structural fragment with ambiguous parent mapping requiring manual resolution.'
      );
      if (quality.parentId) {
        evidence.push(`Parent matched: ${quality.parentId} (${quality.parentTitle})`);
      }
      break;

    case 'superseded':
      repairAction = 'supersede';
      priority = 'P2';
      canonicalTargetId = quality.supersededBy || 'migrated-schemes-masterfile';
      canonicalTargetSection = quality.supersededTarget;
      requiresHumanReview = false;
      diagnostics.push(`Fully superseded by authoritative masterfile entry "${quality.supersededTarget}".`);
      evidence.push(`Target masterfile section: ${quality.supersededTarget}`);
      break;

    case 'needs_enrichment':
      repairAction = 'enrich';
      priority = 'P1';
      requiresHumanReview = true;
      requiresExternalVerification = true;
      diagnostics.push(
        `Legitimate standalone scheme note lacking ${fieldDiagnostics.missingFields.length} structured fields.`
      );
      evidence.push(`Existing length: ${plainText.length} chars. Present fields: ${fieldDiagnostics.sourceBackedFields.join(', ') || 'none'}.`);
      break;

    case 'thin':
      repairAction = 'enrich';
      priority = 'P3';
      requiresHumanReview = true;
      requiresExternalVerification = true;
      diagnostics.push(`Short study note (${plainText.length} chars) queued for pedagogical expansion.`);
      break;

    case 'valid':
    default:
      repairAction = 'retain';
      priority = 'P3';
      requiresHumanReview = false;
      diagnostics.push('Structurally intact, self-contained study note.');
      break;
  }

  return {
    sourceItemId: item.id,
    domain: item.domain,
    sourceTitle: item.title,
    sourceQualityStatus: quality.qualityStatus,
    repairAction,
    canonicalTargetId,
    canonicalTargetSection,
    priority,
    status: 'pending_review',
    reasons: quality.reasons,
    diagnostics,
    evidence,
    missingFields: fieldDiagnostics.missingFields,
    weakFields: fieldDiagnostics.weakFields,
    sourceBackedFields: fieldDiagnostics.sourceBackedFields,
    confidence,
    requiresHumanReview,
    requiresExternalVerification
  };
}

/**
 * Builds the complete corpus-wide repair manifest for all non-valid items
 */
export function buildRepairManifest(corpus: KnowledgeItem[]): {
  summary: {
    totalCorpus: number;
    validRetained: number;
    totalRepairsNeeded: number;
    byAction: Record<RepairAction, number>;
    byPriority: Record<RepairPriority, number>;
    schemesRepairsNeeded: number;
  };
  manifest: ContentRepairPlan[];
} {
  const manifest: ContentRepairPlan[] = [];

  const byAction: Record<RepairAction, number> = {
    retain: 0,
    supersede: 0,
    merge: 0,
    discard: 0,
    enrich: 0,
    verify: 0
  };

  const byPriority: Record<RepairPriority, number> = {
    P0: 0,
    P1: 0,
    P2: 0,
    P3: 0
  };

  let validRetained = 0;
  let schemesRepairsNeeded = 0;

  for (const item of corpus) {
    const quality = assessContentQuality(item, corpus);
    const plan = generateContentRepairPlan(item, quality);

    if (plan.repairAction === 'retain') {
      validRetained++;
    } else {
      manifest.push(plan);
      byAction[plan.repairAction]++;
      byPriority[plan.priority]++;
      if (item.domain === 'schemes') {
        schemesRepairsNeeded++;
      }
    }
  }

  return {
    summary: {
      totalCorpus: corpus.length,
      validRetained,
      totalRepairsNeeded: manifest.length,
      byAction,
      byPriority,
      schemesRepairsNeeded
    },
    manifest
  };
}
