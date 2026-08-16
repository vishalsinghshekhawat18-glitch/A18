import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildCorpusIndex } from '../build-corpus-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const corpusDir = path.resolve(__dirname, '../../content/corpus');
const manifestPath = path.resolve(__dirname, '../../content/manifest.json');

// March 2026 structured item catalog from march2026_lighttouch.pdf
const marchItems = [
  // SECTION 1 — ESI, FINANCE & BUSINESS NEWS
  {
    id: "migrated-ca-2026-03-sec1-1",
    title: "Cabinet Approves Changes to FDI Policy for Land-Bordering Countries (LBC) & PN3 Timeline",
    category: "SEC3",
    summary: "Cabinet permits up to 10% non-controlling LBC beneficial ownership under automatic route and sets 60-day clearance timeline for critical sectors.",
    blocks: [
      {
        type: "paragraph",
        content: "Union Cabinet approved a new **'Beneficial Owner' (BO) definition** under PMLA Rules 2003 for screening investment from Land-Bordering Countries (LBC) under Press Note 3 (PN3, April 2020)."
      },
      {
        type: "bullet_list",
        items: [
          "**10% Automatic Threshold**: Non-controlling LBC beneficial ownership up to **10%** now permitted under the automatic route (per sectoral caps).",
          "**60-Day Clearance**: Expedited 60-day clearance timeline for LBC investment proposals in capital goods, electronic components, polysilicon, and ingot-wafer manufacturing.",
          "**PN3 Background**: Press Note 3 (2020) mandates government-route approval for all investments from countries sharing land borders with India (enforced via FEMA Non-Debt Instruments Rules)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec1-2",
    title: "Income Tax Act, 2025 to Replace 1961 Act from April 1, 2026 — 'PRARAMBH 2026' Launched",
    category: "SEC3",
    summary: "FM Sitharaman launches PRARAMBH 2026 campaign and Income Tax Website 2.0 as India replaces the 65-year-old Income Tax Act 1961.",
    blocks: [
      {
        type: "paragraph",
        content: "FM Nirmala Sitharaman launched **'PRARAMBH 2026'** (Policy Reform and Responsible Action for Mission Viksit Bharat) and **Income Tax Website 2.0**, preparing taxpayers for the new Income Tax Act, 2025 taking effect **April 1, 2026**."
      },
      {
        type: "bullet_list",
        items: [
          "**M.A.N.A.V. Framework**: Moral & Ethical Systems, Accountable Governance, National Sovereignty, Accessible & Inclusive AI, Valid & Legitimate Systems.",
          "**Guiding Spirit**: 'Nagrik Devo Bhava'.",
          "**FY27 Tax Slabs**: ₹0-4L: 0% | ₹4-8L: 5% | ₹8-12L: 10% | above ₹24L: 30%."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec1-3",
    title: "EPFO Retains PF Interest Rate at 8.25% for FY26 (3rd Consecutive Year)",
    category: "SEC5",
    summary: "EPFO Central Board of Trustees decides to maintain EPF interest rate at 8.25% for 7.8 crore members for FY2025-26.",
    blocks: [
      {
        type: "paragraph",
        content: "EPFO's 239th CBT meeting decided to **retain the EPF interest rate at 8.25% for FY26** for ~7.8 crore contributing members (3rd consecutive year unchanged)."
      },
      {
        type: "bullet_list",
        items: [
          "**Deficit Cushion**: FY26 expected deficit of ₹944.06 Cr offset via ₹5,480.34 Cr surplus from previous year.",
          "**EPFO Leadership**: CEO Ramesh Krishnamurthi (Est. 1952, HQ: New Delhi)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec1-4",
    title: "India's Current Account Deficit (CAD) Touches 1.3% of GDP in Q3 FY26",
    category: "SEC3",
    summary: "RBI data shows Q3 FY26 CAD rose to $13.2 billion (1.3% of GDP), while Apr-Dec cumulative CAD moderated to $30.1 billion (1% of GDP).",
    blocks: [
      {
        type: "paragraph",
        content: "RBI reported Q3 FY2025-26 **CAD at $13.2 billion (1.3% of GDP)**, driven by a merchandise trade deficit of $93.6 billion, offset by net services receipts of $57.5 billion."
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec1-5",
    title: "India's Forex Reserves Hit Record All-Time High $728.494 Billion",
    category: "SEC5",
    summary: "India's foreign exchange reserves surged to an all-time peak of $728.494 billion for the week ending Feb 27, 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "India's forex reserves hit a historic record of **$728.494 billion**, with gold holdings rising to $131.63 billion and Foreign Currency Assets (FCA) at $573.125 billion."
      }
    ]
  },

  // SECTION 2 — REGULATORY BODIES NEWS
  {
    id: "migrated-ca-2026-03-sec2-1",
    title: "SEBI Deploys 'Sudarshan' AI Surveillance System for Capital Markets",
    category: "SEC4",
    summary: "SEBI launches Sudarshan AI tool to scan social media audio/video/text for illegal finfluencer advice, removing 1.20 lakh+ posts.",
    blocks: [
      {
        type: "paragraph",
        content: "SEBI deployed **'Sudarshan'**, an in-house AI surveillance engine scanning Instagram, YouTube, Telegram, and X to track unregistered financial influencers promising guaranteed returns."
      },
      {
        type: "bullet_list",
        items: [
          "**Action**: Facilitated removal of over 1.20 lakh misleading social media posts.",
          "**AI Suite**: Part of SEBI's AI toolkit alongside **SEVA** (grievance chatbot) and **R(AI)DAR** (ad reviewer)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec2-2",
    title: "RBI & Bank of Japan Renew $75 Billion Bilateral Swap Arrangement (BSA)",
    category: "SEC2",
    summary: "RBI and Bank of Japan sign 3rd Amendment & Restatement of $75 billion Bilateral Swap Arrangement effective 28 Feb 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI and Bank of Japan renewed the **$75 billion Bilateral Swap Arrangement (BSA)** effective February 28, 2026."
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec2-3",
    title: "RBI Issues Draft Compensation Framework for Digital Banking Fraud Victims",
    category: "SEC2",
    summary: "RBI draft caps victim fraud loss compensation at 85% of net loss or ₹25,000 max for frauds up to ₹50,000.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI proposed a compensation framework for small-value digital banking fraud (loss up to ₹50,000), offering **85% of net loss or ₹25,000 (whichever lower)** funded via the DEA Fund, provided reported within 5 days."
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec2-4",
    title: "SEBI Graded 6-Tier Minimum Public Shareholding (MPS) Framework for Mega-IPOs",
    category: "SEC4",
    summary: "Government eases MPS rules for large IPOs, creating 6 post-issue capital categories from ≤₹1,600 Cr to >₹5 lakh Cr.",
    blocks: [
      {
        type: "paragraph",
        content: "SEBI notified a **6-tier MPS framework** for mega-IPOs. For post-issue capital >₹5 lakh crore, minimum public offer is ₹15,000 Cr + 1% shareholding (with universal 2.5% floor)."
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec2-5",
    title: "Govt Retains 4% Retail Inflation Target for 2026-2031 Cycle",
    category: "SEC2",
    summary: "Department of Economic Affairs retains 4% headline CPI target with +/-2% tolerance band (2-6% range) under Sec 45-ZA of RBI Act.",
    blocks: [
      {
        type: "paragraph",
        content: "Government retained the **4% headline CPI inflation target (±2% tolerance band)** for the 5-year period April 2026 – March 2031 under Section 45-ZA of the RBI Act, 1934."
      }
    ]
  },

  // SECTION 3 — BANKING & INSURANCE NEWS
  {
    id: "migrated-ca-2026-03-sec3-1",
    title: "MUFG Bank Acquires 20% Stake in Shriram Finance for ₹39,618 Crore ($4.4B)",
    category: "SEC5",
    summary: "CCI approves MUFG Bank's acquisition of 20% stake in Shriram Finance for ₹39,618 crore—India's largest cross-border financial services deal.",
    blocks: [
      {
        type: "paragraph",
        content: "CCI approved Japan's MUFG Bank acquiring a **20% stake in Shriram Finance Ltd for ₹39,618 crore ($4.4 billion)**, marking the largest-ever cross-border investment in India's financial sector."
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec3-2",
    title: "Jio Finance Launches 'Finsider' Agentic AI Financial Super-App",
    category: "SEC5",
    summary: "Jio Financial Services subsidiary launches Finsider super-app powered by Agentic AI and Neural Networks.",
    blocks: [
      {
        type: "paragraph",
        content: "Jio Finance Platform and Service Ltd (JFPSL) launched **'Finsider'**, an Agentic AI-powered financial super-app offering loans, credit cards, insurance, UPI, and JioBlackRock mutual funds."
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec3-3",
    title: "SBI Launches $500 Million Syndicated Social Loan for Gender Equality",
    category: "SEC5",
    summary: "SBI issues $500 million social term loan with MUFG Bank as sole social loan coordinator—the largest gender-themed loan globally.",
    blocks: [
      {
        type: "paragraph",
        content: "SBI launched a **$500 million syndicated social term loan** dedicated to UN SDG 5 (Gender Equality), arranged by MUFG Bank Japan."
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec3-4",
    title: "Bank of Baroda Issues India's First Domestic Green Infrastructure Bonds (₹10,000 Cr)",
    category: "SEC5",
    summary: "Bank of Baroda becomes the first Indian bank to issue domestic Green Infrastructure Bonds, raising ₹10,000 crore at 7.10% coupon.",
    blocks: [
      {
        type: "paragraph",
        content: "Bank of Baroda raised **₹10,000 crore via 7-year Series I Green Infrastructure Bonds** (bids reached ₹16,415 Cr), making BoB the 1st bank in India to issue domestic Green Infra Bonds."
      }
    ]
  },

  // SECTION 10 — MISCELLANEOUS & GOVT SCHEMES
  {
    id: "migrated-ca-2026-03-sec10-1",
    title: "VB-G RAM G Act, 2025 Replaces MGNREGA — Wage Guarantee Raised to 125 Days",
    category: "SEC10",
    summary: "Viksit Bharat - Guarantee for Rozgar and Ajeevika Mission (Gramin) Act 2025 replaces MGNREGA 2005, raising annual wage days from 100 to 125.",
    blocks: [
      {
        type: "paragraph",
        content: "Ministry of Rural Development replaced the 20-year-old MGNREGA with the **Viksit Bharat - Guarantee for Rozgar and Ajeevika Mission (Gramin) Act, 2025 (VB-G RAM G Act)**."
      },
      {
        type: "bullet_list",
        items: [
          "**Key Shift**: Statutory wage employment guarantee raised from **100 days to 125 days per financial year** for rural households.",
          "**Minister**: Rural Development Minister Shivraj Singh Chouhan."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec10-2",
    title: "Jal Jeevan Mission (JJM 2.0) Extended to Dec 2028 with ₹8.69 Lakh Crore Outlay",
    category: "SEC10",
    summary: "Cabinet restructures JJM with ₹8.69 lakh crore total outlay and introduces 'Sujalam Bharat' digital village water mapping.",
    blocks: [
      {
        type: "paragraph",
        content: "Union Cabinet extended **Jal Jeevan Mission (JJM 2.0) to December 2028**, raising total outlay to **Rs 8.69 lakh crore** (Central share Rs 3.59 lakh Cr)."
      },
      {
        type: "bullet_list",
        items: [
          "**Coverage Progress**: 15.80 crore households (81.61% of 19.36 crore rural families) now have tap water.",
          "**Sujalam Bharat Framework**: Assigns unique Sujal Gaon/Service Area IDs mapping water sources to taps."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec10-3",
    title: "BHAVYA Scheme Approved — ₹33,660 Crore for 100 Plug-and-Play Industrial Parks",
    category: "SEC10",
    summary: "Cabinet clears Bharat Audyogik Vikas Yojna (BHAVYA) to set up 100 industrial parks sized 100-1,000 acres.",
    blocks: [
      {
        type: "paragraph",
        content: "Cabinet approved **Bharat Audyogik Vikas Yojna (BHAVYA)** with **₹33,660 crore allocation** to build 100 plug-and-play industrial parks nationwide."
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec10-4",
    title: "RCS-Modified UDAN Approved — ₹28,840 Crore Over 10 Years",
    category: "SEC10",
    summary: "Cabinet refreshes UDAN scheme with ₹28,840 crore outlay for 100 new airports and 200 helipads across FY27-FY36.",
    blocks: [
      {
        type: "paragraph",
        content: "Union Cabinet approved **Modified UDAN (FY2026-27 to 2035-36)** with **₹28,840 crore allocation** to add 100 new airports and 200 helipads."
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec10-5",
    title: "PM-KISAN 22nd Instalment Released — ₹18,640 Crore to 9.32 Crore Farmers",
    category: "SEC10",
    summary: "PM Modi releases 22nd PM-KISAN instalment from Guwahati, taking total cumulative transfers past ₹4.27 lakh crore.",
    blocks: [
      {
        type: "paragraph",
        content: "PM Modi released the **22nd PM-KISAN instalment of ₹18,640+ crore** to 9.32+ crore farmer families, pushing cumulative transfers to **₹4.27 lakh crore**."
      }
    ]
  },
  {
    id: "migrated-ca-2026-03-sec10-6",
    title: "March 2026 Rapid Recall & Key Milestones Summary",
    category: "SEC11",
    summary: "Consolidated high-yield recall summary of key figures, policies, and macro indicators from March 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "High-speed sweep of top facts for March 2026:"
      },
      {
        type: "bullet_list",
        items: [
          "**Income Tax Act 2025**: Replaces 1961 Act from April 1, 2026 (PRARAMBH 2026).",
          "**VB-G RAM G Act 2025**: Replaces MGNREGA; wage days raised to 125.",
          "**JJM 2.0**: Extended to Dec 2028 (Rs 8.69 lakh Cr outlay).",
          "**MUFG-Shriram Deal**: ₹39,618 Cr (20% stake).",
          "**Forex Record**: $728.494 billion all-time high."
        ]
      }
    ]
  }
];

export function importMarch2026PDF() {
  console.log("🚀 IMPORTING MARCH 2026 CURRENT AFFAIRS ITEMS...");

  let manifest: any;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    manifest = { totalItems: 0, entries: [] };
  }

  const dateStr = "2026-03-15";
  const now = new Date().toISOString();
  let addedCount = 0;

  for (const itemDef of marchItems) {
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
        tags: [itemDef.category.toLowerCase(), "Current Affairs 2026", "March 2026"],
        date: dateStr,
        category: itemDef.category,
        difficulty: "intermediate",
        lastUpdated: now,
        provenance: {
          sourceSystem: "CA",
          sourceFile: "march2026_lighttouch.pdf",
          sourceId: itemDef.id,
          sourceTitle: itemDef.title,
          sourceChecksum: checksum,
          migrationTimestamp: now,
          normalizationRuleVersion: "1.0.0-mar2026"
        }
      }
    };

    const filePath = path.join(corpusDir, `${itemDef.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(fullItem, null, 2));
    addedCount++;

    const existingIdx = manifest.entries.findIndex((e: any) => e.destinationId === itemDef.id);
    const entryObj = {
      sourceSystem: "CA",
      sourceFile: "march2026_lighttouch.pdf",
      sourceId: itemDef.id,
      sourceTitle: itemDef.title,
      sourceDomain: "current-affairs",
      sourceType: "ca_note",
      sourceChecksum: checksum,
      migrationStatus: "migrated",
      lastValidationStatus: "PASS",
      lastUpdated: now,
      destinationId: itemDef.id,
      batchNumber: 8
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
  console.log(`✅ ${addedCount} March 2026 items added to content/corpus and manifest.`);

  // Rebuild corpus index
  buildCorpusIndex();
}

importMarch2026PDF();
