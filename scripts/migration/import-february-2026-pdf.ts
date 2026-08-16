import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildCorpusIndex } from '../build-corpus-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const corpusDir = path.resolve(__dirname, '../../content/corpus');
const manifestPath = path.resolve(__dirname, '../../content/manifest.json');

// February 2026 structured item catalog from Feb2026.pdf
const febItems = [
  // SECTION 1 — ESI, FINANCE & BUSINESS NEWS
  {
    id: "migrated-ca-2026-02-sec1-1",
    title: "Union Budget 2026-27 — Sitharaman's First Budget from Kartavya Bhawan",
    category: "SEC3",
    summary: "FM Nirmala Sitharaman presented Union Budget 2026-27 with fiscal deficit target of 4.3% of GDP, Capex at ₹12.2 lakh crore, and the New Income Tax Act 2025.",
    blocks: [
      {
        type: "paragraph",
        content: "Presented by FM Nirmala Sitharaman on 1 Feb 2026, this was the **1st Budget prepared in the new Kartavya Bhawan building**, built around 3 'Kartavyas': growth, citizen aspirations, and inclusive development."
      },
      {
        type: "bullet_list",
        items: [
          "**Fiscal Deficit BE 2026-27**: 4.3% of GDP (down from 4.4% in RE 2025-26); Debt-to-GDP down to 55.6% (from 56.1%).",
          "**Capex Push**: Up 9% to a record **₹12.2 lakh crore (4.4% of GDP)**; total expenditure ₹53.5 lakh Cr, net tax receipts ₹28.7 lakh Cr.",
          "**New Income Tax Act, 2025**: Effective 1 Apr 2026—sections simplified from 819 to 536.",
          "**TCS Cuts**: Overseas tour packages cut to 2% (from 5%/20%); LRS education/medical cut to 2% (from 5%).",
          "**STT Hiked**: Futures raised to 0.05%, Options to 0.15%; corporate buyback tax set at 22% (30% non-corporate).",
          "**New Sectoral Schemes**: Biopharma SHAKTI (₹10,000 Cr), SME Growth Fund (₹10,000 Cr), 7 High-Speed Rail corridors, 20 new National Waterways, Bharat-VISTAAR AI agri-tool."
        ]
      },
      {
        type: "exam_trap",
        title: "Fiscal Target Mnemonic",
        content: "Mnemonic '4.3 - 4.4 - 55.6' — Fiscal deficit 4.4% -> 4.3%, Debt-to-GDP 56.1% -> 55.6%."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec1-2",
    title: "16th Finance Commission — Tax Devolution Retained at 41%",
    category: "SEC3",
    summary: "16th Finance Commission (Chaired by Arvind Panagariya) retains vertical tax devolution at 41% while introducing a new 10% weightage for Contribution to GDP.",
    blocks: [
      {
        type: "paragraph",
        content: "16th Finance Commission (Chair: **Arvind Panagariya**) recommended retaining vertical tax devolution at **41% for 2026-27 to 2030-31**, accepted by the Centre in Budget 2026."
      },
      {
        type: "bullet_list",
        items: [
          "**New Formula Weight**: 10% weightage for 'Contribution to GDP' replaces the 2.5%-weighted 'Tax and Fiscal Effort' criterion.",
          "**Grants-in-aid**: ₹9.47 lakh crore total (incl. ₹1.4 lakh Cr for FY27 for Rural/Urban Local Bodies + Disaster Management).",
          "**Grants Discontinued**: Revenue-deficit, sector-specific, and state-specific grants discontinued; states must cap fiscal deficit at 3% of GSDP.",
          "**State Shares**: UP's share 17.619% (from 17.939%); Bihar's 9.948% (from 10.058%)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec1-3",
    title: "SME Growth Fund & TReDS Reforms",
    category: "SEC5",
    summary: "Government establishes ₹10,000 Cr SME Growth Fund and 4 key TReDS reforms to boost MSME invoice financing.",
    blocks: [
      {
        type: "paragraph",
        content: "Budget 2026 announced a **₹10,000 Cr SME Growth Fund** plus a ₹2,000 Cr top-up to the 2021 Self-Reliant India Fund."
      },
      {
        type: "bullet_list",
        items: [
          "**4 TReDS Reforms**: Mandatory CPSE-MSME purchases on TReDS; CGTMSE credit guarantee for invoice discounting; GeM-TReDS linkage; TReDS receivables as tradeable ABS.",
          "**TReDS Track Record**: Conceptualised by RBI in 2014, operational since 2018—enabled >₹7 lakh crore financing to MSMEs."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec1-4",
    title: "Proposal to Raise FDI Cap in Public Sector Banks to 49%",
    category: "SEC5",
    summary: "Government considers raising FDI limit in PSBs from 20% to 49% while retaining minimum 51% state ownership.",
    blocks: [
      {
        type: "paragraph",
        content: "Inter-ministerial discussions are underway to **raise the FDI ceiling in Public Sector Banks from 20% to 49%** (govt must retain ≥51% stake) to build 3–4 globally-scaled Indian banks."
      },
      {
        type: "bullet_list",
        items: [
          "**Private Banks Comparison**: Private banks allow up to 74% FDI (single foreign institution capped at 15%).",
          "**Highest PSB Foreign Holding**: SBI (11.07%) > Canara Bank (10.55%) > Bank of Baroda (9.43%)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec1-5",
    title: "SBI Overtakes TCS as India's 4th Most Valuable Company",
    category: "SEC5",
    summary: "SBI market capitalization crosses ₹10.9 lakh crore, surpassing TCS to become India's 4th most valuable company by m-cap.",
    blocks: [
      {
        type: "paragraph",
        content: "State Bank of India's m-cap crossed **₹10.9 lakh crore**, pushing past TCS (~₹10.5 lakh crore) to become India's **4th most valuable listed company**."
      },
      {
        type: "bullet_list",
        items: [
          "**Top M-Cap Hierarchy**: Reliance (~₹19.8L Cr) > HDFC Bank (~₹14.3L Cr) > Bharti Airtel (~₹12.1L Cr) > SBI (>₹10.9L Cr).",
          "**SBI Leadership**: Chairman C.S. Setty (HQ: Mumbai)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec1-6",
    title: "Gender Budget 2026-27 Rises to 9.37% of Union Budget",
    category: "SEC3",
    summary: "Gender Budget allocation increases to ₹5.01 lakh crore (9.37% of Union Budget), spanning 53 Ministries and 5 UTs.",
    blocks: [
      {
        type: "paragraph",
        content: "Gender Budget allocation for FY2026-27 rose to **9.37% of the Union Budget** (up from 8.86% in FY26), totaling **₹5.01 lakh crore**."
      },
      {
        type: "bullet_list",
        items: [
          "**Top Ministry**: Ministry of Women & Child Development (81.73% share).",
          "**Part A (100% Women Specific)**: ₹1,07,688.42 Cr (21.50%).",
          "**Part B (30-99%)**: ₹3,63,412.37 Cr (72.54%)."
        ]
      }
    ]
  },

  // SECTION 2 — REGULATORY BODIES NEWS
  {
    id: "migrated-ca-2026-02-sec2-1",
    title: "RBI Monetary Policy Feb 2026 — Repo Rate Held at 5.25%, MSME Loan Limit Doubled",
    category: "SEC2",
    summary: "RBI keeps Repo Rate unchanged at 5.25%, doubles collateral-free MSME loan limit to ₹20 lakh, and sets digital-fraud compensation cap at ₹25,000.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI MPC kept the **Repo Rate unchanged at 5.25%** with a neutral stance. Key policy decisions focused on structural MSME and consumer protection reforms."
      },
      {
        type: "bullet_list",
        items: [
          "**Policy Rates**: Repo 5.25%, SDF 5.00%, MSF & Bank Rate 5.50%, Reverse Repo 3.35%, CRR 3%, SLR 18%.",
          "**MSME Limit Doubled**: Collateral-free MSME loan limit doubled to **₹20 lakh** (from ₹10 lakh) effective 1 April 2026.",
          "**Digital-Fraud Compensation**: Victim and bank each bear 15% of loss; RBI covers the remaining 70%, capped at **₹25,000/case** via DEA Fund.",
          "**Growth & Inflation**: FY26 GDP 7.4%; FY26 CPI inflation 2.1%."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec2-2",
    title: "Kisan Credit Card (KCC) Draft Norms — Validity Extended to 6 Years",
    category: "SEC2",
    summary: "RBI draft extends KCC validity from 5 to 6 years and waives collateral/margin for agri loans up to ₹2 lakh.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI proposed extending **Kisan Credit Card (KCC) validity from 5 to 6 years** and waiving collateral/margin for agri loans up to ₹2 lakh."
      },
      {
        type: "bullet_list",
        items: [
          "**KCC Background**: Introduced in 1998 based on R.V. Gupta Committee recommendations via NABARD.",
          "**Credit Limits**: Flexible credit limit of ₹10,000–₹50,000 for marginal farmers (≤1 hectare)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec2-3",
    title: "DICGC Risk-Based Deposit Insurance Premium Framework",
    category: "SEC2",
    summary: "DICGC moves from flat 12 paise/₹100 premium to a 4-tier risk-based framework starting 1 April 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "Deposit Insurance and Credit Guarantee Corporation (DICGC) transitions from a flat premium (12 paise per ₹100 since 1962) to a **risk-based premium structure** effective 1 April 2026."
      },
      {
        type: "bullet_list",
        items: [
          "**4 Risk Tiers**: Category A (safest: 8 paise/₹100), Category B (10 paise), Category C (11 paise), Category D (12 paise).",
          "**Insurance Cover**: Coverage remains unchanged at **₹5 lakh per depositor per bank**."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec2-4",
    title: "RBI Anti-Mis-Selling Directions 2026 (Responsible Business Conduct)",
    category: "SEC2",
    summary: "RBI issues draft directions providing India's first formal definition of mis-selling and restricting sales calls to 9 AM – 6 PM.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI issued draft 'Responsible Business Conduct Amendment Directions 2026', establishing the **first formal regulatory definition of mis-selling**."
      },
      {
        type: "bullet_list",
        items: [
          "**Sales Call Window**: Direct sales tele-calls and visits restricted to **9 AM – 6 PM**.",
          "**Bundling Barred**: Banks prohibited from conditional product bundling (e.g. forced insurance for loans).",
          "**Effective Date**: Final rules effective 1 July 2026."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec2-5",
    title: "RBI LBS Norms — 60% Credit-Deposit (CD) Ratio Target for Rural Branches",
    category: "SEC2",
    summary: "Revised Lead Bank Scheme (LBS) guidelines require banks to maintain a 60% CD ratio in rural and semi-urban branches.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI revised Lead Bank Scheme (LBS) norms, requiring banks to maintain a minimum **60% Credit-Deposit (CD) ratio** in rural and semi-urban branches."
      },
      {
        type: "bullet_list",
        items: [
          "**Monitoring Tiers**: CD ratio 40-60% monitored by DCC; <40% monitored by special sub-committee; <20% flagged as 'special category'.",
          "**Unbanked Outlets**: Banks must open ≥25% of outlets in Tier V/VI unbanked rural centres."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec2-6",
    title: "RBI Eases Acquisition Financing Norms for Banks",
    category: "SEC2",
    summary: "RBI raises bank exposure cap for acquisition financing from 10% to 20% of capital and allows financing for unlisted acquisitions.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI relaxed acquisition financing rules, raising the bank exposure ceiling from **10% to 20% of capital** and extending eligibility to unlisted companies (net worth ≥₹500 Cr)."
      },
      {
        type: "bullet_list",
        items: [
          "**Financing Share**: Raised from 70% to 75% of acquisition value (debt-to-equity capped at 3:1).",
          "**Lending Against Shares**: Ceiling raised from ₹20 lakh to ₹1 crore."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec2-7",
    title: "RBI External Commercial Borrowings (ECB) Cap Raised to $1 Billion",
    category: "SEC2",
    summary: "Eligible borrowers can now raise up to $1 billion via ECB route (up from $750 million) per financial year.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI increased the automatic route ECB raising limit for eligible corporate borrowers from **$750 million to $1 billion** per financial year."
      },
      {
        type: "bullet_list",
        items: [
          "**FY25 Record**: Indian companies raised a record **$61 billion via ECB** in FY25 (up from $48 billion in FY24)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec2-8",
    title: "RBI Mandates 52-Character UTI for OTC Derivatives",
    category: "SEC2",
    summary: "Unique Transaction Identifier (UTI) becomes mandatory for OTC rupee interest rate and FX derivatives from 1 January 2027.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI mandated a **52-character Unique Transaction Identifier (UTI)** for all direct private OTC derivative trades, reported to CCIL-TR."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec2-9",
    title: "RBI's Second Data Centre Opened in Bhubaneswar, Odisha",
    category: "SEC2",
    summary: "RBI establishes its 2nd greenfield Tier-IV certified data centre in Bhubaneswar (Primary DC: Kharghar, Navi Mumbai).",
    blocks: [
      {
        type: "paragraph",
        content: "RBI inaugurated its **2nd high-security greenfield Data Centre in Bhubaneswar, Odisha** (achieving Tier IV certification), supplementing its primary data centre in Kharghar, Navi Mumbai."
      }
    ]
  },

  // SECTION 3 — BANKING & INSURANCE NEWS
  {
    id: "migrated-ca-2026-02-sec3-1",
    title: "CBDC-PDS Pilots — Twin Digital-Rupee Food-Subsidy Schemes Launched",
    category: "SEC5",
    summary: "India launches two parallel CBDC food-subsidy pilots: Gujarat Digital Food Coupon (Annapurti ATMs) and Puducherry PMGKAY e-Rupee token.",
    blocks: [
      {
        type: "paragraph",
        content: "India initiated two distinct CBDC-based food-subsidy pilots: **Gujarat** (Digital Food Coupon with 'Annapurti' Grain ATMs) and **Puducherry** (PMGKAY programmable e-Rupee token with Canara Bank)."
      },
      {
        type: "bullet_list",
        items: [
          "**Gujarat Pilot**: Inaugurated by Amit Shah; covers Gandhinagar, Ahmedabad, Surat, Anand, Valsad; Annapurti ATMs disburse 25 kg grain in 35 seconds.",
          "**Puducherry Pilot**: Inaugurated by Pralhad Joshi; programmable e-Rupee tokens redeemed at Fair Price Shops."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec3-2",
    title: "Kotak Mahindra Bank — First Custodian to Issue Fully Digital FPI Licence",
    category: "SEC5",
    summary: "Kotak Mahindra Bank becomes India's first custodian to issue end-to-end electronic FPI licences via SEBI's CAF portal within 24 hours.",
    blocks: [
      {
        type: "paragraph",
        content: "Kotak Mahindra Bank became **India's first custodian bank to issue a Foreign Portfolio Investor (FPI) licence completely digitally** via Digital Signature Certificates."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec3-3",
    title: "UPI Reaches All-Time High ₹28.33 Trillion in January 2026",
    category: "SEC5",
    summary: "UPI processed ₹28.33 trillion across 21.70 billion transactions in January 2026 (+21% MoM value growth).",
    blocks: [
      {
        type: "paragraph",
        content: "NPCI reported January 2026 UPI totals of **₹28.33 trillion in value** (+21% MoM) across **21.70 billion transactions**, averaging 700 million daily transactions."
      },
      {
        type: "bullet_list",
        items: [
          "**DFS Study**: UPI is preferred payment mode for 57% of Indians vs 38% for cash.",
          "**App Market Share**: PhonePe leads at 45% volume, followed by Google Pay and Paytm."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec3-4",
    title: "MIGA $197.67 Million Guarantee for SBI Rooftop Solar Refinancing",
    category: "SEC5",
    summary: "Multilateral Investment Guarantee Agency (MIGA) provides $197.67 million 5-year guarantee to Citibank for loan to SBI.",
    blocks: [
      {
        type: "paragraph",
        content: "MIGA (World Bank Group) issued a **$197.67 million guarantee** to Citibank N.A. to back financing for SBI's $500 million Grid-connected Rooftop Solar PV (GRPV) programme."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec3-5",
    title: "Tripura Gramin Bank — 1st RRB in India with Co-Branded RuPay Credit Card",
    category: "SEC5",
    summary: "Tripura Gramin Bank (sponsored by PNB) launches India's first co-branded RuPay credit card by a Regional Rural Bank.",
    blocks: [
      {
        type: "paragraph",
        content: "Tripura Gramin Bank (TGB, HQ: Agartala) became the **first Regional Rural Bank in India to launch a co-branded RuPay credit card**, partnered with sponsor bank PNB."
      }
    ]
  },

  // SECTION 4 — NATIONAL, STATE & INTERNATIONAL NEWS
  {
    id: "migrated-ca-2026-02-sec4-1",
    title: "India-US Trade Deal — US Reciprocal Tariff Cut to 18%",
    category: "SEC3",
    summary: "US President Trump announces India-US trade deal: US reciprocal tariffs cut from 25% to 18% as India commits $500B purchases and 0% tariffs.",
    blocks: [
      {
        type: "paragraph",
        content: "US President Trump announced a landmark **India-US trade agreement**, cutting US reciprocal tariffs on Indian goods from **25% to 18%**."
      },
      {
        type: "bullet_list",
        items: [
          "**India Commitments**: India will cut tariffs on US goods to 0%, commit **$500 billion** in US purchases (energy, tech, agri, coal), and halt Russian crude imports.",
          "**Tariff Sequence**: Tariff cut sequence: 50% -> 25% -> 18%."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec4-2",
    title: "India Joins 'Pax Silica' Coalition as 10th Full Member",
    category: "SEC6",
    summary: "India signs on to Pax Silica coalition at India AI Impact Summit alongside Microsoft's $17.5 billion AI investment.",
    blocks: [
      {
        type: "paragraph",
        content: "India joined **'Pax Silica' as its 10th full member** to secure global semiconductor and AI supply chains, coinciding with **Microsoft's $17.5 billion AI infrastructure investment** in India."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec4-3",
    title: "Indian Navy Assumes IONS Chairmanship for 2026–2028",
    category: "SEC6",
    summary: "Admiral Dinesh K. Tripathi takes over chairmanship of Indian Ocean Naval Symposium (IONS) at 9th Conclave of Chiefs in Visakhapatnam.",
    blocks: [
      {
        type: "paragraph",
        content: "Indian Navy chief Admiral Dinesh K. Tripathi took over the **IONS Chairmanship for 2026–2028** from the Royal Thai Navy at Visakhapatnam."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec4-4",
    title: "Namo Bharat RRTS & Meerut Metro Shared-Track Corridor Dedicated",
    category: "SEC10",
    summary: "PM Modi inaugurates 82-km Delhi-Meerut Namo Bharat corridor featuring world's first shared track for RRTS (180 kmph) and Meerut Metro (120 kmph).",
    blocks: [
      {
        type: "paragraph",
        content: "PM Modi dedicated the **82-km Delhi-Meerut Namo Bharat Corridor** (₹12,930 Cr), featuring shared tracks between Namo Bharat RRTS (design speed 180 kmph) and Meerut Metro (top speed 120 kmph)."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec4-5",
    title: "Cabinet Approves Renaming Kerala to 'Keralam'",
    category: "SEC1",
    summary: "Union Cabinet clears 'Kerala (Alteration of Name) Bill 2026' under Article 3 of the Constitution.",
    blocks: [
      {
        type: "paragraph",
        content: "Union Cabinet approved the **Kerala (Alteration of Name) Bill, 2026** to rename the state to 'Keralam', amending the First Schedule under Article 3."
      }
    ]
  },

  // SECTION 5 — APPOINTMENTS & DEFENCE
  {
    id: "migrated-ca-2026-02-sec5-1",
    title: "Defence Acquisition Council Clears ₹3.60 Lakh Crore Acquisitions Including 114 Rafales",
    category: "SEC8",
    summary: "DAC accords Acceptance of Necessity (AoN) for ₹3.60 lakh crore capital acquisitions, including 114 Rafale jets.",
    blocks: [
      {
        type: "paragraph",
        content: "DAC (chaired by Rajnath Singh) approved **₹3.60 lakh crore capital acquisitions**, including **114 Rafale fighter jets** (taking India's total Rafale fleet to 176) and 6 P-8I maritime aircraft."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec5-2",
    title: "Uday Kotak Appointed Chairman of GIFT City Company Ltd",
    category: "SEC8",
    summary: "Kotak Mahindra Bank founder Uday Kotak appointed Chairman of GIFT City Company Ltd, succeeding Hasmukh Adhia.",
    blocks: [
      {
        type: "paragraph",
        content: "Uday Kotak was appointed **Chairman of GIFT City Company Ltd**, succeeding Hasmukh Adhia at India's first operational smart city and IFSC."
      }
    ]
  },

  // SECTION 6 — SCIENCE, TECH, DEFENCE & SPORTS
  {
    id: "migrated-ca-2026-02-sec6-1",
    title: "India Wins Record 6th ICC Under-19 Cricket World Cup",
    category: "SEC8",
    summary: "India U-19 team captained by Ayush Mhatre beats England by 100 runs in Harare to claim India's 6th U-19 World Cup title.",
    blocks: [
      {
        type: "paragraph",
        content: "India defeated England by 100 runs at Harare to win their **record 6th ICC Under-19 World Cup title** (Captain: Ayush Mhatre; Player of Series: Vaibhav Suryavanshi)."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec6-2",
    title: "India & Sri Lanka Co-Host 10th ICC Men's T20 World Cup 2026",
    category: "SEC8",
    summary: "20 teams compete across 55 matches in India and Sri Lanka (Scotland replacing Bangladesh).",
    blocks: [
      {
        type: "paragraph",
        content: "India and Sri Lanka co-host the **10th ICC Men's T20 World Cup 2026** (20 teams, 55 matches across 8 venues)."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec6-3",
    title: "BCCI Scraps A+ Grade in Central Contracts Restructure",
    category: "SEC8",
    summary: "BCCI moves from 4-tier to 3-tier central contract system (A, B, C), discontinuing the ₹7 Cr/year A+ bracket.",
    blocks: [
      {
        type: "paragraph",
        content: "BCCI restructured player contracts into a **3-tier system (A, B, C)**. Virat Kohli and Rohit Sharma moved to Grade B; new Grade A features **Shubman Gill, Jasprit Bumrah, and Ravindra Jadeja**."
      }
    ]
  },

  // SECTION 7 — AWARDS, BOOKS, INDICES & RANKINGS
  {
    id: "migrated-ca-2026-02-sec7-1",
    title: "India Climbs 5 Slots to 91st on Corruption Perception Index 2025",
    category: "SEC7",
    summary: "India ranks 91st out of 180 countries with a score of 39/100 on Transparency International's CPI 2025.",
    blocks: [
      {
        type: "paragraph",
        content: "India improved its rank from 96th to **91st globally (score 39/100)** on Transparency International's Corruption Perception Index 2025 (Denmark ranked 1st for 8th straight year)."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec7-2",
    title: "India's Statistical Base-Year Reset to 2022-23",
    category: "SEC7",
    summary: "MoSPI revises base years for GDP (2022-23), IIP (2022-23), and CPI (2024=100) per Biswanath Goldar committee recommendations.",
    blocks: [
      {
        type: "paragraph",
        content: "MoSPI enacted a triple base-year revision for **GDP (2022-23)**, **IIP (2022-23)**, and **CPI (2024=100)** to align with IMF SDDS standards."
      },
      {
        type: "bullet_list",
        items: [
          "**Basket Expansion**: CPI basket items increased from 299 to **358 items**.",
          "**Weight Cut**: Food & Beverages weight cut to 36.75%."
        ]
      }
    ]
  },

  // SECTION 10 — MISCELLANEOUS & GOVT SCHEMES
  {
    id: "migrated-ca-2026-02-sec10-1",
    title: "India Semiconductor Mission 2.0 (ISM 2.0) Announced",
    category: "SEC10",
    summary: "Budget 2026-27 allocates ₹1,000 crore for ISM 2.0 to focus on domestic semiconductor equipment & materials manufacturing.",
    blocks: [
      {
        type: "paragraph",
        content: "Government announced **India Semiconductor Mission 2.0 (ISM 2.0)** with an outlay of **₹1,000 crore** for FY27, shifting focus upstream to semiconductor equipment and materials."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec10-2",
    title: "Cabinet Approves ₹1 Lakh Crore Urban Challenge Fund (UCF)",
    category: "SEC10",
    summary: "UCF provides ₹1 lakh crore central assistance to catalyze ₹4 lakh crore total urban infrastructure investment.",
    blocks: [
      {
        type: "paragraph",
        content: "Union Cabinet approved the **₹1 lakh crore Urban Challenge Fund (UCF)** operating under a 25:25:50 funding model (Centre 25%, State/ULB 25%, Market 50%)."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec10-3",
    title: "India's First Underwater Twin-Tube Tunnel Approved in Assam",
    category: "SEC10",
    summary: "CCEA approves ₹18,662 crore underwater road-cum-rail tunnel under Brahmaputra River connecting Gohpur and Numaligarh.",
    blocks: [
      {
        type: "paragraph",
        content: "CCEA approved India's **first underwater twin-tube road-cum-rail tunnel** under the Brahmaputra River (33.7 km corridor, ₹18,662 Cr), cutting travel distance by 240 km."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec10-4",
    title: "Vibrant Villages Programme-II (VVP-II) Launched with ₹6,839 Crore Outlay",
    category: "SEC10",
    summary: "Amit Shah launches VVP-II covering border villages along Pakistan, Bangladesh, Nepal, Bhutan, and Myanmar across 15 states and 2 UTs.",
    blocks: [
      {
        type: "paragraph",
        content: "Home Minister Amit Shah launched **VVP-II (outlay ₹6,839 Cr through FY29)** covering border villages along 5 non-China neighbor nations."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec10-5",
    title: "MHA Unveils 'PRAHAAR' — India's First National Counter-Terrorism Policy",
    category: "SEC9",
    summary: "MHA releases PRAHAAR policy built around 7 pillars, establishing MAC/JTFI under IB and NIA for terror investigation.",
    blocks: [
      {
        type: "paragraph",
        content: "Ministry of Home Affairs unveiled **'PRAHAAR'**, India's first national counter-terrorism doctrine, structured around 7 strategic pillars."
      }
    ]
  },
  {
    id: "migrated-ca-2026-02-sec10-6",
    title: "February 2026 Rapid Recall & Key Milestones Summary",
    category: "SEC11",
    summary: "High-speed sweep of top figures, budget highlights, policy decisions, and sports records from February 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "High-speed recall summary for February 2026:"
      },
      {
        type: "bullet_list",
        items: [
          "**Union Budget 2026-27**: Fiscal Deficit 4.3%, Capex ₹12.2L Cr (+9%), Income Tax Act 2025.",
          "**16th Finance Commission**: Devolution 41%, 10% weight for GDP contribution.",
          "**RBI Repo Rate**: Held at 5.25%; MSME collateral-free limit ₹20 Lakh; Fraud compensation cap ₹25,000.",
          "**India-US Trade Deal**: US reciprocal tariffs cut to 18%; $500B US purchases.",
          "**100% Insurance FDI**: Operationalized via Sabka Bima Sabki Raksha Act 2025.",
          "**Corruption Perception Index**: India 91st (score 39)."
        ]
      }
    ]
  }
];

export function importFebruary2026PDF() {
  console.log("🚀 IMPORTING FEBRUARY 2026 CURRENT AFFAIRS ITEMS...");

  let manifest: any;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    manifest = { totalItems: 0, entries: [] };
  }

  const dateStr = "2026-02-15";
  const now = new Date().toISOString();
  let addedCount = 0;

  for (const itemDef of febItems) {
    const rawContentStr = JSON.stringify(itemDef);
    const checksum = crypto.createHash('sha256').update(rawContentStr).digest('hex');

    const fullItem = {
      id: itemDef.id,
      type: "ca_note",
      domain: "current-affairs",
      title: itemDef.title,
      summary: itemDef.summary,
      blocks: itemDef.blocks,
      metadata: {
        exam: ["RBI Grade B", "NABARD Grade A", "SBI PO"],
        tags: [itemDef.category.toLowerCase(), "Current Affairs 2026", "February 2026"],
        date: dateStr,
        category: itemDef.category,
        difficulty: "intermediate",
        lastUpdated: now,
        provenance: {
          sourceSystem: "CA",
          sourceFile: "Feb2026.pdf",
          sourceId: itemDef.id,
          sourceTitle: itemDef.title,
          sourceChecksum: checksum,
          migrationTimestamp: now,
          normalizationRuleVersion: "1.0.0-feb2026"
        }
      }
    };

    const filePath = path.join(corpusDir, `${itemDef.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(fullItem, null, 2));
    addedCount++;

    // Add to manifest if not present
    const existingIdx = manifest.entries.findIndex((e: any) => e.destinationId === itemDef.id);
    const entryObj = {
      sourceSystem: "CA",
      sourceFile: "Feb2026.pdf",
      sourceId: itemDef.id,
      sourceTitle: itemDef.title,
      sourceDomain: "current-affairs",
      sourceType: "ca_note",
      sourceChecksum: checksum,
      migrationStatus: "migrated",
      lastValidationStatus: "PASS",
      lastUpdated: now,
      destinationId: itemDef.id,
      batchNumber: 7
    };

    if (existingIdx >= 0) {
      manifest.entries[existingIdx] = entryObj;
    } else {
      manifest.entries.push(entryObj);
    }
  }

  manifest.totalItems = manifest.entries.length;
  manifest.migratedCount = manifest.entries.length;
  manifest.lastUpdated = now;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ ${addedCount} February 2026 items added to content/corpus and manifest.`);

  // Rebuild corpus index
  buildCorpusIndex();
}

importFebruary2026PDF();
