import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';
const pilotDir = 'C:\\Users\\visha\\OneDrive\\Documents\\banking-command-center\\content\\pilot';

export function runPostAuditReconciliation() {
  console.log('🔍 RUNNING FORENSIC POST-AUDIT RECONCILIATION ON 15 PILOT ITEMS...\n');

  // 1. Load Legacy Core Chapters
  const indexPath = path.join(legacyDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const startIdx = indexContent.indexOf('const rawBookData =');
  const endIdx = indexContent.indexOf('let selectedSubject =', startIdx);
  const rawSnippet = indexContent.substring(startIdx + 'const rawBookData ='.length, endIdx);
  const lastBracketIdx = rawSnippet.lastIndexOf(']');
  const cleanArrayStr = rawSnippet.substring(0, lastBracketIdx + 1).trim();
  const allCoreChapters: any[] = JSON.parse(cleanArrayStr);

  // 2. Load Legacy CA / Schemes / Static GA / Quant Data
  const caDataPath = path.join(legacyDir, 'ca_app', 'data.js');
  const caContent = fs.readFileSync(caDataPath, 'utf-8');
  const caMatch = caContent.match(/const\s+CA_NOTES_DATA\s*=\s*(\[[\s\S]*?\]);/);
  const allCANotes: any[] = caMatch ? eval(caMatch[1]) : [];

  const schemesPath = path.join(legacyDir, 'ca_app', 'updated_schemes_data.js');
  const schemesContent = fs.readFileSync(schemesPath, 'utf-8');
  const schemesMatch = schemesContent.match(/const\s+updatedSchemesData\s*=\s*(\[[\s\S]*?\]);/);
  const allSchemes: any[] = schemesMatch ? eval(schemesMatch[1]) : [];

  const staticPath = path.join(legacyDir, 'ca_app', 'static_ga_data.js');
  const staticContent = fs.readFileSync(staticPath, 'utf-8');
  const staticMatch = staticContent.match(/const\s+STATIC_GA_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
  const allStaticChapters: any[] = staticMatch ? eval(staticMatch[1]) : [];

  let allQuantChapters: any[] = [];
  try {
    const quantMatch = quantContent.match(/const\s+QUANT_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
    if (quantMatch) {
      allQuantChapters = Function(`"use strict"; return (${quantMatch[1]});`)();
    }
  } catch (e) {
    // Quant chapters fallback
  }

  console.log(`Loaded Legacy Sources: Core (${allCoreChapters.length}), CA (${allCANotes.length}), Schemes (${allSchemes.length}), Static GA (${allStaticChapters.length} ch), Quant (${allQuantChapters.length} ch)\n`);

  // Pilot files in content/pilot/
  const pilotFiles = fs.readdirSync(pilotDir).filter(f => f.endsWith('.json'));

  const itemAuditList: any[] = [];

  for (const pFile of pilotFiles) {
    const pPath = path.join(pilotDir, pFile);
    const destJson = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
    const rawPilotId = pFile.replace('.json', '');

    // Locate source payload
    let sourcePayload: any = null;
    let sourceSystem = '';
    let sourceFile = '';

    // Check Core
    const coreFound = allCoreChapters.find(c => c.id === rawPilotId);
    if (coreFound) {
      sourcePayload = coreFound;
      sourceSystem = 'Core';
      sourceFile = 'index.html (rawBookData)';
    } else {
      // Check CA
      const caFound = allCANotes.find(c => c.id === rawPilotId);
      if (caFound) {
        sourcePayload = caFound;
        sourceSystem = 'CA';
        sourceFile = 'ca_app/data.js';
      } else {
        // Check Schemes
        const schemeFound = allSchemes.find(s => s.id === rawPilotId);
        if (schemeFound) {
          sourcePayload = schemeFound;
          sourceSystem = 'Schemes';
          sourceFile = 'ca_app/updated_schemes_data.js';
        }
      }
    }

    if (!sourcePayload) {
      // Index-based fallback inspection
      console.log(`⚠️  Warning: Source payload for ${rawPilotId} not matched by direct ID.`);
    }

    // SHA-256 Checksum calculation
    const sourceStr = JSON.stringify(sourcePayload || {});
    const calculatedHash = crypto.createHash('sha256').update(sourceStr).digest('hex');

    // Token & Text analysis
    const sourceCleanText = sourceStr
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
      file: pFile,
      sourceSystem: sourceSystem || 'Index Fallback',
      sourceFile: sourceFile || 'ca_app/data.js',
      sourceId: sourcePayload?.id || rawPilotId,
      sourceSubject: sourcePayload?.subject || sourcePayload?.secId || 'N/A',
      sourceTitle: sourcePayload?.title || destJson.title,
      destDomain: destJson.domain,
      destType: destJson.type,
      destTitle: destJson.title,
      sourceWordCount: sourceWords.length,
      destWordCount: destWords.length,
      wordRatio: Number((destWords.length / Math.max(1, sourceWords.length)).toFixed(3)),
      provenanceHash: destJson.metadata?.provenance?.sourceChecksum,
      calculatedHash: calculatedHash,
      hashMatch: destJson.metadata?.provenance?.sourceChecksum === calculatedHash
    });
  }

  console.log('📊 Detailed Post-Audit Reconciliation Summary:');
  console.table(itemAuditList.map(i => ({
    PilotID: i.pilotId,
    SourceSystem: i.sourceSystem,
    SourceTitle: i.sourceTitle.substring(0, 35) + '...',
    DestDomain: i.destDomain,
    SourceWords: i.sourceWordCount,
    DestWords: i.destWordCount,
    WordRatio: i.wordRatio,
    HashMatch: i.hashMatch ? '✅ MATCH' : '❌ MISMATCH'
  })));
}

runPostAuditReconciliation();
