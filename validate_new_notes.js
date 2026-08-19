/**
 * validate_new_notes.js
 *
 * Purpose: Gatekeeper script for CA_NOTES_DATA ingestion.
 * The agent MUST run this on every batch of candidate notes BEFORE
 * appending anything to data.js. Anything that fails is skipped and
 * reported — never auto-fixed, never silently dropped.
 *
 * Usage:
 *   node validate_new_notes.js <path-to-existing-data.js> <path-to-candidates.json>
 *
 * Where candidates.json is an array of candidate CANote objects
 * (same shape as CA_NOTES_DATA entries) that the agent wants to add.
 *
 * Output:
 *   - Prints a report to stdout: ACCEPTED / FLAGGED with reasons.
 *   - Writes accepted.json (safe to append) and flagged.json (needs human review).
 *   - Exits non-zero if anything was flagged, so the agent can't silently proceed.
 */

const fs = require('fs');
const path = require('path');

// ---------- CONFIG ----------
const REQUIRED_FIELDS = ['id', 'title', 'date', 'secId', 'bullets'];
const TITLE_SIMILARITY_THRESHOLD = 0.90; // 90% similarity = treat as duplicate
const MAX_TOPICS_PER_BULLET = 1; // heuristic ceiling

// ---------- HELPERS ----------

function normalizeTitle(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s]/g, '')   // strip punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

// Simple Levenshtein-based similarity ratio (0..1)
function similarity(a, b) {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;

  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  const dist = dp[m][n];
  const maxLen = Math.max(m, n);
  return 1 - dist / maxLen;
}

// Heuristic: does a bullet string appear to mash together multiple unrelated
// facts/topics? We flag on:
//  - multiple sentences AND multiple distinct capitalized entity clusters
//  - explicit separators sometimes left by bad parsing ("|", " -- ", ";;")
//  - presence of 2+ distinct numeric/currency/percentage clusters far apart
//    in unrelated sentence contexts (weak signal, used only to raise flag,
//    not to auto-split)
function looksLikeMashup(bullet) {
  const text = String(bullet);

  // Hard separator artifacts from bad parsing
  if (/(\s\|\s|;;|\s--\s{2,})/.test(text)) return { mashup: true, reason: 'explicit separator artifact found' };

  // Split into sentences
  const sentences = text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length <= MAX_TOPICS_PER_BULLET) {
    return { mashup: false };
  }

  // Rough distinct-entity heuristic: count sentences that start with a
  // capitalized proper-noun-like token different from the first sentence's.
  const leadTokens = sentences.map(s => (s.match(/^[A-Z][A-Za-z0-9&.]+/) || [''])[0]);
  const distinctLeads = new Set(leadTokens.filter(Boolean));

  if (sentences.length >= 2 && distinctLeads.size >= 2) {
    return {
      mashup: true,
      reason: `bullet contains ${sentences.length} sentences with ${distinctLeads.size} distinct subjects (${[...distinctLeads].join(', ')})`
    };
  }

  return { mashup: false };
}

function loadExistingTitles(dataJsPath) {
  const raw = fs.readFileSync(dataJsPath, 'utf8');

  // data.js defines something like: const CA_NOTES_DATA = [ {...}, {...} ];
  // We avoid a full JS parse dependency by extracting the array literal
  // and evaluating it in an isolated Function scope (safe enough for a
  // trusted local build file — do not run on untrusted input).
  const match = raw.match(/CA_NOTES_DATA\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error('Could not locate CA_NOTES_DATA array in ' + dataJsPath);
  }
  const arr = new Function(`return ${match[1]};`)();
  return arr.map(n => ({ id: n.id, title: n.title, normalized: normalizeTitle(n.title || '') }));
}

// ---------- MAIN ----------

function main() {
  const [, , dataJsPath, candidatesPath] = process.argv;

  if (!dataJsPath || !candidatesPath) {
    console.error('Usage: node validate_new_notes.js <data.js path> <candidates.json path>');
    process.exit(2);
  }

  const existing = loadExistingTitles(path.resolve(dataJsPath));
  const candidates = JSON.parse(fs.readFileSync(path.resolve(candidatesPath), 'utf8'));

  if (!Array.isArray(candidates)) {
    console.error('candidates.json must contain a JSON array of CANote objects.');
    process.exit(2);
  }

  const accepted = [];
  const flagged = [];

  // Track normalized titles already seen within this batch too, so
  // duplicates WITHIN the same ingestion batch are also caught.
  const seenThisBatch = new Set();

  candidates.forEach((note, idx) => {
    const issues = [];

    // 1. Required fields
    for (const field of REQUIRED_FIELDS) {
      const val = note[field];
      const missing = val === undefined || val === null ||
        (Array.isArray(val) && val.length === 0) ||
        (typeof val === 'string' && val.trim() === '');
      if (missing) issues.push(`missing required field: ${field}`);
    }

    // If required fields are missing, skip deeper checks — flag now
    if (issues.length) {
      flagged.push({ index: idx, note, issues });
      return;
    }

    // 2. Bullet mashup check
    (note.bullets || []).forEach((b, bIdx) => {
      const result = looksLikeMashup(b);
      if (result.mashup) {
        issues.push(`bullet[${bIdx}] looks like a mashup: ${result.reason}`);
      }
    });

    // 3. Dedup check — against existing data.js
    const normTitle = normalizeTitle(note.title);
    let bestMatch = null;
    let bestScore = 0;
    for (const ex of existing) {
      const score = similarity(normTitle, ex.normalized);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = ex;
      }
    }
    if (bestScore >= TITLE_SIMILARITY_THRESHOLD) {
      issues.push(`possible duplicate of existing note "${bestMatch.title}" (id: ${bestMatch.id}, similarity: ${(bestScore * 100).toFixed(1)}%)`);
    }

    // 4. Dedup check — within this same batch
    if (seenThisBatch.has(normTitle)) {
      issues.push(`duplicate within this batch (normalized title already seen earlier in candidates.json)`);
    } else {
      seenThisBatch.add(normTitle);
    }

    if (issues.length) {
      flagged.push({ index: idx, note, issues });
    } else {
      accepted.push(note);
    }
  });

  // ---------- REPORT ----------
  console.log('='.repeat(60));
  console.log('CA NOTES VALIDATION REPORT');
  console.log('='.repeat(60));
  console.log(`Total candidates: ${candidates.length}`);
  console.log(`Accepted:         ${accepted.length}`);
  console.log(`Flagged:          ${flagged.length}`);
  console.log('');

  if (flagged.length) {
    console.log('--- FLAGGED FOR HUMAN REVIEW (not appended) ---');
    flagged.forEach(f => {
      console.log(`\n[${f.index}] "${f.note.title || '(no title)'}"`);
      f.issues.forEach(i => console.log(`   - ${i}`));
    });
    console.log('');
  }

  fs.writeFileSync('accepted.json', JSON.stringify(accepted, null, 2));
  fs.writeFileSync('flagged.json', JSON.stringify(flagged, null, 2));
  console.log('Wrote accepted.json (safe to append to CA_NOTES_DATA) and flagged.json (needs review).');

  // Non-zero exit if anything flagged, so agent scripts/CI can't silently continue
  process.exit(flagged.length ? 1 : 0);
}

main();
