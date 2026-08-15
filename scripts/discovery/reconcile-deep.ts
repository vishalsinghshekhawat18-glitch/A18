import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';
const pilotDir = 'C:\\Users\\visha\\OneDrive\\Documents\\banking-command-center\\content\\pilot';

export function runDeepReconciliationCorrected() {
  console.log('🔬 EXECUTING DEEP READ-ONLY POST-AUDIT RECONCILIATION ON CORRECTED PILOT (15 ITEMS)...\n');

  // Load Legacy Core Chapters
  const indexPath = path.join(legacyDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const startIdx = indexContent.indexOf('const rawBookData =');
  const endIdx = indexContent.indexOf('let selectedSubject =', startIdx);
  const rawSnippet = indexContent.substring(startIdx + 'const rawBookData ='.length, endIdx);
  const lastBracketIdx = rawSnippet.lastIndexOf(']');
  const cleanArrayStr = rawSnippet.substring(0, lastBracketIdx + 1).trim();
  const allCoreChapters: any[] = JSON.parse(cleanArrayStr);

  // Load Legacy CA notes from ca_app/data.js
  const caDataPath = path.join(legacyDir, 'ca_app', 'data.js');
  const caContent = fs.readFileSync(caDataPath, 'utf-8');
  const caMatch = caContent.match(/const\s+CA_NOTES_DATA\s*=\s*(\[[\s\S]*?\]);/);
  const allCANotes: any[] = caMatch ? eval(caMatch[1]) : [];

  // Load Legacy Schemes from ca_app/updated_schemes_data.js
  const schemesPath = path.join(legacyDir, 'ca_app', 'updated_schemes_data.js');
  const schemesContent = fs.readFileSync(schemesPath, 'utf-8');
  const schemesMatch = schemesContent.match(/const\s+updatedSchemesData\s*=\s*(\[[\s\S]*?\]);/);
  const allSchemes: any[] = schemesMatch ? eval(schemesMatch[1]) : [];

  // Load Static GA from ca_app/static_ga_data.js
  const staticPath = path.join(legacyDir, 'ca_app', 'static_ga_data.js');
  const staticContent = fs.readFileSync(staticPath, 'utf-8');
  const staticMatch = staticContent.match(/const\s+STATIC_GA_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
  const allStaticChapters: any[] = staticMatch ? eval(staticMatch[1]) : [];

  // Load Quant from ca_app/quant_data.js
  const quantPath = path.join(legacyDir, 'ca_app', 'quant_data.js');
  const quantTxt = fs.readFileSync(quantPath, 'utf-8');
  const quantStartIdx = quantTxt.indexOf('const QUANT_CHAPTERS =');
  const quantEndIdx = quantTxt.lastIndexOf('];');
  const quantJsonStr = quantTxt.substring(quantStartIdx + 'const QUANT_CHAPTERS ='.length, quantEndIdx + 1);
  const allQuantChapters: any[] = Function(`"use strict"; return (${quantJsonStr});`)();

  const pilotFiles = fs.readdirSync(pilotDir).filter(f => f.endsWith('.json'));

  const itemAuditList: any[] = [];

  for (const pFile of pilotFiles) {
    const pPath = path.join(pilotDir, pFile);
    const destJson = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
    const prov = destJson.metadata?.provenance;

    let matchedSource: any = null;
    let matchedSourceSystem = prov?.sourceSystem || 'Unknown';
    let matchedSourceFile = prov?.sourceFile || 'N/A';
    let mappingStatus = 'PASS';
    let mappingNotes = 'Source identity & payload matched';

    // Locate source payload using provenance record
    if (prov?.sourceSystem === 'Core') {
      matchedSource = allCoreChapters.find(c => c.id === prov.sourceId);
    } else if (prov?.sourceSystem === 'CA') {
      matchedSource = allCANotes.find(n => n.id === prov.sourceId);
    } else if (prov?.sourceSystem === 'Schemes') {
      matchedSource = allSchemes.find(s => s.id === prov.sourceId);
    } else if (prov?.sourceSystem === 'StaticGA') {
      for (const ch of allStaticChapters) {
        if (ch.subsections) {
          const found = ch.subsections.find((sub: any) => sub.subId === prov.sourceId);
          if (found) { matchedSource = found; break; }
        }
      }
    } else if (prov?.sourceSystem === 'Quant' || prov?.sourceSystem === 'PYQs') {
      for (const ch of allQuantChapters) {
        if (ch.subsections) {
          const found = ch.subsections.find((sub: any) => sub.subId === prov.sourceId);
          if (found) { matchedSource = found; break; }
        }
      }
    }

    if (!matchedSource) {
      mappingStatus = 'FAIL';
      mappingNotes = `Unmapped Source: Could not find legacy source payload for ID "${prov?.sourceId}"`;
    } else {
      if (destJson.title !== matchedSource.title) {
        mappingStatus = 'FAIL';
        mappingNotes = `Title mismatch: Source title "${matchedSource.title}" vs Dest title "${destJson.title}"`;
      }
    }

    // SHA-256 Checksum calculation
    const sourceStr = JSON.stringify(matchedSource || {});
    const calculatedHash = crypto.createHash('sha256').update(sourceStr).digest('hex');
    const storedHash = prov?.sourceChecksum;
    const hashMatch = storedHash === calculatedHash;

    if (!hashMatch) {
      mappingStatus = 'FAIL';
      mappingNotes = `Hash mismatch: Stored checksum "${storedHash}" vs Calculated "${calculatedHash}"`;
    }

    // Text & Token analysis
    const sourceCleanText = (matchedSource?.body || JSON.stringify(matchedSource || {}))
      .replace(/<[^>]+>/g, ' ')
      .replace(/\\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const destCleanText = JSON.stringify(destJson.blocks)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const sourceWords = sourceCleanText.split(' ').filter(Boolean);
    const destWords = destCleanText.split(' ').filter(Boolean);

    itemAuditList.push({
      pilotId: destJson.id,
      sourceSystem: matchedSourceSystem,
      sourceFile: matchedSourceFile,
      sourceId: prov?.sourceId || 'Unmapped',
      sourceTitle: matchedSource?.title || 'Unmapped',
      destDomain: destJson.domain,
      destType: destJson.type,
      destTitle: destJson.title,
      sourceWords: sourceWords.length,
      destWords: destWords.length,
      wordRatio: Number((destWords.length / Math.max(1, sourceWords.length)).toFixed(3)),
      hashMatch: hashMatch ? 'MATCH' : 'MISMATCH',
      status: mappingStatus,
      notes: mappingNotes
    });
  }

  console.log('📋 DEEP RECONCILIATION SUMMARY (15 ITEMS):');
  console.table(itemAuditList.map(i => ({
    PilotID: i.pilotId,
    SourceSystem: i.sourceSystem,
    SourceID: i.sourceId,
    DestDomain: i.destDomain,
    SourceWords: i.sourceWords,
    DestWords: i.destWords,
    HashMatch: i.hashMatch,
    Status: i.status
  })));

  const allPassed = itemAuditList.every(i => i.status === 'PASS');
  console.log(`\n============================================================`);
  console.log(`DEEP POST-AUDIT RECONCILIATION VERDICT: ${allPassed ? '🟢 GREEN' : '🔴 RED'}`);
  console.log(`============================================================\n`);
}

runDeepReconciliationCorrected();
