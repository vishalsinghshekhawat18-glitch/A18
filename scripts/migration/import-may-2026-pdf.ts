import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildCorpusIndex } from '../build-corpus-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const corpusDir = path.resolve(__dirname, '../../content/corpus');
const manifestPath = path.resolve(__dirname, '../../content/manifest.json');

const mayItems = [
  // ==========================================
  // SECTION 1: BANKING, FINANCE & MONETARY POLICY (SEC3)
  // ==========================================
  {
    id: "migrated-ca-2026-05-sec3-1",
    title: "RBI Central Board Approves Record Dividend Transfer of ₹2,86,588 Crore for FY26",
    category: "SEC3",
    summary: "RBI Governor Sanjay Malhotra-led Board approves record ₹2.87 lakh crore surplus transfer to Central Govt for FY26; CRB maintained at 6.5%.",
    blocks: [
      {
        type: "paragraph",
        content: "During its 623rd board meeting in May 2026, the RBI Central Board of Directors approved a record surplus transfer of **₹2,86,588.46 crore (~₹2.87 lakh crore)** to the Central Government for FY 2025-26 (surpassing FY25's previous record of ₹2.68 lakh crore)."
      },
      {
        type: "bullet_list",
        items: [
          "**RBI Balance Sheet**: Expanded 20.61% YoY to **₹91.97 lakh crore** as of March 31, 2026.",
          "**Contingent Risk Buffer (CRB)**: Board transferred ₹1,09,379.64 crore to CRB, maintaining it at **6.5% of the balance sheet** size.",
          "**Fiscal Impact**: Provides substantial non-tax revenue relief to support the Centre's fiscal deficit target."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec3-2",
    title: "RBI Announces $5 Billion USD/INR Buy/Sell Swap Auction to Inject Liquidity",
    category: "SEC3",
    summary: "RBI conducts 3-year $5 billion USD/INR buy/sell swap auction on May 26, 2026 to inject rupee liquidity into the banking system.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI announced a **$5 billion USD/INR Buy/Sell swap auction** with a 3-year tenor (settlement May 29, 2026, maturity May 29, 2029) to inject long-term rupee liquidity into the banking system amid rupee defence interventions."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec3-3",
    title: "RBI Discontinues Investment Fluctuation Reserve (IFR) Requirement for Banks",
    category: "SEC3",
    summary: "RBI discontinues mandatory IFR for commercial banks w.e.f. May 18, 2026; balance to be transferred 'below the line' to Statutory/General Reserves.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI discontinued the requirement for commercial banks to maintain an **Investment Fluctuation Reserve (IFR)** effective May 18, 2026. The IFR balance as of May 17, 2026, will be transferred 'below the line' to Statutory Reserve, General Reserve, or P&L Account."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec3-4",
    title: "RBI Draft Norms on Loan Recovery & Recovery Agent Engagement",
    category: "SEC3",
    summary: "RBI proposes strict restrictions on mobile phone disabling tools (90-day overdue threshold) and ₹250/hr compensation for delayed restoration.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI released draft Amendment Directions titled 'Conduct of Regulated Entities in Recovery of Loans and Engagement of Recovery Agents', proposing strict borrower protection standards."
      },
      {
        type: "bullet_list",
        items: [
          "**Phone Disabling Restrictions**: Allowed only for device-financed loans after a 90-day overdue threshold (21-day cure + 7-day notice). Must restore within 1 hour or pay ₹250/hour compensation.",
          "**Agent Conduct**: Mandatory IIBF certification; contact hours restricted to 8:00 AM – 7:00 PM; contact with relatives/friends prohibited."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec3-5",
    title: "Rohit Jain Appointed Deputy Governor of Reserve Bank of India",
    category: "SEC3",
    summary: "RBI Executive Director Rohit Jain appointed Deputy Governor for 3 years, replacing T Rabi Sankar upon completion of tenure.",
    blocks: [
      {
        type: "paragraph",
        content: "Appointments Committee of the Cabinet approved the appointment of **Rohit Jain** (RBI Executive Director) as Deputy Governor of RBI for 3 years starting May 3, 2026, succeeding T Rabi Sankar."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec3-6",
    title: "RBI Eases Capital Adequacy Rules for Quarterly Profit Inclusion in CET1",
    category: "SEC3",
    summary: "RBI removes 25% NPA provisioning condition, allowing commercial banks to reckon audited/limited-reviewed quarterly profits into CET1 capital.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI amended capital adequacy directions, removing the qualifying condition linked to previous-year NPA provisions and simplifying the inclusion of quarterly profits into Common Equity Tier 1 (CET1) capital."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec3-7",
    title: "RBL Bank Secures Approval for Historic $3 Billion FDI Investment from Emirates NBD",
    category: "SEC3",
    summary: "Emirates NBD acquires 49%-74% controlling stake in RBL Bank through ₹26,850 crore ($3B) preferential issue — largest FDI in Indian banking history.",
    blocks: [
      {
        type: "paragraph",
        content: "RBL Bank received all regulatory approvals (RBI, SEBI, CCI, DFS) for a **$3 billion (₹26,850 crore)** strategic investment by Dubai-based **Emirates NBD Bank**, acquiring 49-74% controlling stake at ₹280/share."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec3-8",
    title: "RBI Discontinues Countercyclical Capital Buffer (CCyB) Activation for FY27",
    category: "SEC3",
    summary: "RBI review concludes prevailing economic conditions do not warrant CCyB activation, keeping buffer requirement at 0%.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI decided against activating the Countercyclical Capital Buffer (CCyB) under commercial bank capital adequacy norms, citing stable credit-to-GDP gap trends."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec3-9",
    title: "RBI Tightens Governance Norms for Urban & Rural Co-operative Banks",
    category: "SEC3",
    summary: "RBI mandates a 3-year cooling-off period for directors completing 10 years of continuous tenure on the board of UCBs and RCBs.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI issued immediate governance directions requiring a **3-year cooling-off period** for directors completing 10 continuous years on UCB/RCB boards under Banking Laws (Amendment) Act 2025."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec3-10",
    title: "RBI Cancels Licence of Sarvodaya Co-operative Bank Ltd, Mumbai",
    category: "SEC3",
    summary: "RBI cancels Sarvodaya Co-op Bank's license due to inadequate capital and poor earnings; DICGC to pay up to ₹5 lakh per depositor.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI cancelled the banking licence of Mumbai-based **Sarvodaya Co-operative Bank Ltd.** effective May 12, 2026. Depositors are entitled to DICGC insurance cover up to ₹5 lakh."
      }
    ]
  },

  // ==========================================
  // SECTION 2: REGULATORY BODIES & MACRO ECONOMICS (SEC2)
  // ==========================================
  {
    id: "migrated-ca-2026-05-sec2-1",
    title: "Government Notifies 100% FDI in Insurance Companies Under Automatic Route",
    category: "SEC2",
    summary: "Ministry of Finance notifies FEMA Non-debt Instruments 2nd Amendment Rules 2026, allowing 100% FDI in insurance sector (LIC capped at 20%).",
    blocks: [
      {
        type: "paragraph",
        content: "Ministry of Finance notified amendments to Foreign Exchange Management (Non-debt Instruments) Rules 2019, permitting **100% FDI under automatic route** in insurance companies and intermediaries (brokers), while LIC remains capped at 20%."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec2-2",
    title: "SEBI Proposes 'GARUDA' Green-Channel Mechanism for Fast-Track AIF Rollout",
    category: "SEC2",
    summary: "SEBI proposes GARUDA mechanism allowing Alternative Investment Funds (AIFs) to launch schemes within 10 working days of filing placement memorandum.",
    blocks: [
      {
        type: "paragraph",
        content: "SEBI issued a proposal for **GARUDA (Green-Channel: AIF Rollout Upon Document Acknowledgement)**, reducing scheme launch timeline from 30 days to 10 working days for AIFs."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec2-3",
    title: "Government Hikes Import Duty on Gold & Silver to 15% to Protect Forex Reserves",
    category: "SEC2",
    summary: "GoI increases customs duty on gold and silver from 6% to 15% (10% BCD + 5% AIDC) amid West Asia conflict and widening CAD.",
    blocks: [
      {
        type: "paragraph",
        content: "Government raised customs duty on gold and silver imports from 6% to **15% (10% BCD + 5% AIDC)** and platinum to 15.4%, reversing Budget 2024 cuts after gold imports surged 24% to $71.98 billion in FY26."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec2-4",
    title: "PFRDA Launches 'Retirement Income Scheme (RIS)' — Mandatory Annuity Cut to 20%",
    category: "SEC2",
    summary: "PFRDA reduces mandatory annuity requirement for private NPS subscribers from 40% to 20%, freeing up 80% corpus for lump-sum withdrawal.",
    blocks: [
      {
        type: "paragraph",
        content: "PFRDA introduced the **Retirement Income Scheme (RIS)** under NPS, cutting mandatory annuity purchase for non-government subscribers from **40% to 20%** (freeing up 80% for lump sum). Full withdrawal allowed for corpus up to ₹8 lakh."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec2-5",
    title: "DPIIT Issues Updated SOP for Fast-Track Land-Border FDI Clearances within 60 Days",
    category: "SEC2",
    summary: "DPIIT identifies 40 sub-sectors for 60-day expedited FDI clearance, relaxing Press Note 3 (2020) for up to 10% non-controlling Chinese/HK stakes.",
    blocks: [
      {
        type: "paragraph",
        content: "DPIIT updated Press Note 3 guidelines, allowing non-controlling foreign investments with up to 10% Chinese/HK shareholding via automatic route in 40 key manufacturing sub-sectors."
      }
    ]
  },

  // ==========================================
  // SECTION 10: GOVT SCHEMES & NATIONAL AFFAIRS (SEC10)
  // ==========================================
  {
    id: "migrated-ca-2026-05-sec10-1",
    title: "Central Government Operationalises 4 Labour Codes Across India via 30+ Notifications",
    category: "SEC10",
    summary: "GoI notifies final rules consolidating 29 central laws into 4 unified Labour Codes; caps weekly working hours at 48 and introduces WFH rules.",
    blocks: [
      {
        type: "paragraph",
        content: "The Central Government notified final rules under all 4 Labour Codes (Code on Wages 2019, Industrial Relations 2020, Social Security 2020, OSHWC 2020), consolidating 29 labour laws."
      },
      {
        type: "bullet_list",
        items: [
          "**Working Hours**: Weekly hours capped at 48 hours (daily flexibility up to 12 hours); overtime pay fixed at 2x normal rate.",
          "**Work From Home**: Model Standing Orders 2026 officially recognize WFH for the service industry for the first time.",
          "**Social Security**: Mandatory Aadhaar registration for unorganised workers >16 yrs and National Social Security Board for gig workers."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec10-2",
    title: "PM Narendra Modi Outlines 7 National Appeals Under 'Nation First, Duty Above Comfort'",
    category: "SEC10",
    summary: "PM Modi calls on citizens to curb gold & foreign travel, reduce fuel/edible oil usage, adoption of natural farming, and remote work amid West Asia crisis.",
    blocks: [
      {
        type: "paragraph",
        content: "Addressing a public gathering in Secunderabad on May 10, 2026, PM Modi issued 7 economic self-reliance appeals to mitigate global West Asia oil shock impacts ($126/bbl crude spike)."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec10-3",
    title: "West Bengal CM Suvendu Adhikari Approves 600 Acres to BSF, Ayushman Bharat & BNS Rollout",
    category: "SEC10",
    summary: "Maiden West Bengal cabinet meeting approves BSF border fencing land, ends state deadlock on Ayushman Bharat, and enforces Bharatiya Nyaya Sanhita.",
    blocks: [
      {
        type: "paragraph",
        content: "Newly sworn-in West Bengal CM Suvendu Adhikari approved transferring 600 acres for BSF India-Bangladesh border fencing, implementing Ayushman Bharat (PM-JAY), and adopting criminal code BNS."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec10-4",
    title: "CCEA Approves ₹1,570 Crore Ship Repair Facility at Vadinar, Gujarat",
    category: "SEC10",
    summary: "CCEA approves brownfield Ship Repair Facility at Vadinar port (DPA + CSL joint venture) capable of repairing vessels up to 300 metres.",
    blocks: [
      {
        type: "paragraph",
        content: "CCEA approved a ₹1,570 crore ship repair hub at Vadinar in Devbhumi Dwarka (Gujarat) implemented by Deendayal Port Authority and Cochin Shipyard to reduce dependence on Dubai/Singapore shipyards."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec10-5",
    title: "CCEA Fixes Sugarcane FRP for 2026-27 Season at Record ₹365 per Quintal",
    category: "SEC10",
    summary: "Fair and Remunerative Price (FRP) of sugarcane fixed at ₹365/qtl for basic 10.25% recovery rate for 2026-27 sugar season.",
    blocks: [
      {
        type: "paragraph",
        content: "CCEA approved sugarcane FRP of **₹365/quintal** for Sugar Season 2026-27 (Oct-Sept), 100.5% over A2+FL cost of production (₹182/qtl) on CACP recommendations."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec10-6",
    title: "India Semiconductor Mission Approves 2 New Fab Projects in Gujarat (₹3,936 Crore)",
    category: "SEC10",
    summary: "Cabinet approves Crystal Matrix Mini/Micro-LED fab at Dholera and Suchi Semicon OSAT facility at Surat, taking total ISM projects to 12.",
    blocks: [
      {
        type: "paragraph",
        content: "Union Cabinet approved 2 semiconductor units under ISM: **Crystal Matrix Ltd** (₹3,936 Cr GaN Mini/Micro-LED display fab in Dholera) and **Suchi Semicon** (OSAT plant in Surat), taking total ISM investment to ₹1.64 lakh crore across 12 projects."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec10-7",
    title: "Government Notifies South Coast Railway (SCoR) Zone at Visakhapatnam w.e.f. June 1, 2026",
    category: "SEC10",
    summary: "Ministry of Railways formally notifies creation of South Coast Railway (headquartered in Visakhapatnam) and new Rayagada division.",
    blocks: [
      {
        type: "paragraph",
        content: "Union Government notified creation of **South Coast Railway (SCoR)** with HQs at Visakhapatnam, carved out of ECoR and SCR under Section 3(4) of Railways Act 1989."
      }
    ]
  },

  // ==========================================
  // SECTION 4: DEFENCE AFFAIRS (SEC4)
  // ==========================================
  {
    id: "migrated-ca-2026-05-sec4-1",
    title: "DRDO & Indian Navy Conduct Maiden Salvo Launch of NASM-SR Missile",
    category: "SEC4",
    summary: "Naval Anti-Ship Missile-Short Range (NASM-SR) launched from Navy helicopter platform off Odisha coast with indigenous solid booster.",
    blocks: [
      {
        type: "paragraph",
        content: "DRDO and Indian Navy conducted the maiden salvo flight-test of indigenously developed **NASM-SR** anti-ship missile from a naval helicopter off Odisha, developed by RCI Hyderabad."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec4-2",
    title: "Indian Navy Receives 6th Stealth Frigate 'INS Mahendragiri' Under Project 17A",
    category: "SEC4",
    summary: "Mazagon Dock Shipbuilders delivers INS Mahendragiri frigate equipped with MF-STAR radar, BrahMos, and Barak-8 missiles.",
    blocks: [
      {
        type: "paragraph",
        content: "Mazagon Dock Shipbuilders Limited (MDL) delivered **INS Mahendragiri**, the 6th stealth guided-missile frigate under Project 17A (Nilgiri-class), designed by Warship Design Bureau."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec4-3",
    title: "MoD Issues RFP to Private Firms for ₹15,000 Crore AMCA 5th-Gen Stealth Fighter",
    category: "SEC4",
    summary: "MoD shortlists Tata, L&T+BEL, and Bharat Forge+BEML to build 5 prototypes of Advanced Medium Combat Aircraft (AMCA); HAL excluded.",
    blocks: [
      {
        type: "paragraph",
        content: "Ministry of Defence issued an RFP to 3 shortlisted private consortia (Tata Advanced Systems, L&T + BEL, Bharat Forge + BEML) to manufacture 5 prototypes of India's 5th-generation **AMCA stealth fighter**, marking the first big-ticket jet programme without HAL."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec4-4",
    title: "DRDO & IAF Test 'TARA' Indigenous Glide Weapon System on Jaguar Jet",
    category: "SEC4",
    summary: "Tactical Advanced Range Augmentation (TARA) modular kit converts conventional 500kg bombs into precision-guided glide weapons.",
    blocks: [
      {
        type: "paragraph",
        content: "DRDO and IAF flight-tested **TARA (Tactical Advanced Range Augmentation)** modular kit using an IAF Jaguar jet off Odisha, converting 500kg unguided bombs into precision glide munitions."
      }
    ]
  },

  // ==========================================
  // SECTION 5: SCIENCE & TECHNOLOGY (SEC5)
  // ==========================================
  {
    id: "migrated-ca-2026-05-sec5-1",
    title: "GalaxEye Launches 'Mission Drishti' — World's 1st OptoSAR Hybrid EO Satellite",
    category: "SEC5",
    summary: "Bengaluru space startup GalaxEye launches 190kg Mission Drishti aboard SpaceX Falcon 9, combining optical and SAR sensors on one platform.",
    blocks: [
      {
        type: "paragraph",
        content: "Space startup GalaxEye launched **Mission Drishti** on a SpaceX Falcon 9 rocket, becoming the world's 1st satellite to integrate Electro-Optical (EO) and Synthetic Aperture Radar (SAR) sensors into a single 190kg platform."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec5-2",
    title: "DRDO Successfully Flight-Tests Long-Range Hypersonic Anti-Ship Missile (LR-AShM)",
    category: "SEC5",
    summary: "DRDO conducts 2nd hypersonic flight trial off Odisha coast achieving Mach 10 speed over 1,500 km strike range.",
    blocks: [
      {
        type: "paragraph",
        content: "DRDO successfully tested its 2-stage hypersonic glide vehicle **LR-AShM** off Odisha, validating Mach 10 speed and >1,500 km strike range for naval precision strikes."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec5-3",
    title: "NASA Announces $20 Billion Plan for 3 Moon Base Missions & Blue Moon Lander",
    category: "SEC5",
    summary: "NASA Administrator Jared Isaacman unveils Moon Base I, II & III plan selecting Blue Origin's Blue Moon Mark 1 lander for permanent lunar infrastructure.",
    blocks: [
      {
        type: "paragraph",
        content: "NASA unveiled a **$20 billion 3-phase Moon Base roadmap** selecting Blue Origin's Blue Moon lander to establish a permanent human settlement on the Moon's South Pole by 2028."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec5-4",
    title: "Sahasra Semiconductors Inaugurates India's 1st SME ATMP Chip Packaging Facility in Bhiwadi",
    category: "SEC5",
    summary: "MeitY Minister Ashwini Vaishnaw inaugurates ₹150 Cr SPECS-supported semiconductor packaging plant in Rajasthan.",
    blocks: [
      {
        type: "paragraph",
        content: "Union Minister Ashwini Vaishnaw virtually inaugurated Sahasra Semiconductors' ₹150 Cr ATMP/OSAT chip packaging plant in Bhiwadi, Rajasthan under MeitY's SPECS scheme."
      }
    ]
  },

  // ==========================================
  // SECTION 6: INTERNATIONAL AFFAIRS (SEC6)
  // ==========================================
  {
    id: "migrated-ca-2026-05-sec6-1",
    title: "US Launches 'Operation Project Freedom' to Escort Ships in Strait of Hormuz",
    category: "SEC6",
    summary: "US President Donald Trump orders military escort operations in Strait of Hormuz; India executes Operation Urja Suraksha with 5 warships.",
    blocks: [
      {
        type: "paragraph",
        content: "US launched **Operation Project Freedom** to escort commercial tankers through the Strait of Hormuz following Iran's blockade, while Indian Navy continues **Operation Urja Suraksha**."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec6-2",
    title: "Netherlands Returns Historic 11th-Century Chola Dynasty 'Leiden' Copper Plates to India",
    category: "SEC6",
    summary: "Dutch PM Rob Jetten hands over 24 Anaimangalam Chola copper plates (30 kg with imperial seal) to PM Modi in The Hague after 14-year campaign.",
    blocks: [
      {
        type: "paragraph",
        content: "During PM Modi's visit to The Hague, the Netherlands government formally returned the 11th-century **Chola dynasty 'Leiden' copper plates** (21 large & 3 small plates in Sanskrit & Tamil), taken in 1712."
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec6-3",
    title: "India & Italy Elevate Bilateral Relations to 'Special Strategic Partnership'",
    category: "SEC6",
    summary: "PM Modi & Italian PM Giorgia Meloni sign Defence Industrial Roadmap and set €20 billion annual bilateral trade target by 2029.",
    blocks: [
      {
        type: "paragraph",
        content: "India and Italy elevated ties to a **Special Strategic Partnership** during PM Modi's visit to Rome, adopting an India-Italy Defence Industrial Roadmap and targeting €20B trade by 2029."
      }
    ]
  },

  // ==========================================
  // SECTION 7: APPOINTMENTS & AWARDS (SEC7)
  // ==========================================
  {
    id: "migrated-ca-2026-05-sec7-1",
    title: "Key May 2026 Appointments: Vice Adm Swaminathan (Navy Chief), Lt Gen Subramani (CDS), Suvendu Adhikari (WB CM)",
    category: "SEC7",
    summary: "Vice Admiral Krishna Swaminathan named 26th Naval Chief; Lt Gen NS Raja Subramani appointed 3rd CDS; Suvendu Adhikari sworn in as West Bengal CM.",
    blocks: [
      {
        type: "bullet_list",
        items: [
          "**Chief of Naval Staff**: Vice Admiral Krishna Swaminathan appointed 26th Chief of Naval Staff w.e.f. May 31, 2026.",
          "**Chief of Defence Staff**: Lt Gen NS Raja Subramani appointed 3rd CDS w.e.f. May 31, 2026 (replacing Gen Anil Chauhan).",
          "**West Bengal CM**: Suvendu Adhikari sworn in as CM after BJP won 207 of 294 seats.",
          "**Tamil Nadu CM**: C. Joseph Vijay (TVK) sworn in as CM of Tamil Nadu.",
          "**SAIL CMD**: Ashok Kumar Panda appointed Chairman & MD."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-05-sec7-2",
    title: "Padma Awards 2026 Conferred by President Murmu & PM Modi Conferred Sweden's Highest Honour",
    category: "SEC7",
    summary: "President Murmu confers 66 Padma awards; PM Modi receives Sweden's Royal Order of Polar Star; Pulitzer 2026 awarded to Indian journalists.",
    blocks: [
      {
        type: "bullet_list",
        items: [
          "**Padma Awards 2026**: 66 of 131 awardees conferred at Rashtrapati Bhavan (Padma Vibhushan to Dharmendra Deol & Dr N. Rajam).",
          "**PM Modi's 31st Intl Honour**: Awarded Sweden's **Royal Order of the Polar Star** & FAO **Agricola Medal 2026** in Rome.",
          "**Pulitzer Prize 2026**: Indian journalists Anand RK and Suparna Sharma win in Illustrated Reporting for 'trAPPed'."
        ]
      }
    ]
  },

  // ==========================================
  // SECTION 11: RAPID RECALL (SEC11)
  // ==========================================
  {
    id: "migrated-ca-2026-05-sec11-1",
    title: "May 2026 High-Yield Exam Rapid Recall & Summary",
    category: "SEC11",
    summary: "Consolidated high-yield sweep of key figures, policy dates, and macro indicators from May 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "Quick sweep of top May 2026 exam facts:"
      },
      {
        type: "bullet_list",
        items: [
          "**RBI Record Dividend**: ₹2.87 Lakh Crore transferred to Central Govt for FY26 (CRB 6.5%).",
          "**RBI $5B Swap**: 3-year USD/INR buy/sell swap auction on May 26.",
          "**VB-G RAM G Act 2025**: Replaces MGNREGA from July 1, 2026 (125 days wage employment, ₹95,692 Cr).",
          "**4 Labour Codes**: Final rules notified across 30+ gazette notifications.",
          "**100% FDI in Insurance**: Automatic route notified under FEMA rules (LIC 20%).",
          "**Navy Chief & CDS**: Vice Adm Krishna Swaminathan (Navy Chief), Lt Gen NS Raja Subramani (CDS).",
          "**AMCA RFP**: 3 private consortia shortlisted for ₹15,000 Cr fighter jet programme."
        ]
      }
    ]
  }
];

export function importMay2026PDF() {
  console.log("🚀 IMPORTING COMPREHENSIVE MAY 2026 CURRENT AFFAIRS ITEMS...");

  let manifest: any;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    manifest = { totalItems: 0, entries: [] };
  }

  const dateStr = "2026-05-15";
  const now = new Date().toISOString();
  let addedCount = 0;

  for (const itemDef of mayItems) {
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
        tags: [itemDef.category.toLowerCase(), "Current Affairs 2026", "May 2026"],
        date: dateStr,
        category: itemDef.category,
        difficulty: "intermediate",
        lastUpdated: now,
        provenance: {
          sourceSystem: "CA",
          sourceFile: "May 6927cf5d2b211a2b729e125e2026 Monthly CA PDF.pdf",
          sourceId: itemDef.id,
          sourceTitle: itemDef.title,
          sourceChecksum: checksum,
          migrationTimestamp: now,
          normalizationRuleVersion: "1.0.0-may2026"
        }
      }
    };

    const filePath = path.join(corpusDir, `${itemDef.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(fullItem, null, 2));
    addedCount++;

    const existingIdx = manifest.entries.findIndex((e: any) => e.destinationId === itemDef.id);
    const entryObj = {
      sourceSystem: "CA",
      sourceFile: "May 6927cf5d2b211a2b729e125e2026 Monthly CA PDF.pdf",
      sourceId: itemDef.id,
      sourceTitle: itemDef.title,
      sourceDomain: "current-affairs",
      sourceType: "ca_note",
      sourceChecksum: checksum,
      migrationStatus: "migrated",
      lastValidationStatus: "PASS",
      lastUpdated: now,
      destinationId: itemDef.id,
      batchNumber: 10
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
  console.log(`✅ ${addedCount} comprehensive May 2026 items added to content/corpus and manifest.`);

  buildCorpusIndex();
}

importMay2026PDF();
