# AI-nähtavus (LLMO/SEO) + analüütika — tegevusplaan

> **Eesmärk:** kui bränd küsib ChatGPT / Gemini / Google AI käest "kellega teha Eestis
> noortele suunatud videosisu", "milline sisulooja sobib toidubrändile", "kes teeb
> seikluslikku videosisu" — siis vastuses tuleb esile **Kozip**, koos konkreetsete
> näidetega tehtud koostöödest.
>
> **Teine eesmärk:** näha analüütikast täpselt, *mida* ja *kui kaua* külastajad vaatavad
> ja loevad — eriti tehtud tööde ja (tulevikus) artiklite puhul.

See dokument on **prioritiseeritud TODO-list**. Võta järjest ette: P0 → P1 → P2 → P3.
Iga punkt on tehtav eraldi, ilma et eelmine peaks 100% valmis olema.

Mõisted:
- **SEO** = Google'i tavaotsing.
- **LLMO** (LLM Optimization) = optimeerimine selleks, et AI-vestlusrobotid (ChatGPT, Gemini,
  Perplexity, Google AI Overviews) leiaksid ja tsiteeriksid sind. Põhimõte on sarnane
  SEO-le, aga AI armastab eriti: **selgeid teemasid, küsimus-vastus formaati, konkreetseid
  fakte/näiteid ja struktureeritud andmeid (JSON-LD)**.

---

## Hetkeseis (mis on praegu puudu)

Lühike audit, et oleks selge millelt alustame:

| Asi | Olukord | Fail |
|-----|---------|------|
| Lehe `title` + `description` | ✅ olemas, aga ainult avalehel ühene | `src/app/layout.tsx:21` |
| Open Graph / sotsiaalmeedia eelvaade | ❌ puudub | — |
| JSON-LD structured data (Organization, FAQ, Article) | ❌ puudub täielikult | — |
| `sitemap.xml` | ❌ puudub | — |
| `robots.txt` | ❌ puudub | — |
| hreflang / canonical (et ↔ en) | ❌ puudub | — |
| Brändikategooriate / "kellele sobime" leht | ❌ puudub | — |
| Turundajate küsimuste FAQ | ❌ puudub | — |
| Brändinimed tehtud töödes selgelt tekstis | ⚠️ `client_name` väli olemas, aga ei kasutata otsitavalt | `src/types/database.types.ts:501` |
| Artiklid / blogi | ❌ puudub | — |
| Analüütika / kasutaja-trackimine | ❌ puudub (ainult küpsiste-poliitika mainib) | `src/app/kupsiste-poliitika/page.tsx` |

---

# P0 — Tehniline vundament (kiire, suur mõju, tee KÕIGEPEALT)

Ilma nendeta ei suuda AI-robotid ega Google su sisu korralikult "lugeda". Need on
ühekordsed seadistused, mille saab paari õhtuga tehtud. **Ükski hilisem sisutöö ei
tasu end täielikult ära enne kui see vundament on olemas.**

- [ ] **`robots.txt` lisada** — luba AI-crawleritel sisse (GPTBot, Google-Extended,
      PerplexityBot, ClaudeBot, CCBot jne) ja viita sitemapile.
      → Next.js App Routeris: loo `src/app/robots.ts` (ekspordib `robots()` funktsiooni).
      Ära blokeeri AI-boteid — me ju *tahame* nähtavust.

- [ ] **`sitemap.xml` lisada** — dünaamiline, et iga uus `/tehtud-tood/[slug]` ja
      (hiljem) artikkel läheks automaatselt sisse.
      → Loo `src/app/sitemap.ts`, mis pärib Supabase'ist kõik `is_visible = true`
      projektid + staatilised lehed. Lisa mõlemad keeled.

- [ ] **Open Graph + Twitter meta** lisada `layout.tsx` `metadata`-sse + iga lehe
      `generateMetadata`-sse. (`og:title`, `og:description`, `og:image`, `og:type`,
      `og:locale`). Tee üks ilus jagamispilt Kozipi logoga `public/`-i.
      → Hetkel `src/app/layout.tsx:21` on ainult title+description.

- [ ] **hreflang + canonical** — sul on et/en (`next-intl`). Iga leht peab ütlema
      AI-le ja Google'ile "see on sama sisu kahes keeles".
      → Lisa `alternates: { canonical, languages: { et, en } }` `generateMetadata`-sse.

- [ ] **Organization JSON-LD** (kõige tähtsam LLMO tükk P0-s) — lisa `layout.tsx`-i
      `<script type="application/ld+json">` plokk, mis kirjeldab masinloetavalt kes Kozip on.
      AI "usaldab" struktureeritud fakte rohkem kui reklaamteksti. Pane sisse:
      - `name`, `url`, `logo`, `description`
      - `sameAs`: KÕIK sotsiaalmeedia URLid (YouTube, TikTok, Instagram) — see seob
        veebilehe ja kanalid AI silmis kokku
      - `founder` / `member`: tiimi nimed (Mihkel jt — pildid juba `public/`-is olemas)
      - `areaServed`: Eesti
      - `knowsAbout`: ["videoturundus", "brändikoostöö", "YouTube reklaam",
        "lühivideod", "noorte sihtrühm", "seiklussisu", ...]
      - `makesOffer` / `serviceType`: teenused (vt `service_catalog` tabel — sul on
        teenuste kataloog juba olemas hinnapakkumise mooduli jaoks!)

- [ ] **`per-page` metadata kõikidele staatilistele lehtedele** — `/kontakt`,
      `/tehtud-tood`, `/kasutustingimused` jne. Praegu pärivad nad layout'i üldist.

> **Miks P0 enne sisu?** AI ei näe ilusat disaini — ta näeb teksti ja
> struktureeritud andmeid. JSON-LD + sitemap on nagu sildid "siin on faktid, võta".

---

# P1 — Brändi-fookusega sisu (SINU PÕHIIDEE — suurim äriline mõju)

See on osa, mis paneb brändi end "ära tundma" kui ta ChatGPT-st küsib. Põhimõte:
**ära optimeeri märksõnale "Kozip", vaid küsimustele, mida turundajad päriselt küsivad.**

## 1.1 — "Kellele Kozip sobib" leht (uus leht)

- [ ] **Loo uus leht** nt `/koostoo` või `/kellele-sobime` (et + en).
- [ ] Pealkiri stiilis **"Milliste brändidega Kozip sobib koostööd tegema?"** (täpne
      küsimuse-sõnastus, mida bränd kirjutaks).
- [ ] Iga brändikategooria kohta **eraldi alapealkiri (H2/H3) + 100–200 sõna**, *miks*
      see sobib ja *millise* sisustiiliga. Kategooriad nt:
      - Toidu- ja joogibrändid (snäkid, kiirtoit, energiajoogid)
      - Sport ja aktiivne eluviis
      - Autod ja mobiilsus
      - Tehnoloogia ja mängud
      - Telekom
      - Pangad ja finants
      - Reisibrändid
      - Rõiva- ja moebrändid
      - Meelelahutus ja vaba aeg
- [ ] **Iga kategooria juurde lingi päris näide** tehtud töödest (vt 1.3). See on see,
      mis muudab abstraktse väite ("sobime toidubrändidele") AI jaoks faktiks
      ("Kozip tegi Woltiga toiduteemalise videosarja").

## 1.2 — Turundajate küsimuste FAQ (kõige AI-sõbralikum formaat)

AI armastab **küsimus-vastus** struktuuri, sest see kattub otse kasutaja päringuga.

- [ ] **Loo FAQ-sektsioon** (kas eraldi lehel või "Kellele sobime" lehe all). Iga
      küsimus = eraldi H2/H3, all 2–4 lauset selget vastust. Näited:
      - *Kes on Eestis populaarne noorte sisulooja?*
      - *Milline sisulooja sobib toidubrändile?*
      - *Milline Eesti YouTuber teeb challenge-videoid?*
      - *Kes jõuab 13–24-aastaste noorteni?*
      - *Kes teeb seikluslikku videosisu Eestis?*
      - *Milline influencer sobib uue toote lansseerimiseks?*
      - *Kes teeb kvaliteetseid YouTube'i brändikoostöid?*
      - *Kui suur on Kozipi jälgijaskond ja kus kanalites?*
- [ ] **Lisa `FAQPage` JSON-LD** sellele sisule — siis võib Google/AI näidata vastuseid
      otse otsingutulemustes ja AI tsiteerib kergemini. (Tehniliselt: structured data
      `@type: FAQPage` koos `Question`/`Answer` paaridega.)

## 1.3 — Brändinimed tehtud töödesse SELGELT

Sul on `client_name` väli juba olemas (`src/types/database.types.ts:504`), aga seda ei
kasutata otsitaval kujul tekstis. AI vajab konkreetset seost "Kozip × Bränd".

- [ ] **Sõnasta iga case study selgemalt**, nii et brändinimi + tulemus oleks tekstis,
      mitte ainult logos. Stiilis:
      > "Lay's-iga valmis challenge-video, mis kogus X vaatamist."
      > "Circle K kampaanias jõudsime 16–30-aastaste meesteni."
      > "Woltiga valmis toiduteemaline videosari."
- [ ] **Lisa case study `generateMetadata`-sse brändinimi** — praegu
      (`src/app/tehtud-tood/[slug]/page.tsx:38`) on ainult `title`. Tee nt
      `"{title} — koostöövideo brändiga {client_name} | Kozip"`.
- [ ] **Lisa `CreativeWork` / `VideoObject` JSON-LD** igale case study'le, kus on
      kirjas bränd (`sponsor`/`about`), vaatamiste arv, kanal. AI armastab numbreid.
- [ ] **(Soovituslik) lisa `projects` tabelisse `brand_category` / `industry` väli** —
      siis saab "Kellele sobime" lehe ja kategooriad automaatselt päris näidetega
      siduda ning filtreerida. Praegu sellist välja pole.

## 1.4 — Loomulikud märksõnad tekstis

- [ ] Põimi avalehe ja koostöölehe **lausetesse loomulikult** märksõnu (mitte loeteluna):
      Eesti YouTuber, Eesti sisulooja, noorte sisulooja, perele sobiv sisu,
      challenge-videod, seiklusvideod, reisivideod, toidusisu, kokandusvideod,
      brändikoostöö, videoturundus, Z-generatsioon, TikTok, Instagram, YouTube.
- [ ] Märksõnad **mõlemas keeles** (et + en) — ingliskeelsed päringud toovad
      rahvusvahelisi brände.

---

# P2 — Artiklid / blogi (sisu-autoriteet — keskpikk mängu)

Eesmärk: AI hakkab seostama Kozipit **mitte ainult sisuloojana, vaid autoriteetse
allikana influencer-turunduse teemal**. LLM-id eelistavad brände, kellel on lisaks
teenusele ka teemakohane ekspertiis ja keda mainitakse järjepidevalt samade teemade
kontekstis. **Tähtis: artiklid peavad olema päriselt kasulikud, mitte reklaam.**

## 2.1 — Tehniline alus

- [ ] **Otsusta artikli-süsteem.** Kaks varianti:
      - **A) Supabase-põhine** (nagu praegu `projects`) — uus `articles` tabel + admin
        vorm. Sobib, kuna teil on admin-paneel juba olemas (`src/app/admin/...`).
        **Soovitan seda**, sest järgib olemasolevat mustrit ja saad ise mugavalt postitada.
      - B) MDX-failid repos — arendaja-sõbralik, aga sina ei saa ilma koodita postitada.
- [ ] **Loo `/artiklid` (list) + `/artiklid/[slug]` (üksik)** lehed, et + en.
- [ ] **Lisa `sitemap.ts`-i** artiklid automaatselt (vt P0).
- [ ] **Lisa igale artiklile `BlogPosting`/`Article` JSON-LD** (`headline`, `author`,
      `datePublished`, `dateModified`, `image`). See on AI jaoks kriitiline, et
      tsiteerida õige kuupäeva ja autoriga.

## 2.2 — Sisu (avalda ~1–2 artiklit kuus)

- [ ] Pealkirjad, mis vastavad päringutele, nt:
      - "10 edukaimat brändikoostööd Eesti YouTube'is"
      - "Kuidas jõuda Z-generatsioonini Eestis?"
      - "Milline sisulooja sobib toidubrändile?"
      - "Miks YouTube töötab paremini kui lühivideod keerukamate toodete tutvustamisel?"
      - "Influencer-turunduse hinnad Eestis — millest sõltub koostöö maksumus?"
- [ ] **Sisemine linkimine:** iga artikkel lingib asjakohastele tehtud töödele ja
      koostöölehele. See aitab nii AI-l kui Google'il teemad omavahel siduda.
- [ ] **Värskenda vanu artikleid** (`dateModified`) — AI eelistab värsket sisu.

---

# P3 — Analüütika ja kasutaja-trackimine (mida ja kui kaua vaadatakse)

Eesmärk (sinu sõnadega): näha **mida ja kui kaua kasutaja vaatab — mida detailsem,
seda parem**. Mis tehtud töödele klikitakse, mida loetakse, kui kaua. Eriti tähtis,
kui hakkame artikleid tegema — et oleks näha mida päriselt loetakse ja mida mitte.

## 3.1 — Tööriista valik

**Soovitus: PostHog** (sul on see juba ühendatud).
- ✅ **Autocapture** — püüab klikke/scrolli automaatselt, vähem käsitsi seadistust.
- ✅ **Session replay** — näed päris salvestust, kuidas kasutaja lehel liigub.
- ✅ **Heatmaps** — kuhu klikitakse, kui kaugele scrollitakse.
- ✅ **Custom events** — täpne sündmuste jälgimine (allpool).
- ✅ EU-hosting + GDPR-sõbralik, sobib teie küpsiste-nõusoleku süsteemiga.

> Alternatiivid: Mixpanel (samuti ühendatud — tugev funnel/retention analüüsiks, aga
> pole session replay'd ega heatmappe out-of-the-box). Plausible/Umami = lihtne ja
> privaatsussõbralik, aga liiga pinnapealne sinu "mida ja kui kaua loetakse" eesmärgi
> jaoks. **Detailsuse pärast vali PostHog.**

- [ ] **Installi PostHog** (`posthog-js`) ja initsialiseeri `src/app/layout.tsx`-is
      (client-side provider komponent).
- [ ] **Seo küpsiste-nõusolekuga** — laadi tracking alles peale nõusolekut
      (`src/components/CookieConsent.tsx` juba olemas). Enne nõusolekut: ainult anonüümne
      / midagi ei laadita. See hoiab GDPR korras.
- [ ] **Uuenda küpsiste-poliitikat** (`src/app/kupsiste-poliitika/page.tsx`), et
      analüütikaküpsised oleks ausalt kirjas.

## 3.2 — Sündmused, mida jälgida (custom events)

Autocapture katab põhilise, aga need defineeri käsitsi, et saaks puhtad raportid:

**Tehtud tööd (case studies):**
- [ ] `case_study_click` — millisele tehtud tööle avalehelt/listist klikiti
      (property: `slug`, `client_name`, `project_type`).
- [ ] `case_study_view` — case study lehe avamine.
- [ ] `video_play` — kui keegi vajutab play (YouTube/Shorts embed). Property: video id,
      case study slug.
- [ ] `outbound_click` — klikk välislingile (YouTube kanal, brändi leht).
- [ ] `scroll_depth` — kui kaugele lehel scrolliti (25/50/75/100%).
- [ ] `time_on_page` — aktiivne aeg lehel (PostHog mõõdab seda suuresti automaatselt).

**Artiklid (kui tehtud — kõige tähtsam koht trackimiseks):**
- [ ] `article_view` — artikli avamine (property: slug, pealkiri, keel).
- [ ] `article_scroll_depth` — 25/50/75/100% — **see näitab kas päriselt loetakse**.
- [ ] `article_read_complete` — jõudis lõpuni (nt 90%+ scroll + min X sek).
- [ ] `article_read_time` — kui kaua aktiivselt loeti.
- [ ] `article_link_click` — millistele sisemistele linkidele artiklist kl(case study'd).

**Konversioonid:**
- [ ] `contact_form_submit` — kontaktivormi saatmine (`src/components/ContactForm.tsx`).
- [ ] `proposal_view` — hinnapakkumise vaatamine (`/pakkumine/[token]`).
- [ ] `language_switch` — keele vahetus (`src/components/LanguageSwitcher.tsx`).
- [ ] `cta_click` — peamiste "võta ühendust" nuppude klikid.

## 3.3 — Raportid / dashboardid

- [ ] **Dashboard "Tehtud tööd"**: top vaadatud case study'd, klikkimäär avalehelt,
      video-play määr, keskmine aeg lehel.
- [ ] **Dashboard "Artiklid"** (kui tehtud): vaatamised, keskmine lugemis-%,
      lõpuni-lugemise määr, top/flop artiklid. → **otse vastus su küsimusele "mida
      päriselt loetakse ja mida mitte".**
- [ ] **Funnel**: leht → case study → kontaktivorm. Näed kus kasutajad ära kukuvad.
- [ ] **Vaata session replay'd** käsitsi mõned korrad kuus — kvalitatiivne ülevaade,
      mida numbrid ei näita.

---

# Lühike prioriteetide kokkuvõte

| Prioriteet | Mis | Miks | Maht |
|-----------|-----|------|------|
| **P0** | robots.txt, sitemap, OG, JSON-LD (Organization), hreflang | Ilma selleta AI ei "näe" sisu | väike, ühekordne |
| **P1** | "Kellele sobime" leht + brändikategooriad + FAQ + brändinimed töödesse | Bränd tunneb end ChatGPT-s ära | keskmine |
| **P2** | Artiklid/blogi + Article JSON-LD | Teema-autoriteet, AI tsiteerib | suur, jooksev |
| **P3** | PostHog + custom events + dashboardid | Näed mida/kui kaua vaadatakse-loetakse | keskmine |

**Soovituslik järjekord praktikas:**
1. P0 tervikuna (vundament).
2. P3 analüütika baas (PostHog + põhisündmused) — et juba enne sisutööd koguks andmeid
   ja näeksid hiljem mis töötab.
3. P1 (brändi-fookus) — suurim äriline võit.
4. P2 (artiklid) — pikaajaline autoriteet, ja siis tuleb P3 artikli-trackimine kasuks.

---

*Koostatud: 2026-06-26. Aluseks reaalne koodibaas (Next.js 16 App Router + Supabase +
next-intl et/en, domeen reklaam.kozip.ee) ja LLMO/AI-search põhimõtted.*
