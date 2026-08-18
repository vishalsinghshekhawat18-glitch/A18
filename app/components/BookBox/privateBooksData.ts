export interface PrivateBookItem {
  id: string;
  type: 'book' | 'quote' | 'sher_shayari' | 'poem' | 'line_passage' | 'research_paper';
  title: string;
  author: string;
  year?: number;
  mood: 'grief' | 'love_ishq' | 'veerta' | 'tanhai' | 'wisdom' | 'rebellion';
  themeNodes: string[];
  language: 'English' | 'Devanagari_Hindi' | 'Urdu_Hinglish';
  tier: 'reference' | 'internalize';
  verification_status: 'verified' | 'unverified' | 'unchecked';
  readTime: string;
  coreTruth: string;
  sections: {
    heading: string;
    content: string;
    level?: 2 | 3;
    isCallout?: boolean;
    calloutIcon?: string;
  }[];
}

export const privateBooksData: PrivateBookItem[] = [
  {
    id: 'book-norwegian-wood',
    type: 'book',
    title: 'Norwegian Wood (ノルウェイの森)',
    author: 'Haruki Murakami (村上 春樹)',
    year: 1987,
    mood: 'tanhai',
    themeNodes: ['[[Memory & Nostalgia]]', '[[Grief & Mortality]]', '[[The Dualities of Love]]', '[[Isolation vs. Connection]]'],
    language: 'English',
    tier: 'reference',
    verification_status: 'verified',
    readTime: '30 min masterclass',
    coreTruth: 'Death exists not as the opposite but as an inalienable part of life.',
    sections: [
      {
        heading: '1. Zero-Knowledge Executive Primer & Metadata',
        content: 'Setting: Late 1960s Tokyo, Kobe & Kyoto, Japan | Translator: Jay Rubin. This atmospheric masterclass explores grief, memory, sexual awakening, and the existential choice between holding onto the dead (Naoko) vs embracing the messy vitality of life (Midori).',
        isCallout: true,
        calloutIcon: '🌲'
      },
      {
        heading: '2. Core Thesis & Existential Architecture',
        content: 'Grief cannot be cured by logic or willpower; it must be experienced. Toru Watanabe carries the ghost of his best friend Kizuki while torn between Naoko (melancholy retreat into death) and Midori (vibrant, demanding necessity of living).'
      },
      {
        heading: 'Chapter 1: The Landing in Hamburg & The Meadow of Memory',
        content: '37-year-old Toru lands in cold Hamburg rain. An orchestral version of "Norwegian Wood" plays, triggering memories of autumn 1969. The Meadow walk with Naoko and the metaphor of the "Well in the Meadow"—the hidden, pitch-black abyss of depression.',
        level: 3
      },
      {
        heading: 'Chapter 2: Kizuki\'s Suicide & Moving to Tokyo',
        content: 'May 1967: An ordinary afternoon playing billiards ends with 17-year-old Kizuki sealing his car with a hose in his garage. Toru moves to a Tokyo college dorm carrying the truth: "By living our lives, we nurture death."',
        level: 3
      },
      {
        heading: 'Chapter 3: Reconnecting with Naoko & Tokyo Sunday Walks',
        content: 'Silent Sunday walks through Tokyo. On Naoko\'s 20th birthday in the rain, she breaks down into racking sobs. They sleep together in the dark before she vanishes.',
        level: 3
      },
      {
        heading: 'Chapter 4: Midori Kobayashi & The Rooftop Fire',
        content: 'Meeting Midori—outspoken, vibrant, wearing green sunglasses. Eating cucumbers on a bookstore rooftop while a neighbor\'s house burns, sirens wail, and Midori sings on her guitar and kisses Toru amidst the smoke.',
        level: 3
      },
      {
        heading: 'Chapter 5 & 6: Ami Hostel & Reiko\'s Piano Story',
        content: 'Journey to the mountain sanctuary near Kyoto. Reiko Ishida\'s tragic loss of her piano career due to emotional hand spasms and false accusations. The candlelit night concerts playing Beatles songs.',
        level: 3
      },
      {
        heading: 'Chapter 7: Nagasawa, Sex & Hatsumi\'s Tragic Nobility',
        content: 'Nagasawa\'s brilliant, predatory cynicism picking up 100+ women without feeling. Hatsumi\'s pure, noble devotion and her ultimate tragic suicide years later.',
        level: 3
      },
      {
        heading: 'Chapter 8: Midori\'s Dying Father & Strawberry Shortcake Love',
        content: 'Toru feeding cucumber rolls to Midori\'s terminally ill father in a hospital. Midori\'s demand for unconditional love: "A love so complete that if I want strawberry shortcake, you drop everything and buy it."',
        level: 3
      },
      {
        heading: 'Chapter 9 & 10: Naoko\'s Suicide & Toru\'s Month of Desolation',
        content: 'Naoko walks into the pine forest in a white dress and hangs herself. Toru spends 30 days wandering desolate Japanese coastlines in the rain: "No truth can cure the sorrow of losing a loved one. All we can do is see it through to the end."',
        level: 3
      },
      {
        heading: 'Chapter 11: Reiko\'s 50-Song Memorial Concert & The Tokyo Phone Booth',
        content: 'Reiko\'s 50-song guitar memorial concert in Toru\'s apartment. Toru standing in a glass phone booth at a noisy Tokyo station calling Midori: "Where are you right now?" unable to answer, standing between memory and life.',
        level: 3
      },
      {
        heading: 'Key Quotes',
        content: '• "Death exists not as the opposite but as an inalienable part of life."\n• "If you only read the books that everyone else is reading, you can only think what everyone else is thinking."\n• "No truth can cure the sorrow we feel from losing a loved one."'
      }
    ]
  },
  {
    id: 'book-why-nations-fail',
    type: 'book',
    title: 'Why Nations Fail: The Origins of Power, Prosperity, and Poverty',
    author: 'Daron Acemoglu & James A. Robinson (2024 Nobel Laureates)',
    year: 2012,
    mood: 'wisdom',
    themeNodes: ['[[Inclusive Institutions]]', '[[Extractive Institutions]]', '[[Creative Destruction]]', '[[Critical Junctures]]'],
    language: 'English',
    tier: 'reference',
    verification_status: 'verified',
    readTime: '25 min masterclass',
    coreTruth: 'National divergence is driven neither by geography nor culture, but by inclusive vs extractive institutions.',
    sections: [
      {
        heading: '1. Zero-Knowledge Primer & Metadata',
        content: 'Why does Nogales, Arizona earn $30k/yr while Nogales, Sonora earns $10k/yr despite sharing identical climate, ethnicity, and geography? The difference is man-made political and economic institutions.',
        isCallout: true,
        calloutIcon: '🏛️'
      },
      {
        heading: '2. Major Principles & The 3-Tier Pedagogical Ramp',
        content: '• Inclusive vs Extractive Economic Rules: Fair playing fields with property rights vs elite monopolies draining public wealth.\n• Pluralism & State Centralization: Power distributed broadly with capable enforcement.\n• Creative Destruction: Why elites block new inventions (e.g. Russian Czars banning steam engines to prevent worker revolts).\n• Critical Junctures & Institutional Drift: How the 1346 Black Death liberated English peasants but deepened Russian serfdom.'
      },
      {
        heading: 'Key Chapters Exegesis (1 to 15)',
        content: 'Ch 1: Nogales Border Comparison | Ch 2: Refuting Jared Diamond & Culture Myths | Ch 3: Inclusive vs Extractive Rules | Ch 4: Black Death Critical Juncture | Ch 5: Soviet Extractive Growth Ceilings | Ch 6: Venetian Decline (La Serrata) | Ch 7: 1688 Glorious Revolution | Ch 8: Czars Banning Railroads | Ch 11: The Virtuous Circle | Ch 12: The Vicious Circle | Ch 14: Botswana Success.'
      },
      {
        heading: 'Empirical Evidence & Methodologies',
        content: '• Colonial Settler Mortality (Acemoglu, Johnson, Robinson 2001 AER): Instrumental variable (IV) using 17th-19th century mortality rates proving institutional persistence.\n• Peru Mining Mita Spatial Discontinuity (Melissa Dell 2010 Econometrica): RDD showing 20-30% lower consumption inside historical forced-labor boundary.'
      }
    ]
  },
  {
    id: 'book-nudge',
    type: 'book',
    title: 'Nudge: Improving Decisions About Health, Wealth, and Happiness',
    author: 'Richard H. Thaler (2017 Nobel Laureate) & Cass R. Sunstein',
    year: 2008,
    mood: 'wisdom',
    themeNodes: ['[[Choice Architecture]]', '[[Libertarian Paternalism]]', '[[Defaults]]', '[[System 1 & System 2]]'],
    language: 'English',
    tier: 'reference',
    verification_status: 'verified',
    readTime: '20 min masterclass',
    coreTruth: 'Choice architecture alters human behavior in predictable ways without forbidding options or changing economic incentives.',
    sections: [
      {
        heading: '1. Zero-Knowledge Primer',
        content: 'Humans are not rational "Econs"; we are biased "Humans" guided by System 1 inertia and defaults. By designing environments with smart defaults, we can dramatically improve savings, health, and energy conservation without coercion.',
        isCallout: true,
        calloutIcon: '🎯'
      },
      {
        heading: 'Core NUDGES Framework & 16 Chapters',
        content: '• iNcentives: Make payoffs visible.\n• Understand mappings: Translate technical specs into real-world terms.\n• Defaults: The single most powerful nudge (Auto-enrollment 401k increases participation from 40% to 90%).\n• Give feedback: Immediate alerts.\n• Expect error: Forgiving systems (ATM card beep before cash).\n• Structure complex choices: Simplified filters.'
      },
      {
        heading: 'Field Trials & Evidence',
        content: '• Save More Tomorrow (SMaRT) (Thaler & Benartzi 2004 JPE): Auto-escalating retirement savings with future pay raises boosted savings from 3.5% to 13.6%.\n• European Organ Donation (Johnson & Goldstein 2003 Science): Presumed consent defaults yield 99% consent vs 15% in opt-in countries.'
      }
    ]
  },
  {
    id: 'book-emotional-intelligence',
    type: 'book',
    title: 'Emotional Intelligence: Why It Can Matter More Than IQ',
    author: 'Daniel Goleman, Ph.D.',
    year: 1995,
    mood: 'wisdom',
    themeNodes: ['[[Amygdala Hijacking]]', '[[Impulse Control]]', '[[Self-Awareness]]', '[[Empathy]]'],
    language: 'English',
    tier: 'reference',
    verification_status: 'verified',
    readTime: '25 min masterclass',
    coreTruth: 'IQ accounts for at most 20% of life-outcome variance; the rest is determined by trainable emotional competencies.',
    sections: [
      {
        heading: '1. Zero-Knowledge Primer & Anatomy of Hijacking',
        content: 'LeDoux\'s neuroanatomy discovery: Sensory signals travel from the thalamus to the neocortex (~240ms) and via a subcortical low-road directly to the amygdala (~120ms). In an emotional hijacking, the amygdala triggers fight-or-flight before rational thought intervenes.',
        isCallout: true,
        calloutIcon: '🧠'
      },
      {
        heading: '2. The 5 Core EQ Dimensions & 16 Chapters',
        content: '1. Self-Awareness (Metacognition, Somatic Markers)\n2. Self-Regulation (Managing rage, ABCDE reframing, 6-second pause)\n3. Motivation (Delayed gratification, Stanford Marshmallow study)\n4. Empathy (Attunement, mirror neurons, reading non-verbal cues)\n5. Social Skills (Emotional contagion, organizational leadership)'
      },
      {
        heading: 'Actionable Protocols',
        content: '• The 6-Second Pause: Count 6 seconds when triggered to let the prefrontal cortex regain control.\n• ABCDE Reframing: Adversity -> Belief -> Consequence -> Disputation -> Energization.\n• Gottman\'s 5:1 Ratio: 5 positive interactions for every 1 negative interaction in relationships.'
      }
    ]
  },
  {
    id: 'book-satya-ke-prayog',
    type: 'book',
    title: 'सत्य के प्रयोग (My Experiments with Truth)',
    author: 'Mahatma Gandhi (मोहनदास करमचंद गांधी)',
    year: 1927,
    mood: 'wisdom',
    themeNodes: ['[[सत्याग्रह]]', '[[अहिंसा]]', '[[सर्वोदय]]', '[[अपरिग्रह]]', '[[आत्म-नियंत्रण]]'],
    language: 'Devanagari_Hindi',
    tier: 'reference',
    verification_status: 'verified',
    readTime: '30 min masterclass',
    coreTruth: 'सत्य कोई अमूर्त दार्शनिक विचार नहीं, बल्कि दैनिक व्यावहारिक प्रयोग है; बाह्य स्वतंत्रता आंतरिक आत्म-संयम का परिणाम है।',
    sections: [
      {
        heading: '1. शून्य-ज्ञान कार्यकारी परिचय',
        content: 'यह कोई सामान्य आत्मकथा नहीं, बल्कि एक व्यक्ति की प्रयोगशाला डायरी है जिसने अपने आहार, क्रोध, भय, अहंकार और सत्य के प्रयोगों से ब्रिटिश साम्राज्य को बिना हथियार उठाए झुका दिया।',
        isCallout: true,
        calloutIcon: '🕊️'
      },
      {
        heading: '5 भागों का विस्तृत अध्यायवार विश्लेषण',
        content: '• भाग 1: बचपन, 13 वर्ष में विवाह, मांस खाने की भूल, पिता को चोरी की स्वीकारोक्ति पत्र, लंदन में शाकाहार प्रयोग।\n• भाग 2: दक्षिण अफ्रीका, पीटरमारिट्जबर्ग स्टेशन पर ट्रेन से बाहर फेंका जाना, नेटाल इंडियन कांग्रेस की स्थापना।\n• भाग 3: बोअर युद्ध एम्बुलेंस कॉर्प्स, जॉन रस्किन की "Unto This Last" से फिनिक्स सेटलमेंट, 37 की उम्र में ब्रह्मचर्य व्रत।\n• भाग 4: ब्लैक एक्ट का विरोध, सत्याग्रह का जन्म, टॉलस्टॉय फार्म, 1913 का कोयला खनिकों का महामार्च।\n• भाग 5: भारत वापसी, साबरमती आश्रम, चंपारण नील किसानों की जांच, खेड़ा सत्याग्रह, असहयोग आंदोलन।'
      },
      {
        heading: '7-चरणीय सत्याग्रह कार्यप्रणाली',
        content: '1. बातचीत के सभी रास्ते आजमाना -> 2. जन-शिक्षा -> 3. आत्म-शुद्धि व अनुशासन -> 4. अंतिम अल्टीमेटम -> 5. बहिष्कार व असहयोग -> 6. सविनय अवज्ञा -> 7. रचनात्मक आत्मनिर्भरता।'
      }
    ]
  },
  {
    id: 'book-vastvik-netratva',
    type: 'book',
    title: 'भविष्य: वास्तविक नेतृत्व (भाग-1)',
    author: 'Kshatriya Darshan (क्षत्रिय दर्शन)',
    year: 2017,
    mood: 'veerta',
    themeNodes: ['[[सच्चा नेतृत्व]]', '[[सिद्धान्त-पूजा]]', '[[बीज का सिद्धांत]]', '[[लोक-संग्रह]]', '[[कूटनीति]]'],
    language: 'Devanagari_Hindi',
    tier: 'reference',
    verification_status: 'verified',
    readTime: '20 min masterclass',
    coreTruth: 'सच्चा नेतृत्व वंशानुगत पद या धन से नहीं बनता; व्यक्ति-पूजा पतन लाती है जबकि सिद्धांत-पूजा समाज का पुनरुत्थान करती है।',
    sections: [
      {
        heading: '1. शून्य-ज्ञान कार्यकारी परिचय',
        content: 'जब समाज पतन और उत्थान के संधि-स्थल पर खड़ा होता है, तो सबसे पहली आवश्यकता योग्य नेतृत्व की होती है। अस्थि-मांस के क्षणभंगुर शरीर का अन्धानुकरण करने के बजाय सिद्धांतों का अनुकरण करना ही वास्तविक नेतृत्व की कसौटी है।',
        isCallout: true,
        calloutIcon: '👑'
      },
      {
        heading: '5 प्रमुख अनुभागों का विश्लेषण',
        content: '• अनुभाग 1: व्यक्ति-पूजा का खंडन व सिद्धान्त-पूजा का सिद्धांत\n• अनुभाग 2: किताबी ज्ञान की गठरी ढोने वाले बनाम व्यावहारिक समाज-मनोविज्ञान\n• अनुभाग 3: बीज का सिद्धांत: "बीज का महत्व इस बात में है कि वह अपने जैसे सैकड़ों बीजों का निर्माण करे"\n• अनुभाग 4: कार्यकर्ताओं की उदरपूर्ति (आर्थिक सुरक्षा) व स्वाभिमान की रक्षा; चाटुकारों से बचाव\n• अनुभाग 5: राजनीतिज्ञता, कूटनीति (साम-दाम-दंड-भेद), लोक-संग्रह और सच्चरित्रता'
      }
    ]
  },
  {
    id: 'book-rajput-bhavishya-chintan',
    type: 'book',
    title: 'राजपूत भविष्य चिन्तन (Rajput Bhavishya Chintan)',
    author: 'Giriraj Singh Lotwara (गिरिराज सिंह लोटवाड़ा)',
    year: 2015,
    mood: 'veerta',
    themeNodes: ['[[संस्थागत निर्माण]]', '[[सामाजिक सुधार]]', '[[लोकतांत्रिक नेतृत्व]]', '[[शिक्षा आधुनिकीकरण]]', '[[कुरीति उन्मूलन]]'],
    language: 'Devanagari_Hindi',
    tier: 'reference',
    verification_status: 'verified',
    readTime: '25 min masterclass',
    coreTruth: 'अतीत का गौरव इतिहास की धरोहर है, परन्तु वर्तमान का पुरुषार्थ ही भविष्य की नींव है। कुरीतियों का त्याग और शिक्षा ही असली शक्ति है।',
    sections: [
      {
        heading: '1. शून्य-ज्ञान कार्यकारी परिचय',
        content: 'राजशाही के अंत और लोकतंत्र के आगमन के बाद, समाज को अतीत के मिथ्या अहंकार से निकलकर वर्तमान में शिक्षा, बालिका-शिक्षा, हॉस्टल नेटवर्क और संस्थागत सुधारों को अपनाना होगा।',
        isCallout: true,
        calloutIcon: '🏰'
      },
      {
        heading: '12 अध्यायों का विस्तृत विश्लेषण',
        content: '• अध्याय 1: अतीत का गौरव बनाम वर्तमान यथार्थ (परदादा के महल से आज का राशन नहीं मिलता)\n• अध्याय 2: सामाजिक मानसिकता व आंतरिक ईर्ष्या/टांग-खिंचाई का अंत\n• अध्याय 3: दहेज एवं मृत्युभोज (नुक्ता) जैसी कुरीतियों का पूर्ण बहिष्कार\n• अध्याय 4: राजनैतिक नेतृत्व की विफलता व 36 कौमों के साथ लोकतांत्रिक समन्वय\n• अध्याय 5-6: शिक्षा महाअभियान, बालिका शिक्षा (Girl Child Education), कलम और प्रशासनिक पदों की शक्ति\n• अध्याय 7-8: पारंपरिक रक्षक कर्तव्य व युवा ऊर्जा को प्रतियोगी परीक्षाओं (UPSC/RPSC) में लगाना\n• अध्याय 9-12: चाटुकारितामुक्त संस्थागत नेतृत्व, श्री राजपूत सभा हॉस्टल नेटवर्क व जिला-स्तरीय निगरानी समितियां'
      }
    ]
  }
];
