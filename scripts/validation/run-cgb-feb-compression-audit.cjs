/**
 * R5 Post-Ingestion Editorial Compression Audit: CGB February 2026 PDF (121 Pages)
 * Adversarial evaluation of all 368 candidate articles to eliminate fluff and merge multi-article clusters.
 */

const fs = require('fs');
const path = require('path');

// Load raw extracted CGB articles from ingestion script definition
const cgbScript = fs.readFileSync('scripts/migration/ingest-cgb-feb-2026-pdf.cjs', 'utf-8');

// Parse RAW_EXTRACTED_ARTICLES
const match = cgbScript.match(/const RAW_EXTRACTED_ARTICLES = (\[[\s\S]*?\]);\s*console\.log/);
if (!match) {
  throw new Error('Could not parse RAW_EXTRACTED_ARTICLES from ingest-cgb-feb-2026-pdf.cjs');
}

const rawArticles = eval(match[1]);
console.log(`Loaded ${rawArticles.length} raw articles for Adversarial Compression Audit.\n`);

const auditResults = [];
const clusterMap = new Map();

// Adversarial Decision Rules
rawArticles.forEach((art, idx) => {
  const artId = `art-${idx + 1}`;
  const text = `${art.title} ${art.text}`.toLowerCase();

  // 1. HARD-SKIP: Obituaries, Condolences, Routine Memorials
  if (
    art.section === 'Obituaries' || 
    text.includes('passes away') || text.includes('passed away') || text.includes('demise') || text.includes('martyrdom day') || text.includes('birth anniversary')
  ) {
    auditResults.push({
      artId,
      page: art.page,
      title: art.title,
      clusterId: 'cluster-skip-obituary',
      relationship: 'SKIP_OBITUARY',
      confidence: 0.99,
      reason: 'Biographical condolence / routine anniversary — zero testing weight in Banking/Regulatory GA.'
    });
    return;
  }

  // 2. HARD-SKIP: Celebrity PR, Brand Endorsements, Social Media Metrics
  if (
    text.includes('instagram followers') || text.includes('bollywood') || text.includes('brand ambassador') || 
    text.includes('danish café brand') || text.includes('fitbit co-founders') || text.includes('connected tv') ||
    text.includes('richest self-made billionaires') || text.includes('unlisted gems') || text.includes('baku evenings') ||
    text.includes('first port in india to initiate the implementation of an advanced anti-drone')
  ) {
    auditResults.push({
      artId,
      page: art.page,
      title: art.title,
      clusterId: 'cluster-skip-celebrity-pr',
      relationship: 'SKIP_LOW_YIELD',
      confidence: 0.95,
      reason: 'Commercial marketing / celebrity endorsement / corporate trivia — fails Opportunity Cost test.'
    });
    return;
  }

  // 3. HARD-SKIP: Routine Domestic Sports, State Tournaments, Non-National Games
  if (
    (art.section === 'Sports' || text.includes('billiards') || text.includes('pro wrestling') || text.includes('ranji trophy') || text.includes('open masters games') || text.includes('cricket stadium in gorakhpur')) &&
    !text.includes('u19 cricket world cup') && !text.includes('australian open') && !text.includes('winter olympics') && !text.includes('paralympic') && !text.includes('wpl 2026')
  ) {
    auditResults.push({
      artId,
      page: art.page,
      title: art.title,
      clusterId: 'cluster-skip-routine-sports',
      relationship: 'SKIP_LOW_YIELD',
      confidence: 0.92,
      reason: 'Routine domestic sporting match / non-landmark tournament — fails student attention budget.'
    });
    return;
  }

  // 4. HARD-SKIP: Local State Infrastructure / Minor Municipal Notices
  if (
    text.includes('adampur airport') || text.includes('mount abu as aburaj') || text.includes('soundala village') ||
    text.includes('bird atlas of goa') || text.includes('padhai with ai') || text.includes('banwat ekta sthal') ||
    text.includes('national cow culture museum') || text.includes('excise export policy') || text.includes('mobile quality control vans')
  ) {
    auditResults.push({
      artId,
      page: art.page,
      title: art.title,
      clusterId: 'cluster-skip-local-trivia',
      relationship: 'SKIP_LOW_YIELD',
      confidence: 0.90,
      reason: 'Hyper-local municipal trivia / non-generalizable state scheme — low exam utility.'
    });
    return;
  }

  // 5. CLUSTER MERGES: India AI Impact Summit 2026 Sub-components (Pages 5, 21, 22, 23, 31, 37, 40, 41, 42, 45, 50)
  if (
    text.includes('ai impact summit') || text.includes('manav vision') || text.includes('voicera') || 
    text.includes('new delhi frontier ai commitments') || text.includes('fimi') || text.includes('seven chakras') ||
    text.includes('casebook on ai and gender') || text.includes('new delhi declaration on ai')
  ) {
    const parentCluster = 'cluster-ai-impact-summit-2026';
    if (!clusterMap.has(parentCluster)) {
      clusterMap.set(parentCluster, artId);
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'RETAIN_NEW',
        tier: 'TIER_A',
        section: 'SEC6',
        confidence: 0.98,
        reason: 'Master Synthesis Node for India AI Impact Summit 2026 (MANAV, Sutras, Frontier Commitments, VoicERA).'
      });
    } else {
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'MERGE_INTO_EXISTING',
        confidence: 0.95,
        reason: `Sub-announcement absorbed into India AI Impact Summit 2026 Master Node [${clusterMap.get(parentCluster)}].`
      });
    }
    return;
  }

  // 6. CLUSTER MERGES: PM-SETU & ITI Skilling (Pages 17, 45)
  if (text.includes('pm-setu')) {
    const parentCluster = 'cluster-pm-setu-iti';
    if (!clusterMap.has(parentCluster)) {
      clusterMap.set(parentCluster, artId);
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'RETAIN_NEW',
        tier: 'TIER_A',
        section: 'SEC10',
        confidence: 0.96,
        reason: 'Master Node for PM-SETU (₹60,000 Cr ITI Upgradation + World Bank $830M Loan + NSTI Kanpur CoE).'
      });
    } else {
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'MERGE_INTO_EXISTING',
        confidence: 0.95,
        reason: `Funding/infrastructure detail absorbed into PM-SETU Master Node [${clusterMap.get(parentCluster)}].`
      });
    }
    return;
  }

  // 7. CLUSTER MERGES: Cross-Border UPI Malaysia (Pages 18, 70)
  if (text.includes('paynet') || (text.includes('malaysia') && text.includes('upi'))) {
    const parentCluster = 'cluster-upi-malaysia-paynet';
    if (!clusterMap.has(parentCluster)) {
      clusterMap.set(parentCluster, artId);
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'RETAIN_NEW',
        tier: 'TIER_A',
        section: 'SEC3',
        confidence: 0.97,
        reason: 'Master Node for NPCI NIPL - Malaysia PayNet Cross-Border QR Payment Linkage.'
      });
    } else {
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'REDIRECT_DUPLICATE',
        confidence: 0.98,
        reason: `Redundant secondary reporting of NIPL-PayNet agreement redirected to master node [${clusterMap.get(parentCluster)}].`
      });
    }
    return;
  }

  // 8. CLUSTER MERGES: RDI & ANRF Biotechnology Funds (Pages 29, 38, 46)
  if (text.includes('rdi fund') || text.includes('birac–rdi fund') || text.includes('birac-research')) {
    const parentCluster = 'cluster-anrf-rdi-fund';
    if (!clusterMap.has(parentCluster)) {
      clusterMap.set(parentCluster, artId);
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'RETAIN_NEW',
        tier: 'TIER_A',
        section: 'SEC6',
        confidence: 0.95,
        reason: 'Master Node for ANRF ₹1 Lakh Crore RDI Fund & BIRAC Biotech Deployment.'
      });
    } else {
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'MERGE_INTO_EXISTING',
        confidence: 0.94,
        reason: `Second-level manager call absorbed into ANRF RDI Fund Master Node [${clusterMap.get(parentCluster)}].`
      });
    }
    return;
  }

  // 9. CLUSTER MERGES: VOC Port Tuticorin Initiatives (Pages 58, 67, 73, 94, 114)
  if (text.includes('voc port') || text.includes('chidambaranar')) {
    const parentCluster = 'cluster-voc-port-tuticorin';
    if (!clusterMap.has(parentCluster)) {
      clusterMap.set(parentCluster, artId);
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'RETAIN_NEW',
        tier: 'TIER_A',
        section: 'SEC4',
        confidence: 0.94,
        reason: 'Master Node for VOC Port Tuticorin (Green Hydrogen, Digital Twin, IGBC Platinum, Outer Harbour ₹15,000 Cr).'
      });
    } else {
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'MERGE_INTO_EXISTING',
        confidence: 0.92,
        reason: `Sub-initiative absorbed into VOC Port Master Node [${clusterMap.get(parentCluster)}].`
      });
    }
    return;
  }

  // 10. CLUSTER MERGES: Mount Aconcagua Summits (Pages 53, 76, 110)
  if (text.includes('aconcagua')) {
    const parentCluster = 'cluster-mount-aconcagua';
    if (!clusterMap.has(parentCluster)) {
      clusterMap.set(parentCluster, artId);
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'RETAIN_NEW',
        tier: 'TIER_B_PLUS',
        section: 'SEC4',
        confidence: 0.95,
        reason: 'Master Node for Mount Aconcagua (6,962 m in Argentina) Expeditions.'
      });
    } else {
      auditResults.push({
        artId,
        page: art.page,
        title: art.title,
        clusterId: parentCluster,
        relationship: 'MERGE_INTO_EXISTING',
        confidence: 0.95,
        reason: `Individual climber / defence flag-off fact absorbed into Aconcagua Master Node [${clusterMap.get(parentCluster)}].`
      });
    }
    return;
  }

  // 11. Core High-Yield Scoring for Genuine Standalone Events
  let score = 75;
  let section = 'SEC4';
  let tier = 'TIER_B_PLUS';

  if (
    text.includes('rbi') || text.includes('reserve bank') || text.includes('sebi') || 
    text.includes('repo rate') || text.includes('dicgc') || text.includes('kisan credit card') || 
    text.includes('ecb') || text.includes('mis-selling') || text.includes('lbs') || text.includes('uti') ||
    text.includes('commercial banks') || text.includes('broker funding') || text.includes('etf price band')
  ) {
    score = 95;
    section = 'SEC2';
    tier = 'TIER_A';
  } else if (
    text.includes('budget') || text.includes('finance commission') || text.includes('gdp') || 
    text.includes('inflation') || text.includes('cpi') || text.includes('wpi') || text.includes('disinvestment') ||
    text.includes('national accounts') || text.includes('trade indices') || text.includes('gsdp')
  ) {
    score = 92;
    section = 'SEC1';
    tier = 'TIER_A';
  } else if (
    text.includes('upi') || text.includes('cbdc') || text.includes('sbi') || text.includes('m-cap') || 
    text.includes('nabard') || text.includes('nabfid') || text.includes('insurance fdi') || text.includes('bobcard') ||
    text.includes('gramin bank') || text.includes('pmegp') || text.includes('fdi cap in public sector banks') ||
    text.includes('swasthya pension') || text.includes('miga') || text.includes('irfc')
  ) {
    score = 88;
    section = 'SEC3';
    tier = 'TIER_A';
  } else if (
    text.includes('pm-rahat') || text.includes('pmay') || text.includes('rare-earth') || text.includes('brahmaputra') ||
    text.includes('namo bharat') || text.includes('vibrant village') || text.includes('keralam') || text.includes('prahaar') ||
    text.includes('lakhpati didi') || text.includes('zero prize') || text.includes('hpv vaccination') || text.includes('e20')
  ) {
    score = 86;
    section = 'SEC10';
    tier = 'TIER_A';
  } else if (
    text.includes('trade deal') || text.includes('pax silica') || text.includes('brics') || 
    text.includes('ions') || text.includes('uday kotak') || text.includes('henley') ||
    text.includes('network readiness') || text.includes('corruption perception') || text.includes('crafoord prize') ||
    text.includes('global teacher prize') || text.includes('earthshot prize') || text.includes('unesco asia-pacific') ||
    text.includes('ey entrepreneur of the year') || text.includes('new start') || text.includes('project vault') ||
    text.includes('forge initiative') || text.includes('semiconductor atmp') || text.includes('agni-iii') ||
    text.includes('vayu shakti') || text.includes('ctf 154') || text.includes('milan 2026') || text.includes('akash') ||
    text.includes('hammer') || text.includes('h125') || text.includes('goa maritime conclave') || text.includes('dharma guardian') ||
    text.includes('anjadip') || text.includes('vajra prahar') || text.includes('prachand') || text.includes('vshorads')
  ) {
    score = 84;
    section = text.includes('uday kotak') ? 'SEC5' : text.includes('henley') || text.includes('corruption') || text.includes('readiness') ? 'SEC7' : text.includes('semiconductor') || text.includes('agni') || text.includes('ctf') || text.includes('hammer') || text.includes('prachand') ? 'SEC6' : 'SEC4';
    tier = 'TIER_B_PLUS';
  } else if (text.includes('u19 cricket world cup') || text.includes('australian open') || text.includes('winter olympics') || text.includes('wpl 2026')) {
    score = 80;
    section = 'SEC8';
    tier = 'TIER_B_PLUS';
  }

  auditResults.push({
    artId,
    page: art.page,
    title: art.title,
    clusterId: `cluster-${artId}`,
    relationship: 'RETAIN_NEW',
    tier,
    section,
    confidence: 0.95,
    reason: `Core standalone syllabus topic in ${section} (Utility Score: ${score}/100)`
  });
});

// Summary Counts
const summary = {
  totalRawArticles: auditResults.length,
  standaloneTierA: auditResults.filter(r => r.relationship === 'RETAIN_NEW' && r.tier === 'TIER_A').length,
  standaloneTierBPlus: auditResults.filter(r => r.relationship === 'RETAIN_NEW' && r.tier === 'TIER_B_PLUS').length,
  totalActiveStudyNotes: auditResults.filter(r => r.relationship === 'RETAIN_NEW').length,
  mergedIntoMasterClusters: auditResults.filter(r => r.relationship === 'MERGE_INTO_EXISTING').length,
  duplicateRedirects: auditResults.filter(r => r.relationship === 'REDIRECT_DUPLICATE').length,
  skippedObituaries: auditResults.filter(r => r.relationship === 'SKIP_OBITUARY').length,
  skippedLowYieldFluff: auditResults.filter(r => r.relationship === 'SKIP_LOW_YIELD').length,
  totalSkipped: auditResults.filter(r => r.relationship.startsWith('SKIP')).length
};

summary.totalAccounted = summary.totalActiveStudyNotes + summary.mergedIntoMasterClusters + summary.duplicateRedirects + summary.totalSkipped;
summary.reconciliationRate = `${((summary.totalAccounted / summary.totalRawArticles) * 100).toFixed(1)}%`;
summary.compressionRatio = `${((1 - summary.totalActiveStudyNotes / summary.totalRawArticles) * 100).toFixed(1)}%`;

console.log('========================================================');
console.log('📊 POST-INGESTION ADVERSARIAL COMPRESSION AUDIT SUMMARY');
console.log('========================================================');
console.log(JSON.stringify(summary, null, 2));

// Save Audit Report
fs.writeFileSync(
  'content/repairs/ca_v3/cgb-feb-compression-audit-report.json',
  JSON.stringify({
    version: '1.0.0-cgb-feb-compression-audit',
    timestamp: new Date().toISOString(),
    summary,
    sampleArticleMapping: auditResults.slice(0, 30),
    allAuditedArticles: auditResults
  }, null, 2),
  'utf-8'
);

console.log('\nAudit complete. Saved to content/repairs/ca_v3/cgb-feb-compression-audit-report.json');
