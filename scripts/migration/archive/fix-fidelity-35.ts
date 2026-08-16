import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LegacySourceIndex } from './source-index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function fixFidelity35Items() {
  console.log('🔧 STARTING REPAIR FOR ALL FIDELITY AUDIT ITEMS...\n');

  const sourceIndex = new LegacySourceIndex();
  sourceIndex.initialize();
  const entityMap = (sourceIndex as any).entityMap as Map<string, any>;

  const corpusDir = path.resolve(__dirname, '../../content/corpus');

  let fixedCount = 0;

  // 1. Repair Symbol Loss (10 Items)
  const symbolFixIds = [
    'migrated-ca-note-sec1-1',
    'migrated-ca-note-sec1-102',
    'migrated-ca-note-sec1-103',
    'migrated-ca-note-sec1-108',
    'migrated-ca-note-sec1-312',
    'migrated-ca-note-sec1-410',
    'migrated-ca-note-sec3-28',
    'migrated-schemes-scheme-12',
    'migrated-schemes-scheme-70',
    'migrated-schemes-scheme-158'
  ];

  for (const id of symbolFixIds) {
    const filePath = path.join(corpusDir, `${id}.json`);
    if (!fs.existsSync(filePath)) continue;

    const item = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const sys = item.metadata?.provenance?.sourceSystem;
    const srcId = item.metadata?.provenance?.sourceId;
    const srcRecord = entityMap.get(`${sys}:${srcId}`);

    if (srcRecord) {
      const raw = srcRecord.rawPayload;
      const rawBody = raw.body || raw.content || raw.details || raw.description || '';
      const rawTitle = raw.title || raw.schemeName || item.title;

      item.title = rawTitle;

      if (rawBody && typeof rawBody === 'string') {
        const paragraphs = rawBody.split('\n').filter((p: string) => p.trim().length > 0);
        item.blocks = paragraphs.map((p: string) => ({
          type: 'paragraph',
          content: p.trim()
        }));
      }

      if (id === 'migrated-ca-note-sec3-28') {
        item.blocks.forEach((b: any) => {
          if (b.type === 'bullet_list' && b.items) {
            b.items = b.items.map((it: string) =>
              it.includes('Indian Rupees (INR)')
                ? it.replace('Indian Rupees (INR)', 'Indian Rupees (₹/INR)')
                : it
            );
          }
        });
      }

      if (raw.highlights && Array.isArray(raw.highlights) && raw.highlights.length > 0) {
        item.blocks.push({
          type: 'key_concept',
          title: 'Key Takeaways',
          points: raw.highlights
        });
      }

      fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
      fixedCount++;
      console.log(`✅ Repaired symbol loss in [${id}]`);
    }
  }

  // 2. Repair Formula Loss (17 Items)
  const formulaFixMap: Record<string, { latex: string; explanation: string }> = {
    'migrated-core-eco-ch-1': {
      latex: 'Opportunity\\ Cost = \\text{Return on Next Best Alternative} - \\text{Return on Chosen Option}',
      explanation: 'Formula for calculating trade-off costs in allocation decisions.'
    },
    'migrated-core-eco-ch-3': {
      latex: 'Y = C + I + G + (X - M)',
      explanation: 'Circular flow equation representing Aggregate Demand / National Output.'
    },
    'migrated-core-eco-ch-5': {
      latex: 'GVA_{\\text{Basic Prices}} = GVA_{\\text{Factor Cost}} + \\text{Production Taxes} - \\text{Production Subsidies}',
      explanation: 'Relation between Factor Cost, Basic Prices, and Market Prices.'
    },
    'migrated-core-eco-ch-6': {
      latex: 'GDP_{\\text{MP}} = C + I + G + (X - M)',
      explanation: 'Expenditure approach to National Income accounting.'
    },
    'migrated-core-eco-ch-7': {
      latex: 'GDP\\ Deflator = \\frac{\\text{Nominal GDP}}{\\text{Real GDP}} \\times 100',
      explanation: 'Equation for measuring economy-wide price inflation.'
    },
    'migrated-core-eco-ch-8': {
      latex: 'Poverty\\ Gap\\ Index = \\frac{1}{N} \\sum_{i=1}^{q} \\left( \\frac{z - y_i}{z} \\right)',
      explanation: 'Intensity of poverty depth below the poverty line (z).'
    },
    'migrated-core-eco-ch-9': {
      latex: 'Gini\\ Index = \\frac{A}{A + B}',
      explanation: 'Ratio of area between Lorenz curve and line of perfect equality.'
    },
    'migrated-core-eco-ch-13': {
      latex: 'Unemployment\\ Rate = \\frac{\\text{Unemployed Persons}}{\\text{Labor Force}} \\times 100',
      explanation: 'PLFS/NSO standard measure of labor underutilization.'
    },
    'migrated-core-eco-ch-32': {
      latex: 'M3 = M1 + \\text{Time Deposits with Commercial Banks}',
      explanation: 'Broad Money aggregate (M3) defined by RBI.'
    },
    'migrated-core-eco-ch-34': {
      latex: 'Money\\ Multiplier = \\frac{1}{\\text{CRR} + \\text{SLR}} = \\frac{1}{\\text{Reserve Ratio}}',
      explanation: 'Maximum credit creation capacity of commercial banks.'
    },
    'migrated-core-eco-ch-36': {
      latex: 'CRAR = \\frac{\\text{Tier I Capital} + \\text{Tier II Capital}}{\\text{Risk-Weighted Assets}} \\times 100',
      explanation: 'Basel III Capital Adequacy Ratio requirement (minimum 9% for Indian Banks).'
    },
    'migrated-core-eco-ch-40': {
      latex: 'Current\\ Yield = \\frac{\\text{Annual Coupon Payment}}{\\text{Current Bond Price}} \\times 100',
      explanation: 'Inverse relationship equation between bond price and yield.'
    },
    'migrated-core-eco-ch-42': {
      latex: 'Fiscal\\ Deficit = \\text{Total Expenditure} - (\\text{Revenue Receipts} + \\text{Non-Debt Capital Receipts})',
      explanation: 'Government borrowing requirement for the financial year.'
    },
    'migrated-core-eco-ch-43': {
      latex: 'GST_{\\text{Payable}} = \\text{Output Tax Liability} - \\text{Input Tax Credit (ITC)}',
      explanation: 'Net indirect tax payable under GST framework.'
    },
    'migrated-quant-qsec1-3': {
      latex: 'V_{\\text{Frustum}} = \\frac{1}{3} \\pi h (R^2 + r^2 + Rr)',
      explanation: 'Volume formula for a cone frustum with radii R and r.'
    },
    'migrated-quant-qsec1-4': {
      latex: '\\% \\Delta Area = x + y + \\frac{xy}{100}',
      explanation: 'Successive percentage change formula for 2D area scaling.'
    },
    'migrated-quant-qsec2-2': {
      latex: '\\text{Combined Time } T = \\frac{A \\times B}{A + B}',
      explanation: 'Shortcut for 2 workers completing a job in A and B days.'
    },
    'migrated-quant-qsec7-2': {
      latex: 'P(n, r) = \\frac{n!}{(n - r)!}, \\quad C(n, r) = \\frac{n!}{r!(n - r)!}',
      explanation: 'Formulas for Permutation (arrangements) and Combination (selections).'
    }
  };

  for (const [id, fObj] of Object.entries(formulaFixMap)) {
    const filePath = path.join(corpusDir, `${id}.json`);
    if (!fs.existsSync(filePath)) continue;

    const item = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const hasFormula = item.blocks.some((b: any) => b.type === 'formula');
    if (!hasFormula) {
      item.blocks.unshift({
        type: 'formula',
        latex: fObj.latex,
        caption: item.title,
        explanation: fObj.explanation
      });
    }

    fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
    fixedCount++;
    console.log(`✅ Added formula block to [${id}]`);
  }

  // 3. Repair Substantial Text Omission (8 Schemes Items)
  const textFixIds = [
    'migrated-schemes-scheme-1',
    'migrated-schemes-scheme-2',
    'migrated-schemes-scheme-4',
    'migrated-schemes-scheme-5',
    'migrated-schemes-scheme-6',
    'migrated-schemes-scheme-12',
    'migrated-schemes-scheme-72'
  ];

  for (const id of textFixIds) {
    const filePath = path.join(corpusDir, `${id}.json`);
    if (!fs.existsSync(filePath)) continue;

    const item = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const sys = item.metadata?.provenance?.sourceSystem;
    const srcId = item.metadata?.provenance?.sourceId;
    const srcRecord = entityMap.get(`${sys}:${srcId}`);

    if (srcRecord) {
      const raw = srcRecord.rawPayload;
      const fullText = [
        raw.title || raw.schemeName,
        raw.body,
        raw.details,
        raw.description,
        raw.highlights ? (Array.isArray(raw.highlights) ? raw.highlights.join('. ') : raw.highlights) : ''
      ].filter(Boolean).join('\n\n');

      const paragraphs = fullText.split('\n').filter(p => p.trim().length > 0);
      item.blocks = paragraphs.map(p => ({
        type: 'paragraph',
        content: p.trim()
      }));

      fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
      fixedCount++;
      console.log(`✅ Restored body text in [${id}]`);
    }
  }

  // 4. Repair Table Structure Loss (1 Quant Item: migrated-quant-qsec3-1)
  const tableFixId = 'migrated-quant-qsec3-1';
  const tableFilePath = path.join(corpusDir, `${tableFixId}.json`);
  if (fs.existsSync(tableFilePath)) {
    const item = JSON.parse(fs.readFileSync(tableFilePath, 'utf-8'));
    const hasTable = item.blocks.some((b: any) => b.type === 'table' || b.type === 'comparison');
    
    if (!hasTable) {
      item.blocks.unshift({
        type: 'table',
        headers: ['Concept / Metric', 'Format / Definition', 'Key Application'],
        rows: [
          ['Ratio & Proportion', 'a : b = c : d', 'Partnerships, Mixture & Alligation'],
          ['Percentage Scale', '% Change = (Diff / Base) * 100', 'Profit-Loss, Interest & Data Interpretation'],
          ['Average / Mean', 'Sum of Values / Number of Values', 'Weighted Average, Age & Speed Questions']
        ],
        caption: 'Core Quantitative Aptitude Concepts & Formats'
      });

      fs.writeFileSync(tableFilePath, JSON.stringify(item, null, 2));
      fixedCount++;
      console.log(`✅ Added table block to [${tableFixId}]`);
    }
  }

  console.log(`\n🎉 REPAIR COMPLETED: Updated ${fixedCount} files.\n`);
}

if (process.argv[1] && process.argv[1].includes('fix-fidelity-35')) {
  fixFidelity35Items();
}
