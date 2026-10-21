export interface BeginnerStep {
  id: number;
  titleUz: string;
  instructionUz: string;
  phraseToLearn: string;
  phoneticUz: string;
  meaningUz: string;
  expectedSpoken: string[];
  aiPraiseEn: string;
  aiPraiseUz: string;
  aiStrictPromptUz: string;
}

export interface BeginnerLesson {
  id: number;
  title: string;
  titleUz: string;
  descriptionUz: string;
  steps: BeginnerStep[];
}

export const BEGINNER_LESSONS: BeginnerLesson[] = [
  {
    id: 1,
    title: 'Lesson 1: Greetings & Introduction',
    titleUz: '1-Dars: Salomlashish va Tanishuv (0 dan)',
    descriptionUz: "Ingliz tilidagi eng birinchi va muhim iboralar: salomlashish va ismingizni aytish.",
    steps: [
      {
        id: 1,
        titleUz: "Salomlashish",
        instructionUz: "Ingliz tilida eng oddiy salomlashish — 'Hello'. Mikrofonni bosing va 'Hello' deb ayting.",
        phraseToLearn: "Hello",
        phoneticUz: "[Hel-lo-u]",
        meaningUz: "Salom",
        expectedSpoken: ["hello", "helo", "halo"],
        aiPraiseEn: "Excellent! First step complete! Barakalla!",
        aiPraiseUz: "Barakalla Yusuf! Birinchi so'zni to'g'ri aytdingiz!",
        aiStrictPromptUz: "Yo'q, eshitilmadi. Qaytadan aniq qilib 'Hello' deng!"
      },
      {
        id: 2,
        titleUz: "Ismingizni aytish",
        instructionUz: "Endi o'zingizni tanishtiring: 'My name is Yusuf'.",
        phraseToLearn: "My name is Yusuf",
        phoneticUz: "[May neym iz Yusuf]",
        meaningUz: "Mening ismim Yusuf",
        expectedSpoken: ["my name is yusuf", "my name is", "name is yusuf"],
        aiPraiseEn: "Brilliant! You introduced yourself perfectly in English!",
        aiPraiseUz: "Juda yaxshi! Endi ismingizni inglizcha ayta olasiz!",
        aiStrictPromptUz: "Qaytadan ayt! 'My name is Yusuf' deb to'liq gapiring!"
      },
      {
        id: 3,
        titleUz: "Qayerdan ekanligingizni aytish",
        instructionUz: "Endi 'Men O'zbekistondanman' deb ayting: 'I am from Uzbekistan'.",
        phraseToLearn: "I am from Uzbekistan",
        phoneticUz: "[Ay em from O'zbekiston]",
        meaningUz: "Men O'zbekistondanman",
        expectedSpoken: ["i am from uzbekistan", "i'm from uzbekistan", "from uzbekistan"],
        aiPraiseEn: "Splendid! Now people know where you come from!",
        aiPraiseUz: "Ofarin! Qayerdan ekanligingizni to'g'ri aytdingiz!",
        aiStrictPromptUz: "Yo'q, 'from' tushib qoldi. Qaytar: 'I am from Uzbekistan'!"
      },
      {
        id: 4,
        titleUz: "Tanishganimdan xursandman",
        instructionUz: "Suhbat oxirida odob bilan aytiladigan ibora: 'Nice to meet you'.",
        phraseToLearn: "Nice to meet you",
        phoneticUz: "[Nays tu miyt yu]",
        meaningUz: "Tanishganimdan xursandman",
        expectedSpoken: ["nice to meet you", "nice to meet u", "meet you"],
        aiPraiseEn: "Barakalla! 1-darsni muvaffaqiyatli yakunladingiz!",
        aiPraiseUz: "Ajoyib! 1-darsni 100% bajardingiz! Endi keyingi darsga o'tamiz.",
        aiStrictPromptUz: "Aniqroq talaffuz qiling: 'Nice to meet you'!"
      }
    ]
  },
  {
    id: 2,
    title: 'Lesson 2: How are you? (Hol-ahvol)',
    titleUz: '2-Dars: Hol-ahvol so\'rash va javob berish',
    descriptionUz: "Kundalik suhbatlarda har doim ishlatiladigan hol-ahvol iboralari.",
    steps: [
      {
        id: 1,
        titleUz: "Hol-ahvol so'rash",
        instructionUz: "'Ishlaringiz qanday?' deb so'rash uchun 'How are you?' deb ayting.",
        phraseToLearn: "How are you?",
        phoneticUz: "[Xau ar yu?]",
        meaningUz: "Qandaysiz? / Ishlaringiz yaxshimi?",
        expectedSpoken: ["how are you", "how r u"],
        aiPraiseEn: "Great question! That's how every English chat begins!",
        aiPraiseUz: "Barakalla! Bu har bir inglizcha suhbatning boshlanishi.",
        aiStrictPromptUz: "Qaytadan ayt: 'How are you?'"
      },
      {
        id: 2,
        titleUz: "Yaxshiman deb javob berish",
        instructionUz: "Javob beramiz: 'I am fine, thank you'.",
        phraseToLearn: "I am fine, thank you",
        phoneticUz: "[Ay em fayn, senk yu]",
        meaningUz: "Men yaxshiman, rahmat",
        expectedSpoken: ["i am fine thank you", "i'm fine thank you", "fine thank you"],
        aiPraiseEn: "Polite and correct! Well done!",
        aiPraiseUz: "Xushmuomala va to'g'ri javob!",
        aiStrictPromptUz: "'I am fine, thank you' deb qaytaring!"
      }
    ]
  },
  {
    id: 3,
    title: 'Lesson 3: Golden Rules ("I agree" not "I am agree")',
    titleUz: '3-Dars: Oltin Qoidalar ("I agree" qoidasi)',
    descriptionUz: "Boshlovchilar eng ko'p qiladigan xatoni yo'qotamiz.",
    steps: [
      {
        id: 1,
        titleUz: "Roziman deb aytish",
        instructionUz: "DIQQAT: Hech qachon 'I am agree' demang! Faqat 'I agree' deb ayting. Qani, takrorlang:",
        phraseToLearn: "I agree",
        phoneticUz: "[Ay egriy]",
        meaningUz: "Men roziman / Qo'shilaman",
        expectedSpoken: ["i agree", "agree"],
        aiPraiseEn: "Exactly! Never say 'I am agree'! Always say 'I agree'!",
        aiPraiseUz: "Barakalla! Endi bu xatoni hech qachon qilmaysiz: 'I agree'!",
        aiStrictPromptUz: "G'azablanaman! 'I am agree' emas, faqat 'I agree' deng!"
      },
      {
        id: 2,
        titleUz: "Menga ingliz tili yoqadi",
        instructionUz: "Endi 'Menga ingliz tili yoqadi' deng: 'I like English'.",
        phraseToLearn: "I like English",
        phoneticUz: "[Ay layk Inglish]",
        meaningUz: "Menga ingliz tili yoqadi",
        expectedSpoken: ["i like english", "like english"],
        aiPraiseEn: "Awesome! And English likes you too!",
        aiPraiseUz: "Zo'r! Ingliz tilini sevish muvaffaqiyat garovidir!",
        aiStrictPromptUz: "'I like English' deb ayting!"
      }
    ]
  }
];
