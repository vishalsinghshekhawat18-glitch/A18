import crypto from 'node:crypto';
import { KnowledgeItem, SemanticBlock, Domain } from '../../../schema/knowledge-item';

export interface RawCoreChapter {
  id: string;
  chNum: number;
  subject: string;
  subjectName: string;
  book: string;
  title: string;
  readTime?: string;
  examTags?: string;
  truth?: string;
  body: string;
}

export function transformCoreChapterToKnowledgeItem(raw: RawCoreChapter): KnowledgeItem {
  const sourceChecksum = crypto.createHash('sha256').update(JSON.stringify(raw)).digest('hex');
  const nowISO = new Date().toISOString();

  const domainMap: Record<string, Domain> = {
    economics: 'economics',
    polity: 'polity',
    history: 'history',
    geography: 'geography',
    science: 'science',
    revision: 'revision'
  };

  const domain: Domain = domainMap[raw.subject.toLowerCase()] || 'economics';

  const blocks: SemanticBlock[] = [];

  // 1. First-principles summary key concept block if truth summary exists
  if (raw.truth && raw.truth.trim()) {
    blocks.push({
      type: 'key_concept',
      title: 'First-Principles Core Truth',
      summary: raw.truth.trim()
    });
  }

  // 2. Parse body HTML into semantic blocks deterministically
  const rawBody = raw.body || '';

  // Extract MathJax formulas if present: \(...\) or \[...\]
  const mathRegex = /\\\\\(([\s\S]*?)\\\\\)|\\\\\[([\s\S]*?)\\\\\]/gi;
  let mathMatch;
  while ((mathMatch = mathRegex.exec(rawBody)) !== null) {
    const latex = (mathMatch[1] || mathMatch[2]).trim();
    if (latex) {
      blocks.push({
        type: 'formula',
        latex: latex,
        caption: 'Core Mathematical Formulation'
      });
    }
  }

  // Extract Mindmap / Section nodes cleanly
  // Clean HTML tags to extract structured paragraphs and headings
  const cleanBodyText = rawBody
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<h1[\s\S]*?>(.*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[\s\S]*?>(.*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[\s\S]*?>(.*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<div class=["'][^"']*mindmap-node[^"']*["'][\s\S]*?>(.*?)<\/div>/gi, '\n### Key Node: $1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');

  const paragraphs = cleanBodyText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  for (const p of paragraphs) {
    if (p.startsWith('# ')) {
      blocks.push({ type: 'heading', level: 1, text: p.substring(2).trim() });
    } else if (p.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, text: p.substring(3).trim() });
    } else if (p.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, text: p.substring(4).trim() });
    } else {
      blocks.push({ type: 'paragraph', content: p });
    }
  }

  // Tags array
  const tagsArr = raw.examTags
    ? raw.examTags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return {
    id: raw.id,
    type: 'chapter',
    domain: domain,
    title: raw.title,
    summary: raw.truth || `${raw.subjectName} — Chapter ${raw.chNum}`,
    blocks: blocks.length > 0 ? blocks : [{ type: 'paragraph', content: 'Chapter content preserved.' }],
    metadata: {
      exam: ['UPSC', 'RBI Grade B'],
      tags: tagsArr,
      category: raw.book,
      difficulty: 'intermediate',
      lastUpdated: nowISO,
      provenance: {
        sourceSystem: 'Core',
        sourceFile: 'index.html (rawBookData)',
        sourceId: raw.id,
        sourceTitle: raw.title,
        sourceChecksum: sourceChecksum,
        migrationTimestamp: nowISO,
        normalizationRuleVersion: '1.0.0-phase4'
      }
    }
  };
}
