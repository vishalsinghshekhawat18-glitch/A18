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
    id: 'iibf-regulations',
    title: 'IIBF & Banking Regulations',
    icon: '🏛️',
    surfaceBadge: 'Master Compendium',
    description: 'Deposit Operations, Credit Risk & ECL, Liquidity LMF, Digital Banking, ESG & Capital Markets.'
  },
  {
    id: 'economics',
    title: 'Economics',
    icon: '📚',
    surfaceBadge: 'Book Chapter Reader',
    description: 'Core Macroeconomics, Banking System, Monetary Policy & Fiscal Trajectories.'
  },
  {
    id: 'english',
    title: 'English Language',
    icon: '✍️',
    surfaceBadge: 'Book Chapter Reader',
    description: 'Descriptive Writing, Essay Structure, Letter Drafting, Grammar & Comprehension.'
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
  const tags = item.metadata?.tags || [];

  if (subjectId === 'iibf-regulations') {
    return item.domain === 'iibf-regulations' || item.id.startsWith('iibf-') || tags.includes('iibf');
  }
  if (subjectId === 'economics') {
    return (sys === 'Core' && (item.domain === 'economics' || item.id.includes('eco-ch'))) || tags.includes('economics');
  }
  if (subjectId === 'english') return item.domain === 'english' || item.id.includes('eng-ch') || item.id.includes('english');
  if (subjectId === 'polity') return sys === 'Core' && (item.domain === 'polity' || item.id.includes('pol-ch'));
  if (subjectId === 'history') return sys === 'Core' && (item.domain === 'history' || item.id.includes('his-ch'));
  if (subjectId === 'geography') return sys === 'Core' && (item.domain === 'geography' || item.id.includes('geo-ch'));
  if (subjectId === 'science') return sys === 'Core' && (item.domain === 'science' || item.id.includes('sci-ch'));
  if (subjectId === 'revision') {
    return (sys === 'Core' && (item.domain === 'revision' || item.id.includes('rev-ch'))) || tags.includes('revision');
  }
  if (subjectId === 'current-affairs') return sys === 'CA' || (item.domain === 'current-affairs' && sys !== 'Schemes' && !item.id.includes('schemes-scheme'));
  if (subjectId === 'schemes') return sys === 'Schemes' || item.id.includes('schemes-scheme') || tags.includes('schemes');
  if (subjectId === 'static-ga') return sys === 'StaticGA' || item.domain === 'static-ga' || tags.includes('static-ga');
  if (subjectId === 'quant') return sys === 'Quant' || (item.domain === 'quant' && sys !== 'PYQs');
  if (subjectId === 'pyqs') return sys === 'PYQs' || item.domain === 'pyqs';
  return false;
}

export interface CASectionDef {
  secId: string;
  title: string;
  emoji: string;
}

export const CA_SECTION_DEFS: CASectionDef[] = [
  { secId: 'SEC1', title: 'ESI, Finance & Business News', emoji: '📈' },
  { secId: 'SEC2', title: 'Regulatory Bodies News', emoji: '🏛️' },
  { secId: 'SEC3', title: 'Banking & Insurance News', emoji: '💳' },
  { secId: 'SEC4', title: 'National, State & International News', emoji: '🌐' },
  { secId: 'SEC5', title: 'MoUs, Conferences & Appointments', emoji: '🤝' },
  { secId: 'SEC6', title: 'Science, Technology, Defence & Sports', emoji: '🚀' },
  { secId: 'SEC7', title: 'Awards, Books, Indices & Rankings', emoji: '🏆' },
  { secId: 'SEC8', title: 'Important Days & Persons in News', emoji: '📅' },
  { secId: 'SEC9', title: 'PIB, Circulars & Notifications', emoji: '📜' },
  { secId: 'SEC10', title: 'Miscellaneous - Govt Schemes & Static', emoji: '🎯' },
  { secId: 'SEC11', title: 'Rapid Revision', emoji: '⚡' }
];

export interface CASectionGroup {
  secId: string;
  title: string;
  emoji: string;
  items: KnowledgeItem[];
}

export interface CAMonthGroup {
  monthKey: string;
  monthLabel: string;
  items: KnowledgeItem[];
  sections: CASectionGroup[];
}

export function groupCAItemsByMonth(caItems: KnowledgeItem[]): CAMonthGroup[] {
  const groupsMap = new Map<string, { label: string; items: KnowledgeItem[] }>();

  for (const item of caItems) {
    const dateStr = item.metadata?.date || '';
    let monthKey = '9999-99';
    let monthLabel = 'OTHER BRIEFINGS';

    if (dateStr && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [y, m] = dateStr.split('-');
      monthKey = `${y}-${m}`;
      const dObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
      const mName = dObj.toLocaleString('en-US', { month: 'long' });
      monthLabel = `${mName.toUpperCase()} ${y}`;
    }

    if (!groupsMap.has(monthKey)) {
      groupsMap.set(monthKey, { label: monthLabel, items: [] });
    }
    groupsMap.get(monthKey)!.items.push(item);
  }

  // Sort keys descending (newest month first: 2026-08, 2026-07, 2026-06...)
  const sortedKeys = Array.from(groupsMap.keys()).sort((a, b) => b.localeCompare(a));

  return sortedKeys.map(key => {
    const group = groupsMap.get(key)!;

    // Group items inside this month by Section (SEC1 .. SEC11)
    const secMap = new Map<string, KnowledgeItem[]>();
    for (const item of group.items) {
      const cat = (item.metadata?.category || 'SEC10').toUpperCase();
      if (!secMap.has(cat)) {
        secMap.set(cat, []);
      }
      secMap.get(cat)!.push(item);
    }

    const sections: CASectionGroup[] = [];
    for (const secDef of CA_SECTION_DEFS) {
      const secItems = secMap.get(secDef.secId.toUpperCase());
      if (secItems && secItems.length > 0) {
        // Sort items chronologically within section (latest date first)
        const sortedSecItems = [...secItems].sort((a, b) => {
          const dA = a.metadata?.date || '';
          const dB = b.metadata?.date || '';
          return dB.localeCompare(dA);
        });
        sections.push({
          secId: secDef.secId,
          title: secDef.title,
          emoji: secDef.emoji,
          items: sortedSecItems
        });
      }
    }

    // Unmapped categories into SEC10
    const knownSecIds = new Set(CA_SECTION_DEFS.map(s => s.secId.toUpperCase()));
    const unmappedItems: KnowledgeItem[] = [];
    for (const [catKey, itemsList] of secMap.entries()) {
      if (!knownSecIds.has(catKey)) {
        unmappedItems.push(...itemsList);
      }
    }
    if (unmappedItems.length > 0) {
      let miscSec = sections.find(s => s.secId === 'SEC10');
      if (!miscSec) {
        miscSec = {
          secId: 'SEC10',
          title: 'Miscellaneous - Govt Schemes & Static',
          emoji: '🎯',
          items: []
        };
        sections.push(miscSec);
      }
      miscSec.items.push(...unmappedItems);
    }

    const flatOrderedItems = sections.flatMap(s => s.items);

    return {
      monthKey: key,
      monthLabel: group.label,
      items: flatOrderedItems,
      sections
    };
  });
}
