/**
 * R5 General Current Affairs Intelligence Engine — Types & Schemas
 * Three-Level Knowledge Architecture: SourceRecord -> Story -> KnowledgeNode
 */

export type SourceType = 'PDF' | 'RAW_TEXT' | 'OCR_DOCUMENT' | 'STRUCTURED_JSON' | 'NEWS_FEED';

export type QualityState = 
  | 'VALID'
  | 'NEEDS_REVIEW'
  | 'SOURCE_CONFLICT'
  | 'INCOMPLETE'
  | 'SUPERSEDED'
  | 'DUPLICATE'
  | 'UPDATE'
  | 'MERGED'
  | 'SKIPPED';

export type StoryRelationshipType = 
  | 'SAME_STORY'
  | 'CHRONOLOGICAL_UPDATE'
  | 'MERGE_SUB_POLICY'
  | 'RELATED_CONCEPT'
  | 'DISTINCT_EVENT'
  | 'CROSS_DOMAIN_LINK';

export interface SourceRecord {
  sourceId: string;
  sourceType: SourceType;
  rawText: string;
  provenance: {
    origin: string;
    location?: string;
    ingestionTimestamp: string;
    confidence: number;
  };
}

export interface ExtractedClaim {
  claimId: string;
  sourceId: string;
  entity: string;
  normalizedEntity: string;
  action: string;
  numericValues: Array<{
    value: number | string;
    unit?: string;
    context: string;
  }>;
  dates: Array<{
    dateStr: string;
    type: 'ANNOUNCEMENT' | 'IMPLEMENTATION' | 'DEADLINE' | 'PERIOD';
  }>;
  category: 'REGULATORY' | 'MACRO' | 'BANKING' | 'SCHEME' | 'APPOINTMENT' | 'INDEX' | 'DEFENCE' | 'SPORTS' | 'GENERAL';
  rawSnippet: string;
}

export interface SourceConflict {
  field: string;
  claimA: { sourceId: string; value: string | number };
  claimB: { sourceId: string; value: string | number };
  conflictType: 'NUMERICAL_DISCREPANCY' | 'DATE_MISMATCH' | 'METHODOLOGICAL_DIFFERENCE';
  resolution?: string;
}

export interface Story {
  storyId: string;
  canonicalTitle: string;
  entities: string[];
  claims: ExtractedClaim[];
  sourceIds: string[];
  temporalPhase: 'ANNOUNCEMENT' | 'IMPLEMENTATION' | 'AMENDMENT' | 'OUTCOME' | 'STANDING';
  conflicts: SourceConflict[];
  parentStoryId?: string;
  relationshipToParent?: StoryRelationshipType;
  studyUtilityScore: number;
}

export interface KnowledgeNode {
  nodeId: string;
  title: string;
  category: string;
  tier: 'TIER_A' | 'TIER_B_PLUS' | 'REDIRECT' | 'UPDATE' | 'MERGE' | 'SKIP';
  qualityState: QualityState;
  summary: string;
  keyFacts: string[];
  staticGK?: {
    anchorEntity: string;
    details: string;
  };
  examAngle?: string;
  interviewQuestion?: string;
  provenanceSources: string[];
  storyId: string;
  parentStoryId?: string;
  redirectTargetId?: string;
  absorbedFacts: string[];
  relationships: Array<{
    targetNodeId: string;
    type: string;
    reason: string;
  }>;
}
