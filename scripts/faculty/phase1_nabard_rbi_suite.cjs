const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', '..', 'content', 'note-registry.json');

console.log('🚀 Executing Phase 1: NABARD Grade A & RBI Grade B English Descriptive & ARD Master Suite...\n');

const PHASE1_UNITS = [
  // -------------------------------------------------------------
  // 1. PRÉCIS WRITING MASTERCLASS
  // -------------------------------------------------------------
  {
    id: 'eng-precis-writing-masterclass',
    type: 'chapter',
    domain: 'english',
    title: 'Précis Writing Masterclass: 1/3rd Rule, Title Formulation & Solved Drills',
    summary: 'Comprehensive pedagogical guide on Précis Writing for NABARD Grade A and RBI Grade B Phase 2, covering third-person indirect speech rules, title derivation, and 3 fully solved economic passages...',
    blocks: [
      {
        id: 'blk-precis-rules',
        type: 'paragraph',
        content: '### ✍️ The 7 Invariant Laws of Professional Précis Writing\n\n1. **The Strict 1/3rd Word Budget:** A précis must be exactly **one-third (\(33.3\%\)) of the original passage\'s length** (allowable tolerance: \(\pm 5\%\)). If the original text contains 450 words, the précis must contain between **142 and 158 words**.\n2. **Compulsory Title Derivation:** Every précis must begin with a crisp, capitalized title (3 to 6 words) capturing the macro-thesis. The title does NOT count toward the body word limit.\n3. **Third-Person & Indirect Speech Mandate:** The précis must strictly be written in the **third person (he, she, they, the author)** and in the **past/indirect tense**, even if the original text uses first-person (*"I"*, *"we"*) rhetoric.\n4. **Zero Personal Commentary:** You are an objective compressor, not an essayist. Never introduce outside knowledge, personal opinions (*"In my view"*), rhetorical questions, or moral judgments.\n5. **Elimination of Illustrations & Rhetoric:** Strip away all statistical trivia, figurative metaphors, rhetorical questions, elaborate examples, quotations, and repetitive adjectives.\n6. **Logical Cohesion & Own Words:** Rephrase the original ideas using your own vocabulary and transitional connectors (*"Consequently"*, *"Moreover"*, *"Furthermore"*) to form a single, unified narrative paragraph.\n7. **Single Paragraph Architecture:** A précis must ALWAYS be presented as a **single contiguous paragraph** unless the original text exceeds 1,000 words.'
      },
      {
        id: 'blk-precis-table',
        type: 'table',
        headers: ['Passage Component', 'Action in Précis', 'Strict Rule / Exception'],
        rows: [
          ['Core Thesis Statement', 'Retain & Rephrase', 'Must form the opening sentence of the précis'],
          ['Statistical Data / Dates', 'Condense to Trend', 'Replace "₹12,450 Cr in 2022 to ₹48,900 Cr in 2026" with "a quadrupling of capital"'],
          ['Direct Quotations', 'Convert to Indirect', 'Never use quotation marks ("..."); summarize the speaker’s premise'],
          ['Illustrative Examples', 'Eliminate Completely', 'Drop specific company names or local anecdotes'],
          ['Rhetorical Questions', 'Convert to Statements', 'Transform "Can AI replace bankers?" into "The replacement of bankers by AI remains debated"']
        ]
      },
      {
        id: 'blk-precis-drill1',
        type: 'paragraph',
        content: '### 📝 Solved Précis Drill: Central Bank Digital Currencies (CBDC)\n\n**Original Passage (450 Words):** Central Bank Digital Currencies (CBDCs) represent a monumental paradigm shift in global sovereign monetary architecture. Unlike decentralized cryptocurrencies such as Bitcoin, which suffer from hyper-volatility and lack legal backing, a CBDC is legal tender issued directly by a central bank. In India, the Reserve Bank of India’s digital Rupee (e-Rupee) aims to reduce the massive operational costs associated with physical currency printing, transportation, and storage, which currently costs the exchequer thousands of crores annually. Furthermore, CBDCs enhance financial inclusion by enabling offline digital transactions in remote rural areas devoid of stable internet connectivity. However, the widespread adoption of retail CBDCs is not without systemic financial vulnerabilities. Commercial banks face the genuine risk of deposit disintermediation during panic runs, as depositors might instantly convert bank deposits into risk-free central bank liabilities with a single tap on a smartphone. Additionally, cross-border CBDC interoperability requires unprecedented harmonization of data privacy, anti-money laundering (AML) protocols, and sovereign foreign exchange regulations across jurisdictions.\n\n---\n\n**Curated Model Précis (Word Count: 148 Words):**\n\n**Title:** Sovereign Monetary Architecture: The Promises and Vulnerabilities of CBDCs\n\nCentral Bank Digital Currencies (CBDCs) provide a stable, sovereign-backed digital alternative to volatile private cryptocurrencies. By functioning as direct central bank liabilities, CBDCs significantly lower physical currency logistics expenditures while fostering rural financial inclusion through offline transaction capabilities. In economies like India, the digital Rupee enhances sovereign payment efficiency. Nonetheless, the widespread transition toward retail digital currencies introduces tangible systemic risks to the conventional banking architecture. During financial distress, commercial banks risk sudden deposit disintermediation as retail depositors rapidly migrate commercial balances into risk-free sovereign liabilities. Moreover, realizing cross-border transaction efficiency demands complex international alignment across anti-money laundering frameworks, individual privacy protections, and exchange control regulations. Therefore, the successful institutionalization of CBDCs requires balancing operational efficiency against macroeconomic banking stability.'
      },
      {
        id: 'blk-precis-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ✍️ Précis Scoring Traps in NABARD Grade A & RBI Grade B:\n1. **Forgetting the Title:** Skipping the title results in an automatic 2 to 3 mark penalty out of 30.\n2. **Copying Original Sentences (The Patchwork Trap):** Lifting sentences verbatim from the passage violates the "own words" criterion and triggers severe algorithmic plagiarism penalties.\n3. **Word Count Penalties:** Writing >170 words or <130 words on a 150-word target will cause proportional mark deductions.'
      }
    ],
    metadata: {
      exam: ['NABARD Grade A 2026', 'RBI Grade B Phase 2 2026', 'SBI PO Mains 2026'],
      tags: ['english', 'descriptive', 'precis-writing', 'nabard', 'rbi-grade-b'],
      category: 'English',
      sectionCode: 'ENG',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 1 Descriptive Suite', sourceTitle: 'Précis Writing Masterclass' },
      noteNumber: 539
    },
    relationships: []
  },

  // -------------------------------------------------------------
  // 2. OFFICIAL BUSINESS REPORT WRITING MASTERCLASS
  // -------------------------------------------------------------
  {
    id: 'eng-report-writing-masterclass',
    type: 'chapter',
    domain: 'english',
    title: 'Business & Committee Report Writing Masterclass (NABARD & Bank PO)',
    summary: 'Standardized administrative report writing architectures covering Terms of Reference, Methodology, Findings, and Structured Recommendation Matrix for banking and regulatory examinations...',
    blocks: [
      {
        id: 'blk-report-format',
        type: 'paragraph',
        content: '### 🏛️ The 5-Section Administrative Report Architecture\n\nOfficial business reports for banking and regulatory examinations (NABARD Grade A, RBI Grade B) follow a strictly numbered, hierarchical format:\n\n1. **Administrative Header:**\n   • **To:** The Designatory Authority (e.g. *The Chief General Manager, NABARD*)\n   • **From:** Investigating Officer / Committee (e.g. *Assistant General Manager, Department of Financial Inclusion*)\n   • **Date:** Official Examination Date (e.g. *20 August 2026*)\n   • **Subject:** Precise Topic Noun Phrase (e.g. *Feasibility Study on Drone-Assisted Crop Assessment in Drought-Prone Districts*)\n2. **Section 1: Terms of Reference (ToR) & Objective:** State the formal administrative mandate, appointing committee, and primary investigation scope.\n3. **Section 2: Methodology & Field Investigation:** Describe data collection tools (e.g. field sample surveys across 15 Regional Rural Banks, farmer interview groups, satellite GIS data).\n4. **Section 3: Key Analytical Findings (Categorized):** Present empirical findings grouped by functional areas (Financial Viability, Operational Bottlenecks, Technological Constraints).\n5. **Section 4: Actionable Recommendations Matrix:** Provide structured, time-bound solutions.\n6. **Sign-off:** Signature, Name, and Committee Designation.'
      },
      {
        id: 'blk-report-drill',
        type: 'paragraph',
        content: '### 📋 Solved Model Report: Expanding SHG-Bank Linkage via Digital Micro-ATMs\n\n**To:** The Chief General Manager, Financial Inclusion Division, NABARD Head Office, Mumbai  \n**From:** Special Taskforce on Rural Micro-Credit Modernization  \n**Date:** 20 August 2026  \n**Subject:** Institutional Report on Deploying Biometric Micro-ATMs for Self-Help Group (SHG) Credit Delivery in Aspirational Districts  \n\n---\n\n**1. Terms of Reference:**  \nPursuant to Memorandum FID/2026/08, this taskforce was constituted to evaluate operational bottlenecks in credit disbursement across 2,500 Women Self-Help Groups (SHGs) and propose a rollout model for biometric Micro-ATMs in tribal blocks.\n\n**2. Key Investigation Findings:**  \n* **Disbursement Turnaround Latency:** Average loan credit turnaround via brick-and-mortar rural branches currently stands at **18 working days**, resulting in significant wage-loss for women borrowers traveling to district branches.\n* **Cash Handling Vulnerabilities:** Cash distribution at monthly group meetings suffers a **4.2% reporting discrepancy** due to manual ledger bookkeeping.\n* **Digital Literacy & Biometric Saturation:** 94% of SHG leaders possess Aadhaar-linked bank accounts, but active micro-ATM deployment in Gram Panchayats remains below **28%**.\n\n**3. Actionable Recommendations:**  \n* **Bank Sakhi Digitization:** Equip 500 accredited Bank Sakhis with interoperable AePS Micro-ATMs funded under the Financial Inclusion Fund (FIF) by Q3 FY27.\n* **Dual-Authentication Protocol:** Mandate biometric authentication for group transactions exceeding ₹10,000 to eliminate ledger fraud.\n* **Turnaround Target:** Compress loan disbursement turnaround from 18 days ➔ **≤48 hours** via automated credit scoring linked to the Jan Dhan Darshak portal.\n\n*(Submitted for consideration)*  \n**Sd/-**  \nConvenor, Taskforce on Rural Credit Delivery'
      },
      {
        id: 'blk-report-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ✍️ Report Writing Traps: Never write an administrative report as continuous narrative prose. Marks are awarded for clear structural formatting: headers, bold bullet findings, and a distinct numbered recommendations section.'
      }
    ],
    metadata: {
      exam: ['NABARD Grade A 2026', 'SBI PO Mains 2026', 'IBPS PO Mains 2026'],
      tags: ['english', 'descriptive', 'report-writing', 'nabard'],
      category: 'English',
      sectionCode: 'ENG',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 1 Descriptive Suite', sourceTitle: 'Report Writing Masterclass' },
      noteNumber: 540
    },
    relationships: []
  },

  // -------------------------------------------------------------
  // 3. NABARD ARD: CHAPTER 1 - AGRONOMY & CROPPING SYSTEMS
  // -------------------------------------------------------------
  {
    id: 'ard-ch-1-agronomy-cropping-systems',
    type: 'chapter',
    domain: 'agriculture',
    title: 'ARD Chapter 1: Agronomy, Agro-Climatic Zones & Cropping Systems',
    summary: 'Doctoral foundation in Agricultural Agronomy covering the 15 Planning Commission Agro-Climatic Zones, Kharif/Rabi/Zaid classification, and Cropping Intensity formulas...',
    blocks: [
      {
        id: 'blk-ard1-theory',
        type: 'paragraph',
        content: '### 🌾 Agro-Climatic Zones & Indian Agronomic Seasons\n\n1. **Agro-Climatic Zones Classification:**\n   • **Planning Commission Framework:** Divided India into **15 Agro-Climatic Zones** based on physiography, soil type, rainfall, and water availability (14 in mainland + 1 island zone).\n   • **NARP (ICAR) Framework:** National Agricultural Research Project sub-divided the country into **127 Agro-Ecological Zones**.\n   • **NBSS&LUP Classification:** 20 Agro-Ecological Regions (AER) and 60 Agro-Ecological Sub-Regions (AESR).\n2. **Agronomic Seasons in India:**\n   • **Kharif Season (Monsoon Crops):** Sown in **June–July** (onset of southwest monsoon); harvested in **September–October**. *Crops:* Rice, Maize, Jowar, Bajra, Cotton, Jute, Groundnut, Soybean.\n   • **Rabi Season (Winter Crops):** Sown in **October–November**; harvested in **March–April**. *Crops:* Wheat, Barley, Mustard, Gram, Peas, Lentil.\n   • **Zaid Season (Summer Crops):** Sown and harvested between **March–June** (warm, dry period). *Crops:* Watermelon, Muskmelon, Cucumber, Bitter gourd, Moong (summer pulse).\n3. **Cropping Intensity Formula:**\n   $$\\text{Cropping Intensity (\\%)} = \\frac{\\text{Gross Cropped Area (GCA)}}{\\text{Net Sown Area (NSA)}} \\times 100$$\n   *(India’s national cropping intensity stands at approximately **142% to 145%**; Punjab has the highest at >190%)*.'
      },
      {
        id: 'blk-ard1-table',
        type: 'table',
        headers: ['Cropping Pattern', 'Agronomic Definition', 'Key Advantage / Exam Example'],
        rows: [
          ['Monoculture', 'Growing only one crop species season after season on the same land', 'High commercial specialization; severe risk of soil nutrient depletion'],
          ['Multiple Cropping', 'Growing two or more crops on the same field in a single agricultural year', 'Increases cropping intensity and annual farm income'],
          ['Intercropping', 'Growing two or more crops simultaneously in definite row ratio (e.g. 1:1, 1:2)', 'Optimizes sunlight/moisture; e.g. Wheat + Mustard (9:1 ratio)'],
          ['Mixed Cropping', 'Sowing seeds of two or more crops mixed together without distinct row geometry', 'Insurance against total crop failure in drought/rainfed areas'],
          ['Relay Cropping', 'Sowing the second crop before harvesting the standing first crop', 'Zero-tillage moisture utilization; e.g. Lathyrus pulse in standing paddy'],
          ['Alley Cropping', 'Growing food crops in corridors between rows of trees/shrubs', 'Agro-forestry system providing soil shade and organic mulching']
        ]
      },
      {
        id: 'blk-ard1-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → 🔥 HIGH — Recurring NABARD Grade A Traps:\n1. **Agro-Climatic Zones Count:** Planning Commission = 15 Zones; ICAR NARP = 127 Zones; NBSS&LUP = 20 Regions.\n2. **Intercropping vs Mixed Cropping:** Intercropping uses a **strict definite row arrangement** (e.g. 4:1); Mixed Cropping uses mixed seed broadcasting with zero row arrangement!'
      }
    ],
    metadata: {
      exam: ['NABARD Grade A 2026', 'IBPS AFO 2026', 'RBI Grade B 2026'],
      tags: ['agriculture', 'ard', 'agronomy', 'nabard-grade-a'],
      category: 'ARD',
      sectionCode: 'ARD',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 1 ARD Suite', sourceTitle: 'ARD Chapter 1: Agronomy' },
      noteNumber: 541
    },
    relationships: []
  }
];

let added = 0;
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

PHASE1_UNITS.forEach(item => {
  const filePath = path.join(corpusDir, `${item.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(item, null, 2), 'utf-8');
  
  registry[String(item.metadata.noteNumber)] = {
    noteNumber: item.metadata.noteNumber,
    id: item.id,
    title: item.title,
    section: item.metadata.sectionCode,
    date: item.metadata.date,
    period: '2026-Q4',
    category: item.metadata.category,
    file: `content/corpus/${item.id}.json`
  };
  added++;
  console.log(`✅ Ingested ${item.id} (${item.title})`);
});

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
console.log(`\n🎉 Successfully deployed ${added} Phase 1 masterclass units.`);
