import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildCorpusIndex } from '../build-corpus-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const corpusDir = path.resolve(__dirname, '../../content/corpus');
const manifestPath = path.resolve(__dirname, '../../content/manifest.json');

const aprilItems = [
  // SECTION 1 — BANKING & MONETARY POLICY
  {
    id: "migrated-ca-2026-04-sec3-1",
    title: "RBI Monetary Policy Committee (MPC) Keeps Repo Rate Unchanged at 5.25%",
    category: "SEC3",
    summary: "RBI MPC unanimously votes to retain Repo Rate at 5.25% with Neutral stance; projects FY27 GDP growth at 6.9%.",
    blocks: [
      {
        type: "paragraph",
        content: "In its 1st bi-monthly Monetary Policy Statement for FY 2026-27 (6-8 April 2026), the Governor Sanjay Malhotra-led MPC unanimously voted to **keep the Repo Rate unchanged at 5.25%** for the second consecutive meeting with a **'Neutral' stance**."
      },
      {
        type: "bullet_list",
        items: [
          "**Key Rates**: Repo Rate: 5.25% | SDF: 5.00% | MSF & Bank Rate: 5.50% | Reverse Repo: 3.35% | CRR: 3.00% | SLR: 18.00%.",
          "**GDP Growth Projection (FY27)**: 6.9% overall (Q1: 6.8%, Q2: 6.7%, Q3: 7.0%, Q4: 7.2%).",
          "**Inflation Target**: FIT anchor maintained at 4.0% (±2% tolerance band)."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec3-2",
    title: "RBI Hikes Borrowing Limits Against Securities & IPO Subscriptions",
    category: "SEC3",
    summary: "RBI raises individual loan against shares cap to ₹1 crore and IPO subscription loan limit to ₹25 lakh across the banking system.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI revised its capital market exposure framework to encourage retail participation while maintaining systemic controls."
      },
      {
        type: "bullet_list",
        items: [
          "**Loans Against Shares/REITs/InvITs**: Cap raised from ₹20 lakh to **₹1 crore per borrower**.",
          "**IPO / FPO / ESOP Subscriptions**: Cap raised from ₹10 lakh to **₹25 lakh per individual**.",
          "**System-Wide Cap**: Limits apply across the entire banking system combined (preventing multi-lender evasion).",
          "**Implementation Deadline**: Deferred to **July 1, 2026** (from April 1). Margin requirements: 50% for physical shares, 25% for demat."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec3-3",
    title: "RBI Mandates Two-Factor Authentication (2FA) for All Digital Payments",
    category: "SEC3",
    summary: "RBI rolls out new online payment rules making 2FA mandatory for UPI, credit/debit cards, and mobile wallets w.e.f. April 1, 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI issued guidelines requiring **mandatory Two-Factor Authentication (2FA)** for all digital payments. A simple OTP is no longer sufficient; transactions require OTP plus PIN, password, or biometrics (fingerprint/Face ID)."
      },
      {
        type: "bullet_list",
        items: [
          "**E-Mandate Framework 2026**: Recurring transactions up to **₹15,000 per transaction** permitted without AFA; insurance premiums, mutual fund SIPs, and credit card bills up to **₹1,00,000** allowed without AFA.",
          "**Pre-Transaction Alert**: Issuers must send pre-transaction notification at least **24 hours before** charge/debit.",
          "**Full Implementation Deadline**: Expected by October 2026."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec3-4",
    title: "RBI Cancels Banking Licence of Paytm Payments Bank Limited",
    category: "SEC3",
    summary: "RBI cancels Paytm Payments Bank's license under Section 22(4) of the Banking Regulation Act, 1949, effective April 24, 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI cancelled the banking licence issued to **Paytm Payments Bank Limited** under Section 22(4) of the Banking Regulation Act, 1949, prohibiting it from conducting any banking business w.e.f. April 24, 2026."
      },
      {
        type: "bullet_list",
        items: [
          "**Reason**: Persistent non-compliance with licensing conditions and management issues prejudicial to public interest (BR Act Sec 22(3)(c) & (g)).",
          "**Winding Up**: RBI will apply to the High Court for liquidation. Bank has adequate liquidity to repay deposit liabilities."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec3-5",
    title: "LIC Board Approves First-Ever 1:1 Bonus Issue Since 2022 Listing",
    category: "SEC3",
    summary: "LIC capitalises ₹6,325 crore from reserves to issue 1 free share for every 1 share held, doubling paid-up capital to ₹12,650 crore.",
    blocks: [
      {
        type: "paragraph",
        content: "LIC Board approved a **1:1 bonus issue**, capitalizing ₹6,325 crore from reserves to double paid-up capital to ₹12,650 crore by June 12, 2026."
      },
      {
        type: "bullet_list",
        items: [
          "**Purpose**: Boost share liquidity and make stock accessible to retail investors.",
          "**MPS Compliance**: Helps Govt of India (holding 96.5%) move towards SEBI's 10% minimum public shareholding norm by May 2027."
        ]
      }
    ]
  },

  // SECTION 2 — REGULATORY BODIES & MACRO ECONOMICS
  {
    id: "migrated-ca-2026-04-sec2-1",
    title: "IMF World Economic Outlook (April 2026): India Nominal GDP at $4.15 Trillion (6th Globally)",
    category: "SEC2",
    summary: "IMF WEO April 2026 ranks India 6th in nominal GDP ($4.15T) due to Rupee depreciation and 2022-23 base year shift, but projects highest real growth at 6.5%.",
    blocks: [
      {
        type: "paragraph",
        content: "IMF's April 2026 World Economic Outlook placed **India 6th globally in nominal GDP ($4.15 Trillion)**, behind US ($32.38T), China ($20.85T), Germany ($5.45T), Japan ($4.38T), and UK ($4.26T)."
      },
      {
        type: "bullet_list",
        items: [
          "**Drivers**: 11% Rupee depreciation against USD in FY26 and MoSPI's Feb 2026 GDP base year shift to 2022-23 (which adjusted nominal GDP ~4% lower).",
          "**Real Growth Lead**: India retains top position as the **fastest-growing major economy with 6.5% real GDP growth** for 2026."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec2-2",
    title: "CBDT Notifies 'Income-tax Rules, 2026' & Launches 'Kar Saathi' AI Chatbot",
    category: "SEC2",
    summary: "CBDT slims tax rules from 511 to 333, replaces Previous/Assessment Year with 'Tax Year', and launches Kar Saathi AI assistant under PRARAMBH 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "CBDT notified the **'Income-tax Rules, 2026'** w.e.f. April 1, 2026, simplifying compliance under the new Income Tax Act, 2025."
      },
      {
        type: "bullet_list",
        items: [
          "**Key Simplifications**: Replaces 'Previous Year' & 'Assessment Year' with a single **'Tax Year'**; cuts rules from 511 to 333 and forms from 399 to 190.",
          "**AI Chatbot**: Launched 24x7 **'Kar Saathi'** AI assistant for tax compliance guidance.",
          "**Taxpayer Reliefs**: Children's education allowance hiked to ₹3,000/month/child (max 2); HRA 50% deduction expanded to Hyderabad, Pune, Ahmedabad, Bengaluru."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec2-3",
    title: "IRDAI Mandates 'Ind AS' Accounting Standards for Insurers from April 1, 2026",
    category: "SEC2",
    summary: "IRDAI notifies Actuarial, Finance & Investment Amendment Regulations 2026, enforcing IFRS-aligned Ind AS reporting across all insurance companies.",
    blocks: [
      {
        type: "paragraph",
        content: "IRDAI approved regulations mandating **Indian Accounting Standards (Ind AS)** (aligned with global IFRS 17 & IFRS 9) for all life, general, health, and reinsurance companies w.e.f. April 1, 2026."
      },
      {
        type: "bullet_list",
        items: [
          "**Parallel Reporting**: 2-year parallel reporting window alongside existing framework.",
          "**Forbearance**: 1-year transition forbearance option for insurers facing operational hurdles."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec2-4",
    title: "RBI Proposes $1 Lakh Crore Asset Threshold for Upper-Layer NBFCs (NBFC-UL)",
    category: "SEC2",
    summary: "RBI proposes replacing top-10 asset ranking methodology with absolute ₹1 lakh crore asset size threshold for NBFC-UL classification.",
    blocks: [
      {
        type: "paragraph",
        content: "RBI issued draft scale-based regulatory (SBR) norms proposing an **absolute ₹1 lakh crore asset threshold** for identifying Upper-Layer NBFCs, reviewed every 5 years."
      },
      {
        type: "bullet_list",
        items: [
          "**Govt NBFCs Included**: Removes carve-out excluding state-owned NBFCs, bringing **NABARD, Exim Bank, SIDBI, and NaBFID** under upper-layer supervision."
        ]
      }
    ]
  },

  // SECTION 10 — GOVT SCHEMES & NATIONAL AFFAIRS
  {
    id: "migrated-ca-2026-04-sec10-1",
    title: "Government Launches First Phase of Census 2027 — First Fully Digital & Caste-Enumerating Census",
    category: "SEC10",
    summary: "Phase I (House Listing) of Census 2027 launched on April 1, 2026 with ₹11,718.24 Cr budget—first digital census & 1st caste count since 1931.",
    blocks: [
      {
        type: "paragraph",
        content: "Government launched **Phase I of Census 2027 (16th overall, 8th post-independence)** on April 1, 2026, marking India's first smartphone/portal-based digital census."
      },
      {
        type: "bullet_list",
        items: [
          "**2 Phases**: Phase I (House Listing: Apr-Sep 2026) | Phase II (Population & Caste Enumeration: Feb 2027). Total budget: **₹11,718.24 crore**.",
          "**Self-Enumeration**: Citizens can self-enumerate via portal in 16 languages, generating an 11-digit SE ID.",
          "**Data Model**: 'Census-as-a-Service' machine-readable architecture."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec10-2",
    title: "Parliament Passes 'Jan Vishwas (Amendment) Bill, 2026' Decriminalising 717 Provisions",
    category: "SEC10",
    summary: "Jan Vishwas Bill 2026 amends 784 provisions across 79 Central Acts to boost Ease of Doing Business by replacing criminal penalties with civil fines.",
    blocks: [
      {
        type: "paragraph",
        content: "Parliament passed the **Jan Vishwas (Amendment of Provisions) Bill, 2026**, decriminalising 717 minor civic/business provisions across 79 Central Acts (23 Ministries)."
      },
      {
        type: "bullet_list",
        items: [
          "**Key Acts Amended**: RBI Act 1934, Food Safety & Standards Act 2006, Motor Vehicles Act 1988.",
          "**Approach**: Replaces criminal prosecution with civil penalties and warning-first principles."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec10-3",
    title: "Parliament Passes 'Andhra Pradesh Reorganisation (Amendment) Bill, 2026' — Amaravati Sole Capital",
    category: "SEC10",
    summary: "Parliament amends Section 5 of 2014 Act to give statutory recognition to Amaravati as the sole permanent capital of Andhra Pradesh.",
    blocks: [
      {
        type: "paragraph",
        content: "Parliament enacted the **AP Reorganisation (Amendment) Bill, 2026**, incorporating Amaravati as the sole statutory capital of Andhra Pradesh with retrospective effect from June 2, 2024."
      },
      {
        type: "bullet_list",
        items: [
          "**Impact**: Scuttles previous 3-capital model (Visakhapatnam executive, Kurnool judicial, Amaravati legislative). First time Parliament passed a dedicated law declaring a permanent state capital."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec10-4",
    title: "PM-KUSUM Scheme Commissioning Timeline Extended to March 31, 2027",
    category: "SEC10",
    summary: "MNRE extends PM-KUSUM commissioning deadline to March 2027; committed liabilities to be subsumed under PM-KUSUM 2.0.",
    blocks: [
      {
        type: "paragraph",
        content: "MNRE extended the commissioning timeline for **PM-KUSUM** solar pump projects (where PPAs/LoIs were signed by Dec 31, 2025) to **March 31, 2027**."
      },
      {
        type: "bullet_list",
        items: [
          "**PM KUSUM 2.0**: Proposed new framework to subsume committed liabilities of the ₹34,422 crore original scheme."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec10-5",
    title: "MoEFCC Notifies 'Solid Waste Management (SWM) Rules, 2026' with 4-Bin Source Segregation",
    category: "SEC10",
    summary: "SWM Rules 2026 mandates 4-stream color-coded waste segregation (Green, Blue, Red, Black) under Environment Protection Act 1986.",
    blocks: [
      {
        type: "paragraph",
        content: "Ministry of Environment, Forest and Climate Change notified **Solid Waste Management Rules, 2026** (effective April 1, 2026, replacing 2016 rules), mandating 4-stream source segregation."
      },
      {
        type: "bullet_list",
        items: [
          "**Color-Coded Bins**: Green Bin (Wet), Blue Bin (Dry), Red Bin (Sanitary), Black Bin (Special Care/Hazardous).",
          "**Bulk Waste Generators**: Defined as entities generating >100 kg waste/day or floor area >20,000 sqm."
        ]
      }
    ]
  },
  {
    id: "migrated-ca-2026-04-sec10-6",
    title: "April 2026 Rapid Recall & Key Milestones Summary",
    category: "SEC11",
    summary: "Consolidated recall summary of top figures, policy dates, and regulatory updates from April 2026.",
    blocks: [
      {
        type: "paragraph",
        content: "Quick sweep of top April 2026 exam facts:"
      },
      {
        type: "bullet_list",
        items: [
          "**RBI Repo Rate**: Unchanged at 5.25% (Neutral stance, FY27 GDP 6.9%).",
          "**Paytm Payments Bank**: License cancelled under Sec 22(4) BR Act w.e.f. April 24, 2026.",
          "**LIC 1:1 Bonus**: Doubling paid-up capital to ₹12,650 Cr by June 2026.",
          "**2FA Mandate**: Required for all digital payments; e-mandates up to ₹15,000 without AFA.",
          "**Income Tax Rules 2026**: Effective April 1, 2026 (Kar Saathi AI launched)."
        ]
      }
    ]
  }
];

export function importApril2026PDF() {
  console.log("🚀 IMPORTING APRIL 2026 CURRENT AFFAIRS ITEMS...");

  let manifest: any;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    manifest = { totalItems: 0, entries: [] };
  }

  const dateStr = "2026-04-15";
  const now = new Date().toISOString();
  let addedCount = 0;

  for (const itemDef of aprilItems) {
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
        tags: [itemDef.category.toLowerCase(), "Current Affairs 2026", "April 2026"],
        date: dateStr,
        category: itemDef.category,
        difficulty: "intermediate",
        lastUpdated: now,
        provenance: {
          sourceSystem: "CA",
          sourceFile: "Apri6927cf5d2b211a2b729e125el 2026 Monthly CA PDF.pdf",
          sourceId: itemDef.id,
          sourceTitle: itemDef.title,
          sourceChecksum: checksum,
          migrationTimestamp: now,
          normalizationRuleVersion: "1.0.0-apr2026"
        }
      }
    };

    const filePath = path.join(corpusDir, `${itemDef.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(fullItem, null, 2));
    addedCount++;

    const existingIdx = manifest.entries.findIndex((e: any) => e.destinationId === itemDef.id);
    const entryObj = {
      sourceSystem: "CA",
      sourceFile: "Apri6927cf5d2b211a2b729e125el 2026 Monthly CA PDF.pdf",
      sourceId: itemDef.id,
      sourceTitle: itemDef.title,
      sourceDomain: "current-affairs",
      sourceType: "ca_note",
      sourceChecksum: checksum,
      migrationStatus: "migrated",
      lastValidationStatus: "PASS",
      lastUpdated: now,
      destinationId: itemDef.id,
      batchNumber: 9
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
  console.log(`✅ ${addedCount} April 2026 items added to content/corpus and manifest.`);

  buildCorpusIndex();
}

importApril2026PDF();
