const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', '..', 'content', 'note-registry.json');

console.log('🏰 Executing Phase 4: Rajasthan UNESCO Forts, Paintings, Prajamandal & Economic Review...\n');

const PHASE4_UNITS = [
  // -------------------------------------------------------------
  // 1. UNESCO HILL FORTS OF RAJASTHAN
  // -------------------------------------------------------------
  {
    id: 'ras-his-ch-1-rajasthan-unesco-hill-forts',
    type: 'chapter',
    domain: 'history',
    title: 'RAS History Ch 1: 6 UNESCO Hill Forts of Rajasthan & Military Architecture',
    summary: 'Doctoral guide on the 6 UNESCO World Heritage Hill Forts of Rajasthan inscribed at Phnom Penh (2013): Chittorgarh, Kumbhalgarh, Ranthambore, Gagron, Amber, and Jaisalmer...',
    blocks: [
      {
        id: 'blk-forts-theory',
        type: 'paragraph',
        content: '### 🏰 Inscription of 6 Hill Forts of Rajasthan (UNESCO World Heritage Site, 2013)\n\nAt the 37th Session of the World Heritage Committee in Phnom Penh (Cambodia, June 2013), **6 Hill Forts of Rajasthan** were collectively inscribed as a serial UNESCO World Heritage Site:\n\n1. **Chittorgarh Fort (Mewar — Largest Fort in India):**\n   • **Geomorphology:** Built on the **Mesa Plateau (616m elevation)** by Chitrangada Mori; surrounded by Gambhiri and Berach rivers.\n   • **Three Historic Jauhars (Shakas):**\n     - **1st Jauhar (1303):** Rani Padmini & Rawal Ratan Singh against **Alauddin Khilji** (Gora and Badal fought bravely; Khilji renamed fort *Khizrabad*).\n     - **2nd Jauhar (1535):** Rani Karnavati (sent Rakhi to Humayun) against **Bahadur Shah of Gujarat** (Rawat Bagh Singh led defense).\n     - **3rd Jauhar (1568):** Led by Phool Kanwar against **Mughal Emperor Akbar** (Jaimal Rathore and Patta Sisodia fought to martyrdom; Akbar erected their elephant statues at Agra fort gate).\n   • **Monuments:** **Vijay Stambha** (9 stories, 122 ft, built by Maharana Kumbha to commemorate victory over Mahmud Khilji in Battle of Sarangpur 1437; architect Jaita, Napa, Punja); **Kirti Stambha** (7 stories, dedicated to 1st Jain Tirthankara Adinath by merchant Jija Shah).\n2. **Kumbhalgarh Fort (Rajsamand — The Inaccessible Fort):**\n   • **Architect & Wall:** Built by **Maharana Kumbha** (1443–1458) under chief architect **Mandan**; encircled by a **36 km continuous defensive perimeter wall** (2nd longest continuous wall in the world after the Great Wall of China; width allows 4 horsemen to ride abreast).\n   • **Katargarh (The Eye of Mewar):** Upper fortified citadel housing Kumbha\'s palace and the **birthplace of Maharana Pratap (9 May 1540 at Badal Mahal)**.\n3. **Ranthambore Fort (Sawai Madhopur — The Forest/Hill Fort):**\n   • **Legacy:** Famous for Chauhan ruler **Hammir Dev Chauhan** ("Hammir Hath"); besieged by **Alauddin Khilji in 1301** (1st historic Jauhar / *Jal Jauhar* of Rajasthan led by Rani Ranga Devi; Amir Khusro noted *"Today the bastion of infidelity has become the home of Islam"*).\n   • **Monuments:** Unique **Trinetra Ganesha Temple**; 32-Pillared Cenotaph (Battis Khambon ki Chhatri); Padmala Lake.\n4. **Gagron Fort (Jhalawar — Masterpiece of Water Fort / Jal Durg):**\n   • **Location:** Surrounded on three sides by the confluence of **Ahu and Kali Sindh rivers**; has **zero foundation** (rests directly on solid natural bedrock).\n   • **Two Jauhars:** 1st in 1423 under Achaldas Khichi against Hoshang Shah of Mandu (recorded in *Achaldas Khichi ri Vachanika* by Shivdas Gadan); 2nd in 1444 under Palhansi against Mahmud Khilji.\n5. **Amber Fort (Jaipur — Rajput-Mughal Fusion):**\n   • **Architecture:** Built by **Raja Man Singh I (1592)** on Cheel ka Teela; contains **Sheesh Mahal (Mirror Palace)**, Diwan-i-Aam, Diwan-i-Khas, Kesar Kyari garden in Maota Lake; houses the idol of **Shila Devi** (brought by Man Singh from Jessore, Bengal).\n6. **Jaisalmer Fort / Sonar Qila (Swarn Durg — Living Desert Fort):**\n   • **Construction:** Founded by Bhati Rajput ruler **Rao Jaisal (1156)** on Trikuta Hill; built of yellow sandstone with **interlocking stone joints (zero mortar/lime)**; home to 25% of city population.\n   • **2.5 Jauhars (Dhai Shaka):** 1st under Alauddin Khilji (Rawal Jait Singh); 2nd under Feroz Shah Tughlaq (Rawal Duda); **0.5 (Half) Jauhar in 1550** under Rawal Lunkaran against Afghan ruler Amir Ali (Rajput warriors fought to death, but women could not perform Jauhar in time, hence counted as half Jauhar).'
      },
      {
        id: 'blk-forts-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → 🔥 HIGH — RPSC RAS Top Invariants:\n1. **UNESCO Fort Mnemonic:** Remember *"Chiku Gajar Aam"* ➔ **Chi**ttorgarh, **Ku**mbhalgarh, **Ga**gron, **J**aisalmer, **R**anthambore, **Aam**ber. (Mehrangarh Fort of Jodhpur and Taragarh Fort of Bundi are NOT in UNESCO list!).\n2. **Half-Jauhar (Ardh Shaka):** Occurred in Jaisalmer in 1550 under Rawal Lunkaran against Amir Ali of Kandahar.'
      }
    ],
    metadata: {
      exam: ['RPSC RAS Prelims 2026', 'RPSC RAS Mains 2026', 'Rajasthan Police SI'],
      tags: ['history', 'rpsc-ras', 'rajasthan-history', 'unesco-forts', 'chittorgarh', 'kumbhalgarh'],
      category: 'History',
      sectionCode: 'HIS',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 4 RAS Suite', sourceTitle: 'RAS History Chapter 1: UNESCO Forts' },
      noteNumber: 551
    },
    relationships: []
  },

  // -------------------------------------------------------------
  // 2. RAJASTHAN MINIATURE PAINTINGS
  // -------------------------------------------------------------
  {
    id: 'ras-his-ch-2-rajasthan-miniature-paintings',
    type: 'chapter',
    domain: 'history',
    title: 'RAS History Ch 2: Rajasthan Miniature Painting Schools (Mewar, Kishangarh, Bundi & Kota)',
    summary: 'Comprehensive art history matrix of Rajasthan painting styles: Mewar Ragamala, Kishangarh Bani Thani (Mona Lisa of India), Bundi Chitrashala, and Kota hunting frescoes...',
    blocks: [
      {
        id: 'blk-paint-theory',
        type: 'paragraph',
        content: '### 🎨 The 4 Principal Schools of Rajasthani Painting (Anand Coomaraswamy Framework)\n\nAnand Kentish Coomaraswamy categorized Rajasthani painting in his seminal 1916 book *"Rajput Painting"*. The painting styles are classified into 4 distinct schools:\n\n1. **Mewar School (The Mother School of Rajasthani Art):**\n   • **Chawand Style (Origin):** Developed during Maharana Pratap’s reign at Chawand; painter **Nisardin** painted the famous *Ragamala* set in **1605** during Maharana Amar Singh I.\n   • **Udaipur Golden Era:** Under Maharana Jagat Singh I (1628–1652); established a dedicated painting department called **Chitaron ki Ovari** (also known as *Tasveera ro Karkhano*); master painter **Sahibdin** illustrated *Ragamala (1628)*, *Geet Govind*, and *Arsha Ramayana*.\n   • **Nathdwara Style (Pichwai Art):** Centered on Shrinathji temple; famous for **Pichwai cloth paintings** depicting Krishna Leela behind the deity idol; women painters: **Kamala and Ilaichi**.\n2. **Marwar School (Jodhpur, Bikaner, Kishangarh):**\n   • **Kishangarh Style & Bani Thani:** Golden age under **Raja Sawant Singh (pen name Nagridas)**; court artist **Nihal Chand** painted **Bani Thani** (court singer Rasik Bihari) with elongated fish-like eyes, arched brows, sharp nose, and transparent veil.\n   • **Eric Dickinson’s Tribute:** Art critic Eric Dickinson designated Bani Thani as the **"Mona Lisa of India"**; Government of India issued a 20-paise postage stamp on Bani Thani in 1973.\n   • **Bikaner Style:** Famous for **Usta Kala** (intricate gold embossing on camel leather by Usta craftsmen) and **Matheerna Kala** (fresco paintings of religious themes on wet plaster).\n3. **Hadoti School (Bundi & Kota):**\n   • **Bundi Style (Bird & Nature Specialization):** World-famous for rich depictions of wildlife, lush vegetation, water ponds, and monsoon peacocks; **Chitrashala (Picture Gallery)** built by Maharao Ummed Singh is called a *"Paradise of Wall Paintings"*.\n   • **Kota Style (Hunting Scenes):** Characterized by dynamic hunting expeditions (*Shikar scenes*) where **women and queens are depicted hunting tigers and wild beasts** alongside kings.\n4. **Dhundhar School (Jaipur, Alwar, Shekhawati):**\n   • **Shekhawati Haveli Frescoes:** Known globally as the **"Open Air Art Gallery of Rajasthan"** for exquisite fresco paintings (*Arayash technique / Morakasi*) across Havelis in Mandawa, Nawalgarh, and Fatehpur.'
      },
      {
        id: 'blk-paint-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → 🔥 HIGH — RPSC RAS Visual Markers:\n1. **Women Hunting:** **Kota Style** is the ONLY school depicting queens/women hunting wild animals in forests.\n2. **Bird & Animal Dominance:** **Bundi Style**.\n3. **Bani Thani Painter & Patron:** Painter is **Nihal Chand**; King is **Sawant Singh (Nagridas)**; Termed "Mona Lisa of India" by **Eric Dickinson**.'
      }
    ],
    metadata: {
      exam: ['RPSC RAS Prelims 2026', 'RPSC RAS Mains 2026', 'UPSC CSE 2026'],
      tags: ['history', 'rpsc-ras', 'rajasthan-art', 'paintings', 'bani-thani', 'mewar-school'],
      category: 'History',
      sectionCode: 'HIS',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 4 RAS Suite', sourceTitle: 'RAS History Chapter 2: Paintings' },
      noteNumber: 552
    },
    relationships: []
  },

  // -------------------------------------------------------------
  // 3. PRAJAMANDAL & PEASANT MOVEMENTS
  // -------------------------------------------------------------
  {
    id: 'ras-his-ch-3-rajasthan-prajamandal-movements',
    type: 'chapter',
    domain: 'history',
    title: 'RAS History Ch 3: Rajasthan Peasant Revolts (Bijolia, Begun) & Prajamandal Movements',
    summary: 'Exhaustive historical analysis of the 44-year Bijolia Peasant Movement (Vijay Singh Pathik), Begun Movement (Trench Commission), and Prajamandal chronological matrix...',
    blocks: [
      {
        id: 'blk-peasant-theory',
        type: 'paragraph',
        content: '### 🌾 Peasant Revolts & Prajamandal Freedom Movement in Rajasthan\n\n1. **Bijolia Peasant Movement (Bhilwara — 1897 to 1941):**\n   • **Significance:** Longest non-violent organized peasant movement in world history (**44 years**, 1897–1941) against the Jagirdars of Bijolia (Thikana of Mewar).\n   • **Cess Exploitation:** Farmers burdened with **84 different types of cesses (*Lag-Bag*)**; in 1903, Rao Krishna Singh imposed **Chawri Kar** (₹5 tax per daughter\'s marriage); in 1906, Rao Prithvi Singh imposed **Talwar Bandhai** (succession cess).\n   • **Three Operational Phases:**\n     - **Phase 1 (1897–1915):** Led locally by **Sadhu Sitaram Das**, Nanji Patel, and Thakari Patel.\n     - **Phase 2 (1916–1927 - Golden Phase):** **Vijay Singh Pathik (Bhup Singh)** took leadership; established **Uparmal Panch Board** (1917, Sarpanch: Manna Patel) and newspaper *Pratap* (published from Kanpur by Ganesh Shankar Vidyarthi); supported by Manikya Lal Verma (wrote motivational song *Panchhida*).\n     - **Phase 3 (1927–1941):** Led by Jamnalal Bajaj and Haribhau Upadhyaya; successfully concluded with land rights restored in 1941 by Mewar Prime Minister Sir T. Vijayaraghavachari.\n2. **Begun Peasant Movement (Chittorgarh — 1921 to 1923):**\n   • **Leadership:** Led by **Ramnarayan Chaudhary** at Menal (Chittorgarh); Rawat Anoop Singh of Begun signed the **Bolshevik Agreement** with peasants (later annulled by Mewar Maharana).\n   • **Govindpura Firing (13 July 1923):** Commissioner Trench opened fire on peaceful farmer gathering; **Rupa ji Dhakad and Kripa ji Dhakad** were martyred.\n3. **Prajamandal Movement Master Chronology:**\n   • **Objective:** Established to secure responsible governance under the aegis of native princely rulers and abolish feudal cesses (*Lata-Kunta, Begar*).\n   • **Key Prajamandals & Founders:**\n     - **1931 (1st in Rajasthan):** **Jaipur Prajamandal** (Founded by Kapurchand Patni; reorganized in 1936 by Jamnalal Bajaj and Hiralal Shastri).\n     - **1931:** **Bundi Prajamandal** (Kanti Lal).\n     - **1934:** **Marwar Prajamandal** (Jai Narayan Vyas, Bhanwarlal Saraf).\n     - **1936:** **Bikaner Prajamandal** (Magharam Vaidya at Calcutta).\n     - **1938:** **Mewar Prajamandal** (Manikya Lal Verma, Balwant Singh Mehta as 1st President).\n     - **1939:** **Kota Prajamandal** (Pandit Nayanuram Sharma, Abhay Ali).\n     - **1944:** **Dungarpur Prajamandal** (**Bhogilal Pandya**, revered as *"Gandhi of Vagad"*).'
      },
      {
        id: 'blk-peasant-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → 🔥 HIGH — RPSC RAS Top Traps:\n1. **First Prajamandal:** **Jaipur Prajamandal (1931)** was the 1st in Rajasthan.\n2. **Prajamandals Founded Outside Native States:**\n   • **Bikaner Prajamandal (1936):** Founded in **Calcutta** by Magharam Vaidya.\n   • **Sirohi Prajamandal (1939):** Founded in **Bombay** by Gokulbhai Bhatt ("Gandhi of Rajasthan").\n   • **Bharatpur Prajamandal (1938):** Founded in **Rewari (Haryana)** by Gopi Lal Yadav.'
      }
    ],
    metadata: {
      exam: ['RPSC RAS Prelims 2026', 'RPSC RAS Mains 2026', 'Rajasthan Police SI'],
      tags: ['history', 'rpsc-ras', 'rajasthan-history', 'bijolia', 'prajamandal', 'vijay-singh-pathik'],
      category: 'History',
      sectionCode: 'HIS',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 4 RAS Suite', sourceTitle: 'RAS History Chapter 3: Peasant & Prajamandal' },
      noteNumber: 553
    },
    relationships: []
  },

  // -------------------------------------------------------------
  // 4. ECONOMIC REVIEW OF RAJASTHAN & STATE FLAGSHIP SCHEMES
  // -------------------------------------------------------------
  {
    id: 'ras-eco-ch-1-rajasthan-economic-review-schemes',
    type: 'chapter',
    domain: 'economy',
    title: 'RAS Economy Ch 1: Economic Review of Rajasthan & State Flagship Schemes Master Suite',
    summary: 'Doctoral macroeconomic synthesis of Rajasthan’s GSVA sectoral distribution (Services 45%, Industry 28%, Agri 27%), per capita income, and 10 state flagship welfare schemes...',
    blocks: [
      {
        id: 'blk-raseco-theory',
        type: 'paragraph',
        content: '### 📊 Macroeconomic Profile of Rajasthan (Economic Review Benchmarks)\n\n1. **Gross State Value Added (GSVA) Sectoral Contribution (Constant Prices):**\n   • **Services Sector:** **45.1%** (Largest economic contributor; led by trade, hotels, transport, and real estate).\n   • **Industry & Mining Sector:** **27.7%** (Manufacturing, electricity, mining of non-metallic minerals, and construction).\n   • **Agriculture & Allied Sector:** **27.2%** (Crops: 46%, Livestock: 46%, Forestry: 7.5%, Fishing: 0.5% — notice livestock equals crop output in Rajasthan!).\n2. **Key State Macro Indicators:**\n   • **Gross State Domestic Product (GSDP):** Scaled past **₹15.7 Lakh Crore** (Current Prices).\n   • **Per Capita Income:** ₹1,56,149 (Current Prices) vs National Average of ~₹1,72,000.\n   • **State Mineral Wealth:** Known as the **"Museum of Minerals"** (produces 81 types of minerals, commercial exploitation of 57); holds a **100% national monopoly in Wollastonite, Lead-Zinc, and Jasper**; 2nd largest oil producer in India (Barmer-Sanchore basin under Cairn/ONGC, ~20% of domestic crude).\n3. **Flagship Welfare Schemes of Rajasthan:**\n   • **Mukhyamantri Ayushman Arogya Yojana (MAA - Universal Health):** Cashless IPD treatment up to ₹25 Lakh/family across empaneled public and private hospitals.\n   • **Shri Annapurna Rasoi Yojana (formerly Indira Rasoi):** Delivers hot nutritious meals (450g thali) at a subsidized cost of **₹8 per plate** to urban poor.\n   • **Palanhar Yojana:** Provides monthly financial assistance of **₹1,500/month (0–6 yrs) and ₹2,500/month (6–18 yrs)** + ₹2,000 annual cloth/uniform grant for orphan children.\n   • **Mukhyamantri Nishulk Dava & Janch Yojana:** 100% free essential medicines and clinical diagnostic tests in all government hospitals.\n   • **Rajasthan Guaranteed Delivery of Public Services Act, 2011:** 1st state in India to enact statutory right-to-service law (covers 280+ citizen services with stipulated delivery timelines and penal fines on errant officers).'
      },
      {
        id: 'blk-raseco-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → 🔥 HIGH — RPSC RAS Top Traps:\n1. **Livestock vs Crops in GSVA:** In Rajasthan’s Agriculture GSVA, **Livestock contribution (\(\sim 46.2\%\)) is nearly identical to Crop output (\(\sim 46.0\%\))** — unlike the national average where crops dominate.\n2. **Monopoly Minerals of Rajasthan:** 100% monopoly in **Wollastonite, Jasper, and Lead-Zinc**.'
      }
    ],
    metadata: {
      exam: ['RPSC RAS Prelims 2026', 'RPSC RAS Mains 2026', 'Rajasthan Police SI'],
      tags: ['economy', 'rpsc-ras', 'rajasthan-economy', 'economic-review', 'flagship-schemes', 'minerals'],
      category: 'Economy',
      sectionCode: 'ECO',
      difficulty: 'advanced',
      relevanceTier: 'TIER_A',
      noteTier: 'TIER_A',
      date: '2026-08-20',
      period: '2026-Q4',
      provenance: { sourceSystem: 'DF-EIC', sourceFile: 'Phase 4 RAS Suite', sourceTitle: 'RAS Economy Chapter 1: Economic Review' },
      noteNumber: 554
    },
    relationships: []
  }
];

let addedCount = 0;
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

PHASE4_UNITS.forEach(item => {
  const filePath = path.join(corpusDir, `${item.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(item, null, 2), 'utf-8');
  
  registry[String(item.metadata.noteNumber)] = {
    noteNumber: item.metadata.noteNumber,
    id: item.id,
    title: item.title,
    section: item.metadata.sectionCode,
    date: item.metadata.date,
    period: '2026-Q4',
    category: item.metadata.category,
    file: `content/corpus/${item.id}.json`
  };
  addedCount++;
  console.log(`✅ Ingested ${item.id} (${item.title})`);
});

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
console.log(`\n🎉 Successfully deployed ${addedCount} Phase 4 masterclass units.`);
