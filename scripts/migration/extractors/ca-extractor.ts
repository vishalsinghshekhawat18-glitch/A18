import crypto from 'node:crypto';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';

export interface RawCANote {
  id: string;
  realSourceId?: string;
  secId: string;
  title: string;
  date: string;
  hook: string;
  bullets: string[];
  staticGk?: string;
  trap?: string;
  interviewQ?: string;
  tier?: string;
  miniGrid?: {
    headers: string[];
    rows: string[][];
  };
}

export function transformCANoteToKnowledgeItem(raw: RawCANote, rawSourcePayload?: any): KnowledgeItem {
  const payloadToHash = rawSourcePayload || raw;
  const sourceChecksum = crypto.createHash('sha256').update(JSON.stringify(payloadToHash)).digest('hex');
  const nowISO = new Date().toISOString();

  const blocks: SemanticBlock[] = [];

  // 1. Headline summary paragraph
  if (raw.hook) {
    blocks.push({
      type: 'paragraph',
      content: raw.hook
    });
  }

  // 2. Core Key Takeaways Bullet List
  if (raw.bullets && raw.bullets.length > 0) {
    blocks.push({
      type: 'bullet_list',
      items: raw.bullets
    });
  }

  // 3. Structured miniGrid Table / Comparison Block
  if (raw.miniGrid && raw.miniGrid.headers && raw.miniGrid.rows) {
    blocks.push({
      type: 'comparison',
      title: 'Key Details & Regulatory Matrix',
      headers: raw.miniGrid.headers,
      rows: raw.miniGrid.rows
    });
  }

  // 4. Static Background & GK Key Concept Block
  if (raw.staticGk && raw.staticGk.trim()) {
    blocks.push({
      type: 'key_concept',
      title: 'Static Background & GK Context',
      summary: raw.staticGk.trim()
    });
  }

  // 5. Exam Trap Warning Block
  if (raw.trap && raw.trap.trim()) {
    blocks.push({
      type: 'exam_trap',
      title: 'Exam Trap & Statutory Distinction',
      content: raw.trap.trim()
    });
  }

  // 6. Interview Question Callout if present
  if (raw.interviewQ && raw.interviewQ.trim()) {
    blocks.push({
      type: 'quote',
      quote: `Interview Focus Question: ${raw.interviewQ.trim()}`,
      author: 'Banking & Regulatory Board Panel'
    });
  }

  return {
    id: raw.id,
    type: 'ca_note',
    domain: 'current-affairs',
    title: raw.title,
    summary: (raw.hook && raw.hook.trim()) ? raw.hook : raw.title,
    blocks: blocks,
    metadata: {
      exam: ['RBI Grade B', 'NABARD Grade A', 'SBI PO'],
      tags: [raw.secId, 'Current Affairs 2026'],
      date: raw.date,
      category: raw.secId.toUpperCase(),
      difficulty: 'intermediate',
      lastUpdated: nowISO,
      provenance: {
        sourceSystem: 'CA',
        sourceFile: 'ca_app/data.js',
        sourceId: raw.realSourceId || raw.id,
        sourceTitle: raw.title,
        sourceChecksum: sourceChecksum,
        migrationTimestamp: nowISO,
        normalizationRuleVersion: '1.0.0-phase4'
      }
    }
  };
}
