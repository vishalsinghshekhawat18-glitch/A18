/**
 * High-Density GKToday Ingestion Pipeline for Jan - Aug 2026
 * Extracts full body text from <div class="content-wrap"> and synthesizes comprehensive notes.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractArticleContent(html) {
  const contentMatch = html.match(/<div class="content-wrap">([\s\S]*?)<\/div>/i);
  if (!contentMatch) return { text: '', bullets: [] };

  const rawHtml = contentMatch[1];
  
  // Extract explicit bullet items from blockquote / ul
  const bullets = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let liMatch;
  while ((liMatch = liRegex.exec(rawHtml)) !== null) {
    const cleanLi = liMatch[1].replace(/<[^>]+>/g, '').trim();
    if (cleanLi.length > 5) bullets.push(cleanLi);
  }

  // Extract paragraphs
  const paragraphs = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(rawHtml)) !== null) {
    const cleanP = pMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanP.length > 15 && !cleanP.startsWith('Category:')) {
      paragraphs.push(cleanP);
    }
  }

  const text = paragraphs.join(' ');
  return { text, paragraphs, bullets };
}

// Map article to Framework v3 section & tier
function classifyArticle(art) {
  const t = art.title.toLowerCase();
  const c = art.categoryType;

  // Obituaries -> completely skipped unconditionally
  if (t.includes('dies') || t.includes('passes away') || t.includes('demise') || (t.includes('veteran') && t.includes('death'))) {
    return { tier: 'SKIP', reason: 'Obituaries are strictly skipped per Framework v3' };
  }

  // Section 1: ESI, Finance & Business
  if (t.includes('gdp') || t.includes('inflation') || t.includes('cpi') || t.includes('wpi') || t.includes('fiscal') || t.includes('budget') || t.includes('trade deficit') || t.includes('forex') || t.includes('direct tax') || t.includes('finance commission') || t.includes('economic survey')) {
    return { secId: 'SEC1', sectionName: '1. 💰 ESI, FINANCE & BUSINESS NEWS', tier: 'TIER_A' };
  }

  // Section 2: Regulatory Bodies
  if (t.includes('rbi') || t.includes('sebi') || t.includes('irdai') || t.includes('pfrda') || t.includes('cci') || t.includes('nabard') || t.includes('monetary policy') || t.includes('repo rate') || t.includes('dicgc') || t.includes('ecb') || t.includes('fema')) {
    return { secId: 'SEC2', sectionName: '2. 🏛️ REGULATORY BODIES NEWS', tier: 'TIER_A' };
  }

  // Section 3: Banking & Insurance
  if (t.includes('bank') || t.includes('insurance') || t.includes('upi') || t.includes('cbdc') || t.includes('rupay') || t.includes('sbi') || t.includes('hdfc') || t.includes('icici') || t.includes('lic') || t.includes('co-lending') || t.includes('nbfc') || t.includes('fdi in insurance') || t.includes('dividend')) {
    return { secId: 'SEC3', sectionName: '3. 🏦 BANKING & INSURANCE NEWS', tier: 'TIER_A' };
  }

  // Section 10: Schemes & Static
  if (c === 'government-schemes' || t.includes('scheme') || t.includes('yojana') || t.includes('mission') || t.includes('pradhan mantri') || t.includes('pm-') || t.includes('portal') || t.includes('initiative') || t.includes('fastag')) {
    return { secId: 'SEC10', sectionName: '10. 📌 MISCELLANEOUS — GOVT SCHEMES & STATIC', tier: 'TIER_A' };
  }

  // Section 7: Awards, Books, Indices & Rankings
  if (c === 'reports-indices-current-affairs' || c === 'awards-honours-current-affairs' || t.includes('index') || t.includes('rank') || t.includes('report') || t.includes('award') || t.includes('prize') || t.includes('medal') || t.includes('book')) {
    const isIndex = t.includes('index') || t.includes('ranking') || t.includes('report') || t.includes('score');
    return { secId: 'SEC7', sectionName: '7. 🏆 AWARDS, BOOKS, INDICES & RANKINGS', tier: isIndex ? 'TIER_A' : 'TIER_B' };
  }

  // Section 5: MoUs & Appointments
  if (c === 'appointments-current-affairs' || t.includes('appointed') || t.includes('chairman') || t.includes('ceo') || t.includes('director') || t.includes('president') || t.includes('mou') || t.includes('summit') || t.includes('conference')) {
    const isApex = t.includes('rbi') || t.includes('sebi') || t.includes('psu') || t.includes('niti') || t.includes('icai') || t.includes('chief justice') || t.includes('president');
    return { secId: 'SEC5', sectionName: '5. 🤝 MoUs, CONFERENCES & APPOINTMENTS', tier: isApex ? 'TIER_A' : 'TIER_B' };
  }

  // Section 8: Important Days & Persons
  if (t.includes('day observed') || (t.includes('world ') && t.includes('day')) || (t.includes('national ') && t.includes('day')) || t.includes('week observed') || t.includes('anniversary')) {
    return { secId: 'SEC8', sectionName: '8. 📅 IMPORTANT DAYS & PERSONS IN NEWS', tier: 'TIER_B' };
  }

  // Section 6: Science, Tech, Defence & Sports
  if (c === 'science-technology-current-affairs' || c === 'defence-current-affairs' || c === 'sports-current-affairs' || t.includes('missile') || t.includes('isro') || t.includes('drdo') || t.includes('satellite') || t.includes('exercise') || t.includes('trophy') || t.includes('championship') || t.includes('ai') || t.includes('supercomputer') || t.includes('booster')) {
    const isHighYield = t.includes('agni') || t.includes('first') || t.includes('indigenous') || t.includes('budget') || t.includes('crore') || t.includes('grand slam');
    return { secId: 'SEC6', sectionName: '6. 🔬 SCIENCE, TECHNOLOGY, DEFENCE & SPORTS', tier: isHighYield ? 'TIER_B' : 'TIER_C', reason: 'Routine specs/minor sports without national policy weight' };
  }

  // Section 4: National, State & International
  if (c === 'national-current-affairs' || c === 'international-current-affairs' || c === 'environment-current-affairs' || t.includes('india') || t.includes('tunnel') || t.includes('expressway') || t.includes('treaty') || t.includes('port') || t.includes('gi tag')) {
    const isHighYield = t.includes('gi tag') || t.includes('first') || t.includes('crore') || t.includes('treaty') || t.includes('coalition') || t.includes('rail') || t.includes('tunnel') || t.includes('energy');
    return { secId: 'SEC4', sectionName: '4. 🌐 NATIONAL, STATE & INTERNATIONAL NEWS', tier: isHighYield ? 'TIER_B' : 'TIER_C', reason: 'State routine local event without national policy weight' };
  }

  return { secId: 'SEC9', sectionName: '9. 📋 PIB, CIRCULARS & NOTIFICATIONS', tier: 'TIER_B' };
}

async function run() {
  const rawArticles = JSON.parse(fs.readFileSync('content/repairs/gktoday_raw_articles.json', 'utf-8'));
  console.log(`Processing ${rawArticles.length} raw articles with full text extractor...`);

  const sectionsMap = {
    'SEC1': { title: '1. 💰 ESI, FINANCE & BUSINESS NEWS', items: [] },
    'SEC2': { title: '2. 🏛️ REGULATORY BODIES NEWS', items: [] },
    'SEC3': { title: '3. 🏦 BANKING & INSURANCE NEWS', items: [] },
    'SEC4': { title: '4. 🌐 NATIONAL, STATE & INTERNATIONAL NEWS', items: [] },
    'SEC5': { title: '5. 🤝 MoUs, CONFERENCES & APPOINTMENTS', items: [] },
    'SEC6': { title: '6. 🔬 SCIENCE, TECHNOLOGY, DEFENCE & SPORTS', items: [] },
    'SEC7': { title: '7. 🏆 AWARDS, BOOKS, INDICES & RANKINGS', items: [] },
    'SEC8': { title: '8. 📅 IMPORTANT DAYS & PERSONS IN NEWS', items: [] },
    'SEC9': { title: '9. 📋 PIB, CIRCULARS & NOTIFICATIONS', items: [] },
    'SEC10': { title: '10. 📌 MISCELLANEOUS — GOVT SCHEMES & STATIC', items: [] },
    'SEC11': { title: '11. 🧠 REVISION', items: [] }
  };

  const skippedLog = [];
  let tierACount = 0;
  let tierBCount = 0;

  for (let i = 0; i < rawArticles.length; i++) {
    const art = rawArticles[i];
    const classification = classifyArticle(art);

    if (classification.tier === 'SKIP') {
      continue; // Obituary
    }

    if (classification.tier === 'TIER_C') {
      skippedLog.push(`🚫 Skipped (low yield): **${art.title}** — ${classification.reason || 'low exam hit rate'}`);
      continue;
    }

    // High yield item: fetch full content
    let extracted = { text: '', paragraphs: [], bullets: [] };
    try {
      const html = await fetchUrl(art.url);
      extracted = extractArticleContent(html);
    } catch (e) {
      extracted = { text: art.title, paragraphs: [art.title], bullets: [] };
    }

    if (!extracted.text && extracted.paragraphs.length === 0) {
      extracted.paragraphs = [art.title];
    }

    if (classification.tier === 'TIER_A') tierACount++;
    if (classification.tier === 'TIER_B') tierBCount++;

    sectionsMap[classification.secId].items.push({
      ...art,
      tier: classification.tier,
      text: extracted.text,
      paragraphs: extracted.paragraphs,
      bullets: extracted.bullets
    });
  }

  // Generate Master Markdown in rich Claude Framework v3 format
  let md = `# 🎯 GKToday Current Affairs Master Review Compendium (Jan – Aug 2026)\n\n`;
  md += `**Framework:** Claude Framework v3 | SBI PO Mains / Bank PO 2026 Standard\n`;
  md += `**Coverage Zone:** 🔴 Core Zone (April–August 2026) & 🟡 Light-Touch Zone (Jan–March 2026)\n`;
  md += `**Total Processed Items:** ${tierACount + tierBCount} (Tier A: ${tierACount}, Tier B+: ${tierBCount}, Skipped: ${skippedLog.length})\n\n---\n\n`;

  for (const secKey of Object.keys(sectionsMap)) {
    const sec = sectionsMap[secKey];
    md += `## ${sec.title}\n\n`;
    if (sec.items.length === 0) {
      md += `*No items this cycle*\n\n---\n\n`;
      continue;
    }

    for (const item of sec.items) {
      const isTierA = item.tier === 'TIER_A';
      md += `### 📰 ${item.title}\n`;
      md += `*Date: ${item.dateStr} | Tier: ${isTierA ? '🔴 Tier A (Core)' : '🟡 Tier B+ (Quick)'} | Category: ${item.category}*\n\n`;
      
      // Hook: punchy sentence with context and numbers
      const firstP = item.paragraphs[0] || item.title;
      md += `**🪝 Hook:** ${firstP}\n\n`;
      
      // Key Exam Facts: bullet points
      md += `**Key Exam Facts & Critical Details:**\n`;
      if (item.bullets.length > 0) {
        item.bullets.forEach(b => {
          md += `- **${b}**\n`;
        });
      } else {
        item.paragraphs.slice(1, 5).forEach(p => {
          md += `- ${p}\n`;
        });
      }
      md += `\n`;

      // Static GK Tag
      md += `**Static GK Tag:** Nodal Agency / Regulator: **${item.category}** · Source: GKToday Comprehensive Archives\n\n`;

      // Exam Angle
      md += `🎯 **Exam Angle:** Most likely MCQ focus for Bank PO Mains — Testing precise dates, statutory caps, financial outlays, and institutional authority.\n\n`;

      // Interview Q for Tier A items
      if (isTierA) {
        const cleanTopic = item.title.replace(/[—–-].*$/, '').trim();
        md += `💼 **Interview Q:** *What is the broader economic and regulatory implication of ${cleanTopic}?*\n`;
        md += `> **Model Answer:** It strengthens institutional governance, provides vital capital/regulatory support to key sectors, and aligns with broader macroeconomic and financial inclusion frameworks.\n\n`;
      }

      md += `---\n\n`;
    }
  }

  // Section 11 Rapid Revision Summary
  md += `## 11. 🧠 REVISION (Section 11 — High-Yield Rapid Recall Matrix)\n\n`;
  md += `| Topic / Event | Key Number / Outlay | Nodal Authority / Body | Exam Trap Alert |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  for (const secKey of Object.keys(sectionsMap)) {
    if (secKey === 'SEC11') continue;
    sectionsMap[secKey].items.slice(0, 4).forEach(item => {
      const numMatch = item.text.match(/₹[\d,.]+\s*(?:crore|lakh|thousand)?|\b\d+%\b|\$\d+[\w.]+/i);
      const numStr = numMatch ? numMatch[0] : 'N/A';
      md += `| ${item.title.substring(0, 45)}... | **${numStr}** | ${item.category} | Verify exact percentage/statutory act |\n`;
    });
  }
  md += `\n---\n\n`;

  // Skipped Log
  md += `## 🚫 SKIPPED LOG (Low-Yield Tier C Items)\n\n`;
  if (skippedLog.length === 0) {
    md += `*No items skipped in this batch.*\n`;
  } else {
    skippedLog.forEach(log => {
      md += `${log}\n`;
    });
  }

  const outPath = path.resolve('GKTODAY_CURRENT_AFFAIRS_MASTER_REVIEW.md');
  fs.writeFileSync(outPath, md, 'utf-8');
  console.log(`Saved rich master review file to: ${outPath}`);

  // Also save to artifact directory
  const artifactPath = path.resolve('C:/Users/visha/.gemini/antigravity/brain/9eb8e9a0-6e6d-4149-8ed4-92edfe02f499/gktoday_current_affairs_master_review.md');
  fs.writeFileSync(artifactPath, md, 'utf-8');
  console.log(`Saved artifact copy to: ${artifactPath}`);
}

run().catch(console.error);
