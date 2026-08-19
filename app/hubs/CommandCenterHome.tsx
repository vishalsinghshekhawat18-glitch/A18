import React, { useMemo, useState } from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { SUBJECT_DEFS, isItemInSubject } from '../navigation/subjectMapper';
import reportingDataJson from '../../content/reporting-center.json';
import { useUserStudyState } from '../intelligence/userStateStore';
import { computeSubjectCoverage } from '../intelligence/deriveCoverage';

interface Props {
  items: KnowledgeItem[];
  lastOpenedItemId: string | null;
  onSelectSubject: (subjectId: string) => void;
  onSelectItem: (itemId: string) => void;
}

export const CommandCenterHome: React.FC<Props> = ({
  items,
  lastOpenedItemId,
  onSelectSubject,
  onSelectItem
}) => {
  const { state: userStudyState } = useUserStudyState();
  const [isReportingCollapsed, setIsReportingCollapsed] = useState(false);
  // Resolve last opened item for Continue Studying card
  const lastItem = lastOpenedItemId ? items.find(i => i.id === lastOpenedItemId) : null;

  // Dynamic time-aware greeting with time-of-day icon
  const { greeting, greetingIcon } = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) return { greeting: 'Good morning', greetingIcon: '🌅' };
    if (hours >= 12 && hours < 17) return { greeting: 'Good afternoon', greetingIcon: '☀️' };
    if (hours >= 17 && hours < 22) return { greeting: 'Good evening', greetingIcon: '🌆' };
    return { greeting: 'Late night session', greetingIcon: '🌙' };
  }, []);

  // Compute dynamic age counter from DOB (format: YY.MM)
  const ageCounter = useMemo(() => {
    const dobStr: string = (reportingDataJson as any).dob || '1996-10-31';
    const [dobY, dobM, dobD] = dobStr.split('-').map(Number);
    const dob = new Date(dobY, dobM - 1, dobD);
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    if (now.getDate() < dob.getDate()) months -= 1;
    if (months < 0) { years -= 1; months += 12; }
    const mStr = months < 10 ? `0${months}` : `${months}`;
    return `${years}.${mStr}`;
  }, []);

  // Derive exam target countdown from structured examTargets data
  const examCountdown = useMemo(() => {
    const targets: Array<{ name: string; date: string | null; priority: string }> =
      (reportingDataJson as any).examTargets || [];
    const primary = targets.find(t => t.priority === 'primary');
    if (!primary) return null;
    if (!primary.date) return { name: primary.name, label: 'Date TBD', days: null };
    
    const [y, m, d] = primary.date.split('-').map(Number);
    if (!y || !m || !d) return { name: primary.name, label: 'Date TBD', days: null };
    
    const examDate = new Date(y, m - 1, d);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffMs = examDate.getTime() - today.getTime();
    const days = Math.round(diffMs / 86400000);
    
    if (days < 0) return { name: primary.name, label: 'Passed', days };
    if (days === 0) return { name: primary.name, label: 'TODAY', days: 0 };
    return { name: primary.name, label: `${days} Day${days === 1 ? '' : 's'} Remaining`, days };
  }, []);

  // Derive revision intelligence from structured revisionCalendar data
  const revisionIntelligence = useMemo(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const items = (reportingDataJson as any).revisionCalendar?.items || [];
    
    // Semantic definitions:
    // dueToday: status === 'due' AND revisionDate === today
    const dueToday = items.filter((r: any) => r.status === 'due' && r.revisionDate === today);
    // overdue: revisionDate < today AND status is incomplete
    const overdue = items.filter((r: any) => r.revisionDate < today && r.status !== 'complete');
    // scheduled: status === 'scheduled' or future due items
    const scheduled = items.filter((r: any) => r.status === 'scheduled' || (r.status === 'due' && r.revisionDate > today));
    // complete: finished revisions
    const complete = items.filter((r: any) => r.status === 'complete');
    
    return {
      dueToday,
      overdue,
      scheduled,
      complete,
      dueTodayCount: dueToday.length,
      overdueCount: overdue.length
    };
  }, []);

  // Compute canonical totals dynamically from corpus
  const counts = useMemo(() => {
    const totalCorpus = items.length;
    const caCount = items.filter(i => isItemInSubject(i, 'current-affairs')).length;
    const schemesCount = items.filter(i => isItemInSubject(i, 'schemes')).length;
    const ecoCount = items.filter(i => isItemInSubject(i, 'economics')).length;
    const quantCount = items.filter(i => isItemInSubject(i, 'quant')).length;
    const pyqCount = items.filter(i => isItemInSubject(i, 'pyqs')).length;
    return { totalCorpus, caCount, schemesCount, ecoCount, quantCount, pyqCount };
  }, [items]);

  // Separate subjects into Core Knowledge & Preparation Tools
  const coreSubjectIds = ['economics', 'english', 'polity', 'history', 'geography', 'science', 'revision'];
  const prepSubjectIds = ['current-affairs', 'schemes', 'static-ga', 'quant', 'pyqs'];

  const coreSubjects = SUBJECT_DEFS.filter(s => coreSubjectIds.includes(s.id));
  const prepSubjects = SUBJECT_DEFS.filter(s => prepSubjectIds.includes(s.id));

  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isSec11VaultExpanded, setIsSec11VaultExpanded] = useState<boolean>(true);

  // Derive all Section 11 (Rapid Revision) units across all months dynamically
  const allSec11Items = useMemo(() => {
    return items.filter(i => {
      const secCode = (i.metadata?.sectionCode || i.metadata?.category || '').toUpperCase();
      const isSec11 = secCode === 'SEC11' || i.id.includes('sec11') || ((i.domain === 'current-affairs' || !i.domain) && (i.title || '').toLowerCase().includes('rapid revision'));
      return isSec11;
    }).sort((a, b) => {
      const dA = a.metadata?.date || '';
      const dB = b.metadata?.date || '';
      return dB.localeCompare(dA); // newest month first
    });
  }, [items]);

  return (
    <div className={`command-center-home ${isFocusMode ? 'focus-mode-active' : ''}`}>
      <div className="home-container">
        {/* Section A: Personal Header Strip */}
        <header className="home-personal-header wireframe-header">
          <div className="home-greeting-row">
            <h1 className="home-greeting-title">{greetingIcon} {greeting}, Vishal</h1>
            <div className="home-age-counter-number" title="Age Counter (Calculated monthly from DOB: 31 Oct 1996)">
              {ageCounter}
            </div>
          </div>
          <p className="home-motto">"The life you want is usually hidden inside the things you keep postponing."</p>

          {/* Live Exam Target & Countdown Ticker — derived from reporting-center.json examTargets */}
          <div className="home-target-ticker">
            <div className="target-ticker-left">
              <span className="target-badge">🎯 EXAM TARGET 2026</span>
              {examCountdown ? (
                <span className="target-text">
                  {examCountdown.name} — <strong>{examCountdown.label}</strong> • <em>"Build standard, build speed."</em>
                </span>
              ) : (
                <span className="target-text">Update <code>reporting-center.json → examTargets</code> to set exam date.</span>
              )}
            </div>
          </div>
        </header>

        {/* Tactical Phase 1 Label */}
        <div className="tactical-phase-header">
          <span className="phase-badge">[ PHASE 1: MORNING COMMAND & SCHEDULE ]</span>
        </div>

        {/* Section B: Wireframe Stacked Full-Width Blocks */}
        <div className="home-ca-revision-grid wireframe-grid">
          {/* Top Block: REPORTING CENTRE'S BLOCK */}
          <section className="home-reporting-center-box">
            <div
              className="reporting-center-header collapsible-header"
              onClick={() => setIsReportingCollapsed(prev => !prev)}
              title={isReportingCollapsed ? "Click to expand" : "Click to collapse"}
            >
              <h2 className="reporting-center-title">REPORTING CENTRE’S BLOCK</h2>
              <span className="collapsible-indicator">
                {isReportingCollapsed ? '▸' : '▾'}
              </span>
            </div>

            {!isReportingCollapsed && (
              <div className="reporting-center-content">
                {/* 1. TODAY'S WAR PLAN */}
                <div className="reporting-pillar-block active-war-plan">
                  <div className="reporting-pillar-header-row">
                    <h3 className="reporting-pillar-title">TODAY’S WAR PLAN</h3>
                    <button
                      className={`btn-focus-toggle ${isFocusMode ? 'is-active' : ''}`}
                      onClick={() => setIsFocusMode(prev => !prev)}
                      title={isFocusMode ? "Exit Focus Mode" : "Activate Distraction-Free 25m Focus Session"}
                    >
                      {isFocusMode ? '🎯 FOCUS ACTIVE' : '⏱️ 25m Focus Session'}
                    </button>
                  </div>
                  <p className="reporting-pillar-motto">
                    {reportingDataJson.todaysWarPlan?.motto || '(Updated schedule according to goals and exams)'}
                  </p>
                  <ul className="reporting-war-plan-list">
                    {reportingDataJson.todaysWarPlan?.schedule?.map((item, idx) => (
                      <li key={idx} className="war-plan-item">
                        <span className="war-plan-time">{item.time} ({item.zone})</span>
                        <span className="war-plan-task">{item.task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. AHEAD */}
                <div className={`reporting-pillar-block ${isFocusMode ? 'focus-dimmed' : ''}`}>
                  <h3 className="reporting-pillar-title">AHEAD</h3>
                  <p className="reporting-pillar-desc">
                    (What lies ahead in terms of exams, goals, future)
                  </p>
                  <ul className="reporting-ahead-list">
                    {reportingDataJson.ahead?.roadmap?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <div className="reporting-audit-box">
                    <span className="reporting-audit-label">RUTHLESS TRAJECTORY AUDIT:</span>
                    <p className="reporting-audit-text">
                      {reportingDataJson.ahead?.workEthicAudit || '(Also remark here with respect to my work ethic and input given, where i am headed, what are the possibilities, what could be improved - without any sugar coating)'}
                    </p>
                  </div>
                </div>

                {/* 3. REVISION CALENDAR */}
                <div className={`reporting-pillar-block ${isFocusMode ? 'focus-dimmed' : ''}`}>
                  <div className="reporting-pillar-header-row">
                    <h3 className="reporting-pillar-title">REVISION CALENDAR</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {revisionIntelligence.dueTodayCount > 0 && (
                        <span className="readwise-flash-chip">🧠 {revisionIntelligence.dueTodayCount} DUE TODAY</span>
                      )}
                      {revisionIntelligence.overdueCount > 0 && (
                        <span className="readwise-flash-chip" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: '#ef4444' }}>
                          ⚠️ {revisionIntelligence.overdueCount} OVERDUE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Retrieval Review Prompt — shown when revisions are due today or overdue */}
                  {(revisionIntelligence.dueTodayCount > 0 || revisionIntelligence.overdueCount > 0) && (
                    <div className="readwise-flash-prompt">
                      <div className="flash-prompt-left">
                        <span className="flash-prompt-icon">⚡</span>
                        <div className="flash-prompt-info">
                          <span className="flash-prompt-title">Daily Retrieval Spaced Review</span>
                          <span className="flash-prompt-sub">
                            {revisionIntelligence.dueTodayCount} Due Today
                            {revisionIntelligence.overdueCount > 0 ? ` • ${revisionIntelligence.overdueCount} Overdue` : ''}
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn-flash-review"
                        onClick={() => onSelectSubject('revision')}
                      >
                        Start 5-Min Review →
                      </button>
                    </div>
                  )}

                  <div className="reporting-rev-table">
                    {((reportingDataJson as any).revisionCalendar?.items || []).map((rev: any, idx: number) => {
                      const stageDisplay = rev.stage || (rev.revisionNumber ? `Rev ${rev.revisionNumber}` : '');
                      return (
                        <div key={idx} className="reporting-rev-row">
                          <span className="rev-stream">{rev.stream}</span>
                          <span className="rev-stage">{stageDisplay}</span>
                          <span className={`rev-status ${rev.status === 'due' || rev.status === 'overdue' ? 'due' : ''}`}>
                            {rev.revisionDate} — {rev.status.charAt(0).toUpperCase() + rev.status.slice(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. PROGRESS */}
                <div className="reporting-pillar-block">
                  <h3 className="reporting-pillar-title">PROGRESS</h3>
                  <p className="reporting-pillar-desc">
                    {reportingDataJson.progress?.summary || '(Update reporting-center.json → progress.summary with today\'s work)'}
                  </p>
                  <div className="reporting-pillar-chip">
                    Status: {reportingDataJson.progress?.dailyReportStatus || 'Log Pending'}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Bottom Block: CURRENT AFFAIRS 2026 -27 */}
          <section className="home-ca-box">
            <div className="ca-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="ca-box-title">CURRENT AFFAIRS 2026 -27</h2>
              <span className="tag-pill bold-pill" style={{ background: 'var(--accent-bg, #e0e7ff)', color: 'var(--accent-text, #3730a3)', fontSize: '0.75rem' }}>
                {counts.caCount} Briefings • {allSec11Items.length} Revision Sheets
              </span>
            </div>

            {/* Actions Row: STATIC & CA REVISION (Section 11) side-by-side above months */}
            <div className="ca-box-actions-row">
              <button
                className="ca-box-wide-btn static-btn"
                onClick={() => onSelectSubject('static-ga')}
              >
                STATIC SUPERBOOK
              </button>
              <button
                className="ca-box-wide-btn revision-btn"
                onClick={() => setIsSec11VaultExpanded(!isSec11VaultExpanded)}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>🧠 CA REVISION (Section 11 Vault)</span>
                <span style={{ background: '#ffffff', color: '#1e3a8a', padding: '0.1rem 0.4rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>
                  {allSec11Items.length}
                </span>
                <span style={{ fontSize: '0.8rem' }}>{isSec11VaultExpanded ? '▲' : '▼'}</span>
              </button>
            </div>

            {/* 2026 Month Grid */}
            <div className="ca-box-year-group">
              <div className="ca-box-year-label">2026 MONTHS</div>
              <div className="ca-box-month-grid">
                {[
                  { label: 'JAN', key: '2026-01', active: true },
                  { label: 'FEB', key: '2026-02', active: true },
                  { label: 'MAR', key: '2026-03', active: true },
                  { label: 'APR', key: '2026-04', active: true },
                  { label: 'MAY', key: '2026-05', active: true },
                  { label: 'JUN', key: '2026-06', active: true },
                  { label: 'JUL', key: '2026-07', active: true },
                  { label: 'AUG', key: '2026-08', active: true },
                  { label: 'SEPT', key: '2026-09', active: false },
                  { label: 'OCT', key: '2026-10', active: false },
                  { label: 'NOV', key: '2026-11', active: false },
                  { label: 'DEC', key: '2026-12', active: false }
                ].map(m => (
                  <button
                    key={m.key}
                    className={`ca-box-month-btn ${m.active ? 'is-active' : 'is-upcoming'}`}
                    disabled={!m.active}
                    onClick={() => {
                      if (m.active) {
                        const targetItem = items.find(i =>
                          isItemInSubject(i, 'current-affairs') &&
                          i.metadata?.date?.startsWith(m.key)
                        );
                        if (targetItem) {
                          onSelectItem(targetItem.id);
                        } else {
                          onSelectSubject('current-affairs');
                        }
                      }
                    }}
                    title={m.active ? `View ${m.label} 2026 Briefings` : `${m.label} 2026 Upcoming`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Section 11 All-Months Revision Vault */}
            {isSec11VaultExpanded && (
              <div className="ca-sec11-vault-container" style={{
                marginTop: '1.2rem',
                padding: '1.2rem',
                background: 'var(--card-bg, #f8fafc)',
                borderRadius: '10px',
                border: '1px solid var(--card-border, #cbd5e1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>🧠</span>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                      SECTION 11: ALL-MONTHS RAPID REVISION SHEETS
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Auto-updated collection of monthly Section 11 cheat sheets
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {allSec11Items.map((item, idx) => {
                    const dateStr = item.metadata?.date || '';
                    let monthTag = 'REVISION';
                    if (dateStr.match(/^\d{4}-\d{2}/)) {
                      const [y, m] = dateStr.split('-');
                      const dObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
                      monthTag = `${dObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${y}`;
                    } else if (item.id.includes('iibf')) {
                      monthTag = 'IIBF TRAPS';
                    }

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectItem(item.id)}
                        style={{
                          cursor: 'pointer',
                          padding: '0.9rem',
                          background: 'var(--bg-surface, #ffffff)',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color, #e2e8f0)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          transition: 'border-color 0.15s ease, transform 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--primary, #2563eb)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-color, #e2e8f0)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <span className="tag-pill bold-pill" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', background: '#dbeafe', color: '#1e40af' }}>
                              ⚡ {monthTag}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>#{idx + 1}</span>
                          </div>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: 'var(--text-primary, #0f172a)', lineHeight: 1.35 }}>
                            {item.title}
                          </h4>
                          {item.summary && (
                            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {item.summary}
                            </p>
                          )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.7rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem' }}>
                          <span style={{ color: '#059669', fontWeight: 600 }}>⚡ 1-Minute Cheat Sheet</span>
                          <span style={{ color: '#2563eb', fontWeight: 700 }}>Open →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Tactical Phase 2 Label */}
        <div className="tactical-phase-header" style={{ marginTop: '2rem' }}>
          <span className="phase-badge">[ PHASE 2: DAILY BRIEFINGS & REVISION ]</span>
        </div>

        {/* Section C: Top Grid (Continue Studying + Today's Plan) */}
        <div className={`home-top-grid ${!lastItem ? 'single-panel' : ''}`}>
          {/* B. Continue Studying Primary Card */}
          {lastItem && (
            <section
              className="home-continue-card"
              onClick={() => onSelectItem(lastItem.id)}
            >
              <div className="continue-card-badge-row">
                <span className="continue-card-badge">⚡ CONTINUE STUDYING</span>
                <span className="continue-card-domain">{(lastItem.domain || 'STUDY').toUpperCase()}</span>
              </div>
              <h2 className="continue-card-title">{lastItem.title}</h2>
              {lastItem.summary && (
                <p className="continue-card-summary">{lastItem.summary}</p>
              )}
              <div className="continue-card-footer">
                <span className="continue-card-hint">You were here last time.</span>
                <button className="btn-continue-primary">Continue Reading →</button>
              </div>
            </section>
          )}

          {/* C. Today's Plan Card */}
          <section className="home-plan-card">
            <div className="plan-card-badge-row">
              <span className="plan-card-badge">🎯 TODAY'S PLAN</span>
            </div>
            <h3 className="plan-quote">"One focused session is enough to begin."</h3>
            <p className="plan-desc">
              Quiet, purposeful study. Focus on core macroeconomics and regulatory updates today.
            </p>
            <div className="plan-card-footer">
              <button
                className="btn-plan-start"
                onClick={() => lastItem && onSelectItem(lastItem.id)}
              >
                Start Studying →
              </button>
            </div>
          </section>
        </div>


        {/* Section E: Corpus Summary Scale Strip */}
        <section className="home-summary-strip">
          <div className="summary-stat-item">
            <span className="summary-stat-val">{counts.totalCorpus}</span>
            <span className="summary-stat-lbl">Total Study Items</span>
          </div>
          <div className="summary-stat-divider" />
          <div className="summary-stat-item">
            <span className="summary-stat-val">{counts.caCount}</span>
            <span className="summary-stat-lbl">Current Affairs</span>
          </div>
          <div className="summary-stat-divider" />
          <div className="summary-stat-item">
            <span className="summary-stat-val">{counts.schemesCount}</span>
            <span className="summary-stat-lbl">Govt Schemes</span>
          </div>
          <div className="summary-stat-divider" />
          <div className="summary-stat-item">
            <span className="summary-stat-val">{counts.ecoCount}</span>
            <span className="summary-stat-lbl">Economics</span>
          </div>
          <div className="summary-stat-divider" />
          <div className="summary-stat-item">
            <span className="summary-stat-val">{counts.quantCount}</span>
            <span className="summary-stat-lbl">Quant Topics</span>
          </div>
          <div className="summary-stat-divider" />
          <div className="summary-stat-item">
            <span className="summary-stat-val">{counts.pyqCount}</span>
            <span className="summary-stat-lbl">PYQ Sets</span>
          </div>
        </section>

        {/* Tactical Phase 3 Label */}
        <div className="tactical-phase-header" style={{ marginTop: '2.4rem' }}>
          <span className="phase-badge">[ PHASE 3: CORE KNOWLEDGE & SHELF ]</span>
        </div>

        {/* Section F: Your Study World */}
        <section className="home-study-world">
          <div className="study-world-header">
            <h2 className="study-world-title">YOUR STUDY WORLD</h2>
            <p className="study-world-sub">Personal study shelf organized by knowledge domain and exam tools.</p>
          </div>

          {/* Sub-Group 1: CORE KNOWLEDGE */}
          <div className="domain-group-section">
            <div className="domain-group-header">
              <span className="domain-group-badge">📚 CORE KNOWLEDGE</span>
            </div>
            <div className="domain-cards-grid">
              {coreSubjects.map(def => {
                const cov = computeSubjectCoverage(items, def.id, userStudyState.completedItemIds);
                return (
                  <div
                    key={def.id}
                    className="home-domain-card"
                    onClick={() => onSelectSubject(def.id)}
                  >
                    <div className="domain-card-top">
                      <span className="domain-card-icon">{def.icon}</span>
                      <span className="domain-card-count">{cov.totalCount} {cov.totalCount === 1 ? 'item' : 'items'}</span>
                    </div>
                    <h3 className="domain-card-title">{def.title}</h3>
                    <p className="domain-card-desc">{def.description}</p>
                    
                    {/* Truthful Subject Coverage Bar (Completion, not mastery) */}
                    <div className="domain-card-mastery-box">
                      <div className="domain-mastery-labels">
                        <span>Topic Coverage</span>
                        <span className="domain-mastery-percent">
                          {cov.completedCount} / {cov.totalCount} ({cov.coveragePct}%)
                        </span>
                      </div>
                      <div className="domain-mastery-track">
                        <div className="domain-mastery-fill" style={{ width: `${cov.coveragePct}%` }} />
                      </div>
                    </div>

                    <div className="domain-card-footer">
                      <span className="domain-card-arrow">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-Group 2: PREPARATION TOOLS */}
          <div className="domain-group-section" style={{ marginTop: '2rem' }}>
            <div className="domain-group-header">
              <span className="domain-group-badge">🛠️ PREPARATION TOOLS</span>
            </div>
            <div className="domain-cards-grid">
              {prepSubjects.map(def => {
                const cov = computeSubjectCoverage(items, def.id, userStudyState.completedItemIds);
                return (
                  <div
                    key={def.id}
                    className="home-domain-card"
                    onClick={() => onSelectSubject(def.id)}
                  >
                    <div className="domain-card-top">
                      <span className="domain-card-icon">{def.icon}</span>
                      <span className="domain-card-count">{cov.totalCount} {cov.totalCount === 1 ? 'item' : 'items'}</span>
                    </div>
                    <h3 className="domain-card-title">{def.title}</h3>
                    <p className="domain-card-desc">{def.description}</p>
                    
                    {/* Truthful Prep Tool Coverage Bar (Completion, not mastery) */}
                    <div className="domain-card-mastery-box">
                      <div className="domain-mastery-labels">
                        <span>Module Coverage</span>
                        <span className="domain-mastery-percent">
                          {cov.completedCount} / {cov.totalCount} ({cov.coveragePct}%)
                        </span>
                      </div>
                      <div className="domain-mastery-track">
                        <div className="domain-mastery-fill" style={{ width: `${cov.coveragePct}%` }} />
                      </div>
                    </div>

                    <div className="domain-card-footer">
                      <span className="domain-card-arrow">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
