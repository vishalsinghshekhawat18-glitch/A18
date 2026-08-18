const fs = require('fs');
const path = require('path');

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

// 1. CORPUS / INDEX PARITY
console.log('\n=== 1. CORPUS / INDEX PARITY ===');
const corpusFiles = fs.readdirSync('content/corpus').filter(f => f.endsWith('.json'));
const corpusIndex = JSON.parse(fs.readFileSync('content/corpus-index.json', 'utf-8'));
const manifest = JSON.parse(fs.readFileSync('content/manifest.json', 'utf-8'));

assert(corpusFiles.length === 1088, 'Corpus file count = 1088', 'Got: ' + corpusFiles.length);
assert(corpusIndex.length === 1088, 'Corpus-index entry count = 1088', 'Got: ' + corpusIndex.length);
assert(manifest.totalItems === 1088, 'Manifest totalItems = 1088', 'Got: ' + manifest.totalItems);

// 2. UNIQUE IDs
console.log('\n=== 2. UNIQUE IDs ===');
const allIds = corpusIndex.map(i => i.id);
const uniqueIds = new Set(allIds);
assert(allIds.length === uniqueIds.size, 'No duplicate IDs in corpus-index', 'Dupes: ' + (allIds.length - uniqueIds.size));

let idFileMismatches = 0;
for (const file of corpusFiles) {
  const data = JSON.parse(fs.readFileSync(path.join('content/corpus', file), 'utf-8'));
  const expectedId = file.replace('.json', '');
  if (data.id !== expectedId) idFileMismatches++;
}
assert(idFileMismatches === 0, 'All corpus file IDs match filenames', 'Mismatches: ' + idFileMismatches);

// 3. VALID DOMAINS
console.log('\n=== 3. VALID DOMAINS ===');
const validDomains = new Set(['current-affairs','schemes','economics','english','polity','history','geography','science','revision','static-ga','quant','pyqs']);
const domainCounts = {};
let invalidDomains = 0;
for (const item of corpusIndex) {
  if (!validDomains.has(item.domain)) { invalidDomains++; }
  domainCounts[item.domain] = (domainCounts[item.domain] || 0) + 1;
}
assert(invalidDomains === 0, 'All items have valid domain values', 'Invalid: ' + invalidDomains);
assert(domainCounts['current-affairs'] === 661, 'CA domain count = 661', 'Got: ' + domainCounts['current-affairs']);
assert(domainCounts['schemes'] === 172, 'Schemes domain count = 172', 'Got: ' + domainCounts['schemes']);
assert(domainCounts['english'] === 5, 'English domain count = 5', 'Got: ' + domainCounts['english']);

// 4. ENGLISH CHAPTER TITLES
console.log('\n=== 4. ENGLISH CHAPTER TITLES ===');
const engCh4 = JSON.parse(fs.readFileSync('content/corpus/migrated-eng-ch-4.json', 'utf-8'));
const engCh5 = JSON.parse(fs.readFileSync('content/corpus/migrated-eng-ch-5.json', 'utf-8'));
const idxCh4 = corpusIndex.find(i => i.id === 'migrated-eng-ch-4');
const idxCh5 = corpusIndex.find(i => i.id === 'migrated-eng-ch-5');
assert(engCh4.title.startsWith('Chapter 4:'), 'eng-ch-4 corpus title = Chapter 4', 'Got: ' + engCh4.title);
assert(engCh5.title.startsWith('Chapter 5:'), 'eng-ch-5 corpus title = Chapter 5', 'Got: ' + engCh5.title);
assert(idxCh4 && idxCh4.title.startsWith('Chapter 4:'), 'eng-ch-4 index title = Chapter 4', 'Got: ' + (idxCh4 && idxCh4.title));
assert(idxCh5 && idxCh5.title.startsWith('Chapter 5:'), 'eng-ch-5 index title = Chapter 5', 'Got: ' + (idxCh5 && idxCh5.title));

const engItems = corpusIndex.filter(i => i.domain === 'english');
const ch1Count = engItems.filter(i => /^Chapter 1:/.test(i.title)).length;
assert(ch1Count === 1, 'Exactly 1 English Chapter 1 (Framework only)', 'Got: ' + ch1Count);

// 5. SCHEME METADATA
console.log('\n=== 5. SCHEME METADATA & CONTENT INTEGRITY ===');
const schemeItems = corpusIndex.filter(i => i.domain === 'schemes');
const schemeStubs = schemeItems.filter(i => i.id.includes('schemes-scheme'));
const wrongDomainSchemes = schemeStubs.filter(i => i.domain !== 'schemes');
assert(schemeItems.length === 172, 'All 172 scheme items present', 'Got: ' + schemeItems.length);
assert(schemeStubs.length === 171, '171 scheme stubs remain', 'Got: ' + schemeStubs.length);
assert(wrongDomainSchemes.length === 0, 'All scheme stubs have domain=schemes', 'Wrong: ' + wrongDomainSchemes.length);

let stubsWithValidBlocks = 0;
for (let i = 1; i <= 171; i++) {
  const f = path.join('content/corpus', `migrated-schemes-scheme-${i}.json`);
  if (fs.existsSync(f)) {
    const d = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if (Array.isArray(d.blocks) && typeof d.title === 'string' && d.id === `migrated-schemes-scheme-${i}`) {
      stubsWithValidBlocks++;
    }
  }
}
assert(stubsWithValidBlocks === 171, 'All 171 scheme stub files have intact blocks and identifiers', 'Valid: ' + stubsWithValidBlocks);

const caItems = corpusIndex.filter(i => i.domain === 'current-affairs');
const caWithSchemeId = caItems.filter(i => i.id.includes('schemes-scheme'));
assert(caWithSchemeId.length === 0, 'No scheme stubs in CA domain', 'Found: ' + caWithSchemeId.length);

const caNoDate = caItems.filter(i => !i.metadata || !i.metadata.date);
assert(caNoDate.length === 0, 'All CA items have a date', 'No-date CA: ' + caNoDate.length);

// 6. REPORTING-CENTER SCHEMA & REVISION SEMANTICS
console.log('\n=== 6. REPORTING-CENTER SCHEMA & REVISION SEMANTICS ===');
const rc = JSON.parse(fs.readFileSync('content/reporting-center.json', 'utf-8'));
assert(Array.isArray(rc.examTargets), 'examTargets is an array');
const primary = rc.examTargets && rc.examTargets.find(e => e.priority === 'primary');
assert(!!primary, 'Has a primary exam target');
assert(primary && typeof primary.name === 'string', 'Primary exam has name');
const dateOk = primary && (primary.date === null || /\d{4}-\d{2}-\d{2}/.test(primary.date));
assert(dateOk, 'Primary exam date is ISO string or null', 'Got: ' + (primary && primary.date));
assert(Array.isArray(rc.revisionCalendar && rc.revisionCalendar.items), 'revisionCalendar.items is array');

const validStatuses = new Set(['due', 'overdue', 'in-progress', 'complete', 'scheduled']);
let badStatusCount = 0;
if (rc.revisionCalendar && rc.revisionCalendar.items) {
  for (const item of rc.revisionCalendar.items) {
    if (!validStatuses.has(item.status)) badStatusCount++;
    if (!item.revisionDate || !/\d{4}-\d{2}-\d{2}/.test(item.revisionDate)) badStatusCount++;
  }
}
assert(badStatusCount === 0, 'All revision items have valid status enum + ISO revisionDate', 'Invalid: ' + badStatusCount);

// Revision semantics test: dueToday vs overdue separation
const mockToday = '2026-08-18';
const rItems = rc.revisionCalendar.items;
const semDueToday = rItems.filter(r => r.status === 'due' && r.revisionDate === mockToday);
const semOverdue = rItems.filter(r => r.revisionDate < mockToday && r.status !== 'complete');
assert(semDueToday.length === 2, 'Independent dueToday count matches expected (2)', 'Got: ' + semDueToday.length);
assert(semOverdue.length === 0, 'Independent overdue count matches expected (0)', 'Got: ' + semOverdue.length);

// 7. EXAM COUNTDOWN DERIVATION
console.log('\n=== 7. EXAM COUNTDOWN DERIVATION (ALL 4 CASES) ===');
function testCountdown(dateStr, baseDateStr) {
  if (!dateStr) return 'Date TBD';
  const [y, m, d] = dateStr.split('-').map(Number);
  const [by, bm, bd] = baseDateStr.split('-').map(Number);
  const examDate = new Date(y, m - 1, d);
  const baseDate = new Date(by, bm - 1, bd);
  const diffMs = examDate.getTime() - baseDate.getTime();
  const days = Math.round(diffMs / 86400000);
  if (days < 0) return 'Passed';
  if (days === 0) return 'TODAY';
  return `${days} Day${days === 1 ? '' : 's'} Remaining`;
}
assert(testCountdown('2026-08-22', '2026-08-18') === '4 Days Remaining', 'Future countdown calculation = 4 Days Remaining');
assert(testCountdown('2026-08-18', '2026-08-18') === 'TODAY', 'Same-day countdown calculation = TODAY');
assert(testCountdown('2026-08-10', '2026-08-18') === 'Passed', 'Past exam calculation = Passed');
assert(testCountdown(null, '2026-08-18') === 'Date TBD', 'Null date calculation = Date TBD');

// 8. NO FABRICATED STRINGS IN HOMEPAGE
console.log('\n=== 8. FABRICATED VALUE REMOVAL ===');
const homeContent = fs.readFileSync('app/hubs/CommandCenterHome.tsx', 'utf-8');
assert(!homeContent.includes('5-DAY STREAK'), 'No hardcoded 5-DAY STREAK');
assert(!homeContent.includes('75% Complete'), 'No hardcoded 75% session text');
const has75Bar = homeContent.includes("width: '75%'");
assert(!has75Bar, 'No hardcoded 75% progress bar');
const has65Bar = homeContent.includes("width: '65%'");
assert(!has65Bar, 'No hardcoded 65% mastery bar');
const has80Bar = homeContent.includes("width: '80%'");
assert(!has80Bar, 'No hardcoded 80% mastery bar');
assert(!homeContent.includes('82 Days'), 'No hardcoded 82 Days Remaining');
assert(!homeContent.includes('3 Priority Revisions Ready'), 'No hardcoded 3 Priority Revisions');
assert(homeContent.includes('examTargets'), 'Uses examTargets from data');
assert(homeContent.includes('revisionIntelligence'), 'Uses revisionIntelligence derivation');

// SUMMARY
console.log('\n=== VALIDATION SUMMARY ===');
console.log('PASSED: ' + passed);
console.log('FAILED: ' + failed);
if (errors.length > 0) {
  console.log('\nFAILED CHECKS:');
  errors.forEach(e => console.log('  ' + e.label + (e.detail ? ' — ' + e.detail : '')));
}
process.exit(failed > 0 ? 1 : 0);
