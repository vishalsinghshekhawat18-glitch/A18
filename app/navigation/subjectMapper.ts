import { KnowledgeItem } from '../../schema/knowledge-item';

export interface SubjectDef {
  id: string;
  title: string;
  icon: string;
  surfaceBadge: string;
  description: string;
}

export const SUBJECT_DEFS: SubjectDef[] = [
  {
    id: 'economics',
    title: 'Economics',
    icon: '📚',
    surfaceBadge: 'Book Chapter Reader',
    description: 'Core Macroeconomics, Banking System, Monetary Policy & Fiscal Trajectories.'
  },
  {
    id: 'polity',
    title: 'Polity & Governance',
    icon: '⚖️',
    surfaceBadge: 'Book Chapter Reader',
    description: 'Constitutional Acts, Statutory Bodies, ECI & Parliamentary Governance.'
  },
  {
    id: 'history',
    title: 'History & Culture',
    icon: '📜',
    surfaceBadge: 'Book Chapter Reader',
    description: 'Freedom Struggle, Regional Movements, Ancient & Medieval Indian History.'
  },
  {
    id: 'geography',
    title: 'Geography & Environment',
    icon: '🌍',
    surfaceBadge: 'Book Chapter Reader',
    description: 'Atmospheric Science, Physical Geography & Environmental Policy.'
  },
  {
    id: 'science',
    title: 'Science & Bio-Tech',
    icon: '🔬',
    surfaceBadge: 'Book Chapter Reader',
    description: 'CRISPR-Cas9, Recombinant DNA, Gene Editing & Frontier Science.'
  },
  {
    id: 'revision',
    title: 'Rapid Revision Traps',
    icon: '⚡',
    surfaceBadge: 'Book Chapter Reader',
    description: 'High-Yield Exam Trap Summaries & Memory Retention Notes.'
  },
  {
    id: 'current-affairs',
    title: 'Current Affairs',
    icon: '📰',
    surfaceBadge: 'Briefing Feed',
    description: 'Daily Banking & Financial CA Briefings stacked by Month.'
  },
  {
    id: 'schemes',
    title: 'Government Schemes',
    icon: '🏛️',
    surfaceBadge: 'Reference Grid',
    description: 'Central Welfare Schemes, Nodal Ministries, Outlays & Eligibility.'
  },
  {
    id: 'static-ga',
    title: 'Static GA Superbook',
    icon: '📌',
    surfaceBadge: 'Reference Sheet',
    description: 'Regulatory Apex Bodies (RBI, SEBI), Base Years & Policy Stats.'
  },
  {
    id: 'quant',
    title: 'Quant & Reasoning',
    icon: '📐',
    surfaceBadge: 'Problem Studio',
    description: 'Core Formulas, Mensuration, Shortcuts & Step-by-Step Worked Methods.'
  },
  {
    id: 'pyqs',
    title: 'Previous Year Questions',
    icon: '🎓',
    surfaceBadge: 'Practice Cards',
    description: 'Memory PYQs from RBI Grade B, SBI PO & IBPS PO Exams.'
  }
];

export function isItemInSubject(item: KnowledgeItem, subjectId: string): boolean {
  const sys = item.metadata?.provenance?.sourceSystem;
  if (subjectId === 'economics') return sys === 'Core' && (item.domain === 'economics' || item.id.includes('eco-ch'));
  if (subjectId === 'polity') return sys === 'Core' && (item.domain === 'polity' || item.id.includes('pol-ch'));
  if (subjectId === 'history') return sys === 'Core' && (item.domain === 'history' || item.id.includes('his-ch'));
  if (subjectId === 'geography') return sys === 'Core' && (item.domain === 'geography' || item.id.includes('geo-ch'));
  if (subjectId === 'science') return sys === 'Core' && (item.domain === 'science' || item.id.includes('sci-ch'));
  if (subjectId === 'revision') return sys === 'Core' && (item.domain === 'revision' || item.id.includes('rev-ch'));
  if (subjectId === 'current-affairs') return sys === 'CA' || (item.domain === 'current-affairs' && sys !== 'Schemes' && !item.id.includes('schemes-scheme'));
  if (subjectId === 'schemes') return sys === 'Schemes' || item.id.includes('schemes-scheme');
  if (subjectId === 'static-ga') return sys === 'StaticGA' || item.domain === 'static-ga';
  if (subjectId === 'quant') return sys === 'Quant' || (item.domain === 'quant' && sys !== 'PYQs');
  if (subjectId === 'pyqs') return sys === 'PYQs' || item.domain === 'pyqs';
  return false;
}
