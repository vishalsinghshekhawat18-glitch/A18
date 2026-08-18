/**
 * Automated Test Suite for R4.1 & R4.2 User Study State, Activity Semantics, and Real Coverage Engine
 */

let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, label, detail) {
  if (condition) {
    passed++;
    console.log('  PASS: ' + label);
  } else {
    failed++;
    errors.push({ label, detail });
    console.log('  FAIL: ' + label + (detail ? ' — ' + detail : ''));
  }
}

// Mock localStorage and window environment for Node.js
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();
global.window = {
  localStorage: mockStorage,
  dispatchEvent: () => {}
};

const USER_STATE_STORAGE_KEY = 'bcc_study_state_v1';
const LEGACY_LAST_ITEM_KEY = 'bcc_last_opened_item';

function getLocalTodayDateString(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const INITIAL_USER_STUDY_STATE = {
  version: '1.0.0',
  lastOpenedItemId: null,
  completedItemIds: {},
  activityHistory: {}
};

function loadUserStudyState() {
  if (!global.window || !global.window.localStorage) {
    return { ...INITIAL_USER_STUDY_STATE };
  }
  try {
    const raw = global.window.localStorage.getItem(USER_STATE_STORAGE_KEY);
    if (!raw) {
      const legacyItemId = global.window.localStorage.getItem(LEGACY_LAST_ITEM_KEY);
      if (legacyItemId) {
        const migrated = {
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
    return { ...INITIAL_USER_STUDY_STATE };
  }
}

function saveUserStudyState(state) {
  if (!global.window || !global.window.localStorage) return;
  global.window.localStorage.setItem(USER_STATE_STORAGE_KEY, JSON.stringify(state));
  if (state.lastOpenedItemId) {
    global.window.localStorage.setItem(LEGACY_LAST_ITEM_KEY, state.lastOpenedItemId);
  }
}

function recordItemView(itemId, date = new Date()) {
  const state = loadUserStudyState();
  const todayStr = getLocalTodayDateString(date);
  const currentDayActivity = state.activityHistory[todayStr] || {
    date: todayStr,
    itemsViewed: []
  };
  const existingItems = new Set(currentDayActivity.itemsViewed || []);
  existingItems.add(itemId);
  const updated = {
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

function toggleItemCompletion(itemId, timestamp = new Date()) {
  const state = loadUserStudyState();
  const isCurrentlyCompleted = Boolean(state.completedItemIds[itemId]);
  const updatedCompleted = { ...state.completedItemIds };
  let isNowCompleted;
  if (isCurrentlyCompleted) {
    delete updatedCompleted[itemId];
    isNowCompleted = false;
  } else {
    updatedCompleted[itemId] = timestamp.toISOString();
    isNowCompleted = true;
  }
  const updated = {
    ...state,
    completedItemIds: updatedCompleted
  };
  saveUserStudyState(updated);
  return isNowCompleted;
}

function isItemCompleted(itemId) {
  const state = loadUserStudyState();
  return Boolean(state.completedItemIds[itemId]);
}

// Pure coverage function
function computeSubjectCoverage(items, subjectId, completedItemIds = {}) {
  const subjectItems = items.filter(i => {
    if (subjectId === 'economics') return i.domain === 'economics' || i.id.includes('eco-ch');
    if (subjectId === 'english') return i.domain === 'english' || i.id.includes('eng-ch');
    if (subjectId === 'polity') return i.domain === 'polity' || i.id.includes('pol-ch');
    if (subjectId === 'current-affairs') return i.domain === 'current-affairs' && !i.id.includes('scheme');
    if (subjectId === 'schemes') return i.id.includes('scheme');
    return i.domain === subjectId;
  });
  const totalCount = subjectItems.length;
  const completedCount = subjectItems.filter(i => Boolean(completedItemIds[i.id])).length;
  const coveragePct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  return { subjectId, totalCount, completedCount, coveragePct };
}

// ============================================
// TEST SUITE
// ============================================

console.log('\n=== TEST 1: INITIAL EMPTY STATE ===');
mockStorage.clear();
const s1 = loadUserStudyState();
assert(s1.version === '1.0.0', 'State schema version is 1.0.0');
assert(s1.lastOpenedItemId === null, 'Initial lastOpenedItemId is null');
assert(Object.keys(s1.completedItemIds).length === 0, 'Initial completedItemIds is empty object');
assert(Object.keys(s1.activityHistory).length === 0, 'Initial activityHistory is empty object');

console.log('\n=== TEST 2: RECORDING ACTIVITY & AUDIT SEMANTICS ===');
mockStorage.clear();
const testDate = new Date('2026-08-18T10:00:00Z');
recordItemView('migrated-core-eco-ch-1', testDate);

const s2 = loadUserStudyState();
assert(s2.lastOpenedItemId === 'migrated-core-eco-ch-1', 'lastOpenedItemId updated on view');
assert(!isItemCompleted('migrated-core-eco-ch-1'), 'ACTIVITY AUDIT: Merely opening item does NOT mark it complete');
assert(!('timeSpentSeconds' in s2), 'ACTIVITY AUDIT: Opening item does not invent study time');
const dateKey = getLocalTodayDateString(testDate);
assert(Boolean(s2.activityHistory[dateKey]), 'Daily activity entry created for target date');
assert(s2.activityHistory[dateKey]?.itemsViewed.includes('migrated-core-eco-ch-1'), 'Viewed item included in daily activity log');

console.log('\n=== TEST 3: EXPLICIT ITEM COMPLETION & TOGGLE ===');
const completedTimestamp = new Date('2026-08-18T11:00:00Z');
const resComplete = toggleItemCompletion('migrated-core-eco-ch-1', completedTimestamp);
assert(resComplete === true, 'toggleItemCompletion returns true when completing unread item');
assert(isItemCompleted('migrated-core-eco-ch-1') === true, 'isItemCompleted confirms completion');

const s3 = loadUserStudyState();
assert(s3.completedItemIds['migrated-core-eco-ch-1'] === completedTimestamp.toISOString(), 'Completion timestamp accurately recorded');

// Toggle back to uncompleted
const resUncomplete = toggleItemCompletion('migrated-core-eco-ch-1');
assert(resUncomplete === false, 'toggleItemCompletion returns false when toggling off');
assert(isItemCompleted('migrated-core-eco-ch-1') === false, 'isItemCompleted returns false after unmarking');

console.log('\n=== TEST 4: REOPENING COMPLETED ITEM ===');
toggleItemCompletion('migrated-core-eco-ch-1', completedTimestamp);
assert(isItemCompleted('migrated-core-eco-ch-1') === true, 'Item is marked complete');

recordItemView('migrated-core-eco-ch-1', testDate);
const s4 = loadUserStudyState();
assert(isItemCompleted('migrated-core-eco-ch-1') === true, 'Reopening completed item preserves completion status');
assert(s4.lastOpenedItemId === 'migrated-core-eco-ch-1', 'lastOpenedItemId remains synced');

console.log('\n=== TEST 5: REAL SUBJECT COVERAGE ENGINE (R4.2) ===');
const mockCorpus = [
  { id: 'migrated-core-eco-ch-1', domain: 'economics' },
  { id: 'migrated-core-eco-ch-2', domain: 'economics' },
  { id: 'migrated-core-eco-ch-3', domain: 'economics' },
  { id: 'migrated-core-eco-ch-4', domain: 'economics' },
  { id: 'migrated-eng-ch-1', domain: 'english' },
  { id: 'migrated-eng-ch-2', domain: 'english' }
];

// Zero-data state for subject coverage
const zeroEco = computeSubjectCoverage(mockCorpus, 'economics', {});
assert(zeroEco.totalCount === 4, 'Zero state: Total economics items = 4');
assert(zeroEco.completedCount === 0, 'Zero state: Completed economics items = 0');
assert(zeroEco.coveragePct === 0, 'Zero state: Coverage percentage = 0%');

// Partial coverage
const partialEco = computeSubjectCoverage(mockCorpus, 'economics', {
  'migrated-core-eco-ch-1': '2026-08-18T10:00:00Z',
  'migrated-core-eco-ch-2': '2026-08-18T11:00:00Z'
});
assert(partialEco.completedCount === 2, 'Partial state: Completed count = 2');
assert(partialEco.coveragePct === 50, 'Partial state: Coverage = 50%');

// Full coverage
const fullEng = computeSubjectCoverage(mockCorpus, 'english', {
  'migrated-eng-ch-1': '2026-08-18T10:00:00Z',
  'migrated-eng-ch-2': '2026-08-18T11:00:00Z'
});
assert(fullEng.completedCount === 2, 'Full state: Completed count = 2');
assert(fullEng.coveragePct === 100, 'Full state: Coverage = 100%');

console.log('\n=== TEST 6: CANONICAL CORPUS ZERO-DATA STATE VERIFICATION ===');
const fs = require('fs');
const path = require('path');
const actualCorpus = JSON.parse(fs.readFileSync('content/corpus-index.json', 'utf-8'));

const subjects = ['economics', 'english', 'polity', 'current-affairs', 'schemes'];
subjects.forEach(sub => {
  const cov = computeSubjectCoverage(actualCorpus, sub, {});
  assert(cov.completedCount === 0, `Zero completed for ${sub} with empty storage`);
  assert(cov.coveragePct === 0, `0% coverage for ${sub} with empty storage`);
  assert(cov.totalCount > 0, `Valid total count for ${sub} (${cov.totalCount})`);
});

console.log('\n=== TEST 7: PERSISTENCE & CORRUPTED STORAGE FALLBACK ===');
mockStorage.clear();
mockStorage.setItem(USER_STATE_STORAGE_KEY, 'CORRUPTED_JSON_DATA');
const fallback = loadUserStudyState();
assert(fallback.version === '1.0.0', 'Corrupted storage safely falls back to valid version');
assert(Object.keys(fallback.completedItemIds).length === 0, 'Corrupted storage falls back to empty completions');

// SUMMARY
console.log('\n=== USER STATE & COVERAGE VALIDATION SUMMARY ===');
console.log('PASSED: ' + passed);
console.log('FAILED: ' + failed);
if (errors.length > 0) {
  console.log('\nFAILED CHECKS:');
  errors.forEach(e => console.log('  ' + e.label + (e.detail ? ' — ' + e.detail : '')));
}
process.exit(failed > 0 ? 1 : 0);
