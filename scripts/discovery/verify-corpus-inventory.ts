import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';

export function verifyCorpusInventory() {
  console.log('🔍 INDEPENDENTLY AUDITING LEGACY CORPUS INVENTORY (TARGET: 926 ITEMS)...\n');

  // 1. Core Chapters in index.html
  const indexPath = path.join(legacyDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const startIdx = indexContent.indexOf('const rawBookData =');
  const endIdx = indexContent.indexOf('let selectedSubject =', startIdx);
  const rawSnippet = indexContent.substring(startIdx + 'const rawBookData ='.length, endIdx);
  const lastBracketIdx = rawSnippet.lastIndexOf(']');
  const cleanArrayStr = rawSnippet.substring(0, lastBracketIdx + 1).trim();
  const allCoreChapters: any[] = JSON.parse(cleanArrayStr);

  // 2. CA Notes in ca_app/data.js
  const caDataPath = path.join(legacyDir, 'ca_app', 'data.js');
  const caContent = fs.readFileSync(caDataPath, 'utf-8');
  const caMatch = caContent.match(/const\s+CA_NOTES_DATA\s*=\s*(\[[\s\S]*?\]);/);
  const allCANotes: any[] = caMatch ? eval(caMatch[1]) : [];

  // 3. Schemes in ca_app/updated_schemes_data.js
  const schemesPath = path.join(legacyDir, 'ca_app', 'updated_schemes_data.js');
  const schemesContent = fs.readFileSync(schemesPath, 'utf-8');
  const schemesMatch = schemesContent.match(/const\s+updatedSchemesData\s*=\s*(\[[\s\S]*?\]);/);
  const allSchemes: any[] = schemesMatch ? eval(schemesMatch[1]) : [];

  // 4. Static GA Subsections in ca_app/static_ga_data.js
  const staticPath = path.join(legacyDir, 'ca_app', 'static_ga_data.js');
  const staticContent = fs.readFileSync(staticPath, 'utf-8');
  const staticMatch = staticContent.match(/const\s+STATIC_GA_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
  const allStaticChapters: any[] = staticMatch ? eval(staticMatch[1]) : [];
  let staticSubsectionsCount = 0;
  allStaticChapters.forEach((ch: any) => {
    if (ch.subsections) staticSubsectionsCount += ch.subsections.length;
  });

  // 5. Quant Subsections in ca_app/quant_data.js
  const quantPath = path.join(legacyDir, 'ca_app', 'quant_data.js');
  const quantTxt = fs.readFileSync(quantPath, 'utf-8');
  const quantStartIdx = quantTxt.indexOf('const QUANT_CHAPTERS =');
  const quantEndIdx = quantTxt.lastIndexOf('];');
  const quantJsonStr = quantTxt.substring(quantStartIdx + 'const QUANT_CHAPTERS ='.length, quantEndIdx + 1);
  const allQuantChapters: any[] = Function(`"use strict"; return (${quantJsonStr});`)();
  let quantSubsectionsCount = 0;
  allQuantChapters.forEach((ch: any) => {
    if (ch.subsections) quantSubsectionsCount += ch.subsections.length;
  });

  const grandTotal = allCoreChapters.length + allCANotes.length + allSchemes.length + staticSubsectionsCount + quantSubsectionsCount;

  console.log(`📊 INVENTORY BREAKDOWN:`);
  console.log(`   - Core Chapters:        ${allCoreChapters.length} (Target: 186)`);
  console.log(`   - Current Affairs:      ${allCANotes.length} (Target: 505)`);
  console.log(`   - Government Schemes:   ${allSchemes.length} (Target: 171)`);
  console.log(`   - Static GA Subsections: ${staticSubsectionsCount} (Target: 38)`);
  console.log(`   - Quant Subsections:     ${quantSubsectionsCount} (Target: 26)`);
  console.log(`   --------------------------------------------------`);
  console.log(`   - GRAND TOTAL:           ${grandTotal} (Target: 926)\n`);

  if (grandTotal === 926) {
    console.log(`🟢 INVENTORY AUDIT MATCHED: Exact 926 items confirmed.`);
  } else {
    console.log(`⚠️ INVENTORY DISCREPANCY: Counted ${grandTotal} vs Expected 926.`);
  }
}

verifyCorpusInventory();
