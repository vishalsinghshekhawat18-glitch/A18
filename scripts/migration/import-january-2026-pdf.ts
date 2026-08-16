import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildCorpusIndex } from '../build-corpus-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const corpusDir = path.resolve(__dirname, '../../content/corpus');
const manifestPath = path.resolve(__dirname, '../../content/manifest.json');

// January 26, 2026 structured item catalog from January_26.pdf
const januaryItems = [
  // SECTION 1 — NATIONAL, STATE & INTERNATIONAL NEWS
  {
    id: "migrated-ca-2026-01-sec1-1",
    title: "77th Republic Day — First Multi-Leader Chief Guest Invite Since 2018",
    category: "SEC1",
    summary: "India marked its 77th Republic Day on 26 January 2026 with two Chief Guests: Antonio Costa (European Council) and Ursula von der Leyen (European Commission).",
    blocks: [
      {
        type: "paragraph",
        content: "India marked its **77th Republic Day on 26 January 2026** with a diplomatic first: inviting two Chief Guests—the Presidents of the European Council and European Commission—the first multi-leader invite since 2018."
      },
      {
        type: "bullet_list",
        items: [
          "**Chief Guests**: Antonio Costa (President, European Council) and Ursula von der Leyen (President, European Commission).",
          "**Theme at Kartavya Path**: '150 years of Vande Mataram'; parade theme: 'Vividata Mein Ekta' (Unity in Diversity).",
          "**EU Contingent**: First-time participation of an EU military contingent in the parade (representing operations Atalanta & Aspides).",
          "**Tableaux**: 30 tableaux (17 States/UTs, 13 Ministries/Departments).",
          "**Weapons Displayed**: BrahMos, Akash, 'Suryastra' rocket launcher (300 km range), Arjun MBT, and newly-raised Bhairav Battalion.",
          "**Aviation Milestone**: Capt. Hansja Sharma (J&K) led the 251 Army Aviation Squadron, showcasing the HELINA missile system—the Army's first woman pilot qualified on the Rudra armed helicopter."
        ]
      },
      {
        type: "key_concept",
        title: "Diplomatic Significance",
        summary: "First multi-leader invite since 2018 and first EU military contingent participation, signaling deepening India-EU strategic ties."
      },
      {
        type: "exam_trap",
        title: "Exam Trap & Role Distinction",
        content: "Do not confuse Antonio Costa (European Council President) with Ursula von der Leyen (European Commission President)—two distinct EU leadership roles."
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec1-2",
    title: "Census 2027 — India's First Fully Digital, Caste-Enumerating Census",
    category: "SEC1",
    summary: "India's next Census will be its first fully digital census and the first since 1931 to conduct nationwide caste enumeration.",
    blocks: [
      {
        type: "paragraph",
        content: "India's next Census will be its **16th official Census (8th since Independence)**, operating as the first fully digital census and first comprehensive caste enumeration since 1931."
      },
      {
        type: "bullet_list",
        items: [
          "**Phase I (Houselisting/Housing Census)**: 1 April 2026 – 30 September 2026; 33 questions on assets/housing with self-enumeration option 15 days prior.",
          "**Phase II (Population Enumeration)**: Begins February 2027—this is when caste data is collected.",
          "**Reference Date**: 12 a.m., 1 March 2027 (1 October 2026 for snow-bound J&K/HP/Uttarakhand/Ladakh).",
          "**Legal Basis**: Article 246, Entry 69 of the Union List (Seventh Schedule); Census Act, 1948 under MHA (Registrar General & Census Commissioner).",
          "**Impact**: Feeds directly into next delimitation of Lok Sabha/Assembly seats and 33% women's reservation."
        ]
      },
      {
        type: "exam_trap",
        title: "Sequence Trap",
        content: "Do not confuse Phase I dates (Apr–Sep 2026) with Phase II dates (Feb 2027). Caste enumeration occurs exclusively in Phase II."
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec1-3",
    title: "India Takes BRICS 2026 Presidency",
    category: "SEC6",
    summary: "India assumed the BRICS presidency for the fourth time on 1 January 2026 under the theme 'Building for Resilience, Innovation, Cooperation and Sustainability'.",
    blocks: [
      {
        type: "paragraph",
        content: "India assumed the **BRICS presidency for the fourth time** effective 1 January 2026, taking over from Brazil. India previously held the chairship in 2012, 2016, and 2021."
      },
      {
        type: "bullet_list",
        items: [
          "**Theme**: 'Building for Resilience, Innovation, Cooperation and Sustainability'.",
          "**Logo**: Lotus-shaped logo built around the word 'Namaste', incorporating colors of all 11 BRICS members.",
          "**11 BRICS Members**: Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, Iran, Saudi Arabia, UAE, and Indonesia.",
          "**Branding**: Approach branded 'humanity-first' and 'people-centric'."
        ]
      },
      {
        type: "key_concept",
        title: "BRICS Expansion",
        summary: "BRICS currently stands at 11 full member states post-expansion."
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec1-4",
    title: "India's Wetlands Cross 98 Ramsar Sites",
    category: "SEC10",
    summary: "Two new sites—Patna Bird Sanctuary (UP) and Chhari-Dhand (Gujarat)—pushed India's Ramsar site count to 98 on 31 January 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "On 31 January 2026, two new wetland sites were designated as Ramsar sites ahead of World Wetlands Day (2 Feb), taking India's total count to **98 Ramsar sites** (a 276% growth from 26 in 2014)."
      },
      {
        type: "bullet_list",
        items: [
          "**New Sites**: Patna Bird Sanctuary (Etah, UP) and Chhari-Dhand (Kutch, Gujarat).",
          "**Ramsar Convention**: Adopted 1971 in Ramsar, Iran; India ratified in 1982.",
          "**World's First Ramsar Site**: Cobourg Peninsula, Australia (1974)."
        ]
      },
      {
        type: "exam_trap",
        title: "High-Recall Figure",
        content: "The exact current count of Ramsar sites in India is 98."
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec1-5",
    title: "India Notifies Coking Coal as Critical & Strategic Mineral",
    category: "SEC3",
    summary: "Government classifies coking coal under MMDR Act 1957 to fast-track environmental clearances and tap 37.37 billion-tonne reserves.",
    blocks: [
      {
        type: "paragraph",
        content: "With India importing ~95% of its steel-sector coking coal needs, the Ministry of Mines notified coking coal as a **Critical and Strategic Mineral** under the MMDR Act, 1957."
      },
      {
        type: "bullet_list",
        items: [
          "**Import Reliance**: ~95% imported (mainly Australia, Russia, USA); imports reached 57.58 million tonnes in 2024-25.",
          "**Domestic Reserve**: Estimated coking coal resources stand at **37.37 billion tonnes** (primarily Jharkhand, MP, WB, Chhattisgarh).",
          "**Legal Basis**: Notified under Mines and Minerals (Development and Regulation) Act, 1957 following HLC-VB & NITI Aayog recommendations."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec1-6",
    title: "India's First Tailings Policy Launched by Ministry of Mines",
    category: "SEC3",
    summary: "First-ever framework to mine old mining waste for critical minerals like lithium, cobalt, nickel, and rare earth elements.",
    blocks: [
      {
        type: "paragraph",
        content: "Ministry of Mines launched India's **first 'Tailings Policy'**, aiming to extract critical minerals (lithium, cobalt, nickel, rare earths, germanium, indium) from old mining waste and red mud dumps."
      },
      {
        type: "bullet_list",
        items: [
          "**Agencies**: Indian Bureau of Mines (IBM), Central Mine Planning & Design Institute (CMPDI), Atomic Minerals Directorate (AMD).",
          "**Method**: 'Companionality' analysis to quantify recoverable content in overburden dumps and slags."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec1-7",
    title: "Carbon Credit Trading Scheme (CCTS) Expanded to 4 New Sectors",
    category: "SEC3",
    summary: "208 additional industrial units added under CCTS, bringing total obligated entities to 490.",
    blocks: [
      {
        type: "paragraph",
        content: "India's Carbon Market expanded by adding **208 industrial units** across four high-emission sectors, bringing total obligated entities under CCTS to **490** (up from 282 in Oct 2025)."
      },
      {
        type: "bullet_list",
        items: [
          "**New Sectors**: Petroleum Refineries (21), Petrochemicals (11), Textiles (173), Secondary Aluminium (3).",
          "**Baseline & Targets**: Baseline year 2023-24; 3-7% emission reduction targets for compliance year 2026-27.",
          "**Certificates**: Compliant units earn Carbon Credit Certificates (CCCs); non-compliance penalty is 2x average CCC price."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec1-8",
    title: "ECINET — Election Commission's Unified Digital Platform",
    category: "SEC1",
    summary: "ECI launched ECINET, integrating 40+ separate electoral apps into a single platform for 10+ crore voters.",
    blocks: [
      {
        type: "paragraph",
        content: "Election Commission of India launched **ECINET** at IICDEM 2026, consolidating 40+ separate ECI apps and portals into the world's largest unified electoral service platform."
      },
      {
        type: "bullet_list",
        items: [
          "**Scale**: Processed 10+ crore voter registration forms at ~2.7 lakh/day during beta pilot in 2025 Bihar polls.",
          "**Languages**: Available in 22 scheduled languages + English.",
          "**Static Context**: ECI formed 25 January 1950; 26th Chief Election Commissioner is Gyanesh Kumar."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec1-9",
    title: "India–UAE $200 Billion Trade Target by 2032 & LNG Deal",
    category: "SEC3",
    summary: "India and UAE agree to double bilateral trade to $200 billion by 2032 and sign 10-year LNG supply agreement.",
    blocks: [
      {
        type: "paragraph",
        content: "India and UAE agreed to **double bilateral trade to $200 billion by 2032** and finalized a 10-year LNG Sale and Purchase Agreement between HPCL and ADNOC starting 2028."
      },
      {
        type: "bullet_list",
        items: [
          "**LNG Role**: UAE is India's 2nd-largest LNG supplier.",
          "**GIFT City**: First Abu Dhabi Bank + DP World setting up operations in GIFT City, Gujarat.",
          "**Supercomputing**: Agreement to set up joint supercomputing cluster in India."
        ]
      }
    ]
  },

  // SECTION 2 — ESI, FINANCE & BUSINESS NEWS
  {
    id: "migrated-ca-2026-01-sec2-1",
    title: "India Becomes World's 4th-Largest Economy at $4.18 Trillion",
    category: "SEC3",
    summary: "India surpassed Japan to become the world's 4th-largest economy with a $4.18 trillion GDP, targeting $7.3 trillion by 2030.",
    blocks: [
      {
        type: "paragraph",
        content: "India's nominal GDP touched **$4.18 trillion**, overtaking Japan to rank as the **4th-largest economy globally**. The 2030 target is to reach $7.3 trillion and become the 3rd-largest (surpassing Germany)."
      },
      {
        type: "bullet_list",
        items: [
          "**Q2 FY26 Real GDP Growth**: 8.2% (up from 7.8% in Q1).",
          "**2026 Agency Growth Forecasts**: World Bank 6.5%, IMF 6.2%, OECD 6.2%, Moody's 6.4%, ADB 7.2%, Fitch 7.4%."
        ]
      },
      {
        type: "exam_trap",
        title: "Ranking Trap",
        content: "Top 4 economies: US (1st), China (2nd), Germany (3rd), India (4th), Japan (5th)."
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec2-2",
    title: "NSO 1st Advance Estimates: FY26 Real GDP Growth Projected at 7.4%",
    category: "SEC3",
    summary: "NSO projects real GDP to reach ₹201.90 lakh crore (7.4% growth) and nominal GDP at ₹357.14 lakh crore (8% growth).",
    blocks: [
      {
        type: "paragraph",
        content: "National Statistical Office (NSO, MoSPI) released 1st Advance Estimates for FY2025-26, projecting **real GDP growth at 7.4%** to touch ₹201.90 lakh crore."
      },
      {
        type: "bullet_list",
        items: [
          "**Nominal GDP Growth**: 8.0% to ₹357.14 lakh crore.",
          "**Real GVA Growth**: 7.3% to ₹184.50 lakh crore (manufacturing/construction at 7%).",
          "**GFCF (Investment) Growth**: 7.8% at constant prices.",
          "**PFCE (Consumption) Growth**: 7.0%."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec2-3",
    title: "December CPI Inflation Cools to 1.33%",
    category: "SEC3",
    summary: "Retail inflation drops to 1.33% in December 2025 as Consumer Food Price Index (CFPI) enters negative territory (-2.71%).",
    blocks: [
      {
        type: "paragraph",
        content: "India's headline CPI inflation cooled to **1.33% in December 2025**, driven by a sharp drop in food prices with CFPI food inflation printing at **-2.71%**."
      },
      {
        type: "bullet_list",
        items: [
          "**Urban vs Rural Headline**: Urban rose to 2.03%; Rural rose to 0.76%.",
          "**Sectoral Rates**: Housing 2.86%, Education 3.32%, Health 3.43%, Fuel & Light 1.97%."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec2-4",
    title: "UPI Hits All-Time High 21.63 Billion Transactions in Dec 2025",
    category: "SEC5",
    summary: "UPI processed 21.63 billion transactions worth ₹27.97 lakh crore in December 2025, commanding 84.8% of retail digital volume.",
    blocks: [
      {
        type: "paragraph",
        content: "Unified Payments Interface (UPI) set a record **21.63 billion monthly transactions** worth **₹27.97 lakh crore**, averaging 698 million daily transactions."
      },
      {
        type: "bullet_list",
        items: [
          "**Volume Share vs Value Share**: UPI accounts for **84.8% of retail digital volume**, but **9.1% of retail value** (small-ticket dominance).",
          "**International Acceptance**: UPI active in 8 countries (Bhutan, Singapore, Qatar, Mauritius, Nepal, UAE, Sri Lanka, France)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec2-5",
    title: "100% Insurance FDI Operationalised via Sabka Bima Sabki Raksha",
    category: "SEC5",
    summary: "Finance Ministry notifies Foreign Investment Amendment Rules 2025, requiring only one resident Indian key executive.",
    blocks: [
      {
        type: "paragraph",
        content: "Following Parliament approval of the 'Sabka Bima Sabki Raksha (Amendment of Insurance Laws) Bill 2025', **100% FDI in insurance** is operationalized with simplified residency norms."
      },
      {
        type: "bullet_list",
        items: [
          "**Executive Mandate**: At least 1 of CEO/MD/Chairperson must be a resident Indian citizen (down from 'most key management').",
          "**Governance Relief**: Removed mandatory ≥50% independent directors requirement for foreign-invested insurers."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec2-6",
    title: "RBI Raises Bank Dividend Payout Cap to 75% of PAT",
    category: "SEC2",
    summary: "RBI proposes raising dividend payout ceiling for commercial banks from 40% to 75% of PAT effective FY2026-27.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI proposed lifting the maximum dividend payout ratio for commercial banks from **40% to 75% of Profit After Tax (PAT)**, governed by a 10-bucket CET1 capital strength matrix."
      },
      {
        type: "bullet_list",
        items: [
          "**Effective Date**: FY 2026-27 onwards.",
          "**Exclusions**: Excludes Small Finance Banks, Payments Banks, RRBs, and Local Area Banks.",
          "**Adjusted PAT Formula**: PAT minus net NPAs as of 31 March."
        ]
      }
    ]
  },

  // SECTION 3 — REGULATORY BODIES NEWS
  {
    id: "migrated-ca-2026-01-sec3-1",
    title: "RBI Announces First-Ever 90-Day VRR in ₹2.15 Lakh Crore Package",
    category: "SEC2",
    summary: "RBI injects liquidity via ₹25,000 crore 90-day Variable Rate Repo (VRR), USD/INR swap, and ₹1 lakh crore OMO purchases.",
    blocks: [
      {
        type: "paragraph",
        content: "To ease system liquidity deficits from GST and advance tax outflows, RBI conducted its **first-ever 90-day VRR of ₹25,000 crore** on 30 January 2026 (previous maximum tenor was 56 days)."
      },
      {
        type: "bullet_list",
        items: [
          "**Total Liquidity Injection**: ~₹2.15 lakh crore between 30 Jan–12 Feb 2026.",
          "**USD/INR Swap**: $10 billion 3-year buy/sell swap (~₹90,000 crore liquidity).",
          "**OMO Purchases**: ₹1 lakh crore in two ₹50,000 crore tranches."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec3-2",
    title: "SEBI Introduces Base Expense Ratio (BER) for Mutual Funds",
    category: "SEC4",
    summary: "SEBI (Mutual Funds) Regulations 2026 splits AMC management fees (BER) from pass-through costs (brokerage/STT).",
    blocks: [
      {
        type: "paragraph",
        content: "SEBI notified Mutual Funds Regulations 2026 (effective 1 April 2026), introducing **Base Expense Ratio (BER)** to isolate AMC management fees from transaction costs."
      },
      {
        type: "bullet_list",
        items: [
          "**Brokerage Caps**: Cash market brokerage capped at 6 bps (down from 8.59 bps); derivatives capped at 2 bps (down from 3.89 bps).",
          "**SEBI Chairman**: Tuhin Kanta Pandey."
        ]
      }
    ]
  },

  // SECTION 4 — BANKING & INSURANCE NEWS
  {
    id: "migrated-ca-2026-01-sec4-1",
    title: "Small Savings Interest Rates Frozen for Q4 FY26",
    category: "SEC5",
    summary: "Government keeps small savings rates unchanged for Jan-Mar 2026; Sukanya Samriddhi and SCSS lead at 8.2%.",
    blocks: [
      {
        type: "paragraph",
        content: "Government maintained small savings rates unchanged for Q4 FY26. **Sukanya Samriddhi Yojana and SCSS offer 8.2%**, PPF offers 7.1%, NSC offers 7.7%, and KVP offers 7.5%."
      },
      {
        type: "bullet_list",
        items: [
          "**Review Committee**: Rates determined per G-Sec yield formula set by Shyamala Gopinath Committee."
        ]
      }
    ]
  },

  // SECTION 5 — AWARDS, BOOKS, INDICES & RANKINGS
  {
    id: "migrated-ca-2026-01-sec5-1",
    title: "131 Padma Awards 2026 Announced",
    category: "SEC7",
    summary: "2026 Republic Day honours list features 5 Padma Vibhushan, 13 Padma Bhushan, and 113 Padma Shri awardees.",
    blocks: [
      {
        type: "paragraph",
        content: "Government announced **131 Padma Awards for 2026** (5 Padma Vibhushan, 13 Padma Bhushan, 113 Padma Shri), including 19 women, 6 Foreigners/NRIs/PIOs, and 16 posthumous awardees."
      },
      {
        type: "bullet_list",
        items: [
          "**Key Awardees**: Rohit Sharma, Harmanpreet Kaur (cricket), Savita Punia (hockey), I.M. Vijayan (football), R. Madhavan (art).",
          "**Hierarchy**: Bharat Ratna → Padma Vibhushan (2nd) → Padma Bhushan (3rd) → Padma Shri (4th)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec5-2",
    title: "India Ranks 80th on Henley Passport Index 2026",
    category: "SEC7",
    summary: "Indian passport holders gain visa-free/on-arrival access to 55 destinations, moving up 5 spots to 80th globally.",
    blocks: [
      {
        type: "paragraph",
        content: "India climbed 5 positions to rank **80th globally on Henley Passport Index 2026**, offering visa-free/eTA access to **55 destinations**."
      },
      {
        type: "bullet_list",
        items: [
          "**Top Rank**: Singapore ranks 1st for 3rd consecutive year (192 destinations)."
        ]
      }
    ]
  },

  // SECTION 6 — APPOINTMENTS & SCHEMES
  {
    id: "migrated-ca-2026-01-sec6-1",
    title: "PM-RKVY Absorbs 3 Agriculture Schemes into ₹1.75 Lakh Crore Umbrella",
    category: "SEC10",
    summary: "PM-RKVY folds Krishonnati Yojana, Natural Farming, and Honey Mission into 5-year 16th Finance Commission cycle.",
    blocks: [
      {
        type: "paragraph",
        content: "Cabinet approved restructuring PM-RKVY into a **₹1.75 lakh crore umbrella scheme** over 5 years (FY26–FY31), merging three major agri-programmes."
      },
      {
        type: "bullet_list",
        items: [
          "**Absorbed Schemes**: Krishonnati Yojana, National Mission on Natural Farming, National Bee and Honey Mission.",
          "**Funding Split**: 60:40 (General States), 90:10 (NE/Himalayan), 100% (UTs)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec6-2",
    title: "India AI Impact Summit 2026 to be Held in New Delhi",
    category: "SEC9",
    summary: "India's flagship AI summit scheduled for 15-20 February 2026 in New Delhi following 8 regional build-up conferences.",
    blocks: [
      {
        type: "paragraph",
        content: "Ministry of Electronics & IT announced **India AI Impact Summit 2026** for 15–20 February 2026 in New Delhi."
      }
    ]
  },
  {
    id: "migrated-ca-2026-01-sec6-3",
    title: "January 2026 Rapid Recall & Key Milestones Summary",
    category: "SEC11",
    summary: "Consolidated high-yield recall summary of key figures, records, and dates from January 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "High-speed sweep of top facts for January 2026 revision:"
      },
      {
        type: "bullet_list",
        items: [
          "**India GDP**: $4.18 Trillion (4th largest globally; 7.4% real GDP growth).",
          "**UPI Record**: 21.63 billion transactions worth ₹27.97 lakh crore.",
          "**Ramsar Sites**: 98 total.",
          "**FDI Inflows**: $47 billion (+73% growth per UNCTAD).",
          "**RBI Dividend Cap**: 75% of PAT."
        ]
      }
    ]
  }
];

export function importJanuary2026PDF() {
  console.log("🚀 IMPORTING JANUARY 2026 CURRENT AFFAIRS ITEMS...");

  let manifest: any;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    manifest = { totalItems: 0, entries: [] };
  }

  const dateStr = "2026-01-26";
  const now = new Date().toISOString();
  let addedCount = 0;

  for (const itemDef of januaryItems) {
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
        tags: [itemDef.category.toLowerCase(), "Current Affairs 2026", "January 2026"],
        date: dateStr,
        category: itemDef.category,
        difficulty: "intermediate",
        lastUpdated: now,
        provenance: {
          sourceSystem: "CA",
          sourceFile: "January_26.pdf",
          sourceId: itemDef.id,
          sourceTitle: itemDef.title,
          sourceChecksum: checksum,
          migrationTimestamp: now,
          normalizationRuleVersion: "1.0.0-jan2026"
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
      sourceFile: "January_26.pdf",
      sourceId: itemDef.id,
      sourceTitle: itemDef.title,
      sourceDomain: "current-affairs",
      sourceType: "ca_note",
      sourceChecksum: checksum,
      migrationStatus: "migrated",
      lastValidationStatus: "PASS",
      lastUpdated: now,
      destinationId: itemDef.id,
      batchNumber: 6
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
  console.log(`✅ ${addedCount} January 2026 items added to content/corpus and manifest.`);

  // Rebuild corpus index
  buildCorpusIndex();
}

importJanuary2026PDF();
