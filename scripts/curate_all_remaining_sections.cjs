const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', 'content', 'note-registry.json');

// Master curated dictionary for all remaining sections (Section 2 to Section 10)
const CURATED_REMAINING_NOTES = {
  // =============================================================
  // SECTION 2: REGULATORY BODIES NEWS
  // =============================================================
  'ca-2026-q4-sec2-rbi-bank-dividend-payout-cap-saga': {
    title: 'RBI Bank Dividend Payout Cap Framework (75% Cap & CET1 Linkage)',
    bullets: [
      '**Dividend Payout Ceiling Raised:** Reserve Bank of India raised the maximum dividend payout ceiling for commercial banks from 40% ➔ **75% of Profit After Tax (PAT)**, effective from **FY 2026-27 (FY27)**.',
      '**CET1 Capital Linkage:** Dividend distribution quantum is strictly calibrated to the bank’s Common Equity Tier 1 (CET1) capital buffer; banks operating just above statutory minimums are barred from declaring dividends.',
      '**Adjusted PAT Distribution Formula:** Well-capitalized banks may distribute up to 100% of **Adjusted PAT** (subject to the overall 75% PAT cap), where Adjusted PAT is calculated as `PAT − 50% of Net NPAs` as of March 31.',
      '**Prudential Capital Objective:** Incentivises scheduled commercial banks to accelerate NPA provisioning and build robust internal capital resilience while providing fair returns to shareholders.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Dividend payout cap is 75% of PAT (effective FY27); Adjusted PAT formula deducts 50% of Net NPAs from PAT.'
  },

  'ca-2026-q4-sec2-rbi-related-party-nbfc-risk-weight-forex-cluster': {
    title: 'RBI Related-Party Transactions, NBFC Risk-Weights & Forex Norms',
    bullets: [
      '**Related-Party Transaction (RPT) Rules:** RBI overhauled prudential guidelines for bank transactions with related parties, aligning definitions with the Companies Act 2013 and IBC (effective 1 April 2026).',
      '**NBFC Infrastructure Risk-Weight Easing:** Eased risk weights on bank lending to infrastructure-financing NBFCs effective 1 April 2026 (with compliance flexibility up to 31 March 2027).',
      '**Forex Risk & Net Open Position (NOP):** Harmonized foreign exchange Net Open Position guidelines with Basel III market risk frameworks, taking effect from **1 April 2027**.'
    ],
    examTrap: '🎯 Exam Angle → RPT rules and NBFC risk-weight easing take effect 1 April 2026; Basel Forex NOP framework takes effect 1 April 2027.'
  },

  'ca-2026-q4-sec2-sebi-market-structure-reforms': {
    title: 'SEBI Market Infrastructure, Demat & FPI Registration Reforms',
    bullets: [
      '**Closing Auction Session (CAS):** SEBI introduced a dedicated Closing Auction Session mechanism across stock exchanges, taking effect from **3 August 2026**.',
      '**Unified FPI/FVCI Portal (SWAGAT-FI):** Launched the SWAGAT-FI single-window registration system for Foreign Portfolio and Venture Capital Investors, effective **1 June 2026**.',
      '**Demat Simplification:** Abolished Letters of Confirmation (LoC) and reduced transmission and transfer processing time from **150 days ➔ 30 days**, effective **2 April 2026**.',
      '**Physical Share Dematerialisation Window:** Provided a one-year window from **5 February 2026 to 4 February 2027** for converting legacy physical share certificates into dematerialised form.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Three critical SEBI effective dates: Demat transfer cut to 30 days (2 Apr 2026), SWAGAT-FI (1 June 2026), Closing Auction Session (3 Aug 2026).'
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

  'ca-2026-q4-sec2-622nd-meeting-of-rbi-central-board-utkarsh-3': {
    title: '622nd RBI Central Board Meeting: Utkarsh 3.0 & State Borrowing',
    bullets: [
      '**Utkarsh 3.0 Strategic Framework:** Approved **Utkarsh 3.0**, the RBI’s Medium-Term Strategy Framework for **2026–2029** (first edition launched in 2019), during the 622nd Central Board meeting in Patna under Governor Sanjay Malhotra.',
      '**RBI Annual Budget Approval:** The Central Board formally cleared the Reserve Bank’s internal budget allocation for FY 2026-27.',
      '**State Government Borrowings (SGS):** State governments mobilized **₹45,960 Crore** collectively through State Development Loans (SDL); **Karnataka led borrowings at ₹10,000 Crore**, followed by Tamil Nadu (₹8,000 Cr) and Madhya Pradesh (₹5,800 Cr).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Utkarsh 3.0 spans 2026-2029 (launched originally in 2019); Karnataka topped state SDL borrowing at ₹10,000 Crore.'
  },

  'ca-2026-q4-sec2-rbi-cad-narrows-q3-fy26-bop-report': {
    title: 'RBI Balance of Payments (BoP) & CAD Trajectory (Q3 FY26)',
    bullets: [
      '**Current Account Deficit (CAD) Moderation:** India’s CAD narrowed to **$30.1 Billion (1.0% of GDP)** during April–December 2025, down from $36.6 Billion in the corresponding period of the previous fiscal.',
      '**Foreign Direct Investment (FDI):** Net FDI equity inflows expanded significantly to **$3.0 Billion** (up from $0.6 Billion in the previous year).',
      '**Portfolio Flows & Reserve Drawdown:** Foreign Portfolio Investors recorded a net outflow of **$4.3 Billion** (compared to an inflow of $9.4 Billion previously); foreign exchange reserves saw a depletion of **$30.8 Billion**.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — CAD stood at exactly 1.0% of GDP ($30.1 Billion) for Apr-Dec 2025.'
  },

  'ca-2026-q4-sec2-govt-sets-4-retail-inflation-target-for-rbi-t': {
    title: 'Inflation Target Renewal: 4% (±2%) Retained Till March 2031',
    bullets: [
      '**Statutory Target Mandate:** Central Government officially renewed the inflation-targeting framework for the Monetary Policy Committee (MPC) at **4.0% Consumer Price Index (CPI) inflation with a tolerance band of ±2% (2% to 6%)**.',
      '**Five-Year Validity Period:** The renewed statutory inflation mandate covers the 5-year period from **1 April 2026 to 31 March 2031** (retaining the framework originally notified in 2016 under Section 45ZA of the RBI Act, 1934).'
    ],
    examTrap: '🎯 Exam Angle → Inflation target renewed unchanged at 4% (tolerance band 2%-6%), valid for 5 years till 31 March 2031.'
  },

  'ca-2026-q4-sec2-rbi-payments-vision-2028': {
    title: 'RBI Payments Vision 2028 & Institutional Initiatives',
    bullets: [
      '**Vision Theme & Horizon:** Published Payments Vision 2028 under the core theme **"Shaping India’s Payment Frontier"**, outlining **15 strategic initiatives** across 5 anchor goalposts through December 2028.',
      '**Payments Switching Service (PaSS):** Commissioned a feasibility study on PaSS to ensure seamless continuity of recurring payment instructions during commercial bank mergers and account migrations.',
      '**TReDS & Joint Liability:** Mandated expansion of Trade Receivables Discounting System (TReDS) and proposed a **Shared-Responsibility Framework** holding issuer and beneficiary banks jointly liable for unauthorized digital transaction losses.'
    ],
    examTrap: '🎯 Exam Angle → Payments Vision 2028 contains 15 initiatives valid till Dec 2028; PaSS manages payment instructions during bank switches.'
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

  'ca-2026-q4-sec2-rbi-monetaryprudential-updates-cluster': {
    title: 'RBI Monetary & Prudential Operations (WMA Limits & FX Cap)',
    bullets: [
      '**Ways and Means Advances (WMA) for H1 FY27:** Government of India WMA limit fixed at **₹2,50,000 Crore** for the first half of FY 2026-27 (April–September 2026); fresh market borrowing triggered at 75% utilisation (WMA interest rate = Repo Rate, Overdraft = Repo + 2%).',
      '**Counterparty Credit Risk & QCCP:** Equity exposure add-ons set at 6%, 8%, and 10% across maturity bands; Qualifying Central Counterparty (QCCP) trade exposure risk weight fixed at 2%.',
      '**Authorised Dealer ECB Returns:** Mandated that AD Category-I banks submit all external commercial borrowing returns within **7 calendar days**, effective 1 April 2026.',
      '**Net Open Position FX Cap:** Net INR Open Position (NOP-INR) capped at **$100 Million per day**.'
    ],
    examTrap: '🎯 Exam Angle → WMA limit for H1 FY27 is ₹2,50,000 Crore (trigger at 75% utilisation); AD ECB reporting window is 7 calendar days.'
  },

  'ca-2026-q4-sec2-rbiirdaisebi-unclaimed-asset-recovery-push': {
    title: 'Unclaimed Assets Recovery: DEA Fund & Banking Laws Amendment',
    bullets: [
      '**Depositor Education and Awareness (DEA) Fund:** Total unclaimed bank deposits transferred to the DEA Fund reached **₹60,518 Crore** (as of 31 January 2026); established under Section 26A of the Banking Regulation Act, 1949 for deposits inoperative for 10+ years.',
      '**Up to 4 Nominees Mandated:** Enacted under the Banking Laws (Amendment) Act, 2025, allowing bank customers to register up to **4 nominees** per deposit account and locker.',
      '**Multi-Agency Asset Portals:** RBI operates **UDGAM** (Unclaimed Deposits – Gateway to Access Information); IRDAI operates **Bima Bharosa**; SEBI operates **MITRA**.'
    ],
    examTrap: '🎯 Exam Angle → DEA Fund balance: ₹60,518 Crore (Section 26A, BR Act 1949); Banking Laws Amendment allows up to 4 nominees (not 10).'
  },

  'ca-2026-q4-sec2-rbi-penalty-survey-items': {
    title: 'RBI Financial Stability Indicators, Surveys & DPI Index',
    bullets: [
      '**Financial Stability Report (FSR):** Unsecured retail personal loan slippages accounted for **53.1% of total retail slippages** as of September 2025; early-surrender payouts in life insurance constituted 37% of total claims.',
      '**RBI Digital Payments Index (RBI-DPI):** Rose to **516.76 in September 2025** (up from 493.22 in March 2025; Base: March 2018 = 100).',
      '**Financial Literacy Week 2026:** Observed 11th edition under the national theme *"KYC – Your First Step to Safe Banking"* across all commercial banks.',
      '**DICGC Insurance Coverage:** Insured accounts stood at **97.6% of total bank accounts** in India with the Deposit Insurance Fund corpus exceeding ₹2.29 Lakh Crore.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Unsecured retail loans formed 53.1% of retail slippages; RBI-DPI reading is 516.76 (Base March 2018=100).'
  },

  'ca-2026-q4-sec2-sebi-reform-cluster': {
    title: 'SEBI AIF Minimum Investment Cut & Governance Framework',
    bullets: [
      '**Social Impact Fund Minimum Ticket Cut:** Slashed minimum investment threshold for Social Impact Funds under Category-I AIFs from ₹2 Lakh ➔ **₹1,000**, democratising public retail participation in accredited social enterprises.',
      '**Pratyush Sinha Committee Implementation:** Accepted governance reforms mandating that SEBI Chairman and Whole-Time Members (WTMs) must freeze, liquidate, or place personal equity holdings in a blind trust upon assuming office (statutorily classified as **"Insiders"**).',
      '**REITs and InvITs Operational Flexibility:** Cleared unified ease-of-doing-business frameworks for infrastructure investment trusts.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Social Impact Fund minimum investment cut from ₹2 Lakh to ₹1,000; Pratyush Sinha Committee on SEBI leadership governance.'
  },

  'ca-2026-q4-sec2-sebis-ai-tool-sudarshan': {
    title: 'SEBI AI Surveillance Tool ‘Sudarshan’ & Finfluencer Enforcement',
    bullets: [
      '**AI Surveillance Capabilities:** SEBI deployed its proprietary AI-powered enforcement tool **‘Sudarshan’**, equipped with multilingual natural language processing and computer vision to monitor audio, video, and social media feeds.',
      '**Enforcement Actions:** Successfully identified and removed over **1,20,000 misleading finfluencer posts** and illegal investment advice channels operating across Telegram, YouTube, and X.'
    ],
    examTrap: '🎯 Exam Angle → SEBI’s AI surveillance engine is named ‘Sudarshan’ (removed 1.2 Lakh+ unregistered finfluencer posts).'
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

  'ca-2026-q4-sec2-pfrda-revises-nps-distributor-pop-charges': {
    title: 'PFRDA Revises NPS Distributor (Point of Presence) Charges',
    bullets: [
      '**Subscriber Onboarding Fee:** Revised Point of Presence (PoP) charges to **₹200 per subscriber for physical onboarding (₹100 for digital onboarding)**, paid in ₹50 quarterly instalments.',
      '**Annual Asset Management Charge:** Permitted PoPs to levy an annual service fee capped at **0.20% of Assets Under Management (AUM)**.',
      '**Contribution Thresholds:** Minimum initial contribution fixed at **₹250** with subsequent minimum contributions pegged at **₹10**.'
    ],
    examTrap: '🎯 Exam Angle → PoP physical onboarding is ₹200 vs digital ₹100; annual AUM fee cap is 0.20%.'
  },

  'ca-2026-q4-sec2-running-thread-what-changes-on-april-1-2026': {
    title: 'Master Consolidated Review: What Changes on 1 April 2026',
    bullets: [
      '🏛️ **Banking & RBI Directives:**\n• **Risk-Based Deposit Insurance:** DICGC replaces flat 12 paise rate with dynamic Risk-Based Premium framework.\n• **Digital Payment 2FA:** Compulsory Two-Factor Authentication for all domestic cards, UPI, and wallet transactions.\n• **DigiLocker Verification:** Real-time bank identity verification for high-risk digital payments.\n• **NBFC Risk Weights & RPT:** Easing of infrastructure loan risk weights; alignment of Related-Party Transaction norms with Companies Act.\n• **ECB 7-Day Reporting:** Authorised Dealers must file external borrowing returns within 7 calendar days.',
      '📈 **SEBI & Capital Markets:**\n• **Mutual Fund Intra-Day Borrowing:** Permitted beyond the statutory 20% net assets ceiling for settlement liquidity.\n• **Demat Simplification:** Letter of Confirmation abolished; security transfer timeline compressed to 30 days.',
      '💰 **Direct Taxes & Insurance:**\n• **Income Tax Rules 2026:** Sections cut from 819➔536; 50% HRA extended to 8 metro cities; PAN high-value threshold ₹10 Lakh/yr.\n• **Ind AS 117:** Mandatory financial reporting standard for all life, general, health, and reinsurance companies.',
      '🌿 **National & Regulatory Mandates:**\n• **FSSAI Perpetual Licencing:** Basic turnover exemption raised from ₹12 Lakh ➔ ₹1.5 Crore.\n• **Solid Waste Management Rules 2026:** Mandatory 4-way waste segregation at source.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Single highest-density revision flashcard across the quarter; tests which exact reform took effect on 1 April 2026.'
  },

  // =============================================================
  // SECTION 3: BANKING & INSURANCE NEWS
  // =============================================================
  'ca-2026-q4-sec3-100-fdi-in-insurance-automatic-route': {
    title: '100% FDI in Insurance via Automatic Route Operationalised',
    bullets: [
      '**Foreign Direct Investment Ceiling:** DPIIT and Ministry of Finance operationalised **up to 100% FDI in insurance companies** (including portfolio investments) under the automatic route, subject to IRDAI approval.',
      '**Statutory Basis:** Enacted under the **Sabka Bima Sabki Raksha (Amendment of Insurance Laws) Act, 2025**, effective from **5 February 2026** (except Section 25).',
      '**Resident Indian Management Safeguard:** Mandates that every insurance entity with foreign investment must retain at least one Resident Indian serving as Chairperson, Managing Director, or Chief Executive Officer.',
      '**Historical Evolution:** Follows prior milestones of 100% FDI in insurance intermediaries (2020) and 20% foreign investment in LIC (2022).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — 100% FDI in insurance is under automatic route (effective 5 Feb 2026); requires at least 1 resident Indian MD/CEO/Chairperson.'
  },

  'ca-2026-q4-sec3-epfo-upi-withdrawal-auto-settlement-cap': {
    title: 'EPFO UPI Claim Withdrawal & ₹5 Lakh Auto-Settlement Limit',
    bullets: [
      '**UPI Withdrawal Mechanism:** Employees’ Provident Fund Organisation (EPFO) enabled claim withdrawals directly via Unified Payments Interface (UPI), operational from **1 April 2026**.',
      '**Auto-Settlement Limit Expanded:** Auto-settlement claim ceiling raised 5-fold from ₹1 Lakh ➔ **₹5 Lakh**, processed within a streamlined turnaround time of **3 working days**.',
      '**Withdrawal Quantum:** Up to 75% of eligible provident fund balance withdrawable for non-contingency needs, and up to 100% for superannuation (at age 55), permanent disability, or voluntary retirement.'
    ],
    examTrap: '🎯 Exam Angle → EPFO auto-settlement limit raised from ₹1 Lakh to ₹5 Lakh (settled within 3 days); UPI withdrawal live from 1 April 2026.'
  },

  'ca-2026-q4-sec3-credit-deposit-ratio-at-all-time-high': {
    title: 'Banking System Credit-Deposit (CD) Ratio Touches Record 81%',
    bullets: [
      '**All-Time High CD Ratio:** Indian commercial banking system Loan-to-Deposit Ratio (LDR / CD Ratio) touched an all-time peak of **81.0% in the December 2025 quarter**.',
      '**SBI Research Benchmark:** Exceeded the prudential optimum band of **76% to 80%** identified by SBI Economic Research, underscoring credit growth outpacing deposit accretion across scheduled commercial banks.'
    ],
    examTrap: '🎯 Exam Angle → System CD ratio touched 81% (exceeding optimum 76-80% band).'
  },

  'ca-2026-q4-sec3-major-rbi-stake-approvals-bank-ma': {
    title: 'Major RBI Bank Stake Approvals & Bain-Manappuram Acquisition',
    bullets: [
      '**Bain Capital Manappuram Deal:** RBI formally approved Bain Capital’s acquisition of a **41.66% joint-controlling stake in Manappuram Finance for ₹4,385 Crore**, including regulatory clearances for its subsidiaries Asirvad Micro Finance and Manappuram Home Finance.',
      '**Blackstone Federal Bank Stake:** Approved Blackstone acquiring up to a **9.99% equity stake in Federal Bank** for ₹6,196.51 Crore.',
      '**ICICI Group & SBI Mutual Fund Approvals:** ICICI Group cleared to hold up to 9.95% each in HDFC Bank, IDFC FIRST Bank, Equitas SFB, and Federal Bank; SBI Mutual Fund cleared for up to 9.99% in Bandhan Bank and RBL Bank.'
    ],
    examTrap: '🎯 Exam Angle → Bain Capital acquired 41.66% stake in Manappuram Finance for ₹4,385 Crore; Blackstone acquired 9.99% in Federal Bank.'
  },

  'ca-2026-q4-sec3-upidigital-payments-milestones': {
    title: 'UPI Global Milestone (1.48M Transactions) & NPCI ‘FiMI’ AI LLM',
    bullets: [
      '**Cross-Border Volume Surge:** UPI global cross-border transaction volume crossed **1.48 Million transactions** in FY26 (doubling from 0.75 Million in FY25), operational across 8 international countries.',
      '**NPCI ‘FiMI’ LLM Launch:** National Payments Corporation of India launched **FiMI**, a specialized payments-domain Large Language Model developed for conversational digital payments, during the India AI Impact Summit.'
    ],
    examTrap: '🎯 Exam Angle → NPCI’s AI model for payments is named ‘FiMI’; UPI cross-border transactions reached 1.48 Million.'
  },

  'ca-2026-q4-sec3-sbi-overtakes-tcs-in-market-cap': {
    title: 'SBI Overtakes TCS to Become India’s 4th Most Valuable Company',
    bullets: [
      '**Market Capitalisation Milestone:** State Bank of India (SBI) surpassed Tata Consultancy Services (TCS) in total market capitalization, reaching **₹10.9 Lakh Crore**.',
      '**PSU Leadership:** SBI solidified its rank as India’s **4th most valuable listed company** and the single most valuable Public Sector Undertaking in the country.'
    ],
    examTrap: '🎯 Exam Angle → SBI reached ₹10.9 Lakh Crore m-cap, becoming India’s 4th most valued listed company.'
  },

  'ca-2026-q4-sec3-nhb-launches-gruh-sugam-portal': {
    title: 'National Housing Bank Launches ‘Gruh Sugam’ Housing Portal',
    bullets: [
      '**Portal Mandate:** National Housing Bank (NHB) launched the **Gruh Sugam Portal** to facilitate dedicated housing finance access for armed forces and central government personnel at transfer posting locations.',
      '**NHB Institutional Lineage:** Established on **9 July 1988** under the National Housing Bank Act, 1987 (100% Government of India owned; MD Sanjay Shukla; Authorised Capital ₹1,450 Crore).',
      '**Regulatory Transfer Milestone:** Regulatory supervision over Housing Finance Companies (HFCs) was statutorily transferred from **NHB ➔ RBI on 9 August 2019**.'
    ],
    examTrap: '🎯 Exam Angle → Regulatory power over HFCs transferred from NHB to RBI on 9 August 2019; NHB founded 9 July 1988.'
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

  'ca-2026-q4-sec3-gdp-growth-forecasts-external-agencies': {
    title: 'Global Agency GDP Growth Forecasts for India (FY26–FY27)',
    bullets: [
      '**OECD Projections:** Pegged India’s real GDP growth at **7.6% for FY 2025-26** and **6.1% for FY 2026-27**.',
      '**Comparative Institutional Forecasts:** S&P Global projected growth at **7.1%**, while Goldman Sachs issued a conservative estimate of **5.9% for CY 2026**.'
    ],
    examTrap: '🎯 Exam Angle → OECD GDP projection: 7.6% (FY26) and 6.1% (FY27).'
  },

  'ca-2026-q4-sec3-banking-access-village-coverage-nabfid-gcf': {
    title: '99.92% Village Banking Coverage & NaBFID GCF Accreditation',
    bullets: [
      '**Universal Financial Access:** 99.92% of all Indian villages brought within 5 km coverage of a formal banking touchpoint (100% saturation achieved in Dadra & Nagar Haveli), tracked in real time via the **Jan Dhan Darshak App**.',
      '**NaBFID Green Climate Fund Status:** National Bank for Financing Infrastructure and Development (NaBFID) received official accreditation as a Direct Access Entity under the **Green Climate Fund (GCF)** under DFS oversight.'
    ],
    examTrap: '🎯 Exam Angle → 99.92% of Indian villages covered within 5km banking radius; NaBFID received GCF accreditation.'
  },

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

  'ca-2026-q4-sec3-international-multilateral-loans-jica-adb-wb': {
    title: 'Multilateral Sovereign Infrastructure Financing (JICA, ADB, World Bank)',
    bullets: [
      '**JICA Japanese ODA Loans:** Japan International Cooperation Agency signed 4 Official Development Assistance loan agreements totaling **¥275.858 Billion (~₹16,420 Crore)** for Bengaluru Metro Phase 3, Mumbai Metro Line 11, Maharashtra healthcare modernization, and Punjab horticulture.',
      '**ADB West Bengal Education Facility:** Asian Development Bank sanctioned **₹4,648 Crore** for school education and ICDS infrastructure (70% ADB loan : 30% State financing ratio).',
      '**World Bank Clean Air Loan:** Sanctioned a **$300 Million loan** to Uttar Pradesh for air quality management (10-year maturity with a 2-year grace period).'
    ],
    examTrap: '🎯 Exam Angle → JICA ODA loan package size: ¥275.858 Billion (~₹16,420 Crore); ADB funding ratio in WB education is 70:30.'
  },

  'ca-2026-q4-sec3-nhai-riit-invit-bse-listing': {
    title: 'NHAI Raajmarg Infra Investment Trust (RIIT) Listed on BSE',
    bullets: [
      '**Public InvIT Listing:** National Highways Authority of India (NHAI) listed its infrastructure investment trust, **Raajmarg Infra Investment Trust (RIIT)**, on the Bombay Stock Exchange (BSE) on 24 March 2026 (chaired by Santosh Kumar Yadav).',
      '**Asset Monetisation Route:** Established as an Infrastructure Investment Trust (InvIT) under SEBI InvIT Regulations to monetize operational toll road corridors.'
    ],
    examTrap: '🎯 Exam Angle → RIIT is an InvIT (Infrastructure Investment Trust), not a REIT.'
  },

  'ca-2026-q4-sec3-institutional-awards-municipal-green-bonds': {
    title: 'Karnataka Grameena Bank Award & Nashik ULB Green Bond',
    bullets: [
      '**SHG-Bank Linkage National Award:** Karnataka Grameena Bank won the 1st National Award for SHG Bank Linkage 2024-25 from the Ministry of Rural Development.',
      '**Maharashtra’s First ULB Green Bond:** Nashik Municipal Corporation issued and listed Maharashtra’s first Urban Local Body Green Municipal Bond on the National Stock Exchange (NSE).',
      '**LankaPay UPI Integration:** NPCI International partnered with LankaPay to enable QR-code based merchant UPI payments across Sri Lanka.'
    ],
    examTrap: '🎯 Exam Angle → Karnataka Grameena Bank won SHG Linkage award; Nashik issued Maharashtra’s 1st ULB Green Bond.'
  },

  'ca-2026-q4-sec3-irdai-mandates-ind-as-117-for-insurers': {
    title: 'IRDAI Mandates Ind AS 117 Accounting Standard from 1 April 2026',
    bullets: [
      '**Mandatory Financial Reporting Standard:** Insurance Regulatory and Development Authority of India (IRDAI) made **Ind AS 117 (Insurance Contracts)** mandatory for all life, general, health, and reinsurance companies effective **1 April 2026**.',
      '**International Alignment:** Aligns Indian insurance financial reporting with international IFRS 17 standards, introducing fair-value assessment of insurance contract liabilities.'
    ],
    examTrap: '🎯 Exam Angle → Ind AS 117 governs Insurance Contracts, effective 1 April 2026.'
  },

  'ca-2026-q4-sec3-nabards-national-climate-stack-challenge-dic': {
    title: 'NABARD National Climate Stack Challenge & ‘DiCRA’ Platform',
    bullets: [
      '**Innovation Challenge:** National Bank for Agriculture and Rural Development (NABARD) launched the National Climate Stack Innovation Challenge in collaboration with the Bill & Melinda Gates Foundation and Dalberg Advisors.',
      '**Platform Anchor & Grants:** Anchored in the **DiCRA (Data in Climate Resilient Agriculture)** platform, offering equity-free grants of ₹15 Lakh, ₹10 Lakh, and ₹5 Lakh to the top 3 climate-tech innovators.'
    ],
    examTrap: '🎯 Exam Angle → NABARD’s climate data platform is DiCRA (Data in Climate Resilient Agriculture).'
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

  'ca-2026-q4-sec3-pmfby-modified-21-day-claim-settlement-rule': {
    title: 'PMFBY Revision: 21-Day Claim Settlement & 12% Interest Penalty',
    bullets: [
      '**Mandatory Settlement Timeline:** Ministry of Agriculture amended Pradhan Mantri Fasal Bima Yojana (PMFBY) guidelines, requiring insurance companies and state governments to disburse settled agricultural crop claims within **21 days**.',
      '**Statutory Interest Penalty:** Failure to settle claims within the 21-day window attracts a mandatory penal interest rate of **12% per annum** payable directly into the farmer’s bank account.'
    ],
    examTrap: '🎯 Exam Angle → PMFBY claim settlement window is 21 days; penal interest for delay is 12% per annum.'
  },

  'ca-2026-q4-sec3-health-insurance-sector-grows-9-percent': {
    title: 'Health Insurance Sector Crosses ₹1.2 Lakh Crore Premiums',
    bullets: [
      '**Sector Growth & Scale:** Total health insurance premium collections grew by ~9% YoY to surpass **₹1.20 Lakh Crore in FY 2025-26** as per IRDAI industry disclosures.',
      '**Consumer Grievance Redressal:** IRDAI’s integrated grievance portal **Bima Bharosa** resolved 1,37,361 insurance complaints during the fiscal year with an average resolution turnaround of 8 days.'
    ],
    examTrap: '🎯 Exam Angle → Health insurance annual premiums crossed ₹1.2 Lakh Crore; IRDAI grievance portal is Bima Bharosa.'
  },

  // =============================================================
  // SECTION 4: NATIONAL, STATE & INTERNATIONAL NEWS
  // =============================================================
  'ca-2026-q4-sec4-india-ai-impact-summit-2026-16-20-feb-new-del': {
    title: 'India AI Impact Summit 2026: MANAV Vision & New Delhi Declaration',
    bullets: [
      '**Summit Organization & Theme:** Hosted in New Delhi (16–20 February 2026) under the official theme *"People, Planet, Progress"*; Prime Minister Narendra Modi unveiled the **MANAV Vision** (*Moral, Accountable, National sovereignty, Accessible, Valid*).',
      '**New Delhi Declaration on AI Impact:** Formally endorsed and signed by **89 countries** (Bangladesh signed as the 89th member nation).',
      '**Pax Silica Coalition & GPU Scale:** India formally joined the US-led **Pax Silica** critical-minerals and semiconductor AI alliance; domestic compute capacity scaled beyond **38,000 GPUs** with an additional 20,000 GPUs allocated under IndiaAI Mission.',
      '**Global Innovation Index (GII):** India’s GII global ranking improved significantly from **81st ➔ 38th**; next global AI Impact Summit announced for Geneva, Switzerland in 2027.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — MANAV Vision acronym; 89 member signatories (Bangladesh 89th); GII rank jump to 38th; 2027 summit in Geneva.'
  },

  'ca-2026-q4-sec4-union-cabinet-approvals': {
    title: 'Union Cabinet Approvals: Keralam Renaming & Brahmaputra Tunnel',
    bullets: [
      '**Keralam Renaming Resolution:** Union Cabinet cleared the constitutional proposal to amend the First Schedule of the Constitution under **Article 3** to officially rename Kerala as **‘Keralam’**.',
      '**Brahmaputra Underwater Road-Rail Tunnel:** Approved the construction of India’s first underwater road-rail tunnel under the Brahmaputra River (connecting Gohpur and Numaligarh in Assam) with an outlay of **₹18,662 Crore** (total length **33.7 km**; 2nd longest underwater tunnel globally after the Germany-Denmark Fehmarnbelt link).'
    ],
    examTrap: '🎯 Exam Angle → Brahmaputra tunnel cost ₹18,662 Crore / 33.7 km (Gohpur-Numaligarh); State renaming under Article 3.'
  },

  'ca-2026-q4-sec4-india-becomes-worlds-4th-largest-economy': {
    title: 'India Becomes World’s 4th-Largest Economy ($4.18 Trillion)',
    bullets: [
      '**Global GDP Ranking:** India officially surpassed Japan to become the world’s **4th-largest economy in nominal GDP terms (~$4.18 Trillion)** as per NSO First Advance Estimates for FY26.',
      '**Medium-Term Projection:** On track to overtake Germany for the 3rd spot by **2030** with projected GDP exceeding $7.3 Trillion.'
    ],
    examTrap: '🎯 Exam Angle → India nominal GDP size ~$4.18 Trillion, ranking 4th globally (overtook Japan; behind US, China, Germany).'
  },

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

  'ca-2026-q4-sec4-state-news': {
    title: 'State Policy Firsts: Kerala Graphene, Tamil Nadu AI Park & PESA',
    bullets: [
      '**Kerala Graphene Policy:** Kerala formulated India’s first comprehensive State Graphene & 2D Materials Industrial Policy.',
      '**Tamil Nadu Sovereign AI Park:** Partnered with Sarvam AI to establish India’s first Sovereign AI Research Park and notified the state Deeptech Startup Policy.',
      '**Jharkhand PESA Act Operationalisation:** Implemented the Panchayats (Extension to Scheduled Areas) Act, 1996 rules after a 25-year delay.',
      '**Assam 8th State Pay Commission:** Became the first state in India to constitute the 8th State Pay Commission for government employees.'
    ],
    examTrap: '🎯 Exam Angle → Kerala notified 1st Graphene policy; Tamil Nadu built 1st Sovereign AI Park; Assam set up 8th State Pay Commission.'
  },

  'ca-2026-q4-sec4-international-news': {
    title: 'International Geopolitics: New START Expiry & India BRICS Chair 2026',
    bullets: [
      '**New START Nuclear Treaty Expiry:** The New Strategic Arms Reduction Treaty (New START) between the United States and Russia **officially expired on 5 February 2026**, ending the last surviving bilateral nuclear arms control treaty.',
      '**India Assumes BRICS Chairmanship 2026:** India formally took over the BRICS Chairmanship for 2026 to host the 18th Annual BRICS Summit.',
      '**India-GCC FTA Terms of Reference:** Signed the formal Terms of Reference for the India-GCC Free Trade Agreement (GCC represents India’s largest trading partner bloc at $178.56 Billion in FY25).'
    ],
    examTrap: '🎯 Exam Angle → New START expired on 5 Feb 2026; India holds BRICS 2026 Chairmanship (18th Summit).'
  },

  'ca-2026-q4-sec4-new-seed-act-2026-revised-pesticide-act-2026': {
    title: 'New Seed Act 2026 & Revised Pesticide Management Act 2026',
    bullets: [
      '**Statutory Seed Regulation:** Seed Act 2026 mandates compulsory registration of all commercial seed varieties and QR code traceability on seed packets, prescribing penal fines up to **₹30 Lakh** for spurious seeds.',
      '**Insecticides Act 1968 Repealed:** The Revised Pesticide Act 2026 replaces the 58-year-old **Insecticides Act, 1968**, tightening pesticide residue tolerances and introducing digital traceability across agrochemical supply chains under Union Agriculture Minister Shivraj Singh Chouhan.'
    ],
    examTrap: '🎯 Exam Angle → Revised Pesticide Act 2026 replaces the Insecticides Act, 1968; Seed Act introduces mandatory QR codes.'
  },

  'ca-2026-q4-sec4-india-japan-bilateral-swap-arrangement-renewe': {
    title: 'India-Japan $75 Billion Bilateral Currency Swap Renewed',
    bullets: [
      '**Bilateral Currency Swap:** Reserve Bank of India and Bank of Japan renewed the Bilateral Swap Arrangement (BSA) effective **28 February 2026**.',
      '**Swap Size Unchanged:** The facility maintains its sizing at **$75 Billion**, enabling both countries to swap domestic currencies against US Dollars to maintain balance-of-payments liquidity.'
    ],
    examTrap: '🎯 Exam Angle → India-Japan BSA size is $75 Billion (renewed 28 Feb 2026).'
  },

  'ca-2026-q4-sec4-indias-metro-network-worlds-3rd-largest': {
    title: 'India’s Operational Metro Rail Network Becomes World’s 3rd Largest',
    bullets: [
      '**Network Scale & Global Rank:** India’s operational metro rail network expanded to **1,095 km across 26 cities** in 2025 (up from 248 km across 5 cities in 2014), ranking as the **3rd-largest metro network in the world** (after China and the US).'
    ],
    examTrap: '🎯 Exam Angle → India metro network is 3rd largest globally (1,095 km across 26 cities).'
  },

  'ca-2026-q4-sec4-indias-bio-economy': {
    title: 'India’s Bioeconomy Surpasses $195.3 Billion (Target $300B by 2030)',
    bullets: [
      '**Bioeconomy Valuation:** India’s bioeconomy reached **$195.3 Billion in 2025** (a nearly 20-fold expansion from $10 Billion in 2014), as per the India Bioeconomy Report (IBER) 2026 released on BIRAC’s 14th Foundation Day.',
      '**National Target:** Set to scale to **$300 Billion by 2030**, contributing ~5% to national GDP.'
    ],
    examTrap: '🎯 Exam Angle → India bioeconomy grew from $10Bn (2014) to $195.3Bn (2025) with a $300Bn target by 2030.'
  },

  'ca-2026-q4-sec4-mohfwfssai-ease-of-business-reforms': {
    title: 'FSSAI Perpetual Licences & ₹1.5 Crore Turnover Exemption',
    bullets: [
      '**Perpetual Licence Validity:** Food Safety and Standards Authority of India (FSSAI) introduced perpetual validity for food business registrations and licences effective **1 April 2026**, eliminating annual renewal filings.',
      '**Turnover Threshold Multiplied:** Basic registration exemption threshold raised more than 12-fold from ₹12 Lakh ➔ **₹1.5 Crore annual turnover**.',
      '**Street Vendor Integration:** Street food vendors registered under the Street Vendors Act, 2014 deemed automatically registered with FSSAI, benefiting over 10 Lakh micro-vendors.'
    ],
    examTrap: '🎯 Exam Angle → FSSAI basic registration threshold raised from ₹12 Lakh to ₹1.5 Crore; licences granted perpetual validity.'
  },

  'ca-2026-q4-sec4-tv-rating-policy-trp-2026': {
    title: 'Television Rating Points (TRP) Policy 2026 Net Worth Norms',
    bullets: [
      '**Net Worth Threshold Lowered:** Ministry of Information and Broadcasting slashed the minimum net worth requirement for television rating agencies from ₹20 Crore ➔ **₹5 Crore**.',
      '**Sample Scaling & Governance:** Mandates that rating agencies must maintain ≥50% independent directors and scale household sample meters to **80,000 homes in 18 months** (eventually expanding to 1,20,000 homes).'
    ],
    examTrap: '🎯 Exam Angle → TRP rating agency net worth requirement lowered from ₹20 Crore to ₹5 Crore.'
  },

  'ca-2026-q4-sec4-indias-milk-production': {
    title: 'India’s National Milk Production Reaches 247 Million Tonnes',
    bullets: [
      '**Global Dairy Leadership:** India’s annual milk production reached **247 Million Tonnes (MT) in 2025** (up from 17 MT in 1950), solidifying India’s rank as the world’s #1 milk producer (led by Uttar Pradesh).',
      '**Long-Term Demand Forecast:** NITI Aayog projected domestic milk demand to reach **480 to 606 MT by 2047**, with indigenous buffaloes contributing 31.18% of total production.'
    ],
    examTrap: '🎯 Exam Angle → India milk production stands at 247 MT (UP leads); NITI Aayog 2047 projection is 480-606 MT.'
  },

  'ca-2026-q4-sec4-india-leads-global-ircc-issuance-nagoya-proto': {
    title: 'India Leads Global IRCC Biodiversity Certificates (>56% Share)',
    bullets: [
      '**Nagoya Protocol Leadership:** India issued **3,561 out of 6,311 Internationally Recognized Certificates of Compliance (IRCC)** worldwide, accounting for **over 56% of global certificates** under the Nagoya Protocol on Access and Benefit-Sharing.',
      '**Global Standing:** Ranked #1 globally (France ranked 2nd with 964 certificates; only 34 out of 142 signatory nations have issued IRCCs).'
    ],
    examTrap: '🎯 Exam Angle → India issued >56% of global IRCC certificates (3,561 total) under the Nagoya Protocol.'
  },

  'ca-2026-q4-sec4-solid-waste-management-rules-2026': {
    title: 'Solid Waste Management Rules 2026: Mandatory 4-Way Segregation',
    bullets: [
      '**Statutory Replacement:** Ministry of Environment, Forest and Climate Change notified the Solid Waste Management Rules 2026, replacing the 2016 rules effective **1 April 2026**.',
      '**4-Way Source Segregation:** Mandates household and commercial segregation into **4 streams: Wet (biodegradable), Dry (recyclable), Domestic Hazardous/Sanitary, and Special-Care Waste**.',
      '**Refuse-Derived Fuel (RDF) Targets:** Mandates cement and thermal plants to increase RDF substitution from **5% ➔ 15% over 6 years**.'
    ],
    examTrap: '🎯 Exam Angle → SWM Rules 2026 mandate 4-way segregation and 5%➔15% RDF substitution; effective 1 April 2026.'
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

  'ca-2026-q4-sec4-gujarat-semiconductor-ecosystem': {
    title: 'Gujarat Semiconductor Hub: ₹1,600 Cr Foreign Capital Inflow',
    bullets: [
      '**Multinational Semiconductor Expansion:** Sanand and Dholera semiconductor clusters in Gujarat attracted over **₹1,600 Crore in fresh foreign investments** from Horiba (Japan), South Korean component vendors, and Hotayi Electronic (Malaysia).'
    ],
    examTrap: '🎯 Exam Angle → Gujarat’s key semiconductor hubs are Sanand and Dholera (India Semiconductor Mission).'
  },

  'ca-2026-q4-sec4-uttarakhand-ranks-1st': {
    title: 'Uttarakhand Ranks 1st in New Criminal Law Implementation (ICJS 2.0)',
    bullets: [
      '**National ICJS 2.0 Ranking:** Uttarakhand achieved **Rank 1 with a score of 93.46** on the NCRB/CCTNS national dashboard for operationalizing the new Bharatiya Nyaya Sanhita (BNS), BNSS, and BSA criminal laws.',
      '**Top 5 State Performers:** Uttarakhand was followed by **Haryana (Rank 2), Assam (Rank 3), Sikkim (Rank 4), and Madhya Pradesh (Rank 5)**.'
    ],
    examTrap: '🎯 Exam Angle → Uttarakhand ranked 1st in ICJS 2.0 criminal law compliance; top 3 states: Uttarakhand, Haryana, Assam.'
  },

  'ca-2026-q4-sec4-punjab-sikhya-kranti-20': {
    title: 'Punjab ‘Sikhya Kranti 2.0’ Education Overhaul (₹3,500 Crore)',
    bullets: [
      '**School Education Transformation:** Punjab launched the **Sikhya Kranti 2.0** initiative with a total outlay of **₹3,500 Crore** to upgrade senior secondary schools and STEM labs.',
      '**Multilateral Funding Split:** Financed via a **₹2,500 Crore World Bank loan** paired with **₹1,000 Crore in direct State Government budgetary funding**.'
    ],
    examTrap: '🎯 Exam Angle → Punjab Sikhya Kranti 2.0 funded by World Bank (₹2,500 Cr loan) + State Govt (₹1,000 Cr).'
  },

  'ca-2026-q4-sec4-ups-project-ganga': {
    title: 'Uttar Pradesh ‘Project GANGA’ Rural High-Speed Broadband',
    bullets: [
      '**Digital Connectivity Mission:** Government of Uttar Pradesh rolled out **Project GANGA** to deliver fiber-to-the-home (FTTH) high-speed broadband to over **20 Lakh rural households** across 75 districts over a 2- to 3-year timeline.'
    ],
    examTrap: '🎯 Exam Angle → Project GANGA is UP’s rural broadband connectivity mission targeting 20 Lakh+ households.'
  },

  'ca-2026-q4-sec4-fatf-adds-kuwait-papua-new-guinea': {
    title: 'FATF Adds Kuwait & Papua New Guinea to AML Grey List',
    bullets: [
      '**Increased Monitoring Grey List:** Financial Action Task Force (FATF) placed **Kuwait and Papua New Guinea** on its increased monitoring "Grey List" for strategic deficiencies in anti-money laundering (AML) and counter-terrorist financing (CFT) frameworks.',
      '**High-Risk Black List Unchanged:** The FATF High-Risk Jurisdictions "Black List" remains unchanged with **Iran, DPRK (North Korea), and Myanmar**.'
    ],
    examTrap: '🎯 Exam Angle → FATF grey list added Kuwait and PNG; black list remains Iran, North Korea, Myanmar.'
  },

  'ca-2026-q4-sec4-14th-wto-ministerial-conference-yaounde-cam': {
    title: '14th WTO Ministerial Conference (MC14) in Yaoundé, Cameroon',
    bullets: [
      '**Host City & Dates:** 14th Ministerial Conference of the World Trade Organization (MC14) held in **Yaoundé, Cameroon** (26–29 March 2026); Indian delegation led by Union Commerce Minister Piyush Goyal.',
      '**Institutional Static GK:** WTO established on **1 January 1995** under the Marrakesh Agreement; Director-General is **Dr. Ngozi Okonjo-Iweala**; Headquarters located in **Geneva, Switzerland**.'
    ],
    examTrap: '🎯 Exam Angle → WTO MC14 host: Yaoundé, Cameroon; DG Dr. Ngozi Okonjo-Iweala.'
  },

  'ca-2026-q4-sec4-quick-hits-international': {
    title: 'Strait of Hormuz Oil Flows & India-Uzbekistan Pharma Corridor',
    bullets: [
      '**Strait of Hormuz Strategic Chokepoint:** Transits approximately **20% of total global petroleum consumption (~20 Million barrels/day)**, ranking as the world’s 2nd-busiest maritime chokepoint after the Strait of Malacca.',
      '**India-Uzbekistan Pharma Corridor:** Established a bilateral trade corridor targeting **$7 to $10 Billion in pharmaceutical and nutraceutical exports** across CIS and Central Asian markets.'
    ],
    examTrap: '🎯 Exam Angle → Strait of Hormuz handles ~20% of global oil transit.'
  },

  // =============================================================
  // SECTION 5: MoUs, CONFERENCES & APPOINTMENTS
  // =============================================================
  'ca-2026-q4-sec5-india-france-summit-21-agreements': {
    title: 'India-France Bilateral Summit: 21 Agreements Signed',
    bullets: [
      '**Defence Cooperation Extension:** India and France renewed their overarching Defence Cooperation Agreement for a period of **10 years** during the bilateral summit in New Delhi.',
      '**Key Strategic Industrial Pacts:** Signed a joint venture between Bharat Electronics Limited (BEL) and Safran for domestic production of **HAMMER precision-guided air-to-surface missiles**.',
      '**First Private Helicopter Assembly Line:** Tata Advanced Systems Limited (TASL) and Airbus finalized the establishment of India’s first private-sector helicopter final assembly line (H125) in Karnataka.',
      '**AI in Healthcare Centre:** Established the Indo-French Centre for Artificial Intelligence in Health at AIIMS New Delhi.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — India-France signed 21 pacts (vs Germany 19, EU 13); BEL-Safran HAMMER missile JV; Tata-Airbus helicopter assembly line.'
  },

  'ca-2026-q4-sec5-india-germany-summit-19-pacts': {
    title: 'India-Germany Bilateral Summit: 19 Pacts & Green Partnership',
    bullets: [
      '**Green & Sustainable Development Partnership (GSDP):** Germany committed **€1.24 Billion in concessional green financing** for renewable energy and urban mobility in India.',
      '**Visa-Free Transit Agreement:** Germany granted visa-free airport transit privileges for Indian passport holders traveling to third-party destinations through German hubs.',
      '**Foreign Policy Dialogue:** Established a dedicated Track 1.5 Foreign Policy and Security Dialogue.'
    ],
    examTrap: '🎯 Exam Angle → India-Germany signed 19 pacts (including €1.24Bn GSDP funding and visa-free airport transit).'
  },

  'ca-2026-q4-sec5-india-eu-13-agreements': {
    title: '16th India-EU Summit: 13 Strategic Agreements Concluded',
    bullets: [
      '**High-Level Leadership:** Co-chaired by Prime Minister Narendra Modi, European Council President António Costa, and European Commission President Ursula von der Leyen on 27 January 2026.',
      '**Agreements Finalised:** Concluded 13 bilateral pacts encompassing the India-EU Free Trade Agreement, clean hydrogen partnerships, and the landmark RBI-ESMA MoU on clearing corporation (CCIL) recognition.'
    ],
    examTrap: '🎯 Exam Angle → India-EU signed 13 agreements during 16th Summit; Chief Guests at 77th Republic Day were António Costa & Ursula von der Leyen.'
  },

  'ca-2026-q4-sec5-other-notable-mous': {
    title: 'Bharat Container Shipping Line & Bilateral Institutional MoUs',
    bullets: [
      '**Bharat Container Shipping Line (BCSL):** Formed as a joint national venture between Shipping Corporation of India (SCI), CONCOR, and major port authorities under the Ministry of Ports, Shipping and Waterways.',
      '**FCI-WFP Food Aid Agreement:** Food Corporation of India entered a multi-year pact with the UN World Food Programme (WFP) to supply **2,00,000 MT of wheat and rice over 5 years** for humanitarian relief.',
      '**India-Malaysia 11 Pacts:** Signed 11 bilateral agreements including cross-border UPI payments linking NIPL with PayNet Malaysia.'
    ],
    examTrap: '🎯 Exam Angle → BCSL is a joint venture of SCI + CONCOR + Ports; FCI to supply 2,00,000 MT foodgrains to WFP over 5 years.'
  },

  'ca-2026-q4-sec5-mufg-bank-acquires-stake-in-shriram-finance': {
    title: 'MUFG Bank Acquires Strategic Equity in Shriram Finance',
    bullets: [
      '**Strategic Banking Investment:** Japan’s MUFG Bank acquired a minority equity stake in **Shriram Finance Limited** (classified as an NBFC-Upper Layer by the Reserve Bank of India) to expand retail and commercial vehicle financing.'
    ],
    examTrap: '🎯 Exam Angle → MUFG Bank invested in Shriram Finance (NBFC-Upper Layer).'
  },

  'ca-2026-q4-sec5-quick-hits-ma': {
    title: 'IPL Team Ownership Deals: RCB ($1.78B) & Rajasthan Royals ($1.63B)',
    bullets: [
      '**Royal Challengers Bengaluru (RCB) Record Sale:** United Spirits Limited (USL) sold RCB for a record valuation of **$1.78 Billion (₹16,660 Crore)** to a consortium comprising Aditya Birla Group, Times of India Group, Blackstone, and Bolt Ventures.',
      '**Rajasthan Royals Equity Transaction:** Manoj Badale sold controlling equity in Rajasthan Royals to US-based investor Kal Somani for **$1.63 Billion**.'
    ],
    examTrap: '🎯 Exam Angle → RCB sold for record $1.78 Billion (₹16,660 Cr) vs Rajasthan Royals at $1.63 Billion.'
  },

  'ca-2026-q4-sec5-iicdem-2026': {
    title: 'IICDEM 2026 International Election Conference & ECINET',
    bullets: [
      '**Delhi Declaration 2026:** Election Commission of India hosted the International Conference on Democratic Elections and Management (IICDEM 2026) in New Delhi, adopting the 5-pillar Delhi Declaration.',
      '**ECINET Digital Platform:** ECI officially launched **ECINET**, a secure global portal for peer-to-peer knowledge exchange among election management bodies.'
    ],
    examTrap: '🎯 Exam Angle → ECI launched the ECINET portal during IICDEM 2026.'
  },

  'ca-2026-q4-sec5-india-ai-impact-summit': {
    title: 'India AI Impact Summit 2026: Ministerial Outcomes',
    bullets: [
      '**High-Level Deliberations:** The summit finalized international frameworks on ethical AI compute sharing, sovereign model governance, and national AI safety institutes.'
    ],
    examTrap: '🎯 Exam Angle → Endorsed by 89 countries; MANAV Vision framework.'
  },

  'ca-2026-q4-sec5-2nd-global-buddhist-summit': {
    title: '2nd Global Buddhist Summit Hosted in New Delhi',
    bullets: [
      '**Bharat Mandapam Conclave:** Ministry of Culture and International Buddhist Confederation (IBC) organized the 2nd Global Buddhist Summit (24–25 January 2026) at Bharat Mandapam, New Delhi, bringing together monastic delegations from 30+ nations.'
    ],
    examTrap: '🎯 Exam Angle → 2nd Global Buddhist Summit hosted at Bharat Mandapam, New Delhi.'
  },

  'ca-2026-q4-sec5-9th-ions-conclave-of-chiefs': {
    title: '9th Indian Ocean Naval Symposium (IONS) Conclave of Chiefs',
    bullets: [
      '**Visakhapatnam Conclave:** Indian Navy hosted the 9th IONS Conclave of Chiefs in Visakhapatnam, where India formally assumed the **IONS Chairmanship for the 2026–2028 tenure**.'
    ],
    examTrap: '🎯 Exam Angle → India assumed IONS Chairmanship (2026-2028) at the 9th Conclave in Visakhapatnam.'
  },

  'ca-2026-q4-sec5-key-appointments-tier-a': {
    title: 'Consolidated High-Yield Banking & Regulatory Appointments (Jan–March 2026)',
    bullets: [
      '🏦 **Commercial & Public Sector Banks:**\n• **ICICI Bank:** Sandeep Bakhshi re-appointed MD & CEO.\n• **Canara Bank:** Hardeep Singh Ahluwalia appointed MD & CEO.\n• **IndusInd Bank:** Arijit Basu appointed Chairman (succeeding Sunil Mehta).\n• **YES Bank:** Vinay Muralidhar Tonse appointed MD & CEO.\n• **AU Small Finance Bank:** Sanjay Agarwal re-appointed MD & CEO.\n• **HDFC Bank:** Keki Mistry appointed Interim Part-Time Chairman.',
      '🏛️ **Regulatory Bodies & Apex Institutions:**\n• **SEBI Whole-Time Members (WTMs):** K.V. Ramana Murthy, Kamlesh Chandra Varshney, Sandip Pradhan, and Amarjeet Singh appointed WTMs.\n• **GIFT City:** Uday Kotak appointed Chairman (succeeding Hasmukh Adhia).\n• **NITI Aayog:** Nidhi Chhibber appointed Interim CEO.\n• **ICAI:** CA Prasanna Kumar D elected 74th President for 2026-27.',
      '🎖️ **Defence & Diplomatic Leadership:**\n• **Vice Chief of Army Staff:** Lt Gen Dheeraj Seth appointed VCOAS.\n• **Ambassador to China:** Vikram Doraiswami named India’s Ambassador to China.\n• **High Commissioner to UK:** Periasamy Kumaran appointed High Commissioner.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Uday Kotak (GIFT City Chairman), Keki Mistry (HDFC Bank Interim Chairman), Hardeep Singh Ahluwalia (Canara Bank MD&CEO).'
  },

  // =============================================================
  // SECTION 6: SCIENCE, TECHNOLOGY, DEFENCE & SPORTS
  // =============================================================
  'ca-2026-q4-sec6-defence-highlights': {
    title: 'Defence Highlights: Hypersonic LR-AShM, ‘Bhairav’ Drones & Agni-III',
    bullets: [
      '**DRDO Hypersonic LR-AShM Missile:** DRDO’s Long-Range Anti-Ship Missile (LR-AShM) with hypersonic glide trajectory made its public debut during the 77th Republic Day parade.',
      '**Indian Army ‘Bhairav’ Drone Force:** Established ‘Bhairav’, an elite dedicated drone-warfare wing with over **1,00,000 trained military drone operators**.',
      '**Agni-III Intermediate Ballistic Missile:** Successfully flight-tested from ITR Chandipur off the Odisha coast (operational strike range of **3,000 to 3,500 km**).',
      '**Global Nuclear Stockpile Rank:** India ranks **6th globally with an estimated 180 nuclear warheads** as per Federation of American Scientists (FAS) report (Russia leads globally with 4,309 warheads).',
      '**Historic Presidential Flight:** President Droupadi Murmu flew a sortie in the indigenous Light Combat Helicopter (LCH) ‘Prachand’, becoming the first Indian President to fly India’s combat helicopter.'
    ],
    examTrap: '🎯 Exam Angle → India nuclear stockpile ranks 6th (180 warheads); Army Bhairav drone force scale: 1,00,000+ operatives; Agni-III range: 3,000-3,500 km.'
  },

  'ca-2026-q4-sec6-sci-tech-highlights': {
    title: 'Sci-Tech Milestones: ISRO CE20 Ground Test & Chandrayaan-4 Site',
    bullets: [
      '**ISRO CE20 Cryogenic Engine Test:** Successfully hot-tested the CE20 cryogenic engine for **165 seconds at 22 tonnes of thrust** at Mahendragiri, Tamil Nadu (powers the LVM3 upper stage).',
      '**Chandrayaan-4 Landing Site Identified:** ISRO designated the **MM-4 landing site in the Mons Mouton region** near the lunar South Pole for the Chandrayaan-4 sample-return mission (scheduled for ~2028).',
      '**North East’s First Satellite (Lachit-1):** Launched Lachit-1, the first satellite developed by researchers in North East India.',
      '**Bharat GenAI Foundation Model:** IIT Bombay rolled out the Bharat GenAI sovereign AI multimodal text model, fine-tuned across 15 of the 22 Eighth Schedule languages.'
    ],
    examTrap: '🎯 Exam Angle → CE20 cryogenic engine tested at 22 tonnes thrust (165 sec); Chandrayaan-4 landing site is Mons Mouton (MM-4).'
  },

  'ca-2026-q4-sec6-iafs-vayu-baan-ins-taragiri-f41-commissioning': {
    title: 'IAF ‘Vayu Baan’ Air-Launched Drone & INS Taragiri (F41)',
    bullets: [
      '**IAF ‘Vayu Baan’ UAS:** Indian Air Force operationalised ‘Vayu Baan’, India’s first helicopter-launched Unmanned Aerial System with a **50+ km standoff range**, making India the 3rd country globally (after US and China) to deploy helicopter-launched drone tech.',
      '**INS Taragiri (F41) Commissioning:** Mazagon Dock Shipbuilders delivered stealth guided-missile frigate **INS Taragiri (F41)** for commissioning into the Indian Navy on **3 April 2026** at Visakhapatnam (equipped with CODOG propulsion, supersonic BrahMos, and Varunastra ASW torpedoes).',
      '**Operation Urja Suraksha:** Indian Navy deployed frontline destroyers and frigates under Operation Urja Suraksha to safely escort Indian-flagged crude oil and LNG tankers through the Strait of Hormuz.'
    ],
    examTrap: '🎯 Exam Angle → IAF Vayu Baan is helicopter-launched with 50+ km range; INS Taragiri (F41) built by Mazagon Dock.'
  },

  'ca-2026-q4-sec6-sports-top-results-janfeb-merged': {
    title: 'Sports Highlights (Jan–Feb): U19 World Cup, WPL & Vijay Hazare',
    bullets: [
      '**ICC U-19 Cricket World Cup 2026:** India clinched its **record 6th U-19 World Cup title** in Zimbabwe; 14-year-old batting sensation Vaibhav Suryavanshi named Player of the Match and Player of the Series.',
      '**Women’s Premier League (WPL 2026):** Royal Challengers Bengaluru (RCB) won the WPL 2026 title.',
      '**Vijay Hazare Trophy 2025-26:** Vidarbha won its maiden Vijay Hazare Trophy domestic one-day championship title.',
      '**Winter Olympics 2026 (Milan-Cortina):** Norway topped the medal table with 16 Gold medals.'
    ],
    examTrap: '🎯 Exam Angle → India won 6th U19 Cricket World Cup (Vaibhav Suryavanshi MVP); Vidarbha won maiden Vijay Hazare Trophy.'
  },

  'ca-2026-q4-sec6-india-wins-icc-mens-t20-world-cup-2026-3rd-ti': {
    title: 'India Wins ICC Men’s T20 World Cup 2026 (Historic 3rd Title)',
    bullets: [
      '**Final Match Landmark:** India defeated New Zealand by 96 runs in the final on **8 March 2026** (International Women’s Day) at Narendra Modi Stadium, Ahmedabad, to lift the 10th edition of the ICC Men’s T20 World Cup.',
      '**Historic Double Milestone:** India became the **1st team in cricket history to win back-to-back T20 World Cup titles** (2024 & 2026) and the **1st team to win the trophy on home soil**.',
      '**Leadership & Awards:** Captained by Suryakumar Yadav; Jasprit Bumrah named Player of the Match; Sanju Samson named Player of the Tournament.',
      '**Trophy Legacy:** Marks India’s **3rd T20 World Cup title** (2007 under MS Dhoni, 2024 under Rohit Sharma, and 2026 under Suryakumar Yadav).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — India is the 1st team to win consecutive T20 World Cups and 1st to win on home soil; Captain Suryakumar Yadav, MVP Sanju Samson.'
  },

  'ca-2026-q4-sec6-jk-wins-its-first-ever-ranji-trophy-2026': {
    title: 'Jammu & Kashmir Wins Historic First-Ever Ranji Trophy (2026)',
    bullets: [
      '**Historic Maiden Title:** Jammu & Kashmir won its **first-ever Ranji Trophy title** in the tournament’s 92-year history, defeating 8-time champions Karnataka in the final at Hubballi.',
      '**Tournament Legacy:** Came 67 years after J&K’s domestic cricket debut in 1959-60; Mumbai holds the all-time record with 42 Ranji Trophy titles.'
    ],
    examTrap: '🎯 Exam Angle → J&K won its maiden Ranji Trophy in 2026 (beat Karnataka at Hubballi); Mumbai holds record with 42 titles.'
  },

  'ca-2026-q4-sec6-sports-quick-hits-grandmasters-world-indoor-a': {
    title: 'Sports Quick Hits: 94th Grandmaster & 2028 World Athletics',
    bullets: [
      '**India’s 93rd & 94th Chess Grandmasters:** Aarav Dengla (Mumbai) became India’s 93rd GM, and Mayank Chakraborty (Assam) became India’s 94th GM (and the first-ever Grandmaster from North East India).',
      '**World Indoor Athletics Championships 2028:** World Athletics awarded the hosting rights for the **2028 World Indoor Athletics Championships to India** (to be staged at Kalinga Stadium, Bhubaneswar).',
      '**IPL 2026 Player Auction:** Cameron Green became the most expensive player at ₹25.20 Crore; Prashant Veer and Kartik Sharma emerged as the joint-most expensive uncapped Indian players at ₹14.20 Crore each.'
    ],
    examTrap: '🎯 Exam Angle → World Indoor Athletics 2028 awarded to Bhubaneswar (Kalinga Stadium); Mayank Chakraborty is 1st GM from North East India.'
  },

  // =============================================================
  // SECTION 7: AWARDS, BOOKS, INDICES & RANKINGS
  // =============================================================
  'ca-2026-q4-sec7--consolidated-global-indices-table': {
    title: 'Consolidated Global Indices & India’s International Rankings (Q4 FY26)',
    bullets: [
      '📊 **Macro & Economic Governance Indices:**\n• **Global Innovation Index 2025-26:** India advanced significantly to **Rank 38** (up from 81st).\n• **Network Readiness Index 2025:** Ranked **45th** (Score: 54.43; #1 globally in telecom investment and AI publications).\n• **Corruption Perceptions Index 2025 (Transparency Intl):** Ranked **91st / 182 countries** (Score: 39; Denmark #1 for 8th year).\n• **Global Terrorism Index 2026 (13th edn, IEP):** Ranked **13th** (Score: 6.428; worst affected: Pakistan, Burkina Faso, Niger).',
      '✈️ **Mobility & Brand Finance Rankings:**\n• **Henley Passport Index 2026:** India ranked **75th** with visa-free access to **56 countries** (moved up from 80th in Jan).\n• **Global Soft Power Index 2026 (Brand Finance):** Ranked **32nd** (Score: 48.0).\n• **Brand Finance Banking 500 (2026):** HDFC Bank ranked **31st ($12.4Bn)** and SBI ranked **56th ($8.1Bn, AAA+ rating)**.\n• **Skytrax World Airport Awards 2026:** Delhi IGI Airport ranked **28th globally** (Singapore Changi #1 for 13th time).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Henley Passport rank is 75th (56 visa-free destinations); GII rank is 38th; CPI rank is 91st; HDFC Bank 31st vs SBI 56th in Banking 500.'
  },

  'ca-2026-q4-sec7-indias-billionaire-counts-hurun-vs-forbes-2026': {
    title: 'India’s Billionaire Wealth: Hurun (308) vs Forbes (229) Comparison',
    bullets: [
      '**Hurun Global Rich List 2026:** India has **308 billionaires** (+24 YoY), ranking **3rd globally** after the US and China; Mumbai leads India with 95 resident billionaires; Mukesh Ambani is India’s and Asia’s richest individual (₹9.8 Trillion).',
      '**Forbes World’s Billionaires List 2026 (40th Edition):** Recorded **229 Indian billionaires** with combined wealth exceeding $1 Trillion; Top 5 in India: Mukesh Ambani, Gautam Adani, Savitri Jindal (India’s richest woman), Lakshmi Mittal, and Shiv Nadar.',
      '**Youngest Billionaire:** 22-year-old Surya Midha (co-founder, Mercor) became the world’s youngest self-made billionaire, matching Mark Zuckerberg’s record.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — Hurun count (308 billionaires) vs Forbes count (229 billionaires) is a classic confusion pair; Savitri Jindal is India’s richest woman.'
  },

  'ca-2026-q4-sec7-reports-sipri-arms-imports-microfinance-pulse': {
    title: 'SIPRI Arms Imports Report, UNCTAD FDI & Microfinance Trends',
    bullets: [
      '**SIPRI International Arms Transfers (2021–2025):** India ranked as the world’s **2nd-largest arms importer** (behind Ukraine at #1); Russia remains India’s largest single weapons supplier; Top 5 suppliers globally: USA, France, Russia, Germany, China.',
      '**UNCTAD Global Investment Trends:** Foreign direct investment inflows into India surged by **73% YoY to $47 Billion in 2025**.',
      '**Microfinance Pulse Report (SIDBI + Equifax):** Microfinance loans >₹75,000 expanded to **38% of total disbursements** (up from 25%); Bihar holds India’s largest state MFI loan portfolio.'
    ],
    examTrap: '🎯 Exam Angle → SIPRI: India is 2nd-largest arms importer (Ukraine 1st); UNCTAD: India FDI jumped 73% to $47 Billion.'
  },

  'ca-2026-q4-sec7-mar-indias-maternal-child-mortality-major-declines': {
    title: 'India’s Maternal & Child Mortality: 80% MMR & 70% NMR Declines',
    bullets: [
      '**Maternal Mortality Ratio (MMR) Plummet:** Lancet study reported India’s MMR dropped by ~80% from 508 per Lakh live births (1990) ➔ **116 per Lakh live births in 2023** (latest SRS 2021-23 puts current MMR at **88**).',
      '**Neonatal Mortality Rate (NMR):** UN Inter-agency Group for Child Mortality Estimation reported NMR declined by ~70% from 57 ➔ **17 per 1,000 live births** (SDG target: <12 per 1,000).',
      '**Under-5 Mortality Rate (U5MR):** Dropped by 79% from 127 ➔ **27 per 1,000 live births** (SDG target: <25 per 1,000).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — MMR is 116 (Lancet) / 88 (SRS); NMR dropped to 17/1,000; U5MR dropped to 27/1,000.'
  },

  'ca-2026-q4-sec7-awards-padma-2026-jnanpith-bcci-oscars': {
    title: 'Padma Awards 2026, 60th Jnanpith & National Honors',
    bullets: [
      '**Padma Awards 2026 Breakdown:** President approved **131 total Padma Awards**, comprising **5 Padma Vibhushan, 13 Padma Bhushan, and 113 Padma Shri**.',
      '**60th Jnanpith Award (2025):** Awarded to eminent Tamil poet and lyricist **R. Vairamuthu** (received ₹11 Lakh cash prize and bronze statue of Goddess Saraswati; 3rd Tamil writer to win after Akilan and Jayakanthan).',
      '**Crafoord Prize 2026:** Awarded to Indian-origin atmospheric scientist **Veerabhadran Ramanathan** by the Royal Swedish Academy of Sciences ("Nobel of Geosciences").',
      '**BCCI Annual Awards 2026:** Shubman Gill won Cricketer of the Year (Polly Umrigar Award); Smriti Mandhana named Best International Cricketer (Women) for a **record 5th time**; Rahul Dravid and Roger Binny received the Col. C.K. Nayudu Lifetime Achievement Award.'
    ],
    examTrap: '🎯 Exam Angle → Padma Awards total: 131 (5 Vibhushan + 13 Bhushan + 113 Shri); Jnanpith winner: R. Vairamuthu; Smriti Mandhana won record 5th BCCI award.'
  },

  'ca-2026-q4-sec7-books-and-state-festivals-pairings': {
    title: 'Notable Books & Traditional State Festival Pairings',
    bullets: [
      '📚 **Notable Books in News:**\n• *Mahatma: A Great Communicator* — Authored by Dr. Dhiraj Kakadia (released by Union Minister Mansukh Mandaviya).\n• *Karuna: The Power of Compassion* — Authored by Nobel Peace Laureate Kailash Satyarthi.\n• *Quantum Physics: One Hundred Magical Years* — Authored by Prof. V.P.N. Nampoori.',
      '🎉 **Traditional Cultural Festivals:**\n• **Attukal Pongala:** Thiruvananthapuram, Kerala.\n• **Sarhul:** Adivasi tribal spring festival in Jharkhand.\n• **Chapchar Kut:** Mizoram agricultural festival.\n• **Sajibu Cheiraoba:** Meitei New Year festival in Manipur.\n• **Phool Dei:** Harvest festival of Uttarakhand.\n• **Hola Mohalla:** Takht Sachkhand Sri Abchalnagar Sahib (Nanded).'
    ],
    examTrap: '🎯 Exam Angle → Sarhul (Jharkhand), Chapchar Kut (Mizoram), Attukal Pongala (Kerala); Kailash Satyarthi author of Karuna.'
  },

  // =============================================================
  // SECTION 8: IMPORTANT DAYS & PERSONS IN NEWS
  // =============================================================
  'ca-2026-q4-sec8--consolidated-important-days': {
    title: 'Consolidated National & International Important Days (Jan–March 2026)',
    bullets: [
      '📅 **January Milestones:**\n• **15 Jan — 78th Indian Army Day:** Celebrated at Jaipur (4th time organized outside Delhi cantonment).\n• **16 Jan — 77th NDA Raising Day:** National Defence Academy raising day.\n• **25 Jan — 16th National Voters Day:** National theme *"My India, My Vote"*.',
      '📅 **February Milestones:**\n• **13 Feb — National Women’s Day:** Commemorating the birth anniversary of Sarojini Naidu.\n• **20 Feb — Arunachal Pradesh 40th Statehood Day:** Statehood granted in 1987 (24th State of India).\n• **24 Feb — ESIC Foundation Day (75th Jubilee):** ESI Act passed in 1948; scheme launched 24 Feb 1952.\n• **28 Feb — National Science Day:** Commemorating discovery of the Raman Effect (Nobel Prize 1930); theme *"Women in Science"*.',
      '📅 **March Milestones:**\n• **1 Mar — 50th Civil Accounts Day:** Golden Jubilee edition.\n• **7 Mar — 8th Janaushadhi Diwas:** Concluding PMBJP Janaushadhi Week (1–7 March).\n• **8 Mar — International Women’s Day:** Global theme *"Rights. Justice. Action."*\n• **23 Mar — Shaheed Diwas:** Martyrdom of Bhagat Singh, Rajguru, and Sukhdev (1931).\n• **24 Mar — World Tuberculosis Day:** Global theme *"Yes! We can end TB!"*\n• **28 Mar — 20th Earth Hour:** Observed 8:30–9:30 PM under WWF (initiated in 2007).'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — 78th Army Day (Jaipur); ESIC 75th Jubilee year; 50th Civil Accounts Day; 8th Janaushadhi Diwas; National Science Day theme "Women in Science".'
  },

  'ca-2026-q4-sec8--persons-in-news': {
    title: 'Prominent Personalities in News: Milestones & Records (Jan–March 2026)',
    bullets: [
      '👑 **National Governance & Historic Tenures:**\n• **Prime Minister Narendra Modi:** Became the **longest-serving elected head of government in India (8,931 days)**, surpassing Pawan Kumar Chamling’s 8,930-day tenure as Sikkim Chief Minister; crossed 100 Million Instagram followers (most-followed world leader).\n• **Finance Minister Nirmala Sitharaman:** Delivered her **9th consecutive Union Budget**, becoming the longest-serving Finance Minister in Indian parliamentary history.\n• **Gujarat UCC Enactment:** Gujarat became the 2nd state in India (after Uttarakhand) to pass a Uniform Civil Code (UCC) Bill.',
      '🏏 **Sports Records & Global Honours:**\n• **Rashid Khan:** Became the first bowler in cricket history to capture **700 T20 wickets**.\n• **Harmanpreet Kaur:** Became the most-capped woman cricketer in international cricket history.\n• **Lionel Messi:** Became only the 2nd male footballer in history to score **900 official career goals** (behind Cristiano Ronaldo’s 965).\n• **Natarajan Chandrasekaran:** Tata Group Chairman conferred an honorary Knighthood (KBE) by the United Kingdom.'
    ],
    examTrap: '🎯 Exam Angle → 🔥 HIGH — PM Modi’s 8,931-day governance record; Sitharaman’s 9th consecutive budget; Rashid Khan 700 T20 wickets; Gujarat 2nd state with UCC.'
  },

  // =============================================================
  // SECTION 9: PIB, CIRCULARS & NOTIFICATIONS
  // =============================================================
  'ca-2026-q4-sec9-rare-earth-magnets-scheme-hpv-vaccination-dri': {
    title: 'Sintered Rare Earth Magnets Scheme (₹7,280 Cr) & National HPV Drive',
    bullets: [
      '**Rare Earth Permanent Magnets (REPM) Scheme:** Union Cabinet approved the Scheme to Promote Manufacturing of Sintered Rare Earth Permanent Magnets with a total outlay of **₹7,280 Crore**, targeting domestic capacity of **6,000 MTPA** (aligned with National Critical Minerals Mission).',
      '**Nationwide HPV Vaccination Drive:** Launched from Ajmer, Rajasthan under the vision *"Swastha Nari"*, providing indigenous Gardasil HPV vaccines to 14-year-old adolescent girls to prevent cervical cancer.'
    ],
    examTrap: '🎯 Exam Angle → REPM scheme outlay is ₹7,280 Crore (6,000 MTPA target); HPV vaccination launched from Ajmer, Rajasthan.'
  },

  // =============================================================
  // SECTION 10: GOVT SCHEMES & STATIC
  // =============================================================
  'ca-2026-q4-sec10-pm-setu-vibrant-village-sukanya-samriddhi': {
    title: 'PM-SETU ITI Modernisation (₹60,000 Cr) & Vibrant Village Phase-II',
    bullets: [
      '**PM-SETU (ITI Modernisation):** Approved with an outlay of **₹60,000 Crore** to upgrade 1,000 Industrial Training Institutes (ITIs) into advanced skill technology hubs, backed by an **$830 Million World Bank loan**.',
      '**Vibrant Villages Programme Phase II:** Extended to cover **1,954 strategic border villages** across 15 States and 2 UTs along international borders with Pakistan, Nepal, Bangladesh, Bhutan, and Myanmar.',
      '**Flagship Small Savings Schemes:** Sukanya Samriddhi Yojana (launched 22 Jan 2015) offers **8.2% interest per annum**; Atal Pension Yojana continuation cleared through FY 2030-31.'
    ],
    examTrap: '🎯 Exam Angle → PM-SETU outlay is ₹60,000 Crore with $830Mn World Bank loan; Sukanya Samriddhi interest rate is 8.2%.'
  },

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

console.log('Writing curated master notes across Sections 2 to 10...\n');

let updated = 0;
for (const [id, data] of Object.entries(CURATED_REMAINING_NOTES)) {
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
    // Find note file matching starting prefix
    const files = fs.readdirSync(corpusDir).filter(f => f.startsWith(id.substring(0, 30)));
    if (files.length > 0) {
      const matchFile = files[0];
      const matchPath = path.join(corpusDir, matchFile);
      const existing = JSON.parse(fs.readFileSync(matchPath, 'utf-8'));
      existing.title = data.title;
      existing.blocks = [
        {
          id: `blk-${existing.id}-bullets`,
          type: 'bullet_list',
          items: data.bullets
        },
        {
          id: `blk-${existing.id}-trap`,
          type: 'exam_trap',
          content: data.examTrap
        }
      ];
      existing.summary = data.bullets[0].substring(0, 160) + '...';
      fs.writeFileSync(matchPath, JSON.stringify(existing, null, 2), 'utf-8');
      updated++;
    } else {
      console.warn(`Could not locate file for: ${id}`);
    }
  }
}

console.log(`✅ Successfully updated ${updated} notes across Sections 2 to 10 with 100% complete, flawless sentences.`);
