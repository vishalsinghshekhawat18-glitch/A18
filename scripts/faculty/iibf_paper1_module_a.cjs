const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', '..', 'content', 'note-registry.json');

const moduleAUnits = [
  {
    id: "iibf-ieifs-unit-2-sectors-of-economy",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 2: Sectors of the Indian Economy (Primary, Secondary, Tertiary & Sunrise)",
    summary: "Doctoral study unit covering Primary, Secondary, Tertiary, Quaternary and Quinary sectors; agricultural dependency, MSP mechanisms, Make in India, PLI schemes, and Services export engine.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: 5-Tier Sectoral Architecture",
        summary: "Modern economic taxonomy divides economic activities into 5 progressive tiers: Primary (Resource Extraction), Secondary (Value Addition/Manufacturing), Tertiary (Service Provision), Quaternary (Knowledge/IT/R&D), and Quinary (High-level Strategic Decision Making)."
      },
      {
        type: "heading",
        level: 2,
        text: "📊 1. Detailed Sectoral Classification Matrix"
      },
      {
        type: "table",
        caption: "5-Tier Economic Activity Hierarchy",
        headers: ["Sector Tier", "Economic Definition", "Key Component Industries", "Indian Economic Footprint"],
        rows: [
          ["Primary Sector", "Direct utilization/extraction of natural resources.", "Agriculture, Forestry, Fishing, Mining & Quarrying.", "Employs ~45% of workforce; generates ~16-18% of GVA."],
          ["Secondary Sector", "Processing raw materials into finished industrial goods.", "Manufacturing, Construction, Electricity, Gas & Water supply.", "Generates ~28% of GVA; employs ~25% workforce. Target: 25% Mfg share."],
          ["Tertiary Sector", "Provision of intangible services supporting production & consumption.", "Trade, Hotels, Transport, Communication, Storage, Banking, Insurance, Real Estate.", "Generates ~54% of GVA (India's growth locomotive); employs ~30% workforce."],
          ["Quaternary Sector", "Knowledge-based, intellectual and information services.", "IT/ITeS, Software development, Financial analytics, Big Data, R&D, Education consultancy.", "Primary driver of India's services exports ($340B+ annually)."],
          ["Quinary Sector", "Highest-level decision-making and policy formulation.", "Top government executives, NGO heads, science think tanks, corporate boards, policy advisors.", "Often referred to as 'Gold Collar' professionals directing national policy."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🌾 2. Primary Sector: Agricultural Policy, MSP & Credit Mechanisms"
      },
      {
        type: "paragraph",
        content: "Agriculture remains the bedrock of social stability in India. Key institutional parameters include:"
      },
      {
        type: "bullet_list",
        items: [
          "**Minimum Support Price (MSP):** Recommended by the **Commission for Agricultural Costs and Prices (CACP)** and approved by the **Cabinet Committee on Economic Affairs (CCEA)**. Announced for **22 mandated crops + 1 fair & remunerative price (FRP) for sugarcane** (Total 23).",
          "**MSP Formula Benchmark (Swaminathan Committee):** Set at **at least 1.5 times the cost of production (\\(A_2 + FL\\))**, where \\(A_2\\) covers direct paid-out costs (seeds, fertilizer, labor, fuel) and \\(FL\\) covers family labor value.",
          "**Kisan Credit Card (KCC):** Introduced in 1998 (RV Gupta Committee / NABARD model). Provides short-term crop loans up to ₹3 Lakh at a subvention-subsidized effective interest rate of **4.0%** (7% nominal rate minus 3% prompt repayment incentive). Now extended to Animal Husbandry & Fisheries (up to ₹2 Lakh sub-limit).",
          "**Priority Sector Lending (PSL) Mandate:** Domestic Commercial Banks and Foreign Banks (≥20 branches) must deploy **18% of ANBC / CEOBE to Agriculture**, of which **10% is earmarked exclusively for Small and Marginal Farmers (SMFs)**."
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🏭 3. Secondary Sector: Industrial Initiatives, PLI & Capital Goods"
      },
      {
        type: "paragraph",
        content: "To overcome the historical manufacturing deficit, India instituted structural supply-side frameworks:"
      },
      {
        type: "bullet_list",
        items: [
          "**Production Linked Incentive (PLI) Scheme:** Spanning **14 champion sectors** (Electronics/Mobiles, Pharmaceuticals, Automobiles, Advanced Chemistry Cells, Solar PV, Specialty Steel) with an aggregate financial outlay exceeding **₹1.97 Lakh Crore**.",
          "**Index of Industrial Production (IIP):** Base Year **2011-12**; compiled monthly by National Statistical Office (NSO). Weights: **Manufacturing (77.63%) > Mining (14.37%) > Electricity (7.99%)**.",
          "**Core Industries (Eight Core Sectors):** Account for **40.27% weight in IIP**. Weightage order: **Refinery Products (28.04%) > Electricity (19.85%) > Steel (17.92%) > Coal (10.33%) > Crude Oil (8.98%) > Natural Gas (6.88%) > Cement (5.37%) > Fertilizers (2.63%)**."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 IIBF Exam Traps for Unit 2:\n1. **Eight Core Industries Highest & Lowest Weights:** Highest is **Refinery Products (28.04%)**; Lowest is **Fertilizers (2.63%)**.\n2. **MSP Approval Authority:** CACP only *recommends* MSP; the final approving authority is **CCEA (Cabinet Committee on Economic Affairs chaired by Prime Minister)**.\n3. **Crops under MSP:** Exactly **22 mandated crops + 1 for Sugarcane (FRP)** = Total 23."
      },
      {
        type: "heading",
        level: 3,
        text: "❓ Solved IIBF Unit 2 Practice MCQs"
      },
      {
        type: "paragraph",
        content: "**Q1:** Which among the following eight core industries carries the highest weightage in the Index of Industrial Production (IIP)?\n• (A) Coal\n• (B) Steel\n• (C) Refinery Products\n• (D) Electricity\n**Correct Answer: (C) Refinery Products (28.04%)**"
      },
      {
        type: "paragraph",
        content: "**Q2:** Under the Swaminathan Committee recommendation implemented by the Government, MSP is fixed at a minimum of:\n• (A) 100% of \\(A_2\\) cost\n• (B) 1.5 times of \\(A_2 + FL\\) cost\n• (C) 2.0 times of \\(C_2\\) comprehensive cost\n• (D) Market equilibrium price\n**Correct Answer: (B) 1.5 times of \\(A_2 + FL\\) cost**"
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B ESI", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit2", "sectors", "agriculture", "msp", "iip", "core-industries", "pli"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module A - Indian Economic Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-3-economic-planning-niti",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 3: Economic Planning Architecture & NITI Aayog Strategy",
    summary: "Comprehensive masterclass on Indian Five Year Plans, Planning Commission dissolution, NITI Aayog composition, cooperative federalism, SDG India Index, and 15-Year Vision / 7-Year Strategy.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Planning Framework Evolution",
        summary: "India transitioned from Soviet-inspired, directive, centralized Five-Year Plans (1951–2014) to indicative planning and cooperative-competitive federalism under NITI Aayog (established 1 Jan 2015), replacing rigid allocation with strategic policy formulation."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Five Year Plans Master Synthesis (1st to 12th FYP)"
      },
      {
        type: "table",
        caption: "Chronological Breakdown of Indian Five Year Plans",
        headers: ["Plan", "Period", "Growth Target vs Achieved", "Core Model / Strategy", "Major Structural Milestones"],
        rows: [
          ["1st Plan", "1951–56", "Target: 2.1% | Achieved: 3.6%", "Harrod-Domar Model", "Agricultural focus, price control, major irrigation dams (Bhakra, Hirakud, DVC)."],
          ["2nd Plan", "1956–61", "Target: 4.5% | Achieved: 4.27%", "Nehru-Mahalanobis 4-Sector Model", "Heavy industrialization, capital goods; IPR 1956; Steel plants (Bhilai, Rourkela, Durgapur)."],
          ["3rd Plan", "1961–66", "Target: 5.6% | Achieved: 2.84%", "John Sandy & Sukhamoy Chakravarty", "'Gadgil Yojana'; severe failure due to 1962 China War, 1965 Pak War & 1965-66 drought."],
          ["Plan Holiday", "1966–69", "3 Annual Plans", "Crisis management", "Green Revolution launched (HYV seeds); Rupee devalued in 1966 (36.5%)."],
          ["4th Plan", "1969–74", "Target: 5.7% | Achieved: 3.30%", "Gadgil Formula (Stability with growth)", "14 Banks Nationalized (1969); 1971 Bangladesh War; Pokhran-I (1974)."],
          ["5th Plan", "1974–79", "Target: 4.4% | Achieved: 4.83%", "D.D. Dhar Model ('Garibi Hatao')", "20-Point Programme; Terminated 1 yr early (1978) by Janata Govt."],
          ["Rolling Plan", "1978–80", "Annual rolling evaluation", "Gunnar Myrdal model (Lakdawala)", "Janata Party rolling plan rejected when Congress returned in 1980."],
          ["6th Plan", "1980–85", "Target: 5.2% | Achieved: 5.66%", "Investment Strategy", "Poverty alleviation; NABARD & EXIM Bank founded (1982); 6 more banks nationalized (1980)."],
          ["7th Plan", "1985–90", "Target: 5.0% | Achieved: 6.01%", "Pranab Mukherjee Model", "'Food, Work, Productivity'; Break from 'Hindu Rate of Growth'; SEBI established (1988)."],
          ["Annual Plans", "1990–92", "BoP Crisis adjustment", "LPG Reforms Launch", "Structural Adjustment Programme (LPG) under Narasimha Rao & Manmohan Singh (1991)."],
          ["8th Plan", "1992–97", "Target: 5.6% | Achieved: 6.68%", "John W. Miller Model", "HRD, employment generation; India joined WTO on 1 Jan 1995."],
          ["9th Plan", "1997–02", "Target: 6.5% | Achieved: 5.35%", "Growth with Social Justice & Equity", "East Asian Currency Crisis (1997); Pokhran-II (1998); Kargil War (1999)."],
          ["10th Plan", "2002–07", "Target: 8.0% | Achieved: 7.6%", "Governance & Social Targets", "Targeted 8% GDP growth; Sarva Shiksha Abhiyan; poverty ratio reduction."],
          ["11th Plan", "2007–12", "Target: 9.0% | Achieved: 8.0%", "C. Rangarajan / Montek Ahluwalia", "'Faster and More Inclusive Growth'; weather 2008 Global Financial Crisis."],
          ["12th Plan", "2012–17", "Target: 8.0% | Achieved: ~6.9%", "'Faster, Sustainable, More Inclusive'", "Final Five Year Plan in Indian history. Dissolved with Planning Commission."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "💡 2. NITI Aayog: Structural Architecture & Strategy"
      },
      {
        type: "paragraph",
        content: "**National Institution for Transforming India (NITI Aayog)** was formed via Union Cabinet Resolution on **January 1, 2015**:"
      },
      {
        type: "bullet_list",
        items: [
          "**Chairperson:** Prime Minister of India (Ex-officio).",
          "**Governing Council:** Comprises Chief Ministers of all States, Chief Ministers of UTs with legislatures (Delhi, Puducherry, J&K), and Lieutenant Governors of other UTs.",
          "**Vice-Chairperson & CEO:** Appointed directly by the Prime Minister.",
          "**Two Dedicated Operational Hubs:**\n  • **Team India Hub:** Acts as the interface between States and the Central Government.\n  • **Knowledge and Innovation Hub:** Builds the think-tank capabilities and research repository.",
          "**New Planning Horizon Framework:** Replaced 5-year plans with a 3-tier planning framework:\n  1. **15-Year Vision Document** (Long-term national aspirations to 2030/2047).\n  2. **7-Year Strategy Document** (Mid-term strategic goals).\n  3. **3-Year Action Agenda** (Operational roadmap for implementation)."
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🏆 3. NITI Aayog Key Indices & Flagship Initiatives"
      },
      {
        type: "table",
        caption: "NITI Aayog Monitoring Indices",
        headers: ["Index / Initiative Name", "Primary Metric & Purpose", "Leading State / Benchmark"],
        rows: [
          ["SDG India Index", "Tracks national & state progress across 16 of 17 UN Sustainable Development Goals.", "Kerala & Tamil Nadu consistently lead; Front-runner score > 65."],
          ["National Multidimensional Poverty Index (MPI)", "12 indicators across Health, Education, and Standard of Living based on NFHS data.", "Headcount poverty dropped from 24.85% (2015-16) to 14.96% (2019-21) and under 11.3% (2023)."],
          ["Aspirational Districts Programme (ADP)", "Rapid transformation of 112 most backward districts based on 49 Key Performance Indicators.", "Focus on Health (30%), Education (30%), Agriculture (20%), Financial Inclusion (10%), Infra (10%)."],
          ["Export Preparedness Index (EPI)", "Evaluates states on Policy, Business Ecosystem, Export Ecosystem, Export Performance.", "Coastal states (Tamil Nadu, Maharashtra, Gujarat) dominate."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 3:\n1. **Nature of NITI Aayog:** It is **neither a constitutional body nor a statutory body** — it was created through an executive resolution of the Union Cabinet.\n2. **Planning Horizon:** The 5-year plan system was replaced by the **15-Year Vision, 7-Year Strategy, and 3-Year Action Agenda**.\n3. **National Development Council (NDC):** NDC was set up in August 1952 to approve Five Year Plans; it has been defunct since NITI Aayog's inception."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2 ESI", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit3", "planning-commission", "niti-aayog", "fyps", "sdg-index", "mpi"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module A - Indian Economic Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-4-priority-sector-msme",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 4: Role of Priority Sector Lending (PSL) and MSME in the Economy",
    summary: "Exhaustive synthesis of RBI Master Directions on PSL targets, sub-targets for Domestic vs Foreign Banks/RRBs/SFBs, MSME composite classification criteria (July 2020), TReDS, CGTMSE, and Udyam registration.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Credit Delivery Mandates",
        summary: "Priority Sector Lending (PSL) institutionalizes credit flow to vulnerable, high-employment sectors (Agriculture, MSMEs, Education, Housing, Renewable Energy) that would otherwise face credit rationing by market-driven commercial banks."
      },
      {
        type: "heading",
        level: 2,
        text: "🎯 1. Master Priority Sector Lending (PSL) Targets Matrix"
      },
      {
        type: "table",
        caption: "RBI PSL Mandated Targets (% of ANBC or CEOBE, whichever is higher)",
        headers: ["Bank Category", "Total PSL Target", "Agriculture Sub-target", "Small & Marginal Farmers (SMF)", "Weaker Sections", "Micro Enterprises"],
        rows: [
          ["Domestic Commercial Banks & Foreign Banks (≥20 branches)", "40% of ANBC", "18% of ANBC", "10% of ANBC", "12% of ANBC", "7.5% of ANBC"],
          ["Foreign Banks (<20 branches)", "40% of ANBC (max 32% in exports; min 8% to other sectors)", "No specific sub-target", "No specific sub-target", "No specific sub-target", "No specific sub-target"],
          ["Regional Rural Banks (RRBs)", "75% of ANBC", "18% of ANBC", "10% of ANBC", "15% of ANBC", "7.5% of ANBC"],
          ["Small Finance Banks (SFBs)", "75% of ANBC", "18% of ANBC", "10% of ANBC", "12% of ANBC", "7.5% of ANBC"],
          ["Primary Urban Cooperative Banks (UCBs)", "Phased to 75% of ANBC by March 31, 2026", "N/A (Urban focus)", "N/A", "12% of ANBC", "7.5% of ANBC"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📋 2. Eligible Priority Sector Categories (8 Broad Sectors)"
      },
      {
        type: "bullet_list",
        items: [
          "**1. Agriculture:** Farm Credit (crop loans, term loans), Agriculture Infrastructure (up to ₹100 Cr per borrower), Ancillary Activities (up to ₹5 Cr for Agri-clinics/Agri-business centres).",
          "**2. Micro, Small and Medium Enterprises (MSMEs):** All bank loans to MSMEs as per official composite criteria.",
          "**3. Export Credit:** For domestic banks, incremental export credit up to 2% of ANBC (subject to cap of ₹40 Cr per borrower). Foreign banks (<20 branches) up to 32% of ANBC.",
          "**4. Education:** Loans to individuals for educational purposes up to **₹20 Lakh** (in India and abroad).",
          "**5. Housing:** Loans up to **₹35 Lakh in Metropolitan centres** (population ≥10 Lakh) with overall dwelling cost ≤ ₹45 Lakh; loans up to **₹25 Lakh in other centres** with dwelling cost ≤ ₹30 Lakh.",
          "**6. Social Infrastructure:** Bank loans up to **₹5 Cr per borrower** for building schools, drinking water facilities, sanitation/health facilities; loans up to **₹10 Cr for Ayushman Bharat hospitals** in Tier II to Tier VI centres.",
          "**7. Renewable Energy:** Loans up to **₹30 Cr per borrower** for solar/biomass/wind plants; individual households up to **₹10 Lakh**.",
          "**8. Others:** Loans up to ₹1 Lakh per borrower to distressed persons indebted to non-institutional lenders; SHGs/JLGs up to ₹20 Lakh."
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🏭 3. MSME Composite Definition (Gazette Notification 1 July 2020)"
      },
      {
        type: "table",
        caption: "Revised Composite Criteria (Investment in P&M AND Annual Turnover)",
        headers: ["Enterprise Class", "Investment in Plant & Machinery / Equipment", "Annual Turnover (Excluding Export Turnover!)", "Composite Calculation Rule"],
        rows: [
          ["Micro Enterprise", "≤ ₹1 Crore", "≤ ₹5 Crore", "Both criteria must be satisfied simultaneously; if an enterprise crosses either threshold, it shifts to higher class."],
          ["Small Enterprise", "≤ ₹10 Crore", "≤ ₹50 Crore", "Turnover calculation **strictly EXCLUDES export turnover** to incentivize global exports."],
          ["Medium Enterprise", "≤ ₹50 Crore", "≤ ₹250 Crore", "Investment is calculated based on Written Down Value (WDV) as per Income Tax return."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🛡️ 4. Institutional Support Frameworks for MSMEs"
      },
      {
        type: "bullet_list",
        items: [
          "**Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE):** Set up jointly by **Govt of India and SIDBI**. Provides credit guarantee cover up to **₹5 Crore** per borrower without collateral/third-party guarantee. Guarantee cover ranges from **75% to 85%** (higher for women, SC/ST, aspirational districts).",
          "**Trade Receivables Discounting System (TReDS):** Electronic factoring platform regulated by RBI under PSS Act 2007. Connects MSME sellers, corporate/PSU/Govt buyers, and financiers for invoice discounting without recourse to MSME.",
          "**Delayed Payments Mandate (MSMED Act 2006):** Buyer must make payment within agreed period (maximum **45 days**). Errant buyers are liable to pay **compound interest with monthly rests at 3 times the Bank Rate** notified by RBI."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 4:\n1. **Export Turnover in MSME:** Export turnover is **excluded** from the calculation of turnover for classifying an enterprise as Micro, Small, or Medium.\n2. **Delayed Payment Penalty:** Penalty interest is **3 times the RBI Bank Rate** (compounded monthly) under Section 16 of MSMED Act, 2006.\n3. **PSL Non-Achievement Penalty:** Banks failing to achieve PSL targets must invest the shortfall in **RIDF (Rural Infrastructure Development Fund administered by NABARD)** or other funds (SIDBI/NHB/MUDRA) at penal/sub-market interest rates."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit4", "psl", "msme", "cgtmse", "treds", "ridf", "delayed-payments"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module A - Indian Economic Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-5-infrastructure-social-infra",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 5: Infrastructure Architecture, Logistics & Social Infrastructure",
    summary: "Detailed synthesis of National Infrastructure Pipeline (NIP ₹111 Lakh Cr), PM GatiShakti, National Logistics Policy, PPP models (BOT, BOOT, HAM), Education/NEP 2020, Ayushman Bharat, and HDI parameters.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Infrastructure as Economic Capital",
        summary: "Infrastructure acts as the economic capital multiplier. It is bifurcated into Hard/Physical Infrastructure (Transport, Power, Telecom) which lowers logistics costs, and Social Infrastructure (Healthcare, Education, Skills) which builds human capital and productivity."
      },
      {
        type: "heading",
        level: 2,
        text: "🏗️ 1. National Infrastructure Initiatives & Flagship Master Plans"
      },
      {
        type: "table",
        caption: "Key Physical Infrastructure Frameworks in India",
        headers: ["Initiative Name", "Core Outlay & Target", "Key Structural Objective"],
        rows: [
          ["National Infrastructure Pipeline (NIP)", "₹111 Lakh Crore across 2020–2025", "Financed by Centre (39%), States (39%), Private Sector (22%). Energy (24%), Roads (19%), Urban (16%), Railways (13%)."],
          ["PM GatiShakti National Master Plan", "GIS-based digital multi-modal platform", "Synchronizes infrastructure planning across 16 Central Ministries to eliminate departmental silos and project delays."],
          ["National Logistics Policy (NLP 2022)", "Reduce logistics cost from 13-14% of GDP to global benchmark of ~8%", "Unified Logistics Interface Platform (ULIP) and Comprehensive Logistics Action Plan (CLAP)."],
          ["Bharatmala Pariyojana", "Economic corridors, inter-corridors, feeder routes (34,800 km in Phase 1)", "Seamless freight road transport and border connectivity."],
          ["Sagarmala Programme", "Port-led development (800+ projects)", "Port modernization, port-linked industrialization, coastal community development."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🤝 2. Public-Private Partnership (PPP) Investment Models"
      },
      {
        type: "table",
        caption: "Comparison of PPP Highway & Infra Project Models",
        headers: ["PPP Model", "Financing & Construction", "Toll / Revenue Collection", "Risk Allocation"],
        rows: [
          ["Build-Operate-Transfer (BOT-Toll)", "Private concessionaire finances 100% and builds", "Private player collects toll directly from users during concession period (e.g. 20-30 yrs)", "100% Commercial & Traffic risk borne by Private Player."],
          ["BOT-Annuity", "Private player finances and builds", "Government pays fixed bi-annual annuity payments to private developer", "Government bears traffic risk; developer bears construction/maintenance risk."],
          ["Hybrid Annuity Model (HAM)", "Government pays 40% in 5 milestones; Developer finances 60%", "NHAI collects toll; pays developer remaining 60% as annuity with interest over 15 years", "Balanced risk-sharing; solved private financing bottleneck in highway sector."],
          ["Engineering, Procurement, Construction (EPC)", "Government finances 100%", "Government collects toll", "100% project & traffic risk on Government; private contractor simply builds for a fee."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🏥 3. Social Infrastructure: Health, Education & HDI Benchmarks"
      },
      {
        type: "bullet_list",
        items: [
          "**Ayushman Bharat - PM Jan Arogya Yojana (PM-JAY):** Provides cashless health cover of **₹5 Lakh per family per year** for secondary and tertiary care hospitalization to over 12 Crore vulnerable families (bottom 40% of population).",
          "**Ayushman Arogya Mandir (formerly Health & Wellness Centres):** Over 1,60,000 primary healthcare centers operationalized to provide comprehensive primary healthcare and free essential diagnostic tests.",
          "**National Education Policy (NEP 2020):** Replaced 10+2 structure with **5+3+3+4 model** (Foundational: 3–8 yrs, Preparatory: 8–11 yrs, Middle: 11–14 yrs, Secondary: 14–18 yrs). Targets **50% Gross Enrolment Ratio (GER) in Higher Education by 2035** and 6% of GDP public expenditure on education.",
          "**Human Development Index (HDI - UNDP):** Geometric mean of 3 normalized indices: (1) **Life Expectancy at Birth**, (2) **Education (Mean Years of Schooling + Expected Years of Schooling)**, (3) **Gross National Income (GNI) per capita (PPP $)**."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 5:\n1. **HAM Highway Funding Split:** Government contributes **40% cash support** in 5 equal installments during construction; private concessionaire arranges remaining **60%**.\n2. **NEP 2020 Curricular Structure:** **5+3+3+4** (Covering age 3 to 18 years, including 3 years of Anganwadi/pre-schooling).\n3. **NIP Capital Outlay Split:** Centre (39%) : States (39%) : Private Sector (22%)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit5", "infrastructure", "nip", "gati-shakti", "nlp", "ham", "ayushman-bharat", "nep2020"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module A - Indian Economic Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-6-globalization-trade-policy",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 6: Globalization, Foreign Trade Policy & Rupee Internationalization",
    summary: "Exhaustive study unit on Globalization dynamics, GFC impact, Foreign Trade Policy (FTP 2023), Special Rupee Vostro Accounts (SRVA), Balance of Payments, Current Account vs Capital Account convertibility.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: External Sector Architecture",
        summary: "India's integration into the global economy operates through trade in goods and services, capital flows (FDI/FPI), and remittances, balanced by Reserve Bank of India foreign exchange reserves and Foreign Trade Policy targets."
      },
      {
        type: "heading",
        level: 2,
        text: "🚢 1. Foreign Trade Policy (FTP 2023) Master Highlights"
      },
      {
        type: "paragraph",
        content: "Released by the Ministry of Commerce & Industry, **FTP 2023** replaced fixed 5-year policies with an open-ended dynamic framework:"
      },
      {
        type: "bullet_list",
        items: [
          "**Mega Export Target:** Scaled to achieve **$2 Trillion in exports ($1 Trillion Merchandise + $1 Trillion Services) by 2030**.",
          "**4 Key Pillars of FTP 2023:**\n  1. **Incentive to Remission:** Shift from subsidy-based schemes to automated duty remission (RoDTEP, RoSCTL).\n  2. **Export Promotion through Collaboration:** Exporters, States, Districts, Indian Missions abroad.\n  3. **Ease of Doing Business:** Paperless online processing, reduction in transaction fees for MSMEs.\n  4. **Emerging Areas:** E-Commerce exports, Towns of Export Excellence (TEE), and District as Export Hubs (DEH).",
          "**Towns of Export Excellence (TEE):** 4 new towns added (Faridabad, Mirzapur, Moradabad, Varanasi) taking the total to **43 TEEs**.",
          "**E-Commerce Export Cap Raised:** Consignment value limit for exports through courier raised from ₹5 Lakh to **₹10 Lakh per consignment**."
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "💱 2. Rupee Internationalization & Special Rupee Vostro Accounts (SRVA)"
      },
      {
        type: "paragraph",
        content: "In July 2022, RBI issued circular permitting **Invoicing, Payment, and Settlement of International Trade in Indian Rupees (INR)**:"
      },
      {
        type: "bullet_list",
        items: [
          "**Mechanism:** Foreign bank opens a **Special Rupee Vostro Account (SRVA)** with an Authorized Dealer (AD) Category-I bank in India after RBI approval.",
          "**Import Settlement:** Indian importer pays in INR into the foreign bank's SRVA against invoices.",
          "**Export Settlement:** Indian exporter receives payment in INR deducted from the foreign bank's SRVA.",
          "**Surplus Rupee Balance Utilization:** Foreign entities holding surplus INR in SRVA can invest in **Government Securities (T-Bills, G-Secs)**, local trade projects, or external payments.",
          "**Strategic Impact:** De-dollarization of bilateral trade, mitigation of forex exchange rate risk, and insulation against sanctions."
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "⚖️ 3. Balance of Payments (BoP) & Currency Convertibility"
      },
      {
        type: "table",
        caption: "Balance of Payments (BoP) Structure",
        headers: ["BoP Account", "Component Categories", "Convertibility Status in India"],
        rows: [
          ["Current Account", "1. Merchandise Trade (Exports - Imports = Trade Balance)\n2. Invisibles: Services (IT/BPO), Transfers (Remittances - India is #1 globally with $125B+), Income (Profits/Dividends/Interest).", "**100% Full Convertibility** (since August 1994 under Article VIII of IMF)."],
          ["Capital Account", "1. Foreign Direct Investment (FDI - long term equity)\n2. Foreign Portfolio Investment (FPI - debt/equities)\n3. External Commercial Borrowings (ECB)\n4. Banking Capital (NRI Deposits - NRE/NRO/FCNR(B))\n5. External Assistance (Concessional loans).", "**Partial / Calibrated Convertibility** (Tarapore Committee 1997 & 2006 laid roadmap for Full CAC subject to fiscal deficit < 3.5%, inflation 3-5%, gross NPA < 5%)."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 6:\n1. **Convertibility Status:** India has **Full Current Account Convertibility** (achieved in 1994) but only **Partial Capital Account Convertibility**.\n2. **Tarapore Committee:** Associated with **Capital Account Convertibility (CAC)**.\n3. **FTP 2023 Export Target:** **$2 Trillion total exports by 2030** ($1T merchandise + $1T services)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit6", "globalization", "ftp2023", "srva", "bop", "convertibility", "tarapore"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module A - Indian Economic Architecture)"
    }
  },
  {
    id: "iibf-ieifs-unit-7-international-economic-organizations",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 7: International Economic Organizations (World Bank, IMF, WTO & MDBs)",
    summary: "Comprehensive breakdown of Bretton Woods twins (IBRD/IDA vs IMF), SDR valuation basket, WTO Agreements (AoA Box subsidies, TRIPS, TRIMS), ADB, NDB, and AIIB.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Multilateral Financial Institutions",
        summary: "The Bretton Woods Conference (1944) established the IMF (Monetary stability & BoP support) and IBRD/World Bank (Post-war reconstruction & long-term developmental financing), later complemented by the WTO (1995) for global trade rules."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. World Bank Group (5 Specialized Institutions)"
      },
      {
        type: "table",
        caption: "The 5 Arms of the World Bank Group (Headquarters: Washington, D.C.)",
        headers: ["Institution Name", "Year", "Target Beneficiaries & Core Function", "India Membership"],
        rows: [
          ["IBRD (International Bank for Reconstruction and Development)", "1944", "Provides middle-income and creditworthy low-income governments with commercial/market-rate developmental loans.", "Founding Member (1944)."],
          ["IDA (International Development Association)", "1960", "Known as the **'Soft Loan Window'**; provides zero/ultra-low interest credits and grants to poorest nations.", "Member (1960); India was historically largest recipient, graduated in 2014."],
          ["IFC (International Finance Corporation)", "1956", "Private sector arm; provides debt, equity, and advisory services directly to private enterprises in developing countries.", "Founding Member (1956)."],
          ["MIGA (Multilateral Investment Guarantee Agency)", "1988", "Provides political risk insurance (guarantees against expropriation, war, currency inconvertibility) to private investors.", "Member (1994)."],
          ["ICSID (International Centre for Settlement of Investment Disputes)", "1966", "Conciliation and arbitration of international investment disputes between foreign investors and sovereign states.", "**India is NOT a member** (asserts convention is biased towards foreign investors)."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🌐 2. International Monetary Fund (IMF) & Special Drawing Rights (SDR)"
      },
      {
        type: "bullet_list",
        items: [
          "**Core Mandate:** Ensures stability of the international monetary system, exchange rate stability, and provides short/medium-term balance-of-payments financing to members.",
          "**Quota System:** Each member is assigned a quota based on its relative size in the world economy (GDP, Openness, Economic Variability, Reserves). Quotas determine **voting power, subscription fee, and access to financing**.",
          "**Special Drawing Rights (SDR - 'Paper Gold'):** Supplementary international reserve asset created by IMF in 1969. **Value of 1 SDR is based on a basket of 5 major currencies**.",
          "**SDR Currency Basket & Weights (Effective August 2022):**\n  1. **US Dollar ($USD$):** **43.38%**\n  2. **Euro (€EUR):** **29.31%**\n  3. **Chinese Renminbi (¥CNY):** **12.28%** (Included in 2016)\n  4. **Japanese Yen (¥JPY):** **7.59%**\n  5. **British Pound (£GBP):** **7.44%**"
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📜 3. World Trade Organization (WTO) & Agreement on Agriculture (AoA)"
      },
      {
        type: "table",
        caption: "WTO Agreement on Agriculture (AoA) Subsidies Boxes",
        headers: ["Subsidies Box", "Definition & Nature", "Trade Distortion Level", "Permissible Limits / Caps"],
        rows: [
          ["Green Box", "Subsidies that cause zero or minimal trade distortion (Agricultural R&D, pest control, disaster relief, infrastructure, direct decoupled income support).", "Non-distorting", "**No Limit / Uncapped**."],
          ["Blue Box", "Direct government payments to farmers under production-limiting programs (subsidies linked to fixed acreage or yield limits).", "Minimally distorting", "**No Limit** (if tied to production limiting conditions)."],
          ["Amber Box", "Subsidies that directly distort trade and production (Price supports like MSP, electricity/fertilizer/water subsidies).", "Highly trade distorting", "**Subject to De-minimis limits**: 5% of agricultural production value for Developed countries, **10% for Developing countries (India)**. Protected by Peace Clause."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🏦 4. New Multilateral Development Banks (MDBs)"
      },
      {
        type: "bullet_list",
        items: [
          "**Asian Development Bank (ADB):** Founded in 1966; HQ in **Manila, Philippines**. Japan and USA are largest shareholders (15.6% each); India is 4th largest shareholder.",
          "**New Development Bank (NDB / BRICS Bank):** Established in 2014 (Fortaleza Declaration); HQ in **Shanghai, China**. Equal voting rights initially among 5 BRICS nations.",
          "**Asian Infrastructure Investment Bank (AIIB):** Began operations in 2016; HQ in **Beijing, China**. China is largest shareholder (approx 26.6% voting power); **India is the 2nd largest shareholder (approx 7.6% voting power)**."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 7:\n1. **World Bank Arm India is NOT a member of:** **ICSID (International Centre for Settlement of Investment Disputes)**.\n2. **Currencies in SDR Basket:** 5 Currencies — **USD, EUR, CNY, JPY, GBP** (Highest: USD; Lowest: GBP).\n3. **De-Minimis Limit for Amber Box:** **10%** of agricultural output value for developing nations like India (5% for developed nations)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit7", "world-bank", "imf", "sdr", "wto", "aoa", "amber-box", "icsid", "aiib"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module A - Indian Economic Architecture)"
    }
  }
];

// Write physical corpus files and update note registry
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
let startNoteNum = 556;

moduleAUnits.forEach((unit, idx) => {
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
console.log(`🎉 Ingested all remaining Module A Units (Units 2 to 7) into note-registry.json (#556 to #561)!`);
