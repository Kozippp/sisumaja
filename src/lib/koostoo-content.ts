/**
 * Sisu lehele /koostoo ("Kellele Kozip sobib"). Kakskeelne (et/en).
 *
 * NB! Näidete linkides on kasutatud AINULT päris tehtud töid (projects tabel).
 * Ära lisa siia väljamõeldud koostöid ega numbreid — AI ja kliendid loevad seda.
 *
 * `categories` = 4 peakategooriat, kus on päris case study'd (kuvatakse suurelt,
 * thumbnail-kaartidega). `moreCategories` = ülejäänud valdkonnad, üks lause igaüks.
 */

export type CategoryExample = { label: string; slug: string };
export type Category = {
  id: string;
  title: string;
  body: string;
  examples: CategoryExample[];
};
export type MoreCategory = {
  id: string;
  title: string;
  body: string;
};

export type KoostooContent = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  categoriesHeading: string;
  categoriesSubheading: string;
  categories: Category[];
  moreHeading: string;
  moreSubheading: string;
  moreCategories: MoreCategory[];
  faqHeading: string;
  faq: { question: string; answer: string }[];
  ctaHeading: string;
  ctaText: string;
  ctaButton: string;
  ctaSecondary: string;
};

const et: KoostooContent = {
  metaTitle: 'Milliste brändidega Kozip sobib koostööd tegema?',
  metaDescription:
    'Kozip sobib eriti hästi toidu-, finants-, tehnoloogia- ja meelelahutusbrändidele, kes soovivad jõuda noorte vaatajateni YouTube’i ja lühivideote kaudu. Vaata kategooriaid ja päris näiteid.',
  h1: 'Milliste brändidega Kozip sobib?',
  intro:
    'Kozip on Eesti seiklus- ja meelelahutussisu looja, kelle taga on Mihkel Kööbi ja Maia-Liis Ossip. Loome YouTube’i reklaamvideoid, lühivideoid ja terviklikke kampaaniaid, mis jõuavad 13–34-aastaste vaatajateni. Siin on valdkonnad, kus meie sisu kõige paremini töötab — koos päris näidetega.',
  categoriesHeading: 'Kus meie sisu kõige paremini töötab',
  categoriesSubheading: 'Neli valdkonda, kus oleme end juba tõestanud. Iga näide on päris koostöö — kliki ja vaata ise.',
  categories: [
    {
      id: 'toit',
      title: 'Toit ja jook',
      body: 'Toit on meie sisu loomulik osa — maitsmised, retseptid ja väljakutsed, mis panevad vaataja päriselt isu tundma. Kikkomani kastmetest KFC sõbrapäevani: näitame toodet kasutuses, mitte kataloogipildina.',
      examples: [
        { label: 'Kikkomani Krõbekana', slug: 'kikkoman_2' },
        { label: 'Kikkoman Kastmed', slug: 'kikkoman_1' },
        { label: 'Luksuslik kohting KFC-s', slug: 'KFC_kohting' },
        { label: 'Härmavili x Selver', slug: 'h2rmavili_x_selver' },
      ],
    },
    {
      id: 'finants',
      title: 'Finants ja fintech',
      body: 'Keerulise teema lihtsaks tegemine on meie tugevus. Investeerimine ja rahatarkus vajavad selgitamist — YouTube’i pikk formaat annab selleks ruumi ning meie hoiame vaataja lõpuni ekraani küljes. Alustasime ise investeerimisega 16-aastaselt, seega räägime teemast oma kogemusest.',
      examples: [
        { label: 'Lightyear', slug: 'lightyear' },
        { label: 'Apollo investeerimisfestival', slug: 'Apollo_investeerimisfestival_2026' },
        { label: 'Võru InvestFEST', slug: 'investfest' },
      ],
    },
    {
      id: 'tehnoloogia',
      title: 'Tehnoloogia ja seadmed',
      body: 'Toode päris kasutuses, osa loost või väljakutsest. Philipsi OneBlade’iga vahetasime 24 tunniks elud — tooteasetus, mida vaadatakse nagu sisu, sest see ongi sisu.',
      examples: [{ label: 'Philips', slug: 'Philips_vahetasime_elud_24h' }],
    },
    {
      id: 'seiklus',
      title: 'Seiklus ja meelelahutus',
      body: 'Meie koduväljak. Suured produktsioonid, adrenaliin ja eksperimendid, mis hoiavad vaatajat ekraani küljes — ja sinu bränd on selle kõige keskel, mitte reklaampausil.',
      examples: [
        { label: 'Külmavares — 1€ vs 1500€ talisuplus', slug: 'kulmavares_1_vs_1500_suplus' },
        { label: 'Sawerna', slug: 'sawernaa' },
      ],
    },
  ],
  moreHeading: 'Sobime ka nendega',
  moreSubheading: 'Valdkonnad, kuhu meie formaat ja vaatajaskond samuti hästi istuvad.',
  moreCategories: [
    {
      id: 'sport',
      title: 'Sport ja aktiivne eluviis',
      body: 'Toode väljakutsete ja treeningute keskel — osa tegevusest, mitte reklaampaus.',
    },
    {
      id: 'auto',
      title: 'Autod ja mobiilsus',
      body: 'Auto on seikluse lava: teekonnad ja eksperimendid, mis tekitavad emotsiooni.',
    },
    {
      id: 'telekom',
      title: 'Telekom ja teenused',
      body: 'Lai noorte vaatajaskond ja teenuse kasud käegakatsutavaks tehtud.',
    },
    {
      id: 'mangud',
      title: 'Mängud ja äpid',
      body: 'Jõuame otse sihtrühmani, kes on niigi ekraanil — loomulikus ja meelelahutuslikus kontekstis.',
    },
    {
      id: 'reisi',
      title: 'Reis ja vaba aeg',
      body: 'Näitame sihtkohti ja elamusi nii, et vaataja tahab ise kohale minna.',
    },
    {
      id: 'rivad',
      title: 'Rõivad ja mood',
      body: 'Toode meie stiili loomuliku osana — autentselt, mitte lavastatult.',
    },
  ],
  faqHeading: 'Korduma kippuvad küsimused',
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
    'Kui su bränd sobib mõnda ülaltoodud valdkonda — või arvad, et meie stiil klapib teie omaga — võta ühendust ja arutame, milline koostöö annaks parima tulemuse.',
  ctaButton: 'Võta ühendust',
  ctaSecondary: 'Vaata tehtud töid',
};

const en: KoostooContent = {
  metaTitle: 'Which brands does Kozip work best with?',
  metaDescription:
    'Kozip is a great fit for food, finance, technology and entertainment brands that want to reach young audiences in Estonia through YouTube and short-form video. See the categories and real examples.',
  h1: 'Which brands does Kozip fit?',
  intro:
    'Kozip is an Estonian adventure and entertainment content creator, run by Mihkel Kööbi and Maia-Liis Ossip. We produce YouTube ad videos, short-form video and complete brand campaigns that reach 13–34-year-old viewers. Here are the fields where our content works best — with real examples.',
  categoriesHeading: 'Where our content works best',
  categoriesSubheading: 'Four fields where we have already proven ourselves. Every example is a real collaboration — click and see for yourself.',
  categories: [
    {
      id: 'toit',
      title: 'Food & beverage',
      body: 'Food is a natural part of our content — tastings, recipes and challenges that make viewers genuinely crave the product. From Kikkoman sauces to a KFC Valentine’s campaign: we show the product in use, not as a catalogue shot.',
      examples: [
        { label: 'Kikkoman Crispy Chicken', slug: 'kikkoman_2' },
        { label: 'Kikkoman Sauces', slug: 'kikkoman_1' },
        { label: 'A luxury date at KFC', slug: 'KFC_kohting' },
        { label: 'Härmavili x Selver', slug: 'h2rmavili_x_selver' },
      ],
    },
    {
      id: 'finants',
      title: 'Finance & fintech',
      body: 'Making complex topics simple is our strength. Investing and financial literacy need explaining — the longer YouTube format gives room for it, and we keep the viewer watching to the end. We started investing at 16 ourselves, so we speak from experience.',
      examples: [
        { label: 'Lightyear', slug: 'lightyear' },
        { label: 'Apollo investment festival', slug: 'Apollo_investeerimisfestival_2026' },
        { label: 'Võru InvestFEST', slug: 'investfest' },
      ],
    },
    {
      id: 'tehnoloogia',
      title: 'Technology & devices',
      body: 'The product in real use, as part of a story or a challenge. With Philips OneBlade we swapped lives for 24 hours — product placement that gets watched like content, because it is content.',
      examples: [{ label: 'Philips', slug: 'Philips_vahetasime_elud_24h' }],
    },
    {
      id: 'seiklus',
      title: 'Adventure & entertainment',
      body: 'Our home turf. Big productions, adrenaline and experiments that keep viewers glued to the screen — with your brand in the middle of it all, not in an ad break.',
      examples: [
        { label: 'Külmavares — €1 vs €1500 winter swim', slug: 'kulmavares_1_vs_1500_suplus' },
        { label: 'Sawerna', slug: 'sawernaa' },
      ],
    },
  ],
  moreHeading: 'We also fit',
  moreSubheading: 'Fields where our format and audience are a natural match as well.',
  moreCategories: [
    {
      id: 'sport',
      title: 'Sports & active lifestyle',
      body: 'The product in the middle of challenges and training — part of the action, not an ad break.',
    },
    {
      id: 'auto',
      title: 'Cars & mobility',
      body: 'A car is a stage for adventure: journeys and experiments that create emotion.',
    },
    {
      id: 'telekom',
      title: 'Telecom & services',
      body: 'A broad young audience, with the benefits of a service made tangible.',
    },
    {
      id: 'mangud',
      title: 'Games & apps',
      body: 'We reach the audience that is already on screen — in a natural, entertaining context.',
    },
    {
      id: 'reisi',
      title: 'Travel & leisure',
      body: 'We show destinations and experiences so that viewers want to go themselves.',
    },
    {
      id: 'rivad',
      title: 'Clothing & fashion',
      body: 'The product as a natural part of our style — authentic, not staged.',
    },
  ],
  faqHeading: 'Frequently asked questions',
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
    'If your brand fits one of the fields above — or you think our style matches yours — get in touch and let’s discuss what kind of collaboration would deliver the best results.',
  ctaButton: 'Get in touch',
  ctaSecondary: 'See our work',
};

export function getKoostooContent(locale: string): KoostooContent {
  return locale === 'en' ? en : et;
}
