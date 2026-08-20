const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', 'content', 'note-registry.json');

const SECTION_1_CURATION = {
  'ca-2026-q4-sec1-union-budget-2026-27-related-fiscal-announcem': {
    title: 'Union Budget 2026-27 & Fiscal Architecture',
    bullets: [
      '**Budget Presentation & Historic Landmark:** Finance Minister Nirmala Sitharaman presented her **9th consecutive Union Budget** for FY 2026-27 on 1 February 2026, becoming the longest-serving Finance Minister to deliver successive budgets.',
      '**Total Outlay & Capital Expenditure:** Total Union Budget expenditure is pegged at **₹50.65 Lakh Crore**, featuring a Capital Expenditure (Capex) outlay of **₹12.20 Lakh Crore** (~3.4% of GDP).',
      '**Fiscal Deficit Target:** Fiscal deficit target set at **4.3% of GDP for FY27** (down from 4.8% FY26 RE), maintaining the fiscal consolidation glide path toward sub-4.5%.',
      '**Digital Payments Subsidy:** Subsidy for zero-MDR UPI and RuPay debit card transactions fixed at **₹2,000 Crore for FY27** (down 8.9% from FY26 RE ₹2,196.21 Crore; peak ₹3,631 Cr in FY24).',
      '**Disinvestment Target:** Fixed at **₹80,000 Crore for FY27** (compared to ₹33,837 Crore in FY26 RE), anchored on strategic divestments in IDBI Bank and LIC.',
      '**Flagship Scheme Allocations:**\n• **PMAY-U 2.0 (Beneficiary-Led Construction):** Target expanded by 350% to **5,00,000 houses** with an outlay of **₹18,625 Crore** (+148%).\n• **Khelo India National Programme:** Highest-ever allocation of **₹4,479.88 Crore** (scheme core receives ₹924.35 Crore).\n• **NICDIT & Industrial Corridors:** Allocated **₹3,000 Crore** to establish the Integrated East Coast Industrial Corridor (anchored at Durgapur).\n• **Critical Mineral & Maritime Schemes:** Notified Rare Earth Industrial Corridors across 4 coastal states (Odisha, Kerala, Andhra Pradesh, Tamil Nadu) and operationalized the Container Manufacturing Assistance Scheme (CMAS).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — "UPI subsidy ₹2,000 Cr", "Disinvestment ₹80,000 Cr", "PMAY-U 5L homes / ₹18,625 Cr", and "FY27 Fiscal Deficit 4.3%" are standard direct MCQ targets.'
  },

  'ca-2026-q4-sec1-16th-finance-commission-report-tabled': {
    title: '16th Finance Commission Report — Devolution & Grants Architecture',
    bullets: [
      '**Constitutional Foundation & Tenet:** Constituted on 31 December 2023 under **Article 280** of the Constitution of India; Award Period covers 5 financial years from **1 April 2026 to 31 March 2031**.',
      '**Apex Leadership & Members:** Chaired by **Dr. Arvind Panagariya** (former Vice-Chairman, NITI Aayog); Secretary is **Ritvik Ranjanam Pandey**; Full-time Members include A.N. Jha, Annie George Mathew, Niranjan Rajadhyaksha, and Dr. Soumya Kanti Ghosh.',
      '**Vertical Devolution (Centre to States):** Recommends retaining **41% share** of the divisible central tax pool for States (unchanged since the 15th FC post-J&K reorganisation, where 1% was adjusted for UTs of J&K and Ladakh).',
      '**Horizontal Devolution Weights:** Income Distance (**45%**), 2011 Population (**15%**), Geographic Area (**15%**), Forest & Ecology (**10%**), Demographic Performance (**12.5%**), and Tax & Fiscal Effort (**2.5%**).',
      '**Grants-in-Aid & Disaster Financing:** Recommends targeted Sector-Specific & Performance Grants, Urban/Rural Local Body Grants, and Disaster Risk Management funding (SDRMF/NDRMF maintaining the 80:20 cost-sharing formula).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — "41% vertical share, Dr. Arvind Panagariya, Article 280, 2026-2031 award period" is the non-negotiable core trio; don\'t confuse 41% with 42% (14th FC).'
  },

  'ca-2026-q4-sec1-gdpcpiiip-growth-saga': {
    title: 'GDP, CPI, IIP & Fiscal Deficit Base-Year Saga (Consolidated Multi-Month Trajectory)',
    bullets: [
      '📊 **Base-Year Master Matrix (Deliberate Examiner Traps):**\n• **CPI Inflation:** New series base **2024 = 100** (Released 12 Feb 2026).\n• **GDP Series:** New series base **2022-23 = 100** (Released 27 Feb 2026).\n• **IIP Series:** New series base **2022-23 = 100** (Effective 28 May 2026).\n• **WPI Inflation:** Base year **unchanged at 2011-12 = 100** (Deliberate trap against CPI\'s new 2024 base!).',
      '📈 **Quarterly Growth & Inflation Trajectory (Jan ➔ Feb ➔ Mar):**\n• **GDP Growth (NSO 1st Advance Estimates):** Pegs real GDP growth at **7.4%** for FY26 (vs 6.5% FY25); India officially became the world’s **4th-largest economy (~$4.18 Trillion)**, overtaking Japan and on track to surpass Germany by 2030.\n• **CPI Inflation (2024 Base):** Jan 2026 at **2.75%** ➔ Feb 2026 rose to **3.21%** (Rural: 3.37%, Urban: 3.02%, Food Inflation: 3.47%).\n• **IIP Output:** Dec 2025 touched a 26-month high of **7.8%** ➔ Jan 2026 slowed down to **4.8% YoY** (sharp trend reversal).\n• **Eight Core Industries (ICI):** Jan 2026 grew **+4.0%** ➔ Feb 2026 eased to **+2.3%** (Core industries constitute **40.27%** of total IIP weight).\n• **WPI Inflation (2011-12 Base):** Jan 2026 at **1.81%** ➔ Feb 2026 at **2.13%**.',
      '⚖️ **Fiscal Deficit Revisions (Impact of New 2022-23 GDP Base):**\n• **FY25 Fiscal Deficit:** Revised from 4.80% ➔ **4.90%** of GDP (Nominal GDP = ₹318.07 Lakh Cr).\n• **FY24 Fiscal Deficit:** Revised from 5.63% ➔ **5.70%** of GDP (Nominal GDP = ₹289.84 Lakh Cr).\n• **FY23 Fiscal Deficit:** Revised from 6.40% ➔ **6.70%** of GDP.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — 1) Three distinct base years (CPI=2024, WPI=2011-12, GDP/IIP=2022-23); 2) IIP trend reversal (7.8% ➔ 4.8%); 3) CPI direction (2.75% ➔ 3.21% is an upward move); 4) Upward revised fiscal deficit trio (4.8➔4.9 / 5.63➔5.7 / 6.4➔6.7).'
  },

  'ca-2026-q4-sec1-india-eu-fta-concluded-26-jan-mfn-status-conf': {
    title: 'India-EU Free Trade Agreement (FTA) & MFN Framework',
    bullets: [
      '**Historic FTA Partner Status:** The European Union (EU) officially became India’s **22nd FTA partner** following the conclusion of bilateral negotiations on **26 January 2026**, ending 18 years of on-off trade talks.',
      '**Trade Volume & Economic Footprint:** The EU represents India’s 2nd-largest goods trading partner with bilateral trade exceeding **€120 Billion**, while cumulative EU FDI equity in India stands at over **€132 Billion (2024)**.',
      '**Banking Sector Concessions:** Under the pact, India agreed to permit EU banks to establish **15 branches over 4 years** (increased from the earlier regulatory cap of 12 branches).',
      '**Insurance FDI Binding:** The agreement binds foreign direct investment (FDI) in the insurance sector at **100%** under treaty commitments.',
      '**Bilateral Summits & Central Clearing Recognition:** 13 bilateral pacts were signed during the 16th India-EU Summit (attended by EU leaders António Costa and Ursula von der Leyen), alongside a landmark RBI-ESMA MoU on clearing house (CCIL) recognition.',
      '**Most Favoured Nation (MFN) Framework:** Both parties agreed to grant reciprocal **MFN status for 5 years** from the date of FTA enforcement, subject to a Joint Committee review in the 4th year (auto-terminates unless mutually extended).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — "22nd FTA partner" + "15 EU bank branches over 4 years" + "5-year MFN duration" is the testable core trio; do not confuse the treaty bound-commitment of 100% insurance FDI with the separate domestic Insurance Act reform.'
  },

  'ca-2026-q4-sec1-disinvestment-pfc-rec-merger-trade-index-reba': {
    title: 'PFC-REC Merger & Trade Index Rebasing',
    bullets: [
      '**PFC-REC Amalgamation Proposal:** The Board of Directors of Power Finance Corporation (PFC) cleared the formal merger proposal with its subsidiary REC Limited (PFC holds a 52.63% controlling stake in REC, acquired for ₹14,500 Crore in March 2019).',
      '**Merchandise Trade Index Base Revision:** Directorate General of Commercial Intelligence and Statistics (DGCI&S) revised India’s merchandise trade index base year from **2012-13 ➔ 2022-23**.',
      '**Expert Committee Leadership:** The trade index rebasing was formulated based on recommendations of an expert committee chaired by Prof. Nachiketa Chattopadhyay of the Indian Statistical Institute (ISI) Kolkata.'
    ],
    examTrap: '🎯 Exam Angle → PFC controlling stake in REC is 52.63%; DGCI&S merchandise trade index new base year is 2022-23 (Nachiketa Chattopadhyay Committee).'
  },

  'ca-2026-q4-sec1-key-scheme-decisions-milestones-janfeb': {
    title: 'National Scheme Reforms & Banking Milestones (Jan–Feb)',
    bullets: [
      '**Lakhpati Didi Target Doubled (DAY-NRLM):** National target doubled from 3 Crore ➔ **6 Crore Lakhpati Didis by March 2029** under the Ministry of Rural Development (initial 3 Cr target achieved ahead of the March 2027 deadline; enables rural SHG women to earn ≥₹1 Lakh net income annually).',
      '**Agriculture Infrastructure Fund (AIF) Expansion:** Loan financing target doubled from ₹1 Lakh Crore ➔ **₹2 Lakh Crore** under the Ministry of Agriculture (provides 3% interest subvention on loans up to ₹2 Crore for 7 years; Punjab leads national state leaderboard).',
      '**SIDBI Equity Capital Infusion:** Union Cabinet approved **₹5,000 Crore equity support** to SIDBI in 3 annual tranches via the Department of Financial Services (DFS) to expand credit delivery to MSMEs.',
      '**National Tailings Policy for Critical Minerals:** Approved India’s first regulatory policy framework for secondary extraction of critical minerals (Lithium, Cobalt, Rare Earth Elements) from legacy mine waste dumps (administered by IBM, CMPDI, AMD).',
      '**Historic Bank Credit Milestone:** Total outstanding commercial bank credit crossed **₹200 Lakh Crore** for the first time in Indian history (reached **₹203.2 Lakh Crore** at end-Dec 2025, recording +14.5% YoY growth).',
      '**Labour Force Indicators:** All-India Unemployment Rate stood at **4.8%** in December 2025 as per Periodic Labour Force Survey (PLFS) monthly indicators.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Lakhpati Didi target is 6 Crore by March 2029 (not 2027); AIF loan target is ₹2 Lakh Crore with 3% subvention; Bank credit milestone crossed ₹200 Lakh Crore.'
  },

  'ca-2026-q4-sec1-economic-stabilisation-fund-1-lakh-crore-fisc': {
    title: 'Economic Stabilisation Fund — ₹1 Lakh Crore Fiscal Buffer',
    bullets: [
      '**Strategic Contingency Purpose:** Established as a dedicated fiscal shock-absorber to insulate the domestic economy against geopolitical instability, West Asian crude oil spikes, and global supply disruptions without breaching the budgeted fiscal deficit target.',
      '**Total Corpus Architecture:** Total fund size established at **₹1 Lakh Crore** (~$12 Billion).',
      '**Two-Pronged Funding Split:** Financed via **~₹57,000 Crore in fresh cash allocation** (approved through Supplementary Demands for Grants) + **~₹43,000 Crore in savings and reallocations** across union ministries.',
      '**Legislative Enactment:** Passed and approved under the second batch of FY26 Supplementary Demands for Grants alongside the Appropriation Bill 2026.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Total corpus (₹1 Lakh Crore) vs Fresh Cash component (~₹57,000 Crore) is a prime examiner trap pairing.'
  },

  'ca-2026-q4-sec1-income-tax-rules-2026': {
    title: 'Income Tax Rules 2026 — Direct Tax Overhaul',
    bullets: [
      '**Statutory Scope & Rationalization:** Effective from **1 April 2026**; operationalises the simplified Income-tax Act 2025, slashing total sections from **819 ➔ 536**, chapters from **47 ➔ 23**, and total statutory word count by ~50% (5.12 Lakh ➔ 2.6 Lakh words).',
      '**Metro HRA City Slabs Expanded:** Extended 50% House Rent Allowance (HRA) deduction eligibility from 4 traditional metros (Delhi, Mumbai, Kolkata, Chennai) ➔ **8 Metro Cities** (adding Bengaluru, Hyderabad, Pune, and Ahmedabad).',
      '**PAN-Linked High-Value Reporting:** Daily ₹50,000 cash transaction reporting threshold replaced with a comprehensive annual aggregate reporting threshold of **₹10 Lakh/year** linked to PAN for banking, real estate, and high-value financial dealings.',
      '**Corporate Compliance & Bond Norms:** Mandates that corporate dividends are payable exclusively through domestic banking channels; requires 7-year audit-trail retention for stock exchanges; Zero-Coupon Bonds require 3-month pre-approval backed by two investment-grade rating agencies.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — 819➔536 sections; 8 Metro HRA cities (added Bengaluru, Hyderabad, Pune, Ahmedabad); PAN cash reporting threshold shifted to ₹10 Lakh annual aggregate.'
  },

  'ca-2026-q4-sec1-insolvency-and-bankruptcy-code-amendment-bill': {
    title: 'Insolvency and Bankruptcy Code (Amendment) Act, 2026',
    bullets: [
      '**Legislative Passage & Enactment:** Passed by Lok Sabha (30 March 2026) and Rajya Sabha (1 April 2026); received Presidential assent on 6 April 2026 (Act No. 6 of 2026); formulated on Select Committee recommendations chaired by **Baijayant Panda**.',
      '**Creditor-Led Resolution (CIIRP):** Inserts Chapter IV-A enabling a Creditor-Led Resolution Process requiring ≥51% financial creditor approval, governed by a strict timeline of **150 days (+45-day extension)** while existing promoters continue operations under Resolution Professional oversight.',
      '**Accelerated Judicial Timelines:** NCLT must admit or reject insolvency petitions under Sections 7, 9, and 10 within **14 days**, and approve submitted resolution plans within **30 days**.',
      '**Liquidation Windows & Liquidator Removal:** Liquidation process must conclude within **180 days (+90-day extension)**; Committee of Creditors (CoC) authorized to replace liquidators with a **66% voting majority**.',
      '**CIRP Revival Window:** Permits one-time revival of the Corporate Insolvency Resolution Process (CIRP) within **120 days** prior to liquidation commencement.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — CIIRP timeline (150+45 days) vs Liquidation timeline (180+90 days) confusion pair; CoC liquidator replacement vote is 66% (not 75%).'
  },

  'ca-2026-q4-sec1-dirghavadhi-krishak-punji-sahakar-yojana': {
    title: 'Dirghavadhi Krishak Punji Sahakar Yojana',
    bullets: [
      '**Scheme Mandate & Administration:** Long-term agricultural cooperative credit scheme launched by the National Cooperative Development Corporation (NCDC) under the Ministry of Cooperation to provide multi-year capital finance to farming societies.',
      '**Statutory Recovery Powers:** Loan recoveries under the scheme are legally backed by enforcement mechanisms under the **SARFAESI Act, 2002** and Debt Recovery Tribunals (DRT).',
      '**Institutional Lineage & Static GK:** NCDC was established as a statutory body in **1963** under the NCDC Act; the Ministry of Cooperation was carved out as a dedicated Union Ministry in **July 2021**.'
    ],
    examTrap: '🎯 Exam Angle → NCDC founding year (1963) vs Ministry of Cooperation formation (2021); loan recovery via SARFAESI Act 2002.'
  },

  'ca-2026-q4-sec1-239th-cbt-meeting-epf-interest-rate-825': {
    title: '239th CBT Meeting — EPF Interest Rate 8.25%',
    bullets: [
      '**Interest Rate Recommendation:** Central Board of Trustees (CBT) of EPFO recommended an interest rate of **8.25% on Employees’ Provident Fund (EPF) deposits** for FY 2025-26 under the chairmanship of Union Labour Minister Dr. Mansukh Mandaviya.',
      '**Regulatory Scheme Modernization:** Approved the consolidated EPF/EPS/EDLI Scheme 2026 guidelines to streamline social security benefits.',
      '**Inoperative Account Auto-Settlement:** Rolled out an Amnesty Scheme alongside an automated claim settlement pilot for inoperative EPF accounts maintaining balances **≤₹1,000**.'
    ],
    examTrap: '🎯 Exam Angle → EPF interest rate for FY 2025-26 fixed at 8.25%; auto-settlement threshold is ≤₹1,000.'
  },

  'ca-2026-q4-sec1-export-promotion-mission-e-commerce-msme-cred': {
    title: 'Export Promotion Mission — E-Commerce MSME Credit & MSE-GIFT',
    bullets: [
      '**Export Credit Outlay & Slabs:** Export Promotion Mission launched with a total outlay of **₹25,060 Crore** to expand concessional trade finance for e-commerce MSME exporters.',
      '**Credit Quantum Formulas:** Direct export credit capped at **20% of average 2-year export sales**, while overseas warehouse inventory financing is supported up to **50% of inventory valuation** (interest subvention capped at **₹15 Lakh per beneficiary per year** via Exim Bank and NCGTC).',
      '**MSE-GIFT Scheme Synergy:** Linked to the **MSE-GIFT Scheme** (Green Investment and Financing for Transformation), offering a **2% interest subvention** for adopting clean and energy-efficient manufacturing technologies.'
    ],
    examTrap: '🎯 Exam Angle → Export Promotion Mission total outlay: ₹25,060 Crore; subvention cap ₹15 Lakh/year; MSE-GIFT interest subvention is 2%.'
  },

  'ca-2026-q4-sec1-finance-ministry-restructures-mps-norms': {
    title: 'Finance Ministry Restructures MPS Norms',
    bullets: [
      '**Statutory Rule Amendment:** Ministry of Finance amended the Securities Contracts (Regulation) Rules, 1957 to restructure Minimum Public Shareholding (MPS) compliance criteria.',
      '**Post-Issue Capital Slabs Doubled:** Expanded post-issue market capitalisation compliance slabs from **3 ➔ 6 slabs**, providing staggered compliance glide paths ranging from **3 to 10 years**.',
      '**Minimum Public Offer Sizing:** Minimum public equity/debenture dilution threshold reduced from **5% ➔ 2.5%** for mega-cap public listings.'
    ],
    examTrap: '🎯 Exam Angle → Minimum Public Shareholding (MPS) post-issue slabs expanded from 3 to 6 slabs; minimum offer threshold lowered from 5% to 2.5%.'
  },

  'ca-2026-q4-sec1-wto-global-trade-outlook-march-2026': {
    title: 'WTO Global Trade Outlook (March 2026)',
    bullets: [
      '**Global Merchandise Trade Projections:** World Trade Organization (WTO) projected global merchandise trade growth to decelerate to **1.9% in 2026** (down from 4.6% in 2025), before staging a recovery to **2.6% in 2027**.',
      '**Global GDP Estimates:** Global GDP growth estimated at **2.8% in both 2026 and 2027** (compared to 2.9% in 2025).',
      '**Institutional Static GK:** WTO established on **1 January 1995** (Marrakesh Agreement); Headquarters located in **Geneva, Switzerland**; Director-General is **Dr. Ngozi Okonjo-Iweala**.'
    ],
    examTrap: '🎯 Exam Angle → WTO 2026 merchandise trade growth forecast is 1.9% (down from 4.6%); DG Dr. Ngozi Okonjo-Iweala.'
  },

  'ca-2026-q4-sec1-rodtep-restored': {
    title: 'RoDTEP Scheme Rate Restoration',
    bullets: [
      '**Full Rate Restoration:** Ministry of Finance restored full remission rates under the Remission of Duties and Taxes on Exported Products (RoDTEP) scheme effective **23 March 2026**, completely withdrawing the prior 50% rate cap.',
      '**Administrative Oversight:** Administered by the Department of Revenue (Ministry of Finance); designed to refund un-rebated central, state, and local embedded levies on exported merchandise.',
      '**Institutional Predecessor:** Replaced the erstwhile **Merchandise Exports from India Scheme (MEIS)** to ensure WTO compliance.'
    ],
    examTrap: '🎯 Exam Angle → RoDTEP replaced the erstwhile MEIS scheme; full rates restored effective 23 March 2026.'
  },

  'ca-2026-q4-sec1-pm-e-drive-revised': {
    title: 'PM E-DRIVE Scheme Guidelines Revision',
    bullets: [
      '**Outlay & Operational Scope:** Prime Minister’s Electric Drive Revolution in Innovative Vehicle Enhancement (PM E-DRIVE) operational with a total outlay of **₹10,900 Crore** under the Ministry of Heavy Industries.',
      '**Staggered Registration Deadlines:** Subsidised vehicle registration window extended up to **31 July 2026 for electric two-wheelers (e-2W)**, and up to **31 March 2028 for electric three-wheelers (e-3W)**.',
      '**Incentive Vehicle Price Ceilings:** Ex-factory vehicle price caps eligible for central subsidies fixed at **₹1.5 Lakh for e-2W** and **₹2.5 Lakh for e-3W**.'
    ],
    examTrap: '🎯 Exam Angle → PM E-DRIVE total outlay: ₹10,900 Crore; e-2W registration deadline (31 July 2026) vs e-3W deadline (31 March 2028).'
  },

  'ca-2026-q4-sec1-essential-commodities-act-invoked-for-gas-all': {
    title: 'Essential Commodities Act: 4-Tier Gas Allocation Framework',
    bullets: [
      '**Statutory Invocation & Trigger:** Ministry of Petroleum and Natural Gas invoked Section 5 delegation powers under the **Essential Commodities Act (ECA), 1955** to establish a nationwide emergency gas allocation grid in response to West Asian geopolitical supply strains.',
      '**4-Tier Priority Allocation Grid:**\n• **Priority 1 (100% Supply):** Domestic Piped Natural Gas (PNG), Compressed Natural Gas (CNG-Transport), and LPG domestic bottling.\n• **Priority 2 (70% Supply Cap):** Agricultural fertilizer manufacturing units.\n• **Priority 3 (80% Supply Cap):** National Gas Grid transmission networks.\n• **Priority 4 (80% Supply Cap):** Industrial and commercial City Gas Distribution (CGD) entities.',
      '**LPG Refill Cooling Period:** Mandatory minimum cooling period between consecutive domestic LPG cylinder refills increased from **21 days ➔ 25 days**.'
    ],
    examTrap: '🎯 Exam Angle → LPG domestic cylinder refill waiting window increased from 21 to 25 days; Section 5 of ECA 1955.'
  },

  'ca-2026-q4-sec1-6th-phase-gold-hallmarking': {
    title: '6th Phase Mandatory Gold Hallmarking',
    bullets: [
      '**Phase VI Geographic Expansion:** Bureau of Indian Standards (BIS) implemented the 6th phase of mandatory gold hallmarking across **7 newly notified districts** (Rupnagar in Punjab, Banda in UP, Beed in Maharashtra, Gomati in Tripura, Katihar in Bihar, Beawar in Rajasthan, and Neemuch in MP).',
      '**Purity Standards & Traceability:** 9-karat gold jewellery retains voluntary hallmarking status; all certified gold jewellery must carry a unique **6-digit alphanumeric HUID** (Hallmark Unique Identification) verifiable through the BIS CARE mobile application.'
    ],
    examTrap: '🎯 Exam Angle → Gold hallmarking is regulated by the Bureau of Indian Standards (BIS); HUID is a 6-digit alphanumeric code.'
  },

  'ca-2026-q4-sec1-census-2027': {
    title: 'Census 2027 Disability Enumeration Framework',
    bullets: [
      '**Universal Disability Enumeration:** Census 2027 will formally enumerate all **21 recognized categories of disabilities** specified under the Rights of Persons with Disabilities (RPwD) Act, 2016.',
      '**Nodal Governance:** Implemented under the aegis of the Ministry of Social Justice & Empowerment (MoS Ramdas Athawale) in coordination with the Office of the Registrar General & Census Commissioner of India (Ministry of Home Affairs).'
    ],
    examTrap: '🎯 Exam Angle → Census 2027 covers all 21 disability categories recognized under the RPwD Act 2016 (expanded from 7 categories in 2011).'
  },

  'ca-2026-q4-sec1-tamil-nadu-becomes-indias-top-textile-exporte': {
    title: 'National Textile Export Rankings (FY25)',
    bullets: [
      '**Tamil Nadu Clinches Rank 1:** Tamil Nadu emerged as India’s largest textile exporter in FY25 with exports reaching **$7,997.17 Million** (recording a 29.12% growth over 4 years), as per NIRYAT / DPIIT trade data.',
      '**National State Podium:** **Gujarat ranked 2nd** ($5,646.01 Million) followed by **Maharashtra at Rank 3** ($3,831.29 Million).'
    ],
    examTrap: '🎯 Exam Angle → Top 3 textile exporting states: 1) Tamil Nadu ($7.99Bn), 2) Gujarat ($5.64Bn), 3) Maharashtra ($3.83Bn).'
  },

  'ca-2026-q4-sec1-fcra-amendment-bill-cleared-by-cabinet': {
    title: 'FCRA Amendment Bill 2026 Cleared by Cabinet',
    bullets: [
      '**Statutory Insertion (Section 14B):** Union Cabinet cleared the Foreign Contribution (Regulation) Amendment Bill, inserting **Section 14B** to provide for deemed statutory cessation of NGO registration upon license expiry, refusal, or non-renewal.',
      '**Penal Rationalization:** Maximum imprisonment penalty for receiving unauthorized foreign donations rationalized and capped at **1 year** with proportionate monetary fines.'
    ],
    examTrap: '🎯 Exam Angle → FCRA Amendment inserts Section 14B for deemed license cessation; maximum imprisonment capped at 1 year.'
  },

  'ca-2026-q4-sec1-aif-scheme-punjab-tops-state-leaderboard': {
    title: 'Agriculture Infrastructure Fund (AIF) State Leaderboard',
    bullets: [
      '**State Leadership Ranking:** Punjab emerged as the top-performing state across India in sanctioned Agriculture Infrastructure Fund projects since 2024-25, followed by Madhya Pradesh, Maharashtra, Uttar Pradesh, and Haryana.',
      '**National Corpus & Disbursement:** Total national loan target doubled to **₹2 Lakh Crore**, with over ₹1 Lakh Crore already disbursed via commercial lending institutions through FY 2025-26.',
      '**Financial Subvention & Credit Support:** Provides an attractive **3% per annum interest subvention** on bank loans up to ₹2 Crore for a maximum repayment period of 7 years, backed by CGTMSE and NABSanrakshan credit guarantees.'
    ],
    examTrap: '🎯 Exam Angle → Punjab ranks #1 in AIF project sanctions; total loan target is ₹2 Lakh Crore with 3% interest subvention up to ₹2 Crore.'
  },

  'ca-2026-q4-sec1-pm-ebus-sewa-scheme': {
    title: 'PM-eBus Sewa Scheme',
    bullets: [
      '**National Fleet Deployment:** Approved for deploying **10,000 Electric AC Buses** across 116 Tier-2 and Tier-3 cities in 26 States/UTs by end-2027 under the Ministry of Housing and Urban Affairs (MoHUA).',
      '**Financial Outlay Architecture:** Total estimated project cost is **₹57,613 Crore**, backed by **₹20,000 Crore in direct Central Government support** with remaining financing mobilized via Public-Private Partnerships (PPP).',
      '**Operational Viability Backing:** Operates on a 10-year operational concession model where private bus operators receive per-kilometer viability gap funding.'
    ],
    examTrap: '🎯 Exam Angle → Total project cost ₹57,613 Crore vs Central support ₹20,000 Crore; targets cities with population between 3 Lakh to 40 Lakh.'
  },

  'ca-2026-q4-sec1-pm-internship-scheme-pmis-pilot-revised': {
    title: 'PM Internship Scheme (PMIS) Pilot Revision',
    bullets: [
      '**Stipend & Duration Restructuring:** Ministry of Corporate Affairs revised the PM Internship Scheme pilot guidelines effective **12 March 2026**, raising monthly financial assistance from ₹5,000 ➔ **₹9,000 per month**.',
      '**Duration & Eligibility Realignment:** Internship duration adjusted from a rigid 1-year tenure ➔ **6 to 9 months**, while the eligible candidate age bracket was broadened from 21–24 years ➔ **18 to 25 years**.',
      '**CSR-Corporate Scale:** Targets providing 1 Crore youth with practical corporate internships over 5 years across India’s Top 500 CSR-spending enterprises.'
    ],
    examTrap: '🎯 Exam Angle → Monthly stipend increased to ₹9,000; eligible age bracket broadened to 18–25 years; duration revised to 6–9 months.'
  }
};

console.log('Writing all 24 curated Section 1 notes to content/corpus/...\n');

let updated = 0;
for (const [id, data] of Object.entries(SECTION_1_CURATION)) {
  const filePath = path.join(corpusDir, `${id}.json`);
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    existing.title = data.title;
    existing.blocks = [
      {
        id: `blk-${id}-bullets`,
        type: 'bullet_list',
        items: data.bullets
      },
      {
        id: `blk-${id}-trap`,
        type: 'exam_trap',
        content: data.examTrap
      }
    ];
    existing.summary = data.bullets[0].substring(0, 160) + '...';
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
    updated++;
  } else {
    console.warn(`File not found: ${filePath}`);
  }
}

console.log(`✅ Successfully updated all ${updated} Section 1 notes with approved curation.`);
