const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', '..', 'content', 'note-registry.json');

const moduleBUnits = [
  {
    id: "iibf-ieifs-unit-8-fundamentals-micro-macro-markets",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 8: Fundamentals of Economics, Micro & Macro, and Market Structures",
    summary: "Doctoral study unit on Scarcity, Choice, Positive vs Normative Economics, Consumer Surplus, and the 4 Primary Market Forms (Perfect Competition, Monopoly, Monopolistic, Oligopoly & Kinked Demand Curve).",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Market Structure Classification",
        summary: "Market structures are classified by the number of buyers/sellers, product differentiation, barriers to entry, and pricing power: from Perfect Competition (Price Takers, Horizontal Demand Curve) to Pure Monopoly (Single Seller, High Barriers, Price Maker)."
      },
      {
        type: "heading",
        level: 2,
        text: "📊 1. Comprehensive Market Structures Comparison Matrix"
      },
      {
        type: "table",
        caption: "The 4 Core Market Forms (IIBF Benchmark)",
        headers: ["Market Form", "Number of Sellers & Buyers", "Nature of Product", "Entry & Exit Barriers", "Price Control Power", "Demand Curve Shape Faced by Firm"],
        rows: [
          ["Perfect Competition", "Very large number of buyers and sellers", "Homogeneous (Identical goods)", "Completely Free (Zero barriers)", "**Zero Price Control** (Firm is a **Price Taker**; Price determined by industry)", "**Perfectively Elastic (Horizontal Straight Line, \\(E_d = \\infty\\))** where \\(P = AR = MR\\)."],
          ["Monopoly", "Single seller, vast number of buyers", "Unique product (No close substitutes)", "Extremely High / Absolute barriers (patents, natural monopoly)", "**Full Price Control** (Firm is a **Price Maker**)", "**Downward Sloping (Inelastic)**; \\(MR < AR\\)."],
          ["Monopolistic Competition", "Large number of sellers", "**Differentiated Products** (branding, packaging, advertising)", "Free entry and exit in the long run", "**Partial Price Control** (brand loyalty allows slight price discretion)", "**Downward Sloping (Highly Elastic)** due to close substitutes."],
          ["Oligopoly", "Few large dominant firms", "Homogeneous (Pure) or Differentiated (Imperfect)", "Substantial entry barriers (high capital scale)", "**Mutual Interdependence & Strategic Pricing** (Cartels, Price Rigidity)", "**Kinked Demand Curve (Paul Sweezy Model)**: Highly elastic above ruling price, highly inelastic below."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📉 2. The Sweezy Kinked Demand Curve in Oligopoly"
      },
      {
        type: "paragraph",
        content: "Paul Sweezy formulated the **Kinked Demand Curve hypothesis** to explain **Price Rigidity** in oligopolistic markets (e.g. Telecom, Airline industry):"
      },
      {
        type: "bullet_list",
        items: [
          "**Asymmetric Rival Reactions:** If an oligopolist raises its price, rivals will **not follow**, causing the firm to lose a large market share (**Elastic upper segment**).",
          "**If an oligopolist lowers its price:** Rivals will **immediately match the price cut** to prevent losing customers, resulting in little gain in sales (**Inelastic lower segment**).",
          "**Discontinuous Marginal Revenue (MR):** The kink in the demand curve creates a vertical gap in the \\(MR\\) curve, meaning costs can change without altering the equilibrium market price."
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "💡 3. Consumer Surplus & Price Discrimination"
      },
      {
        type: "bullet_list",
        items: [
          "**Consumer Surplus (Alfred Marshall):** The difference between what a consumer is **willing to pay** and what they **actually pay** (\\(\\text{Consumer Surplus} = \\text{Total Utility} - \\text{Total Expenditure}\\)).",
          "**1st Degree Price Discrimination (Perfect):** Monopolist charges the maximum price each consumer is willing to pay; captures **100% of consumer surplus**.",
          "**2nd Degree Price Discrimination:** Pricing varies according to the quantity consumed (e.g. bulk utility discounts, slab-based electricity tariffs).",
          "**3rd Degree Price Discrimination:** Market segmentation based on consumer elasticity (e.g. railway ticket discounts for senior citizens vs commercial travelers; student discounts)."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 8:\n1. **Perfect Competition Demand Curve:** The demand curve facing an individual competitive firm is **horizontally flat (perfectly elastic, \\(E_d = \\infty\\))** where \\(P = AR = MR\\).\n2. **Kinked Demand Curve Founder:** Formulated by **Paul Sweezy** to explain price rigidity in Oligopoly.\n3. **1st Degree Price Discrimination:** Results in **zero consumer surplus** remaining with consumers."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B ESI", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit8", "microeconomics", "market-structures", "oligopoly", "kinked-demand", "price-discrimination"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module B - Economic Concepts Related to Banking)"
    }
  },
  {
    id: "iibf-ieifs-unit-9-supply-and-demand-elasticity",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 9: Law of Demand, Supply & Elasticity Formulas",
    summary: "Exhaustive mathematical and conceptual analysis of Price, Income, and Cross Elasticity of Demand, Giffen vs Veblen Goods, Equilibrium Shifts, and Government Price Controls.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Elasticity of Demand",
        summary: "Price Elasticity of Demand (\\(E_p\\)) quantifies the percentage responsiveness of quantity demanded to a percentage change in price. It dictates pricing power and tax incidence in banking and industrial economics."
      },
      {
        type: "heading",
        level: 2,
        text: "📐 1. Price Elasticity Formulas & Degrees"
      },
      {
        type: "formula",
        latex: "E_p = -\\frac{\\% \\Delta Q_d}{\\% \\Delta P} = -\\left( \\frac{\\Delta Q}{\\Delta P} \\times \\frac{P}{Q} \\right)",
        explanation: "Point Price Elasticity of Demand formula."
      },
      {
        type: "table",
        caption: "5 Degrees of Price Elasticity of Demand",
        headers: ["Degree / Value of \\(E_p\\)", "Technical Classification", "Curve Shape", "Commodity Example"],
        rows: [
          ["\\(E_p = 0\\)", "Perfectively Inelastic", "Vertical straight line", "Life-saving drugs (Insulin), Salt."],
          ["\\(0 < E_p < 1\\)", "Inelastic (Less than unit elastic)", "Steeply downward sloping", "Necessities, electricity, water."],
          ["\\(E_p = 1\\)", "Unitary Elastic", "Rectangular Hyperbola", "Standard consumer goods where total expenditure remains constant."],
          ["\\(1 < E_p < \\infty\\)", "Elastic (More than unit elastic)", "Flatter downward sloping", "Luxury items, automobiles, air travel, electronics."],
          ["\\(E_p = \\infty\\)", "Perfectively Elastic", "Horizontal straight line", "Firm demand in Perfect Competition."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🔄 2. Income Elasticity & Cross Elasticity Rules"
      },
      {
        type: "table",
        caption: "Income Elasticity (\\(E_y\\)) & Cross Elasticity (\\(E_{xy}\\)) Classification",
        headers: ["Elasticity Type", "Mathematical Value", "Economic Relationship / Classification"],
        rows: [
          ["Income Elasticity (\\(E_y\\))", "\\(E_y > 0\\) (Positive)", "**Normal Goods** (Demand rises as consumer income rises)."],
          ["Income Elasticity (\\(E_y\\))", "\\(E_y > 1\\) (Positive & >1)", "**Luxury Goods / Superior Goods**."],
          ["Income Elasticity (\\(E_y\\))", "\\(E_y < 0\\) (Negative)", "**Inferior Goods** (Demand drops as income rises, e.g. coarse cereals)."],
          ["Cross Elasticity (\\(E_{xy}\\))", "\\(E_{xy} > 0\\) (Positive)", "**Substitute Goods** (Price rise in Tea increases demand for Coffee)."],
          ["Cross Elasticity (\\(E_{xy}\\))", "\\(E_{xy} < 0\\) (Negative)", "**Complementary Goods** (Price rise in Petrol decreases demand for Cars)."],
          ["Cross Elasticity (\\(E_{xy}\\))", "\\(E_{xy} = 0\\) (Zero)", "**Unrelated Goods** (Price of Shoes vs Demand for Apples)."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "⚡ 3. Exceptions to the Law of Demand"
      },
      {
        type: "bullet_list",
        items: [
          "**Giffen Goods (Sir Robert Giffen):** Highly inferior staple goods consumed by low-income households (e.g. potatoes, bread). A price rise forces poor consumers to abandon meat/vegetables and consume even more staple potatoes (**Upward sloping demand curve**). Negative income effect outweighs substitution effect.",
          "**Veblen Goods / Conspicuous Consumption (Thorstein Veblen):** Luxury status symbols (diamonds, supercars, designer watches). Higher price enhances exclusivity and status appeal, increasing demand.",
          "**Speculative Bubbles:** When prices of stocks, real estate, or gold rise, investors buy more expecting further future price gains."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 9:\n1. **Cross Elasticity Signs:** Substitutes have **Positive (\\(+\\))** cross elasticity; Complements have **Negative (\\(-\\))** cross elasticity.\n2. **Giffen vs Inferior Goods:** All Giffen goods are inferior goods, but **NOT all inferior goods are Giffen goods**.\n3. **Unitary Elasticity Curve:** A demand curve with unitary elasticity throughout is shaped as a **Rectangular Hyperbola**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B ESI", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit9", "demand", "supply", "elasticity", "giffen-goods", "veblen-goods", "cross-elasticity"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module B - Economic Concepts Related to Banking)"
    }
  },
  {
    id: "iibf-ieifs-unit-10-money-supply-and-inflation",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 10: Money Supply Measures (M0-M4, L1-L3) & Inflation Mechanics",
    summary: "Complete mathematical and regulatory masterclass on RBI Money Aggregates, Money Multiplier, CPI vs WPI, Demand-Pull vs Cost-Push, Phillips Curve, and Section 45ZA Flexible Inflation Targeting.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Money Aggregates & Inflation Control",
        summary: "Reserve Money (\\(M_0\\)) is high-powered central bank money that multiplies through the commercial banking credit creation mechanism into Broad Money (\\(M_3\\)). RBI manages liquidity to anchor headline CPI inflation at 4% ± 2% under the statutory MPC mandate."
      },
      {
        type: "heading",
        level: 2,
        text: "💰 1. Reserve Bank of India Money Supply Measures (M0 to M4)"
      },
      {
        type: "table",
        caption: "RBI Monetary Aggregates Definitions",
        headers: ["Aggregate", "Official Technical Formula", "Classification & Characteristics"],
        rows: [
          ["Reserve Money (\\(M_0\\))", "$$\\text{Currency in Circulation} + \\text{Bankers' Deposits with RBI} + \\text{'Other' Deposits with RBI}$$", "**High-Powered Money / Monetary Base**. Base on which commercial bank credit expands."],
          ["Narrow Money (\\(M_1\\))", "$$\\text{Currency with the Public} + \\text{Demand Deposits with Banking System} + \\text{'Other' Deposits with RBI}$$", "**Most Liquid Money Aggregate**. Instant transactional liquidity."],
          ["\\(M_2\\)", "$$M_1 + \\text{Savings Deposits with Post Office Savings Banks}$$", "Narrow Money + Post Office savings."],
          ["Broad Money (\\(M_3\\))", "$$M_1 + \\text{Time Deposits with the Banking System}$$", "**Most Widely Used Measure of Money Supply in India**. Primary intermediate target for monetary policy analysis."],
          ["\\(M_4\\)", "$$M_3 + \\text{Total Deposits with Post Office (Excluding NSC)}$$", "Broadest measure; includes all post office deposits except National Savings Certificates."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🧮 2. Money Multiplier Formula & Credit Creation"
      },
      {
        type: "formula",
        latex: "m = \\frac{M_3}{M_0} = \\frac{1 + c}{c + r}",
        explanation: "Where \\(c = \\frac{C}{D}\\) is the Currency-Deposit Ratio and \\(r = \\frac{R}{D}\\) is the Reserve-Deposit Ratio (CRR + excess cash reserves)."
      },
      {
        type: "paragraph",
        content: "**Key Multiplier Invariants:**\n• If **Cash Reserve Ratio (CRR)** increases ➔ Reserve ratio \\(r\\) increases ➔ Money Multiplier \\(m\\) **decreases** ➔ Total money supply in the economy contracts.\n• If the public holds more physical cash (higher \\(c\\)) ➔ Multiplier \\(m\\) decreases (cash leakage from banking system)."
      },
      {
        type: "heading",
        level: 2,
        text: "📈 3. Inflation Measurement: CPI vs. WPI Comparison Matrix"
      },
      {
        type: "table",
        caption: "CPI-Combined vs. WPI in India",
        headers: ["Parameter", "Consumer Price Index (CPI-Combined)", "Wholesale Price Index (WPI)"],
        rows: [
          ["Official Anchor", "**Official Nominal Anchor for Monetary Policy (since 2014, Urjit Patel Comm)**", "Used for wholesale/producer price tracking; no longer RBI monetary target."],
          ["Published By", "National Statistical Office (NSO), MoSPI", "Office of Economic Adviser, Ministry of Commerce & Industry"],
          ["Base Year", "**2012 = 100**", "**2011-12 = 100**"],
          ["Commodity Basket", "Covers **Goods and Services** (448 rural / 460 urban items)", "Covers **Goods Only (Services are 100% EXCLUDED)** (697 items)"],
          ["Major Weights", "**Food & Beverages: 45.86%** > Misc/Services: 28.32% > Housing: 10.07% > Fuel: 6.84%", "**Manufactured Products: 64.23%** > Primary Articles: 22.62% > Fuel & Power: 13.15%"],
          ["Inflation Target Mandate", "**4.0% with a tolerance band of ± 2% (2.0% to 6.0%)** under Section 45ZA of RBI Act 1934", "N/A"]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "⚡ 4. Types of Inflation & The Phillips Curve"
      },
      {
        type: "bullet_list",
        items: [
          "**Demand-Pull Inflation:** Occurs when Aggregate Demand exceeds Aggregate Supply (\\(AD > AS\\)) at full employment (*'Too much money chasing too few goods'*).",
          "**Cost-Push Inflation:** Driven by sudden supply-side shocks (crude oil spikes, wage hikes, geopolitical supply chain bottlenecks).",
          "**Headline Inflation:** Total unadjusted CPI inflation reflecting all items in the basket including volatile food and fuel.",
          "**Core Inflation:** **Headline CPI minus volatile Food and Fuel components** (measures underlying persistent inflationary trends).",
          "**The Phillips Curve (A.W. Phillips):** Shows an **inverse/negative trade-off between Inflation and Unemployment in the short run** (Lower unemployment is accompanied by higher inflation). However, in the long run (Milton Friedman), the Phillips curve is **vertical at the Natural Rate of Unemployment (NAIRU)**.",
          "**Stagflation:** Lethal macroeconomic scenario featuring **Stagnant economic growth / high unemployment + High inflation** simultaneously."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 10:\n1. **WPI vs CPI Services:** WPI **does NOT include services**; CPI includes both goods and services.\n2. **RBI Monetary Policy Target:** Headline **CPI-Combined (Base 2012=100)** is the target, NOT WPI or Core inflation.\n3. **Broad Money Aggregate:** \\(M_3\\) is **\\(M_1 + \\text{Time Deposits with Banks}\\)** (does NOT include Post Office time deposits).\n4. **Statutory Inflation Target:** **4% with ± 2% band (2% to 6%)** under Section 45ZA of the Reserve Bank of India Act, 1934."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2 ESI", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit10", "money-supply", "m0-m4", "money-multiplier", "cpi", "wpi", "phillips-curve", "inflation-targeting"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module B - Economic Concepts Related to Banking)"
    }
  },
  {
    id: "iibf-ieifs-unit-11-theories-of-interest",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 11: Theories of Interest (Classical, Keynesian & IS-LM Curve)",
    summary: "Doctoral breakdown of Classical Thrift/Productivity Theory, Neo-Classical Loanable Funds, Keynesian Liquidity Preference (3 Motives & Liquidity Trap), and the Hicks-Hansen IS-LM Synthesis.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Determination of Interest Rates",
        summary: "Interest is the price paid for parting with liquidity or the rental price of capital. Theories evolve from real economic factors (Savings & Investment in Classical model) to monetary factors (Money Supply & Demand in Keynesian model), culminated by the IS-LM general equilibrium."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Classical vs. Neo-Classical Loanable Funds Theory"
      },
      {
        type: "table",
        caption: "Pre-Keynesian Interest Rate Theories",
        headers: ["Theory Name", "Key Economists", "Determinants of Interest Rate", "Equilibrium Condition"],
        rows: [
          ["Classical Theory", "Adam Smith, David Ricardo, Alfred Marshall", "Purely **Real Factors**: (1) **Thrift/Savings** (supply of capital, upward sloping) and (2) **Productivity of Capital/Investment** (demand for capital, downward sloping).", "Equilibrium where **Savings = Investment (\\(S = I\\))**."],
          ["Loanable Funds Theory", "Knut Wicksell, Bertil Ohlin, Gunnar Myrdal", "Synthesizes real and monetary factors. **Supply of Loanable Funds (\\(S + \\Delta M + DH\\))** vs **Demand for Loanable Funds (\\(I + H + DS\\))**.", "Equilibrium where **Total Supply of Loanable Funds = Total Demand for Loanable Funds**."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🧠 2. Keynesian Liquidity Preference Theory (3 Motives)"
      },
      {
        type: "paragraph",
        content: "John Maynard Keynes (*General Theory, 1936*) defined interest as a **purely monetary phenomenon** — the reward for parting with liquidity for a specified period. Demand for money (\\(L\\)) arises from **3 distinct motives**:"
      },
      {
        type: "table",
        caption: "Keynesian 3 Motives for Holding Cash",
        headers: ["Liquidity Motive", "Purpose & Driver", "Relationship with Income (\\(Y\\)) vs Interest Rate (\\(r\\))"],
        rows: [
          ["1. Transactions Motive (\\(L_1\\))", "Day-to-day purchases of goods and services by households and business operational expenses.", "**Directly proportional to Income (\\(Y\\))**; completely interest-inelastic."],
          ["2. Precautionary Motive (\\(L_1\\))", "Emergency buffer for unforeseen contingencies (medical crises, accidents, business downturns).", "**Directly proportional to Income (\\(Y\\))**; interest-inelastic."],
          ["3. Speculative Motive (\\(L_2\\))", "Holding cash to take advantage of future movements in bond prices and interest rates.", "**Inversely related to Interest Rate (\\(r\\))** (When interest rates are high, speculative demand is low; when interest rates are low, demand is high)."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "🪤 3. The Liquidity Trap Phenomenon"
      },
      {
        type: "paragraph",
        content: "A **Liquidity Trap** occurs at an ultra-low rate of interest where the speculative demand for money becomes **infinitely elastic (horizontal)**:"
      },
      {
        type: "bullet_list",
        items: [
          "**Investor Psychology:** Everyone expects interest rates to rise in the future (and bond prices to collapse). Thus, no one buys bonds; everyone holds 100% cash.",
          "**Monetary Policy Impotence:** Central bank injections of liquidity are completely absorbed by the public without lowering interest rates or stimulating investment. **Monetary policy becomes totally ineffective; Fiscal Policy (Government spending) is required to revive demand**."
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "⚖️ 4. Hicks-Hansen IS-LM Synthesis (General Equilibrium)"
      },
      {
        type: "table",
        caption: "IS-LM Curve Framework",
        headers: ["Curve", "Market Represented", "Equilibrium Condition", "Slope & Behavioral Rationale"],
        rows: [
          ["IS Curve (Investment-Saving)", "**Goods / Real Market**", "$$\\text{Investment} = \\text{Saving} \\quad (I = S)$$", "**Downward Sloping**: Lower interest rate stimulates investment, requiring higher national income (\\(Y\\)) to generate matching savings."],
          ["LM Curve (Liquidity-Money)", "**Money / Financial Market**", "$$\\text{Money Demand} = \\text{Money Supply} \\quad (L = M)$$", "**Upward Sloping**: Higher national income (\\(Y\\)) increases transactional demand for money, pushing up interest rate (\\(r\\)) for a given money supply."],
          ["IS-LM Intersection", "**Simultaneous Equilibrium**", "$$\\text{Both Goods and Money Markets in Equilibrium}$$", "Determines unique combination of **Equilibrium National Income (\\(Y^*\\))** and **Equilibrium Interest Rate (\\(r^*\\))**."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 11:\n1. **Transactions & Precautionary Motives:** Dependent on **Income (\\(Y\\))**, NOT on interest rates.\n2. **Speculative Motive:** Inversely related to **Interest Rate (\\(r\\))**.\n3. **Liquidity Trap:** Occurs when the speculative demand curve becomes **horizontal (infinitely elastic)**, rendering monetary policy completely ineffective.\n4. **IS Curve represents:** Equilibrium in the **Goods Market (\\(I = S\\))**; LM represents equilibrium in the **Money Market (\\(L = M\\))**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B ESI", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit11", "theories-of-interest", "keynes", "liquidity-preference", "liquidity-trap", "is-lm"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module B - Economic Concepts Related to Banking)"
    }
  },
  {
    id: "iibf-ieifs-unit-12-business-cycles",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 12: Business Cycles, Economic Indicators & Theoretical Models",
    summary: "Detailed analysis of the 4 Business Cycle phases (Prosperity, Boom, Recession, Depression), Leading/Lagging/Coincident indicators, Schumpeter's Innovation Theory, and Hawtrey's Monetary Theory.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Cyclical Fluctuations",
        summary: "Business cycles represent recurring, non-periodic rhythmic expansions and contractions in aggregate economic activity (GDP, Employment, Output, Credit) across the entire economic system."
      },
      {
        type: "heading",
        level: 2,
        text: "🔄 1. The Four Phases of a Business Cycle"
      },
      {
        type: "table",
        caption: "Business Cycle 4-Phase Progression",
        headers: ["Phase", "Macroeconomic Features", "Credit & Banking Impact", "Policy Stance Required"],
        rows: [
          ["1. Prosperity / Expansion", "Rising output, employment, investment, wages, and consumer demand.", "Accelerating credit growth; low NPAs; expanding bank balance sheets.", "Neutral to watchful tightening."],
          ["2. Peak / Boom", "Full employment capacity reached; bottleneck constraints; overheating; asset price inflation.", "High credit demand; high interest rates; potential over-leveraging.", "**Contractionary Monetary Policy** (Rate hikes, CRR hikes) to curb overheating."],
          ["3. Recession / Contraction", "Decelerating growth; falling orders; unsold inventory; declining profits and business confidence.", "Slowing credit demand; early signs of asset quality stress.", "Rate cuts; liquidity infusion."],
          ["4. Trough / Depression", "Widespread unemployment; idle industrial capacity; negative GDP growth; rock-bottom confidence.", "Credit contraction; high NPAs; risk aversion among lenders.", "**Expansionary Monetary & Counter-cyclical Fiscal Stimulus** (Infra spending)."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📊 2. Classification of Economic Indicators"
      },
      {
        type: "table",
        caption: "Economic Indicators Classification Matrix",
        headers: ["Indicator Type", "Behavior Relative to Cycle", "Key Indian & Global Examples"],
        rows: [
          ["Leading Indicators", "**Changes BEFORE the economy starts following a particular trend**; used to forecast turning points.", "Stock market indices (Sensex/Nifty), Building permits / Housing starts, Yield Curve slope, Manufacturing PMI new orders."],
          ["Coincident Indicators", "**Occurs AT THE SAME TIME as the economy shifts**; reflects current aggregate health.", "Gross Domestic Product (GDP), Index of Industrial Production (IIP), Retail Sales, GST Collections, Current Employment levels."],
          ["Lagging Indicators", "**Changes only AFTER the economy has already entered a phase**; confirms long-term trends.", "Unemployment rate, Average prime lending rate, Consumer Price Index (CPI), Gross Non-Performing Assets (GNPA) ratio."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📚 3. Major Business Cycle Theories"
      },
      {
        type: "bullet_list",
        items: [
          "**Schumpeter's Innovation Theory (Joseph Schumpeter):** Business cycles are driven by waves of **innovations and technological breakthroughs** (Steam engine, Railways, Electricity, Internet, AI) introduced by entrepreneurs, creating periods of 'Creative Destruction'.",
          "**Hawtrey's Monetary Theory (R.G. Hawtrey):** Business cycles are **purely monetary phenomena**. Changes in bank credit flow and interest rates dictate dealer inventory stocking and subsequent output swings.",
          "**Hayek's Monetary Over-Investment Theory (Friedrich Hayek):** Artificial lowering of interest rates below natural rate by banks causes over-investment in capital goods, leading to inevitable crisis.",
          "**Keynesian Psychological Theory:** Swings in **Marginal Efficiency of Capital (MEC)** and 'Animal Spirits' (optimism vs pessimism of investors) drive investment fluctuations."
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 12:\n1. **Leading vs Lagging:** **Stock Market (Sensex)** is a **Leading Indicator**; **Unemployment rate and NPAs** are **Lagging Indicators**.\n2. **Schumpeter Theory:** Associated with **Innovation and Creative Destruction**.\n3. **Hawtrey Theory:** Asserts business cycles are **purely monetary phenomena**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B ESI", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit12", "business-cycles", "leading-indicators", "lagging-indicators", "schumpeter", "hawtrey"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module B - Economic Concepts Related to Banking)"
    }
  },
  {
    id: "iibf-ieifs-unit-13-monetary-policy-and-fiscal-policy",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 13: Monetary & Fiscal Policy Frameworks, Deficit Metrics & FRBM",
    summary: "Exhaustive synthesis of RBI Monetary Policy tools (Repo, SDF, MSF, CRR, SLR), MPC composition, Fiscal Deficit formulas, Primary Deficit, FRBM Act benchmarks, and counter-cyclical fiscal policy.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Policy Transmission Architecture",
        summary: "Macroeconomic management rests on the twin pillars of Monetary Policy (RBI controlling money supply, cost of credit, and liquidity) and Fiscal Policy (Ministry of Finance managing revenue mobilization, government expenditure, and public debt)."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. RBI Monetary Policy Operating Framework (Liquidity Management)"
      },
      {
        type: "table",
        caption: "RBI Monetary Policy Instruments Master Matrix",
        headers: ["Instrument", "Nature / Type", "Statutory Provision / Benchmark", "Operational Mechanism"],
        rows: [
          ["Policy Repo Rate", "Quantitative (Direct Liquidity)", "Key Policy Signal Rate", "Rate at which RBI lends short-term liquidity to banks against approved government securities."],
          ["Standing Deposit Facility (SDF)", "Quantitative (Liquidity Absorption)", "Introduced in April 2022 (Sec 17(1A) RBI Act)", "**Floor of LAF corridor** (25 bps below Repo). Absorbs surplus liquidity from banks **WITHOUT requiring collateral G-Secs**."],
          ["Marginal Standing Facility (MSF)", "Quantitative (Penal Emergency Window)", "**Ceiling of LAF corridor** (25 bps above Repo)", "Overnight liquidity window for banks experiencing severe liquidity mismatch; allows dipping into SLR quota up to specified limit."],
          ["Bank Rate", "Quantitative (Long-Term Reference)", "Section 49 of RBI Act 1934", "Standard rate at which RBI buys or rediscounts bills of exchange; penal rate for CRR/SLR defaults (aligned with MSF rate)."],
          ["Cash Reserve Ratio (CRR)", "Quantitative (Reserve Requirement)", "Section 42(1) of RBI Act 1934", "Specified percentage of **Net Demand and Time Liabilities (NDTL)** that banks must maintain as **cash balances with RBI**. Earns **zero interest**."],
          ["Statutory Liquidity Ratio (SLR)", "Quantitative (Reserve Requirement)", "Section 24 of Banking Regulation Act 1949", "Specified percentage of NDTL maintained in **unencumbered approved securities (G-Secs, T-Bills), cash, or gold**. Cap: 40%."],
          ["Open Market Operations (OMO)", "Quantitative (Outright Purchases/Sales)", "Discretionary open market intervention", "RBI buys G-Secs to inject durable liquidity; sells G-Secs to absorb liquidity."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "👥 2. Monetary Policy Committee (MPC) Statutory Structure"
      },
      {
        type: "bullet_list",
        items: [
          "**Statutory Basis:** Constituted under **Section 45ZB of the Reserve Bank of India Act, 1934** (amended in 2016).",
          "**Composition:** Exactly **6 Members**:\n  1. **RBI Governor** — Ex-officio Chairperson.\n  2. **RBI Deputy Governor in charge of Monetary Policy** — Ex-officio Member.\n  3. **One Officer of RBI nominated by Central Board** — Ex-officio Member.\n  4. **Three External Experts appointed by Central Government** (Tenure of 4 years; not eligible for re-appointment).",
          "**Quorum & Decision Rule:** Quorum is **4 members** (must include Governor or Deputy Governor). Decisions made by majority vote; **Governor holds a casting vote in case of a tie**."
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📐 3. Fiscal Deficit Metrics & Mathematical Formulas"
      },
      {
        type: "table",
        caption: "Government Deficit Formulas & Economic Meanings",
        headers: ["Deficit Metric", "Mathematical Formula", "Core Economic Meaning"],
        rows: [
          ["Revenue Deficit (RD)", "$$\\text{Revenue Expenditure} - \\text{Revenue Receipts}$$", "Measures government dissaving; borrowing used purely for day-to-day operational consumption."],
          ["Fiscal Deficit (FD)", "$$\\text{Total Expenditure} - (\\text{Revenue Receipts} + \\text{Non-Debt Capital Receipts})$$", "**Total borrowing requirement of the government from all sources** in a financial year."],
          ["Primary Deficit (PD)", "$$\\text{Fiscal Deficit} - \\text{Interest Payments}$$", "Measures government borrowing requirement excluding the burden of past accumulated debt interest obligations."],
          ["Effective Revenue Deficit (ERD)", "$$\\text{Revenue Deficit} - \\text{Grants for Creation of Capital Assets}$$", "Excludes capital asset building grants given to States from revenue deficit."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 13:\n1. **SDF Collateral:** Standing Deposit Facility absorbs liquidity **WITHOUT any G-Sec collateral**.\n2. **CRR Section vs SLR Section:** CRR is under **Section 42(1) of RBI Act 1934**; SLR is under **Section 24 of Banking Regulation Act 1949**.\n3. **Primary Deficit Formula:** **Fiscal Deficit minus Interest Payments**.\n4. **MPC Casting Vote:** In the event of a tie (3-3), the **RBI Governor exercises a second / casting vote**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2 ESI", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit13", "monetary-policy", "fiscal-policy", "mpc", "repo", "sdf", "crr", "slr", "fiscal-deficit", "primary-deficit"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module B - Economic Concepts Related to Banking)"
    }
  },
  {
    id: "iibf-ieifs-unit-14-national-income-and-gdp",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 14: National Income Accounting, GDP Concepts & Deflator",
    summary: "Exhaustive study unit on GDP, GNP, NNP at Factor Cost vs Market Price, Nominal vs Real GDP, GDP Deflator formula, 3 Methods of Computing National Income, and GVA methodology.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: National Income Identities",
        summary: "National Income is the aggregate net monetary value of all final goods and services produced by the normal residents of a country during a financial year. The transition from Factor Cost to Market Price incorporates Net Indirect Taxes (Indirect Taxes - Subsidies)."
      },
      {
        type: "heading",
        level: 2,
        text: "🧮 1. Master National Income Aggregates Matrix"
      },
      {
        type: "table",
        caption: "National Income Relationships & Formulas",
        headers: ["Aggregate", "Formula / Definition", "Key Distinction"],
        rows: [
          ["Gross Domestic Product (GDP)", "$$\\text{Total market value of all final goods & services produced WITHIN domestic territory in 1 year}$$", "Spatial/Territorial measure (includes foreign nationals working in India)."],
          ["Gross National Product (GNP)", "$$GDP + \\text{NFIA}$$ (Net Factor Income from Abroad)", "Citizenship/Resident measure. \\(\\text{NFIA} = \\text{Income earned by residents abroad} - \\text{Income earned by non-residents in India}\\)."],
          ["Net Domestic Product (NDP)", "$$GDP - \\text{Depreciation (Consumption of Fixed Capital)}$$", "Adjusts for capital equipment wear and tear."],
          ["Net National Product (NNP)", "$$GNP - \\text{Depreciation}$$", "Cleanest measure of aggregate national wealth output."],
          ["NNP at Factor Cost (\\(\\text{NNP}_{FC}\\))", "$$\\text{NNP}_{MP} - \\text{Net Product Taxes} = \\text{National Income}$$", "**Official definition of National Income**."],
          ["GVA at Basic Prices", "$$\\text{GVA at Factor Cost} + (\\text{Production Taxes} - \\text{Production Subsidies})$$", "Introduced in 2015 revision (Base Year 2011-12)."],
          ["GDP at Market Prices", "$$\\text{GVA at Basic Prices} + (\\text{Product Taxes} - \\text{Product Subsidies})$$", "Headline GDP metric published by MoSPI."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📐 2. Nominal GDP vs. Real GDP & GDP Deflator"
      },
      {
        type: "formula",
        latex: "\\text{GDP Deflator} = \\frac{\\text{Nominal GDP}}{\\text{Real GDP}} \\times 100",
        explanation: "Comprehensive price index reflecting price changes across all goods and services produced domestically."
      },
      {
        type: "paragraph",
        content: "**Key Properties:**\n• **Nominal GDP:** Evaluated at current market prices (distorted by inflation).\n• **Real GDP:** Evaluated at constant base year prices (**Base Year 2011-12** in India).\n• Unlike CPI/WPI which use a fixed basket, the **GDP Deflator is a dynamic deflator** covering the entire spectrum of goods and services produced in the economy."
      },
      {
        type: "heading",
        level: 2,
        text: "🏭 3. The Three Methods of Calculating National Income"
      },
      {
        type: "table",
        caption: "3 Measurement Approaches",
        headers: ["Method", "Calculation Formula", "Special Precautions"],
        rows: [
          ["1. Product / Value Added Method", "$$\\sum (\\text{Value of Output} - \\text{Intermediate Consumption})$$", "**Avoid Double Counting** (count only value additions or final goods). Avoid second-hand sales."],
          ["2. Income Method", "$$\\text{Compensation of Employees} + \\text{Operating Surplus (Rent, Interest, Profit)} + \\text{Mixed Income of Self-Employed}$$", "**Exclude Transfer Payments** (old age pensions, scholarships, unemployment dole) as they generate zero output."],
          ["3. Expenditure Method", "$$GDP = C + I + G + (X - M)$$", "\\(C\\) = Private Consumption, \\(I\\) = Gross Capital Formation, \\(G\\) = Govt Consumption, \\(X - M\\) = Net Exports."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 14:\n1. **Transfer Payments:** Transfer payments (scholarships, gifts, pensions) are **EXCLUDED from National Income** calculation because they do not reflect current production.\n2. **National Income Definition:** Statistically equals **Net National Product at Factor Cost (\\(\\text{NNP}_{FC}\\))**.\n3. **Base Year for Indian GDP:** Currently **2011-12**."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2 ESI", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit14", "national-income", "gdp", "gnp", "nnp", "gdp-deflator", "gva", "value-added-method"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module B - Economic Concepts Related to Banking)"
    }
  },
  {
    id: "iibf-ieifs-unit-15-union-budget",
    type: "chapter",
    domain: "iibf-regulations",
    title: "IIBF IE&IFS Unit 15: Union Budget Architecture, Constitutional Funds & Budgeting Techniques",
    summary: "Complete breakdown of Article 112 Annual Financial Statement, Consolidated Fund (Art 266), Contingency Fund (Art 267), Appropriation Bill, Finance Bill, Zero-Based Budgeting, and Gender Budgeting.",
    blocks: [
      {
        type: "key_concept",
        title: "IIBF Core Foundation: Constitutional Budgetary Mandates",
        summary: "The Constitution of India does not use the word 'Budget'; it refers to it as the 'Annual Financial Statement' under Article 112. No money can be withdrawn from the Consolidated Fund of India without parliamentary enactment of an Appropriation Act under Article 114."
      },
      {
        type: "heading",
        level: 2,
        text: "🏛️ 1. Constitutional Funds of India"
      },
      {
        type: "table",
        caption: "The 3 Constitutional Accounts of Government of India",
        headers: ["Fund Name", "Constitutional Article", "Sources of Inflow", "Withdrawal Authorization Rule"],
        rows: [
          ["Consolidated Fund of India", "Article 266(1)", "All revenues received by Govt (taxes, duties), loans raised, and loan recovery repayments.", "**Requires prior Parliamentary law (Appropriation Act under Art 114)**. Zero withdrawal permitted without parliamentary vote."],
          ["Public Account of India", "Article 266(2)", "Monies held by Govt in trust/custody (Provident funds, Small savings, Postal insurance, Judicial deposits).", "**Executive Action** (Parliamentary approval not required; government acts as banker/trustee)."],
          ["Contingency Fund of India", "Article 267", "Corpus of **₹30,000 Crore** (enhanced from ₹500 Cr in Finance Act 2021).", "Held by the **President of India** (administered by Finance Secretary) for meeting unforeseen emergency expenditures pending parliamentary recoupment."]
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "📜 2. The Budget Enactment Process in Parliament (6 Stages)"
      },
      {
        type: "bullet_list",
        items: [
          "**Stage 1: Presentation of Budget:** Finance Minister presents budget on **February 1** (advanced from end of Feb in 2017) with the Budget Speech.",
          "**Stage 2: General Discussion:** Broad discussion on budget principles across both Houses without voting.",
          "**Stage 3: Scrutiny by Departmental Standing Committees:** Parliament adjourns for 3–4 weeks; 24 committees examine Demands for Grants of various ministries.",
          "**Stage 4: Voting on Demands for Grants:** Exclusively in the **Lok Sabha** (Rajya Sabha has zero voting power on grants). Guillotine applied on remaining demands on last day.",
          "**Stage 5: Passing of Appropriation Bill (Article 114):** Authorizes withdrawal of funds from the Consolidated Fund of India to meet approved grants and charged expenditure.",
          "**Stage 6: Passing of Finance Bill (Article 110):** Legalizes the government's taxation proposals (must be passed within **75 days** of introduction as per Provisional Collection of Taxes Act)."
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "💡 3. Modern Budgeting Techniques"
      },
      {
        type: "table",
        caption: "Modern Budgeting Methodologies",
        headers: ["Budgeting Technique", "Core Philosophy", "Key Operational Feature"],
        rows: [
          ["Zero-Based Budgeting (ZBB)", "Peter Pyhrr (1970)", "**Every line item must be justified from scratch (Zero base)** in every budget cycle as if the program were entirely new. Eliminates incremental budget padding."],
          ["Performance Budgeting", "Hoover Commission (USA)", "Focuses on outputs and physical achievements rather than mere financial inputs/outlays."],
          ["Outcome Budgeting", "Introduced in India in 2005", "Measures the tangible, qualitative end-results (outcomes) delivered to beneficiaries from financial outlays."],
          ["Gender Budgeting", "Introduced in India in 2005-06", "Dissects budget outlays to assess impact on women and girls (Part A: 100% women-specific schemes; Part B: ≥30% women-specific outlays)."]
        ]
      },
      {
        type: "exam_trap",
        content: "🎯 Top IIBF Traps for Unit 15:\n1. **Contingency Fund Corpus:** Enhanced to **₹30,000 Crore** (held on behalf of President by Finance Secretary).\n2. **Expenditure Authorization:** **Appropriation Bill (Article 114)** authorizes expenditure; **Finance Bill (Article 110)** authorizes taxation.\n3. **Railway Budget Merger:** Railway Budget was merged with Union Budget in **2017** based on the **Bibek Debroy Committee** (ending the 1924 Acworth Committee separation)."
      }
    ],
    metadata: {
      exam: ["IIBF JAIIB IE&IFS", "RBI Grade B Phase 2 ESI", "Bank Promotions"],
      tags: ["iibf", "ieifs", "unit15", "union-budget", "article112", "consolidated-fund", "contingency-fund", "appropriation-bill", "finance-bill", "zero-based-budgeting"],
      provenance: { sourceSystem: "IIBF-IEIFS", importedAt: "2026-08-22", verified: true },
      category: "IIBF Paper 1: IE&IFS (Module B - Economic Concepts Related to Banking)"
    }
  }
];

// Write physical corpus files and update note registry
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
let startNoteNum = 562;

moduleBUnits.forEach((unit, idx) => {
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
console.log(`🎉 Ingested all Module B Units (Units 8 to 15) into note-registry.json (#562 to #569)!`);
