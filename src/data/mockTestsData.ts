import { SpeakingTopic, WritingPrompt, ReadingTest, ListeningSection, VocabWord } from '../types';

export const SPEAKING_TOPICS: SpeakingTopic[] = [
  {
    id: 'sp-1',
    title: 'Work & Studies',
    part: 1,
    category: 'Daily Life',
    question: 'Do you work or are you currently a student? What do you find most rewarding about it?',
    tips: [
      'Speak in complete sentences with natural compound connectors.',
      'Explain your reasons rather than just answering "Yes" or "I am a student".',
      'Use professional vocabulary like "vocational pursuit", "intellectual curiosity".'
    ]
  },
  {
    id: 'sp-2',
    title: 'Hometown & Community',
    part: 1,
    category: 'Places',
    question: 'What is the most interesting aspect of your hometown, and how has it transformed over the past decade?',
    tips: [
      'Contrast the past with the present using used to / has undergone rapid modernization.',
      'Mention architecture, infrastructure, or community spirit.'
    ]
  },
  {
    id: 'sp-3',
    title: 'Artificial Intelligence & Modern Life',
    part: 1,
    category: 'Technology',
    question: 'How often do you rely on artificial intelligence tools in your daily routine?',
    tips: [
      'Provide specific examples (e.g. translation, automated scheduling, study assistance).',
      'Use phrases like "indispensable asset", "streamlining repetitive tasks".'
    ]
  },
  {
    id: 'sp-4',
    title: 'A Memorable Journey You Took',
    part: 2,
    category: 'Travel & Experience',
    question: 'Describe a memorable journey that left a profound impression on you.',
    cueCardPoints: [
      'Where you went and who accompanied you',
      'What mode of transport you utilized',
      'What unexpected or captivating events unfolded',
      'Explain why this particular journey remains etched in your memory'
    ],
    tips: [
      'Take 1 minute to outline key points on paper or notepad.',
      'Aim to speak for a solid 1.5 to 2 minutes without abrupt pauses.',
      'Use varied past tenses: past continuous, past perfect, and vivid sensory descriptions.'
    ]
  },
  {
    id: 'sp-5',
    title: 'A Challenging Skill You Successfully Learned',
    part: 2,
    category: 'Personal Development',
    question: 'Describe a complex skill you acquired through perseverance.',
    cueCardPoints: [
      'What the skill was and why you chose to learn it',
      'How you practiced and who assisted or guided you',
      'What obstacles you encountered along the path',
      'Explain how mastering this skill transformed your self-confidence'
    ],
    tips: [
      'Focus on the progression: initial struggle -> consistent practice -> eventual mastery.',
      'Use idioms: "steep learning curve", "hit a brick wall", "reap the fruits of labor".'
    ]
  },
  {
    id: 'sp-6',
    title: 'Impact of Automation on Employment',
    part: 3,
    category: 'Society & Economy',
    question: 'Do you believe that increasing automation and AI will create more career opportunities than it eliminates?',
    tips: [
      'Weigh both perspectives objectively before stating your nuanced conclusion.',
      'Use hedging devices: "It is widely contended that...", "Notwithstanding these disruptions...".'
    ]
  },
  {
    id: 'sp-7',
    title: 'Preserving Cultural Heritage in a Globalized Era',
    part: 3,
    category: 'Culture & Globalization',
    question: 'Why is it essential for governments to allocate financial resources toward preserving traditional crafts and customs?',
    tips: [
      'Discuss cultural identity, tourism economic benefits, and intergenerational transmission.',
      'Use academic register: "intangible cultural heritage", "homogenization", "ancestral lineage".'
    ]
  }
];

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'wr-1',
    taskType: 'task1',
    title: 'Renewable vs Fossil Fuel Energy Consumption (1990 - 2025)',
    type: 'Academic Line Graph',
    targetWords: 150,
    timeMinutes: 20,
    promptText: 'The graph below illustrates the changes in energy consumption derived from renewable sources compared to fossil fuels across four industrialized nations between 1990 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartDescription: 'Key Data Trends:\n• Fossil fuels accounted for 82% of total energy in 1990, declining steadily to 58% by 2025.\n• Solar and wind experienced exponential acceleration post-2010, surging from 4% to 28%.\n• Hydroelectric power remained relatively stable at approximately 12-14% throughout the entire timeframe.'
  },
  {
    id: 'wr-2',
    taskType: 'task2',
    title: 'Artificial Intelligence in Higher Education',
    type: 'Opinion / Argumentative Essay',
    targetWords: 250,
    timeMinutes: 40,
    promptText: 'Some educators believe that artificial intelligence tools should be prohibited in university examinations and assignments to protect academic honesty. Others maintain that universities should instead integrate AI into teaching curricula. Discuss both views and give your own opinion.'
  },
  {
    id: 'wr-3',
    taskType: 'task2',
    title: 'Government Expenditure: Space Exploration vs Healthcare',
    type: 'Discussion with Opinion',
    targetWords: 250,
    timeMinutes: 40,
    promptText: 'Massive financial investments are allocated annually toward space exploration and interplanetary missions. Some argue that this money would be far better spent resolving critical public health crises and poverty on Earth. To what extent do you agree or disagree?'
  },
  {
    id: 'wr-4',
    taskType: 'task1',
    title: 'Formal Letter to Municipal City Council',
    type: 'General Training Letter',
    targetWords: 150,
    timeMinutes: 20,
    promptText: 'You have noticed that a historic public park in your neighborhood has fallen into severe disrepair with damaged pathways and insufficient lighting. Write a formal letter to your local municipal council. In your letter:\n- Describe the current condition of the park\n- Explain how this poses safety hazards to residents\n- Propose actionable solutions for restoration'
  }
];

export const READING_TESTS: ReadingTest[] = [
  {
    id: 'rd-1',
    title: 'Reading Test 01 - Computer-Delivered',
    difficulty: 'Medium',
    passageTitle: 'The Architecture of Termite Mounds: Biomimicry in Sustainable Construction',
    passageContent: [
      'A. In the arid savannas of southern Africa, microscopic architects construct towers reaching up to eight meters in height. These are the nests of Macrotermes bellicosus, a species of fungus-farming termite. Despite exterior desert temperatures fluctuating from freezing nighttime lows of 2°C to scorching midday peaks exceeding 40°C, the inner sanctum of these mounds maintains an astonishingly constant temperature of approximately 30°C and a steady relative humidity of 90 percent.',
      'B. For decades, entomologists posited that the mound functioned as a passive thermosiphon: hot metabolic air produced by billions of fungal spores and termites rose through a central chimney, creating a suction mechanism that drew fresh cool air into subterranean cellars. However, recent tomographic imaging and computerized fluid dynamic simulations conducted by biomechanical engineers have revealed a far more intricate, dynamic pulmonary system.',
      'C. Rather than relying on a steady convection current, the mound acts as an acoustic lung driven by external wind turbulence. The mound wall consists of an outer porous rind pierced by microscopic tunnels. When high-frequency wind gusts buffet the structure, they oscillate pressure waves through these flues, driving an exchange of carbon dioxide for oxygen without exhausting the precious internal humidity needed to sustain the colony’s primary food source—a specialized fungus known as Termitomyces.',
      'D. Human architects have eagerly looked to termite mounds as paradigms of sustainable biomimicry. The most celebrated application is the Eastgate Centre, a mid-rise shopping and office complex in Harare, Zimbabwe, conceived by architect Mick Pearce in collaboration with Arup engineers. Instead of installing energy-voracious conventional mechanical refrigeration units, Pearce engineered the building with concrete slabs and hollow ducts that soak up heat during daytime hours and release it via roof vents driven by nocturnal cool air.',
      'E. The ecological and economic dividends of the Eastgate design are substantial. The complex consumes 35% less energy than six comparable conventional buildings in Harare, saving the property developers approximately $3.5 million in upfront HVAC capital costs alone. As urbanization intensifies and global climate targets become progressively more stringent, passive biomimetic ventilation systems represent a crucial frontier in eco-friendly civic engineering.'
    ],
    questions: [
      {
        id: 1,
        type: 'tfng',
        question: 'The internal temperature of Macrotermes bellicosus mounds shifts drastically between day and night.',
        correctAnswer: 'FALSE',
        explanation: 'Paragraph A clearly states that despite exterior fluctuations from 2°C to 40°C, "the inner sanctum of these mounds maintains an astonishingly constant temperature of approximately 30°C".'
      },
      {
        id: 2,
        type: 'tfng',
        question: 'Recent scientific imaging proved that the original thermosiphon hypothesis was entirely accurate.',
        correctAnswer: 'FALSE',
        explanation: 'Paragraph B explains that recent tomographic imaging revealed "a far more intricate, dynamic pulmonary system" rather than the simplistic passive thermosiphon theory previously posited.'
      },
      {
        id: 3,
        type: 'tfng',
        question: 'The specialized Termitomyces fungus requires high levels of moisture to thrive inside the nest.',
        correctAnswer: 'TRUE',
        explanation: 'Paragraph C states that the mechanism exchanges gases "without exhausting the precious internal humidity needed to sustain the colony’s primary food source—a specialized fungus known as Termitomyces".'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: 'According to Paragraph D, what was the primary innovation of the Eastgate Centre in Harare?',
        options: [
          'A. It uses deep underground geothermal water to freeze air',
          'B. It utilized hollow ducts and concrete thermal mass instead of conventional air conditioning',
          'C. It was constructed exclusively from African clay imported from termite territories',
          'D. It generated electric energy directly from acoustic wind turbulence'
        ],
        correctAnswer: 'B',
        explanation: 'Paragraph D notes that Pearce engineered the building with concrete slabs and hollow ducts that absorb heat during the day and purge it at night, replacing conventional air conditioning.'
      },
      {
        id: 5,
        type: 'multiple-choice',
        question: 'What financial benefit did the developers of Eastgate Centre experience during initial construction?',
        options: [
          'A. A government subsidy equal to 50% of the land value',
          'B. Saving approximately $3.5 million in upfront air conditioning system costs',
          'C. Zero operational maintenance expenditure over thirty years',
          'D. Quadrupled rental prices due to high ecological status'
        ],
        correctAnswer: 'B',
        explanation: 'Paragraph E states that it saved property developers "approximately $3.5 million in upfront HVAC capital costs alone".'
      }
    ]
  },
  {
    id: 'rd-2',
    title: 'Reading Test 02 - History of Cryptography',
    difficulty: 'Hard',
    passageTitle: 'The Silent Code: Secret Communication Through the Millennia',
    passageContent: [
      'A. The human impulse to communicate privately is as ancient as the written word itself. Ancient Spartan generals utilized the scytale—a wooden cylinder around which a strip of parchment was wrapped; messages scribed longitudinally became unreadable gibberish once unwrapped, decipherable only by a recipient possessing a baton of identical diameter.',
      'B. In the Renaissance, cipher systems elevated into mathematical sciences. Leon Battista Alberti invented the polyalphabetic cipher disk in 1467, which precluded basic frequency analysis by alternating between multiple cipher alphabets throughout a single transmission.',
      'C. The 20th century transformed cipher warfare from manual pen-and-paper encryption to electromechanical apparatuses. The pinnacle of this era was the German Enigma machine, an electro-mechanical rotor apparatus capable of generating billions of cryptographic combinations, until mathematicians at Bletchley Park, spearheaded by Alan Turing, breached its mathematical fortress.'
    ],
    questions: [
      {
        id: 1,
        type: 'tfng',
        question: 'A Spartan scytale message could be decoded by anyone who intercepted the parchment strip.',
        correctAnswer: 'FALSE',
        explanation: 'Paragraph A states it was decipherable only by a recipient possessing a baton of identical diameter.'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'What made Alberti’s cipher disk an important breakthrough in 1467?',
        options: [
          'A. It prevented basic frequency analysis by alternating alphabets',
          'B. It was the first electronic device in cryptography',
          'C. It used invisible inks derived from citrus extracts',
          'D. It was unbreakable by modern supercomputers'
        ],
        correctAnswer: 'A',
        explanation: 'Paragraph B explicitly specifies that the polyalphabetic cipher disk "precluded basic frequency analysis by alternating between multiple cipher alphabets".'
      }
    ]
  }
];

export const LISTENING_SECTIONS: ListeningSection[] = [
  {
    id: 'ls-1',
    title: 'Section 1: University Student Accommodation Intake',
    context: 'A prospective postgraduate student is inquiring with the Campus Housing Officer regarding residential options.',
    audioDuration: '3 min 20 sec',
    transcript: `Officer: Good morning! Welcome to the International Student Housing Office. How can I assist you today?
Student: Hello, my name is Alex Vance. I am starting my Masters in Renewable Energy this September and I would like to arrange on-campus accommodation.
Officer: Excellent, Alex. We have three main residential halls available for postgraduates. The first is Westgrove Hall, located directly adjacent to the engineering faculty. All rooms there are en-suite, meaning you have your own private bathroom, and meals are fully catered in the dining hall.
Student: That sounds convenient, but what is the weekly rent?
Officer: Westgrove is £185 per week, which includes high-speed Wi-Fi and utility charges.
Student: I see. And what about the self-catered alternatives?
Officer: Our most popular option is Meadow Court. In Meadow Court, six students share a spacious kitchen equipped with modern induction cookers and dishwashers. The weekly fee is considerably lower at £135.
Student: Meadow Court sounds ideal for my budget! Are laundry facilities readily accessible there?
Officer: Yes, each flat block has a coinless digital laundry room on the ground floor. You simply tap your student ID card to activate the washers.`,
    questions: [
      {
        id: 1,
        question: 'What degree is the student Alex Vance pursuing?',
        options: ['A. Civil Engineering', 'B. Renewable Energy', 'C. Urban Architecture'],
        correctAnswer: 'B',
        explanation: 'The student states: "I am starting my Masters in Renewable Energy this September".'
      },
      {
        id: 2,
        question: 'What is the weekly cost for the self-catered Meadow Court accommodation?',
        options: ['A. £135', 'B. £185', 'C. £150'],
        correctAnswer: 'A',
        explanation: 'The officer confirms: "The weekly fee is considerably lower at £135".'
      },
      {
        id: 3,
        question: 'How do students activate the laundry machines in Meadow Court?',
        options: ['A. Inserting £2 coins', 'B. Booking online 24 hours ahead', 'C. Tapping their student ID card'],
        correctAnswer: 'C',
        explanation: 'The officer explains: "You simply tap your student ID card to activate the washers".'
      }
    ]
  }
];

export const VOCAB_DATABASE: VocabWord[] = [
  {
    id: 'v-1',
    word: 'Paramount',
    partOfSpeech: 'Adjective',
    phonetic: '/ˈpær.ə.maʊnt/',
    definitionEn: 'More important than anything else; supreme in rank or authority.',
    definitionUz: 'Nihoyatda muhim, eng ustuvor, hal qiluvchi darajada muhim.',
    bandLevel: 'Band 8.0+',
    collocations: ['Paramount importance', 'Paramount consideration', 'Play a paramount role'],
    example: 'Safeguarding public public health should be of paramount importance to municipal planners.',
    synonyms: ['Crucial', 'Predominant', 'Foremost', 'Vital']
  },
  {
    id: 'v-2',
    word: 'Exacerbate',
    partOfSpeech: 'Verb',
    phonetic: '/ɪɡˈzæs.ɚ.beɪt/',
    definitionEn: 'To make a problem, bad situation, or negative feeling worse.',
    definitionUz: 'Vaziyatni yanada og\'irlashtirmoq, yomonlashtirmoq, kuchaytirmoq.',
    bandLevel: 'Band 8.0+',
    collocations: ['Exacerbate the crisis', 'Exacerbate existing tensions', 'Significantly exacerbate'],
    example: 'Uncontrolled urban sprawl will merely exacerbate traffic congestion and air pollution.',
    synonyms: ['Aggravate', 'Worsen', 'Intensify', 'Compound']
  },
  {
    id: 'v-3',
    word: 'Pragmatic',
    partOfSpeech: 'Adjective',
    phonetic: '/præɡˈmæt.ɪk/',
    definitionEn: 'Dealing with things sensibly and realistically based on practical rather than theoretical considerations.',
    definitionUz: 'Amaliy, realistik, hayotiy yondashuvga asoslangan.',
    bandLevel: 'Band 7.5+',
    collocations: ['Pragmatic approach', 'Pragmatic solution', 'Adopt a pragmatic stance'],
    example: 'Governments must adopt a pragmatic approach when balancing industrial growth with environmental quotas.',
    synonyms: ['Practical', 'Realistic', 'Sensible', 'Hard-headed']
  },
  {
    id: 'v-4',
    word: 'Ubiquitous',
    partOfSpeech: 'Adjective',
    phonetic: '/juːˈbɪk.wə.t̬əs/',
    definitionEn: 'Present, appearing, or found everywhere simultaneously.',
    definitionUz: 'Hamma joyda uchraydigan, keng tarqalgan, universal.',
    bandLevel: 'Band 8.5+',
    collocations: ['Ubiquitous presence', 'Become ubiquitous', 'Ubiquitous technology'],
    example: 'Smartphones have transitioned from luxurious novelties to ubiquitous tools of daily existence.',
    synonyms: ['Omnipresent', 'Pervasive', 'Prevalent', 'Widespread']
  },
  {
    id: 'v-5',
    word: 'Substantiate',
    partOfSpeech: 'Verb',
    phonetic: '/səbˈstæn.ʃi.eɪt/',
    definitionEn: 'To provide evidence to support or prove the truth of an assertion.',
    definitionUz: 'Dalillar bilan isbotlamoq, asoslamoq, tasdiqlamoq.',
    bandLevel: 'Band 8.0+',
    collocations: ['Substantiate claims', 'Substantiate hypothesis', 'Empirically substantiate'],
    example: 'Academic researchers must provide empirical data to substantiate their hypotheses.',
    synonyms: ['Corroborate', 'Validate', 'Authenticate', 'Verify']
  },
  {
    id: 'v-6',
    word: 'Pivotal',
    partOfSpeech: 'Adjective',
    phonetic: '/ˈpɪv.ə.t̬əl/',
    definitionEn: 'Of crucial importance in relation to the development or success of something else.',
    definitionUz: 'Burilish yasovchi, o\'zakli, eng muhim rol o\'ynovchi.',
    bandLevel: 'Band 7.5+',
    collocations: ['Pivotal moment', 'Play a pivotal role', 'Pivotal factor'],
    example: 'Early childhood education plays a pivotal role in shaping lifelong cognitive abilities.',
    synonyms: ['Central', 'Crucial', 'Critical', 'Decisive']
  },
  {
    id: 'v-7',
    word: 'Mitigate',
    partOfSpeech: 'Verb',
    phonetic: '/ˈmɪt̬.ə.ɡeɪt/',
    definitionEn: 'To make something bad or painful less severe, serious, or harmful.',
    definitionUz: 'Yumshatmoq, zararini kamaytirmoq, xavfni pasaytirmoq.',
    bandLevel: 'Band 8.0+',
    collocations: ['Mitigate risks', 'Mitigate the impact of climate change', 'Effectively mitigate'],
    example: 'Transitioning to renewable energy is the most effective strategy to mitigate global greenhouse emissions.',
    synonyms: ['Alleviate', 'Lessen', 'Diminish', 'Moderate']
  },
  {
    id: 'v-8',
    word: 'Elucidate',
    partOfSpeech: 'Verb',
    phonetic: '/iˈluː.sə.deɪt/',
    definitionEn: 'To make something clear or easy to understand by explaining it thoroughly.',
    definitionUz: 'Oydinlik kiritmoq, batafsil tushuntirib bermoq.',
    bandLevel: 'Band 8.5+',
    collocations: ['Elucidate the reasons', 'Elucidate a concept', 'Help elucidate'],
    example: 'The professor used real-world case studies to elucidate complex economic theorems.',
    synonyms: ['Clarify', 'Illuminate', 'Explicate', 'Demystify']
  }
];
