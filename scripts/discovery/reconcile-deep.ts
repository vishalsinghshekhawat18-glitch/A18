import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';
const pilotDir = 'C:\\Users\\visha\\OneDrive\\Documents\\banking-command-center\\content\\pilot';

export function runDeepReconciliation() {
  console.log('🔬 EXECUTING DEEP READ-ONLY RECONCILIATION FOR PHASE 4 POST-AUDIT...\n');

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
  const quantContent = fs.readFileSync(quantPath, 'utf-8');
  let allQuantChapters: any[] = [];
  try {
    const quantMatch = quantContent.match(/const\s+QUANT_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
    if (quantMatch) {
      allQuantChapters = Function(`"use strict"; return (${quantMatch[1]});`)();
    }
  } catch (e) {}

  const pilotFiles = fs.readdirSync(pilotDir).filter(f => f.endsWith('.json'));

  const itemAuditList: any[] = [];

  for (const pFile of pilotFiles) {
    const pPath = path.join(pilotDir, pFile);
    const destJson = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
    const rawPilotId = pFile.replace('.json', '');

    // Search for exact matching source payload across all legacy datasets
    let matchedSource: any = null;
    let matchedSourceSystem = '';
    let matchedSourceFile = '';
    let mappingStatus = 'PASS';
    let mappingNotes = 'Source identity & payload matched';

    // 1. Search Core chapters
    const coreFound = allCoreChapters.find(c => c.id === rawPilotId);
    if (coreFound) {
      matchedSource = coreFound;
      matchedSourceSystem = 'Core';
      matchedSourceFile = 'index.html (rawBookData)';
      if (coreFound.subject !== destJson.domain) {
        mappingStatus = 'FAIL';
        mappingNotes = `Domain Mismatch: Source subject "${coreFound.subject}" vs Target domain "${destJson.domain}"`;
      }
    } else {
      // 2. Search CA notes by title or id
      const caFound = allCANotes.find(c => c.id === rawPilotId || c.title === destJson.title);
      if (caFound) {
        matchedSource = caFound;
        matchedSourceSystem = 'CA';
        matchedSourceFile = 'ca_app/data.js';

        // Check if ID was mapped by array index rather than source ID
        if (rawPilotId.startsWith('quant-') || rawPilotId.startsWith('static-') || rawPilotId.startsWith('pyq-') || rawPilotId.startsWith('scheme-')) {
          mappingStatus = 'FAIL';
          mappingNotes = `Mismatched Target Category: CA note titled "${caFound.title.substring(0, 30)}..." was assigned pilot ID "${rawPilotId}" (array-index mapping error in pilot-runner.ts)`;
        }
      } else {
        // 3. Search Schemes
        const schemeFound = allSchemes.find(s => s.id === rawPilotId || s.title === destJson.title);
        if (schemeFound) {
          matchedSource = schemeFound;
          matchedSourceSystem = 'Schemes';
          matchedSourceFile = 'ca_app/updated_schemes_data.js';
        } else {
          mappingStatus = 'FAIL';
          mappingNotes = `Unmapped Source: No legacy source item found matching ID "${rawPilotId}" or title "${destJson.title}"`;
        }
      }
    }

    // SHA-256 Checksum calculation
    const sourceStr = JSON.stringify(matchedSource || {});
    const calculatedHash = crypto.createHash('sha256').update(sourceStr).digest('hex');
    const storedHash = destJson.metadata?.provenance?.sourceChecksum;
    const provenanceValid = storedHash && storedHash.length === 64;

    // Word & Token Analysis
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

    // Number & Symbol Check
    const rupeePreserved = !sourceCleanText.includes('₹') || destCleanText.includes('₹');
    const percentPreserved = !sourceCleanText.includes('%') || destCleanText.includes('%');

    itemAuditList.push({
      pilotId: destJson.id,
      file: pFile,
      sourceSystem: matchedSourceSystem || 'Unknown',
      sourceFile: matchedSourceFile || 'N/A',
      sourceId: matchedSource?.id || 'Unmapped',
      sourceSubject: matchedSource?.subject || matchedSource?.secId || 'N/A',
      sourceTitle: matchedSource?.title || 'Unmapped',
      destDomain: destJson.domain,
      destType: destJson.type,
      destTitle: destJson.title,
      sourceWordCount: sourceWords.length,
      destWordCount: destWords.length,
      wordRatio: Number((destWords.length / Math.max(1, sourceWords.length)).toFixed(3)),
      rupeePreserved,
      percentPreserved,
      provenanceValid,
      mappingStatus,
      mappingNotes
    });
  }

  console.log('📋 AUDIT RECONCILIATION RESULTS ACROSS ALL 15 PILOT ITEMS:');
  console.table(itemAuditList.map(i => ({
    PilotID: i.pilotId,
    SourceSys: i.sourceSystem,
    SourceSubject: i.sourceSubject,
    DestDomain: i.destDomain,
    Status: i.mappingStatus,
    Notes: i.mappingNotes
  })));
}

runDeepReconciliation();
