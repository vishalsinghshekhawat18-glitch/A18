import React, { useMemo, useState } from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { useUserStudyState } from '../intelligence/userStateStore';
import { computeSubjectCoverage } from '../intelligence/deriveCoverage';
import { groupCAItemsByMonth } from '../navigation/subjectMapper';

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
  'current-affairs': { title: 'Current Affairs', icon: '📰', badge: 'Briefing Feed Stream', desc: 'Monthly Exam-Oriented High-Density Revision Briefings.' },
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
  const [collapsedParts, setCollapsedParts] = useState<Record<string, boolean>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [selectedCAMonth, setSelectedCAMonth] = useState<string>('all');

  const togglePart = (partKey: string) => {
    setCollapsedParts(prev => ({ ...prev, [partKey]: !prev[partKey] }));
  };

  const toggleSection = (secKey: string) => {
    setCollapsedSections(prev => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  // Filter items matching this subject
  const subjectItems = useMemo(() => {
    return items.filter(i => {
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
  }, [items, subjectId]);

  // Calculate genuine subject coverage
  const coverage = computeSubjectCoverage(items, subjectId, userStudyState.completedItemIds);

  // Current Affairs Dynamic Month & Section Hierarchy
  const isCA = subjectId === 'current-affairs';
  const caMonthGroups = useMemo(() => {
    if (!isCA) return [];
    return groupCAItemsByMonth(subjectItems);
  }, [isCA, subjectItems]);

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

  // Filtered CA groups based on selected month
  const displayedCAGroups = useMemo(() => {
    if (selectedCAMonth === 'all') return caMonthGroups;
    return caMonthGroups.filter(g => g.monthKey === selectedCAMonth);
  }, [caMonthGroups, selectedCAMonth]);

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

          {/* Current Affairs Month Selector Pills */}
          {isCA && caMonthGroups.length > 0 && (
            <div className="ca-month-pills" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
              <button
                className={`tag-pill ${selectedCAMonth === 'all' ? 'bold-pill' : ''}`}
                style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: selectedCAMonth === 'all' ? 'var(--primary, #1e3a8a)' : undefined, color: selectedCAMonth === 'all' ? '#fff' : undefined }}
                onClick={() => setSelectedCAMonth('all')}
              >
                🗓️ All Months ({subjectItems.length})
              </button>
              {caMonthGroups.map(group => (
                <button
                  key={group.monthKey}
                  className={`tag-pill ${selectedCAMonth === group.monthKey ? 'bold-pill' : ''}`}
                  style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: selectedCAMonth === group.monthKey ? 'var(--primary, #1e3a8a)' : undefined, color: selectedCAMonth === group.monthKey ? '#fff' : undefined }}
                  onClick={() => setSelectedCAMonth(group.monthKey)}
                >
                  📅 {group.monthLabel} ({group.items.length})
                </button>
              ))}
            </div>
          )}
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
          /* Dynamic Month & Section Architecture for Current Affairs */
          <div className="ca-dynamic-month-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {displayedCAGroups.map(group => (
              <div key={group.monthKey} id={`month-section-${group.monthKey}`} className="ca-month-card" style={{ padding: '1.5rem', background: 'var(--bg-surface, #ffffff)', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="ca-month-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color, #e2e8f0)', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                  <h2 className="ca-month-title" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                    📅 {group.monthLabel} Briefings
                  </h2>
                  <span className="tag-pill bold-pill" style={{ background: 'var(--accent-bg, #e0e7ff)', color: 'var(--accent-text, #3730a3)', fontWeight: 700 }}>
                    {group.items.length} Knowledge Units
                  </span>
                </div>

                {/* Section-wise render inside Month */}
                <div className="ca-month-sections" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {group.sections.map(secGroup => (
                    <div key={secGroup.secId} id={`sec-${group.monthKey}-${secGroup.secId}`} className="ca-section-block">
                      <div className="ca-section-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{secGroup.emoji}</span>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-secondary, #334155)' }}>
                          {secGroup.title} ({secGroup.items.length})
                        </h3>
                      </div>

                      <div className="hub-items-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                        {secGroup.items.map((item, idx) => (
                          <div
                            key={item.id}
                            className="hub-item-card"
                            onClick={() => onSelectItem(item.id)}
                            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '8px', border: '1px solid var(--card-border, #cbd5e1)' }}
                          >
                            <div className="hub-item-content">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <span className="hub-item-index" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>#{idx + 1}</span>
                                {(item.metadata as any)?.relevanceTier && (
                                  <span className={`tag-pill ${(item.metadata as any).relevanceTier === 'TIER_A' ? 'bold-pill' : ''}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', background: (item.metadata as any).relevanceTier === 'TIER_A' ? '#fee2e2' : '#f1f5f9', color: (item.metadata as any).relevanceTier === 'TIER_A' ? '#991b1b' : '#475569' }}>
                                    {(item.metadata as any).relevanceTier}
                                  </span>
                                )}
                              </div>
                              <h4 className="hub-item-title" style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.4rem 0', lineHeight: 1.4 }}>
                                {item.title}
                              </h4>
                              {item.summary && (
                                <p className="hub-item-summary" style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.8rem 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {item.summary}
                                </p>
                              )}
                            </div>
                            <div className="hub-item-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.6rem', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                              {isCompleted(item.id) ? (
                                <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ Completed</span>
                              ) : (
                                <span style={{ color: '#2563eb', fontWeight: 600 }}>Study Unit →</span>
                              )}
                              <span style={{ color: '#94a3b8' }}>ID: {item.id}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
