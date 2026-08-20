/**
 * Builds August 2026 Section 11 Rapid Revision Unit from Claude's Core Notes
 */
const fs = require('fs');
const path = require('path');

const corpusDir = path.resolve('content/corpus');
const indexPath = path.resolve('content/corpus-index.json');
const manifestPath = path.resolve('content/manifest.json');

function main() {
  const itemId = 'ca-2026-08-sec11-rapid-revision-sheet';

  const knowledgeItem = {
    id: itemId,
    type: 'ca_note',
    domain: 'current-affairs',
    title: '🧠 August 2026 (1st–17th) Rapid Revision & Core Exam Traps Matrix',
    summary: 'Master Section 11 rapid recall cheat-sheet covering all 10 sections from 1st–17th August 2026.',
    blocks: [
      {
        id: 'blk-sec11-intro',
        type: 'paragraph',
        content: 'High-speed rapid recall matrix synthesized from Claude Framework v3.1 Core Notes for SBI PO Mains, IBPS PO Mains & Regulatory Officers 2026.'
      },
      {
        id: 'blk-sec11-tbl',
        type: 'table',
        headers: ['Section / Theme', 'Key Milestone / Outlay', 'Nodal Authority / Act', 'High-Yield Trap Alert 🎯'],
        rows: [
          ['1. ESI & Energy', '300.50 GW Non-Fossil Capacity', 'Ministry of Power / MNRE', '300.50 GW national capacity vs Brookfield $600M Lumara vs $32B total India investment.'],
          ['1. Microfinance', 'CGSMFI 2.0 (15% lending floor)', 'NCGTC / Govt of India', 'Lending floor raised to 15% of ₹20,000 Cr corpus.'],
          ['1. Banking Safety', 'Zero PSB locker thefts in FY26', 'RBI Circular / 12 PSBs', '100x annual locker rent liability cap on banks.'],
          ['1. Geographical Indications', '10,000 GI registrations by 2030', 'GI Act 1999 / DPIIT', 'UP (81) > Tamil Nadu (76) > Maharashtra (55). Darjeeling Tea = 1st GI.'],
          ['1. Digital Stack', 'DPDPA 2023 / SEBI CSCRF', 'MeitY / RBI / SEBI', 'Penalties: ₹250 Cr (security failure) + ₹200 Cr (breach notification failure).'],
          ['2. Regulatory (RBI)', 'NBFC-UL Scale Based Regs', 'RBI / Scale-Based Framework', 'Tata Sons required to list or surrender NBFC-UL classification.'],
          ['2. Capital Markets', 'Basel III Pillar 3 Disclosures', 'BCBS / RBI Guidelines', 'Unified qualitative and quantitative risk disclosure format.'],
          ['3. Banking & Deals', 'Jio Credit – BofA Deal (₹18,268 Cr)', 'Reliance Retail / BofA', '49.9% strategic stake acquisition.'],
          ['4. Environment', '101 Ramsar Sites in India', 'MoEFCC / Ramsar Convention', 'India reaches 101 registered Ramsar wetland sites.'],
          ['5. Apex Appointments', 'Varsha Aglawe (54th DG, GSI)', 'Geological Survey of India', '1st woman DG of GSI in its 176-year history.'],
          ['6. Defence & Tech', 'Agni-4 / EVEREST Engine / GARUDA', 'DRDO / ISRO / Indian Army', 'Agni-4 intermediate range ballistic missile successful flight test.'],
          ['7. Indices & Reports', 'Henley Passport / Food Security', 'Henley & Partners / EIU', 'Track India visa-free destinations and ranking progression.'],
          ['8. Key Observances', 'Organ Donation (Aug 3) / Handloom (Aug 7)', 'National Health / Textiles', 'Organ Donation Day moved to Aug 3 (1994 first heart transplant).'],
          ['9. Legislation', 'Prevention of Insults (Amendment) 2026', 'Ministry of Home Affairs', 'Vande Mataram protocol and standing statutory amendments.'],
          ['10. Govt Schemes', 'PM-SETU / PM-RAHAT / NAMASTE', 'MoSDE / MoRTH / MoSJE', 'PM-SETU ₹60,000 Cr ITI overhaul; RAHAT ₹1.5 Lakh Golden Hour trauma cover.']
        ]
      },
      {
        id: 'blk-sec11-focus',
        type: 'exam_trap',
        content: '🎯 Exam Focus: Review this sheet 48 hours prior to SBI PO Mains and IBPS PO Mains. Section 11 items are cross-linked across the homepage Rapid Revision Vault.'
      }
    ],
    metadata: {
      exam: ['SBI PO Mains 2026', 'IBPS PO Mains 2026', 'RBI Grade B 2026'],
      tags: ['current-affairs', '2026-08', 'sec11', 'rapid-revision', 'claude-v3'],
      category: 'SEC11',
      sectionCode: 'SEC11',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-17',
      provenance: {
        sourceSystem: 'Claude',
        sourceFile: 'current_affairs_Aug1-17_2026_CORE.md',
        sourceTitle: 'August 2026 Section 11 Rapid Revision Sheet'
      }
    },
    relationships: []
  };

  const filePath = path.join(corpusDir, `${itemId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(knowledgeItem, null, 2), 'utf-8');

  // Update corpus-index.json
  const currentIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const updatedIndex = [...currentIndex.filter(i => i.id !== itemId), {
    id: knowledgeItem.id,
    domain: knowledgeItem.domain,
    title: knowledgeItem.title,
    summary: knowledgeItem.summary,
    metadata: knowledgeItem.metadata
  }];

  fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2), 'utf-8');
  console.log(`✅ Published August Section 11 Rapid Revision unit! Total corpus: ${updatedIndex.length}`);

  // Update manifest
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  manifest.totalRecords = updatedIndex.length;
  manifest.lastUpdated = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
}

main();
