const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', '..', 'content', 'note-registry.json');

console.log('🚀 Executing Phase 2 & Phase 3: RBI Grade B Quant PYQs & RPSC RAS Rajasthan State Suite...\n');

const PHASE2_AND_3_UNITS = [
  // -------------------------------------------------------------
  // PHASE 2: QUANT RBI GRADE B PYQs & ADVANCED DI
  // -------------------------------------------------------------
  {
    id: 'quant-rbi-grade-b-pyq-master-suite',
    type: 'quant_topic',
    domain: 'quant',
    title: 'RBI Grade B Phase 1 Quant Memory-Based PYQ Masterclass (2020–2025)',
    summary: 'Exhaustive 3-tier solved masterclass covering authentic RBI Grade B Phase 1 Quant questions: Missing NPA Recovery DI, Circular Track TSD, and Weighted Probability...',
    blocks: [
      {
        id: 'blk-rbi-pyq-1',
        type: 'paragraph',
        content: '### 📊 Question 1: Missing Arithmetic Caselet DI (Banking Asset Quality & Recovery)\n\n**Problem (RBI Grade B Memory-Based):** A commercial bank has total Gross NPAs of ₹12,000 Crore across three sectors: Agriculture, MSME, and Corporate in the ratio \(3:4:5\). In Agriculture, the bank recovers \(40\%\) of NPAs via Lok Adalats and DRTs, writes off \(25\%\), and the remainder is restructured. In MSME, total recovered amount is \(1.5\) times the Agricultural recovery, while restructured amount is \(20\%\) of MSME NPAs. In Corporate, the recovery through NCLT under IBC 2016 is \(₹1,800\text{ Crore}\). What is the ratio of Total Restructured NPAs across Agriculture and MSME combined to Total Corporate NPAs?\n\n---\n\n**3-Tier Solution:**\n\n* **Tier 1 (First Principles):**\n  1. Ratio \(3:4:5 \implies 3x + 4x + 5x = 12x = 12,000\text{ Cr} \implies x = 1,000\text{ Cr}\).\n  2. **Agriculture:** Total \(= ₹3,000\text{ Cr}\). Recovery \(= 40\% = ₹1,200\text{ Cr}\); Write-off \(= 25\% = ₹750\text{ Cr}\); Restructured \(= 3,000 - (1,200 + 750) = ₹1,050\text{ Cr}\).\n  3. **MSME:** Total \(= ₹4,000\text{ Cr}\). Recovery \(= 1.5 \times 1,200 = ₹1,800\text{ Cr}\); Restructured \(= 20\% \times 4,000 = ₹800\text{ Cr}\).\n  4. **Corporate:** Total \(= ₹5,000\text{ Cr}\).\n  5. Combined Agri + MSME Restructured \(= 1,050 + 800 = ₹1,850\text{ Cr}\).\n  6. Ratio \(= \frac{1,850}{5,000} = \frac{37}{100} = 37:100\).\n* **Tier 2 (Banking Mains Standard):** Set up a 3×3 matrix with columns [Recovery, Write-off, Restructured]. Fill row 1: \(3,000 \times [0.40, 0.25, 0.35] \implies \text{Restructured} = 1,050\). Fill row 2: \(4,000 \times [-, -, 0.20] \implies \text{Restructured} = 800\). Desired ratio \(= \frac{1,050 + 800}{5,000} = \frac{1,850}{5,000} = \frac{37}{100}\).\n* **Tier 3 (10-Second Elimination):** Check the numerator: Agri restructured is \(35\% \times 30 = 10.5\) units; MSME is \(20\% \times 40 = 8\) units. Total \(= 18.5\) units. Denominator is 50 units. \(\frac{18.5}{50} = \frac{37}{100}\). Option with numerator 37 is the immediate unique answer!'
      },
      {
        id: 'blk-rbi-pyq-2',
        type: 'paragraph',
        content: '### 🏃 Question 2: Circular Track Relative Speed & First Meeting Point\n\n**Problem:** Two runners A and B start simultaneously from the same point on a circular track of length 1,200 meters. A runs clockwise at \(15\text{ m/s}\) and B runs counter-clockwise at \(25\text{ m/s}\). After how many seconds will they meet for the **first time**, and how many distinct meeting points exist on the track?\n\n---\n\n**3-Tier Solution:**\n\n* **Tier 1 (First Principles):** Running in opposite directions \(\implies\) Relative Speed \(= 15 + 25 = 40\text{ m/s}\). Time to 1st meeting \(T_1 = \frac{\text{Track Length}}{\text{Relative Speed}} = \frac{1,200}{40} = 30\text{ seconds}\).\n* **Tier 2 (Distinct Meeting Points Formula):** Ratio of speeds in simplest integer terms: \(\frac{S_A}{S_B} = \frac{15}{25} = \frac{3}{5}\) (\(a = 3, b = 5\), where \(\gcd(a, b) = 1\)).\n  • When running in **Opposite Directions**, the number of distinct meeting points is \(a + b = 3 + 5 = 8\text{ points}\).\n  • *(If they were running in the **Same Direction**, distinct meeting points would be \(|a - b| = |3 - 5| = 2\text{ points}\))*.\n* **Tier 3 (Mental Rule):** 1st meeting = \(\frac{1,200}{40} = 30\text{ s}\); Distinct points = \(3 + 5 = 8\).'
      },
      {
        id: 'blk-rbi-pyq-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ Circular Track Invariants in RBI Grade B:\n1. **First Meeting at Starting Point:** Time taken to meet at the *starting point* for the first time is \(\text{LCM}\left(\frac{L}{S_A}, \frac{L}{S_B}\right) = \text{LCM}\left(\frac{1,200}{15}, \frac{1,200}{25}\right) = \text{LCM}(80, 48) = 240\text{ seconds}\).\n2. Don’t confuse: *First meeting anywhere on track* (30s) vs *First meeting at starting point* (240s) vs *Number of distinct meeting points* (8 points)!'
      }
    ],
    metadata: {
      exam: ['RBI Grade B Phase 1 2026', 'SBI PO Mains 2026', 'IBPS PO Mains 2026'],
      tags: ['quant', 'rbi-grade-b', 'pyq', 'data-interpretation', 'tsd'],
      category: 'Quant',
      sectionCode: 'QUANT',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 2 Quant Suite', sourceTitle: 'RBI Grade B Quant PYQs' },
      noteNumber: 546
    },
    relationships: []
  },

  // -------------------------------------------------------------
  // PHASE 3: RPSC RAS - RAJASTHAN STATE POLITY & ADMINISTRATION
  // -------------------------------------------------------------
  {
    id: 'ras-pol-ch-1-rajasthan-governor-cm-assembly',
    type: 'chapter',
    domain: 'polity',
    title: 'RAS Polity Chapter 1: Governor of Rajasthan, Chief Minister & State Legislative Assembly',
    summary: 'Exhaustive administrative guide for RPSC RAS Pre & Mains on the Governor of Rajasthan, CM Secretariat, Vidhan Sabha rules, and key historical milestones...',
    blocks: [
      {
        id: 'blk-ras-pol-1',
        type: 'paragraph',
        content: '### 🏛️ State Executive & Legislature of Rajasthan\n\n1. **Governor of Rajasthan (Articles 153–161):**\n   • **Historical Evolution:** The post of Governor in Rajasthan was created on **1 November 1956** (following the 7th Constitutional Amendment Act and the State Reorganisation Act, replacing the post of *Rajpramukh* held by Maharaja Sawai Man Singh II of Jaipur).\n   • **First Governor:** **Gurumukh Nihal Singh** (1 Nov 1956 – 16 Apr 1962, longest serving Governor of Rajasthan).\n   • **First Woman Governor:** **Pratibha Patil** (8 Nov 2004 – 21 Jun 2007; later 1st woman President of India).\n   • **Four Governors who died in office:** Darbara Singh (1998), Nirmal Chandra Jain (2003), S.K. Singh (2009), and Prabha Rau (2010).\n2. **Chief Minister & State Council of Ministers (Articles 163–167):**\n   • **First Nominated CM:** Hiralal Shastri (7 Apr 1949 – 5 Jan 1951).\n   • **First Democratically Elected CM:** Tikaram Paliwal (3 Mar 1952 – 31 Oct 1952).\n   • **Modern Rajasthan Builder:** Mohan Lal Sukhadia (served for ~17 years across 4 terms: 1954–1971).\n3. **Rajasthan Legislative Assembly (Vidhan Sabha):**\n   • **Seat Strength:** Initially 160 seats in 1st Assembly (1952) \(\to\) expanded to **200 seats** in the 6th Assembly (1977 onwards).\n   • **Seat Reservation:** SC: **34 seats**; ST: **25 seats**; General: 141 seats (Unicameral Legislature; zero Legislative Council).\n   • **First Speaker:** Narottam Lal Joshi; **First Deputy Speaker:** Lal Singh Shaktawat.'
      },
      {
        id: 'blk-ras-pol-1-table',
        type: 'table',
        headers: ['Constitutional Office', 'First Incumbent', 'Key Historical Milestone / Landmark Fact'],
        rows: [
          ['Governor of Rajasthan', 'Gurumukh Nihal Singh (1956)', 'Replaced the office of Rajpramukh on 1 Nov 1956'],
          ['First Woman Governor', 'Pratibha Patil (2004)', 'Resigned in 2007 to become President of India'],
          ['First Elected CM', 'Tikaram Paliwal (1952)', 'First general elections held in Jan 1952'],
          ['First Woman CM', 'Vasundhara Raje (2003)', 'Elected in 12th Rajasthan Legislative Assembly'],
          ['First Assembly Speaker', 'Narottam Lal Joshi', 'Elected from Jhunjhunu constituency']
        ]
      },
      {
        id: 'blk-ras-pol-1-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → 🔥 HIGH — RPSC RAS Recurring Traps:\n1. **First CM Distinction:** First *Nominated* CM = Hiralal Shastri (1949); First *Elected* CM = Tikaram Paliwal (1952); First person to be both Nominated and Elected CM = Jai Narayan Vyas.\n2. **Assembly Seats Evolution:** 1st Assembly = 160 seats; 200 seats reached in the 6th Assembly (1977).'
      }
    ],
    metadata: {
      exam: ['RPSC RAS Prelims 2026', 'RPSC RAS Mains 2026', 'Rajasthan Police SI'],
      tags: ['polity', 'rpsc-ras', 'rajasthan-polity', 'governor', 'vidhan-sabha'],
      category: 'Polity',
      sectionCode: 'POL',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 3 RAS Suite', sourceTitle: 'RAS Polity Chapter 1' },
      noteNumber: 547
    },
    relationships: []
  },

  // -------------------------------------------------------------
  // PHASE 3: RPSC RAS - RAJASTHAN HIGH COURT, RPSC & COMMISSIONS
  // -------------------------------------------------------------
  {
    id: 'ras-pol-ch-2-rajasthan-high-court-rpsc-commissions',
    type: 'chapter',
    domain: 'polity',
    title: 'RAS Polity Chapter 2: Rajasthan High Court, RPSC, SHRC & Lokayukta',
    summary: 'Comprehensive legal and constitutional guide on the Rajasthan High Court (Jodhpur/Jaipur Bench), RPSC (Satyanarayan Rao Committee), SHRC, and Lokayukta Act 1973...',
    blocks: [
      {
        id: 'blk-ras-pol-2',
        type: 'paragraph',
        content: '### ⚖️ Rajasthan Judicial Setup & Apex State Commissions\n\n1. **Rajasthan High Court (Article 214):**\n   • **Inauguration:** Inaugurated by Rajpramukh Maharaja Sawai Man Singh on **29 August 1949** at Jodhpur.\n   • **First Chief Justice:** **Justice Kamala Kant Verma** (sworn in with 11 judges).\n   • **Permanent Principal Seat & Bench:** Principal seat established at **Jodhpur**; Permanent Bench established at **Jaipur** on **31 January 1977** (under President\'s order based on Satyanarayan Rao Committee recommendation).\n   • **Sanctioned Judge Strength:** **50 Judges** (38 Permanent + 12 Additional).\n2. **Rajasthan Public Service Commission (RPSC - Article 315):**\n   • **Establishment:** Constituted on **20 August 1949** at Jaipur (later shifted to **Ajmer in 1956** on Satyanarayan Rao Committee recommendation).\n   • **First Chairman:** **Sir S.K. Ghosh** (Chief Justice of Rajasthan High Court held additional charge).\n   • **Composition:** 1 Chairman + **7 Members** (Total 8, appointed by Governor under Article 316; removal by President of India under Article 317).\n   • **Tenure:** **6 years or 62 years of age** (whichever is earlier).\n3. **Rajasthan State Human Rights Commission (SHRC):**\n   • **Notification:** Notified on **18 January 1999**; became functional on **23 March 2000** under Human Rights Protection Act, 1993.\n   • **First Chairperson:** **Justice Kanta Bhatnagar**.\n   • **Composition (2019 Amendment):** 1 Chairperson (former High Court Chief Justice or Judge) + **2 Members**.\n   • **Tenure:** **3 years or 70 years of age** (eligible for re-appointment).\n4. **Rajasthan Lokayukta and Up-Lokayuktas Act, 1973:**\n   • **Assent & Enactment:** Passed in 1973; received Presidential assent on **26 March 1973**; effective from **3 February 1973**.\n   • **First Lokayukta:** **Justice I.D. Dua** (appointed 28 Aug 1973); First Up-Lokayukta: K.P.U. Menon.\n   • **Jurisdiction Exclusions:** Chief Minister, Members of RPSC, High Court Judges, and Chief Election Officer are strictly **OUTSIDE Lokayukta jurisdiction**!'
      },
      {
        id: 'blk-ras-pol-2-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → 🔥 HIGH — RPSC RAS Top Traps:\n1. **Lokayukta Exclusion:** Chief Minister is strictly **EXCLUDED** from the Lokayukta\'s jurisdiction in Rajasthan (unlike Karnataka where CM is included).\n2. **RPSC Removal:** RPSC Chairman/Members are *appointed* by the **Governor**, but can be *removed* ONLY by the **President of India** (Article 317) on grounds of misbehavior after Supreme Court inquiry!'
      }
    ],
    metadata: {
      exam: ['RPSC RAS Prelims 2026', 'RPSC RAS Mains 2026'],
      tags: ['polity', 'rpsc-ras', 'high-court', 'rpsc', 'lokayukta', 'shrc'],
      category: 'Polity',
      sectionCode: 'POL',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 3 RAS Suite', sourceTitle: 'RAS Polity Chapter 2' },
      noteNumber: 548
    },
    relationships: []
  },

  // -------------------------------------------------------------
  // PHASE 3: RPSC RAS MAINS - COMPARATIVE CONSTITUTIONS
  // -------------------------------------------------------------
  {
    id: 'ras-pol-ch-4-comparative-constitutions',
    type: 'chapter',
    domain: 'polity',
    title: 'RAS Mains Paper III: Comparative Constitutions (UK, USA, Canada, Germany & Switzerland)',
    summary: 'Doctoral comparative jurisprudence matrix contrasting Parliamentary Sovereignty (UK), Dual Federalism & Due Process (USA), Asymmetric Federalism (Canada), and Direct Democracy (Switzerland)...',
    blocks: [
      {
        id: 'blk-comp-const-1',
        type: 'paragraph',
        content: '### 🌐 Comparative Constitutional Jurisprudence (RPSC RAS Mains Unit I)\n\n1. **United Kingdom (UK) — Parliamentary Sovereignty & Unwritten Constitution:**\n   • **Nature:** Evolutionary, uncodified (conventions, statutes like Magna Carta 1215, Bill of Rights 1689).\n   • **Sovereignty of Parliament (A.V. Dicey):** Parliament is legally omnipotent; no court can strike down an Act of Parliament (Primary Legislation cannot be subjected to judicial review on grounds of unconstitutionality).\n   • **Executive-Legislative Fusion:** Prime Minister and Cabinet are drawn entirely from Parliament (*Westminster Model*).\n2. **United States of America (USA) — Strict Separation of Powers & Judicial Supremacy:**\n   • **Nature:** World\'s oldest written constitution (1787, 7 Articles, 27 Amendments).\n   • **Strict Separation of Powers (Montesquieu):** Executive (President), Legislature (Congress = Senate + House of Reps), and Judiciary (Supreme Court) operate with institutional checks and balances.\n   • **Due Process of Law (5th & 14th Amendments):** US Supreme Court evaluates both *substantive fairness* and *procedural compliance* of laws (Marbury v. Madison 1803 established Judicial Review).\n   • **Dual Federalism & Dual Citizenship:** State citizens have separate state constitutions and state citizenship.\n3. **Switzerland — Direct Democracy Instruments:**\n   • **Referendum (Mandatory & Optional):** Citizens can vote directly on constitutional amendments (Mandatory) or laws passed by Federal Assembly (Optional, requiring 50,000 signatures).\n   • **Popular Initiative:** 100,000 citizens can propose a total or partial revision of the Federal Constitution.\n   • **Plural Executive (Federal Council):** 7-member collegial body; presidency rotates annually among the 7 members.'
      },
      {
        id: 'blk-comp-const-table',
        type: 'table',
        headers: ['Constitutional Feature', 'United Kingdom (UK)', 'United States (USA)', 'India (Synthesis)'],
        rows: [
          ['Constitution Type', 'Unwritten / Uncodified', 'Rigid Written (7 Articles)', 'Longest Written (395 Articles)'],
          ['Form of Government', 'Constitutional Monarchy', 'Presidential Republic', 'Parliamentary Republic'],
          ['Sovereignty / Supremacy', 'Parliamentary Sovereignty', 'Constitutional / Judicial Supremacy', 'Constitutional Supremacy (Synthesis of UK & US)'],
          ['Citizenship Model', 'Single Citizenship', 'Dual Citizenship (Federal + State)', 'Single Citizenship (Article 9)'],
          ['Judicial Review Standard', 'Zero Judicial Review of Acts', 'Due Process of Law (Substantive)', 'Procedure Established by Law (Art 21) + Due Process (Maneka Gandhi)']
        ]
      },
      {
        id: 'blk-comp-const-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ✍️ RPSC RAS Mains 10-Marker Model Answer Hook: *"The Indian Constitution synthesizes the British principle of Parliamentary Sovereignty with the American principle of Judicial Supremacy."* In India, Parliament can amend the Constitution under Article 368, but the Supreme Court exercises Judicial Review to invalidate any amendment violating the **Basic Structure Doctrine** (Kesavananda Bharati 1973).'
      }
    ],
    metadata: {
      exam: ['RPSC RAS Mains 2026', 'UPSC CSE 2026'],
      tags: ['polity', 'rpsc-ras', 'ras-mains', 'comparative-constitutions', 'uk', 'usa', 'switzerland'],
      category: 'Polity',
      sectionCode: 'POL',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 3 RAS Suite', sourceTitle: 'Comparative Constitutions' },
      noteNumber: 549
    },
    relationships: []
  },

  // -------------------------------------------------------------
  // PHASE 3: RPSC RAS - RAJASTHAN PHYSICAL GEOGRAPHY
  // -------------------------------------------------------------
  {
    id: 'ras-geo-ch-1-rajasthan-physical-divisions',
    type: 'chapter',
    domain: 'geography',
    title: 'RAS Geography Chapter 1: 4 Physical Divisions of Rajasthan & Aravalli Formations',
    summary: 'Exhaustive geospatial guide covering the Western Sandy Desert (Thar), Aravalli Range (Guru Shikhar 1,722m), Eastern Plains (56 Basin), and Hadoti Plateau...',
    blocks: [
      {
        id: 'blk-ras-geo-1',
        type: 'paragraph',
        content: '### 🏔️ The 4 Physical Physiographic Divisions of Rajasthan\n\n1. **Western Sandy Desert (Thar Desert - Marusthali):**\n   • **Area & Population:** Covers **61.11% of state area**; houses **40% of state population** (12 desert districts).\n   • **Rainfall:** Less than \(25\text{ cm}\) annual rainfall; characterized by sand dunes (*Barchans, Longitudinal, Transverse*).\n   • **Lathi Series:** Geohydrological fossil aquifer belt in Jaisalmer rich in *Sevan grass* (Lasiurus scindicus).\n   • **Akal Wood Fossil Park:** 180-million-year-old Jurassic fossils in Jaisalmer.\n2. **Aravalli Mountain Range (Relict Fold Mountains):**\n   • **Age & Extent:** World\'s oldest fold mountain range (Pre-Cambrian era, \(\sim 650\text{ Million Years}\)); runs **692 km from Khedbrahma (Gujarat) to Raisina Hill (Delhi)**; **550 km (\(80\%\)) lies in Rajasthan** (Khetri in Jhunjhunu to Khedbrahma in Sirohi).\n   • **Area & Population:** Covers **9.0% of state area**; houses **10% of population**.\n   • **Top Peak Heights (Descending Sequence):**\n     1. **Guru Shikhar:** **1,722 meters** (Sirohi - Mount Abu, "Colonel Todd called it *Santoon Ka Shikhar* / Peak of the Saints").\n     2. **Ser:** **1,597 meters** (Sirohi).\n     3. **Dilwara:** **1,442 meters** (Sirohi).\n     4. **Jarga:** **1,431 meters** (Udaipur).\n     5. **Achalgarh:** **1,380 meters** (Sirohi).\n     6. **Kumbhalgarh:** **1,224 meters** (Rajsamand).\n3. **Eastern Plains (Purvi Maidan):**\n   • **Area:** **23.03% of state area**; houses **39% of population** (highest population density).\n   • **Chappan Basin (Chappan Ka Maidan):** Formed by the Mahi River and its 56 village streams between Banswara and Pratapgarh.\n4. **South-Eastern Plateau (Hadoti Plateau):**\n   • **Area:** **6.86% of state area**; houses **11% of population**; volcanic black regur basalt soil; drained by the Chambal and its tributaries (Kali Sindh, Parbati).'
      },
      {
        id: 'blk-ras-geo-table',
        type: 'table',
        headers: ['Physiographic Division', 'Area (% of State)', 'Population (%)', 'Key Geological / Ecological Landmark'],
        rows: [
          ['Western Sandy Plains (Thar)', '61.11%', '40%', 'Lathi Series aquifer, Akal Fossil Park, Barchans dunes'],
          ['Aravalli Mountain Range', '9.00%', '10%', 'Guru Shikhar (1,722m), Great Indian Water Divide (50cm isohyet)'],
          ['Eastern Fertile Plains', '23.03%', '39%', 'Chappan Basin (Mahi river), Banas alluvial plains'],
          ['Hadoti (SE Basalt Plateau)', '6.86%', '11%', 'Mukundara Hills, Chambal ravines (Dang area), Black cotton soil']
        ]
      },
      {
        id: 'blk-ras-geo-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → 🔥 HIGH — RPSC RAS Top Traps:\n1. **Aravalli Length Split:** Total length = 692 km; Length in Rajasthan = **550 km (80%)**.\n2. **50 cm Isohyet Line:** The Aravalli range aligns with the **50 cm rainfall isohyet line**, dividing Rajasthan into two distinct climatic zones (Arid/Semi-Arid West vs Sub-Humid/Humid East)!'
      }
    ],
    metadata: {
      exam: ['RPSC RAS Prelims 2026', 'RPSC RAS Mains 2026', 'Rajasthan Police SI'],
      tags: ['geography', 'rpsc-ras', 'rajasthan-geography', 'aravalli', 'thar-desert'],
      category: 'Geography',
      sectionCode: 'GEO',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 3 RAS Suite', sourceTitle: 'RAS Geography Chapter 1' },
      noteNumber: 550
    },
    relationships: []
  }
];

let addedCount = 0;
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

PHASE2_AND_3_UNITS.forEach(item => {
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
  addedCount++;
  console.log(`✅ Ingested ${item.id} (${item.title})`);
});

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
console.log(`\n🎉 Successfully deployed ${addedCount} Phase 2 & Phase 3 masterclass units.`);
