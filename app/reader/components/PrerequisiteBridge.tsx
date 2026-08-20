import React from 'react';
import { KnowledgeItem } from '../../../schema/knowledge-item';

interface Props {
  item: KnowledgeItem;
  onNavigateItem?: (id: string) => void;
  onNavigateHub?: (subjectId: string) => void;
}

export const PrerequisiteBridge: React.FC<Props> = ({ item, onNavigateItem, onNavigateHub }) => {
  // Detect conceptual links to core subjects in the command center
  const getPrerequisiteLinks = () => {
    const t = item.title.toLowerCase();
    const sec = item.metadata?.sectionCode || '';
    const links = [];

    if (t.includes('nbfc') || t.includes('tata sons') || t.includes('co-lending') || t.includes('scale-based')) {
      links.push({
        hubId: 'iibf-regulations',
        itemId: 'iibf-reg-mod1',
        title: 'IIBF Module 1: Regulatory Structure & NBFC Scale-Based Framework (SBR)',
        badge: '🏛️ IIBF Regulations Hub',
        summary: 'Review the 4-tier NBFC framework (Base, Middle, Upper, Top layer) and regulatory thresholds.'
      });
    }

    if (t.includes('basel') || t.includes('pillar') || t.includes('capital') || t.includes('car') || t.includes('crar')) {
      links.push({
        hubId: 'iibf-regulations',
        itemId: 'iibf-reg-mod2',
        title: 'IIBF Module 2: Basel III Standards, CRAR & Risk Weighted Assets',
        badge: '🏛️ IIBF Regulations Hub',
        summary: 'Review Tier-1, Tier-2 capital requirements and the 3 Pillars of Basel Accord.'
      });
    }

    if (t.includes('locker') || t.includes('customer') || t.includes('recovery') || t.includes('penal')) {
      links.push({
        hubId: 'iibf-regulations',
        itemId: 'iibf-reg-mod3',
        title: 'IIBF Module 3: Customer Service, Safe Deposit Lockers & Fair Practices Code',
        badge: '🏛️ IIBF Regulations Hub',
        summary: 'Review RBI directives on locker liabilities, deceased depositor claims, and customer grievance redressal.'
      });
    }

    if (t.includes('upi') || t.includes('cbdc') || t.includes('mdr') || t.includes('digital') || t.includes('payment')) {
      links.push({
        hubId: 'iibf-regulations',
        itemId: 'iibf-reg-mod4',
        title: 'IIBF Module 4: Payment & Settlement Systems Act 2007, UPI & Digital Banking',
        badge: '🏛️ IIBF Regulations Hub',
        summary: 'Review NPCI platforms, RTGS/NEFT mechanisms, and retail digital payments.'
      });
    }

    if (sec === 'SEC10' || t.includes('scheme') || t.includes('yojana') || t.includes('pm-') || t.includes('mission')) {
      links.push({
        hubId: 'schemes',
        title: 'Government Schemes Superbook — Flagship Welfare & Credit Schemes',
        badge: '📜 Government Schemes Hub',
        summary: 'Review eligibility, financial outlay, implementing ministries, and core targets.'
      });
    }

    if (sec === 'SEC1' || t.includes('gdp') || t.includes('inflation') || t.includes('cpi') || t.includes('fiscal') || t.includes('repo')) {
      links.push({
        hubId: 'economics',
        title: 'Core Economics: Monetary Policy, Inflation Indices & Fiscal Math',
        badge: '💰 Economics & Finance Hub',
        summary: 'Review CPI vs WPI calculation, MPC transmission, and fiscal deficit formula.'
      });
    }

    return links;
  };

  const bridges = getPrerequisiteLinks();
  if (bridges.length === 0) return null;

  return (
    <div className="prerequisite-bridge-card">
      <div className="bridge-header">
        <span className="bridge-badge">🔗 PREREQUISITE KNOWLEDGE BRIDGE</span>
        <span className="bridge-hint">Connect this live news with core static banking theory</span>
      </div>

      <div className="bridge-links-grid">
        {bridges.map((b, idx) => (
          <div key={idx} className="bridge-item-card">
            <div className="bridge-item-top">
              <span className="bridge-item-badge">{b.badge}</span>
            </div>
            <h5 className="bridge-item-title">{b.title}</h5>
            <p className="bridge-item-summary">{b.summary}</p>
            <div className="bridge-item-action">
              <button
                className="btn-bridge-explore"
                onClick={() => {
                  if (b.itemId && onNavigateItem) onNavigateItem(b.itemId);
                  else if (b.hubId && onNavigateHub) onNavigateHub(b.hubId);
                }}
              >
                Study Foundation Concept →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
