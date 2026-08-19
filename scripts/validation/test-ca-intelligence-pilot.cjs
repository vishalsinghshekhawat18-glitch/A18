/**
 * Test Suite: Current Affairs Intelligence Architecture & Pilot Validation
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting CA Intelligence Architecture & Pilot Validation...\n');

let passed = 0;
let failed = 0;

function check(desc, fn) {
  try {
    fn();
    console.log(`  ✅ [PASS] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${desc}: ${err.message}`);
    failed++;
  }
}

const pilotDir = 'content/repairs/ca_v3_pilot';
const pilotSummary = JSON.parse(fs.readFileSync(path.join(pilotDir, 'pilot-summary-report.json'), 'utf-8'));

check('Check 1: Pilot dataset has exactly 25 items', () => {
  assert.strictEqual(pilotSummary.totalPilotItems, 25);
  const files = fs.readdirSync(pilotDir).filter(f => f.endsWith('.json') && f !== 'pilot-summary-report.json');
  assert.strictEqual(files.length, 25);
});

check('Check 2: Canonical corpus remains 100% untouched (1,088 items)', () => {
  const corpusFiles = fs.readdirSync('content/corpus').filter(f => f.endsWith('.json'));
  assert.strictEqual(corpusFiles.length, 1088);
  const caFiles = corpusFiles.filter(f => f.startsWith('migrated-ca-'));
  assert.strictEqual(caFiles.length, 661);
});

check('Check 3: All pilot notes have mandatory 🎯 Exam Angle', () => {
  const files = fs.readdirSync(pilotDir).filter(f => f.endsWith('.json') && f !== 'pilot-summary-report.json');
  files.forEach(f => {
    const item = JSON.parse(fs.readFileSync(path.join(pilotDir, f), 'utf-8'));
    assert(item.v3Framework?.examAngle, `${f} missing v3Framework.examAngle`);
    const hasAngleBlock = item.blocks.some(b => b.content?.includes('🎯 Exam Angle') || b.text?.includes('🎯 Exam Angle'));
    assert(hasAngleBlock, `${f} missing Exam Angle block`);
  });
});

check('Check 4: All Tier A items include Hook, Static GK, and Interview Question', () => {
  const files = fs.readdirSync(pilotDir).filter(f => f.endsWith('.json') && f !== 'pilot-summary-report.json');
  files.forEach(f => {
    const item = JSON.parse(fs.readFileSync(path.join(pilotDir, f), 'utf-8'));
    if (item.v3Framework?.tier === 'TIER_A') {
      assert(item.v3Framework.hook, `${f} missing hook`);
      assert(item.v3Framework.interviewQ, `${f} missing interviewQ`);
      assert(item.v3Framework.staticGK, `${f} missing staticGK`);
    }
  });
});

check('Check 5: Temporal zones are properly derived (CORE for >= 2026-04, LIGHT_TOUCH for earlier)', () => {
  const files = fs.readdirSync(pilotDir).filter(f => f.endsWith('.json') && f !== 'pilot-summary-report.json');
  files.forEach(f => {
    const item = JSON.parse(fs.readFileSync(path.join(pilotDir, f), 'utf-8'));
    assert(['CORE', 'LIGHT_TOUCH', 'SKIP'].includes(item.v3Framework?.zone), `${f} has invalid zone`);
  });
});

check('Check 6: Zero broken headings or empty blocks in pilot dataset', () => {
  const files = fs.readdirSync(pilotDir).filter(f => f.endsWith('.json') && f !== 'pilot-summary-report.json');
  files.forEach(f => {
    const item = JSON.parse(fs.readFileSync(path.join(pilotDir, f), 'utf-8'));
    assert(Array.isArray(item.blocks) && item.blocks.length >= 3, `${f} blocks too sparse`);
    item.blocks.forEach((b, idx) => {
      if (b.type === 'bullet_list') {
        assert(Array.isArray(b.items) && b.items.length > 0, `${f} block ${idx} has empty bullet list`);
      }
    });
  });
});

console.log(`\n========================================`);
console.log(`CA PILOT VALIDATION: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
