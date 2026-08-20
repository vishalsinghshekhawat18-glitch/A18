import React, { useState } from 'react';
import { KnowledgeItem } from '../../../schema/knowledge-item';

interface Props {
  item: KnowledgeItem;
}

export const MentorDeconstruct: React.FC<Props> = ({ item }) => {
  const [activeTab, setActiveTab] = useState<'why' | 'impact' | 'exam'>('why');

  // Intelligent contextual responses for the 3 mentor questions
  const getWhyExists = () => {
    const t = item.title.toLowerCase();
    if (t.includes('locker theft')) return "To end endless legal disputes between banks and customers. Previously, customers claimed huge unverified jewellery was lost, while banks took zero responsibility. RBI established clear physical security rules (CCTV 180 days) paired with a defined statutory compensation formula.";
    if (t.includes('nbfc-ul') || t.includes('tata sons')) return "Because giant NBFCs like Tata Sons borrow massive amounts of money from public banks and debt markets. If a top-layer NBFC defaults secretly, it could trigger a systemic collapse similar to IL&FS (2018). Mandatory stock listing forces them into open public disclosures.";
    if (t.includes('cgsmfi')) return "Small microfinance lenders with less than ₹500 Cr AUM operate in deep rural districts where commercial banks have no branches. Without government credit guarantees, large banks refuse to lend to them, cutting off credit to rural women self-help groups.";
    if (t.includes('upi mdr')) return "Payment processors and banks spend hundreds of crores running high-capacity servers and fraud detection networks for UPI. While the government provided subsidies to keep UPI free, introducing a flexible legal framework for MDR ensures long-term commercial sustainability.";
    if (t.includes('epf')) return "The ₹15,000 monthly ceiling was set way back in 2014. Due to inflation and nominal wage growth, a large proportion of urban entry-level workers earning ₹18,000–₹25,000 were excluded from mandatory social security pensions.";
    return "This statutory intervention establishes structured governance, capital adequacy buffers, or operational safeguards to eliminate systemic vulnerabilities in the Indian financial and economic ecosystem.";
  };

  const getPracticalImpact = () => {
    const t = item.title.toLowerCase();
    if (t.includes('locker theft')) return "Common customers must know that expensive heirloom items above standard coverage should be separately insured with private home/jewellery insurance. Banks must maintain strict CCTV logs for 180 days.";
    if (t.includes('nbfc-ul') || t.includes('tata sons')) return "Investors will get complete quarterly audited financial disclosures and corporate governance oversight if Tata Sons lists on BSE/NSE, or the conglomerate must restructure its holding structure.";
    if (t.includes('cgsmfi')) return "Rural women SHGs, local artisans, and small shopkeepers will receive cheaper, accessible micro-loans from local grassroots NBFC-MFIs backed by government credit guarantees.";
    if (t.includes('upi mdr')) return "Regular peer-to-peer (P2P) transfers between people will remain 100% free. Large merchants and businesses may incur minor interchange/processing charges on high-ticket commercial transactions.";
    if (t.includes('epf')) return "Employees earning ₹15,000 to ₹25,000 per month will see a higher mandatory retirement corpus accumulating via employee + employer contributions, boosting long-term domestic pension assets.";
    return "Strengthens institutional compliance, ensures fair treatment for retail consumers, and provides stable regulatory certainty for market participants.";
  };

  const getExamTrap = () => {
    const t = item.title.toLowerCase();
    if (t.includes('locker theft')) return "🔥 Don't confuse: Maximum bank compensation is 100× annual locker rent (NOT deposit amount, NOT locker size, NOT ₹5 lakh DICGC limit).";
    if (t.includes('nbfc-ul') || t.includes('tata sons')) return "🔥 Don't confuse: NBFC-UL listing deadline is 3 years from notification. SBR has 4 tiers: Base (<₹1,000 Cr), Middle, Upper, and Top layer.";
    if (t.includes('cgsmfi')) return "🔥 Don't confuse: CGSMFI 2.0 raises the small/mid-MFI lending floor to 15% (up from 5%/10%) out of the ₹20,000 crore total guarantee corpus.";
    if (t.includes('upi mdr')) return "🔥 Don't confuse: The bill introduced enabling provisions; UPI is still free for retail merchants as of source date. Watch out for statements saying 'UPI is now chargeable for all users' — that is false.";
    if (t.includes('epf')) return "🔥 Don't confuse: EPF Wage Ceiling is raising from ₹15,000 to ₹25,000/month. UAN is 12 digits (permanent), while EPF account number is 22 digits.";
    return "🔥 Focus on exact figures, statutory acts, regulatory timeframes, and distinguishing apex regulators from administrative ministries.";
  };

  return (
    <div className="mentor-deconstruct-card">
      <div className="mentor-header">
        <span className="mentor-badge">🧠 3-QUESTION MENTOR DECONSTRUCT</span>
        <h4 className="mentor-title">Understand the Logic Behind the Policy</h4>
      </div>

      <div className="mentor-tab-bar">
        <button
          className={`mentor-tab ${activeTab === 'why' ? 'active' : ''}`}
          onClick={() => setActiveTab('why')}
        >
          ❓ 1. Why does this rule exist?
        </button>
        <button
          className={`mentor-tab ${activeTab === 'impact' ? 'active' : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          👥 2. Real-World Impact
        </button>
        <button
          className={`mentor-tab ${activeTab === 'exam' ? 'active' : ''}`}
          onClick={() => setActiveTab('exam')}
        >
          🎯 3. SBI PO Mains Trap
        </button>
      </div>

      <div className="mentor-tab-content">
        {activeTab === 'why' && (
          <div className="mentor-pane why-pane">
            <p><strong>The Core Rationale:</strong> {getWhyExists()}</p>
          </div>
        )}
        {activeTab === 'impact' && (
          <div className="mentor-pane impact-pane">
            <p><strong>Impact on Customers & Banks:</strong> {getPracticalImpact()}</p>
          </div>
        )}
        {activeTab === 'exam' && (
          <div className="mentor-pane exam-pane">
            <p><strong>Common Exam Confusion:</strong> {getExamTrap()}</p>
          </div>
        )}
      </div>
    </div>
  );
};
