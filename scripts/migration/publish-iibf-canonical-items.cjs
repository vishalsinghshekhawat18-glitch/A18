const fs = require('fs');
const path = require('path');

console.log('🚀 Publishing IIBF Canonical Items into Corpus...');

const corpusDir = path.resolve('content/corpus');
const indexPath = path.resolve('content/corpus-index.json');
const manifestPath = path.resolve('content/manifest.json');

const itemsToPublish = [
  {
    id: 'iibf-reg-mod1',
    domain: 'iibf-regulations',
    title: '📌 Module 1: Deposit Operations, Customer Rights & Statutory Governance',
    summary: 'Comprehensive statutory compendium on Nomination under Banking Laws (Amendment) Act 2025 (4 nominees, simultaneous % share vs successive ranking), RBI Deposit Accounts of Minors (Mothers natural guardianship, age 10+ self-operation), DICGC Deposit Insurance (₹5 Lakh cap, Section 18A 90-day mandatory interim payout, Risk-Based Premiums), SEBI Nominee Norms for Incapacitated Folios, and Reserve Bank - Integrated Ombudsman Scheme 2026 (RB-IOS 2026, ₹30L compensation).',
    blocks: [
      {
        id: 'blk-1',
        type: 'paragraph',
        content: 'Deposit operations and customer protection form the bedrock of statutory banking law in India. Recent legislative overhauls under the Banking Laws (Amendment) Act 2025, DICGC Act, and the Reserve Bank - Integrated Ombudsman Scheme (RB-IOS) 2026 have modernized customer rights, expedited distress payouts, and streamlined estate transmissions.'
      },
      {
        id: 'blk-2',
        type: 'bullet_list',
        items: [
          'Nomination under Banking Laws (Amendment) Act, 2025 (Effective 01.11.2025): Depositors can nominate up to 4 persons per deposit account, safe custody article, or safe deposit locker under either Simultaneous Nomination (with explicit % shares summing to 100%) or Successive Nomination (Nominee 1 -> Nominee 2 -> Nominee 3 -> Nominee 4). For single locker hirers, successive nomination applies; for joint hirers, nomination delivers contents to survivors along with nominee.',
          'Legal Status of Nominee: A nominee acts as a trustee/custodian for legal heirs, not the absolute beneficial owner (Supreme Court ruling in Sarbati Devi vs Usha Devi). Bank obtains valid discharge under Section 45ZA, but legal heirs retain succession rights.',
          'RBI Revised Norms for Deposit Accounts of Minors: Minors of any age can open/operate savings & term deposits with natural/legal guardian, with mothers explicitly recognized on par with fathers. Literate minors aged 10+ can independently operate accounts with board-approved velocity limits. Section 11 of Indian Contract Act strictly prohibits overdrafts/credit to minors. Fresh KYC and signature verification mandatory upon turning 18.',
          'DICGC Deposit Insurance System (DICGC Act 1961): Insures up to ₹5,00,000 per depositor per bank (principal + interest). Covers Commercial Banks, RRBs, Co-op Banks, SFBs, and PBs. Excludes foreign/state/central govt and inter-bank deposits. Account coverage ratio: 97.6%; Value coverage ratio: 41.5%.',
          'DICGC Section 18A 90-Day Mandatory Interim Payout: When a bank is placed under All-Inclusive Directions (AID) / moratorium by RBI, the bank has 45 days to submit claims, and DICGC has 45 days to verify and disburse up to ₹5 Lakh directly into depositors alternate bank accounts.',
          'DICGC Risk-Based Premium (RBP) Transition (FY27): Transitioning from flat 12p per ₹100 p.a. to CAMELS-linked risk rating (Tier 1/Tier 2 models offering up to 33.33% risk discount and 25% vintage discount).',
          'SEBI Revised Nomination Norms for Demat/MFs: Incapacitated single investors can authorize 1 nominee to operate folios. AMC/DP official must conduct physical verification. Strict zero-alteration rule on mobile/email/bank details; redemptions flow exclusively to linked investor bank account.',
          'Reserve Bank - Integrated Ombudsman Scheme (RB-IOS) 2026 (Effective 01.07.2026): One Nation One Ombudsman architecture covering SCBs, RRBs, SFBs, PBs, NBFCs (>=₹100 Cr assets), and UCBs (>=₹50 Cr deposits). Consequential financial loss compensation increased from ₹20 Lakh to ₹30 Lakh, plus up to ₹1 Lakh for mental harassment/loss of time. Centralised Receipt and Processing Centre (CRPC) at RBI Chandigarh.'
        ]
      },
      {
        id: 'blk-3',
        type: 'exam_trap',
        content: 'Exam Traps & Distractors:\n1. DICGC insurance of ₹5 Lakh applies PER DEPOSITOR PER BANK across all branches combined (NOT per branch and NOT per individual account).\n2. Inter-bank deposits and Government deposits are 100% EXCLUDED from DICGC insurance coverage.\n3. A nominee under Section 45ZA is NOT the owner of the money; they receive funds purely as a trustee for the deceased legal heirs.\n4. Minors CANNOT be granted overdraft facilities under any circumstance due to Section 11 of Indian Contract Act 1872.'
      }
    ],
    metadata: {
      tags: ['iibf', 'banking-regulations', 'static-ga', 'deposit-insurance', 'dicgc', 'ombudsman', 'nomination', 'minors'],
      category: 'IIBF_MODULE',
      difficulty: 'hard',
      relevanceTier: 'TIER_A',
      sectionCode: 'IIBF_MOD1',
      date: '2026-02-01',
      provenance: {
        sourceSystem: 'IIBF',
        statutoryConcept: 'Deposit Operations & Customer Rights'
      }
    }
  },
  {
    id: 'iibf-reg-mod2',
    domain: 'iibf-regulations',
    title: '📌 Module 2: Credit Risk, Prudential Lending & Fair Lending Frameworks',
    summary: 'Comprehensive analysis of Expected Credit Loss (ECL Ind-AS 109 3-stage forward-looking impairment), RBI Co-Lending Model (CLM 1 & CLM 2 with mandatory 20% NBFC risk retention), Fair Practices Code on Penal Charges (abolition of compounding penal interest), Digital Lending Guidelines 2025 (direct disbursals, KFS/APR, cooling-off, 5% FLDG cap), MCGS & CGTMSE, MISS (4% net crop loans), PM Vishwakarma (5% loan), PSL Norms 2025-26 (population tiers ₹50L/₹45L/₹35L, 60% UCBs), and HFC Regulations (1.5x NOF public deposit ceiling).',
    blocks: [
      {
        id: 'blk-1',
        type: 'paragraph',
        content: 'Prudential credit guidelines govern credit risk underwriting, portfolio provisioning, and borrower protections across Scheduled Commercial Banks, NBFCs, and Housing Finance Companies.'
      },
      {
        id: 'blk-2',
        type: 'bullet_list',
        items: [
          'Expected Credit Loss (ECL) Ind-AS 109 / IFRS 9 Framework: Replaces ex-post Incurred Loss Model with ex-ante forward-looking provisioning based on macroeconomic forecasts. Three stages: Stage 1 (Performing, 0-30 DPD) = 12-Month ECL; Stage 2 (Underperforming, 31-89 DPD / Significant Increase in Credit Risk - SICR) = Lifetime ECL; Stage 3 (Credit-Impaired / Default, 90+ DPD) = Lifetime ECL based on PD x LGD x EAD. 5-year capital transition glide path.',
          'RBI Co-Lending Model (CLM 1 & CLM 2): Combines low-cost bank capital with last-mile NBFC sourcing reach for Priority Sector. CLM 1 = Joint Lending; CLM 2 = Direct Assignment / Sourcing takeover. Mandatory Invariant: NBFC MUST retain minimum 20% credit risk on its own balance sheet. End-borrower pays blended interest rate. All repayments routed via tripartite Escrow account.',
          'Fair Practices Code on Penal Charges: Abolished compounding penal interest. Only reasonable, board-approved Penal Charges permitted. Penal charges cannot be capitalized or added to principal balance (no interest charged on penal charges). For individual non-business loans, charges cannot exceed commercial defaults.',
          'Digital Lending Guidelines 2025 (DLG): Regulated Entities (REs) fully responsible for LSPs/DLAs. Fund disbursals & repayments must flow directly between RE bank account and borrower bank account without synthetic pass-through pool accounts. Key Fact Statement (KFS) disclosing APR mandatory. Minimum cooling-off window: 3 days (tenor >=7 days) or 1 day (<7 days). First Loss Default Guarantee (FLDG) strictly capped at 5% of portfolio.',
          'Mutual Credit Guarantee Scheme (MCGS) & CGTMSE: Credit guarantee for MSEs up to ₹5 Crore (₹10 Cr for high-tech). Tiered guarantee: 85% for micro loans up to ₹5 Lakh, women, SC/ST, and NER; 75% for standard MSEs.',
          'Modified Interest Subvention Scheme (MISS): Short-term crop loans up to ₹3 Lakh at benchmark 7.0% p.a. GoI provides 1.5% subvention to banks + 3.0% Prompt Repayment Incentive (PRI) to farmers -> effective net rate of 4.0% p.a.',
          'PM Vishwakarma Scheme: Collateral-free loans up to ₹3 Lakh (Tranche 1: ₹1L, Tranche 2: ₹2L) at concessional 5.0% interest rate (MoMSME subvention up to 8%).',
          'Priority Sector Lending (PSL) 2025-26 Overhaul: Housing loan limits categorized into 3 population tiers: >=50 Lakh pop (₹50 Lakh limit), 10L-50L pop (₹45 Lakh limit), <10L pop (₹35 Lakh limit). Urban Co-operative Banks PSL target fixed at 60% ANBC/CEOBE. Renewable Energy PSL limit: ₹35 Crore for utilities, ₹10 Lakh for households.',
          'Housing Finance Companies (HFCs) Revised Norms: Public deposit ceiling reduced from 3x to 1.5x Net Owned Funds (NOF); liquid assets requirement raised from 13% to 15%; maximum deposit tenor reduced from 10 to 5 years; co-branded credit cards and interest rate hedging permitted.'
        ]
      },
      {
        id: 'blk-3',
        type: 'exam_trap',
        content: 'Exam Traps & Distractors:\n1. In Co-Lending (CLM), the NBFC cannot offload 100% risk; it MUST retain at least 20% on its own books.\n2. Penal charges CANNOT be compounded or added to the principal balance under any circumstance.\n3. Under Digital Lending Guidelines, FLDG backed by cash/FD cannot exceed 5% of total portfolio exposure.\n4. Under MISS, the effective interest rate for prompt repaying farmers is 4% (7% benchmark - 3% PRI).'
      }
    ],
    metadata: {
      tags: ['iibf', 'banking-regulations', 'economics', 'schemes', 'ecl', 'co-lending', 'digital-lending', 'penal-charges', 'psl', 'hfc', 'cgtmse'],
      category: 'IIBF_MODULE',
      difficulty: 'hard',
      relevanceTier: 'TIER_A',
      sectionCode: 'IIBF_MOD2',
      date: '2026-02-01',
      provenance: {
        sourceSystem: 'IIBF',
        statutoryConcept: 'Credit Risk, Prudential Lending & PSL'
      }
    }
  },
  {
    id: 'iibf-reg-mod3',
    domain: 'iibf-regulations',
    title: '📌 Module 3: Liquidity Management & Monetary Policy Transmission',
    summary: 'In-depth analysis of RBI Revised Liquidity Management Framework (LMF) anchoring on Weighted Average Call Rate (WACR), discontinuation of 14-day VRR/VRRR in favor of 7-day VRR/VRRR primary operations, 50 bps symmetric corridor (MSF at Repo+25 bps, SDF at Repo-25 bps), and RBI Financial Conditions Index (FCI) Dynamic Factor Model across 5 market segments.',
    blocks: [
      {
        id: 'blk-1',
        type: 'paragraph',
        content: 'The Liquidity Management Framework (LMF) is the operational vehicle through which the RBI Monetary Policy Committee (MPC) ensures that short-term money market rates align with the Policy Repo Rate.'
      },
      {
        id: 'blk-2',
        type: 'bullet_list',
        items: [
          'Operating Target: Weighted Average Call Rate (WACR) remains the single operating target of monetary policy, closely anchored around the Policy Repo Rate.',
          'Discontinuation of 14-Day VRR/VRRR: The 14-day Variable Rate Repo / Variable Rate Reverse Repo operation is no longer the main operation for transient liquidity.',
          '7-Day VRR/VRRR as New Operational Anchor: Transient liquidity is managed primarily through 7-day VRR (liquidity injection) and 7-day VRRR (liquidity absorption) auctions, supplemented by overnight fine-tuning operations.',
          'Monetary Policy Corridor: Symmetric 50 bps corridor around Policy Repo Rate. Ceiling = Marginal Standing Facility (MSF: Repo + 25 bps) for emergency borrowing; Floor = Standing Deposit Facility (SDF: Repo - 25 bps) for uncollateralized overnight absorption.',
          'Financial Conditions Index (FCI): Summary composite index computed via Dynamic Factor Model (DFM) tracking 5 pillars: Money Market (WAMMR, LAF/NDTL), G-Sec Yield Curve (Level, Slope, Curvature), Corporate Bonds (AAA/AA 3Y/5Y spreads), Forex (India-US 10Y differential, USD-INR volatility, 1M forward premia), and Equity Market (India VIX, Sensex, P/E ratio).',
          'FCI Interpretation: High/Rising FCI indicates tightening financial conditions; Low/Falling FCI indicates accommodative financial conditions.'
        ]
      },
      {
        id: 'blk-3',
        type: 'exam_trap',
        content: 'Exam Traps & Distractors:\n1. SDF (Standing Deposit Facility) is UNCOLLATERALIZED — RBI does NOT provide government securities as collateral when absorbing liquidity under SDF.\n2. The operating target of RBI monetary policy is the WACR (Weighted Average Call Rate), NOT the 10-year G-Sec yield or M3 money supply.\n3. The width of the LAF policy corridor is 50 basis points (MSF is +25 bps and SDF is -25 bps around Repo).'
      }
    ],
    metadata: {
      tags: ['iibf', 'banking-regulations', 'economics', 'liquidity', 'lmf', 'vrr', 'vrrr', 'fci', 'monetary-policy'],
      category: 'IIBF_MODULE',
      difficulty: 'hard',
      relevanceTier: 'TIER_A',
      sectionCode: 'IIBF_MOD3',
      date: '2026-02-01',
      provenance: {
        sourceSystem: 'IIBF',
        statutoryConcept: 'Liquidity Management & Monetary Framework'
      }
    }
  },
  {
    id: 'iibf-reg-mod4',
    domain: 'iibf-regulations',
    title: '📌 Module 4: Digital Banking, Payments Architecture & Cyber Governance',
    summary: 'Comprehensive architecture of UPI Lite (₹2,000 wallet / ₹500 txn), UPI 123PAY (4 feature phone modes), UPI Circle & Credit Lines, BHIM 3.0, Finternet (BIS Unified Ledger with 3 U\'s: User-centric, Unified, Universal), DPDP Rules 2025 (SARAL notices, ₹250 Cr penalties), Financial Fraud Risk Indicator (FRI - DoT Chakshu), BaaS / Embedded Finance, Stablecoins (MiCA, GENIUS) vs CBDC Digital Rupee, and EASE 8.0 PSB reforms.',
    blocks: [
      {
        id: 'blk-1',
        type: 'paragraph',
        content: 'India\'s Digital Public Infrastructure (DPI) and fintech ecosystem have driven massive shifts in payment velocity, data protection, cyber fraud defense, and open banking models.'
      },
      {
        id: 'blk-2',
        type: 'bullet_list',
        items: [
          'Unified Payments Interface (UPI) Advanced Modes: UPI Lite (On-device wallet, ₹2,000 max balance, ₹500 per-txn cap, zero PIN, near-zero failure rate); UPI 123PAY (4 non-internet modes: IVR numbers, Missed call, Sound-based proximity, and OEM apps); UPI Circle (delegated primary-secondary user authorization); Credit Lines on UPI (pre-approved bank credit lines accessed via UPI QR).',
          'BHIM 3.0: 22-language AI voice assistant, automated family spend management, biometric authentication, real-time integration with Centralised Fraud Registry.',
          'Finternet (BIS Unified Ledger Model): Conceptualized by Agustin Carstens & Nandan Nilekani. The Three U\'s: User-centric (user retains asset control), Unified (connects multiple asset classes on programmable smart contracts), Universal (interoperable across borders).',
          'Digital Personal Data Protection (DPDP) Rules 2025: Data Protection Board of India (DPBI). SARAL approach (Simple, Accessible, Rational, Actionable notices). Maximum penalties: ₹250 Crore for security safeguards failure preventing data breach; ₹200 Crore for non-notification of breach or child data violations. 90-day grievance redressal mandate.',
          'Financial Fraud Risk Indicator (FRI): Joint DoT & I4C initiative integrating Chakshu platform and NCRP portal. Scores suspect mobile numbers as Medium, High, or Very High Risk in real time during digital onboarding and KYC.',
          'Banking as a Service (BaaS) & Embedded Finance: Licensed banks expose CBS APIs for white-label debit cards, embedded BNPL checkout, corporate payroll, and digital escrow.',
          'Stablecoins & Crypto Assets: Pegged to fiat/commodities. Global laws: EU MiCA (100% liquid reserve backing), US GENIUS Act, China total ban. India: Cryptos not legal tender; RBI highlights currency substitution, seigniorage loss, and deposit flight. Digital Rupee (CBDC e₹-R & e₹-W) issued as sovereign alternative.',
          'EASE 8.0 PSB Reforms: 4 Themes: Risk & Resilience, Innovation (GenAI), Excellence (CASA growth & cost optimization), Socio-Economic Impact (inclusive lending).'
        ]
      },
      {
        id: 'blk-3',
        type: 'exam_trap',
        content: 'Exam Traps & Distractors:\n1. UPI Lite has a wallet balance ceiling of ₹2,000 and per-transaction ceiling of ₹500 (requires no PIN).\n2. Under DPDP Act 2023 / Rules 2025, the maximum statutory penalty is ₹250 Crore.\n3. Stablecoins and cryptocurrencies are NOT legal tender in India; only the RBI-issued Digital Rupee (e₹) is legal tender.\n4. The 3 U\'s of Finternet are User-centric, Unified, and Universal.'
      }
    ],
    metadata: {
      tags: ['iibf', 'banking-regulations', 'static-ga', 'digital-banking', 'upi', 'bhim', 'finternet', 'dpdp', 'fraud-risk-indicator', 'baas', 'stablecoins', 'ease-8'],
      category: 'IIBF_MODULE',
      difficulty: 'hard',
      relevanceTier: 'TIER_A',
      sectionCode: 'IIBF_MOD4',
      date: '2026-02-01',
      provenance: {
        sourceSystem: 'IIBF',
        statutoryConcept: 'Digital Banking, Payments & DPI'
      }
    }
  },
  {
    id: 'iibf-reg-mod5',
    domain: 'iibf-regulations',
    title: '📌 Module 5: Sustainable Finance, Climate Risk & ESG Frameworks',
    summary: 'Deep dive into SEBI BRSR Core (9 NGRBC principles, 9 assured quantitative KPIs), India\'s Climate Finance Taxonomy (Climate Supportive vs Climate Transition baskets), Basel Committee CRFR (6 climate risk disclosure templates), IFSCA Anti-Greenwashing Principles (GIFT City), Social Stock Exchange (ZCZP instruments: ₹50L min issue, ₹10,000 min application, NISM Series-XXIII audit), NITI Aayog SDG India Index (4 tiers), COP29 Baku ($300B NCQG), and COP30 Belem.',
    blocks: [
      {
        id: 'blk-1',
        type: 'paragraph',
        content: 'Sustainable banking, ESG reporting, climate finance taxonomies, and social impact investing have become core regulatory mandates across SEBI, RBI, IFSCA, and the Basel Committee.'
      },
      {
        id: 'blk-2',
        type: 'bullet_list',
        items: [
          'SEBI BRSR Core (Regulation 34(2)(f) LODR): Mandatory for top 1,000 listed entities based on 9 NGRBC principles. BRSR Core requires mandatory reasonable third-party assurance across 9 KPIs: Scope 1 & 2 GHG emissions, water consumption & recycling, waste generation, female employee diversity, living wages, gross wages to women, and supply chain ESG disclosures (top 250 entities).',
          'India Climate Finance Taxonomy (DEA, MoF): 2 Classification Baskets: Climate Supportive Activities vs Climate Transition Activities (hard-to-abate sectors without viable zero-carbon alternatives). 6 Priority Sectors: Power, Mobility, Buildings, Agriculture & Water, Iron & Steel, Cement. Principles: Do No Significant Harm (DNSH), Interoperability, MSME support.',
          'Basel Committee CRFR Framework: 6 disclosure templates: CRFRA (Governance & Strategy), CRFRB (Risk Management), CRFR1 (Financed GHG Emissions & Gross Carrying Values), CRFR2 (Physical Climate Hazards), CRFR3 (Mortgage EPC Energy Efficiency), CRFR4 (GHG Intensity per output).',
          'IFSCA Principles on Prevention of Greenwashing (GIFT City): 4 Core Principles: Authenticity of Environmental Objectives, High Transparency on Fund Allocation, Prohibition of Misleading Marketing, and Mandatory Independent Third-Party Monitoring.',
          'Social Stock Exchange (SSE - BSE/NSE): Electronic fundraising platform for Not-for-Profit Organisations (NPOs) and For-Profit Social Enterprises (FPSEs). Zero Coupon Zero Principal (ZCZP) instruments: Minimum issue size ₹50 Lakh, minimum application size ₹10,000. Requires 67% revenue/expenditure in 17 social sectors. Mandatory audit by certified Social Auditors under NISM Series-XXIII.',
          'NITI Aayog SDG India Index: 16 SDGs tracked across 4 categories: Aspirant (0-49), Performer (50-64), Front Runner (65-99), Achiever (100). SDG 14 measured only for coastal states.',
          'Global Climate Accords: COP29 Baku adopted New Collective Quantified Goal (NCQG) of $300 Billion/year by 2035 for developing nations and Article 6 carbon markets. COP30 Belem (Brazil) launched "Mutirao" initiative and Belém Mechanism for Just Global Transition.'
        ]
      },
      {
        id: 'blk-3',
        type: 'exam_trap',
        content: 'Exam Traps & Distractors:\n1. ZCZP instruments on Social Stock Exchange carry ZERO coupon and ZERO principal repayment (100% philanthropic donation instrument).\n2. Minimum issue size on SSE is ₹50 Lakh and minimum application size is ₹10,000 (reduced from ₹2 Lakh).\n3. Social Auditors must be certified under NISM Series-XXIII.\n4. SDG 14 (Life Below Water) is EXCLUDED from the national composite SDG India Index score.'
      }
    ],
    metadata: {
      tags: ['iibf', 'banking-regulations', 'static-ga', 'sustainable-finance', 'brsr', 'climate-finance', 'bcbs', 'ifsca', 'social-stock-exchange', 'sdg', 'cop29', 'cop30'],
      category: 'IIBF_MODULE',
      difficulty: 'hard',
      relevanceTier: 'TIER_A',
      sectionCode: 'IIBF_MOD5',
      date: '2026-02-01',
      provenance: {
        sourceSystem: 'IIBF',
        statutoryConcept: 'Sustainable Finance & ESG Disclosures'
      }
    }
  },
  {
    id: 'iibf-reg-mod6',
    domain: 'iibf-regulations',
    title: '📌 Module 6: Capital Markets, External Trade & Fiscal Dynamics',
    summary: 'Detailed framework of Special Rupee Vostro Accounts (SRVA) under FEMA (autonomous AD bank approval, INR invoicing, G-Sec investment of surplus), Merchanting Trade Transactions (MTT 6-month outlay cap), SEBI Specialized Investment Funds (SIF - ₹10 Lakh minimum ticket), Sachetization of Mutual Funds (₹250 Micro-SIPs), RBI Financial Inclusion Index (Access 35%, Usage 45%, Quality 20%), and Union Budget FY27 macro-fiscal parameters.',
    blocks: [
      {
        id: 'blk-1',
        type: 'paragraph',
        content: 'Cross-border trade internationalisation, innovative asset classes, micro-investing democratization, and macro-fiscal targets drive India\'s expanding financial architecture.'
      },
      {
        id: 'blk-2',
        type: 'bullet_list',
        items: [
          'Special Rupee Vostro Accounts (SRVA) & INR Trade: AD Category-I banks can open INR-denominated SRVAs for overseas correspondent banks autonomously without prior RBI approval. Invoicing and settlements in INR. Surplus balances invested in Indian G-Secs and T-Bills. Balances in SNRA and SRVAs cross-utilized for legitimate trade and non-debt FDI.',
          'Merchanting Trade Transactions (MTT) Revised Norms: Goods routed between foreign nations without entering India. Foreign currency outlay/expenditure period extended from 4 months to 6 months; overall transaction cycle completed within 9 months.',
          'Specialized Investment Funds (SIF - SEBI New Asset Class): Formalized Dec 16, 2024 to bridge Mutual Funds (₹500 SIP) and PMS (₹50 Lakh). Minimum ticket size: ₹10 Lakh. Allows long-short equity, inverse ETFs, unlisted debt derivatives for high-risk investors.',
          'Sachetization of Mutual Funds: Micro-SIPs starting at ₹250/month with zero commission friction via UPI AutoPay, expanding rural/semi-urban capital market penetration.',
          'RBI Financial Inclusion Index (FI-Index): Published annually in July (0 to 100 scale, zero base year). 3 Weighted Dimensions: Access (35%), Usage (45%), Quality (20% - literacy, consumer protection, grievance resolution).',
          'Union Budget & Fiscal Benchmarks (FY27): Real GDP growth 7.4% (FY26) / 6.8%-7.2% (FY27). Fiscal Deficit target: 4.3% (glide path <4.5%). Capital expenditure: ₹12.2 Lakh Crore (3.4% of GDP). Demerit goods: 40% GST + excise on tobacco (replacing compensation cess). 16th Finance Commission 41% tax devolution.'
        ]
      },
      {
        id: 'blk-3',
        type: 'exam_trap',
        content: 'Exam Traps & Distractors:\n1. The minimum investment threshold for SEBI SIF (Specialized Investment Fund) is ₹10 Lakh (PMS is ₹50 Lakh, Mutual Fund is ₹500).\n2. RBI FI-Index weights: Usage carries highest weight at 45%, Access is 35%, Quality is 20%.\n3. In Merchanting Trade Transactions, the outlay period is 6 months, and overall completion is 9 months.\n4. AD Category-I banks do NOT need prior RBI approval to open SRVAs for overseas banks under the liberalized framework.'
      }
    ],
    metadata: {
      tags: ['iibf', 'banking-regulations', 'economics', 'external-trade', 'srva', 'mtt', 'sif', 'sachetization', 'fi-index', 'budget-fy27'],
      category: 'IIBF_MODULE',
      difficulty: 'hard',
      relevanceTier: 'TIER_A',
      sectionCode: 'IIBF_MOD6',
      date: '2026-02-01',
      provenance: {
        sourceSystem: 'IIBF',
        statutoryConcept: 'Capital Markets, External Trade & Fiscal Framework'
      }
    }
  },
  {
    id: 'iibf-reg-mod7-traps',
    domain: 'iibf-regulations',
    title: '⚡ IIBF High-Yield Banking Traps & Rapid Recall Cheat Sheet',
    summary: 'Comprehensive exam-eve recall cheat sheet comparing all critical statutory numbers, penalties, caps, ratios, and trap distractors for RBI Grade B, JAIIB/CAIIB, and Bank PO examinations.',
    blocks: [
      {
        id: 'blk-1',
        type: 'paragraph',
        content: 'Master recall matrix consolidating all numerical thresholds and statutory traps across the 6 IIBF banking modules.'
      },
      {
        id: 'blk-2',
        type: 'bullet_list',
        items: [
          'Max Nominees under BR Act 2025: 4 Nominees (Simultaneous with % share or Successive).',
          'DICGC Insurance Cap: ₹5,00,000 per depositor per bank (Principal + Interest across all branches).',
          'DICGC Section 18A Payout Limit: Strict 90-Day Window (45 days bank claim submission + 45 days DICGC payment).',
          'RB-IOS 2026 Ombudsman Award Cap: ₹30 Lakh consequential loss + ₹1 Lakh mental harassment.',
          'DPDP Rules 2025 Maximum Penalty: ₹250 Crore for failure to take reasonable security safeguards.',
          'Co-Lending NBFC Minimum Risk Share: Minimum 20% retained on NBFC balance sheet (Bank max 80%).',
          'Digital Lending FLDG Cap: Maximum 5% of portfolio exposure backed by cash/FD/guarantee.',
          'UPI Lite Wallet / Per-Txn Limits: ₹2,000 Wallet Balance / ₹500 Per-Transaction Limit.',
          'SEBI SIF Minimum Investment Ticket: ₹10 Lakh per investor.',
          'Sachetized Micro-SIP Minimum Ticket: ₹250 per month.',
          'Social Stock Exchange ZCZP Limits: ₹50 Lakh Min Issue / ₹10,000 Min Application.',
          'HFC Public Deposit Ceiling: 1.5x Net Owned Funds (5-Year max deposit tenor).',
          'Merchanting Trade Outlay Limit: 6 Months (Overall transaction cycle 9 Months).',
          'RBI FI-Index Dimension Weights: Access (35%), Usage (45%), Quality (20%).'
        ]
      },
      {
        id: 'blk-3',
        type: 'exam_trap',
        content: 'Exam Traps & Distractors:\n- Review all 14 numerical points above before Phase 1 / Phase 2 banking exams.'
      }
    ],
    metadata: {
      tags: ['iibf', 'banking-regulations', 'revision', 'exam-traps', 'cheat-sheet'],
      category: 'IIBF_MODULE',
      difficulty: 'medium',
      relevanceTier: 'TIER_A',
      sectionCode: 'IIBF_MOD7',
      date: '2026-02-01',
      provenance: {
        sourceSystem: 'IIBF',
        statutoryConcept: 'High-Yield Numerical Cheat Sheet'
      }
    }
  }
];

// 1. Write individual JSON files
itemsToPublish.forEach(item => {
  const filePath = path.join(corpusDir, item.id + '.json');
  fs.writeFileSync(filePath, JSON.stringify(item, null, 2), 'utf-8');
  console.log(`Saved: ${item.id}.json`);
});

// 2. Rebuild corpus-index.json
const existingIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
const itemIdsToPublish = new Set(itemsToPublish.map(i => i.id));
const filteredIndex = existingIndex.filter(i => !itemIdsToPublish.has(i.id));

const newIndexEntries = itemsToPublish.map(item => ({
  id: item.id,
  domain: item.domain,
  title: item.title,
  summary: item.summary,
  metadata: item.metadata
}));

const updatedIndex = [...filteredIndex, ...newIndexEntries];
fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2), 'utf-8');
console.log(`Updated corpus-index.json: Total records = ${updatedIndex.length}`);

// 3. Update manifest.json
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
manifest.totalRecords = updatedIndex.length;
manifest.lastUpdated = new Date().toISOString();
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`Updated manifest.json.`);
