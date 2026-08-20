import React, { useState } from 'react';
import { KnowledgeItem } from '../../../schema/knowledge-item';
import { detectSchemeInItem, SchemeEntry } from '../glossary/schemeRegistry';

interface Props {
  item: KnowledgeItem;
}

export const SchemeDeepDiveCard: React.FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const scheme: SchemeEntry | null = detectSchemeInItem(item);

  // If no scheme is mentioned in this note, render nothing (zero clutter)
  if (!scheme) {
    return null;
  }

  return (
    <div className="scheme-deepdive-container">
      {/* Top-right Scheme Trigger Button */}
      <button
        className={`btn-scheme-badge ${isOpen ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={isOpen ? "Close scheme deep-dive" : `📜 View complete past-to-present lineage of ${scheme.shortName}`}
        aria-label="Scheme Deep-Dive"
      >
        <span>📜</span>
        <span className="scheme-btn-text">Scheme: {scheme.shortName}</span>
      </button>

      {/* Expanded Scheme Drawer */}
      {isOpen && (
        <div className="scheme-deepdive-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="scheme-drawer-header">
            <div className="scheme-drawer-title-group">
              <span className="scheme-drawer-name">{scheme.fullName}</span>
              <span className="scheme-type-tag">{scheme.schemeType}</span>
            </div>
            <button className="btn-close-drawer" onClick={() => setIsOpen(false)} title="Close">✕</button>
          </div>

          {/* Key Parameters Grid */}
          <div className="scheme-params-grid">
            <div className="scheme-param-box">
              <span className="scheme-param-label">🏛️ Nodal Ministry</span>
              <span className="scheme-param-value">{scheme.nodalMinistry}</span>
            </div>
            <div className="scheme-param-box">
              <span className="scheme-param-label">📅 Launch &amp; Timeline</span>
              <span className="scheme-param-value">{scheme.launchDate}</span>
            </div>
            <div className="scheme-param-box">
              <span className="scheme-param-label">💰 Financial Outlay</span>
              <span className="scheme-param-value">{scheme.totalOutlay}</span>
            </div>
            <div className="scheme-param-box">
              <span className="scheme-param-label">🎯 Key Target &amp; Beneficiaries</span>
              <span className="scheme-param-value">{scheme.targets}</span>
            </div>
          </div>

          {/* Historical Lineage & Predecessors */}
          <div className="scheme-lineage-box">
            <div className="lineage-title">📜 Past Genesis &amp; Evolution:</div>
            <div>{scheme.predecessorAndLineage}</div>
          </div>

          {/* Current 2026 Status in News */}
          <div className="scheme-lineage-box">
            <div className="lineage-title">📈 Current 2026 Milestone in News:</div>
            <div>{scheme.current2026Update}</div>
          </div>

          {/* Exam Trap */}
          <div className="scheme-trap-box">
            <strong>🎯 Exam Angle (SBI PO / RBI Grade B):</strong> {scheme.examTrap}
          </div>
        </div>
      )}
    </div>
  );
};
