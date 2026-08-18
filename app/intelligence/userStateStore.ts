import { useState, useEffect } from 'react';
import { UserStudyState, INITIAL_USER_STUDY_STATE } from './types';

export const USER_STATE_STORAGE_KEY = 'bcc_study_state_v1';
export const LEGACY_LAST_ITEM_KEY = 'bcc_last_opened_item';
const STATE_CHANGE_EVENT = 'bcc_user_state_change';

/**
 * Gets the current local calendar date formatted as YYYY-MM-DD
 */
export function getLocalTodayDateString(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Safely reads and validates the user study state from localStorage.
 * Automatically recovers from invalid or corrupted JSON by falling back to initial state.
 */
export function loadUserStudyState(): UserStudyState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ...INITIAL_USER_STUDY_STATE };
  }

  try {
    const raw = window.localStorage.getItem(USER_STATE_STORAGE_KEY);
    if (!raw) {
      // Check legacy single-item key for seamless backward migration
      const legacyItemId = window.localStorage.getItem(LEGACY_LAST_ITEM_KEY);
      if (legacyItemId) {
        const migrated: UserStudyState = {
          ...INITIAL_USER_STUDY_STATE,
          lastOpenedItemId: legacyItemId
        };
        saveUserStudyState(migrated);
        return migrated;
      }
      return { ...INITIAL_USER_STUDY_STATE };
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ...INITIAL_USER_STUDY_STATE };
    }

    // Validate structural schema integrity
    const validCompleted = (parsed.completedItemIds && typeof parsed.completedItemIds === 'object')
      ? parsed.completedItemIds
      : {};

    const validActivity = (parsed.activityHistory && typeof parsed.activityHistory === 'object')
      ? parsed.activityHistory
      : {};

    return {
      version: '1.0.0',
      lastOpenedItemId: typeof parsed.lastOpenedItemId === 'string' ? parsed.lastOpenedItemId : null,
      completedItemIds: validCompleted,
      activityHistory: validActivity
    };
  } catch (err) {
    console.warn('[userStateStore] Corrupted study state in storage, falling back to initial empty state:', err);
    return { ...INITIAL_USER_STUDY_STATE };
  }
}

/**
 * Persists the user study state to localStorage and dispatches a change event.
 */
export function saveUserStudyState(state: UserStudyState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    window.localStorage.setItem(USER_STATE_STORAGE_KEY, JSON.stringify(state));
    // Keep legacy key synced for backward compatibility
    if (state.lastOpenedItemId) {
      window.localStorage.setItem(LEGACY_LAST_ITEM_KEY, state.lastOpenedItemId);
    }
    window.dispatchEvent(new Event(STATE_CHANGE_EVENT));
  } catch (err) {
    console.error('[userStateStore] Failed to persist user study state:', err);
  }
}

/**
 * Records an active view on an item.
 * NOTE: Merely opening an item records view activity, but DOES NOT mark it as completed.
 */
export function recordItemView(itemId: string, date: Date = new Date()): UserStudyState {
  const state = loadUserStudyState();
  const todayStr = getLocalTodayDateString(date);

  const currentDayActivity = state.activityHistory[todayStr] || {
    date: todayStr,
    itemsViewed: []
  };

  const existingItems = new Set(currentDayActivity.itemsViewed || []);
  existingItems.add(itemId);

  const updated: UserStudyState = {
    ...state,
    lastOpenedItemId: itemId,
    activityHistory: {
      ...state.activityHistory,
      [todayStr]: {
        date: todayStr,
        itemsViewed: Array.from(existingItems)
      }
    }
  };

  saveUserStudyState(updated);
  return updated;
}

/**
 * Toggles the explicit completion state of a knowledge item.
 * Returns true if newly marked as completed, false if unmarked.
 */
export function toggleItemCompletion(itemId: string, timestamp: Date = new Date()): boolean {
  const state = loadUserStudyState();
  const isCurrentlyCompleted = Boolean(state.completedItemIds[itemId]);

  const updatedCompleted = { ...state.completedItemIds };
  let isNowCompleted: boolean;

  if (isCurrentlyCompleted) {
    delete updatedCompleted[itemId];
    isNowCompleted = false;
  } else {
    updatedCompleted[itemId] = timestamp.toISOString();
    isNowCompleted = true;
  }

  const updated: UserStudyState = {
    ...state,
    completedItemIds: updatedCompleted
  };

  saveUserStudyState(updated);
  return isNowCompleted;
}

/**
 * Checks if a given item is explicitly marked completed by the user.
 */
export function isItemCompleted(itemId: string): boolean {
  const state = loadUserStudyState();
  return Boolean(state.completedItemIds[itemId]);
}

/**
 * React hook to subscribe to real-time user study state updates across components.
 */
export function useUserStudyState(): {
  state: UserStudyState;
  isCompleted: (itemId: string) => boolean;
  toggleCompletion: (itemId: string) => boolean;
  recordView: (itemId: string) => void;
} {
  const [state, setState] = useState<UserStudyState>(loadUserStudyState);

  useEffect(() => {
    const handleUpdate = () => {
      setState(loadUserStudyState());
    };

    window.addEventListener(STATE_CHANGE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(STATE_CHANGE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    state,
    isCompleted: (itemId: string) => Boolean(state.completedItemIds[itemId]),
    toggleCompletion: (itemId: string) => toggleItemCompletion(itemId),
    recordView: (itemId: string) => { recordItemView(itemId); }
  };
}
