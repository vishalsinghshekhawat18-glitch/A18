import React, { useMemo } from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { SUBJECT_DEFS, isItemInSubject } from '../navigation/subjectMapper';
import reportingDataJson from '../../content/reporting-center.json';

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
  // Resolve last opened item for Continue Studying card
  const lastItem = lastOpenedItemId ? items.find(i => i.id === lastOpenedItemId) : null;

  // Dynamic time-aware greeting & date
  const { greeting, formattedDate } = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    let g = 'Good morning';
    if (hours >= 12 && hours < 17) g = 'Good afternoon';
    else if (hours >= 17) g = 'Good evening';

    const dStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return { greeting: g, formattedDate: dStr };
  }, []);

  // Compute dynamic age counter from DOB: 31 Oct 1996 (format: YY.MM)
  const ageCounter = useMemo(() => {
    const dob = new Date(1996, 9, 31); // 31 Oct 1996
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    if (now.getDate() < dob.getDate()) {
      months -= 1;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const mStr = months < 10 ? `0${months}` : `${months}`;
    return `${years}.${mStr}`;
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
  const coreSubjectIds = ['economics', 'polity', 'history', 'geography', 'science', 'revision'];
  const prepSubjectIds = ['current-affairs', 'schemes', 'static-ga', 'quant', 'pyqs'];

  const coreSubjects = SUBJECT_DEFS.filter(s => coreSubjectIds.includes(s.id));
  const prepSubjects = SUBJECT_DEFS.filter(s => prepSubjectIds.includes(s.id));

  // Handler to open Current Affairs specifically at Section 11 (Rapid Revision)
  const handleOpenCARevisionSec11 = () => {
    const sec11Item = items.find(i =>
      isItemInSubject(i, 'current-affairs') &&
      (i.metadata?.category === 'SEC11' || i.id.includes('sec11') || i.title.toLowerCase().includes('rapid revision'))
    );
    if (sec11Item) {
      onSelectItem(sec11Item.id);
    } else {
      onSelectSubject('current-affairs');
    }
  };

  return (
    <div className="command-center-home">
      <div className="home-container">
        {/* Section A: Personal Header Strip */}
        <header className="home-personal-header wireframe-header">
          <div className="home-meta-bar">
            <span className="home-system-badge">Banking Command Centre , {formattedDate}</span>
            <div className="home-age-counter-widget" title="Age Counter (Calculated monthly from DOB: 31 Oct 1996)">
              <span>{ageCounter}</span>
              <span className="age-counter-chevron">▾</span>
            </div>
          </div>
          <h1 className="home-greeting-title">{greeting}, Vishal</h1>
          <p className="home-motto">"The life you want is usually hidden inside the things you keep postponing."</p>
        </header>

        {/* Section B: Wireframe 2-Column Grid */}
        <div className="home-ca-revision-grid wireframe-grid">
          {/* Left Box: CURRENT AFFAIRS 2026 -27 */}
          <section className="home-ca-box">
            <div className="ca-box-header">
              <h2 className="ca-box-title">CURRENT AFFAIRS 2026 -27</h2>
            </div>

            {/* Static GA Button */}
            <button
              className="ca-box-wide-btn static-btn"
              onClick={() => onSelectSubject('static-ga')}
            >
              STATIC
            </button>

            {/* 2026 Month Grid */}
            <div className="ca-box-year-group">
              <div className="ca-box-year-label">2026</div>
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

            {/* CA Revision (Section 11) Button */}
            <button
              className="ca-box-wide-btn revision-btn"
              onClick={handleOpenCARevisionSec11}
            >
              CA REVISION (Section 11)
            </button>
          </section>

          {/* Right Box: REPORTING CENTRE'S BLOCK */}
          <section className="home-reporting-center-box">
            <div className="reporting-center-header">
              <h2 className="reporting-center-title">REPORTING CENTRE’S BLOCK</h2>
            </div>

            <div className="reporting-center-content">
              {/* 1. PROGRESS */}
              <div className="reporting-pillar-block">
                <h3 className="reporting-pillar-title">PROGRESS</h3>
                <p className="reporting-pillar-desc">
                  {reportingDataJson.progress?.summary || '(Recent work highlight with remarks, also includes daily work report submitted info)'}
                </p>
                <div className="reporting-pillar-chip">
                  Status: {reportingDataJson.progress?.dailyReportStatus || 'Log Pending'}
                </div>
              </div>

              {/* 2. TODAY'S WAR PLAN */}
              <div className="reporting-pillar-block">
                <h3 className="reporting-pillar-title">TODAY’S WAR PLAN</h3>
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

              {/* 3. REVISION CALENDAR */}
              <div className="reporting-pillar-block">
                <h3 className="reporting-pillar-title">REVISION CALENDAR</h3>
                <p className="reporting-pillar-desc">
                  (Scientific Revision Calendar with timely gap and dates on when to revise what, derived from today work report)
                </p>
                <div className="reporting-rev-table">
                  {reportingDataJson.revisionCalendar?.items?.map((rev, idx) => (
                    <div key={idx} className="reporting-rev-row">
                      <span className="rev-stream">{rev.stream}</span>
                      <span className="rev-stage">{rev.revStage}</span>
                      <span className={`rev-status ${rev.status.toLowerCase().includes('due') ? 'due' : ''}`}>{rev.nextDate} — {rev.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. AHEAD */}
              <div className="reporting-pillar-block">
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
            </div>
          </section>
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
                <span className="continue-card-domain">{lastItem.domain.toUpperCase()}</span>
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

        {/* Section D: Thought for Today Strip */}
        <section className="home-thought-strip">
          <div className="thought-badge-row">
            <span className="thought-badge">💭 A THOUGHT FOR TODAY</span>
          </div>
          <blockquote className="thought-quote">
            "The life you want is usually hidden inside the things you keep postponing."
          </blockquote>
        </section>

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
                const count = items.filter(i => isItemInSubject(i, def.id)).length;
                return (
                  <div
                    key={def.id}
                    className="home-domain-card"
                    onClick={() => onSelectSubject(def.id)}
                  >
                    <div className="domain-card-top">
                      <span className="domain-card-icon">{def.icon}</span>
                      <span className="domain-card-count">{count} {count === 1 ? 'item' : 'items'}</span>
                    </div>
                    <h3 className="domain-card-title">{def.title}</h3>
                    <p className="domain-card-desc">{def.description}</p>
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
                const count = items.filter(i => isItemInSubject(i, def.id)).length;
                return (
                  <div
                    key={def.id}
                    className="home-domain-card"
                    onClick={() => onSelectSubject(def.id)}
                  >
                    <div className="domain-card-top">
                      <span className="domain-card-icon">{def.icon}</span>
                      <span className="domain-card-count">{count} {count === 1 ? 'item' : 'items'}</span>
                    </div>
                    <h3 className="domain-card-title">{def.title}</h3>
                    <p className="domain-card-desc">{def.description}</p>
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
