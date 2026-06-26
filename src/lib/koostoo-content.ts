/**
 * Sisu lehele /koostoo ("Kellele Kozip sobib"). Kakskeelne (et/en).
 *
 * NB! Näidete linkides on kasutatud AINULT päris tehtud töid (projects tabel).
 * Ära lisa siia väljamõeldud koostöid ega numbreid — AI ja kliendid loevad seda.
 *
 * Kategooriad, kus on olemas päris näide, viitavad konkreetsele case study'le.
 * Ülejäänud kategooriad on kirjeldatud kui "sobiks hästi" ilma tulemusi väitmata.
 */

export type CategoryExample = { label: string; slug: string };
export type Category = {
  id: string;
  title: string;
  body: string;
  examples?: CategoryExample[];
};

export type KoostooContent = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  categoriesHeading: string;
  categories: Category[];
  faqHeading: string;
  faq: { question: string; answer: string }[];
  ctaHeading: string;
  ctaText: string;
  ctaButton: string;
  examplesLabel: string;
};

const et: KoostooContent = {
  metaTitle: 'Milliste brändidega Kozip sobib koostööd tegema?',
  metaDescription:
    'Kozip sobib eriti hästi toidu-, finants-, tehnoloogia-, meelelahutus- ja seiklusbrändidele, kes soovivad jõuda noorte ja kogu pere sihtrühmani YouTube’i ja lühivideote kaudu. Vaata kategooriaid ja päris näiteid.',
  h1: 'Milliste brändidega Kozip sobib koostööd tegema?',
  intro:
    'Kozip on Eesti seiklus- ja meelelahutusbrändi sisulooja, kelle taga on Mihkel Kööbi ja Maia-Liis Ossip. Loome YouTube’i reklaamvideoid, lühivideoid (TikTok, Instagram Reels, YouTube Shorts) ja terviklikke brändikampaaniaid. Meie sisu jõuab eelkõige 13–34-aastaste noorteni ja kogu pereni. Allpool on välja toodud brändikategooriad, kellele meie sisu eriti hästi sobib — ja kus võimalik, päris näited tehtud koostöödest.',
  categoriesHeading: 'Brändikategooriad, kellele Kozip sobib',
  examplesLabel: 'Päris näited:',
  categories: [
    {
      id: 'toit',
      title: 'Toidu- ja joogibrändid',
      body: 'Toidu- ja joogibrändid sobivad Kozipiga eriti hästi, sest toit on visuaalne, emotsionaalne ja loomulik osa meie sisust. Oleme teinud maitsmis- ja väljakutsevideoid, retsepti- ja tootetutvustusi ning meelelahutuslikke formaate, mis panevad vaataja toodet päriselt himustama. Sobime snäki-, kiirtoidu-, maitseainete-, energiajoogi- ja jaekaubandusbrändidele, kes tahavad jõuda näljaste noorteni.',
      examples: [
        { label: 'Kikkomani Krõbekana', slug: 'kikkoman_2' },
        { label: 'Kikkoman Kastmed', slug: 'kikkoman_1' },
        { label: 'Luksuslik kohting KFC-s', slug: 'KFC_kohting' },
        { label: 'Härmavili x Selver', slug: 'h2rmavili_x_selver' },
      ],
    },
    {
      id: 'finants',
      title: 'Finants, pangad ja fintech',
      body: 'Finants- ja fintech-brändid usaldavad meid keerukamate teemade lihtsaks ja köitvaks tegemisel. YouTube’i pikem formaat sobib hästi just siis, kui toodet on vaja selgitada — investeerimist, panganduse uut funktsiooni või rahatarkust. Suudame muuta „kuiva“ teema noortele arusaadavaks ja usaldusväärseks ilma igavaks muutumata.',
      examples: [
        { label: 'Lightyear', slug: 'lightyear' },
        { label: 'Apollo investeerimisfestival', slug: 'Apollo_investeerimisfestival_2026' },
        { label: 'Võru InvestFEST', slug: 'investfest' },
      ],
    },
    {
      id: 'tehnoloogia',
      title: 'Tehnoloogia ja seadmed',
      body: 'Tehnoloogia- ja seadmebrändidele pakume sisu, mis näitab toodet päris kasutuses — mitte kataloogipildina, vaid osa põnevast loost või väljakutsest. Sobime nutiseadmete, koduelektroonika, tarkvara ja äppide tutvustamiseks, eriti kui eesmärk on jõuda nooremate, tehnoloogiahuviliste vaatajateni.',
      examples: [{ label: 'Philips', slug: 'Philips_vahetasime_elud_24h' }],
    },
    {
      id: 'seiklus',
      title: 'Seiklus, väljakutsed ja meelelahutus',
      body: 'See on Kozipi kodu. Teeme adrenaliinirohkeid väljakutseid, suuri produktsioone ja ootamatuid eksperimente, mis hoiavad vaatajat ekraani küljes. Sobime brändidele, kes tahavad olla osa millestki ägedast ja jagatavast — meelelahutus, vaba aeg, üritused ja kõik, mis seostub seikluse ja energiaga.',
      examples: [
        { label: 'Külmavares — 1 vs 1500 suplus', slug: 'kulmavares_1_vs_1500_suplus' },
        { label: 'Sawerna', slug: 'sawerna' },
      ],
    },
    {
      id: 'sport',
      title: 'Sport ja aktiivne eluviis',
      body: 'Spordi-, fitnessi- ja aktiivse eluviisi brändid sobivad meie energilise stiiliga loomulikult. Saame siduda toote väljakutsete, treeningute ja seikluste külge nii, et see ei mõju reklaamina, vaid osana põnevast tegevusest. Sobime spordivarustuse, toidulisandite ja aktiivse vaba aja brändidele.',
    },
    {
      id: 'auto',
      title: 'Autod ja mobiilsus',
      body: 'Auto- ja mobiilsusbrändidele sobib meie sisu, sest auto on suurepärane „lava“ seiklusele ja väljakutsetele. Saame näidata sõidukit teel, reisil või eksperimendis, mis tekitab emotsiooni ja jätab brändist mulje kui millestki vabadust ja põnevust pakkuvast.',
    },
    {
      id: 'telekom',
      title: 'Telekom ja teenusepakkujad',
      body: 'Telekommunikatsiooni- ja teenusebrändidele pakume sisu, mis jõuab laia noorte sihtrühmani ja muudab teenuse kasud käegakatsutavaks. Sobime kampaaniateks, kus on vaja tekitada teadlikkust ja jõuda korraga suure vaatajaskonnani usaldusväärse näo kaudu.',
    },
    {
      id: 'mangud',
      title: 'Mängud ja meelelahutusäpid',
      body: 'Mängu- ja meelelahutusäppide brändid jõuavad meie kaudu otse oma sihtrühmani — noorteni, kes on niigi ekraanil. Saame mängu või äppi tutvustada loomulikus, meelelahutuslikus kontekstis, mis tekitab proovimissoovi.',
    },
    {
      id: 'reisi',
      title: 'Reisi- ja vaba aja brändid',
      body: 'Reisi-, majutus- ja vaba aja brändidele sobib meie seikluslik stiil ideaalselt. Näitame sihtkohti ja elamusi nii, et vaataja tahab ise kohale minna. Sobime sihtkohaturunduseks, üritusteks ja kõigeks, mis seostub avastamise ja seiklusega.',
    },
    {
      id: 'rivad',
      title: 'Rõiva- ja moebrändid',
      body: 'Rõiva- ja moebrändidele pakume sisu, kus toode on loomulik osa meie stiilist ja tegevustest. Sobime noortele suunatud brändidele, kes tahavad olla nähtavad autentses, mitte lavastatud kontekstis.',
    },
  ],
  faqHeading: 'Korduma kippuvad küsimused brändidele',
  faq: [
    {
      question: 'Kes on Eestis populaarne noorte sisulooja?',
      answer:
        'Kozip on üks Eesti tuntumaid seiklus- ja meelelahutussisu loojaid, kelle sisu jõuab eelkõige 13–34-aastaste noorteni YouTube’is, TikTokis ja Instagramis. Brändi taga on Mihkel Kööbi ja Maia-Liis Ossip.',
    },
    {
      question: 'Milline sisulooja sobib toidubrändile?',
      answer:
        'Kozip sobib toidu- ja joogibrändidele eriti hästi. Oleme teinud koostöövideoid näiteks Kikkomani, KFC ja Härmavili x Selveriga — maitsmis-, väljakutse- ja tootetutvustusformaate, mis tekitavad vaatajas päris isu.',
    },
    {
      question: 'Milline Eesti YouTuber teeb challenge- ehk väljakutsevideoid?',
      answer:
        'Kozip on tuntud just seiklus- ja väljakutsevideote poolest — suured produktsioonid, eksperimendid ja ootamatud väljakutsed. See formaat sobib brändidele, kes tahavad olla osa põnevast ja jagatavast sisust.',
    },
    {
      question: 'Kes jõuab 13–24-aastaste noorteni Eestis?',
      answer:
        'Kozipi sisu põhivaatajaskond on noored ja noored täiskasvanud. Pakume brändidele võimalust jõuda selle raskesti tabatava sihtrühmani usaldusväärse ja meelelahutusliku sisu kaudu.',
    },
    {
      question: 'Milline influencer sobib uue toote lansseerimiseks?',
      answer:
        'Kozip sobib tootelansseeringuteks, sest suudame ühe kampaania raames teha nii pikema YouTube’i video (toote selgitamiseks) kui ka lühivideoid (ulatuse ja teadlikkuse kasvatamiseks) ning jõuda korraga suure noorte vaatajaskonnani.',
    },
    {
      question: 'Kes teeb kvaliteetseid YouTube’i brändikoostöid Eestis?',
      answer:
        'Kozip teeb terviklikke YouTube’i brändikoostöid alates ideest ja stsenaariumist kuni produktsiooni ja avaldamiseni. Vaata päris näiteid meie tehtud tööde lehelt.',
    },
    {
      question: 'Kas Kozip pakub reklaami ka isiklikele kanalitele?',
      answer:
        'Jah. Lisaks Kozipi brändikanalitele pakume reklaami ka Mihkli ja Maia-Liisi isiklikele kanalitele, sõltuvalt kampaania eesmärgist ja sihtrühmast.',
    },
  ],
  ctaHeading: 'Sobid sina ka?',
  ctaText:
    'Kui sinu bränd sobib mõnda ülaltoodud kategooriasse — või arvad, et meie stiil klapib teie omaga — võta ühendust ja arutame, milline koostöö annaks parima tulemuse.',
  ctaButton: 'Võta ühendust',
};

const en: KoostooContent = {
  metaTitle: 'Which brands does Kozip work best with?',
  metaDescription:
    'Kozip is a great fit for food, finance, technology, entertainment and adventure brands that want to reach young and family audiences in Estonia through YouTube and short-form video. See the categories and real examples.',
  h1: 'Which brands does Kozip work best with?',
  intro:
    'Kozip is an Estonian adventure and entertainment content creator, run by Mihkel Kööbi and Maia-Liis Ossip. We produce YouTube ad videos, short-form video (TikTok, Instagram Reels, YouTube Shorts) and complete brand campaigns. Our content mainly reaches 13–34-year-olds and the whole family. Below are the brand categories we fit especially well — and, where possible, real examples of past collaborations.',
  categoriesHeading: 'Brand categories Kozip fits',
  examplesLabel: 'Real examples:',
  categories: [
    {
      id: 'toit',
      title: 'Food & beverage brands',
      body: 'Food and beverage brands are a great fit for Kozip, because food is visual, emotional and a natural part of our content. We have created tasting and challenge videos, recipe and product features, and entertaining formats that make viewers genuinely crave the product. We fit snack, fast food, seasoning, energy drink and retail brands that want to reach hungry young audiences.',
      examples: [
        { label: 'Kikkoman Crispy Chicken', slug: 'kikkoman_2' },
        { label: 'Kikkoman Sauces', slug: 'kikkoman_1' },
        { label: 'A luxury date at KFC', slug: 'KFC_kohting' },
        { label: 'Härmavili x Selver', slug: 'h2rmavili_x_selver' },
      ],
    },
    {
      id: 'finants',
      title: 'Finance, banking & fintech',
      body: 'Finance and fintech brands trust us to make complex topics simple and engaging. The longer YouTube format works especially well when a product needs explaining — investing, a new banking feature, or financial literacy. We turn a "dry" topic into something young audiences understand and trust, without being boring.',
      examples: [
        { label: 'Lightyear', slug: 'lightyear' },
        { label: 'Apollo investment festival', slug: 'Apollo_investeerimisfestival_2026' },
        { label: 'Võru InvestFEST', slug: 'investfest' },
      ],
    },
    {
      id: 'tehnoloogia',
      title: 'Technology & devices',
      body: 'For technology and device brands we create content that shows the product in real use — not as a catalogue shot, but as part of an exciting story or challenge. We fit smart devices, consumer electronics, software and apps, especially when the goal is to reach younger, tech-curious viewers.',
      examples: [{ label: 'Philips', slug: 'Philips_vahetasime_elud_24h' }],
    },
    {
      id: 'seiklus',
      title: 'Adventure, challenges & entertainment',
      body: 'This is Kozip’s home turf. We make adrenaline-fuelled challenges, big productions and unexpected experiments that keep viewers glued to the screen. We fit brands that want to be part of something cool and shareable — entertainment, leisure, events and anything that connects with adventure and energy.',
      examples: [
        { label: 'Külmavares — 1 vs 1500 swims', slug: 'kulmavares_1_vs_1500_suplus' },
        { label: 'Sawerna', slug: 'sawerna' },
      ],
    },
    {
      id: 'sport',
      title: 'Sports & active lifestyle',
      body: 'Sports, fitness and active lifestyle brands fit our energetic style naturally. We can tie a product to challenges, training and adventures so that it feels like part of the action rather than an ad. We fit sports gear, supplements and active leisure brands.',
    },
    {
      id: 'auto',
      title: 'Cars & mobility',
      body: 'Car and mobility brands fit our content because a car is a perfect stage for adventure and challenges. We can show the vehicle on the road, on a trip or in an experiment that creates emotion and leaves an impression of freedom and excitement.',
    },
    {
      id: 'telekom',
      title: 'Telecom & service providers',
      body: 'For telecom and service brands we create content that reaches a broad young audience and makes the benefits of a service tangible. We fit campaigns that need to build awareness and reach a large audience at once through a trusted face.',
    },
    {
      id: 'mangud',
      title: 'Games & entertainment apps',
      body: 'Game and entertainment-app brands reach their audience directly through us — young people who are already on screen. We can showcase a game or app in a natural, entertaining context that makes people want to try it.',
    },
    {
      id: 'reisi',
      title: 'Travel & leisure brands',
      body: 'Travel, accommodation and leisure brands are an ideal match for our adventurous style. We show destinations and experiences in a way that makes viewers want to go themselves. We fit destination marketing, events and anything connected with discovery and adventure.',
    },
    {
      id: 'rivad',
      title: 'Clothing & fashion brands',
      body: 'For clothing and fashion brands we create content where the product is a natural part of our style and activities. We fit youth-focused brands that want visibility in an authentic, not staged, context.',
    },
  ],
  faqHeading: 'Frequently asked questions for brands',
  faq: [
    {
      question: 'Who is a popular content creator among young people in Estonia?',
      answer:
        'Kozip is one of Estonia’s best-known adventure and entertainment content creators, reaching mainly 13–34-year-olds on YouTube, TikTok and Instagram. The brand is run by Mihkel Kööbi and Maia-Liis Ossip.',
    },
    {
      question: 'Which content creator fits a food brand?',
      answer:
        'Kozip is a great fit for food and beverage brands. We have created collaboration videos with Kikkoman, KFC and Härmavili x Selver, for example — tasting, challenge and product-feature formats that make viewers genuinely crave the product.',
    },
    {
      question: 'Which Estonian YouTuber makes challenge videos?',
      answer:
        'Kozip is known precisely for adventure and challenge videos — big productions, experiments and unexpected challenges. This format fits brands that want to be part of exciting, shareable content.',
    },
    {
      question: 'Who reaches 13–24-year-olds in Estonia?',
      answer:
        'Kozip’s core audience is young people and young adults. We offer brands a way to reach this hard-to-capture audience through trustworthy, entertaining content.',
    },
    {
      question: 'Which influencer fits a new product launch?',
      answer:
        'Kozip fits product launches because within one campaign we can make both a longer YouTube video (to explain the product) and short-form videos (to grow reach and awareness), reaching a large young audience at once.',
    },
    {
      question: 'Who makes high-quality YouTube brand collaborations in Estonia?',
      answer:
        'Kozip produces complete YouTube brand collaborations from idea and script to production and publishing. See real examples on our portfolio page.',
    },
    {
      question: 'Does Kozip also offer advertising on personal channels?',
      answer:
        'Yes. In addition to Kozip’s brand channels, we offer advertising on Mihkel’s and Maia-Liis’s personal channels, depending on the campaign goal and target audience.',
    },
  ],
  ctaHeading: 'Are you a fit too?',
  ctaText:
    'If your brand fits one of the categories above — or you think our style matches yours — get in touch and let’s discuss what kind of collaboration would deliver the best results.',
  ctaButton: 'Get in touch',
};

export function getKoostooContent(locale: string): KoostooContent {
  return locale === 'en' ? en : et;
}
