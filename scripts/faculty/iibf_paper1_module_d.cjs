const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', '..', 'content', 'note-registry.json');

const moduleDUnits = [
  {
    id: "iibf-ieifs-unit-25-financial-markets-overview",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 25: Financial Markets Structure (Money vs Capital, Primary vs Secondary)",
    summary: "Doctoral study unit on Financial Market classification, Money Market vs Capital Market horizons, Primary Market issuance mechanisms, and Secondary Market trading liquidity.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Market Segregation",
        summary: "Financial markets are divided by tenor into Money Markets (Maturity ≤ 1 Year, liquidity management) and Capital Markets (Maturity > 1 Year, long-term capital formation), operating across Primary (Issuance) and Secondary (Trading) venues."
      },
      {
        type: "heading",
        level: 2,
        text: "📊 1. Money Market vs. Capital Market Master Matrix"
      },
      {
        type: "table",
        caption: "Money Market vs Capital Market Comparison",
        headers: ["Parameter", "Money Market", "Capital Market"],
        rows: [
          ["Maturity Horizon", "**Short-Term (Up to 1 Year / 365 Days)**", "**Medium and Long-Term (Exceeding 1 Year)**"],
          ["Primary Regulator", "**Reserve Bank of India (RBI)**", "**Securities and Exchange Board of India (SEBI)**"],
          ["Core Instruments", "Call/Notice Money, T-Bills, Commercial Paper (CP), Certificates of Deposit (CD), TREPS, Commercial Bills.", "Equity Shares, Preference Shares, Debentures, Corporate Bonds, Government Securities (G-Secs), Derivatives."],
          ["Risk & Return", "**Low Risk, Low Return, High Liquidity**", "**Higher Risk, Higher Return, Variable Liquidity**"],
          ["Primary Participants", "RBI, Commercial Banks, Primary Dealers, Financial Institutions, Mutual Funds, Corporates.", "Retail Investors, Institutional Investors (FPIs, DIIs), Mutual Funds, Insurance Companies, Corporates."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 25:\n1. **Regulator Split:** **RBI regulates the Money Market and Forex Market**; **SEBI regulates the Capital Market and Securities Market**.\n2. **Maturity Boundary:** Exactly **1 Year (365 days)** separates Money Market instruments from Capital Market debt instruments."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit25", "financial-markets", "money-market", "capital-market", "rbi", "sebi"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module D - Financial Products and Services)"
    }
  },
  {
    id: "iibf-ieifs-unit-26-money-market-instruments",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 26: Money Market Instruments (Call Money, T-Bills, CP, CD & TREPS)",
    summary: "Exhaustive mathematical and statutory breakdown of Call/Notice/Term Money limits, Treasury Bills (91/182/364 days), Commercial Paper (min ₹5L), Certificates of Deposit (min ₹1L), and Triparty Repos.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Money Market Instruments Suite",
        summary: "Money market instruments provide short-term liquidity management for banks, the central government, and creditworthy corporate borrowers, issued at a discount to face value or at market-linked floating rates."
      },
      {
        type: "heading",
        level: 2,
        text: "⏱️ 1. Call, Notice & Term Money Market Tenors"
      },
      {
        type: "table",
        caption: "Interbank Uncollateralized Money Market Slabs",
        headers: ["Category", "Tenor / Duration", "Operational Purpose"],
        rows: [
          ["Call Money", "**Overnight (1 Day)**", "Managing immediate interbank reserve (CRR/SLR) mismatches."],
          ["Notice Money", "**2 Days to 14 Days**", "Short-term temporary liquidity balancing."],
          ["Term Money", "**15 Days up to 1 Year**", "Medium liquidity borrowing without collateral."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📜 2. Treasury Bills (T-Bills) Master Structure"
      },
      {
        type: "table",
        caption: "Government of India Treasury Bills (Issued by RBI on behalf of GoI)",
        headers: ["T-Bill Tenor", "Auction Frequency", "Minimum Denomination & Method"],
        rows: [
          ["91-Day T-Bill", "Weekly (Every Wednesday)", "Issued in multiples of **₹10,000**. **Issued at a discount to face value and redeemed at par (₹100)**. Zero default sovereign risk."],
          ["182-Day T-Bill", "Weekly (Every Wednesday)", "Yield is calculated based on discount: $$\\text{Yield} = \\frac{F - P}{P} \\times \\frac{365}{D} \\times 100$$"],
          ["364-Day T-Bill", "Weekly (Every Wednesday)", "Eligible for SLR maintenance by banks."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📑 3. Commercial Paper (CP) vs. Certificates of Deposit (CD)"
      },
      {
        type: "table",
        caption: "CP vs CD Comparison Matrix",
        headers: ["Parameter", "Commercial Paper (CP)", "Certificates of Deposit (CD)"],
        rows: [
          ["Issuer", "Highly rated Corporates, Primary Dealers (PDs), AIFIs", "Scheduled Commercial Banks and All-India Financial Institutions"],
          ["Instrument Nature", "Unsecured promissory note", "Negotiable, transferable promissory note against term deposits"],
          ["Minimum Denomination", "**₹5 Lakh** (and in multiples of ₹5 Lakh thereafter)", "**₹1 Lakh** (and in multiples of ₹1 Lakh thereafter)"],
          ["Maturity / Tenor Range", "**Min 7 Days up to Max 1 Year**", "**Banks:** Min 7 Days to Max 1 Year;\n**FIs:** Min 1 Year to Max 3 Years"],
          ["Eligible Rating Requirement", "Credit rating of **A3** (or equivalent) minimum", "Credit rating mandatory if issued by FIs (not strictly required for SCBs)"],
          ["Loans Against Instrument", "**Strictly PROHIBITED** (Banks cannot grant loans against CP)", "**Strictly PROHIBITED** (Banks cannot grant loans against CD)"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🤝 4. Triparty Repo (TREPS)"
      },
      {
        type: "bullet_list",
        items: [
          "**Definition:** A repo contract where a **Third Party (Clearing Corporation of India Ltd - CCIL)** acts as an intermediary between borrowing and lending institutions to provide collateral selection, payment settlement, and management services.",
          "**Advantage over Bilateral Repo:** Eliminates counterparty credit risk (CCIL acts as central counterparty and guarantees settlement)."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 26:\n1. **CP vs CD Minimum Amount:** Commercial Paper is **₹5 Lakh**; Certificate of Deposit is **₹1 Lakh**.\n2. **Loans Against CP/CD:** Banks **CANNOT grant loans against their own CDs or CPs**.\n3. **Call vs Notice Money:** Call Money is **1 day**; Notice Money is **2 to 14 days**.\n4. **T-Bills Issuance:** T-Bills are **issued at a discount and redeemed at par (zero coupon)**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit26", "money-market", "call-money", "t-bills", "commercial-paper", "certificates-of-deposit", "treps"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module D - Financial Products and Services)"
    }
  },
  {
    id: "iibf-ieifs-unit-27-capital-markets-and-stock-exchanges",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 27: Capital Markets, Stock Exchanges & Depository Architecture",
    summary: "Doctoral study unit on BSE, NSE, NSDL, CDSL, Primary Market offerings (IPO, FPO, Rights, QIP, OFS), ASBA mechanism, T+1 settlement cycle, and SEBI ICDR regulations.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Capital Market Infrastructure",
        summary: "Capital markets enable corporations and the government to raise long-term equity and debt capital from investors, supported by paperless electronic dematerialized settlement via Depositories under SEBI oversight."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Stock Exchanges & Depositories in India"
      },
      {
        type: "table",
        caption: "Core Capital Market Infrastructure Entities",
        headers: ["Entity Name", "Establishment Year & Landmark", "Core Role & Trading Platform"],
        rows: [
          ["BSE (Bombay Stock Exchange)", "**1875** (Oldest stock exchange in Asia; Native Share & Stock Brokers' Association)", "Operates Sensex (30 large-cap stocks); demutualized in 2005; HQ: Dalal Street, Mumbai."],
          ["NSE (National Stock Exchange)", "**1992** (Pherwani Committee; commenced operations in 1994)", "Pioneered nation-wide screen-based trading; operates Nifty 50; largest derivatives exchange."],
          ["NSDL (National Securities Depository Limited)", "**August 1996** (Promoted by NSE, UTI, IDBI)", "1st Depository in India; holds securities in electronic (demat) format."],
          ["CDSL (Central Depository Services Limited)", "**February 1999** (Promoted by BSE, SBI, HDFC Bank, etc.)", "2nd Depository in India; largest depository by total demat account count."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📑 2. Primary Market Capital Issuance Mechanisms"
      },
      {
        type: "table",
        caption: "Methods of Raising Capital in Primary Market",
        headers: ["Issue Type", "Legal Definition", "Target Investor Base"],
        rows: [
          ["Initial Public Offering (IPO)", "Unlisted company offering shares to public for the first time on stock exchange.", "Retail Individual Investors (RII), Non-Institutional Investors (NII), Qualified Institutional Buyers (QIB)."],
          ["Follow-on Public Offering (FPO)", "Already listed company issuing additional fresh shares to the public.", "General public & institutions."],
          ["Rights Issue", "Company issues fresh shares to **existing shareholders** in proportion to their existing holding.", "Existing shareholders as on record date at discounted price."],
          ["Bonus Issue", "Capitalization of reserves into free additional shares to existing shareholders.", "Existing shareholders (Free of cost; share price adjusts downwards)."],
          ["Qualified Institutional Placement (QIP)", "Fast-track private placement of equity/convertibles to **Qualified Institutional Buyers (QIBs)**.", "Exclusive to Mutual Funds, Insurance companies, FPIs; no retail participation."],
          ["Offer for Sale (OFS)", "Promoters/Large shareholders dilute their existing stake directly via exchange bidding.", "Public & institutional buyers."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "⚡ 3. ASBA Mechanism & T+1 Settlement Cycle"
      },
      {
        type: "bullet_list",
        items: [
          "**Applications Supported by Blocked Amount (ASBA):** Mandatory application mechanism for IPOs/Rights. The application money **remains in the investor's own bank account (blocked/lien marked)** and is debited ONLY upon successful share allotment, earning normal savings bank interest until debit.",
          "**T+1 Rolling Settlement:** In January 2023, India became the **first major economy to transition 100% of equity trades to T+1 settlement** (trade settles within 24 hours of execution). Beta launch of **T+0 same-day settlement** introduced in 2024."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 27:\n1. **ASBA Fund Location:** Application money is **NOT transferred to company** during bidding — it remains blocked in the investor's own savings/current account until allotment.\n2. **Asia's Oldest Stock Exchange:** **BSE** (Founded in 1875).\n3. **1st Depository in India:** **NSDL** (1996)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit27", "capital-markets", "bse", "nse", "nsdl", "cdsl", "ipo", "asba", "t1-settlement"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module D - Financial Products and Services)"
    }
  },
  {
    id: "iibf-ieifs-unit-28-fixed-income-and-debt-securities",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 28: Fixed Income Securities, G-Secs, Yield Curves & Duration",
    summary: "Comprehensive mathematical breakdown of Government Securities (G-Secs), State Development Loans (SDLs), Sovereign Gold Bonds (SGBs), Clean vs Dirty Price, Yield to Maturity (YTM), and Macaulay/Modified Duration.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Bond Valuation & Price-Yield Inverse Relationship",
        summary: "Bond prices and market yields share a strictly inverse relationship (\\(\\text{Yield} \\uparrow \\implies \\text{Bond Price} \\downarrow\\)). Bond duration quantifies interest rate risk (the sensitivity of bond price to yield fluctuations)."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Sovereign Debt Instruments: G-Secs, SDLs & SGBs"
      },
      {
        type: "table",
        caption: "Sovereign & Quasi-Sovereign Debt Profile",
        headers: ["Instrument", "Issuing Authority & Backing", "Key Coupon / Tenor Features"],
        rows: [
          ["Central Government Securities (G-Secs / Dated Securities)", "Issued by RBI on behalf of Government of India", "Fixed coupon (semi-annual payout); Tenors up to 40-50 years; 100% sovereign risk-free; SLR eligible."],
          ["State Development Loans (SDLs)", "Issued by RBI on behalf of 28 State Governments", "Semi-annual interest; yields typically 30–60 bps higher than Central G-Secs; SLR eligible."],
          ["Sovereign Gold Bonds (SGBs)", "Issued by RBI on behalf of Central Government", "Denominated in grams of gold (min 1g; max 4kg individual); Tenor **8 years (exit option after 5th yr)**; **Fixed interest rate of 2.50% p.a.** payable semi-annually; **Capital gains tax exempt** on redemption at maturity."],
          ["Inflation Indexed Bonds (IIBs)", "Government of India / RBI", "Principal and coupon payments indexed to CPI inflation to protect real returns."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📐 2. Bond Pricing: Clean Price vs. Dirty Price"
      },
      {
        type: "formula",
        latex: "\\text{Dirty Price (Invoice Price)} = \\text{Clean Price (Quoted Price)} + \\text{Accrued Interest}",
        explanation: "Accrued interest is the interest earned since the last coupon payment date."
      },
      {
        type: "heading",
        level: 2,
        text: "🧮 3. Yield to Maturity (YTM) & Duration Formulas"
      },
      {
        type: "table",
        caption: "Bond Valuation Metrics",
        headers: ["Metric", "Mathematical Concept / Formula", "Economic & Trading Significance"],
        rows: [
          ["Yield to Maturity (YTM)", "$$\\text{Internal Rate of Return (IRR) of all bond cash flows}$$", "Expected total rate of return earned by an investor who holds the bond until maturity and reinvests all coupons at YTM."],
          ["Macaulay Duration (\\(D_{\\text{mac}}\\))", "$$D_{\\text{mac}} = \\frac{\\sum \\frac{t \\cdot C_t}{(1+y)^t}}{\\text{Bond Price}}$$", "**Weighted average maturity of cash flows** (measured in years). For a zero-coupon bond, Macaulay Duration **equals its maturity**."],
          ["Modified Duration (\\(D_{\\text{mod}}\\))", "$$D_{\\text{mod}} = \\frac{D_{\\text{mac}}}{1 + \\frac{y}{m}}$$", "**Measures percentage change in bond price for a 1% change in yield**: $$\\frac{\\Delta P}{P} \\approx - D_{\\text{mod}} \\times \\Delta y$$"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📈 4. The 4 Shapes of the Yield Curve"
      },
      {
        type: "bullet_list",
        items: [
          "**1. Normal Yield Curve (Upward Sloping):** Long-term bond yields are higher than short-term yields (reflects economic expansion and normal term premium).",
          "**2. Inverted Yield Curve (Downward Sloping):** Short-term yields are higher than long-term yields (**Classic predictor of impending economic recession**).",
          "**3. Flat Yield Curve:** Short-term and long-term yields are identical (transition phase between expansion and contraction).",
          "**4. Humped Yield Curve:** Medium-term yields are higher than both short-term and long-term yields."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 28:\n1. **Zero-Coupon Bond Duration:** Macaulay Duration of a Zero-Coupon Bond is **exactly equal to its maturity period**.\n2. **Price vs Yield:** When interest rates rise, bond prices **fall**; when interest rates fall, bond prices **rise**.\n3. **SGB Interest Rate & Tenor:** **2.50% p.a.** paid semi-annually; Tenor is **8 years with exit option after 5 years**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit28", "fixed-income", "g-secs", "sdls", "sgb", "dirty-price", "duration", "yield-curve"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module D - Financial Products and Services)"
    }
  },
  {
    id: "iibf-ieifs-unit-29-derivatives-market",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 29: Derivatives Market (Forwards, Futures, Options & Swaps)",
    summary: "Doctoral study unit on Forward Contracts vs Futures, Call & Put Options payoff profiles, Moneyness (ITM, ATM, OTM), Interest Rate Swaps (IRS), and Credit Default Swaps (CDS).",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Derivatives Contract Architecture",
        summary: "A derivative is a financial contract whose value is derived from the performance of an underlying asset (Stock, Index, Interest Rate, Commodity, Currency), utilized for hedging risk, speculation, and arbitrage."
      },
      {
        type: "heading",
        level: 2,
        text: "⚖️ 1. Forward Contracts vs. Futures Contracts"
      },
      {
        type: "table",
        caption: "Forwards vs. Futures Comparison",
        headers: ["Parameter", "Forward Contract", "Futures Contract"],
        rows: [
          ["Trading Venue", "**Over-the-Counter (OTC)** (Private bilateral agreement)", "**Standardized Exchange-Traded** (BSE, NSE)"],
          ["Contract Terms", "Customized to specific buyer/seller requirements (custom size & expiry)", "**Standardized lot size, tick size, and expiry dates**"],
          ["Counterparty Risk", "**High Counterparty Default Risk**", "**Zero Counterparty Risk** (Guaranteed by Clearing Corporation/NSCCL)"],
          ["Settlement & Margining", "Settled at maturity date", "**Marked-to-Market (MTM) daily** with Initial Margin & Maintenance Margin"],
          ["Liquidity & Reversal", "Illiquid; difficult to cancel prior to maturity", "**Highly Liquid**; position can be squared off anytime during trading hours"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📈 2. Options Architecture (Call vs. Put & Moneyness)"
      },
      {
        type: "table",
        caption: "Options Contracts Matrix",
        headers: ["Option Type", "Buyer's Right / Position", "Seller's (Writer) Obligation", "Moneyness Condition (where \\(S = \\text{Spot}\\), \\(K = \\text{Strike}\\))"],
        rows: [
          ["Call Option (Right to BUY)", "Buyer has the right (but no obligation) to **BUY** underlying asset at strike price \\(K\\). Max Loss = Premium Paid; Max Profit = Unlimited.", "Seller receives premium; obligated to SELL asset if buyer exercises.", "**ITM (In-the-Money):** \\(S > K\\)\n**ATM (At-the-Money):** \\(S = K\\)\n**OTM (Out-of-the-Money):** \\(S < K\\)"],
          ["Put Option (Right to SELL)", "Buyer has the right (but no obligation) to **SELL** underlying asset at strike price \\(K\\). Max Loss = Premium Paid; Max Profit = Substantial (up to strike price).", "Seller receives premium; obligated to BUY asset if buyer exercises.", "**ITM (In-the-Money):** \\(S < K\\)\n**ATM (At-the-Money):** \\(S = K\\)\n**OTM (Out-of-the-Money):** \\(S > K\\)"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🔄 3. Swaps & Credit Default Swaps (CDS)"
      },
      {
        type: "bullet_list",
        items: [
          "**Interest Rate Swap (IRS - Plain Vanilla):** Agreement between two parties to exchange interest rate cash flows based on a specified **notional principal amount**. Party A pays a **Fixed Rate** and receives a **Floating Rate (e.g. MIBOR / SOFR)**; Party B does the opposite.",
          "**Credit Default Swap (CDS):** Financial credit derivative where the **Protection Buyer** pays periodic fees (premium) to the **Protection Seller** in exchange for a payoff if a reference entity suffers a credit event (default, bankruptcy, debt restructuring)."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 29:\n1. **Option Buyer Risk:** Maximum loss of an option buyer is **strictly limited to the premium paid**; potential profit on a Call option is **theoretically unlimited**.\n2. **Option Seller Risk:** Option seller's maximum profit is **strictly limited to the premium received**; potential loss is **unlimited**.\n3. **Futures Settlement:** Futures are **Marked-to-Market (MTM) daily** on the exchange."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit29", "derivatives", "forwards", "futures", "options", "call-option", "put-option", "swaps", "cds"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module D - Financial Products and Services)"
    }
  },
  {
    id: "iibf-ieifs-unit-30-mutual-funds-and-aif",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 30: Mutual Funds, Alternate Investment Funds (AIF) & REITs/InvITs",
    summary: "Doctoral study unit on Mutual Fund 3-Tier Trust Structure, NAV calculations, SEBI scheme categorization, AIF Categories (I, II, III), Real Estate Investment Trusts (REITs), and InvITs.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Collective Investment Vehicles",
        summary: "Mutual funds pool savings from thousands of retail investors to invest in a diversified portfolio of securities managed by professional Asset Management Companies (AMCs) under the SEBI (Mutual Funds) Regulations, 1996."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Mutual Fund Legal & Operational Trust Structure"
      },
      {
        type: "table",
        caption: "Mutual Fund 4-Tier Legal Entity Architecture",
        headers: ["Tier Entity", "Legal Form & Appointment", "Core Fiduciary / Operational Role"],
        rows: [
          ["1. Sponsor", "Promoter of the Mutual Fund (Bank, FI, Corporate)", "Contributes initial capital (min ₹50 Cr net worth); establishes the Trust under Indian Trusts Act, 1882."],
          ["2. Board of Trustees / Trustee Company", "Trustees (At least 2/3rd must be independent)", "Holds fund assets in trust for unit holders; enforces fiduciary duty over AMC; oversees SEBI compliance."],
          ["3. Asset Management Company (AMC)", "Company registered under Companies Act, approved by SEBI", "Investment manager; deploys pool into stocks/bonds; CIO, Fund Managers, Research Analysts."],
          ["4. Custodian", "Independent entity registered with SEBI", "Safekeeping of physical securities and demat holding; independent from AMC."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🧮 2. Net Asset Value (NAV) Calculation Formula"
      },
      {
        type: "formula",
        latex: "\\text{NAV per Unit} = \\frac{\\text{Market Value of Investments} + \\text{Receivables} + \\text{Other Assets} - \\text{Accrued Expenses} - \\text{Liabilities}}{\\text{Total Number of Outstanding Units}}",
        explanation: "Computed daily at the close of trading hours by AMCs."
      },
      {
        type: "heading",
        level: 2,
        text: "💼 3. Alternate Investment Funds (AIF) Categories (SEBI AIF Regulations 2012)"
      },
      {
        type: "table",
        caption: "AIF Category Slabs (Minimum Investment: ₹1 Crore per investor; ₹25 Lakh for employees/directors)",
        headers: ["AIF Category", "Fund Types Included", "Investment Focus & Regulatory Incentives"],
        rows: [
          ["Category I AIF", "Venture Capital Funds (VCF), Angel Funds, Social Impact Funds, Infrastructure Funds, SME Funds.", "Invests in start-ups, early-stage ventures, and social infrastructure. **Granted tax pass-through status and government incentives**."],
          ["Category II AIF", "Private Equity (PE) Funds, Debt Funds, Real Estate Funds, Funds for Distressed Assets.", "Invests primarily in unlisted equity and debt instruments; **no leverage permitted** except for day-to-day operational requirements. Granted tax pass-through."],
          ["Category III AIF", "Hedge Funds, PIPE Funds, Complex Trading Strategy Funds.", "Employs diverse or complex trading strategies; **can undertake leverage and short-selling in listed/unlisted derivatives**. Taxed at fund level (MMR)."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🏢 4. REITs and InvITs"
      },
      {
        type: "bullet_list",
        items: [
          "**Real Estate Investment Trusts (REITs):** Investment vehicles that own, operate, or finance income-generating commercial real estate (office parks, malls). Must distribute **at least 90% of Net Distributable Cash Flows (NDCF) to unitholders semi-annually**.",
          "**Infrastructure Investment Trusts (InvITs):** Pools money to invest in long-term operational infrastructure assets (toll roads, power transmission grids, telecom towers, gas pipelines). 90% NDCF distribution mandate."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 30:\n1. **AIF Minimum Ticket Size:** Minimum investment in Category I, II, and III AIFs is **₹1 Crore** (₹25 Lakh for Angel Fund investors).\n2. **REIT / InvIT Payout Mandate:** Must distribute **at least 90% of Net Distributable Cash Flows** to investors.\n3. **Independent Trustees:** At least **two-thirds (66.6%)** of the directors of the Trustee Company must be independent."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit30", "mutual-funds", "nav", "aif", "reits", "invits", "sebi"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module D - Financial Products and Services)"
    }
  },
  {
    id: "iibf-ieifs-unit-31-insurance-and-pension-products",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 31: Insurance Principles, IRDAI Bima Trinity & Pension Systems (NPS)",
    summary: "Doctoral study unit on Fundamental Insurance Principles (Indemnity, Uberrima Fides, Subrogation), Life vs General Insurance, IRDAI Bima Trinity (Sugam, Vistar, Vahak), and the National Pension System (NPS Tier 1 & 2).",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Risk Transfer & Indemnity",
        summary: "Insurance is a cooperative risk-pooling contract whereby the insurer agrees to indemnify the insured against specified contingent financial losses in exchange for premium payments, governed by statutory principles under the Insurance Act, 1938 and IRDA Act, 1999."
      },
      {
        type: "heading",
        level: 2,
        text: "📜 1. Fundamental Legal Principles of Insurance"
      },
      {
        type: "table",
        caption: "Core Insurance Contractual Doctrines",
        headers: ["Principle", "Legal Maxim", "Operational Meaning & Exception"],
        rows: [
          ["1. Utmost Good Faith", "*Uberrima Fides*", "Both parties must fully disclose all material facts. Non-disclosure or concealment renders the contract voidable."],
          ["2. Insurable Interest", "Financial stake in subject matter", "The insured must suffer a direct financial loss if the insured event occurs. **Life insurance:** Must exist at policy inception. **Marine insurance:** Must exist at time of loss. **Fire insurance:** Must exist at BOTH inception and loss."],
          ["3. Principle of Indemnity", "Restoration to exact financial state", "The insured cannot make a profit from insurance; compensation is limited to the exact financial loss. **Strictly APPLIES to General Insurance; DOES NOT apply to Life Insurance** (Human life cannot be measured in cash)."],
          ["4. Principle of Subrogation", "Transfer of rights to recovery", "Upon paying the total claim, the insurer steps into the shoes of the insured to recover damages from third-party wrongdoers."],
          ["5. Proximate Cause", "*Causa Proxima*", "The active, efficient cause that sets in motion a train of events leading to loss; insurer is liable only if the proximate cause is an insured peril."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 2. IRDAI 'Insurance for All by 2047' & The Bima Trinity"
      },
      {
        type: "table",
        caption: "The Bima Trinity Architectural Pillars",
        headers: ["Pillar", "Component Platform", "Core Function & Public Value"],
        rows: [
          ["Pillar 1: Bima Sugam", "Digital public infrastructure marketplace (UPI for Insurance)", "One-stop electronic platform for buying, servicing, policy portability, and instant claims settlement across all insurers."],
          ["Pillar 2: Bima Vistar", "All-in-one comprehensive micro-insurance product", "Affordable bundled cover providing basic Life, Health, Accident, and Property protection with predefined parametric payouts."],
          ["Pillar 3: Bima Vahak", "Women-centric grassroots distribution force", "Gram Panchayat-level women distribution agents dedicated to expanding insurance literacy and onboarding rural households."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "👴 3. National Pension System (NPS Architecture under PFRDA)"
      },
      {
        type: "table",
        caption: "NPS Tier 1 vs Tier 2 Account Comparison",
        headers: ["Parameter", "NPS Tier 1 (Pension Account)", "NPS Tier 2 (Savings Account)"],
        rows: [
          ["Account Nature", "**Mandatory Primary Retirement Account**", "**Voluntary Withdrawable Investment Account** (Requires active Tier 1)"],
          ["Withdrawal Rules", "**Strictly Locked-in until age 60**. At age 60: Minimum **40% must be annuitized** for monthly pension; up to **60% can be withdrawn as tax-free lump sum**.", "**Completely Free / Unrestricted Withdrawals** anytime."],
          ["Tax Benefits", "**Eligible for Income Tax deductions** under Section 80CCD(1), 80CCD(1B) (additional ₹50,000), and 80CCD(2).", "**Zero tax deduction** for private citizens (except for Central Govt employees with 3-year lock-in under Sec 80C)."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 31:\n1. **Indemnity in Life Insurance:** The Principle of Indemnity **DOES NOT apply to Life Insurance** (a person can hold multiple life policies and all will pay full sum assured).\n2. **Insurable Interest Timing:** In Fire Insurance, insurable interest must exist **both at inception and at the time of loss**.\n3. **NPS Annuitization at Age 60:** Minimum **40% of accumulated corpus must be converted into an Annuity**; remaining 60% can be withdrawn lump-sum tax-free."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit31", "insurance", "indemnity", "insurable-interest", "bima-trinity", "nps", "pfrda", "annuity"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module D - Financial Products and Services)"
    }
  },
  {
    id: "iibf-ieifs-unit-32-factoring-forfaiting-and-treds",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 32: Factoring, Forfaiting and TReDS Architecture",
    summary: "Exhaustive synthesis of Factoring vs Forfaiting, Recourse vs Non-Recourse, Factoring Regulation (Amendment) Act 2021, and the Trade Receivables Discounting System (TReDS) mechanism.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Receivables Management",
        summary: "Factoring and Forfaiting are specialized financial services where a business sells its accounts receivables (invoices) to a specialized financial intermediary (Factor/Forfaiter) to unlock immediate working capital liquidity."
      },
      {
        type: "heading",
        level: 2,
        text: "⚖️ 1. Factoring vs. Forfaiting Master Comparison Matrix"
      },
      {
        type: "table",
        caption: "Factoring vs. Forfaiting Structural Differences",
        headers: ["Parameter", "Factoring", "Forfaiting"],
        rows: [
          ["Scope of Trade", "Usually **Domestic Trade** (also International Factoring)", "Strictly **International Export Trade**"],
          ["Receivables Nature", "**Short-term receivables** (Maturity up to 90–180 days)", "**Medium to Long-term capital goods exports** (1 year up to 5–7 years)"],
          ["Credit Recourse", "Can be **With Recourse** (Client bears bad debt) or **Without Recourse** (Factor bears credit loss)", "**Strictly WITHOUT RECOURSE** (Forfaiter bears 100% credit risk; exporter is completely protected)"],
          ["Instrument Used", "Ordinary commercial invoices & book debts", "Negotiable debt instruments (**Bills of Exchange, Promissory Notes avalised/guaranteed by importer's bank**)"],
          ["Financing Percentage", "Advance payment typically **75% to 85%** of invoice value; balance paid on realization minus fees", "**100% of invoice value** discounted upfront (minus forfaiting discount)"],
          ["Sales Ledger Administration", "Factor provides full sales ledger administration, collection, and advisory services", "Pure financing transaction; no sales ledger management provided"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "⚡ 2. Trade Receivables Discounting System (TReDS)"
      },
      {
        type: "paragraph",
        content: "Set up under RBI guidelines pursuant to the Payment and Settlement Systems Act, 2007:"
      },
      {
        type: "bullet_list",
        items: [
          "**Three Operational Participants:** (1) **MSME Sellers**, (2) **Corporate / PSU / Government Department Buyers**, (3) **Financiers (Banks & NBFC Factors)**.",
          "**Mandatory Onboarding Mandate:** All Central Public Sector Enterprises (CPSEs) and companies with an annual turnover of **₹250 Crore or more** (and ₹500 Crore in earlier guidelines) must register on TReDS.",
          "**Bidding & Non-Recourse Discounting:** Financiers bid transparently on uploaded invoices/factoring units. Once accepted, payment is credited to the MSME seller within **T+1 days on a strictly without-recourse basis**."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 32:\n1. **Forfaiting Recourse:** Forfaiting is **ALWAYS Without Recourse** to the exporter.\n2. **TReDS Mandatory Registration Threshold:** Corporates with turnover of **₹250 Crore and above** + all CPSEs.\n3. **Factoring Advance:** Advance payment is typically **80–85%**, NOT 100% (the remaining 15–20% retention money is paid after final collection)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit32", "factoring", "forfaiting", "treds", "msme-receivables", "without-recourse"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module D - Financial Products and Services)"
    }
  },
  {
    id: "iibf-ieifs-unit-33-foreign-exchange-market",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 33: Foreign Exchange Market, Quotes, FEMA 1999 & NRI Accounts",
    summary: "Doctoral study unit on Forex Market Structure (AD Cat I, II, III), Direct vs Indirect Quotes, Value Dates (Cash/TOM/Spot/Forward), LRS ($250,000), Nostro/Vostro/Loro accounts, and NRE/NRO/FCNR(B) deposits.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Foreign Exchange Operating Architecture",
        summary: "The Indian foreign exchange market operates under the Foreign Exchange Management Act (FEMA), 1999 and RBI regulations through Authorized Dealers, governed by FEDAI market conventions."
      },
      {
        type: "heading",
        level: 2,
        text: "💱 1. Settlement Value Dates in Forex Market"
      },
      {
        type: "table",
        caption: "Forex Settlement Tenor Types (FEDAI Conventions)",
        headers: ["Transaction Type", "Value Date / Settlement Day", "Operational Definition"],
        rows: [
          ["Cash / Ready", "**Same Day (T + 0)**", "Settlement of funds occurs on the very day of the deal."],
          ["TOM (Tomorrow)", "**Next Working Day (T + 1)**", "Settlement occurs on the working day following the deal date."],
          ["Spot Rate", "**Second Working Day (T + 2)**", "**Standard international benchmark forex rate**. Settlement takes place two business days after transaction date."],
          ["Forward Rate", "**Beyond Spot Date (T + 2 + n days)**", "Settlement takes place on an agreed future date beyond the spot date at a predetermined forward rate."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🏦 2. Interbank Account Types: Nostro, Vostro, Loro"
      },
      {
        type: "table",
        caption: "Foreign Currency Accounts Nomenclature",
        headers: ["Account Name", "Latin / Literal Meaning", "Operational Concept & Example"],
        rows: [
          ["Nostro Account", "**'Our account with you'**", "An account maintained by an **Indian bank with a foreign bank abroad in foreign currency** (e.g. SBI maintaining a USD account with Citibank, New York)."],
          ["Vostro Account", "**'Your account with us'**", "An account maintained by a **foreign bank in India with an Indian bank in Indian Rupees** (e.g. HSBC London maintaining an INR account with SBI, Mumbai)."],
          ["Loro Account", "**'Their account'**", "Referring to an account of a third-party bank (e.g. Bank of Baroda referring to SBI's account with Citibank New York)."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "💰 3. Non-Resident Indian (NRI) Deposit Accounts Comparison"
      },
      {
        type: "table",
        caption: "NRE vs NRO vs FCNR(B) Accounts",
        headers: ["Parameter", "Non-Resident External (NRE) A/c", "Non-Resident Ordinary (NRO) A/c", "Foreign Currency Non-Resident (Bank) A/c - FCNR(B)"],
        rows: [
          ["Currency Maintained", "**Indian Rupees (INR)**", "**Indian Rupees (INR)**", "**Designated Foreign Currencies** (USD, EUR, GBP, JPY, CAD, AUD)"],
          ["Type of Account", "Savings, Current, Recurring, Fixed", "Savings, Current, Recurring, Fixed", "**Term Deposit (Fixed) ONLY** (1 to 5 years)"],
          ["Repatriability", "**100% Freely Repatriable** (Principal and interest)", "Restricted (Current income repatriable; principal up to **USD 1 Million per FY**) with CA cert.", "**100% Freely Repatriable** (Principal and interest)"],
          ["Exchange Rate Risk", "**Borne by Depositor** (Conversion into INR)", "**Borne by Depositor**", "**Zero Exchange Risk** (Maintained in foreign currency; risk borne by bank)"],
          ["Taxability in India", "**100% Tax Exempt** (Zero income/wealth tax on interest)", "**Taxable in India** (TDS applicable at 30% + surcharge)", "**100% Tax Exempt** in India"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "✈️ 4. Liberalised Remittance Scheme (LRS)"
      },
      {
        type: "bullet_list",
        items: [
          "**Permissible Limit:** Resident individuals (including minors) can freely remit up to **USD 250,000 per financial year (April–March)** for any permissible current or capital account transaction (education, medical treatment, travel, gifts, investment in overseas shares/property).",
          "**Exclusions:** LRS is **NOT available to Corporates, Partnerships, HUF, Trusts, or Charitable bodies** (Individuals only)."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 33:\n1. **Spot Date:** Settles on **T + 2 working days**.\n2. **NRE vs NRO Tax:** NRE interest is **Tax-Free**; NRO interest is **Taxable**.\n3. **LRS Annual Cap:** **USD 250,000 per Financial Year** (strictly for resident individuals).\n4. **FCNR(B) Account Type:** Available **ONLY as Term / Fixed Deposit** (1 to 5 years)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit33", "forex", "spot-date", "nostro", "vostro", "nre", "nro", "fcnr", "lrs"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module D - Financial Products and Services)"
    }
  },
  {
    id: "iibf-ieifs-unit-34-core-banking-green-finance",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 34: Core Banking Solutions, ESG Risk, Green Bonds & BRSR Framework",
    summary: "Doctoral study unit on CBS 24x7 real-time centralized architecture, AI/ML in credit scoring, Cybersecurity framework, Sovereign Green Bonds (SGrBs), and SEBI BRSR Core disclosures.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Modern Banking Tech & Sustainability",
        summary: "Modern banking integrates 24x7 centralized Core Banking Systems (CBS) with frontier technologies (AI, Blockchain, Open Banking APIs) while aligning asset portfolios with Environmental, Social, and Governance (ESG) criteria."
      },
      {
        type: "heading",
        level: 2,
        text: "💻 1. Core Banking Solutions (CBS) Architecture"
      },
      {
        type: "table",
        caption: "Core Banking Systems in India",
        headers: ["Parameter", "Traditional Branch Banking", "Core Banking Solutions (CBS)"],
        rows: [
          ["Account Concept", "Customer was a customer of a specific branch", "**Customer of the entire bank** across all domestic and international branches"],
          ["Data Storage", "Decentralized localized branch servers", "**Centralized Datacenter** with Disaster Recovery (DR) and Near-DR sites"],
          ["Transaction Processing", "End of day batch processing", "**Real-time online processing 24x7x365**"],
          ["Major CBS Software", "N/A", "**Finacle (Infosys)**, **BaNCS (TCS)**, **Flexcube (Oracle)**"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🌱 2. Green Finance & Sovereign Green Bonds (SGrBs)"
      },
      {
        type: "bullet_list",
        items: [
          "**Sovereign Green Bonds (SGrBs):** Issued by RBI on behalf of GoI to mobilize resources for green public sector projects (Renewable Energy, Clean Transportation, Water Management, Green Buildings).",
          "**Greenium (Green Premium):** Green bonds often price at a slight yield discount (greenium) due to high ESG investor demand.",
          "**Business Responsibility and Sustainability Reporting (BRSR):** Mandated by SEBI for the **Top 1,000 listed entities by market capitalization**. Includes **BRSR Core** with mandatory third-party reasonable assurance on 9 ESG attributes (GHG emissions, water footprint, gender diversity, supply chain transparency)."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 34:\n1. **BRSR Mandatory Scope:** Top **1,000 listed entities** by market capitalization on Indian stock exchanges.\n2. **Core Banking Architecture:** CBS converts the customer into a **customer of the bank**, not just the branch.\n3. **Greenium Definition:** The yield difference between a regular bond and a green bond of identical maturity (green bond trading at lower yield due to ESG premium)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit34", "cbs", "finacle", "bancs", "green-bonds", "sgrb", "brsr", "esg"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module D - Financial Products and Services)"
    }
  }
];

// Write physical corpus files and update note registry
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
let startNoteNum = 579;

moduleDUnits.forEach((unit, idx) => {
  const filePath = path.join(corpusDir, `${unit.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(unit, null, 2), 'utf-8');
  console.log(`✅ Written ${unit.id}.json`);

  const currentNum = startNoteNum + idx;
  registry[String(currentNum)] = {
    noteNumber: currentNum,
    id: unit.id,
    title: unit.title,
    domain: unit.domain,
    category: unit.metadata.category,
    file: `content/corpus/${unit.id}.json`
  };
});

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
console.log(`🎉 Ingested all Module D Units (Units 25 to 34) into note-registry.json (#579 to #588)!`);
