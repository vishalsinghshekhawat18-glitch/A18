/**
 * R4.1 User Study State & Intelligence Data Types
 * Local-First Canonical State Model
 */

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD (local calendar date)
  itemsViewed: string[]; // Set of unique item IDs opened on this date
}

export interface UserStudyState {
  version: '1.0.0';
  lastOpenedItemId: string | null;
  /**
   * Map of completed item ID -> ISO completion timestamp
   */
  completedItemIds: Record<string, string>;
  /**
   * Map of YYYY-MM-DD -> daily activity record
   */
  activityHistory: Record<string, DailyActivityRecord>;
}

export const INITIAL_USER_STUDY_STATE: UserStudyState = {
  version: '1.0.0',
  lastOpenedItemId: null,
  completedItemIds: {},
  activityHistory: {}
};
