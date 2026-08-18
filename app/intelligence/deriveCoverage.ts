import { KnowledgeItem } from '../../schema/knowledge-item';
import { isItemInSubject } from '../navigation/subjectMapper';

export interface SubjectCoverage {
  subjectId: string;
  totalCount: number;
  completedCount: number;
  coveragePct: number;
}

/**
 * Pure function to calculate genuine subject coverage from completed item IDs
 * NOTE: This represents completion/coverage ONLY, never mastery.
 */
export function computeSubjectCoverage(
  items: KnowledgeItem[],
  subjectId: string,
  completedItemIds: Record<string, string> = {}
): SubjectCoverage {
  const subjectItems = items.filter(i => isItemInSubject(i, subjectId));
  const totalCount = subjectItems.length;
  const completedCount = subjectItems.filter(i => Boolean(completedItemIds[i.id])).length;
  const coveragePct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    subjectId,
    totalCount,
    completedCount,
    coveragePct
  };
}

/**
 * Pure function to calculate global corpus completion coverage
 */
export function computeGlobalCoverage(
  totalCorpusItems: number,
  completedItemIds: Record<string, string> = {}
): { totalCount: number; completedCount: number; coveragePct: number } {
  const completedCount = Object.keys(completedItemIds).length;
  const coveragePct = totalCorpusItems > 0 ? Math.round((completedCount / totalCorpusItems) * 100) : 0;

  return {
    totalCount: totalCorpusItems,
    completedCount,
    coveragePct
  };
}
