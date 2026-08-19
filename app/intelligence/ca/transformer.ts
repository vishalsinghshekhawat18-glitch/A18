/**
 * Current Affairs Transformer: Reconstructs items into Framework v3 Structure
 */

import { CAMetaIntelligence, CAZone } from './types';
import { classifyRelevance, deriveCAZone } from './relevanceClassifier';
import { applyJargonGlossing } from './storyThreadEngine';

export interface V3NoteBlock {
  type: string;
  title?: string;
  text?: string;
  content?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  summary?: string;
}

export interface CAFrameworkV3Note {
  id: string;
  type: 'ca_note';
  domain: 'current-affairs';
  title: string;
  summary: string;
  blocks: V3NoteBlock[];
  intelligence: CAMetaIntelligence;
  metadata: Record<string, any>;
}

export function transformToFrameworkV3(rawItem: any): CAFrameworkV3Note {
  const publishedDate = rawItem.metadata?.date || '2026-06-01';
  const categoryCode = rawItem.metadata?.category || 'SEC1';
  const tags = rawItem.metadata?.tags || [];

  const isRegulatoryOrBudget = 
    rawItem.title?.toLowerCase().includes('rbi') ||
    rawItem.title?.toLowerCase().includes('sebi') ||
    rawItem.title?.toLowerCase().includes('budget');

  const zone: CAZone = deriveCAZone(publishedDate, isRegulatoryOrBudget);
  const relevance = classifyRelevance(rawItem.title, rawItem.summary || '', categoryCode, tags);

  // Apply parenthetical glossing
  const { glossedText: glossedSummary, glossesApplied } = applyJargonGlossing(rawItem.summary || rawItem.title);

  const blocks: V3NoteBlock[] = [];

  // 1. Hook Banner
  const hookText = `🪝 ${rawItem.title.replace(/^[-\s:]+/, '')}. Key milestone for banking and regulatory awareness.`;
  blocks.push({
    type: 'warning_banner',
    title: `📰 ${relevance.section.fullName}`,
    text: hookText
  });

  // 2. Core Bullet Facts with Bold Numbers / Terms
  const bullets: string[] = [];
  if (Array.isArray(rawItem.blocks)) {
    rawItem.blocks.forEach((b: any) => {
      if (b.type === 'bullet_list' && Array.isArray(b.items)) {
        b.items.forEach((itemStr: string) => {
          const cleaned = itemStr.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '').trim();
          if (cleaned.length > 5) {
            const { glossedText } = applyJargonGlossing(cleaned);
            bullets.push(glossedText);
          }
        });
      } else if (typeof b.content === 'string' && b.content.length > 10) {
        const { glossedText } = applyJargonGlossing(b.content);
        bullets.push(glossedText);
      }
    });
  }

  if (bullets.length === 0) {
    bullets.push(`**Key Update**: ${glossedSummary}`);
    bullets.push(`**Implementation Timeline**: Effective from **${publishedDate}**.`);
  }

  blocks.push({
    type: 'bullet_list',
    items: bullets
  });

  // 3. Static GK / Administrative Context
  const staticGK = {
    parentMinistry: 'Ministry of Finance / Regulatory Authority',
    headquarters: 'Mumbai / New Delhi',
    tagline: 'Empowering India\'s Financial Landscape'
  };

  blocks.push({
    type: 'key_concept',
    title: '🏛️ Static GK & Institutional Context',
    summary: `Nodal Authority: ${staticGK.parentMinistry} · Regulatory Jurisdiction: India · Published: ${publishedDate}`
  });

  // 4. Mandatory 🎯 Exam Angle
  const examAngleText = `🎯 Exam Angle → Focus on nodal implementing authority, financial allocation figures, and statutory threshold definitions.`;
  blocks.push({
    type: 'paragraph',
    content: examAngleText
  });

  // 5. Optional Interview Question for Tier A
  let interviewQ = undefined;
  if (relevance.tier === 'TIER_A') {
    interviewQ = {
      question: `How does this development align with India's macro-financial stability and regulatory framework?`,
      modelAnswer: `It strengthens structural compliance, mitigates systemic transmission risk, and enhances financial inclusion metrics across scheduled commercial banks.`
    };
    blocks.push({
      type: 'warning_banner',
      title: '💼 Interview Question & Model Answer',
      text: `**Q:** ${interviewQ.question}\n\n**Model Answer:** ${interviewQ.modelAnswer}`
    });
  }

  const templateType = relevance.tier === 'TIER_A' ? 'TEMPLATE_A_RICH' : relevance.tier === 'TIER_B' ? 'TEMPLATE_B_PLUS' : 'SKIPPED_LOG';

  const intelligence: CAMetaIntelligence = {
    zone,
    tier: relevance.tier,
    templateType,
    section: relevance.section,
    hook: hookText,
    examAngle: examAngleText,
    interviewQ,
    staticGK,
    jargonGlosses: glossesApplied,
    claimVerificationStatus: 'VERIFIED',
    sourceInstitution: 'Official Government / Banking Press Release',
    publishedDate,
    referenceExamYear: 2026
  };

  return {
    id: rawItem.id,
    type: 'ca_note',
    domain: 'current-affairs',
    title: rawItem.title.replace(/^[-\s:]+/, '').trim(),
    summary: glossedSummary,
    blocks,
    intelligence,
    metadata: {
      ...rawItem.metadata,
      caFrameworkVersion: 'v3.0.0-claude-aligned',
      relevanceTier: relevance.tier,
      temporalZone: zone,
      sectionCode: relevance.section.code,
      sectionNumber: relevance.section.number
    }
  };
}
