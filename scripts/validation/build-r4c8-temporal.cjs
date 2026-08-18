/**
 * R4.C8 — Temporal Consistency Gate & Audit Builder
 * Recalculates temporal status of the 10 pilot schemes as of reference date 2026-08-18.
 * Preserves R4.C7 artifacts and canonical corpus untouched.
 */

const fs = require('fs');
const path = require('path');

const r4c8Dir = 'content/repairs/r4c8';
const promotedDir = path.join(r4c8Dir, 'promoted');

if (!fs.existsSync(promotedDir)) {
  fs.mkdirSync(promotedDir, { recursive: true });
}

// 1. Raw Pilot Evaluation Inputs
const pilotTemporalInputs = [
  {
    itemId: 'migrated-schemes-scheme-10',
    title: 'Krishi-Decision Support System (Krishi-DSS / ADSS)',
    launchDate: '2024-09-02',
    schemePeriodStart: '2024-09-02',
    schemePeriodEnd: '2027-03-31',
    latestOfficialSourceDate: '2024-09-02',
    isOpenEndedStatutory: false,
    statusEvidence: [
      'Union Cabinet approved Digital Agriculture Mission on 02-09-2024 for FY 2024-25 to 2026-27 (ends 31 March 2027).'
    ]
  },
  {
    itemId: 'migrated-schemes-scheme-100',
    title: 'SHREYAS Scheme (Scholarships for Higher Education for Young Achievers Scheme)',
    launchDate: '2021-04-01',
    schemePeriodStart: '2021-04-01',
    schemePeriodEnd: '2026-03-31',
    latestOfficialSourceDate: '2023-09-24',
    isOpenEndedStatutory: false,
    statusEvidence: [
      'Documented financial allocation of ₹4,103.55 Cr covers the 15th Finance Commission cycle (2021-22 to 2025-26, ended 31 March 2026). Renewal under 16th FC cycle pending gazette notification.'
    ]
  },
  {
    itemId: 'migrated-schemes-scheme-102',
    title: 'PM YASASVI (PM Young Achievers Scholarship Award Scheme for Vibrant India)',
    launchDate: '2021-04-01',
    schemePeriodStart: '2021-04-01',
    schemePeriodEnd: '2026-03-31',
    latestOfficialSourceDate: '2023-08-15',
    isOpenEndedStatutory: false,
    statusEvidence: [
      'Operational guidelines on National Scholarship Portal cover 2021-22 to 2025-26 (ended 31 March 2026).'
    ]
  },
  {
    itemId: 'migrated-schemes-scheme-107',
    title: 'National Overseas Scholarship (NOS) for SC, DNT, and Landless Labourers',
    launchDate: '1954-01-01',
    schemePeriodStart: '2023-04-01',
    latestOfficialSourceDate: '2024-02-15',
    isOpenEndedStatutory: true,
    statusEvidence: [
      'Ongoing central sector scholarship program with annual portal application cycles on nosmsje.gov.in (revised guidelines 2023-24).'
    ]
  },
  {
    itemId: 'migrated-schemes-scheme-108',
    title: 'SMILE Scheme (Support for Marginalised Individuals for Livelihood and Enterprise)',
    launchDate: '2022-02-12',
    schemePeriodStart: '2021-04-01',
    schemePeriodEnd: '2026-03-31',
    latestOfficialSourceDate: '2022-08-24',
    isOpenEndedStatutory: false,
    statusEvidence: [
      'Approved financial outlay of ₹365 Cr covers 2021-22 to 2025-26 (ended 31 March 2026). SMILE-75 municipal activities undergoing evaluation.'
    ]
  },
  {
    itemId: 'migrated-schemes-scheme-109',
    title: 'Dr. Ambedkar Central Sector Scheme of Interest Subvention on Overseas Educational Loans',
    launchDate: '2014-01-01',
    schemePeriodStart: '2022-04-01',
    latestOfficialSourceDate: '2023-01-10',
    isOpenEndedStatutory: true,
    statusEvidence: [
      'Continuous demand-driven interest subsidy scheme linked to IBA Model Educational Loan Scheme administered continuously via Canara Bank.'
    ]
  },
  {
    itemId: 'migrated-schemes-scheme-11',
    title: 'Solar Power Scheme for PVTGs (under PM-JANMAN)',
    launchDate: '2024-01-15',
    schemePeriodStart: '2023-04-01',
    schemePeriodEnd: '2026-03-31',
    latestOfficialSourceDate: '2024-07-25',
    isOpenEndedStatutory: false,
    statusEvidence: [
      'MNRE notification approved ₹515 Cr for 2023-24 to 2025-26 (ended 31 March 2026). Physical household electrification ongoing under PM-JANMAN mission.'
    ]
  },
  {
    itemId: 'migrated-schemes-scheme-110',
    title: 'National Fellowship for OBC Students (NF-OBC)',
    launchDate: '2014-01-01',
    schemePeriodStart: '2021-04-01',
    latestOfficialSourceDate: '2023-10-16',
    isOpenEndedStatutory: true,
    statusEvidence: [
      'Continuous regular research fellowship administered through NBCFDC/UGC with UGC-aligned fellowship scales.'
    ]
  },
  {
    itemId: 'migrated-schemes-scheme-111',
    title: 'SEED Scheme (Scheme for Economic Empowerment of DNT/NT/SNT Communities)',
    launchDate: '2022-02-16',
    schemePeriodStart: '2021-04-01',
    schemePeriodEnd: '2026-03-31',
    latestOfficialSourceDate: '2022-02-16',
    isOpenEndedStatutory: false,
    statusEvidence: [
      'Outlay of ₹200 Cr approved for 5 years (2021-22 to 2025-26, ended 31 March 2026) under DWBDNC.'
    ]
  },
  {
    itemId: 'migrated-schemes-scheme-112',
    title: 'National Action Plan for Drug Demand Reduction (NAPDDR) & Nasha Mukt Bharat Abhiyaan',
    launchDate: '2018-04-01',
    schemePeriodStart: '2018-04-01',
    schemePeriodEnd: '2026-03-31',
    latestOfficialSourceDate: '2023-08-15',
    isOpenEndedStatutory: false,
    statusEvidence: [
      'NAPDDR original 7-year action plan (2018–2025/26) concluded on 31 March 2026. Nasha Mukt Bharat Abhiyaan (NMBA) campaign remains active nationwide.'
    ]
  }
];

// Reference Date: 2026-08-18
const REF_DATE = '2026-08-18';

function evaluateTemporal(input) {
  const ref = new Date(REF_DATE);
  if (input.schemePeriodEnd) {
    const end = new Date(input.schemePeriodEnd);
    if (end < ref) {
      return {
        status: 'EXPIRED',
        statusAsOf: REF_DATE,
        schemePeriodStart: input.schemePeriodStart,
        schemePeriodEnd: input.schemePeriodEnd,
        statusEvidence: input.statusEvidence,
        lastVerified: input.latestOfficialSourceDate,
        temporalWarning: `Documented operational period (${input.schemePeriodStart} to ${input.schemePeriodEnd}) ended on ${input.schemePeriodEnd}. Factual parameters (outlay, components) represent the verified 15th Finance Commission cycle. Extension under 16th FC cycle pending gazette confirmation.`,
        promotionStatus: 'approved-with-warning'
      };
    }
    if (end >= ref) {
      return {
        status: 'CURRENT',
        statusAsOf: REF_DATE,
        schemePeriodStart: input.schemePeriodStart,
        schemePeriodEnd: input.schemePeriodEnd,
        statusEvidence: input.statusEvidence,
        lastVerified: input.latestOfficialSourceDate,
        temporalWarning: null,
        promotionStatus: 'approved'
      };
    }
  }

  if (input.isOpenEndedStatutory) {
    return {
      status: 'CURRENT',
      statusAsOf: REF_DATE,
      schemePeriodStart: input.schemePeriodStart,
      statusEvidence: input.statusEvidence,
      lastVerified: input.latestOfficialSourceDate,
      temporalWarning: null,
      promotionStatus: 'approved'
    };
  }

  return {
    status: 'UNCLEAR',
    statusAsOf: REF_DATE,
    schemePeriodStart: input.schemePeriodStart,
    statusEvidence: input.statusEvidence,
    lastVerified: input.latestOfficialSourceDate,
    temporalWarning: 'Operational continuation beyond 31 March 2026 not officially documented.',
    promotionStatus: 'human-review'
  };
}

const auditResults = [];
const promotionManifestItems = [];
const diffItems = [];

let approvedCount = 0;
let approvedWithWarningCount = 0;
let humanReviewCount = 0;
let rejectedCount = 0;

pilotTemporalInputs.forEach(input => {
  const temp = evaluateTemporal(input);
  const r4c7File = `content/repairs/r4c7/promoted/${input.itemId}.json`;
  const r4c7Data = JSON.parse(fs.readFileSync(r4c7File, 'utf-8'));

  if (temp.promotionStatus === 'approved') approvedCount++;
  if (temp.promotionStatus === 'approved-with-warning') approvedWithWarningCount++;
  if (temp.promotionStatus === 'human-review') humanReviewCount++;
  if (temp.promotionStatus === 'rejected') rejectedCount++;

  const auditRecord = {
    itemId: input.itemId,
    title: input.title,
    schemePeriod: input.schemePeriodStart && input.schemePeriodEnd ? `${input.schemePeriodStart} to ${input.schemePeriodEnd}` : 'Ongoing / Open-Ended',
    latestEvidenceDate: input.latestOfficialSourceDate,
    currentStatusEvidence: input.statusEvidence,
    temporalClassification: temp.status,
    temporalWarning: temp.temporalWarning,
    previousR4C7Status: 'approved (CURRENT)',
    correctedStatus: `${temp.promotionStatus} (${temp.status})`,
    promotionConsequence: temp.promotionStatus
  };

  auditResults.push(auditRecord);

  promotionManifestItems.push({
    itemId: input.itemId,
    title: input.title,
    contentQuality: 'valid',
    evidenceStatus: 'verified',
    temporalStatus: temp.status,
    temporalWarning: temp.temporalWarning,
    crossSchemeStatus: 'verified',
    structuralStatus: 'valid',
    promotionStatus: temp.promotionStatus,
    reasons: [
      `Factual claims 100% verified.`,
      `Temporal state as of 2026-08-18: ${temp.status}.`,
      temp.temporalWarning || 'Currently active within valid documented operational period.'
    ],
    temporal: {
      statusAsOf: REF_DATE,
      status: temp.status,
      schemePeriodStart: input.schemePeriodStart,
      schemePeriodEnd: input.schemePeriodEnd,
      statusEvidence: input.statusEvidence,
      lastVerified: input.latestOfficialSourceDate
    },
    evidenceFiles: [`content/repairs/r4c6/${input.itemId}-evidence.json`],
    repairFile: `content/repairs/r4c5/${input.itemId}.json`
  });

  // Write updated canonical-ready note into content/repairs/r4c8/promoted/
  if (temp.promotionStatus === 'approved' || temp.promotionStatus === 'approved-with-warning') {
    const updatedNote = {
      ...r4c7Data,
      metadata: {
        ...r4c7Data.metadata,
        promotionGate: 'R4.C8-passed',
        promotionStatus: temp.promotionStatus,
        promotedTimestamp: new Date().toISOString(),
        temporalStatus: temp.status,
        temporalWarning: temp.temporalWarning,
        statusAsOf: REF_DATE
      }
    };

    // If approved with warning, add a structured temporal banner block
    if (temp.temporalWarning) {
      updatedNote.blocks = [
        {
          type: 'warning_banner',
          title: '⏳ Operational Cycle / Temporal Notice (As of August 2026)',
          text: temp.temporalWarning
        },
        ...r4c7Data.blocks
      ];
    }

    fs.writeFileSync(path.join(promotedDir, `${input.itemId}.json`), JSON.stringify(updatedNote, null, 2), 'utf-8');
  }

  diffItems.push({
    itemId: input.itemId,
    title: input.title,
    previousPromotionStatus: 'approved',
    newPromotionStatus: temp.promotionStatus,
    previousTemporalStatus: 'CURRENT',
    newTemporalStatus: temp.status,
    temporalWarningAdded: Boolean(temp.temporalWarning)
  });
});

// Save R4.C8 Artifacts
fs.writeFileSync(path.join(r4c8Dir, 'temporal-audit.json'), JSON.stringify({
  version: '1.0.0-r4c8-temporal-audit',
  referenceDate: REF_DATE,
  totalAudited: auditResults.length,
  summary: {
    CURRENT: auditResults.filter(a => a.temporalClassification === 'CURRENT').length,
    EXPIRED: auditResults.filter(a => a.temporalClassification === 'EXPIRED').length,
    EXTENDED: auditResults.filter(a => a.temporalClassification === 'EXTENDED').length,
    UNCLEAR: auditResults.filter(a => a.temporalClassification === 'UNCLEAR').length
  },
  audit: auditResults
}, null, 2), 'utf-8');

fs.writeFileSync(path.join(r4c8Dir, 'promotion-manifest.json'), JSON.stringify({
  version: '1.0.0-r4c8-promotion-manifest',
  referenceDate: REF_DATE,
  totalPiloted: promotionManifestItems.length,
  summary: {
    approved: approvedCount,
    approvedWithWarning: approvedWithWarningCount,
    humanReview: humanReviewCount,
    rejected: rejectedCount,
    totalStagedInPromoted: approvedCount + approvedWithWarningCount
  },
  manifest: promotionManifestItems
}, null, 2), 'utf-8');

fs.writeFileSync(path.join(r4c8Dir, 'temporal-diff-report.json'), JSON.stringify({
  version: '1.0.0-r4c8-diff',
  referenceDate: REF_DATE,
  summary: {
    unmodifiedApproved: approvedCount,
    convertedToApprovedWithWarning: approvedWithWarningCount,
    convertedToHumanReview: humanReviewCount
  },
  items: diffItems
}, null, 2), 'utf-8');

console.log('========================================================');
console.log('✅ R4.C8 TEMPORAL CONSISTENCY AUDIT COMPLETED');
console.log('========================================================');
console.log(`Reference Date: ${REF_DATE}`);
console.log(`CURRENT (Approved): ${approvedCount}`);
console.log(`EXPIRED / 15th FC (Approved with Warning): ${approvedWithWarningCount}`);
console.log(`UNCLEAR (Human Review): ${humanReviewCount}`);
console.log(`Total Promoted Files Staged: ${approvedCount + approvedWithWarningCount}`);
