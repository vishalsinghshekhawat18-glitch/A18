/**
 * R5.2 Editorial Abstraction Engine — Editorial Memory Unit (EMU) Architecture
 * Level 1: Story Identity -> Level 2: Knowledge Relationship -> Level 3: Memory Necessity
 */

import { SourceConflict } from './types';

export type MemoryUnitDecision = 
  | 'CREATE_NEW_MEMORY_UNIT'
  | 'ATTACH_TO_EXISTING_MEMORY_UNIT'
  | 'CREATE_INCREMENTAL_UPDATE'
  | 'REDIRECT_DUPLICATE'
  | 'SKIP';

export interface ConstituentSubEvent {
  subEventId: string;
  sourceArticleId: string;
  page: number;
  subTitle: string;
  specificFacts: string[];
  keyFigures: string[];
}

export interface EditorialMemoryUnit {
  memoryUnitId: string;
  primaryTitle: string;
  category: string;
  tier: 'TIER_A' | 'TIER_B_PLUS';
  theme: string;
  attentionBudgetJustification: string;
  constituentStories: ConstituentSubEvent[];
  consolidatedKeyFacts: string[];
  statutoryProvisions: string[];
  financialOutlays: string[];
  examAngle: string;
  staticAnchor?: {
    entity: string;
    details: string;
  };
  provenancePages: number[];
  provenanceArticleIds: string[];
  qualityState: 'VALID' | 'SOURCE_CONFLICT' | 'NEEDS_REVIEW';
  conflicts: SourceConflict[];
  crossDomainLinks: Array<{
    targetCorpus: 'SCHEMES' | 'POLITY' | 'ECONOMICS' | 'STATIC_GA';
    nodeId: string;
    relationship: string;
  }>;
}

export interface MemoryUnitEvaluation {
  sourceArticleId: string;
  page: number;
  title: string;
  decision: MemoryUnitDecision;
  targetMemoryUnitId?: string;
  attentionScore: number;
  examProbabilityScore: number;
  regulatoryRelevanceScore: number;
  policyDurabilityScore: number;
  reason: string;
  concreteAttentionJustification: string;
}

export class EditorialAbstractionEngine {
  private memoryUnits: Map<string, EditorialMemoryUnit> = new Map();

  /**
   * Evaluates a candidate article through the 3-Level Editorial Memory Model
   */
  public evaluateCandidateArticle(
    articleId: string,
    page: number,
    title: string,
    text: string,
    section: string
  ): MemoryUnitEvaluation {
    const lowerText = `${title} ${text}`.toLowerCase();

    // 1. Level 3 Filter: Immediate Low-Yield / Fluff Discard
    const isObituary = section === 'Obituaries' || lowerText.includes('passes away') || lowerText.includes('passed away') || lowerText.includes('demise');
    const isCelebrityPR = lowerText.includes('instagram followers') || lowerText.includes('bollywood') || lowerText.includes('brand ambassador') || lowerText.includes('danish café brand') || lowerText.includes('fitbit co-founders');
    const isRoutineSports = (section === 'Sports' || lowerText.includes('ranji trophy') || lowerText.includes('billiards') || lowerText.includes('pro wrestling') || lowerText.includes('open masters games')) &&
                            !lowerText.includes('u19 cricket world cup') && !lowerText.includes('australian open') && !lowerText.includes('winter olympics') && !lowerText.includes('wpl 2026');
    const isLocalTrivia = lowerText.includes('adampur airport') || lowerText.includes('mount abu as aburaj') || lowerText.includes('soundala village') || lowerText.includes('bird atlas of goa') || lowerText.includes('cow culture museum');
    const isMinorCorpMoU = (lowerText.includes('co-branded credit card') && !lowerText.includes('rrb') && !lowerText.includes('rupay')) || lowerText.includes('finsider') || lowerText.includes('replit');
    const isRoutineMilitaryDrill = (lowerText.includes('exercise ') || lowerText.includes('joint training')) &&
                                  (lowerText.includes('agni pariksha') || lowerText.includes('imacc') || lowerText.includes('agni varsha') || lowerText.includes('kalari leap') || lowerText.includes('buddy squadron'));

    if (isObituary || isCelebrityPR || isRoutineSports || isLocalTrivia || isMinorCorpMoU || isRoutineMilitaryDrill) {
      return {
        sourceArticleId: articleId,
        page,
        title,
        decision: 'SKIP',
        attentionScore: 10,
        examProbabilityScore: 5,
        regulatoryRelevanceScore: 0,
        policyDurabilityScore: 5,
        reason: isObituary ? 'Biographical condolence' : isCelebrityPR ? 'Celebrity PR / Social media metric' : isRoutineMilitaryDrill ? 'Routine non-strategic bilateral training drill' : isMinorCorpMoU ? 'Routine private corporate product / co-branding' : 'Local / municipal trivia lacking macro-policy durability',
        concreteAttentionJustification: 'Failed Attention-Budget test: Zero sovereign statutory or testing yield for Banking/Regulatory GA.'
      };
    }

    // 2. Level 2: Knowledge Relationship & Thematic Attachment
    // THEME A: India AI Impact Summit 2026 (MANAV, Sutras, Frontier AI, VoicERA, FiMI, Declarations)
    if (
      lowerText.includes('ai impact summit') || lowerText.includes('manav vision') || lowerText.includes('voicera') || 
      lowerText.includes('new delhi frontier ai') || lowerText.includes('fimi') || lowerText.includes('seven chakras') ||
      lowerText.includes('casebook on ai and gender') || lowerText.includes('new delhi declaration on ai')
    ) {
      const parentUnitId = 'emu-india-ai-impact-summit-2026';
      if (!this.memoryUnits.has(parentUnitId)) {
        this.initializeMemoryUnit(parentUnitId, '🏛️ India AI Impact Summit 2026 — Comprehensive Sovereign AI Framework', 'SEC6', 'TIER_A', 'Artificial Intelligence Governance & Sovereign Stack', 'Constitutes India’s landmark 2026 global AI governance milestone encompassing MANAV, Frontier Commitments, and BHASHINI stack.');
        return {
          sourceArticleId: articleId,
          page,
          title,
          decision: 'CREATE_NEW_MEMORY_UNIT',
          targetMemoryUnitId: parentUnitId,
          attentionScore: 95,
          examProbabilityScore: 92,
          regulatoryRelevanceScore: 88,
          policyDurabilityScore: 95,
          reason: 'Master Sovereign AI Framework Memory Unit',
          concreteAttentionJustification: 'Core national AI governance charter testing ethical principles, linguistic inclusion (22 languages), and global commitments.'
        };
      } else {
        return {
          sourceArticleId: articleId,
          page,
          title,
          decision: 'ATTACH_TO_EXISTING_MEMORY_UNIT',
          targetMemoryUnitId: parentUnitId,
          attentionScore: 90,
          examProbabilityScore: 90,
          regulatoryRelevanceScore: 85,
          policyDurabilityScore: 90,
          reason: 'Constituent component of India AI Impact Summit 2026',
          concreteAttentionJustification: 'Substantive sub-announcement best revised inside the AI Summit Master Memory Unit.'
        };
      }
    }

    // THEME B: PM-SETU & ITI Upgradation (World Bank Loan + NSTI Kanpur)
    if (lowerText.includes('pm-setu') || (lowerText.includes('upgraded industrial training institutes') && lowerText.includes('world bank'))) {
      const parentUnitId = 'emu-scheme-pm-setu';
      if (!this.memoryUnits.has(parentUnitId)) {
        this.initializeMemoryUnit(parentUnitId, '📌 PM-SETU (₹60,000 Cr ITI Upgradation & World Bank $830M Financing)', 'SEC10', 'TIER_A', 'Vocational Skilling & External Multilateral Financing', 'Key central sector skilling initiative upgrading 1,000 ITIs with 19.5-year World Bank facility.');
        return {
          sourceArticleId: articleId,
          page,
          title,
          decision: 'CREATE_NEW_MEMORY_UNIT',
          targetMemoryUnitId: parentUnitId,
          attentionScore: 94,
          examProbabilityScore: 90,
          regulatoryRelevanceScore: 80,
          policyDurabilityScore: 95,
          reason: 'Master PM-SETU Scheme Memory Unit',
          concreteAttentionJustification: 'Directly testable scheme outlay (₹60,000 Cr) and multilateral borrowing ($830M under CPF 2026-31).'
        };
      } else {
        return {
          sourceArticleId: articleId,
          page,
          title,
          decision: 'ATTACH_TO_EXISTING_MEMORY_UNIT',
          targetMemoryUnitId: parentUnitId,
          attentionScore: 90,
          examProbabilityScore: 88,
          regulatoryRelevanceScore: 80,
          policyDurabilityScore: 90,
          reason: 'Sub-component of PM-SETU (Centre of Excellence / French cooperation)',
          concreteAttentionJustification: 'Attaching NSTI Kanpur CoE to PM-SETU master unit for unified skilling revision.'
        };
      }
    }

    // THEME C: ANRF ₹1 Lakh Crore RDI Fund (TDB Call + BIRAC Biotech Call)
    if (lowerText.includes('rdi fund') || lowerText.includes('anusandhan national research foundation') || lowerText.includes('birac–rdi fund')) {
      const parentUnitId = 'emu-anrf-rdi-fund-1-lakh-crore';
      if (!this.memoryUnits.has(parentUnitId)) {
        this.initializeMemoryUnit(parentUnitId, '🔬 ANRF ₹1 Lakh Crore RDI Fund — Concessional Tech & Biotech Financing', 'SEC6', 'TIER_A', 'National Research & Indigenous Innovation Financing', 'Deep-tech concessional financing framework (2-4% interest, 15-year tenure) via TDB and BIRAC.');
        return {
          sourceArticleId: articleId,
          page,
          title,
          decision: 'CREATE_NEW_MEMORY_UNIT',
          targetMemoryUnitId: parentUnitId,
          attentionScore: 92,
          examProbabilityScore: 89,
          regulatoryRelevanceScore: 82,
          policyDurabilityScore: 94,
          reason: 'Master ANRF RDI Fund Memory Unit',
          concreteAttentionJustification: 'Major ₹1L Cr sovereign research fund with specific lending parameters (TRL 4+, up to 50% project cost).'
        };
      } else {
        return {
          sourceArticleId: articleId,
          page,
          title,
          decision: 'ATTACH_TO_EXISTING_MEMORY_UNIT',
          targetMemoryUnitId: parentUnitId,
          attentionScore: 88,
          examProbabilityScore: 85,
          regulatoryRelevanceScore: 80,
          policyDurabilityScore: 90,
          reason: 'Second-level BIRAC biotechnology call under ANRF',
          concreteAttentionJustification: 'Attaching ₹2,000 Cr BIRAC tranche directly to ANRF master unit.'
        };
      }
    }

    // THEME D: VOC Port Tuticorin Strategic Developments
    if (lowerText.includes('voc port') || lowerText.includes('chidambaranar')) {
      const parentUnitId = 'emu-voc-port-tuticorin-green-expansion';
      if (!this.memoryUnits.has(parentUnitId)) {
        this.initializeMemoryUnit(parentUnitId, '🌐 VOC Port Tuticorin — Green Hydrogen, Digital Twin & ₹15,000 Cr Expansion', 'SEC4', 'TIER_A', 'Maritime Infrastructure & Energy Transition', 'First major port to achieve IGBC Platinum, on-site green hydrogen, and Outer Harbour expansion.');
        return {
          sourceArticleId: articleId,
          page,
          title,
          decision: 'CREATE_NEW_MEMORY_UNIT',
          targetMemoryUnitId: parentUnitId,
          attentionScore: 89,
          examProbabilityScore: 85,
          regulatoryRelevanceScore: 78,
          policyDurabilityScore: 90,
          reason: 'Master VOC Port Green Infrastructure Memory Unit',
          concreteAttentionJustification: 'Consolidates 4 port milestones (green hydrogen, digital twin, ₹15k Cr outer harbour, IGBC rating).'
        };
      } else {
        return {
          sourceArticleId: articleId,
          page,
          title,
          decision: 'ATTACH_TO_EXISTING_MEMORY_UNIT',
          targetMemoryUnitId: parentUnitId,
          attentionScore: 86,
          examProbabilityScore: 82,
          regulatoryRelevanceScore: 75,
          policyDurabilityScore: 88,
          reason: 'Constituent certification / expansion MoU of VOC Port',
          concreteAttentionJustification: 'Attaching environmental ratings and tripartite funding into unified port node.'
        };
      }
    }

    // 3. Level 3: Standalone High-Yield Memory Units
    let targetSection = 'SEC4';
    let tier: 'TIER_A' | 'TIER_B_PLUS' = 'TIER_B_PLUS';
    let score = 78;
    let concreteJustification = 'Standard national development / appointment / treaty of high exam significance.';

    if (
      lowerText.includes('rbi') || lowerText.includes('reserve bank') || lowerText.includes('sebi') || 
      lowerText.includes('repo rate') || lowerText.includes('dicgc') || lowerText.includes('kisan credit card') || 
      lowerText.includes('ecb') || lowerText.includes('mis-selling') || lowerText.includes('lbs') || lowerText.includes('uti') ||
      lowerText.includes('broker funding') || lowerText.includes('etf price band')
    ) {
      targetSection = 'SEC2';
      tier = 'TIER_A';
      score = 96;
      concreteJustification = 'Statutory regulatory directive issued by RBI/SEBI/DICGC with enforceable compliance thresholds.';
    } else if (
      lowerText.includes('budget') || lowerText.includes('finance commission') || lowerText.includes('gdp') || 
      lowerText.includes('inflation') || lowerText.includes('cpi') || lowerText.includes('wpi') || lowerText.includes('disinvestment') ||
      lowerText.includes('national accounts')
    ) {
      targetSection = 'SEC1';
      tier = 'TIER_A';
      score = 94;
      concreteJustification = 'Macroeconomic baseline figure (fiscal deficit, tax devolution, inflation base year, national accounts revision).';
    } else if (
      lowerText.includes('upi') || lowerText.includes('cbdc') || lowerText.includes('sbi') || lowerText.includes('m-cap') || 
      lowerText.includes('nabard') || lowerText.includes('nabfid') || lowerText.includes('insurance fdi') || lowerText.includes('tripura gramin bank')
    ) {
      targetSection = 'SEC3';
      tier = 'TIER_A';
      score = 90;
      concreteJustification = 'Core banking institution milestone, payment infrastructure record, or statutory AIFI debt issuance.';
    } else if (
      lowerText.includes('pm-rahat') || lowerText.includes('pmay') || lowerText.includes('rare-earth') || lowerText.includes('brahmaputra') ||
      lowerText.includes('namo bharat') || lowerText.includes('vibrant village') || lowerText.includes('keralam') || lowerText.includes('prahaar')
    ) {
      targetSection = 'SEC10';
      tier = 'TIER_A';
      score = 88;
      concreteJustification = 'Landmark Central Government scheme / physical infrastructure megaproject / counter-terrorism doctrine.';
    } else if (
      lowerText.includes('uday kotak') || lowerText.includes('icai') || lowerText.includes('niti aayog') || lowerText.includes('brics') ||
      lowerText.includes('pax silica') || lowerText.includes('new start') || lowerText.includes('semi-conductor atmp') || lowerText.includes('agni-iii') ||
      lowerText.includes('ctf 154') || lowerText.includes('hammer') || lowerText.includes('prachand') || lowerText.includes('network readiness') ||
      lowerText.includes('corruption perception') || lowerText.includes('henley') || lowerText.includes('crafoord prize')
    ) {
      targetSection = lowerText.includes('uday kotak') || lowerText.includes('icai') || lowerText.includes('niti aayog') ? 'SEC5' :
                      lowerText.includes('henley') || lowerText.includes('corruption') || lowerText.includes('readiness') || lowerText.includes('crafoord') ? 'SEC7' :
                      lowerText.includes('semiconductor') || lowerText.includes('agni') || lowerText.includes('ctf') || lowerText.includes('hammer') || lowerText.includes('prachand') ? 'SEC6' : 'SEC4';
      tier = 'TIER_B_PLUS';
      score = 85;
      concreteJustification = 'High-frequency exam fact (apex regulatory appointment, major bilateral pact, strategic weapon test, global index rank).';
    } else if (lowerText.includes('u19 cricket world cup') || lowerText.includes('australian open') || lowerText.includes('winter olympics') || lowerText.includes('wpl 2026')) {
      targetSection = 'SEC8';
      tier = 'TIER_B_PLUS';
      score = 82;
      concreteJustification = 'Historic world championship / grand slam tennis / national sports title.';
    }

    const unitId = `emu-${articleId}`;
    this.initializeMemoryUnit(unitId, title, targetSection, tier, title, concreteJustification);

    return {
      sourceArticleId: articleId,
      page,
      title,
      decision: 'CREATE_NEW_MEMORY_UNIT',
      targetMemoryUnitId: unitId,
      attentionScore: score,
      examProbabilityScore: score,
      regulatoryRelevanceScore: targetSection === 'SEC2' ? 95 : 70,
      policyDurabilityScore: score,
      reason: `Independent Standalone Memory Unit in ${targetSection}`,
      concreteAttentionJustification: concreteJustification
    };
  }

  private initializeMemoryUnit(
    id: string,
    title: string,
    category: string,
    tier: 'TIER_A' | 'TIER_B_PLUS',
    theme: string,
    justification: string
  ) {
    this.memoryUnits.set(id, {
      memoryUnitId: id,
      primaryTitle: title,
      category,
      tier,
      theme,
      attentionBudgetJustification: justification,
      constituentStories: [],
      consolidatedKeyFacts: [],
      statutoryProvisions: [],
      financialOutlays: [],
      examAngle: `🎯 Exam Angle → Focus on exact statutory limits, financial outlays, and regulatory frameworks.`,
      provenancePages: [],
      provenanceArticleIds: [],
      qualityState: 'VALID',
      conflicts: [],
      crossDomainLinks: []
    });
  }

  public getMemoryUnits(): EditorialMemoryUnit[] {
    return Array.from(this.memoryUnits.values());
  }
}
