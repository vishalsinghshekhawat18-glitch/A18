const fs = require('fs');
const path = require('path');

const corpusDir = path.resolve('content/corpus');
const indexPath = path.resolve('content/corpus-index.json');
const manifestPath = path.resolve('content/manifest.json');

const febSec11Note = {
  id: 'migrated-ca-2026-02-sec11-1',
  domain: 'current-affairs',
  title: '⚡ Rapid Revision & High-Yield One-Liners — February 2026 Exam Cheat Sheet',
  summary: 'Comprehensive exam-eve rapid revision matrix and fast-recall cheat sheet for February 2026 covering 16th Finance Commission (41%), Union Budget FY27 (4.3% deficit, ₹12.2L Cr Capex), DICGC 4-Tier RBP, 5.25% Repo, ₹20L Collateral-Free MSME limit, Sabka Bima 100% FDI, SBI ₹10.9L Cr Mcap, Uday Kotak GIFT City, Micron ₹22,500 Cr ATMP, and Henley 75th rank.',
  blocks: [
    {
      id: 'blk-1',
      type: 'paragraph',
      content: 'Master recall cheat sheet summarizing the highest-density numbers, regulatory updates, and one-liner facts from February 2026 for SBI PO Mains, IBPS PO Mains, and Officer-grade banking examinations.'
    },
    {
      id: 'blk-2',
      type: 'bullet_list',
      items: [
        '16th Finance Commission: 41% vertical tax devolution retained; 1% for J&K/Ladakh; introduced 10% Contribution to GDP weight (Chaired by Dr. Arvind Panagariya).',
        'Union Budget 2026–27: Fiscal Deficit targeted at 4.3% of GDP; Capital Expenditure outlay ₹12.2 Lakh Crore (3.4% of GDP); Direct Tax Act 2025 simplified; 40% GST on demerit goods.',
        'RBI Monetary Policy (Feb 2026): Policy Repo Rate cut by 25 bps to 5.25%; Standing Deposit Facility (SDF) at 5.00%; Marginal Standing Facility (MSF) at 5.50%; MSME collateral-free loan ceiling raised from ₹10 Lakh to ₹20 Lakh.',
        'DICGC Risk-Based Premium 2026: 4-tier differential premium framework replacing flat 12p rate based on CAMELS supervision ratings (up to 33.33% risk incentive and 25% vintage discount).',
        'RBI ECB Framework 2026: Automatic route limit raised to $1 Billion or 300% of Net Worth per financial year; minimum average maturity 3 years.',
        '100% Insurance FDI (Sabka Bima Sabki Raksha Act 2025): 100% foreign direct investment permitted across life, general, and health insurers with single composite registration window.',
        'State Bank of India (SBI): Market capitalization crossed ₹10.9 Lakh Crore ($125 Billion), becoming 4th largest Indian firm; raised $1 Billion syndicated social loan via MUFG.',
        'All-India Financial Institutions (AIFIs): NaBFID made its debut Certificate of Deposit (CD) issuance of ₹5,000 Crore; NABARD issued ₹6,779 Crore social bonds for rural drinking water.',
        'GIFT City Governance: Uday Kotak appointed Chairman of Gujarat International Finance Tec-City (GIFT City); Nidhi Chhibber appointed Interim CEO of NITI Aayog.',
        'Semiconductor & Defence: Micron ₹22,500 Crore semiconductor ATMP unit in Sanand, Gujarat; Agni-III Intermediate-Range Ballistic Missile (3,500 km range) successfully test-fired; Indian Navy assumed command of CTF 154 in Bahrain.',
        'Global Indices: India ranked 75th in Henley Passport Index (up 10 places, 57 visa-free destinations); ranked 91st in Transparency International Corruption Perceptions Index (score 39); ranked 45th in Network Readiness Index 2025.'
      ]
    },
    {
      id: 'blk-3',
      type: 'exam_trap',
      content: '🎯 Exam Focus & Trap Alerts:\n1. 16th Finance Commission maintained 41% tax devolution (NOT 42% or 50%).\n2. Collateral-free MSME lending limit is ₹20 Lakh (raised from ₹10 Lakh).\n3. Policy corridor remains 50 bps (MSF 5.50% - SDF 5.00% around 5.25% Repo).\n4. DICGC insurance cap remains ₹5,00,000 per depositor per bank.'
    }
  ],
  metadata: {
    tags: ['current-affairs', 'revision', 'exam-traps', 'cheat-sheet', 'february-2026'],
    category: 'SEC11',
    sectionCode: 'SEC11',
    difficulty: 'medium',
    relevanceTier: 'TIER_A',
    date: '2026-02-15',
    provenance: {
      sourceSystem: 'CA',
      statutoryConcept: 'February 2026 Rapid Revision & One-Liners'
    }
  }
};

const filePath = path.join(corpusDir, febSec11Note.id + '.json');
fs.writeFileSync(filePath, JSON.stringify(febSec11Note, null, 2), 'utf-8');
console.log('Saved February Section 11 Note:', febSec11Note.id);

const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
const filtered = index.filter(i => i.id !== febSec11Note.id);
filtered.push({
  id: febSec11Note.id,
  domain: febSec11Note.domain,
  title: febSec11Note.title,
  summary: febSec11Note.summary,
  metadata: febSec11Note.metadata
});
fs.writeFileSync(indexPath, JSON.stringify(filtered, null, 2), 'utf-8');
console.log('Updated corpus-index.json with February SEC11 note. Total records:', filtered.length);

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
manifest.totalRecords = filtered.length;
manifest.lastUpdated = new Date().toISOString();
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log('Updated manifest.json.');
