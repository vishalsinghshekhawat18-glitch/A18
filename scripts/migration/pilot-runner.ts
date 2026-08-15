import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformCoreChapterToKnowledgeItem } from './extractors/core-extractor';
import { transformCANoteToKnowledgeItem } from './extractors/ca-extractor';
import { transformQuantStaticToKnowledgeItem } from './extractors/quant-static-extractor';
import { auditPilotFidelity, FidelityCheckResult } from './fidelity-audit';
import { KnowledgeItemSchema } from '../../schema/knowledge-item.zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';
const pilotOutputDir = path.resolve(__dirname, '../../content/pilot');

export function runGoldenSamplePilotCorrected() {
  console.log('🚀 EXECUTING PHASE 4 CORRECTED GOLDEN SAMPLE PILOT (15 REAL SOURCE ITEMS)...\n');

  if (!fs.existsSync(pilotOutputDir)) {
    fs.mkdirSync(pilotOutputDir, { recursive: true });
  }

  // 1. Load Legacy Sources (READ-ONLY)
  // Core Chapters
  const indexPath = path.join(legacyDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const startIdx = indexContent.indexOf('const rawBookData =');
  const endIdx = indexContent.indexOf('let selectedSubject =', startIdx);
  const rawSnippet = indexContent.substring(startIdx + 'const rawBookData ='.length, endIdx);
  const lastBracketIdx = rawSnippet.lastIndexOf(']');
  const cleanArrayStr = rawSnippet.substring(0, lastBracketIdx + 1).trim();
  const allCoreChapters: any[] = JSON.parse(cleanArrayStr);

  // CA Notes
  const caDataPath = path.join(legacyDir, 'ca_app', 'data.js');
  const caContent = fs.readFileSync(caDataPath, 'utf-8');
  const caMatch = caContent.match(/const\s+CA_NOTES_DATA\s*=\s*(\[[\s\S]*?\]);/);
  const allCANotes: any[] = caMatch ? eval(caMatch[1]) : [];

  // Schemes
  const schemesPath = path.join(legacyDir, 'ca_app', 'updated_schemes_data.js');
  const schemesContent = fs.readFileSync(schemesPath, 'utf-8');
  const schemesMatch = schemesContent.match(/const\s+updatedSchemesData\s*=\s*(\[[\s\S]*?\]);/);
  const allSchemes: any[] = schemesMatch ? eval(schemesMatch[1]) : [];

  // Static GA
  const staticPath = path.join(legacyDir, 'ca_app', 'static_ga_data.js');
  const staticContent = fs.readFileSync(staticPath, 'utf-8');
  const staticMatch = staticContent.match(/const\s+STATIC_GA_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
  const allStaticChapters: any[] = staticMatch ? eval(staticMatch[1]) : [];

  // Quant
  const quantPath = path.join(legacyDir, 'ca_app', 'quant_data.js');
  const quantTxt = fs.readFileSync(quantPath, 'utf-8');
  const quantStartIdx = quantTxt.indexOf('const QUANT_CHAPTERS =');
  const quantEndIdx = quantTxt.lastIndexOf('];');
  const quantJsonStr = quantTxt.substring(quantStartIdx + 'const QUANT_CHAPTERS ='.length, quantEndIdx + 1);
  const allQuantChapters: any[] = Function(`"use strict"; return (${quantJsonStr});`)();

  const results: FidelityCheckResult[] = [];
  const migratedItems: any[] = [];
  const sourceIdentityRows: any[] = [];

  // Define the exact 15 approved Golden Sample Target Spec using EXACT REAL LEGACY SOURCE IDs
  const pilotTargetSpecs = [
    // Core Items (7 items)
    { sourceSystem: 'Core', realSourceId: 'eco-ch-1', destId: 'pilot-eco-ch-1' },
    { sourceSystem: 'Core', realSourceId: 'eco-ch-14', destId: 'pilot-eco-ch-14' },
    { sourceSystem: 'Core', realSourceId: 'pol-ch-35', destId: 'pilot-pol-ch-35' },
    { sourceSystem: 'Core', realSourceId: 'his-ch-20', destId: 'pilot-hist-ch-20' }, // Real ID in rawBookData is his-ch-20
    { sourceSystem: 'Core', realSourceId: 'geo-ch-5', destId: 'pilot-geo-ch-5' },
    { sourceSystem: 'Core', realSourceId: 'sci-ch-3', destId: 'pilot-sci-ch-3' },
    { sourceSystem: 'Core', realSourceId: 'rev-ch-1', destId: 'pilot-rev-ch-1' },

    // Current Affairs Items (3 items)
    { sourceSystem: 'CA', realSourceId: 'note-sec1-1', destId: 'pilot-ca-012' },
    { sourceSystem: 'CA', realSourceId: 'note-sec1-2', destId: 'pilot-ca-045' },
    { sourceSystem: 'CA', realSourceId: 'note-sec1-3', destId: 'pilot-ca-102' },

    // Schemes Item (1 item)
    { sourceSystem: 'Schemes', realSourceId: 'scheme-5', destId: 'pilot-scheme-015' },

    // Static GA Item (1 item)
    { sourceSystem: 'StaticGA', realSourceId: 'ch1-sub1', destId: 'pilot-static-ch-1-1' },

    // Quant Superbook Items (2 items)
    { sourceSystem: 'Quant', realSourceId: 'qsec1-1', destId: 'pilot-quant-ch-1-1' },
    { sourceSystem: 'Quant', realSourceId: 'qsec2-2', destId: 'pilot-quant-ch-2-2' },

    // PYQ Practice Item (1 item)
    { sourceSystem: 'PYQs', realSourceId: 'qsec8-2', destId: 'pilot-pyq-rbi-2024' }
  ];

  for (const spec of pilotTargetSpecs) {
    let sourcePayload: any = null;
    let targetItem: any = null;
    let sourceCollectionFile = '';

    if (spec.sourceSystem === 'Core') {
      sourcePayload = allCoreChapters.find(c => c.id === spec.realSourceId);
      sourceCollectionFile = 'index.html (rawBookData)';
      if (!sourcePayload) {
        throw new Error(`CRITICAL BLOCKED ERROR: Real Core chapter not found for ID "${spec.realSourceId}"`);
      }
      targetItem = transformCoreChapterToKnowledgeItem({ ...sourcePayload, id: spec.destId, realSourceId: spec.realSourceId }, sourcePayload);
    } else if (spec.sourceSystem === 'CA') {
      sourcePayload = allCANotes.find(n => n.id === spec.realSourceId);
      sourceCollectionFile = 'ca_app/data.js';
      if (!sourcePayload) {
        throw new Error(`CRITICAL BLOCKED ERROR: Real CA note not found for ID "${spec.realSourceId}"`);
      }
      targetItem = transformCANoteToKnowledgeItem({ ...sourcePayload, id: spec.destId, realSourceId: spec.realSourceId }, sourcePayload);
    } else if (spec.sourceSystem === 'Schemes') {
      sourcePayload = allSchemes.find(s => s.id === spec.realSourceId);
      sourceCollectionFile = 'ca_app/updated_schemes_data.js';
      if (!sourcePayload) {
        throw new Error(`CRITICAL BLOCKED ERROR: Real Scheme item not found for ID "${spec.realSourceId}"`);
      }
      targetItem = transformQuantStaticToKnowledgeItem(
        { id: spec.destId, subId: spec.destId, realSourceId: spec.realSourceId, title: sourcePayload.title, category: 'Schemes', rows: [[sourcePayload.title, sourcePayload.category || 'Welfare Scheme']] },
        'Schemes',
        sourceCollectionFile,
        sourcePayload
      );
    } else if (spec.sourceSystem === 'StaticGA') {
      sourceCollectionFile = 'ca_app/static_ga_data.js';
      for (const ch of allStaticChapters) {
        if (ch.subsections) {
          const found = ch.subsections.find((sub: any) => sub.subId === spec.realSourceId);
          if (found) { sourcePayload = found; break; }
        }
      }
      if (!sourcePayload) {
        throw new Error(`CRITICAL BLOCKED ERROR: Real Static GA item not found for ID "${spec.realSourceId}"`);
      }
      targetItem = transformQuantStaticToKnowledgeItem(
        { id: spec.destId, subId: spec.destId, realSourceId: spec.realSourceId, title: sourcePayload.title, headers: sourcePayload.headers, rows: sourcePayload.rows },
        'StaticGA',
        sourceCollectionFile,
        sourcePayload
      );
    } else if (spec.sourceSystem === 'Quant' || spec.sourceSystem === 'PYQs') {
      sourceCollectionFile = 'ca_app/quant_data.js';
      for (const ch of allQuantChapters) {
        if (ch.subsections) {
          const found = ch.subsections.find((sub: any) => sub.subId === spec.realSourceId);
          if (found) { sourcePayload = found; break; }
        }
      }
      if (!sourcePayload) {
        throw new Error(`CRITICAL BLOCKED ERROR: Real ${spec.sourceSystem} item not found for ID "${spec.realSourceId}"`);
      }
      targetItem = transformQuantStaticToKnowledgeItem(
        { id: spec.destId, subId: spec.destId, realSourceId: spec.realSourceId, title: sourcePayload.title, headers: sourcePayload.headers, rows: sourcePayload.rows, formulas: sourcePayload.formulas, workedExamples: sourcePayload.workedExamples, items: sourcePayload.items, shortcuts: sourcePayload.shortcuts, traps: sourcePayload.traps },
        spec.sourceSystem,
        sourceCollectionFile,
        sourcePayload
      );
    }

    // Validate Zod Schema
    KnowledgeItemSchema.parse(targetItem);

    // Audit Fidelity
    const auditRes = auditPilotFidelity(sourcePayload, targetItem);
    results.push(auditRes);
    migratedItems.push(targetItem);

    // Save to content/pilot directory
    const outputFilename = spec.destId.replace('pilot-', '') + '.json';
    fs.writeFileSync(
      path.join(pilotOutputDir, outputFilename),
      JSON.stringify(targetItem, null, 2)
    );

    const matchPass = auditRes.passed && targetItem.title === sourcePayload.title;
    if (!matchPass) {
      console.log(`⚠️ Match failure for ${targetItem.id}: auditRes.errors=${JSON.stringify(auditRes.errors)}`);
    }

    sourceIdentityRows.push({
      SourceCollection: sourceCollectionFile,
      ActualSourceID: spec.realSourceId,
      SourceTitle: sourcePayload.title.length > 35 ? sourcePayload.title.substring(0, 35) + '...' : sourcePayload.title,
      DestinationID: targetItem.id,
      DestinationType: targetItem.type,
      PassFail: matchPass ? 'PASS' : 'FAIL'
    });

    console.log(`✅ [${spec.sourceSystem}] Migrated ${targetItem.id}: "${targetItem.title.substring(0, 45)}..." (${matchPass ? 'PASS' : 'FAIL'})`);
  }

  console.log('\n------------------------------------------------------------');
  console.log('📋 MANDATORY 15-ROW SOURCE IDENTITY TABLE:');
  console.table(sourceIdentityRows);

  console.log('\n------------------------------------------------------------');
  console.log(`📊 PHASE 4 CORRECTED PILOT MIGRATION SUMMARY:`);
  console.log(`   - Total Target Pilot Items: 15`);
  console.log(`   - Successfully Migrated & Saved: ${migratedItems.length}`);
  console.log(`   - Source Identity Preservation: ${sourceIdentityRows.every(r => r.PassFail === 'PASS') ? '15/15 PASSED' : 'HAS FAILURES'}`);
  console.log(`   - Schema Validation: 100% PASSED`);
  console.log(`   - Level 1-6 Fidelity Audit: ${results.every(r => r.passed) ? '100% PASSED' : 'HAS ERRORS'}`);
  console.log('------------------------------------------------------------\n');

  // Save audit results JSON
  fs.writeFileSync(
    path.resolve(__dirname, '../../docs/PHASE_4_FIDELITY_RESULTS.json'),
    JSON.stringify(results, null, 2)
  );
}

runGoldenSamplePilotCorrected();
