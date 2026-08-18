import React from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { useUserStudyState } from '../intelligence/userStateStore';
import { computeSubjectCoverage } from '../intelligence/deriveCoverage';

interface Props {
  subjectId: string;
  items: KnowledgeItem[];
  onBackHome: () => void;
  onSelectItem: (itemId: string) => void;
}

// Subject display metadata mapping
const SUBJECT_METADATA: Record<string, { title: string; icon: string; badge: string; desc: string }> = {
  'economics': { title: 'Economics', icon: '📚', badge: 'Book Chapter Reader', desc: 'Core Economics Chapters & Financial System Notes.' },
  'english': { title: 'English Language', icon: '✍️', badge: 'Book Chapter Reader', desc: 'Descriptive Essay Writing, Letter Drafting Formats & Grammar.' },
  'polity': { title: 'Polity & Governance', icon: '⚖️', badge: 'Book Chapter Reader', desc: 'Constitutional Acts, Statutory Bodies & ECI.' },
  'history': { title: 'History & Culture', icon: '📜', badge: 'Book Chapter Reader', desc: 'Freedom Struggle, Regional Movements & Culture.' },
  'geography': { title: 'Geography & Environment', icon: '🌍', badge: 'Book Chapter Reader', desc: 'Atmospheric Composition & Physical Geography.' },
  'science': { title: 'Science & Bio-Tech', icon: '🔬', badge: 'Book Chapter Reader', desc: 'CRISPR-Cas9, Recombinant DNA & Bio-Tech.' },
  'revision': { title: 'Rapid Revision Traps', icon: '⚡', badge: 'Book Chapter Reader', desc: 'High-Yield Trap Summaries & Exam Reminders.' },
  'current-affairs': { title: 'Current Affairs', icon: '📰', badge: 'Briefing Feed Stream', desc: 'Daily Banking & Financial CA Briefings stacked by Month.' },
  'schemes': { title: 'Government Schemes', icon: '🏛️', badge: 'Reference Grid', desc: 'Central Welfare Schemes, Ministries & Guidelines.' },
  'static-ga': { title: 'Static GA Superbook', icon: '📌', badge: 'Reference Sheet', desc: 'Regulatory Bodies (RBI, SEBI) & Base Year Stats.' },
  'quant': { title: 'Quant & Reasoning', icon: '📐', badge: 'Problem Studio', desc: 'Core Formulas, Mensuration & Worked Examples.' },
  'pyqs': { title: 'Previous Year Questions', icon: '🎓', badge: 'Practice Cards', desc: 'Memory PYQs from Bank PO & RBI Grade B Exams.' }
};

export const SubjectHubView: React.FC<Props> = ({
  subjectId,
  items,
  onBackHome,
  onSelectItem
}) => {
  const { state: userStudyState, isCompleted } = useUserStudyState();

  const meta = SUBJECT_METADATA[subjectId] || {
    title: subjectId.toUpperCase(),
    icon: '🏛️',
    badge: 'Study Surface',
    desc: 'Available migrated items for this subject.'
  };

  // State for nested English toggles
  const [collapsedParts, setCollapsedParts] = React.useState<Record<string, boolean>>({});
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});

  const togglePart = (partKey: string) => {
    setCollapsedParts(prev => ({ ...prev, [partKey]: !prev[partKey] }));
  };

  const toggleSection = (secKey: string) => {
    setCollapsedSections(prev => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  // Filter items matching this subject
  const subjectItems = items.filter(i => {
    if (subjectId === 'economics') return i.domain === 'economics' || i.id.includes('eco-ch');
    if (subjectId === 'english') return i.domain === 'english' || i.id.includes('eng-ch') || i.id.includes('english');
    if (subjectId === 'polity') return i.domain === 'polity' || i.id.includes('pol-ch');
    if (subjectId === 'history') return i.domain === 'history' || i.id.includes('his-ch');
    if (subjectId === 'geography') return i.domain === 'geography' || i.id.includes('geo-ch');
    if (subjectId === 'science') return i.domain === 'science' || i.id.includes('sci-ch');
    if (subjectId === 'revision') return i.domain === 'revision' || i.id.includes('rev-ch');
    if (subjectId === 'current-affairs') return i.domain === 'current-affairs' && !i.id.includes('scheme');
    if (subjectId === 'schemes') return i.id.includes('scheme');
    if (subjectId === 'static-ga') return i.domain === 'static-ga' || i.id.includes('static');
    if (subjectId === 'quant') return i.domain === 'quant' && !i.id.includes('pyq');
    if (subjectId === 'pyqs') return i.domain === 'pyqs' || i.id.includes('pyq');
    return i.domain === subjectId;
  });

  // Calculate genuine subject coverage
  const coverage = computeSubjectCoverage(items, subjectId, userStudyState.completedItemIds);

  // Current Affairs Month-First Grouping
  const isCA = subjectId === 'current-affairs';
  const caAugust = subjectItems.filter(i => i.metadata?.date?.startsWith('2026-08') || i.title.includes('August') || i.title.includes('July 2026') || !i.metadata?.date);
  const caJuly = subjectItems.filter(i => i.metadata?.date?.startsWith('2026-07'));
  const caJune = subjectItems.filter(i => i.metadata?.date?.startsWith('2026-06'));

  // English Part > Section > Chapter Grouping
  const isEnglish = subjectId === 'english';
  const englishPartsMap: Record<string, Record<string, KnowledgeItem[]>> = {};

  if (isEnglish) {
    subjectItems.forEach(item => {
      const part = item.metadata?.part || 'Part I - Writing';
      const sec = item.metadata?.section || 'Section A - Essay Writing';
      if (!englishPartsMap[part]) englishPartsMap[part] = {};
      if (!englishPartsMap[part][sec]) englishPartsMap[part][sec] = [];
      englishPartsMap[part][sec].push(item);
    });
  }

  return (
    <div className="subject-hub-view">
      <div className="subject-hub-container">
        {/* Navigation Breadcrumb */}
        <div className="hub-breadcrumb">
          <button className="btn-back-home" onClick={onBackHome}>
            ← Back to Command Center
          </button>
        </div>

        {/* Hub Header */}
        <header className="hub-header">
          <div className="hub-badge-row">
            <span className="hub-icon">{meta.icon}</span>
            <span className="hub-surface-badge">{meta.badge}</span>
            <span className="hub-count-chip">
              {coverage.completedCount} / {coverage.totalCount} Completed ({coverage.coveragePct}%)
            </span>
          </div>

          <h1 className="hub-title">{meta.title} Hub</h1>
          <p className="hub-desc">{meta.desc}</p>
        </header>

        {/* English Part > Section > Chapter Accordion Structure */}
        {isEnglish ? (
          <div className="english-nested-hub">
            {Object.entries(englishPartsMap).map(([partName, sectionsMap]) => {
              const isPartCollapsed = !!collapsedParts[partName];
              return (
                <div key={partName} className="english-part-accordion">
                  <div
                    className="english-part-header collapsible-header"
                    onClick={() => togglePart(partName)}
                    title={isPartCollapsed ? "Click to expand Part" : "Click to collapse Part"}
                  >
                    <div className="english-part-title-group">
                      <span className="english-part-icon">📌</span>
                      <h2 className="english-part-title">{partName}</h2>
                    </div>
                    <span className="collapsible-indicator">{isPartCollapsed ? '▸' : '▾'}</span>
                  </div>

                  {!isPartCollapsed && (
                    <div className="english-part-body">
                      {Object.entries(sectionsMap).map(([secName, secItems]) => {
                        const isSecCollapsed = !!collapsedSections[secName];
                        return (
                          <div key={secName} className="english-sec-accordion">
                            <div
                              className="english-sec-header collapsible-header"
                              onClick={() => toggleSection(secName)}
                              title={isSecCollapsed ? "Click to expand Section" : "Click to collapse Section"}
                            >
                              <div className="english-sec-title-group">
                                <span className="english-sec-icon">📝</span>
                                <h3 className="english-sec-title">{secName}</h3>
                                <span className="english-sec-count">{secItems.length} {secItems.length === 1 ? 'Chapter' : 'Chapters'}</span>
                              </div>
                              <span className="collapsible-indicator">{isSecCollapsed ? '▸' : '▾'}</span>
                            </div>

                            {!isSecCollapsed && (
                              <div className="hub-items-list" style={{ marginTop: '0.8rem' }}>
                                {secItems.map((item, idx) => (
                                  <div
                                    key={item.id}
                                    className="hub-item-card"
                                    onClick={() => onSelectItem(item.id)}
                                  >
                                    <div className="hub-item-index">#{idx + 1}</div>
                                    <div className="hub-item-content">
                                      <h3 className="hub-item-title">{item.title}</h3>
                                      {item.summary && <p className="hub-item-summary">{item.summary}</p>}
                                      <div className="hub-item-meta">
                                        {isCompleted(item.id) && (
                                          <span className="tag-pill bold-pill" style={{ background: '#2e7d32', color: '#ffffff', borderColor: '#2e7d32' }}>
                                            ✓ Completed
                                          </span>
                                        )}
                                        <span className="tag-pill">{secName}</span>
                                        <span className="tag-pill">ID: {item.id}</span>
                                      </div>
                                    </div>
                                    <div className="hub-item-arrow">Study Chapter →</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : isCA ? (
          /* Month-First Architecture for Current Affairs */
          <div className="ca-month-hub-grid">
            <div className="ca-month-card">
              <div className="ca-month-header">
                <span className="ca-month-title">📅 August 2026 Briefings</span>
                <span className="ca-month-count">{caAugust.length > 0 ? caAugust.length : subjectItems.length} Briefings</span>
              </div>
              <div className="hub-items-list" style={{ marginTop: '1rem' }}>
                {(caAugust.length > 0 ? caAugust : subjectItems).map((item, idx) => (
                  <div
                    key={item.id}
                    className="hub-item-card"
                    onClick={() => onSelectItem(item.id)}
                  >
                    <div className="hub-item-index">#{idx + 1}</div>
                    <div className="hub-item-content">
                      <h3 className="hub-item-title">{item.title}</h3>
                      {item.summary && <p className="hub-item-summary">{item.summary}</p>}
                      <div className="hub-item-meta">
                        {isCompleted(item.id) && (
                          <span className="tag-pill bold-pill" style={{ background: '#2e7d32', color: '#ffffff', borderColor: '#2e7d32' }}>
                            ✓ Completed
                          </span>
                        )}
                        {item.metadata?.date && <span className="tag-pill">📅 {item.metadata.date}</span>}
                        {item.metadata?.category && <span className="tag-pill">{item.metadata.category}</span>}
                      </div>
                    </div>
                    <div className="hub-item-arrow">Open Briefing →</div>
                  </div>
                ))}
              </div>
            </div>

            {caJuly.length > 0 && (
              <div className="ca-month-card">
                <div className="ca-month-header">
                  <span className="ca-month-title">📅 July 2026 Briefings</span>
                  <span className="ca-month-count">{caJuly.length} Briefings</span>
                </div>
              </div>
            )}

            {caJune.length > 0 && (
              <div className="ca-month-card">
                <div className="ca-month-header">
                  <span className="ca-month-title">📅 June 2026 Briefings</span>
                  <span className="ca-month-count">{caJune.length} Briefings</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* General Items List for Core, Schemes, Static GA, Quant, PYQs */
          <div className="hub-items-list">
            {subjectItems.map((item, idx) => (
              <div
                key={item.id}
                className="hub-item-card"
                onClick={() => onSelectItem(item.id)}
              >
                <div className="hub-item-index">#{idx + 1}</div>
                <div className="hub-item-content">
                  <h3 className="hub-item-title">{item.title}</h3>
                  {item.summary && <p className="hub-item-summary">{item.summary}</p>}
                  <div className="hub-item-meta">
                    {isCompleted(item.id) && (
                      <span className="tag-pill bold-pill" style={{ background: '#2e7d32', color: '#ffffff', borderColor: '#2e7d32' }}>
                        ✓ Completed
                      </span>
                    )}
                    {item.metadata?.date && <span className="tag-pill">📅 {item.metadata.date}</span>}
                    {item.metadata?.category && <span className="tag-pill">{item.metadata.category}</span>}
                    <span className="tag-pill">ID: {item.id}</span>
                  </div>
                </div>
                <div className="hub-item-arrow">Study →</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
