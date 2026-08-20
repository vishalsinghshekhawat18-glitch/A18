import React, { useState } from 'react';
import { KnowledgeItem } from '../../../schema/knowledge-item';
import { detectJargonInText, JargonEntry } from '../glossary/jargonGlossary';

interface Props {
  item: KnowledgeItem;
}

export const ExplainSimplyCard: React.FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedJargon, setSelectedJargon] = useState<JargonEntry | null>(null);

  // Combine full text of the item for analysis
  const fullText = `${item.title} ${item.summary || ''} ${item.blocks.map(b => 'content' in b ? b.content : '').join(' ')}`;
  const detectedJargon = detectJargonInText(fullText);

  // Generate an intuitive 30-second layman story based on title and category
  const generateLaymanStory = () => {
    const t = item.title.toLowerCase();
    if (t.includes('locker theft')) {
      return "Banks are now held strictly accountable for locker safety. If a theft or fire happens due to bank negligence, the bank is legally capped at paying you 100 times your annual locker rent — not the unverified millions of jewelry you kept inside. In FY26, public banks reported zero locker thefts for the first time.";
    }
    if (t.includes('tata sons') || t.includes('nbfc-ul')) {
      return "Tata Sons is registered as an 'Upper-Layer NBFC' (a giant shadow bank). RBI rules mandate that any giant non-bank holding huge public/systemic assets must either list its shares on the stock exchange for public transparency or voluntarily downsize/surrender its shadow banking license.";
    }
    if (t.includes('cgsmfi')) {
      return "Small microfinance lenders lend to rural women and vegetable vendors. Because banks are afraid of defaults, the government credit guarantee trustee (NCGTC) promises to repay the bank if borrowers default. The new rule forces banks to channel at least 15% of this guarantee pool to smaller grassroots lenders.";
    }
    if (t.includes('gi tag') || t.includes('mithila makhana')) {
      return "A Geographical Indication (GI) tag protects regional specialty products (like Darjeeling Tea or Mithila Makhana) so counterfeiters cannot sell fake versions. India aims to register 10,000 such regional products by 2030, directly lifting rural artisan and farmer incomes by up to 30%.";
    }
    if (t.includes('epf') || t.includes('wage ceiling')) {
      return "The government is increasing the mandatory salary limit for Provident Fund from ₹15,000/month to ₹25,000/month. This means millions of private sector employees who earn up to ₹25k will now automatically get retirement savings deducted with matching employer contributions.";
    }
    if (t.includes('upi mdr') || t.includes('taxation')) {
      return "Currently, shopkeepers pay 0% fees when you scan a QR code with UPI because the government subsidizes it. A new bill creates a legal doorway allowing banks to charge a small service fee (MDR) to businesses on high-value digital payments in the future.";
    }
    if (t.includes('ramsar') || t.includes('glaw lake')) {
      return "Ramsar sites are globally protected wetlands. India just designated its 101st site (Glaw Lake in Arunachal Pradesh), giving it international ecological protection and central government conservation funding.";
    }
    if (t.includes('basel') || t.includes('pillar 3')) {
      return "Basel III Pillar 3 is like a public health inspection scorecard for banks. Banks are forced to publish their bad loan numbers, risk buffers, and capital strength every quarter so depositors and investors know the bank won't suddenly collapse.";
    }
    if (t.includes('pm-setu')) {
      return "PM-SETU is a ₹60,000 crore government mission (co-funded by $830 million from World Bank) to completely renovate 1,000 old industrial training institutes (ITIs) with modern robotics, AI labs, and EV technology.";
    }
    if (t.includes('pm-rahat')) {
      return "PM-RAHAT guarantees that if anyone suffers a road accident on an Indian highway, any nearby empanelled hospital must provide free cashless emergency trauma care up to ₹1.5 lakh during the first 60 minutes ('Golden Hour').";
    }

    return item.summary || "This policy reform updates regulatory standards, capital allocation, or statutory oversight to strengthen economic stability and public compliance.";
  };

  // Generate an intuitive everyday analogy
  const generateAnalogy = () => {
    const t = item.title.toLowerCase();
    if (t.includes('locker theft')) return "🏨 Like a hotel safe box: the hotel promises physical security, but their compensation is tied to a set room formula, not the priceless heirloom you placed inside.";
    if (t.includes('tata sons') || t.includes('nbfc-ul')) return "🚗 Like upgrading to a Heavy Commercial Vehicle license: once your car becomes as big as a double-decker bus, you must follow strict commercial transport audits.";
    if (t.includes('cgsmfi')) return "🛡️ Like a government co-signer on a student loan: the bank feels confident giving money to small students because the government promises to step in if things go wrong.";
    if (t.includes('gi tag')) return "🏷️ Like a 'Champagne' or 'Parmesan' protected badge: nobody in another country or city can copy the name without making it in the authentic region.";
    if (t.includes('epf')) return "🏦 Like widening the entry door to the government retirement piggy bank so more middle-income workers get matching employer savings.";
    if (t.includes('upi mdr')) return "💳 Like a highway toll booth: after letting everyone drive for free during the introductory period, the highway authority sets up standard toll gates for commercial trucks.";
    if (t.includes('basel')) return "🥗 Like mandatory calorie labels on packaged food: banks cannot hide their financial junk food from the public.";
    if (t.includes('pm-setu')) return "🏫 Like replacing old manual typewriters in schools with modern high-speed AI laptops.";
    if (t.includes('pm-rahat')) return "🚑 An instant emergency credit card provided by the government during the critical 60 minutes after a highway crash.";
    return "⚖️ A systemic balancing rule ensuring that financial players operate with transparency, safety buffers, and accountability.";
  };

  return (
    <div className="explain-simply-container">
      {/* Top-right floating / embedded Hint Bulb trigger */}
      <button
        className={`btn-hint-bulb ${isOpen ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={isOpen ? "Close simple explanation" : "💡 Explain Simply (ELI5 & Jargon Buster)"}
        aria-label="Explain Simply"
      >
        <span className="hint-bulb-icon">💡</span>
        <span className="hint-bulb-text">{isOpen ? 'Hide' : 'Explain'}</span>
        {detectedJargon.length > 0 && !isOpen && (
          <span className="hint-bulb-badge" title={`${detectedJargon.length} key concepts identified`}>
            {detectedJargon.length}
          </span>
        )}
      </button>

      {/* Expanded Details Card */}
      {isOpen && (
        <div className="explain-simply-card" onClick={(e) => e.stopPropagation()}>
          <div className="explain-card-header">
            <div className="explain-badge-row">
              <span className="badge-layman">👶 PLAIN ENGLISH STORY</span>
              <span className="badge-analogy">🍕 EVERYDAY ANALOGY</span>
              <button className="btn-close-explain" onClick={() => setIsOpen(false)} title="Close">✕</button>
            </div>
            <h3 className="explain-headline">What is this news actually saying?</h3>
          </div>

          <div className="explain-story-box">
            <p className="explain-story-text">
              <strong>The 30-Second Story:</strong> {generateLaymanStory()}
            </p>
          </div>

          <div className="explain-analogy-box">
            <div className="analogy-icon">💡</div>
            <div className="analogy-content">
              <strong>Real-World Analogy:</strong>
              <p>{generateAnalogy()}</p>
            </div>
          </div>

          {/* Jargon Buster Chips */}
          {detectedJargon.length > 0 && (
            <div className="explain-jargon-section">
              <div className="jargon-section-title">
                🔤 <strong>Jargon Buster (Tap any term for instant breakdown):</strong>
              </div>
              <div className="jargon-chips-grid">
                {detectedJargon.map(j => (
                  <button
                    key={j.term}
                    className={`jargon-chip ${selectedJargon?.term === j.term ? 'selected' : ''}`}
                    onClick={() => setSelectedJargon(selectedJargon?.term === j.term ? null : j)}
                  >
                    <span className="jargon-chip-term">{j.term}</span>
                    <span className="jargon-chip-cat">{j.category}</span>
                  </button>
                ))}
              </div>

              {selectedJargon && (
                <div className="jargon-detail-card">
                  <div className="jargon-detail-header">
                    <h4>{selectedJargon.fullName} ({selectedJargon.term})</h4>
                    <span className="jargon-cat-badge">{selectedJargon.category}</span>
                  </div>
                  <p className="jargon-def"><strong>Meaning:</strong> {selectedJargon.laymanDefinition}</p>
                  <p className="jargon-analogy"><strong>Analogy:</strong> {selectedJargon.analogy}</p>
                  <div className="jargon-trap-alert">
                    <strong>🎯 Exam Trap:</strong> {selectedJargon.examTrap}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
