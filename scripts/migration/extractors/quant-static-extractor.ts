import crypto from 'node:crypto';
import { KnowledgeItem, SemanticBlock, Domain } from '../../../schema/knowledge-item';

export interface RawQuantStaticItem {
  id: string;
  subId?: string;
  realSourceId?: string;
  title: string;
  type?: string;
  headers?: string[];
  rows?: string[][];
  formulas?: string[];
  workedExamples?: Array<{
    title: string;
    question: string;
    given?: string[];
    method: string;
    steps?: Array<{ stepNumber: number; explanation: string; latex?: string }>;
    answer: string;
  }>;
  items?: any[];
  shortcuts?: string[];
  traps?: string[];
  category?: string;
}

export function transformQuantStaticToKnowledgeItem(
  raw: RawQuantStaticItem,
  sourceSystem: 'Quant' | 'StaticGA' | 'Schemes' | 'PYQs',
  sourceFile: string,
  rawSourcePayload?: any
): KnowledgeItem {
  const payloadToHash = rawSourcePayload || raw;
  const sourceChecksum = crypto.createHash('sha256').update(JSON.stringify(payloadToHash)).digest('hex');
  const nowISO = new Date().toISOString();

  const itemId = raw.subId || raw.id;
  const blocks: SemanticBlock[] = [];

  const domainMap: Record<string, Domain> = {
    Quant: 'quant',
    StaticGA: 'static-ga',
    Schemes: 'current-affairs',
    PYQs: 'pyqs'
  };

  const domain: Domain = domainMap[sourceSystem] || 'quant';
  const itemTypeMap = {
    Quant: 'quant_topic',
    StaticGA: 'static_note',
    Schemes: 'ca_note',
    PYQs: 'pyq_item'
  } as const;

  // 1. Body, Content, Details, or Description text
  const rawBody = (raw as any).body || (raw as any).content || (raw as any).details || (raw as any).description;
  if (rawBody && typeof rawBody === 'string' && rawBody.trim().length > 0) {
    const lines = rawBody.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 1) {
      blocks.push({
        type: 'paragraph',
        content: lines[0]
      });
    } else {
      blocks.push({
        type: 'bullet_list',
        items: lines
      });
    }
  }

  // 1b. Highlights array
  const rawHighlights = (raw as any).highlights;
  if (Array.isArray(rawHighlights) && rawHighlights.length > 0) {
    blocks.push({
      type: 'key_concept',
      title: 'Key Highlights',
      summary: rawHighlights.join(' | ')
    });
  }

  // 1c. Table or Comparison Block if headers and rows exist
  if (raw.headers && raw.rows && raw.rows.length > 0) {
    blocks.push({
      type: 'comparison',
      title: raw.title,
      headers: raw.headers,
      rows: raw.rows
    });
  }

  // 2. Formulas if present
  if (raw.formulas && raw.formulas.length > 0) {
    for (const f of raw.formulas) {
      blocks.push({
        type: 'formula',
        latex: f,
        caption: 'Key Formula'
      });
    }
  }

  // 3. Bullet list or Worked Examples from raw.items
  if (raw.items && raw.items.length > 0) {
    if (raw.type === 'bullets' || typeof raw.items[0] === 'string') {
      blocks.push({
        type: 'bullet_list',
        items: raw.items.map((it: any) => typeof it === 'string' ? it : JSON.stringify(it))
      });
    } else {
      for (const it of raw.items) {
        blocks.push({
          type: 'worked_example',
          title: it.title || (it.q ? it.q.substring(0, 40) + '...' : 'Worked Example'),
          question: it.q || it.question || raw.title,
          given: it.given || [],
          method: it.method || 'Step-by-Step Solution Method',
          steps: [{ stepNumber: 1, explanation: (it.sol && it.sol.trim()) ? it.sol : (it.question || 'Standard step-by-step calculation.') }],
          answer: it.sol || it.answer || 'Calculation complete.'
        });
      }
    }
  }

  // 4. Worked Examples if explicit workedExamples array exists
  if (raw.workedExamples && raw.workedExamples.length > 0) {
    for (const ex of raw.workedExamples) {
      blocks.push({
        type: 'worked_example',
        title: ex.title || 'Worked Example',
        question: ex.question || raw.title,
        given: ex.given || [],
        method: ex.method || 'Standard Step-by-Step Solution Method',
        steps: ex.steps && ex.steps.length > 0 ? ex.steps : [
          { stepNumber: 1, explanation: 'Apply formula and calculate given values.' }
        ],
        answer: ex.answer || 'Calculation complete.'
      });
    }
  }

  // 4. Shortcuts / Key Concepts
  if (raw.shortcuts && raw.shortcuts.length > 0) {
    blocks.push({
      type: 'key_concept',
      title: 'Shortcuts & Calculation Tricks',
      summary: raw.shortcuts.join(' | ')
    });
  }

  // 5. Exam Traps
  if (raw.traps && raw.traps.length > 0) {
    blocks.push({
      type: 'exam_trap',
      title: 'Common Misconception & Calculation Trap',
      content: raw.traps.join(' | ')
    });
  }

  // If no blocks generated, emit fallback paragraph
  if (blocks.length === 0) {
    blocks.push({
      type: 'paragraph',
      content: `Content preserved for ${raw.title}.`
    });
  }

  return {
    id: raw.id,
    type: itemTypeMap[sourceSystem],
    domain: domain,
    title: raw.title,
    summary: `${sourceSystem} — ${raw.title}`,
    blocks: blocks,
    metadata: {
      exam: ['Bank PO', 'RBI Grade B', 'SBI PO'],
      tags: [sourceSystem.toLowerCase(), raw.category || 'general'],
      category: sourceSystem,
      difficulty: 'intermediate',
      lastUpdated: nowISO,
      provenance: {
        sourceSystem: sourceSystem,
        sourceFile: sourceFile,
        sourceId: raw.realSourceId || itemId,
        sourceTitle: raw.title,
        sourceChecksum: sourceChecksum,
        migrationTimestamp: nowISO,
        normalizationRuleVersion: '1.0.0-phase4-corrected'
      }
    }
  };
}
