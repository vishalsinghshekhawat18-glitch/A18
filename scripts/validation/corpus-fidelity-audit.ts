import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LegacySourceIndex, SourceEntityRecord } from '../migration/source-index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CorpusFidelityCheckResult {
  corpusId: string;
  sourceSystem: string;
  sourceId: string;
  title: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    sourceMapped: boolean;
    titlePreserved: boolean;
    rupeeSymbolPreserved: boolean;
    percentSymbolPreserved: boolean;
    tablesPreserved: boolean;
    formulasPreserved: boolean;
    textLossPass: boolean;
    metadataPreserved: boolean;
  };
}

export function auditItemFidelity(
  source: SourceEntityRecord,
  target: any
): CorpusFidelityCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const rawString = JSON.stringify(source.rawPayload);
  const targetString =
    JSON.stringify(target.title || '') +
    ' ' +
    JSON.stringify(target.summary || '') +
    ' ' +
    JSON.stringify(target.blocks || []);

  // 1. Title Preservation Check
  const titlePreserved =
    source.sourceTitle.trim().toLowerCase() === (target.title || '').trim().toLowerCase();
  if (!titlePreserved) {
    errors.push(`Title Mismatch: Source "${source.sourceTitle}" vs Target "${target.title}"`);
  }

  // 2. Rupee Symbol (₹) Preservation
  const sourceHasRupee = rawString.includes('₹') || rawString.includes('Rs.') || rawString.includes('Rupees');
  const targetHasRupee = targetString.includes('₹') || targetString.includes('Rs.');
  const rupeeSymbolPreserved = !sourceHasRupee || targetHasRupee;
  if (!rupeeSymbolPreserved) {
    errors.push(`Rupee Symbol (₹) Lost: Source contains ₹/Rs. but Target blocks omitted it.`);
  }

  // 3. Percentage Symbol (%) Preservation
  const sourceHasPercent = rawString.includes('%');
  const targetHasPercent = targetString.includes('%');
  const percentSymbolPreserved = !sourceHasPercent || targetHasPercent;
  if (!percentSymbolPreserved) {
    errors.push(`Percentage Symbol (%) Lost: Source contains % but Target blocks omitted it.`);
  }

  // 4. Table Count Preservation
  let sourceTableCount = 0;
  if (source.rawPayload.tables && Array.isArray(source.rawPayload.tables)) {
    sourceTableCount = source.rawPayload.tables.length;
  } else if (source.rawPayload.table || source.rawPayload.rows) {
    sourceTableCount = 1;
  } else if (typeof rawString === 'string' && (rawString.includes('<table') || rawString.includes('headers'))) {
    sourceTableCount = 1;
  }

  const targetTableCount = (target.blocks || []).filter(
    (b: any) => b.type === 'table' || b.type === 'comparison'
  ).length;
  const tablesPreserved = targetTableCount >= sourceTableCount;
  if (!tablesPreserved) {
    errors.push(
      `Table Loss Detected: Source had ${sourceTableCount} table structures, Target has ${targetTableCount}`
    );
  }

  // 5. Formula Count Preservation
  let sourceFormulaCount = 0;
  if (source.rawPayload.formulas && Array.isArray(source.rawPayload.formulas)) {
    sourceFormulaCount = source.rawPayload.formulas.length;
  } else if (rawString.includes('$$') || rawString.includes('\\\\frac') || rawString.includes('\\\\times')) {
    sourceFormulaCount = 1;
  }

  const targetFormulaCount = (target.blocks || []).filter(
    (b: any) =>
      b.type === 'formula' ||
      (b.type === 'worked_example' && b.steps?.some((s: any) => s.latex))
  ).length;
  const formulasPreserved = targetFormulaCount >= sourceFormulaCount;
  if (!formulasPreserved) {
    errors.push(
      `Formula Loss Detected: Source had ${sourceFormulaCount} formulas/math expressions, Target has ${targetFormulaCount}`
    );
  }

  // 6. Text Loss Check
  let rawTextContent = '';
  if (typeof source.rawPayload === 'string') {
    rawTextContent = source.rawPayload;
  } else {
    rawTextContent = JSON.stringify(source.rawPayload);
  }
  const cleanRawLen = rawTextContent.replace(/[{}":,]/g, ' ').replace(/\s+/g, ' ').length;

  let targetTextContent = targetString;
  const cleanTargetLen = targetTextContent.replace(/[{}":,]/g, ' ').replace(/\s+/g, ' ').length;

  const textLossPass = cleanTargetLen >= cleanRawLen * 0.45;
  if (!textLossPass) {
    errors.push(
      `Substantial Text Omission Detected: Source len ${cleanRawLen} vs Target block len ${cleanTargetLen}`
    );
  }

  // 7. Metadata Preservation Check
  let metadataPreserved = true;
  if (source.rawPayload.date && target.metadata?.date) {
    if (source.rawPayload.date !== target.metadata.date) {
      warnings.push(
        `Date Metadata Drift: Source "${source.rawPayload.date}" vs Target "${target.metadata.date}"`
      );
    }
  }

  const passed = errors.length === 0;

  return {
    corpusId: target.id,
    sourceSystem: source.sourceSystem,
    sourceId: source.sourceId,
    title: target.title,
    passed,
    errors,
    warnings,
    checks: {
      sourceMapped: true,
      titlePreserved,
      rupeeSymbolPreserved,
      percentSymbolPreserved,
      tablesPreserved,
      formulasPreserved,
      textLossPass,
      metadataPreserved
    }
  };
}

export function runFullCorpusFidelityAudit() {
  console.log('🔍 INITIALIZING FULL 926 CORPUS FIDELITY AUDIT...\n');

  const sourceIndex = new LegacySourceIndex();
  sourceIndex.initialize();
  const entityMap = (sourceIndex as any).entityMap as Map<string, SourceEntityRecord>;

  const corpusDir = path.resolve(__dirname, '../../content/corpus');
  if (!fs.existsSync(corpusDir)) {
    console.error('❌ Error: content/corpus directory not found.');
    process.exit(1);
  }

  const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));
  console.log(`📂 Found ${files.length} JSON files in content/corpus/ to audit.\n`);

  let totalAudited = 0;
  let passedCount = 0;
  let failedCount = 0;
  const failureReports: CorpusFidelityCheckResult[] = [];

  for (const file of files) {
    totalAudited += 1;
    const filePath = path.join(corpusDir, file);
    const targetJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const prov = targetJson.metadata?.provenance;
    const sys = prov?.sourceSystem;
    const srcId = prov?.sourceId;

    if (!sys || !srcId) {
      failedCount += 1;
      failureReports.push({
        corpusId: targetJson.id || file,
        sourceSystem: sys || 'UNKNOWN',
        sourceId: srcId || 'UNKNOWN',
        title: targetJson.title || file,
        passed: false,
        errors: [`Missing Provenance Metadata: sourceSystem or sourceId absent in target JSON`],
        warnings: [],
        checks: {
          sourceMapped: false,
          titlePreserved: false,
          rupeeSymbolPreserved: false,
          percentSymbolPreserved: false,
          tablesPreserved: false,
          formulasPreserved: false,
          textLossPass: false,
          metadataPreserved: false
        }
      });
      continue;
    }

    const key = `${sys}:${srcId}`;
    const sourceRecord = entityMap.get(key);

    if (!sourceRecord) {
      failedCount += 1;
      failureReports.push({
        corpusId: targetJson.id,
        sourceSystem: sys,
        sourceId: srcId,
        title: targetJson.title,
        passed: false,
        errors: [`Unmapped Source Entity: Key "${key}" not found in LegacySourceIndex`],
        warnings: [],
        checks: {
          sourceMapped: false,
          titlePreserved: false,
          rupeeSymbolPreserved: false,
          percentSymbolPreserved: false,
          tablesPreserved: false,
          formulasPreserved: false,
          textLossPass: false,
          metadataPreserved: false
        }
      });
      continue;
    }

    const result = auditItemFidelity(sourceRecord, targetJson);
    if (result.passed) {
      passedCount += 1;
    } else {
      failedCount += 1;
      failureReports.push(result);
    }
  }

  console.log('============================================================');
  console.log('📊 BUCKET 2: FULL CORPUS MIGRATION FIDELITY AUDIT RESULTS');
  console.log('============================================================');
  console.log(`Total Corpus Items Audited: ${totalAudited}`);
  console.log(`✅ PASSED FIDELITY AUDIT:  ${passedCount} (${((passedCount / totalAudited) * 100).toFixed(1)}%)`);
  console.log(`❌ FAILED FIDELITY AUDIT:  ${failedCount} (${((failedCount / totalAudited) * 100).toFixed(1)}%)`);
  console.log('============================================================\n');

  if (failureReports.length > 0) {
    console.log(`❌ DETAILED FAILURE BREAKDOWN (${failureReports.length} ITEMS):\n`);
    failureReports.forEach((report, idx) => {
      console.log(`${idx + 1}. [${report.sourceSystem}:${report.sourceId}] (${report.corpusId})`);
      console.log(`   Title: "${report.title}"`);
      report.errors.forEach(err => console.log(`   ❌ Error: ${err}`));
      report.warnings.forEach(warn => console.log(`   ⚠️ Warning: ${warn}`));
      console.log('');
    });
  }

  return {
    totalAudited,
    passedCount,
    failedCount,
    failureReports
  };
}

if (process.argv[1] && process.argv[1].includes('corpus-fidelity-audit')) {
  runFullCorpusFidelityAudit();
}
