/**
 * Sisu lehele /koostoo ("Kellele Kozip sobib"). Kakskeelne (et/en).
 *
 * NB! Näidete linkides on kasutatud AINULT päris tehtud töid (projects tabel).
 * Ära lisa siia väljamõeldud koostöid ega numbreid — AI ja kliendid loevad seda.
 * Vaatamiste arvud tulevad projects.stat_views väljalt, mitte siit.
 *
 * `categories` = 6 peakategooriat, kus on päris case study'd (kuvatakse suurelt,
 * thumbnail-kaartidega). `moreCategories` = valdkonnad, kus case study puudub,
 * aga kus on konkreetne põhjendus, miks meie formaat sinna istub.
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
export type HeroStat = { value: string; label: string };

export type KoostooContent = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  heroStats: HeroStat[];
  categoriesHeading: string;
  categoriesSubheading: string;
  categories: Category[];
  audienceHeading: string;
  audienceIntro: string;
  audienceTvNote: string;
  audienceDisclaimer: string;
  audienceGenderLabels: { female: string; male: string; other: string };
  viewsLabel: string;
  moreHeading: string;
  moreSubheading: string;
  moreCategories: MoreCategory[];
  moreFallbackPrefix: string;
  moreFallbackLink: string;
  moreFallbackSuffix: string;
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
    'Kozip on üks Eesti populaarsemaid nooruslikke kogupere kanaleid. Vaata, kus oleme end brändikoostöödes tõestanud: toit, finants, tehnoloogia, sisustus, rõivad ja üritused. Päris näited ja päris numbrid.',
  h1: 'Kellele sobime?',
  intro:
    'Kozip on üks Eesti populaarsemaid kogupere sotsiaalmeedia kanaleid, mida veavad Mihkel Kööbi ja Maia-Liis Ossip. Meiega sobib koostöö brändidele, kes tahavad jõuda korraga väga laia vaatajaskonnani ja olla osa loost, mille sees nende bränd elab, mitte reklaamipaus, mida vahele kerida.',
  heroStats: [
    { value: '60 000+', label: 'vaatamist keskmisel YouTube’i videol' },
    { value: 'kuni 220 000', label: 'vaatamist lühivideole viiel platvormil kokku' },
  ],
  categoriesHeading: 'Mida meie kanalil sobib reklaamida',
  categoriesSubheading:
    'Kuus valdkonda päris koostöödega. Iga näide on klikitav ja iga number on päris.',
  categories: [
    {
      id: 'toit',
      title: 'Toit ja jook',
      body: 'Toit on meie sisu loomulik osa. Retseptid, maitsmised ja väljakutsed, kus toode on kaadris sellepärast, et me sellega päriselt midagi teeme. Kikkomani retseptivideod on kogunud kokku üle poole miljoni vaatamise ning KFC sõbrapäevakampaania jõudis üle 200 000 vaatajani.',
      examples: [
        { label: 'Kikkomani rebitud liha burger', slug: 'rebitud_liha_burger' },
        { label: 'Luksuslik kohting KFC-s', slug: 'KFC_kohting' },
        { label: 'Härmavili x Selver', slug: 'h2rmavili_x_selver' },
        { label: 'Fazer Muhkel & Muhklike', slug: 'fazer_muhklikesed' },
      ],
    },
    {
      id: 'finants',
      title: 'Finants ja fintech',
      body: 'Alustasime ise investeerimisega 16-aastaselt ja räägime rahast oma kogemuse põhjalt. Pikk YouTube’i formaat annab ruumi ka keerulisemate teemade selgitamiseks.',
      examples: [
        { label: 'Lightyear', slug: 'lightyear' },
        { label: 'Apollo investeerimisfestival', slug: 'Apollo_investeerimisfestival_2026' },
        { label: 'Võru InvestFEST', slug: 'investfest' },
      ],
    },
    {
      id: 'tehnoloogia',
      title: 'Tehnoloogia ja seadmed',
      body: 'Kozipi videod sobivad hästi eri tüüpi tehnika reklaamimiseks, sest saame seda oma igapäevastes lugudes päriselt kasutada ja näidata. Näiteks muruniidukid, köögitarvikud, tolmuimejad ja habemeajamismasinad — ning kõik muu, mis saab meie loos loomulikult kasutusse tulla.',
      examples: [
        { label: 'Philips: vahetasime elud 24h', slug: 'Philips_vahetasime_elud_24h' },
        { label: 'Philips OneBlade’i sketš', slug: 'philips_oneblade' },
      ],
    },
    {
      id: 'kodu',
      title: 'Kodu ja sisustus',
      body: 'Sawerna mööbel sai peaosa videos, kus viimane magama jäänud sisulooja võitis 1000 eurot. Kodukaubad ja sisustus istuvad meie formaati loomulikult, sest suur osa meie sisust sünnibki kodus, köögis ja igapäevaelus.',
      examples: [{ label: 'Sawerna', slug: 'sawernaa' }],
    },
    {
      id: 'rivad',
      title: 'Rõivad',
      body: 'Külmavarese joped läbisid tõsise testi: 1 euro vs 1500 euro talisuplus. Riided ja varustus saavad meie videotes end tõestada päris olukordades, külmas vees, metsas ja väljakutsete keskel.',
      examples: [{ label: 'Külmavares: 1€ vs 1500€ talisuplus', slug: 'kulmavares_1_vs_1500_suplus' }],
    },
    {
      id: 'yritused',
      title: 'Üritused ja kaubandus',
      body: 'Rocca al Mare Halloweeni peo kutsevideod kogusid ligi 185 000 vaatamist. Ürituste puhul on meil lisatrump: saame ise kohal olla, mis toob meie fännid üritusele kohale ja annab brändile kohapeal veel ühe sisuvõimaluse.',
      examples: [{ label: 'Rocca al Mare Halloween', slug: 'rocca_al_mare_halloween' }],
    },
  ],
  audienceHeading: 'Keda sa meie kaudu kätte saad',
  audienceIntro:
    'Vali platvorm ja vaata, milline on selle kanali vaatajate vanuse- ja soojaotus.',
  audienceTvNote:
    '55% YouTube’i vaatamistest tuleb telerist. Suure tõenäosusega vaatab terve pere koos.',
  audienceDisclaimer:
    'Vanusegraafikud ei ole kunagi 100% täpsed (lapsed vaatavad tihti vanemate kontodelt), kuid annavad hea võrdluspildi teiste kanalitega.',
  audienceGenderLabels: { female: 'Naised', male: 'Mehed', other: 'Muu' },
  viewsLabel: 'vaatamist',
  moreHeading: 'Sobime ka nendega',
  moreSubheading:
    'Meie sisu jõuab kogupere vaatajaskonnani, seega siin on veel mõned valdkonnad, mida meie kanalil sobib reklaamida.',
  moreCategories: [
    {
      id: 'auto',
      title: 'Autod ja transport',
      body: 'Meie seiklused algavad tihti teekonnaga. Näiteks Eesti erilisemaid Airbnb-sid testides roadtrippisime autoga läbi Eesti, nii et auto oli suure osa videost kaadris. Sellisesse loosse sobib loomulikult nii autobränd, rent, tankla kui ka muu transpordiga seotud teenus.',
    },
    {
      id: 'kindlustus',
      title: 'Kindlustus ja turvalisus',
      body: 'Meie sisu ongi riskid ja ootamatud olukorrad: talisuplus, mets, kõrgused, hirmude ületamine. Kindlustusbränd saab olla kohal täpselt seal, kus vaataja riskile mõtleb. Peresõbralik ja skandaalivaba maine hoiab sõnumi usaldusväärsena.',
    },
    {
      id: 'telekom',
      title: 'Telekom ja teenused',
      body: 'Sarjas "Viimane sisulooja, kes metsast lahkub" selgus, kui palju loeb hea levi, kui elad nädal aega metsas. Telefon on meie videotes pidevalt kasutuses, seega side ja nutiteenused sobivad meie sisusse loomulikult.',
    },
    {
      id: 'sport',
      title: 'Sport ja tervis',
      body: 'Talisuplus, trennid ja füüsilised väljakutsed käivad meie videotest pidevalt läbi. Oleme teinud koostöid ka spordi- ja toidulisandibrändidega, näiteks MyFitness ja ICONFIT.',
    },
    {
      id: 'ilu',
      title: 'Ilu ja enesehooldus',
      body: 'Instagramis on 67% meie vaatajatest naised ja ilu- ning enesehooldustooted sobivad meie igapäevaellu loomulikult. Oleme teinud koostöid ka ilubrändidega, näiteks hambavalgenduse vallas.',
    },
    {
      id: 'reisi',
      title: 'Reis ja vaba aeg',
      body: 'Grand Rose’i spaapäev, Eesti erilisemate Airbnb-de test ja reisivideod Kreekast. Näitame kohti ja elamusi nii, et vaataja paneb need oma nimekirja.',
    },
  ],
  moreFallbackPrefix: 'Ei leidnud oma valdkonda?',
  moreFallbackLink: 'Kirjuta meile',
  moreFallbackSuffix: ' ja vaatame, kas sinu bränd sobib meie sisusse.',
  faqHeading: 'Korduma kippuvad küsimused',
  faq: [
    {
      question: 'Kuidas Kozipiga koostöö käib?',
      answer:
        'Sina räägid, mida soovid turundada. Kui see sobib meie brändiga kokku, uurime täpsemalt sinu vajadusi ja pakume välja skripti. Kui sina skripti kinnitad, siis alustame sisu ja reklaami produtseerimisega. Enne postitamist saadame valmis video sulle ülevaatuseks ning vajadusel saame sisse viia muudatusi. Kui kõik sobib, läheb video meie kanalitele üles.',
    },
    {
      question: 'Kui kiiresti video valmib?',
      answer:
        'Lühivideo valmib päringust avaldamiseni 2 kuni 4 nädalaga, YouTube’i integratsioon 3 kuni 6 nädalaga. Kiirhooaegadel võib see võtta kauem, seega tasub kampaania aegsasti ette planeerida, et jääks aega valmistuda. Võtame iga kuu vastu vaid paar kampaaniat.',
    },
    {
      question: 'Kui palju koostöö Kozipiga maksab?',
      answer:
        'Võtame vastu koostöid, mille koguhind algab 1000 eurost. Pikaajalise koostöö puhul saame pakkuda stabiilsemat hinda. Täpne hind sõltub formaadist ja mahust, seega küsi meilt pakkumist.',
    },
    {
      question: 'Mis formaadid ühe kampaania sisse mahuvad?',
      answer:
        'Saame teha eraldi YouTube’i integratsiooni, lühivideo või esinemise. Kampaania raames pakume ka pakette, millega saad turundada tõhusamalt ja parema tükihinnaga. Lühivideod jõuavad alati korraga viiele platvormile: TikTok, Instagram Reels, YouTube Shorts, Facebook ja Snapchat.',
    },
    {
      question: 'Kas saame sisule sõna sekka öelda?',
      answer:
        'Jah. Skript kooskõlastatakse enne võtteid ja valmis video enne avaldamist, vajadusel teeme muudatusi.',
    },
    {
      question: 'Millistele brändidele Kozip ei sobi?',
      answer:
        'Me ei tee koostööd alkoholi, hasartmängude, poliitika ega millegagi, mis meie hinnangul ühiskonnale väärtust ei paku. Meie sisu on peresõbralik ja skandaalivaba, pakkudes brändidele turvalist ning usaldusväärset platvormi reklaamiks.',
    },
    {
      question: 'Kellele Kozipi sisu jõuab?',
      answer:
        'Kozip on nooruslik kogupere kanal. YouTube’is vaatab meid sageli terve pere koos teleriekraanilt, lühivideod jõuavad noorte ja noorte täiskasvanuteni TikTokis ja Instagramis. Kokku jõuame lastest lastevanemateni.',
    },
    {
      question: 'Kas reklaami saab osta ka Mihkli ja Maia-Liisi isiklikele kanalitele?',
      answer:
        'Jah. Kozip on lai kogupere kanal, kuid Mihkli ja Maia-Liisi isiklikud kanalid pakuvad personaalsemat ja lähedasemat kontakti. Nii jõuab brändi sõnum vaatajani inimeselt, keda ta igapäevaselt jälgib ja usaldab. Videod koguvad olenevalt videost 20 000 kuni 50 000 vaatamist ning sobivad eriti hästi ilu-, spordi- ja elustiilibrändidele.',
    },
  ],
  ctaHeading: 'Kas su bränd sobib meie loosse?',
  ctaText:
    'Kirjuta meile, mida soovid turundada ning kui see meie brändiga kokku sobib, pakume välja täpse plaani ja idee, kuidas võiks seda meie kanalitel turundada.',
  ctaButton: 'Võta ühendust',
  ctaSecondary: 'Vaata tehtud töid',
};

const en: KoostooContent = {
  metaTitle: 'Which brands does Kozip work best with?',
  metaDescription:
    'Kozip is one of Estonia’s most popular youthful family entertainment channels. See where we have proven ourselves in brand collaborations: food, finance, technology, home, apparel and events. Real examples, real numbers.',
  h1: 'Who do we work with?',
  intro:
    'Kozip is one of Estonia’s most popular family entertainment channels on social media, run by Mihkel Kööbi and Maia-Liis Ossip. Working with us fits brands that want to reach a very broad audience at once and be part of a story their brand lives inside, not an ad break to skip.',
  heroStats: [
    { value: '60,000+', label: 'views on an average YouTube video' },
    { value: 'up to 220,000', label: 'views per short-form video across five platforms' },
  ],
  categoriesHeading: 'What our channel is a good fit to advertise',
  categoriesSubheading:
    'Six fields with real collaborations. Every example is clickable and every number is real.',
  categories: [
    {
      id: 'toit',
      title: 'Food & beverage',
      body: 'Food is a natural part of our content. Recipes, tastings and challenges where the product is on screen because we are actually doing something with it. Our Kikkoman recipe videos have gathered over half a million views combined, and the KFC Valentine’s campaign reached more than 200,000 viewers.',
      examples: [
        { label: 'Kikkoman pulled meat burger', slug: 'rebitud_liha_burger' },
        { label: 'A luxury date at KFC', slug: 'KFC_kohting' },
        { label: 'Härmavili x Selver', slug: 'h2rmavili_x_selver' },
        { label: 'Fazer Muhkel & Muhklike', slug: 'fazer_muhklikesed' },
      ],
    },
    {
      id: 'finants',
      title: 'Finance & fintech',
      body: 'We started investing at 16 ourselves and talk about money from our own experience. The long YouTube format gives room to explain even more complex topics.',
      examples: [
        { label: 'Lightyear', slug: 'lightyear' },
        { label: 'Apollo investment festival', slug: 'Apollo_investeerimisfestival_2026' },
        { label: 'Võru InvestFEST', slug: 'investfest' },
      ],
    },
    {
      id: 'tehnoloogia',
      title: 'Technology & devices',
      body: 'Kozip videos are a strong fit for all kinds of tech because we can genuinely use and show it in our everyday stories. From lawnmowers and kitchen appliances to vacuum cleaners and electric shavers — anything that can naturally become part of the story.',
      examples: [
        { label: 'Philips: we swapped lives for 24h', slug: 'Philips_vahetasime_elud_24h' },
        { label: 'Philips OneBlade sketch', slug: 'philips_oneblade' },
      ],
    },
    {
      id: 'kodu',
      title: 'Home & interior',
      body: 'Sawerna furniture played the lead role in a video where the last creator to fall asleep won 1000 euros. Home products fit our format naturally, because a large part of our content is born at home, in the kitchen and in everyday life.',
      examples: [{ label: 'Sawerna', slug: 'sawernaa' }],
    },
    {
      id: 'rivad',
      title: 'Clothing',
      body: 'Külmavares jackets went through a serious test: a 1 euro vs 1500 euro winter swim. Clothing and gear get to prove themselves in our videos in real situations, in ice-cold water, in the forest and in the middle of challenges.',
      examples: [{ label: 'Külmavares: €1 vs €1500 winter swim', slug: 'kulmavares_1_vs_1500_suplus' }],
    },
    {
      id: 'yritused',
      title: 'Events & retail',
      body: 'Our invitation videos for the Rocca al Mare Halloween party gathered close to 185,000 views. With events we have an extra card to play: we can attend in person, which brings our fans to the event and gives the brand one more content opportunity on site.',
      examples: [{ label: 'Rocca al Mare Halloween', slug: 'rocca_al_mare_halloween' }],
    },
  ],
  audienceHeading: 'Who you reach through us',
  audienceIntro:
    'Pick a platform to see the age and gender breakdown of its viewers.',
  audienceTvNote:
    '55% of our YouTube views come from TV screens. Most likely the whole family is watching together.',
  audienceDisclaimer:
    'Age charts are never 100% precise (kids often watch from their parents’ accounts), but they give a good comparison against other channels.',
  audienceGenderLabels: { female: 'Women', male: 'Men', other: 'Other' },
  viewsLabel: 'views',
  moreHeading: 'We also fit',
  moreSubheading:
    'Our content reaches a whole-family audience, so here are a few more fields that fit advertising on our channel.',
  moreCategories: [
    {
      id: 'auto',
      title: 'Cars & transport',
      body: 'Our adventures often start with a journey. For example, while testing Estonia’s most unusual Airbnbs we road-tripped across the country, so the car was on screen for a large part of the video. A car brand, rental, fuel chain or any other transport service fits such a story naturally.',
    },
    {
      id: 'kindlustus',
      title: 'Insurance & safety',
      body: 'Our content is literally about risks and unexpected situations: winter swimming, the forest, heights, facing fears. An insurance brand can be present exactly where the viewer is thinking about risk. Our family-friendly, scandal-free reputation keeps the message trustworthy.',
    },
    {
      id: 'telekom',
      title: 'Telecom & services',
      body: 'In our series "The last creator to leave the forest" it became clear how much good network coverage matters when you live in the woods for a week. Phones are constantly in use in our videos, so connectivity and digital services fit our content naturally.',
    },
    {
      id: 'sport',
      title: 'Sports & health',
      body: 'Winter swimming, workouts and physical challenges come up in our videos all the time. We have also worked with sports and supplement brands such as MyFitness and ICONFIT.',
    },
    {
      id: 'ilu',
      title: 'Beauty & self-care',
      body: 'On Instagram 67% of our viewers are women, and beauty and self-care products fit naturally into our everyday content. We have also worked with beauty brands, for example in teeth whitening.',
    },
    {
      id: 'reisi',
      title: 'Travel & leisure',
      body: 'A spa day at Grand Rose, a test of Estonia’s most unusual Airbnbs and travel videos from Greece. We show places and experiences so that viewers put them on their own list.',
    },
  ],
  moreFallbackPrefix: 'Didn’t find your field?',
  moreFallbackLink: 'Write to us',
  moreFallbackSuffix: ' and let’s see whether your brand fits our content.',
  faqHeading: 'Frequently asked questions',
  faq: [
    {
      question: 'How does a collaboration with Kozip work?',
      answer:
        'You tell us what you want to market. If it fits our brand, we explore your needs in more detail and propose a script. Once you approve the script, we start producing the content and advertising. Before publishing, we send you the finished video for review and can make changes where needed. Once everything fits, the video goes live on our channels.',
    },
    {
      question: 'How fast is a video ready?',
      answer:
        'A short-form video takes 2 to 4 weeks from inquiry to publishing, and a YouTube integration 3 to 6 weeks. It can take longer during busy seasons, so it pays to plan your campaign well in advance and leave time to prepare. We only take on a couple of campaigns each month.',
    },
    {
      question: 'How much does a collaboration with Kozip cost?',
      answer:
        'We take on collaborations starting from 1000 euros in total. For long-term partnerships we can offer more stable pricing. The exact price depends on format and scope, so ask us for a quote.',
    },
    {
      question: 'What formats fit into one campaign?',
      answer:
        'We can do a standalone YouTube integration, a short-form video or an appearance. Within a campaign we also offer packages that let you market more effectively at a better unit price. Short-form videos always go out to five platforms at once: TikTok, Instagram Reels, YouTube Shorts, Facebook and Snapchat.',
    },
    {
      question: 'Do we get a say in the content?',
      answer:
        'Yes. The script is approved before filming and the finished video before publishing, with changes made where needed.',
    },
    {
      question: 'Which brands does Kozip not fit?',
      answer:
        'We do not work with alcohol, gambling, politics or anything that in our view does not bring value to society. Our content is family-friendly and scandal-free, giving brands a safe and trustworthy platform for advertising.',
    },
    {
      question: 'Who does Kozip’s content reach?',
      answer:
        'Kozip is a youthful family entertainment channel. On YouTube whole families often watch us together on a TV screen, while our short-form videos reach young people and young adults on TikTok and Instagram. In total we reach everyone from kids to their parents.',
    },
    {
      question: 'Can I also advertise on Mihkel’s and Maia-Liis’s personal channels?',
      answer:
        'Yes. Kozip is a broad family entertainment channel, while Mihkel’s and Maia-Liis’s personal channels offer a more personal, close-knit connection. This lets the brand message reach the viewer through someone they follow and trust every day. Videos receive 20,000 to 50,000 views depending on the video and are especially well suited to beauty, sports and lifestyle brands.',
    },
  ],
  ctaHeading: 'Does your brand fit our story?',
  ctaText:
    'Tell us what you want to market and, if it fits our brand, we will propose a concrete plan and idea for how to market it on our channels.',
  ctaButton: 'Get in touch',
  ctaSecondary: 'See our work',
};

export function getKoostooContent(locale: string): KoostooContent {
  return locale === 'en' ? en : et;
}
