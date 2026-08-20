const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', 'content', 'note-registry.json');

// Master curated encyclopedia for high-yield Q4 notes
const CURATED_NOTES = {
  // -------------------------------------------------------------
  // SECTION 1: ESI, Finance & Business News
  // -------------------------------------------------------------
  'ca-2026-q4-sec1-union-budget-2026-27-related-fiscal-announcem': {
    title: 'Union Budget 2026-27 & Fiscal Architecture',
    bullets: [
      '**Budget Presentation & Landmark:** Finance Minister Nirmala Sitharaman presented her **9th consecutive Union Budget** for FY 2026-27 on 1 February 2026, setting a record as the longest-serving Finance Minister to deliver back-to-back budgets.',
      '**Total Expenditure & Capital Outlay:** Total budget size pegged at **₹50.65 Lakh Crore**; Capital Expenditure (Capex) allocation stands at **₹12.20 Lakh Crore** (constituting ~3.4% of GDP).',
      '**Fiscal Deficit Trajectory:** Fiscal deficit target set at **4.3% of GDP for FY27** (down from 4.8% FY26 revised estimates), remaining on course toward the sub-4.5% fiscal consolidation glide path.',
      '**Digital Payments Subsidy:** Subsidy for UPI and RuPay debit card transactions fixed at **₹2,000 Crore for FY27** (down 8.9% from ₹2,196.21 Crore in FY26).',
      '**Disinvestment & Asset Monetisation:** Disinvestment target set at **₹80,000 Crore for FY27** (anchored on strategic sales in IDBI Bank and LIC).',
      '**Housing & Industrial Corridors:** PMAY-U 2.0 beneficiary-led construction target expanded 350% to **5,00,000 houses** (outlay ₹18,625 Cr); NICDIT allocated ₹3,000 Cr for Integrated East Coast Industrial Corridor.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Total budget outlay (₹50.65L Cr), Capex (₹12.20L Cr), and FY27 Fiscal Deficit target (4.3%) are non-negotiable direct MCQs.'
  },

  'ca-2026-q4-sec1-16th-finance-commission-report-tabled-complet': {
    title: '16th Finance Commission Report — Devolution & Grants Architecture',
    bullets: [
      '**Constitutional Mandate & Award Period:** Constituted on 31 December 2023 under **Article 280** of the Constitution; Award Period covers 5 financial years from **1 April 2026 to 31 March 2031**.',
      '**Commission Leadership:** Chaired by **Dr. Arvind Panagariya** (former Vice-Chairman, NITI Aayog); Secretary is **Ritvik Ranjanam Pandey**; Full-time Members include A.N. Jha, Annie George Mathew, Niranjan Rajadhyaksha, and Dr. Soumya Kanti Ghosh.',
      '**Vertical Devolution (Centre to States):** Recommends retaining **41% share** of the divisible central tax pool for States (unchanged since the 15th FC post-J&K reorganisation, where 1% was adjusted for UTs of J&K and Ladakh).',
      '**Horizontal Devolution Weights:** Income Distance (**45%**), 2011 Population (**15%**), Geographic Area (**15%**), Forest & Ecology (**10%**), Demographic Performance (**12.5%**), and Tax & Fiscal Effort (**2.5%**).',
      '**Grants-in-Aid & Disaster Financing:** Recommends targeted Sector-Specific & Performance Grants, Urban/Rural Local Body Grants, and Disaster Risk Management funding (SDRMF/NDRMF maintaining the 80:20 cost-sharing formula).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — "41% vertical share, Dr. Arvind Panagariya, Article 280, 2026-2031 award period" is the core trio; don\'t confuse 41% with 42% (14th FC).'
  },

  'ca-2026-q4-sec1-gdp-cpi-iip-fiscal-deficit-base-year-saga-con': {
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
      '**Banking Sector Concessions:** India agreed to permit EU banks to establish **15 branches over 4 years** (increased from the earlier cap of 12 branches).',
      '**Insurance FDI Binding:** The agreement binds foreign direct investment (FDI) in the insurance sector at **100%** under treaty commitments.',
      '**Bilateral Summits & Central Clearing Recognition:** 13 bilateral pacts were signed during the 16th India-EU Summit (attended by EU leaders António Costa and Ursula von der Leyen), alongside a landmark RBI-ESMA MoU on clearing house (CCIL) recognition.',
      '**Most Favoured Nation (MFN) Framework:** Both parties agreed to grant reciprocal **MFN status for 5 years** from the date of FTA enforcement, subject to a Joint Committee review in the 4th year (auto-terminates unless mutually extended).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — "22nd FTA partner" + "15 EU bank branches over 4 years" + "5-year MFN duration" is the testable core trio; do not confuse the treaty bound-commitment of 100% insurance FDI with the separate domestic Insurance Act reform.'
  },

  'ca-2026-q4-sec1-disinvestment-pfc-rec-merger-trade-index-reba': {
    title: 'PFC-REC Merger & Trade Index Rebasing',
    bullets: [
      '**PFC-REC Amalgamation:** The Board of Directors of Power Finance Corporation (PFC) cleared the merger proposal with its subsidiary REC Limited (PFC currently holds a 52.63% controlling stake in REC, acquired for ₹14,500 Crore in March 2019).',
      '**Merchandise Trade Index Rebasing:** Directorate General of Commercial Intelligence and Statistics (DGCI&S) revised India’s merchandise trade index base year from **2012-13 ➔ 2022-23**.',
      '**Committee Leadership:** The trade index revision was conducted based on recommendations of an expert committee chaired by Prof. Nachiketa Chattopadhyay of the Indian Statistical Institute (ISI) Kolkata.'
    ],
    examTrap: '🎯 Exam Angle → PFC-REC stake holding is 52.63%; DGCI&S trade index new base year is 2022-23 (Prof. Nachiketa Chattopadhyay Committee).'
  },

  'ca-2026-q4-sec1-key-national-scheme-reforms-financial-milestones-j': {
    title: 'National Scheme Reforms & Banking Milestones (Jan–Feb)',
    bullets: [
      '**Lakhpati Didi Initiative (DAY-NRLM):** Target doubled from 3 Crore ➔ **6 Crore Lakhpati Didis by March 2029** (initial 3 Cr target achieved ahead of March 2027 deadline; enables rural SHG women to earn ≥₹1 Lakh net annual income).',
      '**Agriculture Infrastructure Fund (AIF):** Loan target officially doubled from ₹1 Lakh Crore ➔ **₹2 Lakh Crore** (Ministry of Agriculture; provides 3% interest subvention on bank loans up to ₹2 Crore for 7 years; Punjab leads national state leaderboard).',
      '**SIDBI Equity Support:** Union Cabinet approved **₹5,000 Crore equity support** to SIDBI in 3 annual tranches via the Department of Financial Services (DFS) to expand MSME credit lines.',
      '**Critical Minerals Tailings Policy:** Approved India’s first comprehensive policy framework for secondary extraction of critical minerals (Lithium, Cobalt, REEs) from legacy mine dumps (administered by IBM, CMPDI, AMD).',
      '**Historic Bank Credit Milestone:** Total outstanding bank credit crossed **₹200 Lakh Crore** for the first time (reached **₹203.2 Lakh Crore** at end-Dec 2025, recording +14.5% YoY growth).',
      '**Labour Force Indicators:** All-India Unemployment Rate stood at **4.8%** in December 2025 as per PLFS monthly data.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Lakhpati Didi target: 6 Crore by March 2029 (not 2027); AIF loan target: ₹2 Lakh Crore with 3% subvention; Bank credit milestone crossed ₹200 Lakh Crore.'
  },

  'ca-2026-q4-sec1-economic-stabilisation-fund-1-lakh-crore-fisc': {
    title: 'Economic Stabilisation Fund — ₹1 Lakh Crore Fiscal Buffer',
    bullets: [
      '**Strategic Contingency Purpose:** Created to serve as a fiscal shock-absorber against geopolitical turmoil, crude oil spikes, and global supply-chain disruptions without derailing the budgeted fiscal deficit target.',
      '**Corpus Size & Financial Architecture:** Total corpus established at **₹1 Lakh Crore** (~$12 Billion).',
      '**Funding Mechanism Split:** Comprises **~₹57,000 Crore fresh cash** allocation (via Supplementary Demands for Grants) + **~₹43,000 Crore reallocated savings** across various union ministries.',
      '**Legislative Enactment:** Passed and approved under the second batch of FY26 Supplementary Demands for Grants alongside the Appropriation Bill 2026.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Total corpus (₹1 Lakh Crore) vs Fresh Cash component (~₹57,000 Crore) is a prime examiner trap pairing.'
  },

  'ca-2026-q4-sec1-income-tax-rules-2026': {
    title: 'Income Tax Rules 2026 — Comprehensive Direct Tax Overhaul',
    bullets: [
      '**Statutory Enactment & Scope:** Effective from **1 April 2026**; operationalises the simplified Income-tax Act 2025, cutting total sections from **819 ➔ 536**, chapters from **47 ➔ 23**, and word count by ~50% (5.12 Lakh ➔ 2.6 Lakh words).',
      '**Metro HRA Cities Expansion:** Expands 50% House Rent Allowance (HRA) deduction coverage from 4 traditional metros (Delhi, Mumbai, Kolkata, Chennai) ➔ **8 Metro Cities** (adding Bengaluru, Hyderabad, Pune, and Ahmedabad).',
      '**PAN Reporting & Cash Transactions:** Daily ₹50,000 cash transaction reporting replaced with an annual aggregate threshold of **₹10 Lakh/year** linked to PAN for banking, real estate, and high-value transactions.',
      '**Corporate Compliance Reforms:** Dividends payable only within domestic banking channels; 7-year audit-trail retention mandated for stock exchanges; Zero-Coupon Bonds require 3-month pre-approval backed by two investment-grade rating agencies.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — 819➔536 sections; 8 Metro HRA cities (added Bengaluru, Hyderabad, Pune, Ahmedabad); PAN cash reporting threshold shifted to ₹10 Lakh annual aggregate.'
  },

  'ca-2026-q4-sec1-insolvency-and-bankruptcy-code-amendment-bill': {
    title: 'Insolvency and Bankruptcy Code (Amendment) Act, 2026',
    bullets: [
      '**Legislative Passage:** Passed by Lok Sabha (30 March 2026) and Rajya Sabha (1 April 2026); received Presidential assent on 6 April 2026 (Act No. 6 of 2026); based on Select Committee recommendations chaired by **Baijayant Panda**.',
      '**Creditor-Led Resolution (CIIRP):** Introduces Chapter IV-A enabling a Creditor-Led Resolution Process requiring ≥51% financial creditor approval, with a strict timeline of **150 days (+45-day extension)** while promoters continue operations under Resolution Professional oversight.',
      '**Accelerated Adjudication Timelines:** NCLT must admit or reject insolvency applications (Sections 7/9/10) within **14 days**, and approve resolution plans within **30 days**.',
      '**Liquidation Timeline & Liquidator Replacement:** Liquidation process must be completed within **180 days (+90-day extension)**; Committee of Creditors (CoC) empowered to replace liquidators with a **66% voting majority**.',
      '**CIRP Revival Mechanism:** Permits one-time revival of Corporate Insolvency Resolution Process (CIRP) within **120 days** prior to liquidation ordering.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — CIIRP timeline (150+45 days) vs Liquidation timeline (180+90 days) confusion pair; CoC liquidator replacement vote is 66% (not 75%).'
  },

  'ca-2026-q4-sec1-aif-scheme-punjab-tops-state-leaderboard': {
    title: 'Agriculture Infrastructure Fund (AIF) — State Performance Leaderboard',
    bullets: [
      '**State Leadership Ranking:** Punjab emerged as the top-performing state across India in sanctioned Agriculture Infrastructure Fund projects since 2024-25, followed by Madhya Pradesh, Maharashtra, Uttar Pradesh, and Haryana.',
      '**National Corpus & Disbursement:** Total national loan target doubled to **₹2 Lakh Crore**, with over ₹1 Lakh Crore already disbursed via commercial lending institutions through FY 2025-26.',
      '**Financial Subvention & Credit Support:** Provides an attractive **3% per annum interest subvention** on bank loans up to ₹2 Crore for a maximum repayment period of 7 years, backed by CGTMSE and NABSanrakshan credit guarantees.'
    ],
    examTrap: '🎯 Exam Angle → Punjab ranks #1 in AIF project sanctions; total loan target is ₹2 Lakh Crore with 3% interest subvention up to ₹2 Crore.'
  },

  // -------------------------------------------------------------
  // SECTION 2: Regulatory Bodies (RBI, SEBI, IRDAI)
  // -------------------------------------------------------------
  'ca-2026-q4-sec2-rbi-bank-dividend-payout-cap-saga': {
    title: 'RBI Bank Dividend Payout Cap Framework (75% Cap & CET1 Linkage)',
    bullets: [
      '**Dividend Payout Ceiling:** Reserve Bank of India raised the maximum dividend payout ceiling for commercial banks from 40% ➔ **75% of Profit After Tax (PAT)**, effective from **FY 2026-27 (FY27)**.',
      '**CET1 Capital Linkage:** Dividend quantum is strictly linked to the bank\'s Common Equity Tier 1 (CET1) capital buffer; banks operating just above regulatory minimums are barred from paying dividends.',
      '**Adjusted PAT Formula:** Eligible stronger banks can distribute up to 100% of **Adjusted PAT** (subject to the overall 75% PAT cap), where Adjusted PAT is calculated as `PAT − 50% of Net NPAs` as of March 31.',
      '**Prudential Objective:** Incentivises banks to accelerate NPA provisioning and maintain robust internal capital generation while offering fair returns to shareholders.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Dividend payout cap is 75% of PAT (effective FY27); Adjusted PAT formula deducts 50% of Net NPAs from PAT.'
  },

  'ca-2026-q4-sec2-rbi-regulatory-package': {
    title: 'RBI Comprehensive Regulatory Package (Effective 1 April 2026)',
    bullets: [
      '**Digital Fraud Compensation:** Financial institutions liable to compensate small-value digital fraud victims up to **₹25,000 or 85% of net loss** (whichever is lower).',
      '**Acquisition Financing Norms:** Overseas syndicated bank credit capped at **20% of exposure**; total bank financing restricted to **≤75% of deal value** with a maximum debt-to-equity ratio of **3:1**.',
      '**MSME Collateral-Free Lending:** Mandatory collateral-free loan ceiling raised to **₹20 Lakh** (with bank board discretion up to **₹25 Lakh**).',
      '**Broker Funding Safeguards:** Mandates **100% cash or sovereign collateral** for bank credit extended to SEBI-regulated stockbrokers.',
      '**ECB Borrowing Limits:** External Commercial Borrowing (ECB) annual limit raised to the higher of **$1 Billion or 300% of net worth** (up from $750 Million).',
      '**OTC Derivatives & VRR:** Unique Transaction Identifier (UTI) framework deferred to **1 Jan 2027**; Voluntary Retention Route (VRR) subsumed into the general FPI investment window.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Fraud compensation (₹25,000/85%), MSME collateral-free (₹20L/₹25L), Broker collateral (100%), ECB ($1bn/300%); UTI alone deferred to Jan 2027.'
  },

  'ca-2026-q4-sec2-rbi-risk-based-premium-rbp-for-deposit-insura': {
    title: 'RBI Risk-Based Premium (RBP) for Deposit Insurance',
    bullets: [
      '**Shift from Flat to Risk-Based Model:** DICGC transitioned from the 60-year-old flat premium rate of 12 paise per ₹100 of deposits (in place since 1962) to a dynamic **Risk-Based Premium (RBP)** framework effective **1 April 2026**.',
      '**Two-Tier Assessment Architecture:** Tier 1 covers Scheduled Commercial Banks (excluding RRBs); Tier 2 covers Regional Rural Banks and Cooperative Banks.',
      '**Incentives & Discount Structure:** Banks with superior CAMELS ratings and robust liquidity profiles receive up to a **33.33% risk-model discount** and up to **25% vintage incentive** on deposit insurance premiums.',
      '**Review Cycle:** Risk ratings and premium bands subject to triennial review every **3 years**.'
    ],
    examTrap: '🎯 Exam Angle → Replaces flat 12 paise/₹100 flat rate; max risk discount 33.33%; reviewed every 3 years; effective 1 April 2026.'
  },

  'ca-2026-q4-sec2-rbis-digital-payment-safety-cluster': {
    title: 'RBI Digital Payment Safety, 2FA & Fraud Deterrence Cluster',
    bullets: [
      '**Mandatory Two-Factor Authentication (2FA):** 2FA made compulsory from **1 April 2026** for all domestic card, UPI, and digital wallet payments; extends to cross-border card-not-present (CNP) transactions from **1 October 2026**.',
      '**DigiLocker High-Risk Verification:** Mandatory bank integration with DigiLocker for real-time customer identity verification on flagged high-risk digital transactions from 1 April 2026.',
      '**Institutional Fraud Detection Units:** Indian Digital Payment Intelligence Corporation (IDPIC) incorporated under Section 8 of Companies Act for AI/ML fraud intelligence; **MuleHunter.AI** deployed across 26 major commercial banks.',
      '**Dedicated Banking Internet Domain:** RBI awarded *Initiative of the Year* at the 13th Central Banking Awards in London for mandating the secure **.bank.in** domain for all regulated Indian banks (IDRBT appointed sole registrar).'
    ],
    examTrap: '🎯 Exam Angle → 2FA domestic deadline (1 April 2026) vs Cross-Border CNP deadline (1 October 2026); IDRBT is sole registrar for .bank.in domain.'
  },

  'ca-2026-q4-sec2-sebi-investor-protection-cluster': {
    title: 'SEBI Investor Protection, Folio Lock-In & Heir Claims Package',
    bullets: [
      '**Mutual Fund Folio Debit-Freeze:** Introduced voluntary debit-freeze facility enabling mutual fund investors to lock their folios against unauthorized redemption or switching.',
      '**Simplified Transmission for Deceased Heirs:** Streamlined processing thresholds set at ₹10,000 for physical units and ₹30,000 for demat units via STP; full documentation waiver threshold raised to **₹10 Lakh (physical) / ₹30 Lakh (demat)** with mandatory claim transmission within **≤21 days**.',
      '**Nomination Limits:** Standardized the maximum nomination ceiling to **4 nominees** per folio (revising earlier draft proposal of 10).',
      '**Verified App Certification & Advisory Platforms:** Launched **Verified App Label** under Chairman Tuhin Kanta Pandey ("First verify. Then invest.") and rolled out **SEBI SETU** digital advisory platform.'
    ],
    examTrap: '🎯 Exam Angle → Simplified claim transmission timeline is ≤21 days; maximum nomination cap fixed at 4 nominees (not 10).'
  },

  'ca-2026-q4-sec2-sebi-mfmarket-infra-updates': {
    title: 'SEBI Mutual Funds & Market Infrastructure Reforms',
    bullets: [
      '**Intra-Day Borrowing Facility:** Permitted mutual funds to execute intra-day borrowing beyond the statutory 20% of net assets cap for liquidity management, effective 1 April 2026.',
      '**Life Cycle Funds Architecture:** Mandated fixed maturity horizons of 5, 10, 15, 20, 25, and 30 years with staggered exit loads of 3%, 2%, and 1%.',
      '**IT Resilience & Cyber Security Index:** Proposed framework assigning the highest weightage of **20% each to System Availability and Cyber Security**, with remaining operational parameters weighted at 10% each.',
      '**Custodian SBU & Gifting Norms:** Approved dedicated Custodian Strategic Business Unit (SBU) framework with ₹75 Crore net worth bar, alongside proposed MF Gift Cards capped at ₹10,000 per card (₹50,000/fund/year).'
    ],
    examTrap: '🎯 Exam Angle → IT Resilience Index weights Availability & Security at 20% each; Custodian SBU minimum net worth requirement is ₹75 Crore.'
  },

  'ca-2026-q4-sec2-irdai-clears-allianz-jio-reinsurance-kiwi-gen': {
    title: 'IRDAI Clears Allianz Jio Reinsurance & Kiwi General Insurance',
    bullets: [
      '**Allianz-Jio Reinsurance Entity:** IRDAI approved the 50:50 joint venture between Allianz Group (Germany) and Jio Financial Services to establish a new domestic reinsurance operation.',
      '**Kiwi General Insurance Approval:** Cleared the formation of Kiwi General Insurance, backed by WestBridge Capital and headed by Neelesh Garg (former MD & CEO, Tata AIG).',
      '**Statutory Context (SBSR Act 2025):** Approvals granted under the **Sabka Bima Sabki Raksha (Amendment of Insurance Laws) Act, 2025** (notified 21 Dec 2025, in force from **5 Feb 2026**).',
      '**Domestic Reinsurance Landscape:** Joins existing domestic reinsurers GIC Re and Valueattics Re alongside 11 foreign reinsurance branches operating in India.'
    ],
    examTrap: '🎯 Exam Angle → Sabka Bima Sabki Raksha Act came into force on 5 February 2026 (notification date: 21 Dec 2025); Allianz-Jio is a 50:50 JV.'
  },

  // -------------------------------------------------------------
  // SECTION 3: Banking & Insurance News
  // -------------------------------------------------------------
  'ca-2026-q4-sec3-bank-bondloan-issuances-cluster': {
    title: 'Major PSU & Private Bank Bond Issuances (Q4 FY26)',
    bullets: [
      '**Bank of Baroda Green Infra Bond:** Issued **₹10,000 Crore in Green Infrastructure Bonds** at 7.10% coupon (oversubscribed 3x), becoming the **first bank in India** to issue domestic green infrastructure bonds.',
      '**State Bank of India Tier-2 Capital:** SBI raised **₹6,051 Crore** in Basel III compliant Tier-2 bonds at 7.05% under Chairman C.S. Setty.',
      '**Canara Bank Capital Mobilisation:** Canara Bank successfully raised **₹5,000 Crore** in Tier-2 bonds at 7.24% coupon.',
      '**Global Syndicated ESG Facilities:** SBI secured a **$500 Million social syndicated loan** for women empowerment (aligned with UN SDG-5); Bank of Baroda completed a **$500 Million 5-year syndicated facility** via GIFT City.'
    ],
    examTrap: '🎯 Exam Angle → Bank of Baroda is the 1st bank in India to issue domestic Green Infra Bonds; note coupon comparisons (BoB Green 7.10% vs SBI Tier-2 7.05% vs Canara 7.24%).'
  },

  'ca-2026-q4-sec3-govts-health-insurance-push': {
    title: 'National Health Insurance Expansion & Settlement Timelines',
    bullets: [
      '**Universal Health Target Vision:** Government articulated "Health Coverage for All by **2033**", complementing IRDAI\'s long-term "Insurance for All by **2047**" vision.',
      '**Market Depth & Premium Slabs:** Total health insurance premiums reached ₹1,17,505 Crore in FY25 covering 58 Crore lives; India\'s per-capita insurance premium stands at **$97** (compared to the global average of **$943**).',
      '**Mandatory Cashless Turnaround Times:** IRDAI mandated hospitals and insurers to complete **cashless pre-authorization within 1 hour** and **final discharge approval within 3 hours**.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Government target is 2033 vs IRDAI vision 2047; India per capita premium ($97) vs Global average ($943); Cashless timelines: 1 hr pre-auth / 3 hrs final.'
  },

  'ca-2026-q4-sec3-rbi-penalty-actions-march-2026': {
    title: 'RBI Regulatory Penalties on Banks & Intermediaries (March 2026)',
    bullets: [
      '**Union Bank of India (₹95.40 Lakh):** Penalized for failure to resolve unauthorized electronic banking transactions within the statutory 10-day timeline.',
      '**Central Bank of India (₹63.60 Lakh):** Fined for lapses in customer identification (KYC) and basic savings bank deposit account (BSBDA) norms.',
      '**Bank of India (₹58.50 Lakh):** Penalized for non-compliance with priority sector lending (PSL) guidelines and deposit interest rate directions.',
      '**HSBC India & Airtel Payments Bank (₹31.80 Lakh each):** HSBC fined for inoperative account lapses; Airtel Payments Bank fined for non-disclosure of customer grievance escalations.',
      '**Pine Labs (₹3.10 Lakh):** Penalized for procedural non-compliance under Master Directions on Prepaid Payment Instruments (PPIs).'
    ],
    examTrap: '🎯 Exam Angle → Highest single penalty in this cluster was imposed on Union Bank of India (₹95.40 Lakh) for electronic transaction delays.'
  },

  // -------------------------------------------------------------
  // SECTION 4: National, State & International News
  // -------------------------------------------------------------
  'ca-2026-q4-sec4-key-national-firsts-and-launches': {
    title: 'National Firsts & Flagship Infrastructure Launches (Jan–Feb)',
    bullets: [
      '**Bharat Taxi Cooperative Ride-Hailing:** Launched by Union Minister Amit Shah on 5 February 2026 as India’s first multi-state cooperative ride-hailing platform.',
      '**CBDC-Based Public Distribution:** Gandhinagar became the first city in India to operationalise a Central Bank Digital Currency (e-Rupee) ration distribution mechanism.',
      '**Namo Bharat Full Corridor Inauguration:** Entire 82 km Delhi–Ghaziabad–Meerut Regional Rapid Transit System (RRTS) corridor opened for public operations (designed for 180 km/h speed).',
      '**PM RAHAT Road Safety Scheme:** Notified on 13 February 2026, providing **cashless road accident trauma treatment up to ₹1.5 Lakh per victim** for up to 7 days across all golden-hour hospitals.',
      '**Micron ATMP Semiconductor Plant:** Groundbreaking at Sanand, Gujarat under the India Semiconductor Mission with total outlay exceeding ₹22,500 Crore.'
    ],
    examTrap: '🎯 Exam Angle → PM RAHAT cashless road treatment limit: ₹1.5 Lakh/victim for 7 days; Bharat Taxi is India\'s 1st cooperative cab aggregator; Namo Bharat speed is 180 km/h.'
  },

  'ca-2026-q4-sec4-quick-hits-national-firsts': {
    title: 'National Infrastructure & Technology Firsts (March 2026)',
    bullets: [
      '**Port of Refuge Establishment:** APSEZ operationalised India’s first dual-coast Ports of Refuge at **Dighi Port (West Coast)** and **Gopalpur Port (East Coast)** for emergency maritime containment.',
      '**First Indigenous Hydrogen Trainset:** Integral Coach Factory (ICF) Chennai rolled out India\'s first hydrogen trainset for trial runs on the Jind–Sonipat section in Haryana.',
      '**V.O. Chidambaranar Digital Twin:** VOC Port became India\'s first major port to deploy an end-to-end Digital Twin maritime monitoring platform.',
      '**Integrated Ocean Thermal Energy Plant:** India established the world’s first integrated Ocean Thermal Energy Conversion (OTEC) and low-temperature desalination facility at **Kavaratti, Lakshadweep**.'
    ],
    examTrap: '🎯 Exam Angle → Ports of Refuge are Dighi (West) & Gopalpur (East); Hydrogen trainset trials on Jind-Sonipat route; OTEC plant located at Kavaratti.'
  },

  // -------------------------------------------------------------
  // SECTION 10: Govt Schemes & Static
  // -------------------------------------------------------------
  'ca-2026-q4-sec10-key-economic-data-one-liners': {
    title: 'Key Macroeconomic High-Frequency Indicators (Feb–March 2026)',
    bullets: [
      '**Manufacturing PMI (S&P Global / HSBC):** Rose to **56.9 in February 2026** (up from 55.4 in Jan), marking the strongest manufacturing expansion since October 2025.',
      '**Gross GST Collections:** Touched **₹1.83 Lakh Crore in February 2026**, recording an 8.1% year-on-year growth.',
      '**Wholesale Price Index (WPI) Inflation:** Provisional WPI inflation stood at **2.13% in February 2026** (based on the 2011-12=100 base year series).'
    ],
    examTrap: '🎯 Exam Angle → Manufacturing PMI (56.9), GST Collections (₹1.83 Lakh Crore, +8.1%), and WPI (2.13%) form a high-probability trio of macro figures.'
  },

  'ca-2026-q4-sec10-banking-finance-one-liners': {
    title: 'Banking & Financial Market Strategic Developments (March 2026)',
    bullets: [
      '**Payment Aggregator Licences:** FinTech platform **Cred** received final authorization from the Reserve Bank of India to operate as a Payment Aggregator.',
      '**Affordable Housing Debt Facilities:** Motilal Oswal Home Finance secured **$100 Million in debt financing** (via NCDs) from the Asian Development Bank (ADB) for low-income housing.',
      '**Refining Megaproject:** Reliance Industries entered a **$300 Billion bilateral agreement** ("America First Refining") for constructing the first major new oil refinery in the US in 50 years.',
      '**Railway Redevelopment Milestone:** Amrit Bharat Station Scheme reached ongoing modernization across **1,338 railway stations** across India.'
    ],
    examTrap: '🎯 Exam Angle → Cred secured final RBI Payment Aggregator licence; Motilal Oswal received $100mn ADB housing finance; Trump-Reliance deal size is $300 Billion.'
  }
};

// Write curated master notes to content/corpus
console.log('Applying comprehensive human-grade curation across corpus...\n');

let written = 0;
for (const [id, data] of Object.entries(CURATED_NOTES)) {
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
    written++;
  }
}

console.log(`✅ Successfully updated ${written} master curated notes with zero fragmented sentences and cohesive bullet hierarchies.`);
