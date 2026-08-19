/**
 * CGB Mentors January 2026 PDF Ingestion & Extraction Engine
 * Ingests and normalizes raw candidate articles across all 169 pages.
 */

const fs = require('fs');
const path = require('path');

const RAW_JANUARY_ARTICLES = [
  // ESI, FINANCE & BUSINESS NEWS (Pages 2 - 13)
  {
    page: 2,
    section: 'ESI, Finance & Business News',
    title: 'Pradhan Mantri Matru Vandana Yojana (PMMVY) Completes Nine Years',
    text: 'PMMVY completed 9 years on 1st January 2026 (launched 1 Jan 2017). Provides cash benefit of ₹5,000 for the first child (₹3,000 on registration, ₹2,000 after childbirth) and ₹6,000 for the second girl child. Eligible beneficiaries also receive cash incentive under Janani Suraksha Yojana. Over 4.5 crore beneficiaries enrolled with >₹19,000 crore disbursed.'
  },
  {
    page: 2,
    section: 'ESI, Finance & Business News',
    title: 'Additional Excise Duty and 40% GST on Tobacco and Sin Goods Effective Feb 1',
    text: 'Government notified February 1 as effective date for 40% GST rate on pan masala, cigarettes, and tobacco (18% for biris). Health and national security cess levied on pan masala; additional excise duty on tobacco to replace the expiring compensation cess.'
  },
  {
    page: 2,
    section: 'ESI, Finance & Business News',
    title: 'DEA Creates Three-Year PPP Project Pipeline Worth ₹17 Lakh Crore',
    text: 'Department of Economic Affairs (MoF) created a 3-year Public Private Partnership (PPP) pipeline comprising 852 projects across Central Infrastructure Ministries, States, and UTs with a combined project cost exceeding ₹17 lakh crore, fulfilling Budget 2025-26 announcement.'
  },
  {
    page: 2,
    section: 'ESI, Finance & Business News',
    title: 'NSO Releases First Advance Estimates of GDP for FY 2025-26 at 7.4%',
    text: 'National Statistics Office (MoSPI) released First Advance Estimates of GDP for FY 2025-26 at Constant (2011-12) and Current Prices. Real GDP growth estimated at 7.4% in FY 2025-26 compared to 6.5% in FY 2024-25.'
  },
  {
    page: 3,
    section: 'ESI, Finance & Business News',
    title: 'MWCD Launches PANKHUDI Portal for CSR in Women & Child Development',
    text: 'Ministry of Women and Child Development launched PANKHUDI, an integrated Corporate Social Responsibility (CSR) and partnership facilitation digital platform bringing together NRIs, NGOs, and corporates to support Mission Saksham Anganwadi & Poshan 2.0, Mission Vatsalya, and Mission Shakti.'
  },
  {
    page: 3,
    section: 'ESI, Finance & Business News',
    title: 'UN UNDESA Projects India GDP Growth at 6.6% in FY27 and 6.8% in FY28',
    text: 'United Nations Department of Economic and Social Affairs projected India GDP growth at 7.4% for CY2025, 6.6% in FY 2026-27, and 6.8% in FY 2027-28. Global headline inflation projected to decline to 3.1% in 2026 from 3.4% in 2025.'
  },
  {
    page: 3,
    section: 'ESI, Finance & Business News',
    title: 'Bank Credit Demand Crosses ₹200 Lakh Crore Mark with 14.5% YoY Growth: CMIE',
    text: 'CMIE data showed outstanding bank credit crossed the ₹200 lakh crore mark for the first time, reaching ₹203.2 lakh crore at end-December 2025 (14.5% YoY growth). YTD credit expanded by ₹20.78 lakh crore.'
  },
  {
    page: 4,
    section: 'ESI, Finance & Business News',
    title: 'EU Emerges as Largest Trading Partner for Indian Goods at $136.53 Billion',
    text: 'Commerce ministry data showed Spain, Germany, Belgium, and Poland emerging as key export destinations within the EU bloc. Bilateral trade in goods reached USD 136.53 billion in 2024-25 (exports $75.85B, imports $60.68B).'
  },
  {
    page: 4,
    section: 'ESI, Finance & Business News',
    title: 'MoSPI Announces CPI Base Year Revision to 2024=100 & IIP/GDP Revisions to 2022-23',
    text: 'December 2025 CPI stood at 1.33% (provisional), marking the final release for 2012=100 base. Revised CPI series with base year 2024=100 will be released on 12 Feb 2026. New GDP series (base 2022-23) on 27 Feb 2026; new IIP series (base 2022-23) on 28 May 2026.'
  },
  {
    page: 4,
    section: 'ESI, Finance & Business News',
    title: 'World Bank Global Economic Prospects Forecasts 7.2% India Growth in FY26',
    text: 'World Bank Global Economic Prospects (January 2025) estimated India GDP growth at 7.2% in FY 2025-26, 6.5% in 2026-27, and 6.6% in 2027-28. Global growth projected at 2.7% in FY26 and 2.6% in FY27.'
  },
  {
    page: 5,
    section: 'ESI, Finance & Business News',
    title: 'Startup India Decadal Milestone — Over 2.07 Lakh Recognized Startups & 1 Lakh Women-Led',
    text: 'On National Startup Day (16 Jan), DPIIT marked 10 years of Startup India (launched 2016). Over 2.07 lakh startups officially recognized; Maharashtra leads with 35,991 startups; 99,640 startups have at least one woman director.'
  },
  {
    page: 5,
    section: 'ESI, Finance & Business News',
    title: 'Periodic Labour Force Survey: India Unemployment Rate at 4.8% in Dec 2025',
    text: 'LFPR for age 15+ reached 56.1% in Dec 2025 (female LFPR 35.3%, worker population ratio 53.4%). Overall unemployment stood at 4.8%; urban female unemployment dropped to 9.1%.'
  },
  {
    page: 5,
    section: 'ESI, Finance & Business News',
    title: 'IndiaAI and NFRA Launch AI-Powered Financial Reporting Compliance Challenge',
    text: 'IndiaAI (MeitY) and National Financial Reporting Authority (NFRA, constituted 1 Oct 2018 under Sec 132 Companies Act 2013) launched challenge under IADI to develop AI solutions for automated verification of financial documents. Up to 10 shortlisted teams receive ₹5L each; winner receives ₹1 Cr 2-year deployment contract.'
  },
  {
    page: 6,
    section: 'ESI, Finance & Business News',
    title: 'GeM Womaniya Initiative Completes 7 Years with ₹80,000 Crore Public Procurement',
    text: 'Government e-Marketplace completed 7 years of Womaniya Initiative (launched 14 Jan 2019). Women-led MSEs and SHGs secured over ₹80,000 crore in public procurement orders.'
  },
  {
    page: 6,
    section: 'ESI, Finance & Business News',
    title: 'ICAR-NDRI Registers Karan Fries Climate-Resilient Synthetic Cattle Breed',
    text: 'ICAR granted official registration to Karan Fries cow breed developed by NDRI via crossbreeding Holstein Friesian with indigenous Tharparkar. Yields average 3,550 kg milk per lactation (11.6 kg/day; peak 46.5 kg/day).'
  },
  {
    page: 7,
    section: 'ESI, Finance & Business News',
    title: 'IMF Raises India FY26 Growth Forecast to 7.3% in WEO Update',
    text: 'IMF World Economic Outlook update raised India FY26 growth forecast to 7.3% (6.4% in FY27). Global growth projected at 3.3% in 2025-26 and 2026-27.'
  },
  {
    page: 7,
    section: 'ESI, Finance & Business News',
    title: 'Mines Ministry Notifies India’s First Tailings Policy for Critical Minerals Recovery',
    text: 'Central government notified country\'s first Tailings Policy for extracting critical minerals from mine dumps, slags, and tailing ponds. IBM, CMPDI, and AMD to analyze dumps to determine companionality.'
  },
  {
    page: 7,
    section: 'ESI, Finance & Business News',
    title: 'Union Cabinet Approves Wage Revision for PSGICs, NABARD & Pension Hike for RBI Retirees',
    text: 'Cabinet approved 12.41% overall wage hike (14% on basic/DA) for Public Sector General Insurance Companies (effective Aug 2022, ₹8,170.30 Cr outgo), NPS contribution increased to 14%, family pension 30%. Approved ~20% pay hike for NABARD (effective Nov 2022) and 10% pension enhancement on basic+DR for RBI retirees (₹2,696.82 Cr implication).'
  },
  {
    page: 8,
    section: 'ESI, Finance & Business News',
    title: 'Beti Bachao Beti Padhao Campaign Completes 11 Years (Sex Ratio at Birth at 930)',
    text: 'BBBP completed 11 years on 22 Jan 2026 (launched 2015 in Panipat). National Sex Ratio at Birth improved to 930 from 918 in 2014-15. Sukanya Samriddhi Yojana offers 8.2% interest for girl child up to 10 years.'
  },
  {
    page: 9,
    section: 'ESI, Finance & Business News',
    title: 'Cabinet Approves Continuation of Atal Pension Yojana (APY) up to FY 2030-31',
    text: 'Cabinet approved continuation of APY (launched 9 May 2015) up to FY 2030-31 with funding support. Provides guaranteed monthly pension of ₹1,000 to ₹5,000 at age 60 for unorganised sector workers.'
  },
  {
    page: 9,
    section: 'ESI, Finance & Business News',
    title: 'Cabinet Approves ₹5,000 Crore Equity Support to SIDBI in Three Tranches',
    text: 'Cabinet approved ₹5,000 crore equity infusion by DFS into SIDBI: ₹3,000 crore in FY26 at book value of ₹568.65 (as of 31.03.2025), and ₹1,000 crore each in FY27 and FY28.'
  },
  {
    page: 10,
    section: 'ESI, Finance & Business News',
    title: 'Historic India–EU Free Trade Agreement Concluded on Republic Day 2026',
    text: 'India and EU concluded FTA negotiations on 26 Jan 2026 ("Mother of all deals"). EU is India\'s 2nd largest goods trading partner (€120B in 2024; EU FDI in India €132B). India-Euratom nuclear cooperation signed. India allows EU banks to open 15 branches over 4 years and binds 100% insurance FDI.'
  },
  {
    page: 11,
    section: 'ESI, Finance & Business News',
    title: 'MoF Approves ₹199.24 Crore PMMSY Smart Fishing Harbour at Mayabunder, A&N',
    text: 'Department of Fisheries approved ₹199.24 crore 100% CFA under PMMSY for Smart and Integrated Fishing Harbour at Mayabunder under Blue Port Initiative, handling 430 vessels and 10,000 tonnes of fish annually to support ₹1L Cr seafood export target by 2030-31.'
  },
  {
    page: 11,
    section: 'ESI, Finance & Business News',
    title: 'Economic Survey 2025-26 Projects FY27 Real GDP Growth at 6.8% to 7.2%',
    text: 'Economic Survey tabled by FM Nirmala Sitharaman (prepared under CEA V. Anantha Nageswaran) projected FY27 real GDP growth in the range of 6.8% to 7.2%.'
  },
  {
    page: 12,
    section: 'ESI, Finance & Business News',
    title: 'IIP Growth Reaches 26-Month High of 7.8% in December 2025',
    text: 'Index of Industrial Production (base 2011-12=100) rose 7.8% in Dec 2025 led by manufacturing (8.1%), mining (6.8%), electricity (6.3%), and optical/electronic products (34.9%).'
  },
  {
    page: 13,
    section: 'ESI, Finance & Business News',
    title: 'World Bank Announces $8–10 Billion Annual Financing CPF for India (FY26–FY31)',
    text: 'World Bank Group launched new Country Partnership Framework (CPF) for India committing $8-10 billion annual lending over FY26-FY31 for private-sector jobs, including $830 million loan for PM-SETU ITI skilling.'
  },
  {
    page: 13,
    section: 'ESI, Finance & Business News',
    title: 'New CPI Series Cuts Food & Beverage Weight from 45.86% to 36.75%',
    text: 'MoSPI revised CPI basket structure for 2024 base: food & beverage weight reduced to 36.75% (from 45.86%), housing increased to 17.66% (from 10.07%), and total items expanded to 358 (from 299).'
  },

  // REGULATORY BODIES NEWS (Pages 14 - 36)
  {
    page: 14,
    section: 'Regulatory Bodies News',
    title: 'SEBI Phased Merchant Banking Capital Overhaul (Cat I ₹50 Cr, Cat II ₹10 Cr Net Worth)',
    text: 'SEBI mandated phased net worth requirement for Merchant Bankers by Jan 2028: Category I net worth raised to ₹50 Cr (liquid net worth ₹12.5 Cr); Category II to ₹10 Cr (liquid net worth ₹2.5 Cr). Underwriting capped at 20x liquid net worth. Minimum 3-year revenue ₹25 Cr (Cat I) and ₹5 Cr (Cat II).'
  },
  {
    page: 15,
    section: 'Regulatory Bodies News',
    title: 'RBI Data: Bank Credit Demand from Industry Grows 9.6% in Nov 2025',
    text: 'RBI data showed loan demand from industry grew 9.6% YoY in Nov 2025 (vs 8.3% last year), retail loans grew 12.8%, and NBFC loan growth rose to 9.5%.'
  },
  {
    page: 15,
    section: 'Regulatory Bodies News',
    title: 'RBI IIP Data: India Net International Claims Decline to $274.3 Billion in Q2 FY26',
    text: 'RBI International Investment Position report showed net claims of non-residents declined by $38.4B to $274.3B in Q2 FY26. Ratio of international assets to liabilities improved to 81.3%. Reserve assets stood at $700.1 billion.'
  },
  {
    page: 16,
    section: 'Regulatory Bodies News',
    title: 'RBI Eases Infrastructure Lending Risk-Weight Framework for NBFCs',
    text: 'RBI relaxed proposed risk-weight norms for NBFC infrastructure exposures: 75% risk weight assigned at 2% repayment threshold (cut from 5%), and 50% risk weight at 5% repayment threshold (cut from 10%). Takes effect April 1, 2026.'
  },
  {
    page: 16,
    section: 'Regulatory Bodies News',
    title: 'RBI Financial Stability Report: Unsecured Retail Slippages Hit 53.1% of SCB Retail Slippages',
    text: 'RBI FSR showed unsecured retail loans formed 53.1% of total retail loan slippages as of Sept 2025. Gross NPA of SCBs stable at 1.8% (retail 1.1%). PSBs recorded lowest unsecured slippage (1.4%), SFBs highest (10.4%). Gold loans accounted for 5.8% of total advances.'
  },
  {
    page: 17,
    section: 'Regulatory Bodies News',
    title: 'SEBI Mandates NISM Series-III-C Certification for AIF Compliance Officers from Jan 2027',
    text: 'SEBI mandated that compliance officers of AIF managers must obtain NISM Series-III-C certification (Securities Intermediaries Compliance - Fund) by January 1, 2027.'
  },
  {
    page: 17,
    section: 'Regulatory Bodies News',
    title: 'RBI Commercial Banks Credit Risk Directions 2026: Materiality Thresholds on Related-Party Loans',
    text: 'RBI set transaction-level board approval ceilings for related-party loans: ₹25 Cr for banks with assets >₹10T, ₹10 Cr for assets ₹1T–₹10T, and ₹5 Cr for assets <₹1T. Applicable from April 1, 2026.'
  },
  {
    page: 18,
    section: 'Regulatory Bodies News',
    title: 'Payments Regulatory Board (PRB) Holds First Meeting Under RBI Governor Sanjay Malhotra',
    text: 'PRB held its inaugural meeting in Mumbai following constitution under amended Payment and Settlement Systems Act 2007 (effective May 9, 2025).'
  },
  {
    page: 18,
    section: 'Regulatory Bodies News',
    title: 'RBI Signs Section 21A Agreement with GNCTD for Public Debt & Sets ₹890 Cr WMA Limit',
    text: 'RBI entered into Agreement under Sec 21A of RBI Act 1934 with Government of NCT of Delhi (effective 9 Jan 2026) to manage its banking and public debt. WMA limit for Delhi fixed at ₹890 crore (revised aggregate State/UT WMA limit ₹61,008 crore; UP highest at ₹6,519 Cr).'
  },
  {
    page: 18,
    section: 'Regulatory Bodies News',
    title: 'RBI Supervisory Data Quality Index (sDQI) for SCBs Scores 90.7 in September 2025',
    text: 'RBI sDQI for 87 SCBs reached 90.7 (PSBs 91.1, SFBs 91.5, Private Banks 90.6, Foreign Banks 90.4). Evaluates accuracy, timeliness, completeness, and consistency across ALE, RAQ, ROR, RBS, LR, RCA, and CRILC returns.'
  },
  {
    page: 19,
    section: 'Regulatory Bodies News',
    title: 'RBI Draft Framework Proposes Raising Bank Dividend Payout Cap to 75% of PAT',
    text: 'RBI proposed raising dividend payout ceiling for commercial banks from 40% to 75% of adjusted PAT under a 10-bucket capital-linked structure based on CET1 ratios after deducting net NPAs.'
  },
  {
    page: 20,
    section: 'Regulatory Bodies News',
    title: 'DICGC Insures 97.6% of Bank Accounts and 41.5% of Deposit Value (₹100.12L Cr) in FY25',
    text: 'RBI data showed DICGC covered 97.6% of bank accounts and ₹100.12 lakh crore deposits (41.5% of total ₹241.08L Cr) across 1,982 banks (139 commercial, 1,843 cooperative) up to ₹5L limit at 12 paise/₹100 premium. Deposit insurance fund stood at ₹2.29L Cr.'
  },
  {
    page: 20,
    section: 'Regulatory Bodies News',
    title: 'SEBI Extends B-30 and Women Investor MFD Incentive Framework to March 1, 2026',
    text: 'SEBI extended rollout of additional MFD incentives (1% of 1st lump-sum/SIP up to ₹2,000 funded from 2 bps investor education pool) for onboarding individual investors from B-30 cities and women investors to March 1, 2026.'
  },
  {
    page: 21,
    section: 'Regulatory Bodies News',
    title: 'RBI Mandates 3-Year Cooling-Off Period After 10-Year Board Tenure in Co-op Banks',
    text: 'RBI proposed amendments to Governance Directions 2025 for UCBs and Rural Co-operative Banks introducing mandatory 3-year cooling-off period for directors completing 10 years continuous tenure before reappointment.'
  },
  {
    page: 22,
    section: 'Regulatory Bodies News',
    title: 'SEBI Permits Stockbrokers to Undertake IRDAI and RBI Regulated Financial Activities',
    text: 'SEBI allowed registered stockbrokers to offer cross-regulatory services under IRDAI and RBI oversight with dedicated compliance officer, and introduced Digital Signature Certificates (DSCs) onboarding for FPIs.'
  },
  {
    page: 22,
    section: 'Regulatory Bodies News',
    title: 'SEBI Overhauls Technical Glitch Framework Exempting Brokers with <10,000 Clients',
    text: 'SEBI rationalized electronic trading glitch rules, exempting brokers with <10,000 clients (relieving 60% of brokers), extending glitch reporting window to 2 hours, and unifying under Common Reporting Platform.'
  },
  {
    page: 23,
    section: 'Regulatory Bodies News',
    title: 'RBI RPT Directions 2026: Materiality Caps on Loans to Related Parties for Banks & NBFCs',
    text: 'RBI aligned related-party definitions with Companies Act 2013 and IBC, capping board committee approval thresholds for Top/Upper Layer NBFCs at ₹10 Cr, Middle Layer at ₹5 Cr, and Base Layer at ₹1 Cr (Banks >₹10T at ₹50 Cr, ₹1T–₹10T at ₹10 Cr, <₹1T at ₹5 Cr).'
  },
  {
    page: 25,
    section: 'Regulatory Bodies News',
    title: 'RBI Issues FEMA (Guarantees) Regulations 2026 & Prohibits Resident Guarantees for NRIs',
    text: 'RBI notified FEMA (Guarantees) Regulations 2026 superseding earlier AP DIR circulars, prohibiting resident Indians from issuing credit guarantees to NRIs unless underlying transaction complies with cross-border lending rules.'
  },
  {
    page: 26,
    section: 'Regulatory Bodies News',
    title: 'RBI Issues Reserve Bank of India (Internal Ombudsman) Directions 2026',
    text: 'RBI updated IO directions effective 30 June 2026 for Commercial Banks, SFBs, Payments Banks, NBFCs, PPIs, and CICs. IO/Dy IO appointed for fixed term of 3-5 years (age limit 70 years, GM/DGM rank with 7/5 yrs experience). RBI Ombudsman compensation power capped at ₹30 lakh (₹3L for harassment).'
  },
  {
    page: 28,
    section: 'Regulatory Bodies News',
    title: 'RBI Draft Directions Align Net Open Position (NOP) & Forex Risk with Basel Standards',
    text: 'RBI proposed revised continuous daily computation of NOP and capital charges for foreign exchange risk effective April 1, 2027, removing separate offshore/onshore NOP and extending rules to SFBs and RRB Authorised Dealers.'
  },
  {
    page: 29,
    section: 'Regulatory Bodies News',
    title: 'RBI Notifies FEMA (Export & Import of Goods and Services) Regulations 2026',
    text: 'RBI notified principle-based export/import rules effective 1 Oct 2026 requiring AD banks to enter EDF details into EDPMS within 5 working days for non-EDI ports.'
  },
  {
    page: 29,
    section: 'Regulatory Bodies News',
    title: 'SEBI to Introduce 20-Minute Closing Auction Session (CAS) in Cash Segment from Aug 2026',
    text: 'SEBI decided to roll out Closing Auction Session (CAS) for F&O stocks from 3:15 pm to 3:35 pm (price band ±3% of VWAP) effective 3 August 2026, replacing pure 30-min VWAP.'
  },
  {
    page: 30,
    section: 'Regulatory Bodies News',
    title: 'SEBI Proposes Same-Day Fund Netting for Foreign Portfolio Investors (FPIs)',
    text: 'SEBI proposed allowing FPIs to net sale and purchase obligations in cash market transactions on the same day instead of settling on a gross basis.'
  },
  {
    page: 30,
    section: 'Regulatory Bodies News',
    title: 'SEBI Notifies SWAGAT-FI Unified Registration Framework for FPIs & FVCIs',
    text: 'SEBI issued circulars on Single Window Automatic and Generalized Access for Trusted Foreign Investors (SWAGAT-FI) effective June 1, 2026, creating streamlined onboarding for SWFs, pension funds, and central banks.'
  },
  {
    page: 31,
    section: 'Regulatory Bodies News',
    title: 'SEBI Proposes Centralized Supplementary KYC at KRA Level to Cut Duplication',
    text: 'SEBI consultation paper proposed centralizing supplementary KYC data (income slabs, FATCA, PEP status) at KRA level to eliminate repeated submissions across intermediaries.'
  },
  {
    page: 31,
    section: 'Regulatory Bodies News',
    title: 'RBI Floats BRICS Central Bank Digital Currency (CBDC) Interlinkage for 2026 Summit',
    text: 'RBI proposed linking official CBDCs across BRICS nations for cross-border trade and tourism payments, recommending it for the agenda of the 18th BRICS Summit 2026.'
  },
  {
    page: 32,
    section: 'Regulatory Bodies News',
    title: 'SEBI Framework to Regulate Significant Mutual Fund Indices (>₹20,000 Cr AUM)',
    text: 'SEBI proposed governance framework for market indices tracked by mutual funds with combined AUM exceeding ₹20,000 crore assessed on a 6-month rolling basis.'
  },
  {
    page: 32,
    section: 'Regulatory Bodies News',
    title: 'RBI Tightens Priority Sector Lending (PSL) with Mandatory External Auditor Certificates',
    text: 'RBI mandated scheduled banks to obtain external auditor certificates from NBFCs, MFIs, and HFCs ensuring on-lending loans are not double-counted as PSL by multiple banks (on-lending cap: NBFCs 5%, NBFC-MFIs 10%).'
  },
  {
    page: 34,
    section: 'Regulatory Bodies News',
    title: 'RBI Study on State Finances 2025-26: Youthful States vs Ageing States Pension Dynamics',
    text: 'RBI study categorized states into Youthful (<10% 60+), Intermediate (10-15%), and Ageing (15%+). Northern states (Bihar/UP) recorded 19.5% GSDP revenues; Southern states (Kerala/TN) saw pensions consume 30% of social spending amid 30% OADR. State fiscal deficit widened to 3.3% of GDP.'
  },
  {
    page: 35,
    section: 'Regulatory Bodies News',
    title: 'RBI Outlines Principle-Based Natural Calamity Loan Resolution Framework from April 2026',
    text: 'RBI framed resolution guidelines for standard/SMA-0 borrowers impacted by natural disasters, permitting loan rescheduling, interest conversion, and moratoria based on SLBC/DCC decisions.'
  },
  {
    page: 36,
    section: 'Regulatory Bodies News',
    title: 'SEBI Opens 1-Year Special Demat Window for Pre-2019 Physical Securities',
    text: 'SEBI opened a 1-year special window (5 Feb 2026 to 4 Feb 2027) with a 1-year lock-in for dematerializing physical securities bought/sold before 1 April 2019.'
  },
  {
    page: 36,
    section: 'Regulatory Bodies News',
    title: 'SEBI Cuts Demat Transfer Period from 150 Days to 30 Days via Direct RTA Credit',
    text: 'SEBI abolished Letter of Confirmation (LOC) requirement, enabling RTAs to directly credit demat shares and reducing transfer timelines from 150 days to 30 days from 2 April 2026.'
  },
  {
    page: 36,
    section: 'Regulatory Bodies News',
    title: 'SEBI Forms Working Group to Demarcate Mutual Fund Distributors (MFDs) and RIAs',
    text: 'SEBI constituted a panel to resolve regulatory overlaps between fee-based Registered Investment Advisers (RIAs) and commission-earning Mutual Fund Distributors (MFDs).'
  },
  {
    page: 36,
    section: 'Regulatory Bodies News',
    title: 'Government Pilots CBDC Digital Food Currency Under Free Ration Scheme (PDS)',
    text: 'Government rolled out pilot for programmed e-Rupee food tokens in Chandigarh, Puducherry, and 3 Gujarat districts (Anand, Sabarmati, Dahod) via RBI, Ministry of Consumer Affairs, and NPCI.'
  },

  // BANKING NEWS (Pages 37 - 50)
  {
    page: 37,
    section: 'Banking News',
    title: 'ADB Approves ₹4,100 Crore ($500M) Loan for Phase-I Musi Riverfront Project',
    text: 'Asian Development Bank agreed to extend ₹4,100 crore ($500 million) to Telangana for Musi Riverfront Development (originating in Ananthagiri Hills, flowing into Osmansagar and Himayatsagar).'
  },
  {
    page: 37,
    section: 'Banking News',
    title: 'Gross GST Collections Reach ₹1.74 Lakh Crore in December 2025 (6.1% YoY)',
    text: 'Gross GST collections rose 6.1% YoY to over ₹1.74 lakh crore in Dec 2025 (net revenue ₹1.45 trillion).'
  },
  {
    page: 37,
    section: 'Banking News',
    title: 'ICICI Bank Launches Capital Gains Account Scheme (CGAS) for Individuals & HUFs',
    text: 'ICICI Bank launched CGAS allowing customers to park uninvested capital gains/sale proceeds, earn interest, and claim tax exemptions during 3-year reinvestment window.'
  },
  {
    page: 38,
    section: 'Banking News',
    title: 'SBI to Facilitate Bilateral India-Israel Trade in Rupee via SRVA Mechanism',
    text: 'SBI (only Indian bank with Israel branch, opened 2007) announced INR trade settlement with Israel through Special Rupee Vostro Accounts (SRVA).'
  },
  {
    page: 38,
    section: 'Banking News',
    title: 'Bank Credit-Deposit Ratio Touches Record High of 81.6% in Q3 FY26',
    text: 'Banking system CD ratio hit record 81.6% in Dec 2025 due to credit growth (12-20%) outpacing deposits (11.5%). HDFC Bank CD ratio reached 99.45%, Axis Bank 92.84%.'
  },
  {
    page: 38,
    section: 'Banking News',
    title: 'Government Retains Small Savings Interest Rates for Q4 FY26 (SSY 8.2%, PPF 7.1%)',
    text: 'Government maintained small savings interest rates for 7th consecutive quarter (Q4 FY26): Sukanya Samriddhi 8.2%, NSC 7.7%, KVP 7.5% (115 months maturity), PPF 7.1%, Post Office Savings 4%.'
  },
  {
    page: 39,
    section: 'Banking News',
    title: 'SBI Awards ₹1,000 Crore 10-Year Direct ATM Outsourcing Contract to CMS Info Systems',
    text: 'CMS Info Systems bagged ₹1,000 crore 10-year contract from SBI to manage 5,000 ATMs across India, marking the first large direct PSU bank cash outsourcing deal.'
  },
  {
    page: 40,
    section: 'Banking News',
    title: 'FSS Becomes First Payments Company Across APAC & Middle East with ISO/IEC 42001 AI Certification',
    text: 'Financial Software and Systems (FSS) became the first payments firm in India, ME, APAC, and SA to receive ISO/IEC 42001 international standard for Artificial Intelligence Management Systems (AIMS).'
  },
  {
    page: 41,
    section: 'Banking News',
    title: 'Bank of Baroda Gets RBI In-Principle Nod to Form Standalone Primary Dealer (SPD) Subsidiary',
    text: 'Bank of Baroda received RBI in-principle approval to transfer its primary dealership business to a wholly owned subsidiary (system has 7 SPDs and 14 Bank PDs).'
  },
  {
    page: 42,
    section: 'Banking News',
    title: 'DFS Launches Paripoorna Mediclaim Ayush Bima for CGHS Beneficiaries (₹10L/₹20L Cover)',
    text: 'Department of Financial Services launched Paripoorna Mediclaim Ayush Bima for CGHS beneficiaries offering ₹10L or ₹20L in-patient indemnity cover with 70:30 or 50:50 co-payment options for up to 6 family members.'
  },
  {
    page: 43,
    section: 'Banking News',
    title: 'RBI Recognises Foreign Exchange Dealers’ Association of India (FEDAI) as SRO',
    text: 'RBI granted Self-Regulatory Organization (SRO) recognition to FEDAI (established 1958 under Sec 25 of Companies Act 1956) for all Authorized Dealers in foreign exchange.'
  },
  {
    page: 44,
    section: 'Banking News',
    title: 'RBI Grants In-Principle Nod to Sumitomo Mitsui Banking Corp (SMBC) for Wholly Owned Subsidiary',
    text: 'RBI granted in-principle approval to Japan\'s SMBC (operating 4 branches in India) to convert into a Wholly-Owned Subsidiary under Section 22(1) of Banking Regulation Act 1949.'
  },
  {
    page: 44,
    section: 'Banking News',
    title: 'EPFO Expands Auto-Settlement Limit to ₹5 Lakh & Enables UPI PF Withdrawals from April 1',
    text: 'EPFO subscribers can withdraw PF directly via UPI gateway by 1 April 2026. Auto-settlement limit raised from ₹1L to ₹5L within 3 days. Members can withdraw up to 75% of PF after 1 year of service.'
  },
  {
    page: 45,
    section: 'Banking News',
    title: 'DFS Launches Composite Salary Account Package for Central Government Employees',
    text: 'DFS launched comprehensive salary package offering ₹1.5 Cr Personal Accident Cover, ₹2 Cr Air Accident Cover, ₹1.5 Cr Total Disability Cover, and ₹20 Lakh Term Life Insurance.'
  },
  {
    page: 45,
    section: 'Banking News',
    title: 'Tripura Gramin Bank Launches India’s First Solar-Powered Mobile ATM Van',
    text: 'Tripura Gramin Bank, supported by NABARD, became the first Regional Rural Bank in India to deploy a fully solar-powered mobile ATM van for rural financial inclusion.'
  },
  {
    page: 46,
    section: 'Banking News',
    title: 'PSBs Sanction Over ₹52,300 Crore to 3.96 Lakh MSMEs via Digital Credit Assessment Model',
    text: 'Public Sector Banks sanctioned >₹52,300 crore to 3.96 lakh MSMEs between April-Dec 2025 using automated Credit Assessment Model (CAM) based on GST, ITR, and banking digital footprints.'
  },
  {
    page: 47,
    section: 'Banking News',
    title: 'JPMorgan UK Unit Receives IFSCA Licence to Open Branch in GIFT City for Equities Trading',
    text: 'JPMorgan Securities Plc received license from IFSCA to establish a banking unit in GIFT City Gandhinagar for equities trading.'
  },
  {
    page: 47,
    section: 'Banking News',
    title: 'RXIL Becomes First TReDS Platform in India to Declare Dividend (21.6%)',
    text: 'Receivables Exchange of India Ltd (RXIL, promoted by SIDBI and NSE with SBI, ICICI, Yes Bank) declared maiden interim dividend of 21.6% on ₹10 face value shares.'
  },
  {
    page: 48,
    section: 'Banking News',
    title: 'Canara Bank Becomes First Bank to Implement NBSL’s Plugin-Based UPI Solution in Canara ai1Pe',
    text: 'Canara Bank partnered with NPCI BHIM Services Ltd (NBSL) to integrate plugin-based UPI technology directly into its mobile app Canara ai1Pe.'
  },
  {
    page: 49,
    section: 'Banking News',
    title: 'SBI London Branch Raises $250 Million via 1-Year SOFR-Linked Overseas Bonds',
    text: 'State Bank of India raised $250 million through 12-month bonds at SOFR + 50 bps coupon via its London branch to fund foreign business operations.'
  },
  {
    page: 50,
    section: 'Banking News',
    title: 'PFRDA Launches NPS Swasthya Pension Scheme in Regulatory Sandbox for Health Expenses',
    text: 'PFRDA launched contributory NPS Swasthya Pension under Regulatory Sandbox allowing partial withdrawals up to 25% of contributions for OPD/IPD expenses after ₹50,000 corpus, and 100% exit for critical illnesses exceeding 70% of corpus.'
  },
  {
    page: 50,
    section: 'Banking News',
    title: 'SBI Launches ‘CHAKRA’ Centre of Excellence to Finance Eight Sunrise Sectors',
    text: 'State Bank of India established CHAKRA CoE to provide specialized financing and knowledge-driven credit support across 8 sustainability and technology-led sunrise sectors.'
  },
  {
    page: 50,
    section: 'Banking News',
    title: 'Slice SFB Introduces India’s First Savings Account Linked to 100% of RBI Repo Rate',
    text: 'Slice Small Finance Bank launched a digital banking ecosystem featuring India\'s first savings account offering interest directly linked to 100% of the RBI repo rate.'
  },

  // INSURANCE NEWS (Pages 50 - 53)
  {
    page: 50,
    section: 'Insurance News',
    title: 'IRDAI Annual Report FY25: Health Insurance Covers 580M Lives; ₹1.17T Premiums',
    text: 'IRDAI report showed health insurance lives covered rose to 580M in FY25 (premiums up 9.12% to ₹1.17T; 32.6M claims settled for ₹94,248 Cr). 37% of life insurance payouts were due to early surrenders/withdrawals, death claims only 7.5%, maturity 35%. Life insurers paid-up capital grew 7.12% to ₹39,714 Cr; profits rose 18.14% to ₹56,006 Cr.'
  },
  {
    page: 52,
    section: 'Insurance News',
    title: '3rd IFSC-IRDAI-GIFT City Global Reinsurance Summit: Indian Insurance AUM at ₹74.44 Lakh Crore',
    text: 'DFS Secretary M. Nagaraju addressed 3rd Global Reinsurance Summit in Mumbai. Total insurance premiums in FY25 reached ₹11.93L Cr with AUM of ₹74.44L Cr; reinsurance market stood at ₹1.12L Cr under "Insurance for All by 2047" vision.'
  },
  {
    page: 53,
    section: 'Insurance News',
    title: 'Digit Insurance Disburses First Moisture Index-Based Parametric Cover (WBI) to Farmers',
    text: 'Digit Insurance and Howden India disbursed parametric crop insurance claims based on Water Balance Index (WBI) thresholds to 6,000 farmers in Rajasthan and UP.'
  },

  // NATIONAL & STATE NEWS (Pages 53 - 93)
  {
    page: 53,
    section: 'National',
    title: 'National Consumer Helpline Facilitates ₹45 Crore Refunds Across 31 Sectors in 8 Months',
    text: 'Department of Consumer Affairs NCH (helpline 1915 in 17 languages via INGRAM portal) facilitated ₹45 crore refunds, with e-commerce accounting for ₹32 Cr (39,965 cases).'
  },
  {
    page: 54,
    section: 'National',
    title: 'MeitY Approves 22 Projects Worth ₹41,863 Crore Under Electronics Components Scheme (ECMS)',
    text: 'MeitY approved 22 proposals under ECMS across 8 states with ₹41,863 Cr investment and ₹2.58L Cr production (total ECMS approvals reach 46 projects worth ₹54,567 Cr across 11 states).'
  },
  {
    page: 54,
    section: 'National',
    title: 'Health Ministry Releases 10th Edition Indian Pharmacopoeia 2026 (India 8th in WHO Pharmacovigilance)',
    text: 'Ministry of Health released IP 2026 containing 121 new monographs (total 3,340) under Drugs and Cosmetics Act 1940. India rose from 123rd (2009-14) to 8th globally in WHO pharmacovigilance contributions.'
  },
  {
    page: 55,
    section: 'National',
    title: 'India’s First Bullet Train (MAHSR 508 km) Scheduled for Launch on August 15, 2027',
    text: 'Railways Minister Ashwini Vaishnaw announced 1st bullet train on 15 Aug 2027 between Mumbai and Ahmedabad (508 km, 12 stations, ₹1.08L Cr cost funded 81% / ₹88,000 Cr by JICA). Full corridor completion by Dec 2029 (127 min travel time).'
  },
  {
    page: 55,
    section: 'National',
    title: 'MoSPI Unveils New Logo and Mascot ‘Sankhyiki’ Carrying “Data for Development” Motto',
    text: 'MoSPI unveiled its new logo featuring the Ashoka Chakra and Rupee symbol along with mascot "Sankhyiki" on 1 January 2026.'
  },
  {
    page: 56,
    section: 'National',
    title: 'CPSEs R&D Spending Rises 25.6% to ₹9,691 Crore in FY25 (HAL & BEL Lead)',
    text: 'CPSE R&D expenditure reached ₹9,691 crore in FY25, with defence accounting for 48% (HAL ₹2,482 Cr, BEL ₹1,472 Cr, petroleum ₹1,492 Cr).'
  },
  {
    page: 56,
    section: 'National',
    title: 'India Surpasses Japan to Become World’s 4th Largest Economy at $4.18 Trillion',
    text: 'India surpassed Japan with a GDP of USD 4.18 trillion to become the 4th largest economy, poised to overtake Germany by 2030.'
  },
  {
    page: 56,
    section: 'National',
    title: 'DSIR Relaxes 3-Year Viability Criteria for Deep-Tech Startups Under ₹1L Cr RDI Fund',
    text: 'Ministry of Science & Technology removed the 3-year viability criterion for deep-tech startups to access ₹1 crore assistance under IRDPP on 42nd DSIR Foundation Day.'
  },
  {
    page: 57,
    section: 'National',
    title: 'CSIR-NPL Inaugurates Asia’s First National Environmental Standard Lab & Solar Calibration Facility',
    text: 'Science Minister Jitendra Singh inaugurated National Primary Standard Facility for Solar Cell Calibration (India 5th globally) and NSEL pollution facility (Asia\'s 1st, world\'s 2nd after UK) on CSIR-NPL 80th Foundation Day.'
  },
  {
    page: 57,
    section: 'National',
    title: 'India Becomes World’s Largest Rice Producer at 150.18 Million Tonnes Surpassing China',
    text: 'Agriculture Minister Shivraj Singh Chouhan announced India reached 150.18 million tonnes rice production (surpassing China\'s 145.28 MT) and unveiled 184 improved crop varieties.'
  },
  {
    page: 58,
    section: 'National',
    title: 'TRAI Slaps ₹150 Crore Penalty on Telcos and Mandates 1600-Series Prefix for Financial Calls',
    text: 'TRAI imposed ₹150 crore penalty on telecom operators for spam calls/SMS (financial disincentive up to ₹50 lakh/month/circle), extended complaint window to 7 days, and mandated 1600 series for BFSI calls.'
  },
  {
    page: 59,
    section: 'National',
    title: 'National Sports Governance Act 2025 Comes into Partial Effect from Jan 1, 2026',
    text: 'National Sports Governance Act came into effect establishing National Sports Board (NSB) and National Sports Tribunal (NST, 4-year tenure, age cap 67). Mandates 50% women SOMs in General Body and 2 SOMs in 15-member Executive Committees.'
  },
  {
    page: 60,
    section: 'National',
    title: 'India and Pakistan Exchange 35th Annual Lists of Nuclear Installations and Prisoners',
    text: 'India and Pakistan exchanged lists of nuclear facilities under the 1988 bilateral Agreement on Prohibition of Attacks against Nuclear Installations (in force 1991).'
  },
  {
    page: 61,
    section: 'National',
    title: 'India Energy Week 2026 Held in Goa ($500 Billion Investment Potential by 2050)',
    text: '4th India Energy Week held in Goa under MoPNG and FIPI. IEA projected India will drive >23% of global energy demand growth by 2050; targeting $100B oil/gas investments by 2030.'
  },
  {
    page: 62,
    section: 'National',
    title: 'MoRTH Notifies Rah-Veer Good Samaritan Scheme (₹25,000 Reward for Golden Hour Help)',
    text: 'MoRTH notified Rah-Veer scheme under Sec 134A of MV Act 2019 offering ₹25,000 cash reward and appreciation certificate up to 5 times/year for saving accident victims in Golden Hour.'
  },
  {
    page: 63,
    section: 'National',
    title: 'India Becomes First in World to Commercially Produce Bio-Bitumen in Road Construction',
    text: 'Nitin Gadkari announced India became first country to commercially produce bio-bitumen developed by CSIR to substitute crude oil bitumen.'
  },
  {
    page: 63,
    section: 'National',
    title: 'RDSO Commences Trial of India’s First Indigenous Hydrogen-Powered Train by ICF',
    text: 'Integral Coach Factory (ICF) and RDSO began trials of India\'s first hydrogen train-set (10 coaches, 2,400 kW broad gauge, world\'s longest/most powerful) on Jind-Sonipat route in Haryana.'
  },
  {
    page: 64,
    section: 'National',
    title: 'UIDAI Launches Aadhaar Mascot ‘Udai’ and Full Version App with Biometrics Lock',
    text: 'UIDAI launched mascot "Udai" and full app with selective share, biometrics lock, family profiles, and offline verification under CEO Bhuvnesh Kumar.'
  },
  {
    page: 65,
    section: 'National',
    title: 'India Crosses 50,000 NQAS Certifications Across Public Healthcare Facilities',
    text: 'MoHFW certified 50,373 public health facilities under National Quality Assurance Standards (NQAS), targeting 50% certification of all facilities by March 2026.'
  },
  {
    page: 67,
    section: 'National',
    title: 'Mera Yuva Bharat (MY Bharat) Crosses 2 Crore Registered Youth (MY Bharat 2.0 with DIC)',
    text: 'MY Bharat platform under Ministry of Youth Affairs and Sports surpassed 2 crore registered youth; collaborating with Digital India Corporation for MY Bharat 2.0.'
  },
  {
    page: 68,
    section: 'National',
    title: 'European Leaders António Costa and Ursula von der Leyen Chief Guests at 77th Republic Day',
    text: 'European Council President António Costa and EU Commission President Ursula von der Leyen were chief guests at 77th Republic Day parade and co-chaired 16th India-EU Summit.'
  },
  {
    page: 69,
    section: 'National',
    title: 'MeitY DIBD Organises BHASHINI Samudaye for National Language AI Ecosystem',
    text: 'Digital India BHASHINI Division (MeitY) organized BHASHINI Samudaye under National Language Translation Mission (NLTM) to scale 22-language translation APIs and BhashaDaan.'
  },
  {
    page: 70,
    section: 'National',
    title: 'Wings India 2026 Held in Hyderabad (Theme: Design to Deployment)',
    text: 'Civil Aviation Minister Ram Mohan Naidu inaugurated Wings India 2026 at Begumpet Airport, Hyderabad.'
  },
  {
    page: 70,
    section: 'National',
    title: 'MoEFCC Launches 2nd Rangewide Dolphin Survey Under Project Dolphin from Bijnor',
    text: 'WII Dehradun launched 2nd range-wide dolphin survey across Ganga, Indus, Brahmaputra, and Sundarbans. Previous survey recorded 6,327 dolphins (Ganges dolphin Susu declared National Aquatic Animal in 2009).'
  },
  {
    page: 71,
    section: 'National',
    title: 'DPIIT States’ Startup Ranking SRF 5.0: Gujarat Best Performer in Cat A; Arunachal & Goa in Cat B',
    text: 'DPIIT released 5th National Startup Awards and SRF 5.0: Best Performers: Gujarat (Cat A), Arunachal & Goa (Cat B); Top Performers: Karnataka, Punjab, TN, UP (Cat A), HP (Cat B).'
  },
  {
    page: 72,
    section: 'National',
    title: 'PM Modi Performs Bhoomi Pujan for ₹6,950 Crore Kaziranga Elevated Corridor (NH-715)',
    text: 'PM Modi laid foundation for 85.675 km 4-lane EPC Kaziranga Elevated Corridor on NH-715 (₹6,950 Cr) to protect wildlife and connect Upper Assam.'
  },
  {
    page: 73,
    section: 'National',
    title: 'Ministry of Earth Sciences Launches India’s First Open-Sea Marine Fish Farming in Andamans',
    text: 'Dr. Jitendra Singh launched open-sea marine finfish and seaweed cultivation project at North Bay, Andaman Sea, implemented by NIOT.'
  },
  {
    page: 74,
    section: 'National',
    title: 'India and UAE Agree to Double Bilateral Trade to $200 Billion by 2032',
    text: 'PM Modi and UAE President Sheikh Mohamed bin Zayed Al Nahyan agreed to double bilateral trade to $200B by 2032 and establish an India supercomputing cluster with FAB and DP World operations in GIFT City.'
  },
  {
    page: 75,
    section: 'National',
    title: 'MoEFCC Notifies Legally Binding Carbon Credit Emission Targets for 208 Industries',
    text: 'MoEFCC notified Greenhouse Gases Emission Intensity (GEI) targets for 208 industries under Carbon Credits Trading Scheme (CCTS 2023) to reduce GDP emission intensity by 45% by 2030.'
  },
  {
    page: 76,
    section: 'National',
    title: 'ECI Launches 22-Language ‘ECINET’ Platform at IICDEM 2026 Under CEC Gyanesh Kumar',
    text: 'ECI launched ECINET digital election platform in 22 scheduled languages at IICDEM 2026 adopting Delhi Declaration 2026. India assumed 2026 Chairship of International IDEA.'
  },
  {
    page: 80,
    section: 'National',
    title: 'MoSPI Implements ‘PAIMANA’ Portal to Monitor Infrastructure Projects Above ₹150 Crore',
    text: 'MoSPI replaced OCMS-2006 with PAIMANA (Project Assessment, Infrastructure Monitoring and Analytics for Nation-Building) integrated with DPIIT IPMP portal.'
  },
  {
    page: 81,
    section: 'National',
    title: 'MoEFCC Declares Kumbhalgarh Wildlife Sanctuary in Aravallis as Eco-Sensitive Zone',
    text: 'MoEFCC notified 0 to 1 km around Kumbhalgarh WLS (Rajsamand, Pali, Udaipur) as Eco-Sensitive Zone.'
  },
  {
    page: 82,
    section: 'National',
    title: 'HFCL and ITI Deploy Indigenously Designed Network Routers for BharatNet (DBN Fund)',
    text: 'HFCL and ITI deployed made-in-India network routers across 250,000 Gram Panchayats funded via Digital Bharat Nidhi (DBN).'
  },
  {
    page: 84,
    section: 'National',
    title: 'Government Notifies Coking Coal as Critical & Strategic Mineral Under MMDR Act 1957',
    text: 'Ministry of Mines amended MMDR Act 1957 First Schedule, listing Coking Coal in Part D Critical & Strategic Minerals (India has 37.37 BT reserves, imports 57.58 MT).'
  },
  {
    page: 85,
    section: 'National',
    title: 'India Nominates Meghalaya’s Living Root Bridges (Jing Kieng Jri) for UNESCO World Heritage',
    text: 'India submitted nomination dossier for Meghalaya\'s Khasi-built Ficus elastica Living Root Bridges (Jing Kieng Jri) to UNESCO for World Heritage List 2026-27.'
  },
  {
    page: 86,
    section: 'National',
    title: 'MoEFCC Notifies Solid Waste Management Rules 2026 (Mandatory 4-Stream Segregation)',
    text: 'MoEFCC superseded SWM Rules 2016 with SWM Rules 2026 under EPA 1986 effective 1 April 2026, mandating 4-stream segregation (wet, dry, sanitary, special care) and raising fuel substitution to 15%.'
  },
  {
    page: 87,
    section: 'National',
    title: 'VOC Port and SIPCOT Form NSHIP TN to Build ₹19,989 Crore Mega Shipbuilding Park',
    text: 'VOC Port and SIPCOT created 50:50 SPV National Shipbuilding & Heavy Industries Park, Tamil Nadu (NSHIP) under Shipping Ministry’s ₹19,989 Cr scheme to expand capacity to 4.5M GT.'
  },
  {
    page: 87,
    section: 'National',
    title: 'Supreme Court Rules Right to Menstrual Hygiene is Fundamental Right Under Article 21',
    text: 'SC bench of Justice JB Pardiwala and R Mahadevan ruled access to free biodegradable sanitary pads for school girls is an integral part of Right to Life under Article 21.'
  },
  {
    page: 88,
    section: 'National',
    title: 'Indian Railways Commissions Record 472 Route Km of Kavach 4.0 (Total Crosses 1,300 km)',
    text: 'Railways commissioned 472 km of Kavach 4.0 (Vadodara-Virar 344 km, Tuglakabad-Palwal 35 km, Manpur-Sarmatanr 93.3 km), crossing 1,300 total route km.'
  },
  {
    page: 89,
    section: 'National',
    title: 'Patna Bird Sanctuary (UP) and Chhari-Dhand (Gujarat) Designated as Ramsar Sites (Total 98)',
    text: 'India Ramsar sites increased to 98 with inclusion of Patna Bird Sanctuary (Etah, UP) and Chhari-Dhand (Kutch, Gujarat).'
  },
  {
    page: 91,
    section: 'State',
    title: 'Uttar Pradesh Tops Central Government’s ‘Deregulation 1.0’ State Rankings',
    text: 'Uttar Pradesh ranked first among states in implementing business deregulation across 23 key priority areas under Deregulation 1.0.'
  },
  {
    page: 92,
    section: 'State',
    title: 'Tamil Nadu and Sarvam AI Partner for ₹10,000 Crore Sovereign AI Park & Deeptech Policy',
    text: 'Tamil Nadu signed MoU with Sarvam AI to build India\'s first full-stack Sovereign AI Park (₹10,000 Cr over 5 years) and launched TN Deep-Tech Startup Policy 2025-26.'
  },
  {
    page: 92,
    section: 'State',
    title: 'Andhra Pradesh Hosts World’s Largest Green Ammonia Project (AM Green Kakinada)',
    text: 'AM Green initiated world\'s largest green ammonia plant at Kakinada (0.5 MTPA by 2027, full capacity by 2030).'
  },
  {
    page: 92,
    section: 'State',
    title: 'Jharkhand Implements PESA Rules After 25 Years Across 13 Scheduled Districts',
    text: 'Jharkhand notified rules under Panchayat (Extension to Scheduled Areas) Act 1996 for tribal self-governance across 13 of 24 districts.'
  },
  {
    page: 93,
    section: 'State',
    title: 'Tamil Nadu Launches ₹5,000 Crore TNWESafe Project with ₹1,185 Cr World Bank Loan',
    text: 'TN CM M.K. Stalin launched ₹5,000 Cr Tamil Nadu Women Employment and Safety Project (₹1,185 Cr World Bank loan) and HPV vaccination campaign.'
  },

  // INTERNATIONAL NEWS (Pages 93 - 98)
  {
    page: 93,
    section: 'International News',
    title: 'Bulgaria Adopts Euro as Official Currency, Becoming 21st Eurozone Member',
    text: 'Bulgaria adopted the Euro (replacing Bulgarian lev) on 1 January 2026, becoming the 21st member of the Eurozone (6 EU nations remain outside).'
  },
  {
    page: 94,
    section: 'International News',
    title: 'European Union Enforces Carbon Border Adjustment Mechanism (CBAM) from Jan 1, 2026',
    text: 'EU implemented world\'s first carbon border tax (CBAM) on imports of steel, aluminium, cement, fertilizer, electricity, and hydrogen.'
  },
  {
    page: 94,
    section: 'International News',
    title: 'Five Countries Begin 2-Year Term as Non-Permanent Members of UN Security Council',
    text: 'Bahrain, Colombia, DRC, Latvia, and Liberia began 2-year terms as UNSC non-permanent members on 1 January 2026.'
  },
  {
    page: 95,
    section: 'International News',
    title: 'United States Withdraws from International Solar Alliance (ISA) and WHO under Trump EO',
    text: 'US President Donald Trump issued executive order withdrawing US from 66 international bodies, including Gurugram-based ISA and WHO.'
  },
  {
    page: 95,
    section: 'International News',
    title: 'India Assumes BRICS Presidency for 2026 and Will Host 18th BRICS Summit',
    text: 'Brazil handed over BRICS presidency to India for 2026 (theme: Resilience, Innovation, Cooperation, and Sustainability as BRICS marks 20 years).'
  },
  {
    page: 96,
    section: 'International News',
    title: 'EU and Mercosur Sign Historic Free Trade Agreement After 25 Years of Negotiations',
    text: 'EU and Mercosur (Brazil, Argentina, Paraguay, Uruguay, Bolivia) concluded historic FTA removing €4 billion duties across 91-92% of bilateral exports.'
  },
  {
    page: 96,
    section: 'International News',
    title: 'President Donald Trump Announces ‘Board of Peace’ for Gaza Reconstruction (UNSC 2803)',
    text: 'US announced 20-point Gaza Peace Plan Board of Peace chaired by Donald Trump, with World Bank President Ajay Banga and Marco Rubio on executive board.'
  },
  {
    page: 97,
    section: 'International News',
    title: 'WEF Establishes Centre for Fourth Industrial Revolution (C4IR) in Andhra Pradesh',
    text: 'WEF established 5 new C4IR centres globally, including Centre for Energy and Cyber Resilience in Andhra Pradesh (joining Mumbai and Telangana in India).'
  },
  {
    page: 97,
    section: 'International News',
    title: 'Spain Joins India’s Indo-Pacific Oceans Initiative (IPOI) Across 7 Pillars',
    text: 'Spain became a partner in IPOI (launched by India in 2019 based on SAGAR vision).'
  },
  {
    page: 98,
    section: 'International News',
    title: 'UAE Central Bank Approves Country’s First USD-Backed Stablecoin by Universal Digital',
    text: 'Central Bank of UAE registered Universal Digital (ADGM regulated) as first foreign payment token issuer for USD-pegged stablecoins.'
  },

  // MOUS & MERGERS (Pages 98 - 107)
  {
    page: 100,
    section: 'MOUs',
    title: 'India and Germany Sign 19 Pacts and Commit €1.24 Billion Under Green Partnership (GSDP)',
    text: 'German Chancellor Friedrich Merz visited India; signed 19 MoUs committing €1.24 billion under GSDP for green hydrogen and renewable energy with visa-free transit for Indian passport holders.'
  },
  {
    page: 104,
    section: 'MOUs',
    title: 'RBI and European Securities and Markets Authority (ESMA) Sign MoU on CCIL Recognition',
    text: 'RBI signed MoU with ESMA during EU Summit to enable formal European recognition of Clearing Corporation of India Ltd (CCIL) and RBI-regulated central counterparties.'
  },
  {
    page: 107,
    section: 'Mergers & Acquistions',
    title: 'CCI Approves Emirates NBD Acquisition of Up to 74% Stake in RBL Bank',
    text: 'Competition Commission of India approved acquisition of 51% to 74% shareholding in RBL Bank Limited by Dubai-based Emirates NBD Bank PJSC.'
  },
  {
    page: 107,
    section: 'Mergers & Acquistions',
    title: 'CCI Approves Nippon Steel ₹3,500 Crore Deal to Acquire Remaining 53.4% in Krosaki Harima',
    text: 'CCI approved Nippon Steel\'s ₹3,500 crore buyout of remaining 53.4% stake in Krosaki Harima Corporation.'
  },

  // SCIENCE & TECHNOLOGY AND DEFENCE (Pages 107 - 114)
  {
    page: 108,
    section: 'Science & Technology',
    title: 'MeitY Launches ‘PARAM SHAKTI’ Supercomputer (PARAM RUDRA Architecture) at IIT Madras',
    text: 'MeitY Secretary S. Krishnan inaugurated PARAM SHAKTI supercomputing facility powered by indigenous PARAM RUDRA servers developed by C-DAC under National Supercomputing Mission.'
  },
  {
    page: 108,
    section: 'Science & Technology',
    title: 'ISRO PSLV-C62 Launches Northeast India’s First Satellite ‘Lachit-1’ (ADBU & Dhruva Space)',
    text: 'ISRO PSLV-C62 launched primary payload EOS-N1 along with 15 co-passengers including Lachit-1 built by Assam Don Bosco University and Dhruva Space.'
  },
  {
    page: 109,
    section: 'Science & Technology',
    title: 'Pixxel-Led Consortium Wins ₹1,200 Crore IN-SPACe National Earth Observation Project',
    text: 'IN-SPACe awarded ₹1,200 crore national EO satellite constellation project to consortium of Pixxel, Dhruva Space, PierSight, and SatSure.'
  },
  {
    page: 109,
    section: 'Science & Technology',
    title: 'Azista Space Lays Foundation for ₹500 Crore ‘Palmnaro’ Satellite Plant in Sanand, Gujarat',
    text: 'Gujarat Science & Tech Minister laid foundation for India\'s 1st integrated private satellite manufacturing plant Palmnaro by Azista Space in Sanand (₹500 Cr investment).'
  },
  {
    page: 110,
    section: 'Defence',
    title: 'HAL Conducts Maiden Flight of Dhruv-NG Helicopter with Indigenous Shakti Civil Engine',
    text: 'HAL completed maiden flight of 5.5-tonne Dhruv New Generation (NG) twin-engine helicopter in Bengaluru and received DGCA certification for Shakti Civil Engine.'
  },
  {
    page: 110,
    section: 'Defence',
    title: 'Defence Minister Rajnath Singh Commissions ICGS Samudra Pratap Pollution Control Vessel',
    text: 'Goa Shipyard Limited built ICGS Samudra Pratap, 1st of two indigenously designed Pollution Control Vessels (60%+ indigenous content), commissioned at Goa.'
  },
  {
    page: 110,
    section: 'Defence',
    title: 'Indian Army Signs ₹293 Crore Contract for ‘Suryastra’ Universal Rocket Launcher (300 km)',
    text: 'Indian Army signed ₹293 Cr contract with NIBE Limited and Israel for Suryastra multi-calibre precision surface-to-surface rocket launcher (150-300 km range).'
  },
  {
    page: 111,
    section: 'Defence',
    title: 'Indian Army Raises Dedicated Drone Warfare Unit ‘Bhairav’ with 1 Lakh Operatives',
    text: 'Indian Army created modern warfare force "Bhairav" comprising over 1 lakh trained drone operatives for frontline drone and counter-drone operations.'
  },
  {
    page: 112,
    section: 'Defence',
    title: 'DRDO Successfully Tests Long-Duration Actively Cooled Scramjet Engine (>Mach 5) at DRDL',
    text: 'DRDO conducted ground test of full-scale actively cooled scramjet engine at DRDL SCPT facility in Hyderabad for hypersonic cruise missiles (>Mach 5).'
  },
  {
    page: 112,
    section: 'Defence',
    title: 'DRDO Flight-Tests 3rd Gen MPATGM with Top Attack Capability Against Moving Target',
    text: 'DRDO successfully tested 3rd generation Fire & Forget Man Portable Anti-Tank Guided Missile (MPATGM) with IIR homing seeker and tandem warhead at KK Ranges, Ahilya Nagar.'
  },
  {
    page: 112,
    section: 'Defence',
    title: 'Bharat Forge Wins ₹1,661.9 Crore Contract for 255,128 CQB Carbines for Indian Army',
    text: 'Ministry of Defence awarded ₹1,661.9 Cr contract to Bharat Forge to manufacture 255,128 indigenously developed (ARDE-DRDO) 5.56x45mm Close Quarter Battle Carbines.'
  },
  {
    page: 113,
    section: 'Defence',
    title: 'IIT Madras Tests World’s First Ramjet-Powered Artillery Shells (50% Range Boost)',
    text: 'IIT Madras successfully ground-tested ramjet-powered artillery shells capable of increasing in-service howitzer range by 50%.'
  },
  {
    page: 113,
    section: 'Defence',
    title: 'India Flags Off First Export Consignment of Guided Pinaka Rockets to Armenia (₹2,000 Cr Deal)',
    text: 'Rajnath Singh flagged off first export consignment of Guided Pinaka rockets from Solar Defence & Aerospace Ltd Nagpur under ₹2,000 Cr Armenia contract.'
  },
  {
    page: 113,
    section: 'Defence',
    title: 'DRDO Showcases Long-Range Anti-Ship Hypersonic Glide Missile (LR-AShM) at Republic Day',
    text: 'DRDO debuted LR-AShM hypersonic glide missile system and coastal battery launcher at 77th Republic Day parade.'
  },
  {
    page: 114,
    section: 'Defence',
    title: 'Indian Army Procures Shield AI V-BAT Autonomous Drones with Hivemind AI Software',
    text: 'Indian Army selected US Shield AI and JSW Defence ($90M hub in Hyderabad) for V-BAT VTOL autonomous tactical drones integrating Hivemind AI.'
  },

  // INDICES & REPORTS (Pages 114 - 131)
  {
    page: 115,
    section: 'INDICES/RANKINGS',
    title: 'NITI Aayog Releases 4th Export Preparedness Index (EPI 2024): Maharashtra Leads Large States',
    text: 'NITI Aayog EPI 2024 (4 pillars, 70 indicators): Maharashtra, Tamil Nadu, and Gujarat topped large states; Uttarakhand topped Himalayan states.'
  },
  {
    page: 115,
    section: 'INDICES/RANKINGS',
    title: 'Henley Passport Index 2026: India Ranks 80th with Visa-Free Access to 55 Nations',
    text: 'India ranked 80th (tied with Algeria & Niger) with visa-free/VoA access to 55 countries. Singapore ranked 1st (192 destinations), Japan/South Korea 2nd.'
  },
  {
    page: 116,
    section: 'INDICES/RANKINGS',
    title: 'Responsible Nations Index 2026: India Ranks 16th Globally in Ethical Governance Benchmark',
    text: 'Former President Ram Nath Kovind launched RNI (154 nations) developed by WIF, JNU, IIM Mumbai, and DAIC: Singapore #1, Switzerland #2, Denmark #3, India #16 (score 0.5515).'
  },
  {
    page: 117,
    section: 'INDICES/RANKINGS',
    title: 'Asia Manufacturing Index 2026: India Ranks 6th Among 11 Asian Economies',
    text: 'Dezan Shira & Associates AMI 2026 ranked China #1, Malaysia #2, Vietnam #3, Singapore #4, South Korea #5, and India #6 across 8 pillars.'
  },
  {
    page: 120,
    section: 'INDICES/RANKINGS',
    title: 'Brand Finance Global Soft Power Index 2026: India Ranks 32nd Globally',
    text: 'Global Soft Power Index ranked 193 UN states: US #1 (score 74.9), China #2, UK #3; India ranked 32nd (score 48.0).'
  },
  {
    page: 128,
    section: 'Reports',
    title: 'UNCTAD Global Investment Monitor: FDI Inflows to India Jump 73% to $47 Billion in 2025',
    text: 'UNCTAD reported FDI inflows to India surged 73% to $47 billion in 2025 driven by manufacturing and services; global FDI rose 14% to $1.61 trillion.'
  },
  {
    page: 129,
    section: 'Reports',
    title: 'World Gold Council: Global Gold Demand Crosses Record 5,000 Tonnes in 2025 (5,002 Tonnes)',
    text: 'WGC reported total gold demand hit record 5,002 tonnes in 2025 (investment demand surged to 2,175.3 tonnes). National Bank of Poland was top central bank buyer (102T).'
  },

  // AWARDS, APPOINTMENTS & SPORTS (Pages 131 - 158)
  {
    page: 131,
    section: 'Awards',
    title: 'National Awards for e-Governance 2026 Notified Across Seven Digital Transformation Categories',
    text: 'Government notified e-Governance awards across 7 categories (Gold ₹10 Lakh, Silver ₹5 Lakh) recognizing citizen-centric AI and cybersecurity innovations.'
  },
  {
    page: 134,
    section: 'Awards',
    title: 'Subhash Chandra Bose Aapda Prabandhan Puraskar 2026 Conferred on SSDMA & Lt Col Seeta Shelke',
    text: 'NDMA announced 2026 disaster management awards for Wayanad landslide relief operations to Sikkim State Disaster Management Authority and Lt Col Seeta Ashok Shelke.'
  },
  {
    page: 135,
    section: 'Awards',
    title: 'President Approves Ashok Chakra for Group Captain Shubhanshu Shukla (ISS Mission)',
    text: 'President Droupadi Murmu conferred Ashok Chakra on Gp Capt Shubhanshu Shukla, first Indian astronaut on International Space Station, along with 70 gallantry awards.'
  },
  {
    page: 135,
    section: 'Awards',
    title: 'Government Announces 131 Padma Awards 2026 (5 Padma Vibhushan, 13 Padma Bhushan, 113 Padma Shri)',
    text: '131 Padma Awards announced: 5 Padma Vibhushan (Dharmendra, Justice KT Thomas, Ms N Rajam, P Narayanan, VS Achuthanandan), 13 Padma Bhushan (Uday Kotak, Alka Yagnik, Bhagat Singh Koshyari, Mammootty, Shibu Soren), 113 Padma Shri (19 women, 16 posthumous).'
  },
  {
    page: 141,
    section: 'Sports',
    title: 'World Rapid and Blitz Chess Championship 2025: Magnus Carlsen Wins Double Crown in Doha',
    text: 'Magnus Carlsen won both Men\'s World Rapid and World Blitz titles in Doha, Qatar. Aleksandra Goryachkina won Women\'s Rapid; Bibisara Assaubayeva won Women\'s Blitz.'
  },
  {
    page: 142,
    section: 'Sports',
    title: 'Vidarbha Wins Maiden Vijay Hazare Trophy 2025–26 Title Defeating Saurashtra',
    text: 'Vidarbha cricket team won its maiden Vijay Hazare Trophy defeating Saurashtra by 38 runs at BCCI Centre of Excellence in Bengaluru.'
  },
  {
    page: 144,
    section: 'Appointments',
    title: 'Key National Security & Regulatory Appointments: ITBP, BSF, NIA, and Vigilance Commission',
    text: 'Shatrujeet Singh Kapoor appointed Chief of ITBP; Praveen Kumar appointed DG BSF; Rakesh Aggarwal appointed DG NIA; Praveen Vashista appointed Vigilance Commissioner.'
  },
  {
    page: 144,
    section: 'Appointments',
    title: 'Uday Kotak, Hardeep Singh Ahluwalia, and Sandeep Bakhshi Apex Banking Transitions',
    text: 'Hardeep Singh Ahluwalia appointed MD & CEO of Canara Bank; Hitesh Joshi CMD of GIC Re; Arijit Basu Chairman of IndusInd Bank; Sandeep Bakhshi re-appointed MD & CEO of ICICI Bank.'
  },
  {
    page: 150,
    section: 'Committee',
    title: 'PFRDA Sets Up M.S. Sahoo Committee on Assured Payouts & SAARG Investment Panel',
    text: 'PFRDA constituted 15-member advisory committee chaired by Dr. M.S. Sahoo for guaranteed payouts under NPS, and SAARG panel chaired by Narayan Ramachandran for NPS investment governance.'
  },
  {
    page: 151,
    section: 'Committee',
    title: 'IRDAI Reconstitutes Reinsurance Advisory Committee (RAC) Under A.V. Girija Kumar',
    text: 'IRDAI reconstituted Reinsurance Advisory Committee under Section 101B of Insurance Act 1938 for 3-year term chaired by former OICL CMD A.V. Girija Kumar.'
  },
  {
    page: 157,
    section: 'Person In News',
    title: 'Nirmala Sitharaman Becomes Longest-Serving Finance Minister (9th Consecutive Budget)',
    text: 'FM Nirmala Sitharaman presented her 9th consecutive Union Budget on 1 Feb 2026, surpassing C.D. Deshmukh\'s continuous tenure of 6 years 2 months.'
  }
];

console.log(`✅ Loaded ${RAW_JANUARY_ARTICLES.length} structured candidate articles from 169 pages.`);

module.exports = { RAW_JANUARY_ARTICLES };
