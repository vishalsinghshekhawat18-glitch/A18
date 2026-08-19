/**
 * R5.5 January 2026 Production Synthesis Engine (V2 - With PANKHUDI, Skipped Log & Section 11)
 * Generates:
 * 1. High-Density Knowledge Units (including PANKHUDI)
 * 2. Section 11 Rapid Revision & One-Liners Note
 * 3. Transparent Skipped Articles Log (JSON & Markdown)
 */

const fs = require('fs');
const path = require('path');
const { RAW_JANUARY_ARTICLES } = require('./ingest-cgb-jan-2026-pdf.cjs');

const janStagingDir = path.resolve('content/repairs/ca_v3/january_production/final-student-notes');
if (!fs.existsSync(janStagingDir)) {
  fs.mkdirSync(janStagingDir, { recursive: true });
}

console.log(`================================================================`);
console.log(`🚀 PROCESSING JANUARY 2026 CURRENT AFFAIRS VIA R5.5 ENGINE (V2)`);
console.log(`   Input Articles: ${RAW_JANUARY_ARTICLES.length}`);
console.log(`================================================================\n`);

const JANUARY_ANCHOR_PATTERNS = [
  // SEC1: Macro, ESI & Statistics
  {
    id: 'emu-jan-gdp-first-advance-estimates',
    title: '💰 NSO First Advance GDP Estimates FY26 (7.4%) & ₹17 Lakh Crore 3-Year PPP Pipeline',
    category: 'SEC1',
    tier: 'TIER_A',
    pattern: /first advance estimates|7\.4% growth rate|ppp project pipeline.*17 lakh|dea.*ppp|world bank estimates 7\.2%|imf raises india’s economic growth forecast to 7\.3%|un undesa projects india gdp/i,
    concept: 'Sovereign Macroeconomic Growth & Infrastructure Investment',
    why: 'Official NSO FY26 GDP growth estimate (7.4%), DEA 3-year ₹17L Cr PPP pipeline (852 projects), and IMF/WB/UN growth forecasts.'
  },
  {
    id: 'emu-jan-cpi-iip-base-revisions',
    title: '💰 Statistical Base Year Overhauls — CPI 2024 Base (Food Weight Cut to 36.75%) & IIP/GDP 2022-23 Base',
    category: 'SEC1',
    tier: 'TIER_A',
    pattern: /last release of cpi for base 2012=100|revised cpi series on base 2024=100|base year 2022-23|weight of food and beverages will reduce.*36\.75%|housing.*17\.66%|number of items.*358/i,
    concept: 'National Statistical Framework Overhaul',
    why: 'Durable MoSPI base year revisions for CPI (2024=100, food weight cut from 45.86% to 36.75%), GDP (2022-23), and IIP (2022-23).'
  },
  {
    id: 'emu-jan-economic-survey-fy27',
    title: '💰 Economic Survey 2025–26 — Real GDP Projected at 6.8%–7.2% & State Land Reforms',
    category: 'SEC1',
    tier: 'TIER_A',
    pattern: /economic survey projected real gdp growth.*6\.8 to 7\.2%|v ananatha subramanian|bhu bharati/i,
    concept: 'Annual Economic Survey Projections',
    why: 'Flagship pre-budget macroeconomic survey setting FY27 growth band at 6.8-7.2% and reviewing state land digitization.'
  },
  {
    id: 'emu-jan-sin-goods-gst-excise',
    title: '💰 Taxation Overhaul — 40% GST & Additional Excise Duty on Tobacco/Pan Masala from Feb 1',
    category: 'SEC1',
    tier: 'TIER_A',
    pattern: /gst rate of 40%|additional excise duty.*tobacco|pan masala|compensation cess/i,
    concept: 'Indirect Taxation on Demerit Goods',
    why: 'Replacement of expiring compensation cess with 40% GST + health cess on sin goods effective 1 Feb 2026.'
  },
  {
    id: 'emu-jan-plfs-employment-trends',
    title: '💰 Periodic Labour Force Survey — 4.8% Unemployment Rate & 56.1% LFPR in December 2025',
    category: 'SEC1',
    tier: 'TIER_B_PLUS',
    pattern: /labour force participation rate.*56\.1%|unemployment rate.*4\.8%|female lfpr.*35\.3%/i,
    concept: 'National Employment & Labour Dynamics',
    why: 'Core MoSPI employment benchmarks: LFPR 56.1%, worker population ratio 53.4%, and urban female unemployment at 9.1%.'
  },
  {
    id: 'emu-jan-public-sector-wage-revisions',
    title: '💰 Public Sector Wage Overhauls — PSGICs 12.41% Hike, NABARD 20% & RBI Pensioner Increase',
    category: 'SEC1',
    tier: 'TIER_A',
    pattern: /wage revision for public sector general insurance|psgics|wage revision.*nabard|pension revision for retirees of reserve bank|8170\.30 crore|2,696\.82 crore/i,
    concept: 'Financial Sector Public Compensation & Pension Restructuring',
    why: 'Cabinet approved wage revision for 6 PSGICs (12.41% hike, 14% NPS), NABARD (20% pay hike), and 10% pension hike for RBI retirees.'
  },
  {
    id: 'emu-jan-world-bank-cpf-india',
    title: '💰 World Bank $8–10 Billion Annual Financing Framework (FY26–31) & PM-SETU $830M Loan',
    category: 'SEC1',
    tier: 'TIER_A',
    pattern: /new country partnership framework.*8-10 billion|wbg committed annual lending|pm-setu.*830 million loan/i,
    concept: 'Multilateral Sovereign Development Financing',
    why: '5-year World Bank CPF (FY26-FY31) delivering $8-10B annually, including $830M facility for 1,000 ITI modernizations under PM-SETU.'
  },

  // SEC2: Regulatory Bodies News
  {
    id: 'emu-jan-sebi-merchant-banking-overhaul',
    title: '🏛️ SEBI Merchant Banking Capital Overhaul — ₹50 Cr Net Worth (Cat I) & Underwriting Caps',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /sebi proposed a phased rollout of a new net worth requirement for existing merchant bankers|capital adequacy.*merchant|category i: rs\. 50 cr|underwriting obligations cannot exceed 20 times/i,
    concept: 'Capital Market Intermediary Prudential Regulation',
    why: 'Major SEBI risk overhaul: Cat I net worth raised to ₹50 Cr (liquid ₹12.5 Cr), Cat II to ₹10 Cr, and underwriting capped at 20x liquid net worth.'
  },
  {
    id: 'emu-jan-rbi-related-party-lending',
    title: '🏛️ RBI Credit Risk Directions 2026 — Materiality Thresholds on Related-Party Lending',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /commercial banks – credit risk management.*amendment directions, 2026|related-party loans|materiality threshold.*25 crore|related party transactions.*nbfcs/i,
    concept: 'Bank & NBFC Credit Governance & Connected Lending',
    why: 'Prescribes mandatory board approval ceilings for related-party loans: Banks >₹10T at ₹50 Cr, ₹1T-10T at ₹10 Cr, NBFC Upper Layer at ₹10 Cr.'
  },
  {
    id: 'emu-jan-rbi-internal-ombudsman-2026',
    title: '🏛️ RBI (Internal Ombudsman) Directions 2026 — 3–5 Year Fixed Tenure & ₹30 Lakh Award Power',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /reserve bank of india \(internal ombudsman\) directions, 2026|internal ombudsmen in banks and nbfcs|tenure of the io.*three years|compensation up to ₹30 lakh/i,
    concept: 'Consumer Grievance Redressal Architecture',
    why: 'Comprehensive IO framework across Banks, SFBs, NBFCs, and CICs effective 30 June 2026 with ₹30L compensation powers.'
  },
  {
    id: 'emu-jan-rbi-gnctd-public-debt-wma',
    title: '🏛️ RBI Signs Section 21A Agreement with GNCTD for Public Debt & ₹890 Cr WMA Limit',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /section 21a of the reserve bank of india act, 1934 with the government of national capital territory of delhi|wma limit for the delhi government at rs 890 crore|61,008 crore/i,
    concept: 'Central Bank Public Debt Management for UTs',
    why: 'RBI undertakes banking and public debt of Delhi under Sec 21A, fixing WMA limit at ₹890 Cr (All-India States/UTs total ₹61,008 Cr).'
  },
  {
    id: 'emu-jan-rbi-dividend-payout-framework',
    title: '🏛️ RBI Draft Policy — Bank Dividend Payout Cap Raised from 40% to 75% of PAT',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /dividend payout cap for banks to 75% of net profit|ten-bucket structure|adjusted pat/i,
    concept: 'Commercial Bank Capital Distribution & Profit Allocation',
    why: 'Replaces 40% cap with 75% dividend ceiling linked to CET1 capital adequacy and net NPA deductions.'
  },
  {
    id: 'emu-jan-rbi-coop-bank-governance',
    title: '🏛️ RBI Governance Directions — 3-Year Cooling-Off Period After 10-Year Board Tenure in Co-op Banks',
    category: 'SEC2',
    tier: 'TIER_B_PLUS',
    pattern: /governance directions, 2025, for urban co-operative banks|cooling-off period for directors who complete the maximum permissible tenure|10 years continuous tenure/i,
    concept: 'Co-operative Bank Governance & Board Tenure',
    why: 'Mandates 3-year cooling-off period for directors completing 10 continuous years on UCB and Rural Co-op boards.'
  },
  {
    id: 'emu-jan-rbi-forex-risk-nop-basel',
    title: '🏛️ RBI Draft Directions — Daily Net Open Position (NOP) & Basel-Aligned Forex Risk Capital',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /net open position \(nop\) and capital charge for foreign exchange risk|basel standards|close of each business day/i,
    concept: 'Forex Risk Management & Basel Capital Standards',
    why: 'Enforces daily continuous NOP calculations and forex capital charges aligned with BCBS standards effective 1 April 2027.'
  },
  {
    id: 'emu-jan-rbi-fema-guarantees-2026',
    title: '🏛️ RBI FEMA (Guarantees) Regulations 2026 — Resident Guarantee Prohibition for NRIs',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /foreign exchange management \(guarantees\) regulations, 2026|prohibited from issuing credit guarantees in favor of non-resident indians/i,
    concept: 'Cross-Border Credit Guarantees & Foreign Exchange Control',
    why: 'Comprehensive FEMA 2026 framework barring residents from giving credit guarantees for NRIs and regulating AD-I banks.'
  },
  {
    id: 'emu-jan-sebi-closing-auction-session',
    title: '🏛️ SEBI Equity Cash Closing Auction Session (CAS) — 3:15 to 3:35 PM (±3% Price Band)',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /closing auction session \(cas\)|vwap of trades between 3:00 pm and 3:15 pm|price band of plus or minus 3 per cent/i,
    concept: 'Secondary Market Trading & Price Discovery Mechanism',
    why: '20-minute CAS session for F&O stocks effective 3 August 2026 to enhance transparent closing price discovery.'
  },
  {
    id: 'emu-jan-sebi-swagat-fi-framework',
    title: '🏛️ SEBI SWAGAT-FI Framework — Streamlined Single-Window Access for FPIs & FVCIs',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /swagat-fi|single window automatic and generalized access for trusted foreign investors/i,
    concept: 'Foreign Portfolio Investment (FPI) Market Access',
    why: 'Unified registration and simplified compliance for SWFs, central banks, and global pension funds effective 1 June 2026.'
  },
  {
    id: 'emu-jan-sebi-technical-glitch-exemption',
    title: '🏛️ SEBI Technical Glitch Overhaul — 60% of Brokers (<10,000 Clients) Exempted',
    category: 'SEC2',
    tier: 'TIER_B_PLUS',
    pattern: /technical glitches in stockbrokers' electronic trading|more than 10,000 registered clients|60% of stockbrokers would be moving out/i,
    concept: 'Brokerage Technology Compliance & Ease of Doing Business',
    why: 'Relieves 60% of brokers from heavy glitch compliance, extending reporting window to 2 hours via Common Reporting Platform.'
  },
  {
    id: 'emu-jan-rbi-psl-auditor-certification',
    title: '🏛️ RBI Tightens Priority Sector Lending (PSL) — External Auditor Certificates for On-Lending',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /priority sector lending \(psl\) by requiring all intermediary lenders|external auditors’ certificates|on-lending to agriculture.*5%|nbfc-mfis.*10%/i,
    concept: 'Priority Sector Lending Prudential Governance',
    why: 'Mandates external auditor verification to prevent double counting of PSL on-lending (5% NBFC cap, 10% NBFC-MFI cap).'
  },
  {
    id: 'emu-jan-rbi-natural-calamity-loans',
    title: '🏛️ RBI Principle-Based Natural Calamity Loan Resolution Framework Effective April 2026',
    category: 'SEC2',
    tier: 'TIER_B_PLUS',
    pattern: /resolution regime for borrowers impacted by natural calamities|standard’ and not in default for up to 30 days \(sma-0\)|april 1, 2026/i,
    concept: 'Disaster Relief Lending & Credit Restructuring',
    why: 'Provides operational flexibility for banks to reschedule standard/SMA-0 loans impacted by natural disasters based on SLBC/DCC inputs.'
  },
  {
    id: 'emu-jan-sebi-demat-reforms-physical-shares',
    title: '🏛️ SEBI Demat Reforms — 1-Year Window for Pre-2019 Shares & 30-Day Transfer Timelines',
    category: 'SEC2',
    tier: 'TIER_B_PLUS',
    pattern: /one-year special window to allow investors to transfer and dematerialize physical securities|before april 1, 2019|simplifying demat process from april 2|150 days to 30 days/i,
    concept: 'Securities Dematerialisation & Investor Rights',
    why: '1-year window (Feb 2026-Feb 2027) for legacy shares with 1-yr lock-in, and elimination of LOC reducing transfer time to 30 days.'
  },
  {
    id: 'emu-jan-dicgc-deposit-insurance-fy25',
    title: '🏛️ DICGC Deposit Insurance Coverage — 97.6% Bank Accounts & ₹100.12L Cr Insured (12p Rate)',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /97\.6% by number of accounts|dicgc as of march 2025|₹100\.12 lakh crore were insured|12 paise per ₹100|deposit insurance fund was ₹2\.29 lakh crore/i,
    concept: 'Deposit Insurance & Banking Safety Net',
    why: 'DICGC covers 97.6% of accounts and ₹100.12L Cr deposits (41.5% of total value) across 1,982 banks up to ₹5L per depositor.'
  },
  {
    id: 'emu-jan-rbi-state-finances-study',
    title: '🏛️ RBI State Finances Study 2025–26 — Demographic Divergence & Southern States 30% Pension Burden',
    category: 'SEC2',
    tier: 'TIER_A',
    pattern: /state finances: a study of budgets of 2025-26|youthful states|ageing states|pensions consuming 30% of social sector expenditure|consolidated fiscal deficit of the states widened to 3\.3 per cent/i,
    concept: 'Sub-National Public Finance & Fiscal Federalism',
    why: 'Analyzes demographic shift on state budgets: Northern youthful states (19.5% GSDP revenue) vs Southern ageing states (30% pension burden).'
  },

  // SEC3: Banking & Insurance Operations
  {
    id: 'emu-jan-sbi-scale-israel-atm-outsource',
    title: '🏦 State Bank of India — Bilateral Israel Rupee Trade (SRVA), ₹1,000 Cr ATM Contract & $250M Bonds',
    category: 'SEC3',
    tier: 'TIER_A',
    pattern: /sbi.*india-israel trade in rupee|special rupee vostro account \(srva\)|cms info systems.*1,000 crore atm deal from sbi|sbi secures \$250 million via overseas bonds/i,
    concept: 'Public Sector Banking Scale & International Operations',
    why: 'SBI facilitates INR-Israel trade via SRVA, awards India\'s 1st ₹1,000 Cr direct 10-yr ATM outsourcing contract, and raises $250M SOFR bonds.'
  },
  {
    id: 'emu-jan-smbc-japan-wos-licence',
    title: '🏦 Sumitomo Mitsui Banking Corp (SMBC) Gets RBI In-Principle Nod for Wholly-Owned Subsidiary',
    category: 'SEC3',
    tier: 'TIER_B_PLUS',
    pattern: /sumitomo mitsui banking corporation \(smbc\)|wholly-owned subsidiary \(wos\)|section 22 \(1\) of the banking regulation act, 1949/i,
    concept: 'Foreign Banking Operations in India (WOS Route)',
    why: 'Japan\'s SMBC granted in-principle license under Sec 22(1) BR Act 1949 to convert its 4 Indian branches into a WOS.'
  },
  {
    id: 'emu-jan-pfrda-nps-swasthya-pension',
    title: '🏦 PFRDA Launches NPS Swasthya Pension Scheme — 25% Medical Withdrawal in Regulatory Sandbox',
    category: 'SEC3',
    tier: 'TIER_B_PLUS',
    pattern: /nps swasthya pension scheme|pfrda’s regulatory sandbox|up to 25% of subscribers’ own contributions can be withdrawn|critical illness.*70% of total corpus/i,
    concept: 'Pension Sandbox Innovations & Health Financing',
    why: 'PFRDA voluntary health pension allowing 25% partial withdrawals for OPD/IPD and 100% premature exit for critical illness >70% corpus.'
  },
  {
    id: 'emu-jan-irdai-annual-report-fy25',
    title: '🏦 IRDAI Annual Report FY25 — Health Covers 580M Lives; 37% Life Payouts from Early Surrenders',
    category: 'SEC3',
    tier: 'TIER_A',
    pattern: /insurance regulatory and development authority of india’s \(irdai\) annual report|580 million in fy25|37% of the payouts are for early surrender|paid-up capital of life insurers up 7\.2%|profits of the life insurance industry grew by 18\.14%/i,
    concept: 'Insurance Industry Performance & Consumer Behavior',
    why: 'Health covered lives reached 580M (₹1.17T premiums); life insurance profits grew 18.14% to ₹56,006 Cr with 37% early exits.'
  },
  {
    id: 'emu-jan-dfs-reinsurance-summit',
    title: '🏦 Reinsurance Market Landscape — Indian Insurance AUM Crosses ₹74.44 Lakh Crore',
    category: 'SEC3',
    tier: 'TIER_A',
    pattern: /ifsc–irdai–gift city global reinsurance summit|m\. nagaraju|premiums of ₹11\.93 lakh crore and aum of ₹74\.44 lakh crore|reinsurance market.*1\.12 lakh crore/i,
    concept: 'National Reinsurance Architecture & GIFT City Hub',
    why: 'Global Reinsurance Summit highlights: ₹11.93L Cr premiums, ₹74.44L Cr AUM, and ₹1.12L Cr reinsurance market aligned with Insurance 2047.'
  },
  {
    id: 'emu-jan-epfo-auto-settlement-upi',
    title: '🏦 EPFO Reforms — Auto-Settlement Limit Raised to ₹5 Lakh & UPI Withdrawals from April 1',
    category: 'SEC3',
    tier: 'TIER_A',
    pattern: /epfo members can withdraw epf money directly via upi|auto-settlement mode.*rs 5 lakh|3 days of filing/i,
    concept: 'Social Security Fund Technology Overhaul',
    why: 'EPFO raises 3-day electronic auto-settlement ceiling to ₹5 Lakh and integrates UPI payout gateway from 1 April 2026.'
  },
  {
    id: 'emu-jan-aifi-sidbi-equity-rxil',
    title: '🏦 AIFIs & SME Liquidity — ₹5,000 Crore SIDBI Equity Infusion & RXIL 21.6% Maiden Dividend',
    category: 'SEC3',
    tier: 'TIER_B_PLUS',
    pattern: /equity support of rs\.5,000 crore to small industries development bank of india|receivables exchange of india ltd \(rxil\)|first treds platform.*dividend of 21\.6%/i,
    concept: 'Development Financial Institutions & MSME Factoring',
    why: 'DFS ₹5,000 Cr capital infusion into SIDBI across 3 tranches, and RXIL becomes 1st TReDS platform to declare a dividend.'
  },
  {
    id: 'emu-jan-digital-payments-food-cbdc',
    title: '🏦 Digital Payments Architecture — Programmed CBDC Food Tokens for PDS & UPI Record 21.7B Volume',
    category: 'SEC3',
    tier: 'TIER_A',
    pattern: /pilot for central bank digital currency \(cbdc\) or ‘digital food currency’|annapurti|transactions on the unified payments interface \(upi\) recorded a 28% year-on-year rise in volume to 21\.70 billion|bank credit demand crosses ₹200 lakh crore/i,
    concept: 'Digital Public Infrastructure & Targeted Welfare CBDC',
    why: 'Pilot programmed e-Rupee tokens for ration delivery in 3 states, alongside record 21.70 billion monthly UPI transactions (₹28.33L Cr).'
  },

  // SEC4: National, State & International Treaties
  {
    id: 'emu-jan-india-eu-free-trade-agreement',
    title: '🌐 India–EU Free Trade Agreement Concluded — 15 Bank Branches, 100% Insurance FDI & Euratom',
    category: 'SEC4',
    tier: 'TIER_A',
    pattern: /india and the eu together represent almost one-fifth of global trade|mother of all deals|concluded on 26th january 2026|allow eu banks to open 15 branches|india-euratom agreement|eu emerges as largest trading partner/i,
    concept: 'Bilateral Megaregional Trade & Investment Pacts',
    why: 'Landmark FTA concluded 26 Jan 2026: 15 EU bank branches allowed in India, 100% insurance FDI bound, and nuclear cooperation under Euratom.'
  },
  {
    id: 'emu-jan-eu-mercosur-fta',
    title: '🌐 EU–Mercosur Free Trade Agreement Signed — €4 Billion Tariff Elimination Across 91% Exports',
    category: 'SEC4',
    tier: 'TIER_B_PLUS',
    pattern: /eu, latin american bloc mercosur set to sign historic trade deal|remove over €4 billion.*duties|mercosur comprises brazil/i,
    concept: 'Global Multilateral Trade Blocs',
    why: 'Historic FTA concluded in Paraguay after 25 years: eliminates duties on 91% of EU exports to Mercosur (Brazil, Argentina, Uruguay, Paraguay, Bolivia).'
  },
  {
    id: 'emu-jan-bulgaria-eurozone-adoption',
    title: '🌐 Eurozone Expansion — Bulgaria Adopts Euro as Official Currency (21st Member State)',
    category: 'SEC4',
    tier: 'TIER_B_PLUS',
    pattern: /bulgaria adopts euro as its official currency|21st member of the euro area|bulgarian lev/i,
    concept: 'European Monetary Union Integration',
    why: 'Bulgaria joined Eurozone on 1 Jan 2026 replacing Lev (6 EU members remain outside: Sweden, Poland, Czech, Hungary, Romania, Denmark).'
  },
  {
    id: 'emu-jan-eu-cbam-carbon-border-tax',
    title: '🌐 EU Carbon Border Adjustment Mechanism (CBAM) Enters Full Force on 1 January 2026',
    category: 'SEC4',
    tier: 'TIER_A',
    pattern: /carbon border adjustment mechanism|cbam.*january 1, 2026|cement, aluminium, fertilizers, iron and steel/i,
    concept: 'Cross-Border Carbon Pricing & Trade Protectionism',
    why: 'World\'s 1st carbon border tax operationalized across 6 energy-intensive sectors (steel, aluminium, cement, fertilizer, electricity, hydrogen).'
  },
  {
    id: 'emu-jan-brics-presidency-india-2026',
    title: '🌐 India Assumes BRICS Presidency for 2026 — 18th Summit (4 Pillars & 20-Year Milestone)',
    category: 'SEC4',
    tier: 'TIER_A',
    pattern: /brazil has formally handed over the brics presidency to india for 2026|18th brics summit|resilience, innovation, cooperation/i,
    concept: 'Emerging Economy Multilateral Governance',
    why: 'India takes over BRICS Chairship for 2026 across 4 pillars: Resilience, Innovation, Cooperation, and Sustainability.'
  },
  {
    id: 'emu-jan-us-treaty-withdrawals-isa-who',
    title: '🌐 US Executive Order — Withdrawal from 66 International Bodies Including ISA & WHO',
    category: 'SEC4',
    tier: 'TIER_B_PLUS',
    pattern: /united states president donald trump withdrew the country from 66 international organizations|international solar alliance|world health organization/i,
    concept: 'Geopolitical Multilateral Disengagement',
    why: 'US exits Gurugram-based International Solar Alliance (1,000 GW target), WHO, and Paris Agreement for the 2nd time.'
  },

  // SEC5: Appointments & Committees
  {
    id: 'emu-jan-apex-security-appointments',
    title: '🤝 Apex National Security Leadership — Shatrujeet Kapoor (ITBP), Praveen Kumar (BSF), Rakesh Aggarwal (NIA)',
    category: 'SEC5',
    tier: 'TIER_B_PLUS',
    pattern: /shatrujeet singh kapoor|praveen kumar.*bsf|rakesh aggarwal.*nia|praveen vashista.*vigilance commissioner/i,
    concept: 'National Security & Vigilance Governance',
    why: 'Key statutory appointments: Chief of ITBP, DG Border Security Force, DG National Investigation Agency, and Vigilance Commissioner.'
  },
  {
    id: 'emu-jan-pfrda-sahoo-saarg-committees',
    title: '🤝 PFRDA Strategic Panels — M.S. Sahoo Assured Payout Committee & SAARG Investment Review',
    category: 'SEC5',
    tier: 'TIER_B_PLUS',
    pattern: /dr\. m\. s\. sahoo.*assured payout under nps|saarg to modernise nps investment framework|narayan ramachandran|irdai reconstitutes reinsurance advisory/i,
    concept: 'Pension Regulatory Reforms & Governance Panels',
    why: 'PFRDA 15-member Sahoo committee for assured NPS payouts and SAARG panel under Narayan Ramachandran for investment guidelines.'
  },

  // SEC6: Science, Tech, Defence
  {
    id: 'emu-jan-mahsr-bullet-train-launch',
    title: '📌 Mumbai–Ahmedabad High Speed Rail (MAHSR) — 15 Aug 2027 Launch Date (₹1.08L Cr / JICA 81%)',
    category: 'SEC10',
    tier: 'TIER_A',
    pattern: /first bullet train on 15th august 2027|mumbai-ahmedabad high speed rail|mahsr.*1,08,000 crore|jica.*81%/i,
    concept: 'Strategic High-Speed Rail Infrastructure',
    why: '508 km MAHSR corridor (₹1.08L Cr, JICA ₹88,000 Cr loan) set for initial operations 15 Aug 2027 (Surat-Bilimora) and full completion Dec 2029 (127 mins).'
  },
  {
    id: 'emu-jan-indigenous-defence-modernisation',
    title: '🛡️ Strategic Indigenous Defence — Dhruv-NG Shakti Engine, ICGS Samudra Pratap & Scramjet (>Mach 5)',
    category: 'SEC6',
    tier: 'TIER_A',
    pattern: /dhruv new generation|shakti civil engine|icgs samudra pratap|scramjet engine|mpatgm with top attack/i,
    concept: 'Defence Indigenisation & Strategic Propulsion',
    why: 'Major defence milestones: Dhruv-NG helicopter maiden flight with Shakti engine, ICGS Samudra Pratap PCV, DRDO Scramjet ground test, and 3rd Gen MPATGM.'
  },
  {
    id: 'emu-jan-bharat-forge-cqb-carbines',
    title: '🛡️ Army Small Arms Modernisation — Bharat Forge ₹1,661.9 Cr Contract for 255,128 CQB Carbines',
    category: 'SEC6',
    tier: 'TIER_B_PLUS',
    pattern: /bharat forge limited was awarded with a rs 1,661\.9 crore contract|255,128 cqb carbines|5\.56 x 45 mm close quarter battle/i,
    concept: 'Indigenous Small Arms Procurement',
    why: 'MoD ₹1,661.9 Cr contract to Bharat Forge for 255,128 ARDE-DRDO designed 5.56x45mm Close Quarter Battle Carbines.'
  },
  {
    id: 'emu-jan-param-shakti-supercomputer',
    title: '🔬 Supercomputing Mission — ‘PARAM SHAKTI’ Supercomputer (PARAM RUDRA Architecture) at IIT Madras',
    category: 'SEC6',
    tier: 'TIER_A',
    pattern: /param shakti|param rudra supercomputing cluster|c-dac under the national supercomputing mission/i,
    concept: 'National Supercomputing & High-Performance Computing',
    why: 'MeitY launched PARAM SHAKTI facility at IIT Madras powered by C-DAC\'s indigenous PARAM RUDRA servers.'
  },
  {
    id: 'emu-jan-national-megaprojects-kavach',
    title: '📌 National Strategic Infrastructure — Kavach 4.0 472 km Rollout, Kaziranga Corridor & NSHIP TN',
    category: 'SEC10',
    tier: 'TIER_A',
    pattern: /kavach version 4\.0|kaziranga elevated corridor|nship, tn - india’s first mega shipbuilding cluster|19,989 crore/i,
    concept: 'National Multi-Modal & Transport Infrastructure',
    why: '472 km single-day Kavach 4.0 commissioning (total >1,300 km), ₹6,950 Cr Kaziranga elevated highway, and ₹19,989 Cr NSHIP TN shipbuilding SPV.'
  },

  // SEC7: Awards & Rankings
  {
    id: 'emu-jan-padma-awards-ashoka-chakra',
    title: '🏆 131 Padma Awards 2026 & Ashoka Chakra to Astronaut Shubhanshu Shukla (ISS Mission)',
    category: 'SEC7',
    tier: 'TIER_A',
    pattern: /131 padma awards for the year 2026|five padma vibhushan|ashok chakra for group captain shubhanshu shukla/i,
    concept: 'National Civilian & Peacetime Gallantry Honours',
    why: '131 Padma Awards (5 Vibhushan, 13 Bhushan including Uday Kotak, 113 Shri) and Ashoka Chakra to Gp Capt Shukla for ISS space mission.'
  },
  {
    id: 'emu-jan-henley-export-preparedness-indices',
    title: '🏆 Global Indices 2026 — Henley Passport Index (80th), NITI EPI 2024 (Maharashtra #1) & RNI (16th)',
    category: 'SEC7',
    tier: 'TIER_B_PLUS',
    pattern: /henley passport index 2026|india is now ranked 80th|export preparedness index 2024|responsible nations index|brand finance global soft power/i,
    concept: 'Governance, Mobility & Export Competitiveness Benchmarks',
    why: 'Henley Passport #80 (55 destinations), NITI Aayog EPI 2024 (Maharashtra leads large states), and Responsible Nations Index (India #16).'
  },

  // SEC10: Schemes & Governance (WITH PANKHUDI INCLUDED)
  {
    id: 'emu-jan-welfare-schemes-pmmsy-bbbp',
    title: '📌 National Flagship Schemes & Social Infrastructure — PANKHUDI Portal (MWCD), PMMSY Harbour (₹199.24 Cr), PMMVY & BBBP',
    category: 'SEC10',
    tier: 'TIER_A',
    pattern: /pankhudi|mwcd launches pankhudi|smart and integrated fishing harbour at mayabunder|pradhan mantri matru vandana yojana.*nine years|beti bachao beti padhao campaign completes 11 years|rah-veer|womaniya initiative|startup india decadal milestone/i,
    concept: 'Central Sector Welfare Schemes & Port Infrastructure',
    why: 'PANKHUDI CSR digital portal for MWCD 3 umbrella missions (Poshan 2.0, Vatsalya, Shakti), ₹199.24 Cr PMMSY Mayabunder Blue Port, 9 years of PMMVY, and 11 years of BBBP.'
  },
  {
    id: 'emu-jan-environment-swm-rules-ramsar',
    title: '📌 Environmental Governance — Solid Waste Management Rules 2026, 98 Ramsar Sites & Bio-Bitumen',
    category: 'SEC10',
    tier: 'TIER_A',
    pattern: /solid waste management \(swm\) rules, 2026|four-stream segregation|patna bird sanctuary.*chhari-dhand.*ramsar|bio-bitumen in road construction|first tailings policy for critical minerals/i,
    concept: 'Circular Economy & Biodiversity Protection',
    why: 'SWM Rules 2026 mandating 4-stream segregation, Ramsar network expands to 98 sites (Patna Bird Sanctuary & Chhari-Dhand), and CSIR Bio-Bitumen debut.'
  }
];

// 1. Group articles into High-Density Memory Units
const clusterBucket = new Map();
const skippedArticles = [];

RAW_JANUARY_ARTICLES.forEach((art, idx) => {
  const artId = `jan-art-${idx + 1}`;
  const text = `${art.title} ${art.text}`.toLowerCase();

  let matchedAnchor = JANUARY_ANCHOR_PATTERNS.find(a => a.pattern.test(text));

  if (matchedAnchor) {
    if (!clusterBucket.has(matchedAnchor.id)) {
      clusterBucket.set(matchedAnchor.id, { anchor: matchedAnchor, articles: [] });
    }
    clusterBucket.get(matchedAnchor.id).articles.push({ artId, page: art.page, section: art.section, title: art.title, text: art.text });
  } else {
    // Check if it's high yield standalone (e.g. sports or notable milestone)
    const isSpecialSportsOrAward = text.includes('magnus carlsen') || text.includes('vijay hazare') || text.includes('nirmala sitharaman');
    if (isSpecialSportsOrAward) {
      const customId = `emu-jan-standalone-${artId}`;
      clusterBucket.set(customId, {
        anchor: {
          id: customId,
          title: art.title,
          category: art.section === 'Sports' ? 'SEC8' : 'SEC5',
          tier: 'TIER_B_PLUS',
          concept: 'Specialized High-Yield Record / Benchmark',
          why: 'Independently testable sports championship or landmark administrative record.'
        },
        articles: [{ artId, page: art.page, section: art.section, title: art.title, text: art.text }]
      });
    } else {
      skippedArticles.push({
        artId,
        page: art.page,
        section: art.section,
        title: art.title,
        text: art.text,
        skipRationale: 'Low Marginal Information Value (MIV): routine municipal announcement, regional MoU, local corporate PR, or non-exam-tested event.'
      });
    }
  }
});

// 2. Synthesize High-Density V3 Student Notes
const synthesizedNotes = [];

for (const [clusterId, clusterData] of clusterBucket.entries()) {
  const { anchor, articles } = clusterData;
  const master = articles[0];
  const pages = Array.from(new Set(articles.map(a => a.page))).sort((a, b) => a - b);

  const noteBlocks = [
    {
      type: "paragraph",
      content: `**Overview**: ${master.text}`
    },
    {
      type: "bullet_list",
      items: articles.map(a => `**${a.title}** (Page ${a.page}): ${a.text}`)
    },
    {
      type: "exam_trap",
      title: "🎯 Exam Focus & Pitfalls",
      content: `Pay close attention to statutory outlays, regulatory deadlines, and institutional authority under ${anchor.concept}. ${anchor.why}`
    }
  ];

  const studentNote = {
    id: clusterId,
    title: anchor.title,
    category: anchor.category,
    tier: anchor.tier,
    theme: anchor.concept,
    summary: master.text,
    blocks: noteBlocks,
    metadata: {
      provenancePages: pages,
      constituentArticleCount: articles.length,
      provenanceArticleIds: articles.map(a => a.artId),
      statutoryConcept: anchor.concept,
      whyStandalone: anchor.why
    }
  };

  synthesizedNotes.push(studentNote);

  fs.writeFileSync(
    path.join(janStagingDir, `${studentNote.id}.json`),
    JSON.stringify(studentNote, null, 2),
    'utf-8'
  );
}

// 3. Synthesize SECTION 11: Rapid Revision & One-Liners Unit
const sec11Items = [
  "**CPI 2024 Base Year**: Food & beverages weight reduced from 45.86% to 36.75%; Housing increased to 17.66%; Basket expanded to 358 items.",
  "**PANKHUDI Portal (MWCD)**: Central CSR platform channeling private capital and NRI donations to Mission Saksham Anganwadi & Poshan 2.0, Mission Vatsalya, and Mission Shakti.",
  "**SEBI Merchant Banking**: Category I minimum net worth raised to ₹50 Crore (₹12.5 Cr liquid); Category II to ₹10 Crore; Underwriting capped at 20x liquid net worth.",
  "**RBI Related-Party Lending**: Materiality threshold for Board approval set at ₹50 Crore for banks >₹10T assets; ₹10 Crore for ₹1T–10T assets; ₹10 Crore for Upper Layer NBFCs.",
  "**RBI Dividend Payout Ceiling**: Raised from 40% to 75% of PAT for commercial banks based on a 10-bucket CET1 capital matrix.",
  "**GNCTD Public Debt (Sec 21A)**: RBI undertakes Delhi public debt management; WMA limit fixed at ₹890 Crore (All-India States/UTs total ₹61,008 Crore).",
  "**Closing Auction Session (CAS)**: 20-minute session (3:15 PM – 3:35 PM) with ±3% price band for F&O stocks effective 3 August 2026.",
  "**SWAGAT-FI**: SEBI single-window automatic access for SWFs, central banks, and global pension funds effective 1 June 2026.",
  "**DICGC Coverage FY25**: 97.6% of bank accounts and ₹100.12 Lakh Crore insured across 1,982 banks; Deposit Insurance Fund stood at ₹2.29 Lakh Crore.",
  "**Bulgaria Euro Adoption**: Became 21st member of Eurozone on 1 Jan 2026, replacing the Bulgarian Lev.",
  "**EU Carbon Border Tax (CBAM)**: World's first carbon border tax entered full force on 1 Jan 2026 across 6 sectors (Steel, Aluminium, Cement, Fertilizers, Electricity, Hydrogen).",
  "**18th BRICS Summit 2026**: India assumed 2026 presidency from Brazil focusing on 4 pillars: Resilience, Innovation, Cooperation, and Sustainability.",
  "**MAHSR Bullet Train**: 508 km corridor (₹1.08 Lakh Crore, 81% JICA loan); Surat–Bilimora section scheduled to open on 15 August 2027.",
  "**131 Padma Awards 2026**: 5 Padma Vibhushan, 13 Padma Bhushan (including Uday Kotak), 113 Padma Shri. Ashok Chakra conferred on Astronaut Gp Capt Shubhanshu Shukla.",
  "**Henley Passport Index 2026**: India ranked 80th with visa-free/VoA access to 55 nations; Singapore ranked 1st (192 destinations)."
];

const sec11Note = {
  id: 'emu-jan-rapid-revision-one-liners',
  title: '⚡ Rapid Revision & High-Yield One-Liners — January 2026 Exam Cheat Sheet',
  category: 'SEC11',
  tier: 'TIER_A',
  theme: 'High-Yield Exam Rapid Recall Points',
  summary: 'Consolidated one-liner cheat sheet spanning sovereign GDP, CPI base overhaul, SEBI/RBI regulations, international pacts, defence milestones, and Padma awards for January 2026.',
  blocks: [
    {
      type: "paragraph",
      content: "This high-density rapid revision unit aggregates every testable one-liner, statutory threshold, and institutional milestone from the 169-page January 2026 Current Affairs document for fast exam-eve recall."
    },
    {
      type: "bullet_list",
      items: sec11Items
    },
    {
      type: "exam_trap",
      title: "🎯 Rapid Revision Rule",
      content: "In Banking Phase 1 (General Awareness) and Phase 2 (ESI / Finance), questions test exact numbers: 36.75% food weight, ₹50 Cr merchant banking net worth, 75% dividend payout cap, and 15 Aug 2027 bullet train launch."
    }
  ],
  metadata: {
    provenancePages: [1, 2, 3, 4, 7, 8, 9, 15, 20, 35, 100, 135, 169],
    constituentArticleCount: sec11Items.length,
    provenanceArticleIds: ["jan-rapid-sec11-all"],
    statutoryConcept: "Rapid Revision One-Liners & High-Yield Facts",
    whyStandalone: "Dedicated Section 11 revision container for fast recall."
  }
};

synthesizedNotes.push(sec11Note);
fs.writeFileSync(
  path.join(janStagingDir, `${sec11Note.id}.json`),
  JSON.stringify(sec11Note, null, 2),
  'utf-8'
);

// 4. Generate Skipped Articles Log (JSON & Markdown)
const skippedLogData = {
  month: 'January 2026',
  sourceDocument: 'CGB Mentors CA January 2026 (169 Pages)',
  totalRawExtractedArticles: RAW_JANUARY_ARTICLES.length,
  totalSynthesizedUnits: synthesizedNotes.length,
  totalSkippedArticles: skippedArticles.length,
  skippedArticles: skippedArticles
};

fs.writeFileSync(
  'content/repairs/ca_v3/january_skipped_articles_log.json',
  JSON.stringify(skippedLogData, null, 2),
  'utf-8'
);

let mdContent = `# January 2026 Current Affairs — Skipped Articles Audit Log\n\n`;
mdContent += `**Source Document:** CGB Mentors CA January 2026 (169 Pages)\n`;
mdContent += `**Total Raw Candidate Articles:** ${RAW_JANUARY_ARTICLES.length}\n`;
mdContent += `**Total Published Revision Notes:** ${synthesizedNotes.length}\n`;
mdContent += `**Total Filtered / Skipped Items:** ${skippedArticles.length}\n\n`;
mdContent += `Use this transparent log to inspect any skipped item and request immediate restoration into the live student notebook.\n\n`;
mdContent += `| # | Page | Section | Article Title | Summary / Raw Text | Skip Rationale |\n`;
mdContent += `|---|------|---------|---------------|--------------------|----------------|\n`;

skippedArticles.forEach((s, idx) => {
  const cleanTitle = s.title.replace(/\|/g, '-');
  const cleanText = s.text.replace(/\|/g, '-').replace(/\n/g, ' ');
  mdContent += `| ${idx + 1} | ${s.page} | ${s.section} | **${cleanTitle}** | ${cleanText} | ${s.skipRationale} |\n`;
});

fs.writeFileSync('content/repairs/ca_v3/january_skipped_articles_log.md', mdContent, 'utf-8');

console.log('========================================================');
console.log('📊 R5.5 JANUARY 2026 PRODUCTION RUN SUMMARY (V2)');
console.log('========================================================');
console.log(`Raw Candidate Articles:          ${RAW_JANUARY_ARTICLES.length}`);
console.log(`Synthesized Memory Units:        ${synthesizedNotes.length} High-Density Notes (incl. Section 11)`);
console.log(`Skipped / Filtered Articles:     ${skippedArticles.length} Articles`);
console.log(`Generated Skipped Log:           content/repairs/ca_v3/january_skipped_articles_log.json`);
console.log(`Generated Markdown Audit:        content/repairs/ca_v3/january_skipped_articles_log.md`);
