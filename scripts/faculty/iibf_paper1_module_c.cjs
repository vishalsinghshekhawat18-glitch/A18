const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', '..', 'content', 'note-registry.json');

const moduleCUnits = [
  {
    id: "iibf-ieifs-unit-16-overview-financial-system",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 16: Overview of Indian Financial System & Institutional Pillars",
    summary: "Doctoral study unit on the 4 pillars of the Indian Financial System: Financial Intermediaries, Financial Markets, Financial Assets/Instruments, and Financial Services; capital formation and credit flow.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: The Financial Intermediation Mechanism",
        summary: "The financial system mobilizes household savings (surplus units) and channels them into productive industrial, commercial, and infrastructure investments (deficit units), facilitating capital formation and economic growth."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. The Four Core Pillars of the Indian Financial Architecture"
      },
      {
        type: "table",
        caption: "4 Pillars of Financial System",
        headers: ["Pillar", "Component Categories", "Key Functions in Indian Economy"],
        rows: [
          ["1. Financial Institutions / Intermediaries", "Commercial Banks, RRBs, Cooperative Banks, NBFCs, DFIs (NABARD, SIDBI, NaBFID), Insurance Companies, Mutual Funds.", "Credit creation, maturity transformation, risk pooling, and payment clearing."],
          ["2. Financial Markets", "Money Market (Short-term debt < 1 yr), Capital Market (Long-term debt & equity > 1 yr), Forex Market, Derivatives Market.", "Price discovery, liquidity provision, and resource allocation across sectors."],
          ["3. Financial Instruments / Assets", "Treasury Bills, Commercial Paper, Certificates of Deposit, G-Secs, Corporate Bonds, Equities, Mutual Fund Units, Insurance Policies.", "Stores of value offering varied risk, return, and liquidity profiles."],
          ["4. Financial Services", "Credit Rating, Merchant Banking, Underwriting, Asset Management, Factoring, Custodial Services, Payment Gateways.", "Advisory and transaction-enabling infrastructure supporting asset issuance and trading."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📈 2. Role in Capital Formation & Growth Indicators"
      },
      {
        type: "bullet_list",
        items: [
          "**Gross Domestic Savings (GDS):** Accounts for approximately **30% of GDP** in India, with **Household Financial Savings** contributing the largest share.",
          "**Gross Capital Formation (GCF / Investment Rate):** Hovering around **31–32% of GDP**, essential for sustaining a 7%+ GDP growth trajectory.",
          "**Incremental Capital-Output Ratio (ICOR):** Measures the additional units of capital required to produce one extra unit of output (\\(\\text{ICOR} = \\frac{\\text{Investment Rate}}{\\text{GDP Growth Rate}}\\)). A **lower ICOR reflects higher capital productivity and efficiency**."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 16:\n1. **ICOR Interpretation:** A **lower** ICOR signifies **higher** efficiency/productivity in capital utilization (fewer capital units needed per unit of GDP growth).\n2. **Money Market vs Capital Market Horizon:** Money market deals in instruments with maturity **up to 1 year**; Capital market deals in instruments with maturity **exceeding 1 year**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit16", "financial-system", "intermediation", "icor", "capital-formation"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module C - Indian Financial Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-17-banking-regulatory-framework",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 17: Regulatory Hierarchy (RBI, SEBI, IRDAI, PFRDA, IFSCA & FSDC)",
    summary: "Exhaustive breakdown of apex regulatory statutory acts, mandates, supervisory perimeters (RBI, SEBI, IRDAI, PFRDA, IFSCA), and the Financial Stability and Development Council (FSDC).",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Apex Regulatory Jurisdiction",
        summary: "The Indian financial sector operates under sector-specific statutory regulators, coordinated at the apex level by the Financial Stability and Development Council (FSDC) chaired by the Union Finance Minister."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Master Regulatory Jurisdiction Matrix"
      },
      {
        type: "table",
        caption: "Apex Financial Regulators in India",
        headers: ["Regulator", "Governing Primary Acts", "Establishment Year & HQ", "Regulated Entities / Sector Perimeter"],
        rows: [
          ["Reserve Bank of India (RBI)", "RBI Act, 1934 & Banking Regulation Act, 1949", "Established **1 April 1935** (Hilton Young Commission); Nationalized **1 Jan 1949**; HQ: **Mumbai**", "Commercial Banks, RRBs, UCBs, NBFCs, HFCs, Payment System Operators (NPCI), Primary Dealers, Money & Forex Markets."],
          ["Securities and Exchange Board of India (SEBI)", "SEBI Act, 1992", "Established 1988 (Statutory powers **30 Jan 1992**); HQ: **Mumbai**", "Stock Exchanges (BSE, NSE), Depositories (NSDL, CDSL), Mutual Funds, Merchant Bankers, Stock Brokers, Credit Rating Agencies, AIFs, REITs/InvITs."],
          ["Insurance Regulatory and Development Authority of India (IRDAI)", "IRDA Act, 1999 (Malhotra Committee)", "Established 1999 (Statutory **April 2000**); HQ: **Hyderabad**", "Life Insurance, General Insurance, Health Insurance, Reinsurers (GIC Re), Insurance Web Aggregators, Corporate Agents."],
          ["Pension Fund Regulatory and Development Authority (PFRDA)", "PFRDA Act, 2013", "Established 2003 (Statutory **Feb 2014**); HQ: **New Delhi**", "National Pension System (NPS), Atal Pension Yojana (APY), Pension Fund Managers, Central Recordkeeping Agencies (CRAs)."],
          ["International Financial Services Centres Authority (IFSCA)", "IFSCA Act, 2019", "Established **27 April 2020**; HQ: **GIFT City, Gandhinagar**", "**Unified regulator for all financial services, products, and institutions in IFSCs** (combining powers of RBI, SEBI, IRDAI, PFRDA in GIFT City)."],
          ["Financial Stability and Development Council (FSDC)", "Executive Notification (Raghuram Rajan Comm recommendation)", "Established **Dec 2010**; Apex Non-statutory Council", "**Chairperson: Union Finance Minister**. Members: RBI Governor, SEBI/IRDAI/PFRDA/IFSCA Chairpersons, Finance Secretary, Chief Economic Adviser. Handles inter-regulatory coordination & systemic stability."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 17:\n1. **FSDC Chairperson:** The **Union Finance Minister** (NOT the RBI Governor) chairs the FSDC. The FSDC Sub-Committee is chaired by the **RBI Governor**.\n2. **IRDAI Headquarters:** Located in **Hyderabad** (NOT Mumbai or New Delhi).\n3. **IFSCA Role:** Acts as a **single unified regulator** in GIFT City, superseding RBI, SEBI, IRDAI, and PFRDA powers inside the IFSC jurisdiction."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit17", "rbi", "sebi", "irdai", "pfrda", "ifsca", "fsdc", "regulators"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module C - Indian Financial Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-18-commercial-banks-and-basel",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 18: Commercial Banking Operations, Basel III & PCA Framework",
    summary: "Doctoral study unit on Section 22 Bank Licensing, Basel III Capital Adequacy (CRAR 9%, CCB 2.5%, Tier 1/2), LCR/NSFR norms, Prompt Corrective Action (PCA) triggers, and Corporate Governance.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Basel III Capital Architecture",
        summary: "Basel III norms protect the solvency of commercial banks by mandating risk-weighted capital buffers (CRAR, Tier 1, CCB) and structural liquidity buffers (LCR, NSFR) to withstand severe economic shocks."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Basel III Capital Adequacy Benchmarks (RBI vs. BCBS)"
      },
      {
        type: "table",
        caption: "Basel III Minimum Capital Requirements (% of Risk-Weighted Assets - RWA)",
        headers: ["Capital Component", "Global BCBS Benchmark", "RBI Mandate for Indian Commercial Banks", "Eligible Capital Instruments"],
        rows: [
          ["Common Equity Tier 1 (CET1)", "4.50%", "**5.50%** (RBI is stricter by 100 bps)", "Paid-up equity shares, Statutory reserves, Capital reserves, Share premium."],
          ["Total Tier 1 Capital", "6.00%", "**7.00%**", "CET1 + Additional Tier 1 (AT1 perpetual bonds, PNCPS)."],
          ["Tier 2 Capital", "2.00%", "**2.00% (Cap: Max 2% of RWA)**", "Subordinated debt (min 5 yr maturity), General provisions/loss reserves (max 1.25% of standard credit RWA)."],
          ["Minimum Total Capital (CRAR)", "8.00%", "**9.00% (12.00% for Small Finance Banks)**", "Tier 1 Capital + Tier 2 Capital."],
          ["Capital Conservation Buffer (CCB)", "2.50%", "**2.50%** (Common Equity Tier 1)", "Maintained above minimum CET1 to absorb losses during stressed periods."],
          ["Total Capital + CCB", "10.50%", "**11.50%** (9.0% CRAR + 2.5% CCB)", "**Statutory minimum operational solvency benchmark in India**."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "💧 2. Basel III Liquidity Standards (LCR & NSFR)"
      },
      {
        type: "table",
        caption: "LCR vs. NSFR Comparison",
        headers: ["Parameter", "Liquidity Coverage Ratio (LCR)", "Net Stable Funding Ratio (NSFR)"],
        rows: [
          ["Time Horizon", "**Short-term (30 Calendar Days)**", "**Medium/Long-term (1 Year)**"],
          ["Core Objective", "Ensure bank has sufficient **High Quality Liquid Assets (HQLA)** to survive a 30-day acute stress scenario.", "Ensure bank maintains a **stable funding profile** in relation to the composition of its assets and off-balance sheet activities."],
          ["Formula", "$$\\text{LCR} = \\frac{\\text{Stock of HQLA}}{\\text{Total Net Cash Outflows over 30 Days}} \\times 100$$", "$$\\text{NSFR} = \\frac{\\text{Available Stable Funding (ASF)}}{\\text{Required Stable Funding (RSF)}} \\times 100$$"],
          ["Minimum Mandate", "$$\\ge 100\\%$$", "$$\\ge 100\\%$$"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🚨 3. RBI Prompt Corrective Action (PCA) Framework"
      },
      {
        type: "table",
        caption: "PCA Risk Thresholds & Trigger Indicators (Revised 2022)",
        headers: ["Trigger Metric", "Risk Threshold 1", "Risk Threshold 2", "Risk Threshold 3 (Extreme)"],
        rows: [
          ["Capital (CRAR / CET1)", "CET1 falls below 8.0% (5.5% + 2.5% CCB)", "CET1 falls below 6.875%", "CET1 falls below 5.50% (Breach of minimum)"],
          ["Asset Quality (Net NPA)", "Net NPA **≥ 6.0% but < 9.0%**", "Net NPA **≥ 9.0% but < 12.0%**", "Net NPA **≥ 12.0%**"],
          ["Leverage Ratio", "Tier 1 Leverage < 4.0%", "Tier 1 Leverage < 3.5%", "Tier 1 Leverage < 3.0%"],
          ["Mandatory Actions", "Restriction on dividend distribution/profits remittance; promoters must bring in capital.", "Mandatory actions of Threshold 1 + **Restrictions on branch expansion & domestic/foreign operations**.", "Mandatory actions of 1 & 2 + **Appropriate restrictions on capital expenditure (capex)** and staffing."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 18:\n1. **RBI vs Basel Minimum CRAR:** Basel is **8.0%**; RBI mandate for Indian commercial banks is **9.0%** (and **11.5% including CCB**).\n2. **Small Finance Bank CRAR:** SFBs must maintain a minimum CRAR of **15.0% (Tier 1 min 7.5%)**.\n3. **PCA Profitability Metric Removed:** Return on Assets (RoA) was **removed as a trigger indicator** in the revised 2022 PCA framework; triggers are **Capital, Asset Quality (Net NPA ≥ 6%), and Leverage**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit18", "commercial-banks", "basel-iii", "crar", "lcr", "nsfr", "pca-framework", "npa"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module C - Indian Financial Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-19-regional-rural-banks",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 19: Regional Rural Banks (RRBs) Structure, Equity & PSL Mandates",
    summary: "Comprehensive synthesis of RRB Act 1976, Narasimham Working Group (1975), 50:35:15 Shareholding, 75% PSL target, recapitalization packages, and amalgamation trajectories.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Rural Credit Delivery Vehicles",
        summary: "Regional Rural Banks (RRBs) were established under the RRB Act, 1976 to combine the local feel and familiarity of cooperatives with the modern business acumen and resource-mobilization ability of commercial banks."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Establishment & Equity Shareholding Pattern"
      },
      {
        type: "table",
        caption: "RRB Ownership & Governance Structure",
        headers: ["Shareholder Entity", "Mandated Equity Shareholding (%)", "Core Role & Responsibility"],
        rows: [
          ["Government of India (Central Govt)", "**50%**", "Provides sovereign capital backing, policy directions, and appoints Chairman."],
          ["Sponsor Commercial Bank", "**35%**", "Provides management guidance, IT infrastructure, core banking systems, and training support."],
          ["State Government (Concerned State)", "**15%**", "Assists in rural recovery mechanisms, land records verification, and district credit programs."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🎯 2. Operational & Priority Sector Mandates for RRBs"
      },
      {
        type: "bullet_list",
        items: [
          "**1st RRB in India:** **Prathama Bank** (Sponsored by Syndicate Bank, established on **2 October 1975** in Moradabad, UP).",
          "**Total PSL Target:** **75% of ANBC** (sub-targets: 18% Agriculture, 10% Small & Marginal Farmers, 15% Weaker Sections, 7.5% Micro Enterprises).",
          "**CRR and SLR:** Must maintain CRR and SLR at par with commercial banks.",
          "**CRAR Benchmark:** RBI mandated RRBs to maintain a minimum Capital to Risk-Weighted Assets Ratio (CRAR) of **9.0%**.",
          "**Amalgamation Wave ('One State, One RRB'):** The number of RRBs was consolidated from **196 (in 2005) down to 43 RRBs** to achieve economies of scale, technological parity, and higher capital efficiency."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 19:\n1. **Shareholding Ratio:** Exactly **50% (Centre) : 35% (Sponsor Bank) : 15% (State Govt)**.\n2. **Total PSL Target for RRBs:** **75% of ANBC** (unlike 40% for domestic commercial banks).\n3. **1st RRB:** **Prathama Bank** (2 Oct 1975)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit19", "rrbs", "prathama-bank", "shareholding", "psl-75", "narasimham-1975"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module C - Indian Financial Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-20-cooperative-banking-system",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 20: Cooperative Banking System, BR Amendment 2020 & 4-Tier UCBs",
    summary: "Doctoral study unit on Urban Cooperative Banks (UCBs), Rural Cooperatives (StCB, DCCB, PACS), Dual Regulation resolution under BR Amendment Act 2020, and the RBI 4-Tier Categorization of UCBs.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Cooperative Banking Structure",
        summary: "The cooperative banking sector operates on the principle of mutual self-help and democratic member control. It is bifurcated into Urban Cooperative Banks (UCBs - single/multi-state) and Rural Cooperative Credit Institutions (Short-term 3-tier structure & Long-term structure)."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Rural Cooperative Credit 3-Tier Structure (Short-Term)"
      },
      {
        type: "table",
        caption: "Short-Term Rural Cooperative Credit Hierarchy",
        headers: ["Tier Level", "Cooperative Entity Name", "Operational Jurisdiction & Key Role"],
        rows: [
          ["Apex Level (State)", "State Cooperative Banks (StCBs)", "Apex refinancing bank at the State level; connects rural cooperatives with RBI/NABARD."],
          ["Intermediate Level (District)", "District Central Cooperative Banks (DCCBs)", "Operates at the district level; federates PACS; mobilizes urban deposits to finance rural agriculture."],
          ["Grassroots Level (Village)", "Primary Agricultural Credit Societies (PACS)", "**Non-banking entities** at village level providing short-term crop credit and inputs directly to farmers. Currently being digitized under ₹2,516 Cr national mission."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🏢 2. RBI 4-Tier Regulatory Categorization of Urban Cooperative Banks (UCBs)"
      },
      {
        type: "table",
        caption: "4-Tier Classification of UCBs (NS Vishwanathan Committee Recommendation)",
        headers: ["Tier Category", "Deposit Size Range", "Minimum Net Worth Mandate", "Minimum CRAR Requirement"],
        rows: [
          ["Tier 1 UCBs", "Deposits **up to ₹100 Crore**", "₹2 Crore (₹5 Crore for all other UCBs)", "**9.0%**"],
          ["Tier 2 UCBs", "Deposits **> ₹100 Crore and up to ₹1,000 Crore**", "₹5 Crore", "**12.0%**"],
          ["Tier 3 UCBs", "Deposits **> ₹1,000 Crore and up to ₹10,000 Crore**", "₹5 Crore", "**12.0%**"],
          ["Tier 4 UCBs", "Deposits **> ₹10,000 Crore**", "₹5 Crore", "**12.0%**"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "⚖️ 3. Banking Regulation (Amendment) Act, 2020 Landmarks"
      },
      {
        type: "bullet_list",
        items: [
          "**Resolved Dual Regulation Dilemma:** Transferred banking management, CEO/Director appointments, audit, capital issuance, and resolution powers of UCBs and multi-state cooperative banks **directly to the Reserve Bank of India**.",
          "**State Registrar Powers Confined:** Registrar of Cooperative Societies (RCS) retains jurisdiction only over administrative/incorporation issues, elections, and member registration.",
          "**Section 45 Moratorium Resolution:** Empowered RBI to reconstruct or merge a stressed cooperative/commercial bank **without imposing a moratorium**."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 20:\n1. **PACS are NOT Banks:** Primary Agricultural Credit Societies (PACS) are **outside the purview of the Banking Regulation Act, 1949** and cannot use the words 'bank', 'banker', or 'banking'.\n2. **UCB CRAR Mandates:** Tier 1 UCBs require **9% CRAR**; Tier 2, 3, and 4 UCBs require **12% CRAR**.\n3. **BR Amendment 2020:** Gave RBI full regulatory power over banking operations and board appointments of UCBs."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit20", "cooperative-banks", "ucbs", "pacs", "dccb", "br-amendment-2020", "4-tier-ucb"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module C - Indian Financial Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-21-nbfcs-and-scale-based-regulation",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 21: NBFCs, Scale-Based Regulation (SBR) & Housing Finance Companies",
    summary: "Complete synthesis of Section 45-IA of RBI Act, SBR 4-Layer framework (Base, Middle, Upper, Top), NBFC vs Bank distinctions, HFC regulatory transition, and Co-Lending Model (CLM 80:20).",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Non-Banking Financial Companies",
        summary: "NBFCs are entities registered under the Companies Act engaged in lending, investments, hire-purchase, and leasing. They must pass the 50-50 Principal Business Test (Financial assets > 50% of total assets AND Financial income > 50% of gross income)."
      },
      {
        type: "heading",
        level: 2,
        text: "⚖️ 1. NBFCs vs. Commercial Banks Core Differences"
      },
      {
        type: "table",
        caption: "Key Legal & Operational Distinctions",
        headers: ["Parameter", "Commercial Banks", "Non-Banking Financial Companies (NBFCs)"],
        rows: [
          ["Incorporation / Registration", "Banking Regulation Act, 1949 (Sec 22)", "Companies Act, 2013 + RBI Act, 1934 (Sec 45-IA)"],
          ["Demand Deposits (CASA)", "**Permitted** (Can accept savings & current deposits)", "**Strictly PROHIBITED** (Cannot accept demand deposits)"],
          ["Payment & Settlement System", "Part of clearing system (Cheque issuance on self)", "**Cannot issue cheques drawn on themselves**; not part of payment clearing system"],
          ["Deposit Insurance (DICGC)", "**Covered up to ₹5 Lakh per depositor**", "**Zero deposit insurance cover** (Deposits with NBFCs are NOT insured by DICGC)"],
          ["Statutory Reserves", "Mandatory CRR & SLR", "No CRR; Deposit-taking NBFCs maintain SLR (15% of public deposits in liquid assets)"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🏗️ 2. RBI Scale-Based Regulation (SBR) 4-Layer Pyramid"
      },
      {
        type: "table",
        caption: "Scale-Based Regulation (SBR Framework effective October 2022)",
        headers: ["SBR Layer", "Qualifying Criteria & Scale", "Regulatory Stringency"],
        rows: [
          ["Top Layer", "Systemically extreme risk entities (Currently empty; populated only if RBI identifies extreme spillover risk).", "Highest possible supervisory scrutiny."],
          ["Upper Layer (NBFC-UL)", "Top 50 non-deposit taking NBFCs ranked by asset size + systemic interconnectedness.", "**Bank-like regulations**: Mandatory listing within 3 yrs, Common Equity Tier 1 (CET1) 9%, Board composition rules, Leeway limits."],
          ["Middle Layer (NBFC-ML)", "All Deposit-taking NBFCs (NBFC-D) + Non-deposit taking NBFCs with **Asset size ≥ ₹1,000 Crore** + Standalone Primary Dealers (SPDs), HFCs, CICs.", "Standard capital adequacy, NPA classification (90-day norm), Chief Risk Officer (CRO) appointment."],
          ["Base Layer (NBFC-BL)", "Non-deposit taking NBFCs with **Asset size < ₹1,000 Crore** + Peer-to-Peer (P2P), Account Aggregators (AA), NOFHC.", "Light-touch regulation; Net Owned Funds (NOF) raised to ₹10 Crore (phased)."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🤝 3. Co-Lending Model (CLM 80:20)"
      },
      {
        type: "bullet_list",
        items: [
          "**Regulatory Basis:** RBI Master Circular on Co-Lending by Banks and NBFCs to Priority Sector.",
          "**Mandatory Minimum Retention:** The NBFC must retain a **minimum 20% share of the individual loans** on its own books; the Bank takes up to **80%**.",
          "**Single Blended Interest Rate:** Borrower is charged an all-inclusive blended interest rate agreed between the bank and NBFC.",
          "**Customer Service:** NBFC acts as the single point of contact for customer onboarding and recovery."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 21:\n1. **Demand Deposits:** NBFCs **cannot accept demand deposits (CASA)**.\n2. **DICGC Insurance:** NBFC deposits are **NOT insured by DICGC**.\n3. **Co-Lending Share:** NBFC must retain a **minimum 20% risk share** on its balance sheet.\n4. **Principal Business Test:** At least **50% financial assets and 50% financial income**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit21", "nbfcs", "scale-based-regulation", "sbr", "co-lending", "dicgc", "hfcs"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module C - Indian Financial Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-22-development-financial-institutions",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 22: Development Financial Institutions (NABARD, SIDBI, EXIM, NHB & NaBFID)",
    summary: "Comprehensive breakdown of apex developmental banks: NABARD, SIDBI, EXIM Bank, NHB, MUDRA loans (Shishu, Kishore, Tarun, Tarun Plus), and NaBFID Act 2021.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Specialized Term Lending Institutions",
        summary: "Development Financial Institutions (DFIs) provide long-term, patient, concessional project financing for high-risk, long-gestation sectors (Agriculture, MSMEs, Foreign Trade, Housing, Infrastructure) where commercial banks face asset-liability mismatch (ALM)."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Master DFI Overview Matrix"
      },
      {
        type: "table",
        caption: "Apex All-India Financial Institutions (AIFIs)",
        headers: ["Institution", "Statutory Act & Establishment Date", "Headquarters", "Specialized Mandate"],
        rows: [
          ["NABARD", "NABARD Act, 1981 (**12 July 1982**; B. Sivaraman Committee)", "**Mumbai**", "Apex institution for rural development, agriculture credit refinancing, supervision of RRBs/StCBs/DCCBs, and managing RIDF."],
          ["SIDBI", "SIDBI Act, 1989 (**2 April 1990**)", "**Lucknow**", "Principal DFI for promotion, financing, and development of Micro, Small & Medium Enterprises (MSMEs)."],
          ["EXIM Bank", "Export-Import Bank of India Act, 1981 (**1 January 1982**)", "**Mumbai**", "Financing, facilitating, and promoting India's international trade and cross-border project exports."],
          ["National Housing Bank (NHB)", "NHB Act, 1987 (**9 July 1988**)", "**New Delhi**", "Apex financial institution for housing finance; 100% owned by Govt of India (RBI divested stake in 2019)."],
          ["NaBFID", "National Bank for Financing Infrastructure and Development Act, 2021 (**2021**)", "**Mumbai**", "Principal DFI for infrastructure financing with ₹20,000 Cr central capital; targeted to catalyze ₹5 Lakh Cr infra loans."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "💰 2. Pradhan Mantri MUDRA Yojana (PMMY) Loan Categories"
      },
      {
        type: "table",
        caption: "MUDRA Loan Slabs (Refinanced via Micro Units Development & Refinance Agency)",
        headers: ["Loan Category", "Loan Limit Slabs", "Target Beneficiary Stage"],
        rows: [
          ["Shishu", "Loans **up to ₹50,000**", "Early-stage micro-enterprises starting business."],
          ["Kishore", "Loans **above ₹50,000 and up to ₹5 Lakh**", "Enterprises expanding operations and buying equipment."],
          ["Tarun", "Loans **above ₹5 Lakh and up to ₹10 Lakh**", "Established small business units scaling commercial capacity."],
          ["Tarun Plus (Budget 2024-25)", "Loans **above ₹10 Lakh and up to ₹20 Lakh**", "Entrepreneurs who have successfully repaid previous Tarun loans."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 22:\n1. **SIDBI Headquarters:** Located in **Lucknow** (NOT Mumbai).\n2. **MUDRA Loan Cap Enhancement:** Enhanced up to **₹20 Lakh** under the newly introduced **Tarun Plus** category.\n3. **NABARD Committee:** Formulated by **B. Sivaraman Committee (CRAFICARD)** in 1979 (Established 12 July 1982)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit22", "dfis", "nabard", "sidbi", "exim-bank", "nhb", "nabfid", "mudra"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module C - Indian Financial Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-23-financial-inclusion-and-literacy",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 23: Financial Inclusion Schemes, PMJDY Pillars & RBI FI-Index",
    summary: "Exhaustive synthesis of PMJDY (BSBD accounts, OD ₹10k, RuPay ₹2L), Social Security Jan Suraksha (PMJJBY, PMSBY, APY), BC/CSP banking model, and RBI Financial Inclusion Index (3 Dimensions).",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Universal Financial Inclusion",
        summary: "Financial Inclusion is the delivery of formal financial services (banking, credit, insurance, pension) at affordable costs to vulnerable and disadvantaged groups, measured systematically by the RBI FI-Index."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Pradhan Mantri Jan Dhan Yojana (PMJDY) Master Architecture"
      },
      {
        type: "table",
        caption: "PMJDY Key Statutory Parameters",
        headers: ["Feature / Benefit", "Statutory Rule / Outlay", "Operational Condition"],
        rows: [
          ["Account Type", "Basic Savings Bank Deposit (BSBD) Account", "**Zero minimum balance requirement**; zero penalty for non-maintenance."],
          ["RuPay Debit Card", "Free RuPay Debit Card with inbuilt **₹2 Lakh Accidental Insurance**", "Active card condition: At least 1 successful financial/non-financial transaction on any channel within last 90 days."],
          ["Overdraft (OD) Facility", "**Up to ₹10,000** per eligible household (preferably woman)", "No conditions up to ₹2,000; age limit 18–65 years; operative account for min 6 months."],
          ["Deposit Balances", "Over ₹2.3 Lakh Crore mobilized across 52+ Crore accounts", "Women account holders constitute > 55% of all PMJDY accounts."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🛡️ 2. Jan Suraksha Social Security Triad Matrix"
      },
      {
        type: "table",
        caption: "PMJJBY, PMSBY and APY Comparison",
        headers: ["Scheme Name", "Eligible Age Bracket", "Annual Premium", "Risk / Benefit Coverage"],
        rows: [
          ["PM Jeevan Jyoti Bima Yojana (PMJJBY)", "**18 to 50 Years** (Life cover up to 55 yrs)", "**₹436 per annum** (auto-debited from bank a/c)", "**₹2 Lakh Life Insurance cover** payable on death of insured due to ANY cause."],
          ["PM Suraksha Bima Yojana (PMSBY)", "**18 to 70 Years**", "**₹20 per annum** (auto-debited)", "**₹2 Lakh for accidental death / total permanent disability**; ₹1 Lakh for partial permanent disability."],
          ["Atal Pension Yojana (APY)", "**18 to 40 Years** (Accumulation period min 20 yrs)", "Varies by age & chosen pension", "**Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000** starting at age 60 for life."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📊 3. Reserve Bank of India Financial Inclusion Index (FI-Index)"
      },
      {
        type: "table",
        caption: "RBI FI-Index 3 Dimensions (Published Annually in July; Range 0 to 100)",
        headers: ["Dimension", "Weightage (%)", "Core Parameters Evaluated"],
        rows: [
          ["Access", "**35%**", "Banking outlets, Bank branches, ATMs, PoS terminals, BC outlets per 10,000 population."],
          ["Usage", "**45% (Highest Weight)**", "Active savings accounts, credit accounts, digital transactions, insurance policies, remittances."],
          ["Quality", "**20%**", "Financial literacy, consumer protection, grievances redressal, ease of onboarding, fraud mitigation."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 23:\n1. **FI-Index Weights:** **Usage (45%) > Access (35%) > Quality (20%)**.\n2. **PMJJBY vs PMSBY Age:** PMJJBY is **18–50 yrs**; PMSBY is **18–70 yrs**; APY is **18–40 yrs**.\n3. **PMJDY OD Limit:** Up to **₹10,000** (no questions asked up to ₹2,000)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit23", "financial-inclusion", "pmjdy", "pmjjby", "pmsby", "apy", "fi-index"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module C - Indian Financial Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-24-digital-banking-and-fintech",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 24: Digital Banking, NPCI Payment Systems & CBDC (e-Rupee)",
    summary: "Doctoral study unit on Payment and Settlement Systems Act 2007, NPCI products (UPI, IMPS, AePS, NACH, NETC), Central Bank Digital Currency (CBDC e₹), Account Aggregators, and DBUs.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Digital Public Infrastructure (DPI)",
        summary: "India's payment ecosystem, governed by the Payment and Settlement Systems Act 2007 and operated largely through NPCI, processes over 15 Billion transactions monthly across UPI, IMPS, and AePS, transitioning toward Sovereign CBDC."
      },
      {
        type: "heading",
        level: 2,
        text: "⚡ 1. NPCI Retail Payment Products Matrix"
      },
      {
        type: "table",
        caption: "National Payments Corporation of India (NPCI) Platforms",
        headers: ["Payment System", "Underlying Technology / Rail", "Transaction Limits & Benchmarks"],
        rows: [
          ["Unified Payments Interface (UPI)", "Virtual Payment Address (VPA) over IMPS protocol", "Standard: ₹1 Lakh/day; Capital markets/insurance: ₹2 Lakh; **Hospitals & Educational Institutions: ₹5 Lakh**; UPI 123PAY for feature phones."],
          ["Immediate Payment Service (IMPS)", "24x7 instant interbank fund transfer via mobile/IFSC", "Limit per transaction: **₹5 Lakh** (enhanced from ₹2 Lakh in 2021)."],
          ["Aadhaar Enabled Payment System (AePS)", "Micro-ATMs using Aadhaar biometric authentication", "Cash withdrawal, cash deposit, balance enquiry, Aadhaar-to-Aadhaar fund transfer via BC network."],
          ["National Automated Clearing House (NACH)", "Bulk, high-volume recurring payments clearing", "Direct Benefit Transfers (DBT), salary credits, dividend payments, auto-debit of SIPs/EMIs (e-NACH)."],
          ["National Electronic Toll Collection (NETC)", "RFID-based FASTag technology", "Automated electronic toll collection across national and state highways."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🪙 2. Central Bank Digital Currency (CBDC — e-Rupee)"
      },
      {
        type: "table",
        caption: "Retail (e₹-R) vs. Wholesale (e₹-W) Digital Rupee",
        headers: ["Parameter", "Wholesale CBDC (e₹-W - Launched 1 Nov 2022)", "Retail CBDC (e₹-R - Launched 1 Dec 2022)"],
        rows: [
          ["Legal Status", "Direct sovereign liability of Reserve Bank of India (Legal tender under amended RBI Act)", "Direct sovereign liability of RBI; digital token equivalent to physical cash."],
          ["Target Users", "Restricted to **Select Banks and Financial Institutions**", "**General Public, Consumers, and Merchants**."],
          ["Primary Use Case", "Settlement of **secondary market transactions in Government Securities (G-Secs)** and interbank money market.", "Peer-to-Peer (P2P) and Peer-to-Merchant (P2M) retail retail purchases using digital token wallets."],
          ["Interest Yield", "**Zero Interest** (Earns no interest, exactly identical to physical currency notes)", "**Zero Interest** (Does not earn interest to prevent commercial bank disintermediation)."],
          ["Anonymity / Privacy", "Audited institutional settlement", "Small-value transactions offer cash-like anonymity under DPDP framework."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📱 3. Account Aggregator (AA) Ecosystem"
      },
      {
        type: "bullet_list",
        items: [
          "**Role:** An **NBFC-AA** regulated by RBI that facilitates consent-based, encrypted sharing of financial data between **Financial Information Providers (FIPs - Banks, Mutual Funds, Depository)** and **Financial Information Users (FIUs - Lenders, Wealth Managers)**.",
          "**Data Privacy:** Account Aggregators operate as **blind data pipelines** — they cannot see, store, or monetize user data (end-to-end encrypted)."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 24:\n1. **CBDC Interest:** Digital Rupee (CBDC) **earns ZERO interest** (unlike bank deposits) to preserve the banking system's deposit base.\n2. **UPI Limit for Hospitals & Education:** Raised to **₹5 Lakh per transaction**.\n3. **IMPS Per-Transaction Limit:** **₹5 Lakh**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit24", "digital-banking", "npci", "upi", "imps", "cbdc", "e-rupee", "account-aggregator"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module C - Indian Financial Architecture)"
    }
  }
];

// Write physical corpus files and update note registry
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
let startNoteNum = 570;

moduleCUnits.forEach((unit, idx) => {
  const filePath = path.join(corpusDir, `${unit.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(unit, null, 2), 'utf-8');
  console.log(`✅ Written ${unit.id}.json`);

  const currentNum = startNoteNum + idx;
  registry[String(currentNum)] = {
    noteNumber: currentNum,
    id: unit.id,
    title: unit.title,
    domain: unit.domain,
    category: unit.metadata.category,
    file: `content/corpus/${unit.id}.json`
  };
});

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
console.log(`🎉 Ingested all Module C Units (Units 16 to 24) into note-registry.json (#570 to #578)!`);
