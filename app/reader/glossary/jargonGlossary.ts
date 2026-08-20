/**
 * Comprehensive Banking, Economic & Regulatory Jargon Dictionary
 * Provides Instant Plain-English Explanations, Analogies & Exam Traps for Banking Aspirants.
 */

export interface JargonEntry {
  term: string;
  aliases?: string[];
  fullName: string;
  category: 'Banking' | 'RBI/Regulatory' | 'Economics' | 'Schemes' | 'Defence/Tech' | 'Global';
  laymanDefinition: string;
  analogy: string;
  examTrap: string;
  hubLink?: { hubId: string; title: string };
}

export const JARGON_DICTIONARY: Record<string, JargonEntry> = {
  'nbfc-ul': {
    term: 'NBFC-UL',
    aliases: ['upper layer nbfc', 'nbfc upper layer', 'upper-layer nbfc'],
    fullName: 'Non-Banking Financial Company – Upper Layer',
    category: 'RBI/Regulatory',
    laymanDefinition: 'The top 10–15 giant shadow banks in India (like Tata Sons, Bajaj Finance) that are so massive that if they fail, the whole economy could shake. RBI regulates them almost as strictly as regular commercial banks.',
    analogy: 'Think of them as heavyweight trucks on a small road — because of their giant size, RBI gives them commercial bus-level strict safety inspection rules.',
    examTrap: 'NBFC-ULs MUST list on stock exchanges within 3 years of classification, or surrender their status.',
    hubLink: { hubId: 'iibf-regulations', title: 'IIBF Module 1: Scale-Based Regulatory Framework' }
  },
  'mdr': {
    term: 'MDR',
    aliases: ['merchant discount rate'],
    fullName: 'Merchant Discount Rate',
    category: 'Banking',
    laymanDefinition: 'The transaction fee that a merchant (shopkeeper) pays to banks and payment processors for accepting payments via debit cards, credit cards, or QR codes.',
    analogy: 'Like a small toll booth fee paid by the shopkeeper every time a digital payment drives through the card machine.',
    examTrap: 'UPI and RuPay debit cards have enjoyed ZERO MDR (free for merchants) under govt subsidy; new bills propose ending this blanket waiver outside negative lists.',
    hubLink: { hubId: 'iibf-regulations', title: 'IIBF Module 4: Payment Systems & Digital Banking' }
  },
  'basel iii pillar 3': {
    term: 'Basel III Pillar 3',
    aliases: ['pillar 3', 'market discipline', 'basel pillar 3'],
    fullName: 'Basel III Framework – Pillar 3 (Market Discipline)',
    category: 'Banking',
    laymanDefinition: 'A mandatory rule forcing banks to publicly publish their exact risk levels, bad loan numbers, and capital safety buffers every quarter so investors and depositors know if the bank is safe.',
    analogy: 'Like the mandatory nutrition label and calorie count on food packaging — banks must show all their risk ingredients openly to the public.',
    examTrap: 'Pillar 1 = Minimum Capital (CRAR 9%+2.5% CCB); Pillar 2 = Supervisory Review (RBI audit); Pillar 3 = Public Market Transparency & Disclosures.',
    hubLink: { hubId: 'iibf-regulations', title: 'IIBF Module 2: Basel III & Capital Adequacy' }
  },
  'cgsmfi': {
    term: 'CGSMFI',
    aliases: ['cgsmfi 2.0', 'credit guarantee scheme for microfinance'],
    fullName: 'Credit Guarantee Scheme for Microfinance Institutions',
    category: 'Schemes',
    laymanDefinition: 'A government safety net where NCGTC guarantees bank loans given to small micro-lenders. If poor borrowers default, the government scheme reimburses the bank up to 75%.',
    analogy: 'Like an insurance policy taken by banks so they do not feel scared when giving loans to small rural micro-loan companies.',
    examTrap: 'Under CGSMFI 2.0, banks must allocate at least 15% of the total ₹20,000 crore guarantee corpus specifically to small and mid-sized MFIs (AUM < ₹500 Cr).',
    hubLink: { hubId: 'schemes', title: 'Government Credit Guarantee Schemes' }
  },
  'aum': {
    term: 'AUM',
    aliases: ['assets under management'],
    fullName: 'Assets Under Management',
    category: 'Banking',
    laymanDefinition: 'The total cumulative market value of all loans or investments that a financial institution, mutual fund, or NBFC is currently managing on behalf of clients.',
    analogy: 'The total weight of the luggage a porter is carrying — the bigger the AUM, the larger the financial institution.',
    examTrap: 'MFI classification: Small (<₹500 Cr) | Medium (₹500 Cr–₹2,000 Cr) | Large (>₹2,000 Cr AUM).'
  },
  'dpdpa': {
    term: 'DPDPA',
    aliases: ['digital personal data protection act', 'dpdp act 2023'],
    fullName: 'Digital Personal Data Protection Act, 2023',
    category: 'RBI/Regulatory',
    laymanDefinition: 'India’s sovereign privacy law giving citizens legal ownership over their personal data and penalizing companies that leak or misuse customer information without consent.',
    analogy: 'A personal security guard for your digital identity that slaps massive fines on any company that sells your phone number or OTPs.',
    examTrap: 'Maximum penalty: Up to ₹250 crore for failing to prevent a data breach; ₹200 crore for failing to notify the Data Protection Board.'
  },
  'cscrf': {
    term: 'CSCRF',
    aliases: ['cyber security and cyber resilience framework', 'sebi cscrf'],
    fullName: 'Cyber Security and Cyber Resilience Framework (SEBI)',
    category: 'RBI/Regulatory',
    laymanDefinition: 'SEBI’s unified cybersecurity blueprint that forces stock brokers, mutual funds, and depository participants to withstand cyberattacks, maintain backup data, and recover operations within minutes.',
    analogy: 'A mandatory fire drill and bulletproof vault protocol for all stock market institutions.',
    examTrap: 'Applies to 22 classes of regulated market intermediaries based on a 5-tier classification model.'
  },
  'ramsar site': {
    term: 'Ramsar Site',
    aliases: ['ramsar convention', 'ramsar wetlands'],
    fullName: 'Ramsar Convention on Wetlands of International Importance',
    category: 'Global',
    laymanDefinition: 'A globally recognized ecological stamp given to crucial wetlands, lakes, and marshes to protect their biodiversity and water ecosystems from urban destruction.',
    analogy: 'A UNESCO Heritage badge, but specifically for lakes, swamps, and bird sanctuaries.',
    examTrap: 'India crossed 100+ Ramsar sites in 2026 (Glaw Lake in Arunachal Pradesh is India’s 101st Ramsar Site; Tamil Nadu has the highest count).'
  },
  'pm-setu': {
    term: 'PM-SETU',
    aliases: ['pm setu', 'pradhan mantri setu'],
    fullName: 'PM Skill Ecosystem Transformation for Upgraded ITIs',
    category: 'Schemes',
    laymanDefinition: 'A ₹60,000 crore mega-scheme to modernize 1,000 government ITIs into high-tech training hubs for AI, robotics, and advanced manufacturing with World Bank co-funding.',
    analogy: 'Upgrading old manual vocational workshops into modern high-tech robotics studios.',
    examTrap: 'Outlay: ₹60,000 crore over 5 years; World Bank loan assistance: $830 million.'
  },
  'pm-rahat': {
    term: 'PM-RAHAT',
    aliases: ['pm rahat', 'pradhan mantri rahat'],
    fullName: 'Pradhan Mantri Road Accident Hospitalization & Assistance for Trauma',
    category: 'Schemes',
    laymanDefinition: 'A cashless medical emergency scheme providing up to ₹1.5 lakh free treatment for any road accident victim during the critical "Golden Hour" across all highway hospitals.',
    analogy: 'An emergency government health credit card ready instantly in the ambulance for accident victims.',
    examTrap: 'Cap: ₹1.50 lakh per victim; coverage period: 7 days from accident time; Golden Hour = first 60 minutes.'
  },
  'dicgc': {
    term: 'DICGC',
    aliases: ['deposit insurance', 'dicgc insurance', 'deposit insurance and credit guarantee corporation'],
    fullName: 'Deposit Insurance and Credit Guarantee Corporation',
    category: 'RBI/Regulatory',
    laymanDefinition: 'A 100% RBI-owned subsidiary that guarantees your savings and fixed deposits up to ₹5 lakh per depositor per bank if the bank goes bankrupt or is put under moratorium.',
    analogy: 'An automatic government insurance policy protecting your bank balance up to ₹5 lakh.',
    examTrap: 'Maximum deposit coverage is ₹5 lakh (Principal + Interest) per depositor across all branches of that bank; DICGC was established in 1978 under DICGC Act 1961.',
    hubLink: { hubId: 'iibf-regulations', title: 'IIBF Module 2: Deposit Insurance & Customer Protection' }
  },
  'co-lending': {
    term: 'Co-lending',
    aliases: ['co lending model', 'clm'],
    fullName: 'Co-Lending Model (CLM)',
    category: 'Banking',
    laymanDefinition: 'A partnership where a big commercial bank (which has lots of cheap deposits) joins hands with a small local NBFC (which has deep ground reach in villages) to jointly give loans to priority sector borrowers.',
    analogy: 'The bank brings 80% of the money, while the local NBFC brings the village customer and manages the relationship.',
    examTrap: 'Standard risk-sharing ratio: Minimum 20% of the loan amount must be retained by the NBFC on its own books; bank takes maximum 80%.',
    hubLink: { hubId: 'iibf-regulations', title: 'IIBF Module 1: Co-Lending & NBFC Partnerships' }
  },
  'repo rate': {
    term: 'Repo Rate',
    aliases: ['policy repo rate', 'policy rate'],
    fullName: 'Repurchase Option Rate',
    category: 'Economics',
    laymanDefinition: 'The interest rate at which RBI lends short-term money to commercial banks. When RBI cuts repo rate, your home and car loan interest rates come down.',
    analogy: 'The wholesale cost of money that banks buy from RBI before retailing it to you.',
    examTrap: 'Fixed by the 6-member Monetary Policy Committee (3 RBI + 3 Govt appointed); SDF is 25 bps below Repo; MSF and Bank Rate are 25 bps above Repo.',
    hubLink: { hubId: 'economics', title: 'Monetary Policy & Inflation Dynamics' }
  },
  'gi tag': {
    term: 'GI Tag',
    aliases: ['geographical indication', 'gi registration'],
    fullName: 'Geographical Indication Registry Tag',
    category: 'Schemes',
    laymanDefinition: 'A legal trademark given to a product that is unique to a specific town or region due to special soil, climate, or traditional artisan heritage (e.g. Darjeeling Tea, Mithila Makhana, Banarasi Silk).',
    analogy: 'A government certificate of regional authenticity preventing fake copycats in global markets.',
    examTrap: 'Darjeeling Tea was India’s 1st GI (2004-05); UP leads all states in total GI registrations (81+), followed by Tamil Nadu (76); National target is 10,000 GIs by 2030.'
  },
  'garuda': {
    term: 'GARUDA',
    aliases: ['garuda framework', 'aif green-channel'],
    fullName: 'Green-Channel: AIF Rollout Upon Document Acknowledgement',
    category: 'RBI/Regulatory',
    laymanDefinition: 'A fast-track green channel by SEBI for private equity and venture capital funds (AIFs). Instead of waiting months for SEBI to approve their investment documents, funds can launch and start investing in just 10 working days.',
    analogy: 'Like TSA PreCheck or DigiYatra at the airport: verified travelers walk through security in minutes instead of waiting in long lines.',
    examTrap: 'AIF schemes can commence operations 10 working days after filing PPM via a merchant banker unless SEBI raises an objection; Angel Funds and Large Value Funds (LVFs) are exempted.'
  },
  'closing auction session': {
    term: 'CAS',
    aliases: ['closing auction session', 'cas session'],
    fullName: 'Closing Auction Session (SEBI)',
    category: 'RBI/Regulatory',
    laymanDefinition: 'A special 3:15 PM to 3:35 PM auction session introduced by SEBI for major derivative (F&O) stocks to calculate the official closing price by pooling buy/sell orders, stopping big traders from manipulating closing prices in the final seconds.',
    analogy: 'Instead of accepting a chaotic last-second bid, the auctioneer pauses the room at 3:15 PM and calculates the fair average price for everyone.',
    examTrap: 'Applies to F&O-eligible (Category I) stocks only; Non-F&O stocks close at the standard 3:30 PM.'
  },
  'purpose-washing': {
    term: 'Purpose-Washing',
    aliases: ['greenwashing', 'esg washing', 'esg debt'],
    fullName: 'ESG Anti-"Purpose-Washing" Safeguards',
    category: 'RBI/Regulatory',
    laymanDefinition: 'When companies issue "Green Bonds" pretending to use the money for solar or clean water, but secretly spend it on regular corporate expenses. SEBI now forces companies to track and report every single rupee spent.',
    analogy: 'Like claiming money from parents for study books but spending it on a restaurant party — SEBI now demands the purchase receipt for every green claim.',
    examTrap: 'BRSR is mandatory for the top 1,000 listed companies by market cap since FY23 based on 9 NGRBC principles; 19 ESG Rating Providers (ERPs) are registered with SEBI.'
  },
  'f&o retail safeguards': {
    term: 'F&O Safeguards',
    aliases: ['retail f&o losses', 'equity derivatives', 'index derivatives'],
    fullName: 'SEBI Equity Derivatives Risk Measures',
    category: 'RBI/Regulatory',
    laymanDefinition: 'Rules introduced by SEBI to prevent retail investors from losing their life savings in high-risk stock options trading (where retail traders lost ₹91,685 crore in FY26) by increasing minimum trade lot sizes and requiring upfront cash margins.',
    analogy: 'Like putting high guardrails and warning sirens on a dangerous cliff edge so casual tourists do not fall off.',
    examTrap: 'Measures: Higher minimum contract size, mandatory upfront premium collection, intraday position monitoring, and higher tail-risk margin buffers.'
  },
  'reits / invits': {
    term: 'REITs / InvITs',
    aliases: ['reit', 'invit', 'reits', 'invits'],
    fullName: 'Real Estate & Infrastructure Investment Trusts',
    category: 'Banking',
    laymanDefinition: 'Mutual fund-like vehicles that own income-generating real estate (shopping malls, tech parks) or infrastructure (highways, power grids). Investors can buy small shares and receive regular rental/toll dividends.',
    analogy: 'Like pooling money with friends to buy a luxury commercial office building and splitting the monthly rent checks.',
    examTrap: 'SEBI proposed allowing Depository Receipts (DRs) against listed REITs/InvITs to attract foreign global investors; privately listed InvITs are excluded.'
  },
  'aif': {
    term: 'AIF',
    aliases: ['alternative investment fund', 'aifs'],
    fullName: 'Alternative Investment Fund',
    category: 'RBI/Regulatory',
    laymanDefinition: 'Privately pooled investment funds in India that collect money from wealthy individuals and institutions to invest in startups (Category I), private equity/debt (Category II), or hedge funds (Category III).',
    analogy: 'An exclusive private investment club for high-net-worth investors looking for high-risk, high-return private deals.',
    examTrap: 'Category I = Startups/SMEs/Social ventures; Category II = PE/Debt funds; Category III = Hedge funds (complex trading strategies).'
  }
};

/**
 * Searches and returns jargon entries found within a given text block
 */
export function detectJargonInText(text: string): JargonEntry[] {
  const lower = text.toLowerCase();
  const matched: JargonEntry[] = [];
  const added = new Set<string>();

  for (const [key, entry] of Object.entries(JARGON_DICTIONARY)) {
    const termsToTest = [key, ...(entry.aliases || [])];
    const isPresent = termsToTest.some(t => {
      const regex = new RegExp(`\\b${t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      return regex.test(lower);
    });

    if (isPresent && !added.has(entry.term)) {
      matched.push(entry);
      added.add(entry.term);
    }
  }

  return matched;
}
