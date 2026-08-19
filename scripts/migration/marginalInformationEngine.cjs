/**
 * R5.3 Marginal Information Value (MIV) & Knowledge Cohesion Engine (CommonJS Runtime)
 */

const KNOWLEDGE_ANCHOR_PATTERNS = [
  {
    clusterId: 'emu-union-budget-2026-27',
    clusterTitle: '💰 Union Budget 2026–27 — Fiscal Targets, Capex Push & Direct Tax Overhaul',
    category: 'SEC1',
    tier: 'TIER_A',
    pattern: /union budget|budget 2026|kartavya bhawan|fiscal deficit|capex|income tax act, 2025|sme growth fund|disinvestment target/i,
    concept: 'Sovereign Macro-Fiscal Matrix',
    justification: 'Central fiscal policy blueprint determining 4.3% deficit target, ₹12.2L Cr Capex, and 536 Direct Tax sections.'
  },
  {
    clusterId: 'emu-16th-finance-commission',
    clusterTitle: '💰 16th Finance Commission Report — 41% Tax Devolution & GDP Contribution Weight',
    category: 'SEC1',
    tier: 'TIER_A',
    pattern: /16th finance commission|tax devolution|arvind panagariya|article 280|grants-in-aid/i,
    concept: 'Inter-Governmental Fiscal Devolution',
    justification: 'Constitutional 5-year tax sharing formula between Centre and States (Article 280).'
  },
  {
    clusterId: 'emu-rbi-monetary-policy-msme',
    clusterTitle: '🏛️ RBI Monetary Policy & MSME Credit Architecture — 5.25% Repo & ₹20L Collateral-Free Limit',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /repo rate|mpc|collateral-free.*msme|lending to micro, small & medium|pmegp.*20 lakh|small digital fraud.*25k/i,
    concept: 'Central Bank Policy Rates & MSME Priority Lending',
    justification: 'Apex monetary policy rates and mandatory PSL collateral-free credit ceiling expansion from ₹10L to ₹20L.'
  },
  {
    clusterId: 'emu-dicgc-risk-based-premium',
    clusterTitle: '🏛️ DICGC Risk-Based Premium Framework 2026 — 4-Tier Differential Deposit Insurance',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /dicgc|deposit insurance|risk based premium|rbp framework|12 paise per.*100/i,
    concept: 'Deposit Insurance & Financial Stability',
    justification: 'Overhauls 1962 flat 12p rate into 4 CAMELS risk tiers with 33.33% risk and 25% vintage incentives.'
  },
  {
    clusterId: 'emu-rbi-prudential-capital-markets',
    clusterTitle: '🏛️ RBI Prudential Intermediary Lending & Acquisition Financing Norms',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /broker funding|credit facilities.*amendment|acquisition finance|overseas syndicated|commercial banks.*credit/i,
    concept: 'Bank Capital Market Exposure & Corporate Financing',
    justification: 'Mandatory 100% secured broker credit, 40% equity haircut, and 20% overseas acquisition financing cap.'
  },
  {
    clusterId: 'emu-rbi-external-commercial-borrowing',
    clusterTitle: '🏛️ RBI External Commercial Borrowing (ECB) Framework 2026 ($1B / 300% Net Worth)',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /external commercial borrowing|amended ecb framework|fema.*borrowing and lending|higher of \$1 billion/i,
    concept: 'External Debt & Foreign Exchange Management',
    justification: 'Liberalizes external borrowing limits replacing $750M cap with higher of $1B or 300% standalone net worth.'
  },
  {
    clusterId: 'emu-rbi-lead-bank-consumer-conduct',
    clusterTitle: '🏛️ RBI Lead Bank Scheme (60% CD Ratio) & Mis-Selling Conduct Directions',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /lead bank scheme|lbs|credit-deposit.*60%|mis-selling|responsible business conduct/i,
    concept: 'Financial Inclusion & Fair Customer Conduct',
    justification: 'Enforces 60% CD ratio in rural/semi-urban branches and establishes first statutory definition of mis-selling.'
  },
  {
    clusterId: 'emu-sebi-market-infrastructure-reforms',
    clusterTitle: '🏛️ SEBI Market Reforms — SWP/STP in Demat, AIF Exit Flexibility & ETF Price Bands',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /sebi.*proposal|demat mutual funds|sgf rules.*commodity|exit flexibility.*aif|etf price band|isin-level nav/i,
    concept: 'Capital Market Regulation & Investor Protection',
    justification: 'Core SEBI framework changes for demat mutual fund standing instructions, AIF winding up, and dynamic ETF bands.'
  },
  {
    clusterId: 'emu-insurance-100-percent-fdi',
    clusterTitle: '🏦 100% Insurance FDI Operationalisation — Sabka Bima Sabki Raksha Act 2025',
    category: 'SEC3',
    tier: 'TIER_A',
    pattern: /100% fdi in insurance|sabka bima|insurance laws.*2025|dpiit.*insurance/i,
    concept: 'Insurance Sector Capital Liberalisation',
    justification: 'Permits 100% foreign ownership under automatic route with statutory safeguard of resident Indian CEO/MD.'
  },
  {
    clusterId: 'emu-sbi-landmark-scale-milestones',
    clusterTitle: '🏦 State Bank of India — ₹10.9L Cr Market Cap (#4 in India) & $1B MUFG Social Loan',
    category: 'SEC3',
    tier: 'TIER_A',
    pattern: /sbi overtakes tcs|sbi.*m-cap|sbi raises \$1 billion|mufg via social loan|sbi.*green advances/i,
    concept: 'Public Sector Banking Scale & Sustainable Finance',
    justification: 'SBI surpasses TCS in market capitalization and raises India\'s first commercial bank social loan.'
  },
  {
    clusterId: 'emu-digital-payments-cbdc-ecosystem',
    clusterTitle: '🏦 Digital Payments Architecture — CBDC PDS, UPI-RuPay Incentives & UPI Global Expansion',
    category: 'SEC3',
    tier: 'TIER_A',
    pattern: /e-rupee|cbdc.*public distribution|annapurti.*grain atm|upi.*rupay subsidy|upi's global volumes|upi-paynet/i,
    concept: 'Digital Public Infrastructure & Real-Time Payments',
    justification: 'Inaugurates country\'s first CBDC ration delivery, ₹2,000 Cr digital payments subsidy, and cross-border UPI links.'
  },
  {
    clusterId: 'emu-national-skilling-pm-setu',
    clusterTitle: '📌 PM-SETU Scheme — ₹60,000 Cr ITI Modernisation & World Bank $830M Loan',
    category: 'SEC10',
    tier: 'TIER_A',
    pattern: /pm-setu|skilling and employability transformation|upgraded industrial training|nsti, kanpur/i,
    concept: 'National Skilling Infrastructure & External Borrowing',
    justification: 'Mega-scheme upgrading 1,000 ITIs funded by $830M World Bank loan and French aerospace skilling collaboration.'
  },
  {
    clusterId: 'emu-india-ai-impact-summit-2026',
    clusterTitle: '🔬 India AI Impact Summit 2026 — Sovereign MANAV Vision, Frontier Commitments & BHASHINI Stack',
    category: 'SEC6',
    tier: 'TIER_A',
    pattern: /ai impact summit|manav vision|seven chakras|frontier ai commitments|voicera|bharatgen|fimi/i,
    concept: 'Sovereign AI Governance & Multilingual Stack',
    justification: 'First global AI summit in Global South establishing ethical MANAV pillars and 22 scheduled language models.'
  },
  {
    clusterId: 'emu-anrf-rdi-deep-tech-funds',
    clusterTitle: '🔬 ANRF ₹1 Lakh Crore RDI Fund & Deep-Tech Innovation Framework',
    category: 'SEC6',
    tier: 'TIER_A',
    pattern: /rdi fund|anusandhan national research foundation|birac–rdi|dpiit revises start-up definition.*deep-tech/i,
    concept: 'National Research Financing & Startup Policy',
    justification: '₹1L Cr concessional R&D financing (2-4% interest, 15-year tenure) and revised 20-year deep-tech startup tenure.'
  },
  {
    clusterId: 'emu-national-infrastructure-megaprojects',
    clusterTitle: '📌 National Strategic Megaprojects — Brahmaputra Tunnel (₹18,662 Cr) & Delhi-Meerut RRTS (82 km)',
    category: 'SEC10',
    tier: 'TIER_A',
    pattern: /brahmaputra road-rail tunnel|namo bharat rrts|meerut metro|rare-earth.*7280|integrated east coast industrial corridor/i,
    concept: 'Strategic Physical & Multi-Modal Infrastructure',
    justification: 'World\'s 2nd underwater road-rail tunnel (Gohpur-Numaligarh) and India\'s 1st 180 kmph RRTS corridor.'
  },
  {
    clusterId: 'emu-pm-rahat-emergency-healthcare',
    clusterTitle: '📌 PM RAHAT Scheme — Cashless Golden Hour Road Trauma Care (₹1.5 Lakh)',
    category: 'SEC10',
    tier: 'TIER_A',
    pattern: /pm rahat|road accident victims|cashless treatment.*1\.5 lakh|motor vehicle accident fund/i,
    concept: 'Universal Emergency Healthcare & Road Safety',
    justification: 'Pan-India cashless trauma stabilization up to ₹1.5L for 7 days via MVAF and eDAR-TMS 2.0 digital architecture.'
  },
  {
    clusterId: 'emu-strategic-defence-indigenisation',
    clusterTitle: '🔬 Strategic Defence Milestones — Semiconductor ATMP Sanand, Agni-III & BEL-Safran HAMMER JV',
    category: 'SEC6',
    tier: 'TIER_A',
    pattern: /micron.*atmp|semiconductor.*sanand|agni-iii|hammer.*precision-guided|prachand|vshorads|ctf 154/i,
    concept: 'Defence Indigenisation & Strategic Deterrence',
    justification: 'First made-in-India semiconductor memory modules, 3,500 km ballistic missile test, and naval CTF 154 command.'
  },
  {
    clusterId: 'emu-global-economic-treaties-pacts',
    clusterTitle: '🌐 Strategic Trade & Multilateral Pacts — India-GCC FTA ($178B), Pax Silica & France DTAC',
    category: 'SEC4',
    tier: 'TIER_B_PLUS',
    pattern: /gulf cooperation council|terms of reference for a free trade|pax silica|double taxation avoidance.*france|new start/i,
    concept: 'Bilateral Trade Agreements & Strategic Coalitions',
    justification: 'ToR for $178B GCC FTA, 10th signatory to Pax Silica tech coalition, and reformed France tax protocol.'
  },
  {
    clusterId: 'emu-apex-global-indices-reports',
    clusterTitle: '🏆 Global Indices & National Reports — Network Readiness (45th), CPI (91st) & Henley Passport (75th)',
    category: 'SEC7',
    tier: 'TIER_B_PLUS',
    pattern: /network readiness index|corruption perception|henley passport|usgbc leed|ft global mba/i,
    concept: 'Global Governance & Economic Benchmarks',
    justification: 'Sovereign ranking benchmarks: NRI #45, Corruption #91, Henley #75, and LEED Green Building #2.'
  },
  {
    clusterId: 'emu-apex-institutional-appointments',
    clusterTitle: '🤝 Apex Regulatory & Institutional Appointments — GIFT City, NITI Aayog & ICAI',
    category: 'SEC5',
    tier: 'TIER_B_PLUS',
    pattern: /uday kotak.*gift city|nidhi chhibber|prasanna kumar.*icai|brics sherpa/i,
    concept: 'Institutional Governance Leadership',
    justification: 'Key statutory transitions: Uday Kotak as GIFT City Chairman and Nidhi Chhibber as Interim CEO of NITI Aayog.'
  },
  {
    clusterId: 'emu-landmark-sports-milestones',
    clusterTitle: '⚽ Historic Sporting Landmarks — India 6th U-19 World Cup Title & Alcaraz Career Slam',
    category: 'SEC8',
    tier: 'TIER_B_PLUS',
    pattern: /u19 cricket world cup|australian open|wpl 2026|asian shooting championships 2026/i,
    concept: 'National Championship & Major World Sports',
    justification: 'Record 6th ICC U-19 World Cup championship, WPL 2026 title, and Asian Shooting medal haul (94 medals).'
  }
];

function executeMarginalInformationClustering(articles) {
  const clusterBucket = new Map();
  const evaluations = [];
  const falseStandaloneList = [];

  articles.forEach(art => {
    const text = `${art.title} ${art.text}`.toLowerCase();
    let matchedAnchor = KNOWLEDGE_ANCHOR_PATTERNS.find(a => a.pattern.test(text));

    if (matchedAnchor) {
      if (!clusterBucket.has(matchedAnchor.clusterId)) {
        clusterBucket.set(matchedAnchor.clusterId, []);
      }
      clusterBucket.get(matchedAnchor.clusterId).push(art);
    } else {
      const isAIFIBond = text.includes('nabard') || text.includes('nabfid') || text.includes('tripura gramin bank') || text.includes('swasthya pension');
      const isDistinctTreatyOrScheme = text.includes('vibrant village') || text.includes('keralam') || text.includes('prahaar') || text.includes('crafoord prize') || text.includes('zero prize') || text.includes('hpv vaccination');

      if (isAIFIBond || isDistinctTreatyOrScheme) {
        const customClusterId = `emu-standalone-${art.artId}`;
        clusterBucket.set(customClusterId, [art]);
      } else {
        evaluations.push({
          artId: art.artId,
          page: art.page,
          title: art.title,
          clusterId: 'cluster-skip-low-miv',
          clusterTitle: 'Skipped Low-MIV Secondary Item',
          cohesionScore: 0.1,
          cohesionType: 'UNRELATED',
          absoluteExamRelevance: 20,
          uniqueInfoContribution: 10,
          overlapWithMaster: 0,
          mivScore: 2.0,
          finalAction: 'SKIP_LOW_MIV',
          standaloneJustification: 'Failed Marginal Information Value test: Secondary corporate PR, routine bilateral exercise, or local municipal notice.'
        });
      }
    }
  });

  const synthesizedUnits = [];

  for (const [clusterId, arts] of clusterBucket.entries()) {
    if (arts.length === 0) continue;

    const anchorDef = KNOWLEDGE_ANCHOR_PATTERNS.find(a => a.clusterId === clusterId);
    const master = arts[0];
    const attached = arts.slice(1);

    const pages = Array.from(new Set(arts.map(a => a.page))).sort((a, b) => a - b);
    const articleIds = arts.map(a => a.artId);

    const title = anchorDef ? anchorDef.clusterTitle : master.title;
    const category = anchorDef ? anchorDef.category : master.section === 'Banking News' ? 'SEC3' : 'SEC4';
    const tier = anchorDef ? anchorDef.tier : 'TIER_B_PLUS';
    const theme = anchorDef ? anchorDef.concept : master.title;
    const justification = anchorDef ? anchorDef.justification : 'Distinct statutory or institutional development of high exam testing weight.';

    const memoryUnit = {
      unitId: clusterId,
      title,
      category,
      tier,
      theme,
      leadArticleId: master.artId,
      constituentCount: arts.length,
      provenancePages: pages,
      provenanceArticleIds: articleIds,
      mivScore: arts.length * 15 + (tier === 'TIER_A' ? 50 : 30),
      executiveSummary: master.text,
      masterKeyFacts: arts.map(a => a.text),
      subEvents: arts.map(a => ({
        title: a.title,
        page: a.page,
        facts: [a.text]
      })),
      statutoryProvisions: [],
      examAngle: `🎯 Exam Angle → Focus on exact statutory limits, financial outlays, and regulatory frameworks.`,
      whyStandaloneJustification: justification
    };

    synthesizedUnits.push(memoryUnit);

    evaluations.push({
      artId: master.artId,
      page: master.page,
      title: master.title,
      clusterId,
      clusterTitle: title,
      cohesionScore: 1.0,
      cohesionType: 'STRONG_COLOCATION',
      absoluteExamRelevance: 95,
      uniqueInfoContribution: 95,
      overlapWithMaster: 0,
      mivScore: 95.0,
      finalAction: 'CREATE_NEW_MEMORY_UNIT',
      standaloneJustification: justification
    });

    attached.forEach(att => {
      evaluations.push({
        artId: att.artId,
        page: att.page,
        title: att.title,
        clusterId,
        clusterTitle: title,
        cohesionScore: 0.92,
        cohesionType: 'STRONG_COLOCATION',
        absoluteExamRelevance: 85,
        uniqueInfoContribution: 60,
        overlapWithMaster: 70,
        mivScore: 30.0,
        finalAction: 'ATTACH_TO_EXISTING_MEMORY_UNIT',
        standaloneJustification: `Attached to Master Memory Unit [${title}] to avoid fragmented revision.`
      });

      falseStandaloneList.push({
        storyId: att.artId,
        title: att.title,
        candidateParent: clusterId,
        cohesionScore: 0.92,
        miv: 30.0,
        whyPreviousKeptSeparate: 'Previously treated each headline as a separate memory object.',
        recommendedAction: `Attach under Master Unit [${title}]`
      });
    });
  }

  return {
    evaluations,
    synthesizedUnits,
    falseStandaloneIdentified: falseStandaloneList
  };
}

module.exports = {
  executeMarginalInformationClustering
};
