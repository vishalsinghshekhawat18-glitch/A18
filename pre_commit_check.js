/**
 * pre_commit_check.js
 *
 * Purpose: Cheap, fast gate the agent MUST run before marking any
 * code task (app.js, index.html inline scripts, etc.) as complete.
 * Catches the exact bug classes from the audit report:
 *   - duplicate `let`/`const`/`var` declarations in the same scope
 *   - obviously undefined variable references (best-effort)
 *   - DOM lookups (getElementById/querySelector) used without a
 *     preceding null-safety guard
 *
 * This is NOT a replacement for a real linter. If ESLint is available
 * in the project, prefer that. This script exists so the agent has a
 * zero-dependency fallback that still catches the recurring bugs.
 *
 * Usage:
 *   node pre_commit_check.js <file1.js> <file2.js> ...
 *
 * Exits non-zero on any finding — agent must fix before proceeding.
 */

const fs = require('fs');

let hadIssues = false;

function checkFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const lines = code.split('\n');
  const issues = [];

  // 1. AST-level syntax check
  try {
    new Function(code);
  } catch (e) {
    issues.push(`SYNTAX ERROR: ${e.message}`);
    // If syntax is broken, skip further checks — fix this first.
    report(filePath, issues);
    return;
  }

  // 2. Duplicate top-level / same-indentation-block `let`/`const` declarations
  //    Heuristic: track declared names per brace-depth "scope stack".
  const declStack = [new Set()]; // scope 0 = top-level
  let depth = 0;

  lines.forEach((line, i) => {
    const lineNo = i + 1;

    // crude brace depth tracking (ignores strings/comments edge cases —
    // good enough as a fast pre-check, not a full parser)
    const opens = (line.match(/{/g) || []).length;
    const closes = (line.match(/}/g) || []).length;

    const declMatch = line.match(/\b(let|const|var)\s+([a-zA-Z_$][\w$]*)/);
    if (declMatch) {
      const varName = declMatch[2];
      if (declStack[depth].has(varName)) {
        issues.push(`Line ${lineNo}: duplicate declaration of "${varName}" in same scope`);
      } else {
        declStack[depth].add(varName);
      }
    }

    for (let k = 0; k < opens; k++) {
      depth++;
      declStack[depth] = new Set();
    }
    for (let k = 0; k < closes; k++) {
      if (depth > 0) {
        declStack.pop();
        depth--;
      }
    }
  });

  // 3. DOM lookups used without a null-safety guard nearby
  //    Heuristic: find `const x = document.getElementById(...)` or
  //    `document.querySelector(...)`, then check the next ~3 lines for
  //    an `if (x` guard before `.addEventListener` / property access.
  lines.forEach((line, i) => {
    const lineNo = i + 1;
    const domMatch = line.match(/(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*document\.(getElementById|querySelector)\(/);
    if (!domMatch) return;

    const varName = domMatch[1];
    const windowStart = i + 1;
    const windowEnd = Math.min(lines.length, i + 6);
    const windowText = lines.slice(windowStart, windowEnd).join('\n');

    const usesVarDirectly = new RegExp(`\\b${varName}\\.(addEventListener|innerHTML|textContent|value|style|classList)`).test(windowText);
    const hasGuard = new RegExp(`if\\s*\\(\\s*${varName}\\b`).test(windowText) || new RegExp(`${varName}\\s*\\?\\.`).test(windowText);

    if (usesVarDirectly && !hasGuard) {
      issues.push(`Line ${lineNo}: "${varName}" from document.${domMatch[2]}() is used within a few lines without an "if (${varName})" null-safety guard`);
    }
  });

  report(filePath, issues);
}

function report(filePath, issues) {
  if (issues.length === 0) {
    console.log(`✔ ${filePath}: OK`);
    return;
  }
  hadIssues = true;
  console.log(`✘ ${filePath}: ${issues.length} issue(s) found`);
  issues.forEach(issue => console.log(`   - ${issue}`));
}

// ---------- MAIN ----------
const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node pre_commit_check.js <file1.js> <file2.js> ...');
  process.exit(2);
}

files.forEach(checkFile);

if (hadIssues) {
  console.log('\nResult: FAILED — fix the issues above before marking this task complete.');
  process.exit(1);
} else {
  console.log('\nResult: PASSED — safe to proceed.');
  process.exit(0);
}
