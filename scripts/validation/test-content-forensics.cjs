/**
 * R4.C1 — Comprehensive Content Forensics Engine (Read-Only)
 * Audits all 1,088 items for sentence truncation, fragments, malformed blocks,
 * migration artifacts, and Government Scheme stub vs masterfile reconciliation.
 */

const fs = require('fs');
const path = require('path');

const corpusDir = 'content/corpus';
const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json')).sort();

console.log(`\n========================================================`);
console.log(`🔍 R4.C1 CONTENT FORENSICS ENGINE — FULL CORPUS AUDIT`);
console.log(`Corpus Files Scanned: ${files.length}`);
console.log(`========================================================\n`);

// Forensic Audit Result Categories
const findings = {
  truncatedSentences: [],
  emptyOrMalformedBlocks: [],
  duplicateHeadingsOrBlocks: [],
  suspiciouslyShortNotes: [],
  migrationArtifacts: [],
  metadataAnomalies: [],
  schemeForensics: {
    totalStubs: 0,
    pageNumberArtifacts: [],
    nearEmptyStubs: [],
    masterfileMatched: [],
    masterfileUnmatched: [],
    structuralIssues: []
  }
};

// Load Masterfile for Scheme Reconciliation
const masterfilePath = path.join(corpusDir, 'migrated-schemes-masterfile.json');
let masterfileContent = '';
let masterfileTokens = new Set();
if (fs.existsSync(masterfilePath)) {
  const mfData = JSON.parse(fs.readFileSync(masterfilePath, 'utf-8'));
  masterfileContent = JSON.stringify(mfData).toLowerCase();
  // Extract key scheme keywords from masterfile
  const rawWords = masterfileContent.match(/[a-z0-9-]{3,}/g) || [];
  masterfileTokens = new Set(rawWords);
}

// Helper: extract all plain text from an item's blocks
function extractItemText(blocks = []) {
  const texts = [];
  for (const b of blocks) {
    if (b.content) texts.push(b.content);
    if (b.text) texts.push(b.text);
    if (b.title) texts.push(b.title);
    if (b.items && Array.isArray(b.items)) texts.push(...b.items);
    if (b.rows && Array.isArray(b.rows)) {
      b.rows.forEach(r => { if (Array.isArray(r)) texts.push(...r); });
    }
  }
  return texts.join(' ');
}

// Run audit across each corpus file
for (const file of files) {
  const filePath = path.join(corpusDir, file);
  let item;
  try {
    item = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    findings.emptyOrMalformedBlocks.push({
      id: file,
      domain: 'unknown',
      title: file,
      issue: `Malformed JSON parse error: ${err.message}`
    });
    continue;
  }

  const { id, domain, title, summary, blocks = [], metadata = {} } = item;
  const fullText = extractItemText(blocks);
  const totalLength = fullText.trim().length;

  // --- 1. Metadata Anomalies ---
  if (!domain) {
    findings.metadataAnomalies.push({ id, title, issue: 'Missing domain property' });
  }
  if (domain === 'current-affairs' && (!metadata.date || !/^\d{4}-\d{2}/.test(metadata.date))) {
    findings.metadataAnomalies.push({ id, title, issue: `CA item missing valid date format: ${metadata.date}` });
  }
  if (!metadata.category && domain !== 'english') {
    findings.metadataAnomalies.push({ id, title, issue: 'Missing category metadata' });
  }

  // --- 2. Suspiciously Short Notes (< 120 chars total) ---
  if (totalLength < 120) {
    findings.suspiciouslyShortNotes.push({
      id,
      domain,
      title,
      totalLength,
      sample: fullText.slice(0, 100)
    });
  }

  // --- 3. Block Structure & Truncation Checks ---
  const seenHeadings = new Set();
  let prevParagraph = '';

  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];
    if (!block || typeof block !== 'object') {
      findings.emptyOrMalformedBlocks.push({ id, domain, title, issue: `Block at index ${idx} is null/undefined` });
      continue;
    }

    // Check Headings
    if (block.type === 'heading') {
      const hText = (block.text || '').trim();
      if (!hText) {
        findings.emptyOrMalformedBlocks.push({ id, domain, title, issue: `Empty heading text at index ${idx}` });
      } else {
        if (seenHeadings.has(hText.toLowerCase())) {
          findings.duplicateHeadingsOrBlocks.push({ id, domain, title, issue: `Duplicate heading: "${hText}"` });
        }
        seenHeadings.add(hText.toLowerCase());
      }
    }

    // Check Paragraphs
    if (block.type === 'paragraph') {
      const pText = (block.content || '').trim();
      if (!pText) {
        findings.emptyOrMalformedBlocks.push({ id, domain, title, issue: `Empty paragraph at index ${idx}` });
      } else if (pText === prevParagraph && pText.length > 20 && pText !== '---') {
        findings.duplicateHeadingsOrBlocks.push({ id, domain, title, issue: `Consecutive identical paragraph: "${pText.slice(0, 60)}..."` });
      }
      prevParagraph = pText;

      // Truncation detection in paragraphs
      // Ends with comma, colon, unclosed parenthesis, or trailing conjunctions
      if (pText !== '---') {
        const lastChar = pText.slice(-1);
        const lastWords = pText.toLowerCase().split(/\s+/).slice(-3).join(' ');
        const isTruncated = /[,:;(\-–—]$/.test(pText) ||
          /\b(and|or|the|of|to|with|in|for|by|from|which|that|is|are|was|were|such as|including)\s*$/i.test(pText);

        if (isTruncated && !pText.endsWith(':') && pText.length > 50) {
          findings.truncatedSentences.push({
            id,
            domain,
            title,
            issue: `Paragraph ends abruptly with trailing punctuation or word: "${pText.slice(-60)}"`
          });
        }
      }

      // Migration artifacts
      if (/Page\s+No\.?\s*\d+/i.test(pText) || /<br\s*\/?>/i.test(pText) || /undefined/i.test(pText)) {
        findings.migrationArtifacts.push({
          id,
          domain,
          title,
          artifact: pText.slice(0, 80)
        });
      }
    }

    // Check Bullet Lists
    if (block.type === 'bullet_list' || block.type === 'numbered_list') {
      const items = block.items || [];
      if (items.length === 0) {
        findings.emptyOrMalformedBlocks.push({ id, domain, title, issue: `Empty list block at index ${idx}` });
      }
      items.forEach((it, bIdx) => {
        if (!it || typeof it !== 'string' || !it.trim()) {
          findings.emptyOrMalformedBlocks.push({ id, domain, title, issue: `Empty bullet item in list at index ${idx}, item ${bIdx}` });
        }
      });
    }

    // Check Tables
    if (block.type === 'table') {
      if (!block.headers || block.headers.length === 0) {
        findings.emptyOrMalformedBlocks.push({ id, domain, title, issue: `Table at index ${idx} has no headers` });
      }
      if (!block.rows || block.rows.length === 0) {
        findings.emptyOrMalformedBlocks.push({ id, domain, title, issue: `Table at index ${idx} has no rows` });
      }
    }
  }

  // --- 4. Government Schemes Forensic Reconciliation ---
  if (id.startsWith('migrated-schemes-scheme-')) {
    findings.schemeForensics.totalStubs++;

    // Check for page number artifacts
    if (/Page\s+No\.?\s*\d+/i.test(fullText)) {
      findings.schemeForensics.pageNumberArtifacts.push({ id, title, length: totalLength });
    }

    // Check for near-empty stubs (< 150 chars)
    if (totalLength < 150) {
      findings.schemeForensics.nearEmptyStubs.push({ id, title, length: totalLength });
    }

    // Compare with Masterfile Content
    // Clean title into key scheme name (e.g. "PM-KISAN", "MUDRA", "SHREYAS")
    const cleanTitle = title.replace(/[:(].*$/, '').trim().toLowerCase();
    const cleanTokens = cleanTitle.split(/[^a-z0-9]+/).filter(t => t.length >= 3 && !['scheme', 'yojana', 'pradhan', 'mantri', 'mission', 'national'].includes(t));

    const isMatch = cleanTokens.some(t => masterfileTokens.has(t));
    if (isMatch) {
      findings.schemeForensics.masterfileMatched.push({ id, title, matchedTokens: cleanTokens.filter(t => masterfileTokens.has(t)) });
    } else {
      findings.schemeForensics.masterfileUnmatched.push({ id, title });
    }
  }
}

// ============================================
// AUDIT SUMMARY PRESENTATION
// ============================================

console.log('=== CORPUS FORENSIC AUDIT SUMMARY ===');
console.log(`1. Total Suspiciously Short Notes (<120 chars): ${findings.suspiciouslyShortNotes.length}`);
console.log(`2. Empty or Malformed Blocks: ${findings.emptyOrMalformedBlocks.length}`);
console.log(`3. Truncated Sentences / Abrupt Endings: ${findings.truncatedSentences.length}`);
console.log(`4. Duplicate Headings/Paragraphs: ${findings.duplicateHeadingsOrBlocks.length}`);
console.log(`5. Migration Artifacts ("Page No.", raw HTML): ${findings.migrationArtifacts.length}`);
console.log(`6. Metadata Anomalies: ${findings.metadataAnomalies.length}`);

console.log('\n=== GOVERNMENT SCHEMES DEEP RECONCILIATION (171 Stubs) ===');
console.log(`Total Scheme Stubs: ${findings.schemeForensics.totalStubs}`);
console.log(`Stubs with "Page No." index artifacts: ${findings.schemeForensics.pageNumberArtifacts.length}`);
console.log(`Stubs with near-empty content (<150 chars): ${findings.schemeForensics.nearEmptyStubs.length}`);
console.log(`Stubs matching topics in Masterfile: ${findings.schemeForensics.masterfileMatched.length}`);
console.log(`Stubs requiring external/source expansion: ${findings.schemeForensics.masterfileUnmatched.length}`);

// Write full forensic report to disk for inspection
const reportPath = 'scripts/validation/content-forensics-report.json';
fs.writeFileSync(reportPath, JSON.stringify(findings, null, 2), 'utf-8');
console.log(`\n📄 Full JSON Forensic Report written to: ${reportPath}`);

// Return 0 for success
process.exit(0);
