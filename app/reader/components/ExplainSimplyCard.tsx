import React, { useState } from 'react';
import { KnowledgeItem, SemanticBlock } from '../../../schema/knowledge-item';
import { detectJargonInText, JargonEntry } from '../glossary/jargonGlossary';

interface Props {
  item: KnowledgeItem;
}

interface ClusterAction {
  code: string;
  headline: string;
  plainEnglish: string;
  whyItMatters: string;
}

export const ExplainSimplyCard: React.FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedJargon, setSelectedJargon] = useState<JargonEntry | null>(null);

  // Combine full text of the item for jargon analysis
  const fullText = `${item.title} ${item.summary || ''} ${item.blocks.map(b => 'content' in b ? b.content : ('items' in b ? (b.items as string[]).join(' ') : '')).join(' ')}`;
  const detectedJargon = detectJargonInText(fullText);

  // Decompose cluster / multi-action notes into distinct digestible items
  const parseClusterActions = (): ClusterAction[] => {
    const actions: ClusterAction[] = [];
    const t = item.title.toLowerCase();

    // Specific decomposition for SEBI Cluster (Note 22)
    if (t.includes('sebi') && t.includes('cluster')) {
      return [
        {
          code: "A",
          headline: "GARUDA Fast-Track for Private Funds (AIFs)",
          plainEnglish: "Private equity and venture capital funds can now launch and start investing just 10 days after submitting documents, instead of waiting months for SEBI's manual stamp.",
          whyItMatters: "Speeds up startup and private investments into India without bureaucratic delays."
        },
        {
          code: "B",
          headline: "New Closing Auction Session (CAS) for F&O Stocks (3:15–3:35 PM)",
          plainEnglish: "For volatile derivative stocks, regular continuous trading stops at 3:15 PM. A pooled closing auction runs from 3:15 to 3:35 PM to calculate the true final closing price.",
          whyItMatters: "Stops big institutional traders and algorithmic bots from artificially spiking or crashing stock prices in the last 10 seconds of market close."
        },
        {
          code: "C",
          headline: "Digital Accessibility Audit Deadline (Oct 31, 2026)",
          plainEnglish: "All trading websites and broker apps must be made 100% accessible for differently-abled citizens (screen readers, high contrast) under the RPwD Act.",
          whyItMatters: "Ensures financial markets and investing apps are universally accessible to all citizens."
        },
        {
          code: "D",
          headline: "Off-Market Sale of Unlisted Shares (≤200 Buyers)",
          plainEnglish: "If a company or bank (like IDBI) sells unlisted shares privately to fewer than 200 investors in a financial year, it is treated as a private deal, not a public stock issue.",
          whyItMatters: "Gives institutions clarity so they can sell private equity stakes without triggering heavy public IPO rules."
        },
        {
          code: "E",
          headline: "Anti-'Purpose-Washing' on Green/ESG Bonds",
          plainEnglish: "Companies issuing 'Green Bonds' cannot just pretend to be eco-friendly. They must track and prove every rupee went into real solar, water, or clean tech projects.",
          whyItMatters: "Prevents corporate 'greenwashing' and protects investors who put money into sustainable funds."
        },
        {
          code: "F",
          headline: "Foreign Receipts (DRs) for REITs & InvITs",
          plainEnglish: "Indian real estate and highway/power grid trusts can now issue depository receipts on foreign stock exchanges.",
          whyItMatters: "Attracts massive billions in foreign pension and sovereign wealth capital into Indian roads and tech parks."
        },
        {
          code: "G",
          headline: "Municipal Debt & City Bonds Relaxation",
          plainEnglish: "Municipal corporations get more time to submit audited accounts (up to 90 days), but must lock at least 1 full year's interest in a secure escrow account.",
          whyItMatters: "Makes city infrastructure bonds safer for retail and institutional investors while giving cities breathing room."
        },
        {
          code: "H & I",
          headline: "Foreign Investors in Commodity Derivatives & Stress Testing",
          plainEnglish: "Foreign Portfolio Investors (FPIs) can trade non-agricultural commodities (like metals and crude) with mandatory settlement safeguards, and clearing corporations had their safety stress test buffers calibrated.",
          whyItMatters: "Deepens Indian commodity markets with foreign liquidity while guaranteeing zero clearing house default risk."
        },
        {
          code: "J",
          headline: "Retail F&O Risk Curbs (Retail losses fell to ₹91,685 Cr)",
          plainEnglish: "SEBI raised minimum contract trade sizes and mandated upfront cash margins for stock options to protect everyday retail individuals from losing their savings.",
          whyItMatters: "Retail traders lost over ₹91,000 crore gambling in high-risk options; SEBI is enforcing guardrails to prevent household wealth destruction."
        }
      ];
    }

    // Generic extractor for any other multi-action / cluster note
    item.blocks.forEach((block: SemanticBlock, idx: number) => {
      if (block.type === 'paragraph' && 'content' in block) {
        const text = block.content;
        const match = text.match(/^\*\*([A-Z0-9\.\-\)\s]+)\*\*\s*—?\s*(.*)/);
        if (match) {
          const rawCode = match[1].trim();
          const rest = match[2];
          actions.push({
            code: rawCode.length < 5 ? rawCode : `#${idx + 1}`,
            headline: rawCode.length >= 5 ? rawCode : rest.split('—')[0]?.substring(0, 45) || `Action ${rawCode}`,
            plainEnglish: rest.replace(/\*\*/g, ''),
            whyItMatters: "Part of regulatory harmonization and institutional compliance."
          });
        }
      }
    });

    return actions;
  };

  const clusterActions = parseClusterActions();
  const isCluster = clusterActions.length > 1;

  // Single-note Layman Story
  const generateLaymanStory = () => {
    const t = item.title.toLowerCase();
    if (t.includes('300 gw') || t.includes('non-fossil')) {
      return "India reached 300.50 GW of clean, non-coal power capacity — already crossing 54% of all total electricity capacity in the country. To accelerate this, global asset manager Brookfield launched a new $600M dedicated India clean energy platform called 'Lumara'.";
    }
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

  const generateAnalogy = () => {
    const t = item.title.toLowerCase();
    if (t.includes('300 gw')) return "⚡ Like a hybrid car that now runs 54% of its daily commute purely on clean battery power, steadily heading toward the 100% clean energy goal.";
    if (t.includes('sebi') && t.includes('cluster')) return "🚦 Like upgrading city traffic rules all at once: fast lanes for verified cars, strict speed traps on dangerous curves, and mandatory safety belts for all drivers.";
    if (t.includes('locker theft')) return "🏨 Like a hotel safe box: the hotel promises physical security, but their compensation is tied to a set room formula, not the priceless heirloom you placed inside.";
    if (t.includes('tata sons') || t.includes('nbfc-ul')) return "🚗 Like upgrading to a Heavy Commercial Vehicle license: once your car becomes as big as a double-decker bus, you must follow strict commercial transport audits.";
    if (t.includes('cgsmfi')) return "🛡️ Like a government co-signer on a student loan: the bank feels confident giving money to small students because the government promises to step in if things go wrong.";
    if (t.includes('gi tag')) return "🏷️ Like a 'Champagne' or 'Parmesan' protected badge: nobody in another country or city can copy the name without making it in the authentic region.";
    if (t.includes('epf')) return "🏦 Like widening the entry door to the government retirement piggy bank so more middle-income workers get matching employer savings.";
    return "⚖️ A systemic balancing rule ensuring that financial players operate with transparency, safety buffers, and accountability.";
  };

  return (
    <div className="explain-simply-container">
      {/* Top-right subtle Hint Bulb trigger */}
      <button
        className={`btn-hint-bulb ${isOpen ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={isOpen ? "Close plain English breakdown" : "💡 Explain Simply (ELI5 & Action Breakdown)"}
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

      {/* Expanded Details Drawer (Kindle / Soft Paper Theme — Zero Neon Glare) */}
      {isOpen && (
        <div className="explain-simply-card" onClick={(e) => e.stopPropagation()}>
          <div className="explain-card-header">
            <div className="explain-badge-row">
              <span className="badge-layman">{isCluster ? `📚 Action Breakdown (${clusterActions.length} actions)` : '👶 Plain English Story'}</span>
              <span className="badge-analogy">🎯 Core Logic</span>
              <button className="btn-close-explain" onClick={() => setIsOpen(false)} title="Close">✕</button>
            </div>
            <h3 className="explain-headline">{isCluster ? `Breaking down all regulatory actions in plain words:` : `What is this news actually saying?`}</h3>
          </div>

          {/* If Cluster Note: Show Action-by-Action Plain English Breakdown */}
          {isCluster ? (
            <div className="explain-cluster-stack">
              {clusterActions.map((act, i) => (
                <div key={i} className="explain-cluster-item">
                  <div className="cluster-item-top">
                    <span className="cluster-item-code">{act.code}</span>
                    <strong className="cluster-item-title">{act.headline}</strong>
                  </div>
                  <p className="cluster-item-plain">{act.plainEnglish}</p>
                  <div className="cluster-item-why">
                    <span className="why-label">🎯 Why SEBI / Regulator Did It:</span> {act.whyItMatters}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
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
            </>
          )}

          {/* Jargon Buster Chips */}
          {detectedJargon.length > 0 && (
            <div className="explain-jargon-section">
              <div className="jargon-section-title">
                🔤 <strong>Tap any key term for instant plain-English definition:</strong>
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
