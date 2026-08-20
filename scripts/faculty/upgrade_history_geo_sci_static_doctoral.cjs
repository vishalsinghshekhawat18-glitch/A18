const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');

console.log('🛡️ Deploying Archival History, Geospatial Geography, Science & Static GA Doctoral Councils...\n');

const DOMAIN_TRAPS = {
  // History Traps
  'history_viceroys': '🎯 Exam Angle → 🔥 HIGH — Landmark Legislative Chronology: (1) Regulating Act 1773 (Warren Hastings, 1st Gov-Gen of Bengal); (2) Charter Act 1833 (Lord William Bentinck, 1st Gov-Gen of India); (3) Government of India Act 1858 (Lord Canning, 1st Viceroy of India); (4) Indian Councils Act 1909 (Morley-Minto, separate electorates for Muslims); (5) GoI Act 1919 (Montagu-Chelmsford, Dyarchy in provinces).',
  'history_movements': '🎯 Exam Angle → 🔥 HIGH — Gandhian Movement Chronology & Triggers: (1) Champaran 1917 (Tinkathia indigo system) ➔ Ahmedabad Mill 1918 (1st Hunger Strike) ➔ Kheda 1918 (1st Non-Cooperation); (2) Non-Cooperation Movement 1920 (called off after Chauri Chaura on 4 Feb 1922); (3) Civil Disobedience Movement 1930 (Dandi March 12 Mar–6 Apr 1930); (4) Quit India Movement (8 Aug 1942, Gowalia Tank, "Do or Die").',
  
  // Geography Traps
  'geo_rivers': '🎯 Exam Angle → 🔥 HIGH — River Tributary Classifications: (1) Ganga Left-Bank: Ramganga, Gomti, Ghaghara, Gandak, Kosi, Mahananda; Ganga Right-Bank: Yamuna, Son, Punpun; (2) Indus Left-Bank: Jhelum, Chenab, Ravi, Beas, Sutlej (Panjnad); (3) West-Flowing Rivers into Arabian Sea (forming Estuaries, not Deltas): Narmada (Rift valley), Tapti, Sabarmati, Mahi, Periyar.',
  'geo_passes': '🎯 Exam Angle → 🔥 HIGH — Himalayan Mountain Passes (West to East): Zoji La / Banihal (J&K/Ladakh) ➔ Rohtang / Shipki La (Himachal Pradesh) ➔ Lipulekh / Mana / Niti (Uttarakhand) ➔ Nathu La / Jelep La (Sikkim) ➔ Bomdi La / Dihang (Arunachal Pradesh).',
  'geo_soils': '🎯 Exam Angle → 🔥 HIGH — Soil Classification in India (ICAR 8 groups): Alluvial Soil (largest area ~40%, rich in potash, deficient in phosphorus/nitrogen) > Red Soil (iron oxides) > Black/Regur Soil (volcanic basalt origin, self-ploughing, ideal for cotton, rich in calcium carbonate/magnesium).',
  
  // Science Traps
  'sci_physics': '🎯 Exam Angle → Focus on SI Units & Optical Phenomena: (1) Total Internal Reflection (TIR) explains Mirage in deserts, Sparkling of diamonds, and Optical fiber communication; (2) Atmospheric Refraction causes early sunrise / delayed sunset and twinkling of stars; (3) Scattering of light (Rayleigh law \(\propto 1/\lambda^4\)) causes blue sky and red sunset.',
  'sci_biology': '🎯 Exam Angle → Endocrine & Vitamin Matrix: (1) Master Gland = Pituitary Gland (regulated by Hypothalamus); (2) Insulin is secreted by Beta cells of Islets of Langerhans in Pancreas; (3) Water-Soluble Vitamins: B-complex and C; Fat-Soluble Vitamins: A, D, E, K; (4) Vitamin Deficiencies: Vit A (Night blindness), Vit B1 (Beri-beri), Vit C (Scurvy), Vit D (Rickets), Vit K (Impaired blood clotting).',
  
  // Static GA & Schemes Traps
  'static_orgs': '🎯 Exam Angle → 🔥 HIGH — International Headquarters Invariant: (1) Geneva, Switzerland: WHO, WTO, ILO, WIPO, WMO, UNCTAD, UNHCR; (2) Vienna, Austria: IAEA, OPEC, UNIDO; (3) Paris, France: UNESCO, OECD, FATF; (4) Rome, Italy: FAO, WFP, IFAD; (5) Washington DC: IMF, World Bank Group.',
  'static_power': '🎯 Exam Angle → Nuclear Power Stations Matrix: Kudankulam (Tamil Nadu - largest 2,000 MW, Russian collaboration), Tarapur (Maharashtra - India\'s 1st 1969, US collaboration), Rawatbhata (Rajasthan, Canadian Candu), Kaiga (Karnataka), Kakrapar (Gujarat), Kalpakkam / MAPS (Tamil Nadu), Narora (UP).'
};

const allFiles = fs.readdirSync(corpusDir).filter(f => f.endsWith('.json'));
let updatedCount = 0;

allFiles.forEach(file => {
  if (file.startsWith('ca-2026-') || file.startsWith('migrated-quant-') || file.startsWith('migrated-eng-') || file.startsWith('migrated-core-pol-') || file.startsWith('migrated-core-eco-')) {
    return; // Already processed
  }

  const filePath = path.join(corpusDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let modified = false;

  const id = data.id || '';
  const title = (data.title || '').toLowerCase();

  let matchedTrap = '';
  if (id.includes('his') || title.includes('history') || title.includes('viceroy') || title.includes('british') || title.includes('gandhi')) {
    matchedTrap = (title.includes('gandhi') || title.includes('movement') || title.includes('congress')) ? DOMAIN_TRAPS.history_movements : DOMAIN_TRAPS.history_viceroys;
  } else if (id.includes('geo') || title.includes('geography') || title.includes('river') || title.includes('pass') || title.includes('soil')) {
    if (title.includes('river') || title.includes('drainage')) matchedTrap = DOMAIN_TRAPS.geo_rivers;
    else if (title.includes('pass') || title.includes('himalaya')) matchedTrap = DOMAIN_TRAPS.geo_passes;
    else if (title.includes('soil')) matchedTrap = DOMAIN_TRAPS.geo_soils;
    else matchedTrap = DOMAIN_TRAPS.geo_rivers;
  } else if (id.includes('sci') || title.includes('science') || title.includes('physics') || title.includes('biology')) {
    matchedTrap = (title.includes('bio') || title.includes('vitamin') || title.includes('human')) ? DOMAIN_TRAPS.sci_biology : DOMAIN_TRAPS.sci_physics;
  } else if (id.includes('staticga') || title.includes('hq') || title.includes('organization') || title.includes('power')) {
    matchedTrap = (title.includes('nuclear') || title.includes('power') || title.includes('thermal')) ? DOMAIN_TRAPS.static_power : DOMAIN_TRAPS.static_orgs;
  } else {
    matchedTrap = `🎯 Exam Angle → 🔥 HIGH — Pay close attention to statutory classifications, founding years, nodal ministries, and numerical thresholds in ${data.title}.`;
  }

  let trapFound = false;
  data.blocks.forEach(blk => {
    if (blk.type === 'exam_trap' || (blk.content && blk.content.includes('🎯 Exam Angle'))) {
      blk.type = 'exam_trap';
      blk.content = matchedTrap;
      trapFound = true;
      modified = true;
    }
  });

  if (!trapFound) {
    data.blocks.push({
      id: `blk-${data.id}-exam-trap`,
      type: 'exam_trap',
      content: matchedTrap
    });
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    updatedCount++;
  }
});

console.log(`✅ Successfully upgraded all ${updatedCount} remaining subject notes across History, Geography, Science, Static GA & Schemes.`);
