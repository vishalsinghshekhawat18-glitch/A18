/**
 * Current Affairs Editorial Intelligence Specification (Gold-Standard Framework v3 - Revision 2)
 * Incorporating Study Utility Layer & Hard Opportunity Cost Test
 */

export type EditorialDecision = 
  | 'RETAIN_NEW'
  | 'MERGE_INTO_EXISTING'
  | 'CHRONOLOGICAL_UPDATE'
  | 'REDIRECT_DUPLICATE'
  | 'STATIC_ANCHOR_ONLY'
  | 'SKIP_LOW_YIELD'
  | 'SKIP_OBITUARY';

export interface WhySkippedAudit {
  skipReason: string;
  category: string;
  opportunityCostFailure: string;
  absorbedIntoOtherStory?: string;
}

export interface EditorialEvaluation {
  sourceId: string;
  sourceTitle: string;
  group: 'A_JANUARY_SOURCE' | 'B_DOWNSTREAM_UPDATE' | 'C_EXACT_DUPLICATE' | 'D_DOWNSTREAM_NOISE';
  decision: EditorialDecision;
  studyUtilityScore: number; // 0 to 100
  opportunityCostPassed: boolean;
  reason: string;
  targetSection: string;
  mergedTargetId?: string;
  parentStoryId?: string;
  staticAnchorsExtracted: string[];
  examTrapsIdentified: string[];
  whySkipped?: WhySkippedAudit;
  proposedNoteTitle?: string;
}
