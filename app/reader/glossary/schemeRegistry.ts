/**
 * Comprehensive Government Schemes & National Missions Master Registry
 * Deep-dive intelligence for Banking & Regulatory Exam Aspirants:
 * Past Genesis, Lineage, Financial Architecture, Targets, 2026 Status & Exam Traps.
 */

import { KnowledgeItem } from '../../../schema/knowledge-item';

export interface SchemeEntry {
  id: string;
  shortName: string;
  fullName: string;
  schemeType: string;
  nodalMinistry: string;
  launchDate: string;
  totalOutlay: string;
  targets: string;
  predecessorAndLineage: string;
  current2026Update: string;
  examTrap: string;
  aliases: string[];
}

export const SCHEMES_MASTER_REGISTRY: Record<string, SchemeEntry> = {
  'pm-e-drive': {
    id: 'pm-e-drive',
    shortName: 'PM E-DRIVE',
    fullName: 'PM Electric Drive Revolution in Innovative Vehicle Enhancement',
    schemeType: 'Central Sector Scheme',
    nodalMinistry: 'Ministry of Heavy Industries (MHI)',
    launchDate: 'October 2024 (Valid till March 31, 2028)',
    totalOutlay: '₹11,900 Crore (100% Central Funding)',
    targets: '24.79 Lakh e2Ws · 3.16 Lakh e3Ws · 14,028 e-Buses · 88,500 EV Fast Chargers',
    predecessorAndLineage: 'Replaced the older FAME-II Scheme (₹11,500 Cr, which ended in March 2024). Shifted primary fiscal focus toward public transportation (e-buses), public charging infrastructure, and Aadhaar-authenticated buyer e-vouchers.',
    current2026Update: 'Government extended scheme tenure by 1 year to March 31, 2028 while tapering down the e2W subsidy from ₹5,000/kWh to ₹2,500/kWh (max ₹5,000 per vehicle) for electric 2-wheelers with ex-factory price ≤ ₹1.5 lakh.',
    examTrap: 'Total outlay remains fixed at ₹11,900 Cr (not increased); hybrid cars are excluded (only pure EVs eligible); subsidy per e2W was halved from ₹10,000 to ₹5,000.',
    aliases: ['pm e-drive', 'pm edrive', 'pm-edrive', 'e-drive', 'e2w subsidy', 'electric drive revolution']
  },

  'pm-surya-ghar': {
    id: 'pm-surya-ghar',
    shortName: 'PM Surya Ghar',
    fullName: 'PM Surya Ghar: Muft Bijli Yojana',
    schemeType: 'Central Sector Scheme',
    nodalMinistry: 'Ministry of New and Renewable Energy (MNRE)',
    launchDate: '13 February 2024 by PM Narendra Modi',
    totalOutlay: '₹75,021 Crore (Co-funded by $850 mn ADB loan)',
    targets: '1 Crore (10 Million) households · Up to 300 units of free monthly solar power',
    predecessorAndLineage: 'Replaced the Grid-Connected Rooftop Solar Programme Phase-II. Revolutionized rooftop solar by providing direct DBT subsidies into consumer bank accounts (₹30,000 for 1kW, ₹60,000 for 2kW, max ₹78,000 for 3kW+) and collateral-free concessional bank loans at ~7% interest.',
    current2026Update: 'Crossed 50.06 lakh (5.0+ million) residential installations — reaching 50% of the national 1 crore target ahead of schedule.',
    examTrap: 'Maximum central financial assistance (subsidy) caps at ₹78,000 for 3 kW systems (no extra subsidy beyond 3 kW for residential homes); nodal financing agency is REC Limited.',
    aliases: ['pm surya ghar', 'muft bijli yojana', 'surya ghar', 'rooftop solar']
  },

  'pm-setu': {
    id: 'pm-setu',
    shortName: 'PM-SETU',
    fullName: 'PM Skill Ecosystem Transformation for Upgraded ITIs',
    schemeType: 'Centrally Sponsored Scheme',
    nodalMinistry: 'Ministry of Skill Development and Entrepreneurship (MSDE)',
    launchDate: 'Announced Union Budget 2024-25 / Operationalized 2025-26',
    totalOutlay: '₹60,000 Crore (Centre: ₹30,000 Cr, States: ₹20,000 Cr, Industry/World Bank: ₹10,000 Cr / $830M)',
    targets: 'Modernization of 1,000 Government ITIs in hub-and-spoke model · 20 Lakh youth trained annually in Industry 4.0 (Robotics, AI, EV Tech)',
    predecessorAndLineage: 'Built on the legacy of the Craftsmen Training Scheme (CTS) and STRIVE (Skills Strengthening for Industrial Value Enhancement). Upgrades traditional manual trade institutes into cutting-edge industry training centers.',
    current2026Update: 'World Bank approved $830 million financing; phase-1 rollout of 200 hub ITIs commenced across 18 states.',
    examTrap: 'Outlay split: ₹60,000 Cr total (50% Centre / 33% State / 17% Industry-World Bank); targets 1,000 ITIs (not all 15,000 ITIs).',
    aliases: ['pm-setu', 'pm setu', 'skill ecosystem transformation', 'upgraded itis']
  },

  'pm-rahat': {
    id: 'pm-rahat',
    shortName: 'PM-RAHAT',
    fullName: 'Pradhan Mantri Road Accident Hospitalization & Assistance for Trauma',
    schemeType: 'Central Sector Scheme',
    nodalMinistry: 'Ministry of Road Transport and Highways (MoRTH)',
    launchDate: 'Operationalized 2025-26 under Motor Vehicles Amendment Act',
    totalOutlay: 'Funded via Motor Vehicle Accident Fund (Statutory Corpus)',
    targets: 'Cashless treatment up to ₹1.50 Lakh per victim for all road accident victims on National and State Highways during the first 60 minutes ("Golden Hour")',
    predecessorAndLineage: 'Replaced piecemeal state victim compensation funds with a unified pan-India cashless trauma package integrated with the National Health Authority (PM-JAY IT portal).',
    current2026Update: 'Extended cashless trauma coverage across 100% of National Highways with over 8,500 empanelled trauma hospitals.',
    examTrap: 'Maximum treatment cap is ₹1.50 Lakh per accident victim; validity period: maximum 7 days from the time of accident; "Golden Hour" refers to the first 60 minutes.',
    aliases: ['pm-rahat', 'pm rahat', 'cashless trauma', 'road accident hospitalization', 'golden hour']
  },

  'cgsmfi': {
    id: 'cgsmfi',
    shortName: 'CGSMFI 2.0',
    fullName: 'Credit Guarantee Scheme for Microfinance Institutions',
    schemeType: 'Central Sector Scheme',
    nodalMinistry: 'Ministry of Finance (Department of Financial Services)',
    launchDate: 'Launched July 2021 / Upgraded to CGSMFI 2.0 in 2026',
    totalOutlay: '₹20,000 Crore Guarantee Portfolio Corpus managed by NCGTC',
    targets: 'Credit guarantee coverage up to 75% for bank loans given to small and medium Microfinance Institutions (MFIs)',
    predecessorAndLineage: 'Originally launched as part of the post-COVID Economic Relief Package. Upgraded into CGSMFI 2.0 to ensure smaller grassroots micro-lenders do not get crowded out by giant NBFC-MFIs.',
    current2026Update: 'New mandatory rule forces banks to allocate at least 15% of the total ₹20,000 crore guarantee pool specifically to small and mid-sized MFIs with Assets Under Management (AUM) < ₹500 Crore.',
    examTrap: 'Small MFIs defined as AUM < ₹500 Cr; Medium: ₹500 Cr–₹2,000 Cr; Large: >₹2,000 Cr. Minimum 15% quota is legally binding on lending banks.',
    aliases: ['cgsmfi', 'credit guarantee scheme for microfinance', 'cgsmfi 2.0', 'microfinance credit guarantee']
  },

  'nmeo-os': {
    id: 'nmeo-os',
    shortName: 'NMEO-Oilseeds',
    fullName: 'National Mission on Edible Oils – Oilseeds (NMEO-OS)',
    schemeType: 'Centrally Sponsored Scheme',
    nodalMinistry: 'Ministry of Agriculture & Farmers Welfare',
    launchDate: 'Approved October 2024 (FY2024-25 to FY2030-31)',
    totalOutlay: '₹10,103 Crore (Centre: ₹7,000 Cr, State: ₹3,103 Cr)',
    targets: 'Increase domestic edible oilseed production from 39 Million Tonnes (FY23) to 69.7 Million Tonnes by 2030-31 · Cut import dependence by 50%+',
    predecessorAndLineage: 'Complements the earlier NMEO-OP (Oil Palm, ₹11,040 Cr launched in 2021). Targets primary oilseed crops: Mustard, Groundnut, Soybean, Sunflower, and Sesame.',
    current2026Update: 'Rollout of 65 High-Yielding Seed Hubs across 14 major agricultural states.',
    examTrap: 'NMEO-OP is specifically for Oil Palm (₹11,040 Cr); NMEO-OS is for secondary oilseeds (₹10,103 Cr over 7 years till 2031).',
    aliases: ['nmeo-os', 'nmeo', 'national mission on edible oils', 'edible oil self-reliance']
  },

  'nbhm': {
    id: 'nbhm',
    shortName: 'NBHM',
    fullName: 'National Beekeeping and Honey Mission',
    schemeType: 'Central Sector Scheme',
    nodalMinistry: 'Ministry of Agriculture & Farmers Welfare',
    launchDate: 'Launched under Atmanirbhar Bharat Abhiyan (2020) / Extended to 2026',
    totalOutlay: '₹500 Crore (100% Central Funding via National Bee Board)',
    targets: '"Sweet Revolution" · 100+ World-Class Honey Testing Labs · Traceability via Madhukranti Portal',
    predecessorAndLineage: 'Evolved from the National Bee Board programmes into a focused mission covering scientifically managed bee colonies, disease surveillance, and export-grade purity certification.',
    current2026Update: 'Madhukranti Portal achieved 100% QR-code batch traceability for honey exports to EU and US markets.',
    examTrap: '100% Central Sector Scheme (not 60:40 state share); implemented through the National Bee Board (NBB); export tracking portal is Madhukranti.',
    aliases: ['nbhm', 'national beekeeping and honey mission', 'sweet revolution', 'madhukranti']
  },

  'pm-vbry': {
    id: 'pm-vbry',
    shortName: 'PM-VBRY',
    fullName: 'Pradhan Mantri Viksit Bharat Rozgar Yojana',
    schemeType: 'Central Sector Scheme',
    nodalMinistry: 'Ministry of Labour and Employment',
    launchDate: 'Announced Union Budget 2024-25 / Operationalized 2025-26',
    totalOutlay: '₹23,000 Crore Employment-Linked Incentive (ELI) Package',
    targets: 'Incentivize 1st-time formal job seekers: 1-month salary (up to ₹15,000) directly into EPFO accounts in 3 installments · Employer subsidy for new manufacturing jobs',
    predecessorAndLineage: 'Successor to the Aatmanirbhar Bharat Rozgar Yojana (ABRY). Focuses on manufacturing and formal job creation for youth entering the formal workforce.',
    current2026Update: 'Enrolled over 42 lakh first-time formal employees with direct Aadhaar-EPFO DBT transfers.',
    examTrap: 'Salary incentive is capped at ₹15,000 paid in 3 installments; eligible wage ceiling is ₹1 lakh/month for first-time formal employees.',
    aliases: ['pm-vbry', 'pm vbry', 'viksit bharat rozgar yojana', 'employment-linked incentive']
  },

  'gobardhan': {
    id: 'gobardhan',
    shortName: 'GOBARdhan',
    fullName: 'Galvanizing Organic Bio-Agro Resources Dhan',
    schemeType: 'Centrally Sponsored / Multi-Ministry Umbrella',
    nodalMinistry: 'Department of Drinking Water and Sanitation (Ministry of Jal Shakti)',
    launchDate: 'Launched 2018 under Swachh Bharat Mission (Grameen) Phase II',
    totalOutlay: '₹10,000 Crore Multi-Ministry Convergence Envelope',
    targets: '500 New "Waste to Wealth" Compressed Bio-Gas (CBG) & Bio-CNG Plants across rural districts',
    predecessorAndLineage: 'Unifies bio-gas initiatives across Ministry of New & Renewable Energy (SATAT scheme), Ministry of Agriculture, and Ministry of Petroleum.',
    current2026Update: 'Mandatory 5% CBG blending mandate for all City Gas Distribution (CGD) entities effective FY26.',
    examTrap: 'Unified portal managed by Department of Drinking Water & Sanitation (Jal Shakti), but CBG blending is enforced by Ministry of Petroleum & Natural Gas (MoPNG).',
    aliases: ['gobardhan', 'gobar-dhan', 'cbg blending', 'compressed bio-gas']
  },

  'pm-kisan': {
    id: 'pm-kisan',
    shortName: 'PM-KISAN',
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    schemeType: 'Central Sector Scheme',
    nodalMinistry: 'Ministry of Agriculture & Farmers Welfare',
    launchDate: '24 February 2019 (Effective from 1 December 2018)',
    totalOutlay: 'Annual Budget: ~₹60,000 Crore (100% Central Funding)',
    targets: '₹6,000 per year direct income support to all landholding farmer families, released in 3 equal 4-monthly installments of ₹2,000',
    predecessorAndLineage: 'India’s largest Direct Benefit Transfer (DBT) scheme. Replaced ad-hoc input subsidies with predictable quarterly cash transfers.',
    current2026Update: 'Government released the 19th & 20th Installment, with total cumulative transfers crossing ₹3.45 Lakh Crore across 11+ crore beneficiary farmers.',
    examTrap: '100% funded by Central Government; mandatory e-KYC and Aadhaar-seeded Land Seeding; excludes institutional landholders and income-tax paying farmers.',
    aliases: ['pm-kisan', 'pm kisan', 'kisan samman nidhi']
  },

  'senior-welfare': {
    id: 'senior-welfare',
    shortName: 'SNEHA / JEEVAN',
    fullName: 'Integrated Senior Citizen Welfare Architecture (SNEHA / JEEVAN / SHATAYU)',
    schemeType: 'Centrally Sponsored Scheme',
    nodalMinistry: 'Ministry of Social Justice and Empowerment',
    launchDate: 'Upgraded 2025-26',
    totalOutlay: '₹3,500 Crore National Senior Welfare Fund',
    targets: 'Senior care homes in every district, dementia daycare clusters, and universal geriatric healthcare cards',
    predecessorAndLineage: 'Consolidated the National Action Plan for Senior Citizens (NAPSrC) and Rashtriya Vayoshri Yojana (RVY) into a single unified 3-tier umbrella.',
    current2026Update: 'Operationalized 400 district SNEHA senior daycare clinics and expanded assisted living device distribution.',
    examTrap: 'Rashtriya Vayoshri Yojana provides physical assisted living devices to BPL/low-income seniors; implemented via ALIMCO (a PSU).',
    aliases: ['sneha', 'jeevan', 'shatayu', 'senior-citizen welfare', 'senior citizen welfare cluster']
  },

  'samudra-manthan': {
    id: 'samudra-manthan',
    shortName: 'Samudra Manthan',
    fullName: 'National Deepwater and Ultra-Deepwater Offshore Exploration Mission',
    schemeType: 'Central Sector Scheme',
    nodalMinistry: 'Ministry of Petroleum and Natural Gas (MoPNG)',
    launchDate: 'Launched 2025-26',
    totalOutlay: '₹12,000 Crore Exploration & Seismic Survey Mission',
    targets: 'Mapping 1 Million Sq Km of India’s Exclusive Economic Zone (EEZ) in Andaman & Krishna-Godavari deepwater basins',
    predecessorAndLineage: 'Complements Open Acreage Licensing Policy (OALP) and the National Data Repository (NDR). Offers 0% revenue share royalty discounts for early deepwater drilling.',
    current2026Update: 'Commenced 3D seismic mapping of 14 ultra-deepwater blocks in the Andaman Sea.',
    examTrap: 'Administered by Directorate General of Hydrocarbons (DGH) under MoPNG; Andaman deepwater blocks carry special fiscal concessions.',
    aliases: ['samudra manthan', 'offshore exploration', 'deepwater exploration']
  }
};

/**
 * Intelligent detector to see if a note mentions a government scheme.
 * Returns the matched SchemeEntry or null if no scheme is present.
 */
export function detectSchemeInItem(item: KnowledgeItem): SchemeEntry | null {
  const fullText = `${item.title} ${item.summary || ''} ${item.blocks.map(b => 'content' in b ? b.content : ('items' in b ? (b.items as string[]).join(' ') : '')).join(' ')}`.toLowerCase();

  for (const entry of Object.values(SCHEMES_MASTER_REGISTRY)) {
    for (const alias of entry.aliases) {
      const regex = new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(fullText)) {
        return entry;
      }
    }
  }

  // Fallback: If in Section 10 (Schemes) but not in explicit list, provide standard scheme structure
  if (item.metadata?.sectionCode === 'SEC10' || item.metadata?.category === 'SEC10') {
    return {
      id: item.id,
      shortName: item.title.split(':')[0]?.substring(0, 25) || 'Government Scheme',
      fullName: item.title,
      schemeType: 'Central Sector Scheme',
      nodalMinistry: 'Government of India',
      launchDate: item.metadata?.date || 'Current Affairs 2026',
      totalOutlay: 'As per Union Cabinet / Budgetary allocation',
      targets: item.summary || 'Public welfare, infrastructure expansion, and socio-economic transformation.',
      predecessorAndLineage: 'Implemented under Government of India national development priorities.',
      current2026Update: item.summary || 'Active national rollout in FY2026-27.',
      examTrap: 'Verify Nodal Ministry, Central vs Centrally Sponsored split, and recent outlay revisions for SBI PO Mains.',
      aliases: []
    };
  }

  return null;
}
