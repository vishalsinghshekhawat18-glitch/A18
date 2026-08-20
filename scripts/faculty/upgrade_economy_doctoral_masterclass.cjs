const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');

console.log('🏛️ Deploying Council 1 (Doctoral Faculty in Monetary Economics, Macro & Central Banking)...\n');

const ECO_TRAPS = {
  'deficit': '🎯 Exam Angle → 🔥 HIGH — Master Fiscal Deficit Formulas: (1) Fiscal Deficit = Total Budget Expenditure − Total Receipts except borrowings; (2) Revenue Deficit = Revenue Expenditure − Revenue Receipts; (3) Effective Revenue Deficit = Revenue Deficit − Grants for creation of capital assets; (4) Primary Deficit = Fiscal Deficit − Interest Payments.',
  'monetary_tools': '🎯 Exam Angle → 🔥 HIGH — Policy Rate Corridor Hierarchy: MSF Rate (Marginal Standing Facility = Repo + 0.25%) > Policy Repo Rate > SDF Rate (Standing Deposit Facility = Repo − 0.25%). Notice that SDF is uncollateralised (RBI does not give government securities to absorb liquidity).',
  'money_supply': '🎯 Exam Angle → 🔥 HIGH — Money Aggregates: (1) M0 (Reserve Money) = Currency in Circulation + Bankers\' Deposits with RBI + Other Deposits with RBI; (2) M1 (Narrow Money) = Currency with Public + Demand Deposits with Banks + Other Deposits with RBI; (3) M3 (Broad Money) = M1 + Time Deposits with Banks. Note: Post Office deposits are in M2 and M4, not M1 and M3!',
  'inflation': '🎯 Exam Angle → 🔥 HIGH — CPI vs WPI Traps: (1) CPI covers Goods & Services (Base 2012=100, NSO); WPI covers ONLY Goods (Base 2011-12=100, DPIIT/MoCI); (2) Food weight in CPI is ~45.86% vs ~24.38% in WPI; (3) Headline inflation is CPI Combined; Core inflation is CPI excluding Food and Fuel.',
  'national_income': '🎯 Exam Angle → 🔥 HIGH — National Income Invariant: National Income in India is officially defined as **NNP at Factor Cost** (\(\text{NNP}_{\text{FC}}\)). Formula: \(\text{GVA}_{\text{Basic Prices}} = \text{GDP}_{\text{MP}} - \text{Product Taxes} + \text{Product Subsidies}\).',
  'bop': '🎯 Exam Angle → 🔥 HIGH — Balance of Payments Invariants: Current Account (Trade balance + Invisibles like services, remittances, interest); Capital Account (FDI, FPI, External Commercial Borrowings, NRI deposits). India has full convertibility on Current Account (since 1994, Art VIII of IMF) and partial on Capital Account.',
  'basel': '🎯 Exam Angle → 🔥 HIGH — Basel III Capital Ratios in India (Stricter than Global Basel): Minimum Total Capital = 9.0% + 2.5% CCB = **11.5%**; Minimum Tier 1 Capital = **7.0%**; Minimum Common Equity Tier 1 (CET1) = 5.5% + 2.5% CCB = **8.0%**.'
};

const ecoFiles = fs.readdirSync(corpusDir).filter(f => f.startsWith('migrated-core-eco-'));
let upgradedCount = 0;

ecoFiles.forEach(file => {
  const filePath = path.join(corpusDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let modified = false;

  const id = data.id || '';
  const title = (data.title || '').toLowerCase();

  let matchedTrap = '';
  if (title.includes('deficit') || title.includes('budget') || id.includes('42') || id.includes('44')) {
    matchedTrap = ECO_TRAPS.deficit;
  } else if (title.includes('monetary') || title.includes('instrument') || id.includes('33') || id.includes('31')) {
    matchedTrap = ECO_TRAPS.monetary_tools;
  } else if (title.includes('money supply') || title.includes('m0') || title.includes('m1') || id.includes('32') || id.includes('30')) {
    matchedTrap = ECO_TRAPS.money_supply;
  } else if (title.includes('inflation') || title.includes('cpi') || title.includes('wpi') || id.includes('15') || id.includes('16')) {
    matchedTrap = ECO_TRAPS.inflation;
  } else if (title.includes('gdp') || title.includes('national income') || id.includes('4') || id.includes('5') || id.includes('6')) {
    matchedTrap = ECO_TRAPS.national_income;
  } else if (title.includes('bop') || title.includes('balance of payments') || title.includes('fdi') || id.includes('27') || id.includes('28') || id.includes('29')) {
    matchedTrap = ECO_TRAPS.bop;
  } else if (title.includes('basel') || title.includes('npa') || title.includes('psl') || id.includes('35') || id.includes('36') || id.includes('38')) {
    matchedTrap = ECO_TRAPS.basel;
  } else {
    matchedTrap = `🎯 Exam Angle → 🔥 HIGH — Pay close attention to macroeconomic definitions, policy rate shifts, base-year conventions, and statutory committee recommendations.`;
  }

  let trapFound = false;
  data.blocks.forEach(blk => {
    if (blk.type === 'exam_trap' || (blk.content && blk.content.includes('🎯 Exam Angle'))) {
      blk.type = 'exam_trap';
      blk.content = matchedTrap;
      trapFound = true;
      modified = true;
    }
  });

  if (!trapFound) {
    data.blocks.push({
      id: `blk-${data.id}-exam-trap`,
      type: 'exam_trap',
      content: matchedTrap
    });
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    upgradedCount++;
  }
});

console.log(`✅ Successfully upgraded all ${upgradedCount} Indian Economy chapters to Monetary Economics & Macro Doctoral standards.`);
