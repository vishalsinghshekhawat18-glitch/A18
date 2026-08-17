import React, { useMemo } from 'react';
import { KnowledgeItem } from '../../schema/knowledge-item';
import { SUBJECT_DEFS, isItemInSubject } from '../navigation/subjectMapper';

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

  // Dynamic time-aware greeting
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

  return (
    <div className="command-center-home">
      <div className="home-container">
        {/* Section A: Personal Header */}
        <header className="home-personal-header">
          <div className="home-meta-bar">
            <span className="home-system-badge">🏛️ BANKING COMMAND CENTER</span>
            <span className="home-date-chip">📅 {formattedDate}</span>
          </div>
          <h1 className="home-greeting-title">{greeting}, Vishal.</h1>
          <p className="home-motto">Discipline today. Freedom tomorrow.</p>
        </header>

        {/* Section B: Current Affairs 2026-27 & Revision Calendar Box Grid */}
        <div className="home-ca-revision-grid">
          {/* Left Box: Current Affairs 2026-27 */}
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
                        onSelectSubject('current-affairs');
                        setTimeout(() => {
                          const monthPillBtn = document.querySelector(`.ca-month-pill-btn[data-month="${m.key}"]`) as HTMLButtonElement;
                          if (monthPillBtn) monthPillBtn.click();
                        }, 100);
                      }
                    }}
                    title={m.active ? `View ${m.label} 2026 Briefings` : `${m.label} 2026 Upcoming`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rapid Revision Button */}
            <button
              className="ca-box-wide-btn revision-btn"
              onClick={() => onSelectSubject('revision')}
            >
              REVISION
            </button>
          </section>

          {/* Right Box: Revision Calendar */}
          <section className="home-revision-calendar-box">
            <div className="revision-calendar-header">
              <h2 className="revision-calendar-title">REVISION CALENDAR</h2>
              <select className="revision-calendar-select" defaultValue="aug-2026" aria-label="Select Revision Month">
                <option value="aug-2026">August 2026</option>
                <option value="jul-2026">July 2026</option>
                <option value="jun-2026">June 2026</option>
              </select>
            </div>

            <div className="revision-calendar-body">
              {/* Day Headers */}
              <div className="revision-cal-days-header">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              {/* Mini August 2026 Calendar Grid */}
              <div className="revision-cal-grid">
                {/* Offset for Aug 2026 (Aug 1 is Saturday) */}
                <span className="cal-day empty" />
                <span className="cal-day empty" />
                <span className="cal-day empty" />
                <span className="cal-day empty" />
                <span className="cal-day empty" />
                <span className="cal-day empty" />
                <span className="cal-day">1</span>
                <span className="cal-day">2</span>
                <span className="cal-day has-event" title="ESI & Finance Trap Revision">3</span>
                <span className="cal-day">4</span>
                <span className="cal-day">5</span>
                <span className="cal-day">6</span>
                <span className="cal-day has-event" title="Regulatory Circulars Review">7</span>
                <span className="cal-day">8</span>
                <span className="cal-day">9</span>
                <span className="cal-day">10</span>
                <span className="cal-day">11</span>
                <span className="cal-day has-event" title="Banking & Schemes Quiz">12</span>
                <span className="cal-day">13</span>
                <span className="cal-day">14</span>
                <span className="cal-day has-event" title="Independence Day Mega Review">15</span>
                <span className="cal-day">16</span>
                <span className="cal-day is-today" title="Today's Revision Focus">17</span>
                <span className="cal-day">18</span>
                <span className="cal-day">19</span>
                <span className="cal-day has-event" title="Quant & PYQ Traps">20</span>
                <span className="cal-day">21</span>
                <span className="cal-day">22</span>
                <span className="cal-day">23</span>
                <span className="cal-day">24</span>
                <span className="cal-day has-event" title="Full Month CA Traps">25</span>
                <span className="cal-day">26</span>
                <span className="cal-day">27</span>
                <span className="cal-day">28</span>
                <span className="cal-day">29</span>
                <span className="cal-day">30</span>
                <span className="cal-day">31</span>
              </div>
            </div>

            <div className="revision-calendar-footer">
              <span className="revision-focus-hint">🎯 Today: High-Yield Traps & Macroeconomics</span>
              <button
                className="btn-start-revision"
                onClick={() => onSelectSubject('revision')}
              >
                Start Revision →
              </button>
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
