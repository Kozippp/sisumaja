# Kozip hinnapakkumise mooduli plaan

Kuupaev: 2026-06-01

See dokument kirjeldab soovitatud lahendust Kozipi veebilehele eraldi privaatse hinnapakkumise mooduli ehitamiseks. Eesmärk ei ole teha avalikku hinnakirja, vaid luua personaalne, interaktiivne pakkumise leht, mida saab saata konkreetsele kliendile unikaalse ligipaasu kaudu.

Koodimuudatusi selle analüüsi käigus ei tehtud.

## Lühikokkuvõte

Soovitatud lahendus on ehitada olemasoleva Next.js ja Supabase põhise saidi sisse "interaktiivne hinnapakkumise portaal":

- Admin loob pakkumise `/admin` vaates.
- Pakkumine saab privaatse unikaalse lingi, näiteks `/pakkumine/[token]`.
- Vajadusel lisatakse parool või PIN.
- Klient näeb ainult temale koostatud hindu, teenuseid, statistikat, portfooliot ja koostöövalikuid.
- Klient saab teenuseid ostukorvi lisada, koguseid või koostööperioodi muuta ning näha automaatselt rakenduvaid soodustusi.
- Klient saab valida kolme peamise tegevuse vahel: maksa kohe, palu arvet, tee oma pakkumine / custom soov.
- Montonio makse tuleks teha serveripoolse API kaudu, mitte otse brauserist.
- Supabase hoiab kliente, pakkumisi, teenuseid, hinnareegleid, pakkumise avamisi, päringuid ja maksete staatusi.

See ei peaks tunduma nagu tavaline e-pood. Õigem tunnetus on "personaalne müügileht + kalkulaator + tellimuse kinnitamine".

## Olemasoleva veebilehe struktuuri tähelepanekud

Projekt sobib selle mooduli jaoks hästi, sest baas on juba olemas:

- Tehniline stack on Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, lucide-react ja Supabase.
- Avalehel on juba teenuste struktuur: YouTube reklaam, lühivideod ning esinemised/koolitused.
- Teenuste tekstid ja statistika on praegu peamiselt `src/app/page.tsx` ja `messages/et.json` sees.
- Portfoolio on olemas lehtedel `/tehtud-tood` ja `/tehtud-tood/[slug]`.
- Projektidel on juba content builderi loogika: tekst, pilt, video, karussell, lingid, statistika ja kliendi tagasiside.
- Admin on juba Supabase Authi taga: `/admin/login`, `/admin/dashboard`, `/admin/new`, `/admin/edit/[id]` jne.
- Supabase'is on olemas avalikult loetavad tabelid portfoolio, videote, logode, retention-piltide, testimonialide ja sotsiaalstatistika jaoks.
- Kontaktivorm salvestab andmed Supabase'i ja saadab e-kirju, seega sama mustrit saab kasutada arvepäringu, custom-soovi ja kõnebroneeringu puhul.

Kõige olulisem järeldus: uut moodulit ei pea ehitama eraldi rakendusena. Seda saab lisada olemasoleva saidi sisse eraldi admini ja privaatse kliendivaatega.

## Toote põhimõte

Mitte ehitada avalikku hinnakirja. Ehitada personaalne pakkumine, kus hind on osa ligipaasuga kaitstud müügikogemusest.

Soovitatud põhimõtted:

- Avalikul lehel jääb fookus sellele, kes on Kozip ja miks koostöö toimib.
- Privaatne pakkumise leht vastab küsimusele: mida ma saan, mis see maksab, miks see on väärtuslik ja mida saan kohe edasi teha?
- Adminis on vaikimisi hinnad ja mallid olemas, aga igas pakkumises saab neid üle kirjutada.
- Pakkumine peaks olema piisavalt "lukus", et klient ei näeks teiste klientide hindu.
- Pakkumine peaks olema piisavalt paindlik, et teha ühe video, mitme kuu paketi, bundle'i või täiesti custom lahenduse.

## Ligipääsu mudel

Soovitatud variant:

- Iga pakkumine saab pika juhusliku tokeni.
- Link ei ilmu menüüs, sitemapis ega avalikus navigatsioonis.
- Link võib olla näiteks `/pakkumine/8M3pX...` või ilusama variandina `/pakkumine/ettevotte-nimi-8M3pX...`.
- Token peaks olema piisavalt pikk, et seda ei oleks võimalik ära arvata.
- Supabase'is võiks hoida tokeni räsi, mitte toortokenit.
- Pakkumisel võiks olla `expires_at`, `revoked_at`, `status` ja `last_opened_at`.
- Valikuliselt saab lisada PIN-i või parooli, mille räsi hoitakse andmebaasis.

Soovituslik kasutajakogemus:

1. Klient avab lingi.
2. Kui parool/PIN on lubatud, näeb ta lühikest sissepääsuvaadet: "Sisesta ligipääsukood".
3. Kui ligipääs on korrektne, avaneb personaalne pakkumine.
4. Leht jätab sessiooni meelde, et klient ei peaks iga refreshiga uuesti parooli sisestama.
5. Kui pakkumine on aegunud või tühistatud, näeb klient viisakat teadet ja nuppu "Võta ühendust".

Turvalisuse mõttes ei tohiks tundlikku pakkumise sisu laadida otse anon Supabase päringuga brauserisse. Parem on kasutada Next.js server route'i või server componenti, mis valideerib tokeni ja tagastab ainult selle konkreetse pakkumise jaoks vajaliku info.

## Admini workflow

Admini uus osa võiks olla `/admin/pakkumised`.

### 1. Pakkumiste nimekiri

Admin näeb tabelit:

- klient / ettevõte
- kontaktisik
- pakkumise pealkiri
- staatus: draft, active, opened, accepted, invoice requested, payment pending, paid, expired, revoked
- kogusumma
- viimati avatud
- kehtib kuni
- tegevused: eelvaade, muuda, kopeeri link, tühista, dubleeri

### 2. Uue pakkumise loomine

Admini vormi loogiline järjekord:

1. Vali või loo klient.
2. Lisa pakkumise nimi, näiteks "Kozip x [Bränd] koostööpakkumine".
3. Vali mall: standard, YouTube fookus, lühivideo fookus, esinemine, custom.
4. Vali teenused, mida sellele kliendile näidata.
5. Kontrolli või muuda hindu.
6. Lisa soodustusreeglid.
7. Vali statistika ja tõestusmaterjalid, mida pakkumisel näidata.
8. Vali portfoolio tööd, mida näidata.
9. Lisa guarantee ja tingimuste tekst.
10. Määra kehtivuse aeg.
11. Vaata kliendivaate eelvaadet.
12. Avalda ja kopeeri link.

### 3. Hindade muutmine

Adminis peaks olema kaks taset:

- Baashinnakiri: teenuste vaikimisi hinnad ja kirjeldused.
- Konkreetne pakkumine: iga teenuse hind, kogused, nähtavus ja custom tekstid.

Näide: baashinnakirjas on YouTube integratsioon 1750 EUR, aga konkreetse kliendi pakkumises saab selle muuta 1500 või 2200 EUR peale.

### 4. Pakkumise jälgimine

Adminis võiks näha:

- mitu korda pakkumist avati
- millal klient viimati vaatas
- milliseid teenuseid klient ostukorvi lisas
- kas klient alustas makset
- kas makse õnnestus
- kas klient palus arvet
- kas klient kirjutas custom soovi
- kas klient broneeris kõne

See aitab müügil õigel hetkel follow-up teha.

## Kliendi UX

Kliendi leht peaks olema esimese ekraaniga kohe praktiline, mitte tavaline landing page.

### Esimene vaade

Esimesel ekraanil:

- Kozipi logo
- "Personaalne koostööpakkumine: [Kliendi nimi]"
- lühike 1-2 lause kokkuvõte, miks see pakkumine neile sobib
- pakkumise kehtivuse kuupäev
- 3-5 kiiret usaldusnumbrit
- teenusevaliku nupud: YouTube, Lühivideo, Instagram/Story, Esinemine, Custom
- paremal desktopis või all mobiilis sticky kokkuvõte: valitud teenused, soodustus, kogusumma, CTA

### Teenusevaliku vaade

Teenused võiksid avaneda tabide või segmentidena. Kui klient vajutab "YouTube", näeb ta:

- mida YouTube integratsioon tähendab
- mida klient täpselt saab
- kes seda vaatab
- statistika: keskmised vaatamised, vaatamisaeg, retention, seadmed, vanus, sugu, näited
- valitav kogus: 1 video, 2 videot, 3 videot, 6 kuud jne
- hind ja soodustus
- portfoolio / case study näited
- nupp "Lisa pakkumisse"

Sama loogika lühivideole, Instagramile ja esinemisele.

### Ostukorv / pakkumise kokkuvõte

Kokkuvõttes peaks olema:

- iga valitud teenus eraldi real
- kogus või periood
- ühikuhind
- allahindlus
- vahesumma
- käibemaksu info
- kogusumma
- garantiitekst
- nupud:
  - "Maksa kohe"
  - "Palun saatke arve"
  - "Soovin teha oma pakkumise"
  - "Broneeri kõne"

Mobiilis võiks kokkuvõte olla sticky bottom bar, mis avaneb täisekraaniliseks detailvaateks.

### Custom soov

Custom soovi vorm peaks olema võimalikult lihtne:

- mida soovid saavutada?
- millist teenust eelistad?
- ligikaudne eelarve
- soovitud ajastus
- lisainfo

See salvestub Supabase'i ja saadab adminile e-kirja.

### Arve valik

Kui klient valib "Palun saatke arve":

- klient kinnitab valitud teenused
- sisestab ettevõtte andmed, kui neid pole juba pakkumise juures
- süsteem salvestab arvepäringu
- admin saab e-kirja
- klient näeb kinnitust, et Kozip saadab arve või võtab ühendust

### Kõne broneerimine

Alguses võiks see olla lihtne päringuvorm:

- nimi
- e-post
- telefon
- soovitud aeg / kommentaar

Hiljem saab integreerida Calendly, Google Calendar või muu broneerimissüsteemi.

## Disainisuund

Disain peaks sobima olemasoleva saidiga: must taust, tugev valge tüpograafia, fuksia aktsent, teenusepõhised värvid ja kvaliteetsed meediaelemendid.

Soovitatud visuaalne süsteem:

- YouTube: punased aktsendid.
- Lühivideo / TikTok / Reels: sinine + fuksia.
- Esinemised: roheline.
- Custom: neutraalne valge/fuksia.
- Hindade kokkuvõte: väga puhas, rahulik ja usaldusväärne.
- Garantii: mitte liiga lärmakas, pigem väike usaldusplokk kokkuvõtte juures.

Oluline UX põhimõte:

- Hind ja "mida saan" peavad olema alati lähedal.
- Klient ei peaks kerima 10 minutit, et aru saada, mida tellida saab.
- Iga teenuse juures peab olema tõestusmaterjal: statistika, näited, portfoolio, screenshotid.
- Leht peab lubama nii kiiret ostu kui ka rahulikku veendumist.

## Millist infot kliendile kuvada

### Üldine info

- kliendi nimi / ettevõte
- pakkumise kehtivusaeg
- Kozipi lühitutvustus
- miks see pakkumine on konkreetsele kliendile sobiv
- garantiitekst
- kontakt või kõne broneerimise võimalus

### YouTube teenus

- mis on YouTube videosse integreeritud reklaam
- reklaamisegmendi võimalik pikkus ja vorm
- kas bränd on videos loomulik osa või eraldi sponsorplokk
- keskmine vaatamiste arv
- keskmine vaatamisaeg
- retention reklaamisegmendi ajal
- seadmete info, näiteks TV osakaal
- vaatajaskonna vanus ja sugu
- portfoolio näited
- hind ühe video kohta
- paketi hind mitme video puhul

### Lühivideo teenus

- mis kanalitesse postitatakse: TikTok, Reels, Shorts, Facebook, Snapchat vms
- video pikkus
- kas video on Kozipi kanalites või saab klient ka enda kanalites kasutada
- keskmised vaatamised
- engagement
- sihtrühm
- portfoolio näited
- hind ühe video kohta
- soodustus mitme video või mitme kuu puhul

### Instagram / story / postitus

- storyde arv
- postituse formaat
- kas sisaldab linki, tagimist, CTA-d
- eeldatav reach
- salvestused või klikid, kui neid on võimalik kuvada
- hind

### Esinemine / koolitus

- esinemise tüüp: õhtujuhtimine, esinemine, koolitus
- kestus
- teema
- asukoha ja transpordi tingimused
- ettevalmistuse ulatus
- hind
- custom päringu võimalus

## Hinnastuse ja soodustuste loogika

Soovitus: ära alusta liiga keerulisest "iga summa tagant protsent" süsteemist. See võib kliendile tunduda juhuslik ja adminile raskesti kontrollitav. Parem on kasutada kolme selget soodustuse tüüpi.

### 1. Mahusoodustus

Rakendub sama teenuse kogusele.

Näide:

- 1 lühivideo: tavahind
- 3 lühivideot: -8%
- 6 lühivideot: -15%

### 2. Bundle soodustus

Rakendub, kui klient valib mitu eri tüüpi teenust.

Näide:

- YouTube + lühivideo: -7%
- YouTube + lühivideo + story: -10%

### 3. Pika perioodi soodustus

Rakendub siis, kui klient valib korduva koostöö.

Näide:

- 3 kuud: -8%
- 6 kuud: -15%
- 12 kuud: custom hind

### 4. Manual discount

Admin saab lisada eraldi soodustuse:

- protsendina
- kindla summana
- konkreetsele teenusele
- kogu pakkumisele

### Soodustuste järjekord

Soovitatud arvutus:

1. Arvuta teenuste vahesumma.
2. Rakenda teenusepõhine mahusoodustus.
3. Rakenda bundle või perioodi soodustus.
4. Rakenda admini manual discount.
5. Rakenda maksud.
6. Kuva lõppsumma.

Kõigi soodustuste puhul peaks admin saama määrata maksimaalse soodustuse piiri, et kogemata liiga suurt allahindlust ei tekiks.

## Supabase andmemudel

Allpool on soovitatud andmemudel. Täpne SQL tuleks koostada alles ehituse faasis.

### `clients`

Hoiab klientide põhiinfot.

- `id`
- `company_name`
- `contact_name`
- `email`
- `phone`
- `billing_name`
- `billing_registry_code`
- `billing_vat_number`
- `billing_address`
- `notes`
- `created_at`
- `updated_at`

### `service_catalog`

Hoiab vaikimisi teenuseid ja baashindu.

- `id`
- `code`
- `category`: youtube, short_video, instagram, event, custom
- `title`
- `short_description`
- `long_description`
- `default_price_cents`
- `currency`
- `unit_label`: video, postitus, story pack, tund, paev, kuu
- `deliverables` JSONB
- `default_min_quantity`
- `default_max_quantity`
- `is_active`
- `display_order`
- `created_at`
- `updated_at`

### `proposal_templates`

Hoiab pakkumise malle.

- `id`
- `title`
- `description`
- `default_intro`
- `default_guarantee_text`
- `default_content_blocks` JSONB
- `default_discount_rules` JSONB
- `created_at`
- `updated_at`

### `proposals`

Hoiab konkreetset kliendile loodud pakkumist.

- `id`
- `client_id`
- `template_id`
- `title`
- `intro_text`
- `status`: draft, published, opened, accepted, invoice_requested, payment_pending, paid, expired, revoked
- `access_slug`
- `access_token_hash`
- `password_hash`
- `expires_at`
- `published_at`
- `first_opened_at`
- `last_opened_at`
- `accepted_at`
- `revoked_at`
- `currency`
- `vat_mode`: includes_vat, excludes_vat, no_vat
- `vat_rate`
- `guarantee_text`
- `internal_notes`
- `created_at`
- `updated_at`

### `proposal_items`

Hoiab teenuseid, mida konkreetne klient näeb.

- `id`
- `proposal_id`
- `service_catalog_id`
- `category`
- `title`
- `description`
- `deliverables` JSONB
- `base_price_cents`
- `offered_price_cents`
- `currency`
- `unit_label`
- `billing_interval`: one_time, monthly
- `min_quantity`
- `max_quantity`
- `default_quantity`
- `is_required`
- `is_enabled`
- `display_order`
- `metadata` JSONB

### `proposal_discount_rules`

Hoiab soodustuste loogikat.

- `id`
- `proposal_id`
- `label`
- `kind`: quantity, bundle, commitment, subtotal_threshold, manual
- `discount_type`: percent, fixed
- `discount_value`
- `config` JSONB
- `stackable`
- `priority`
- `max_discount_cents`
- `is_active`

### `proposal_content_blocks`

Hoiab personaalset müügisisu ja tõestusmaterjale.

- `id`
- `proposal_id`
- `category`: general, youtube, short_video, instagram, event, custom
- `block_type`: text, stats, image, video, portfolio, comparison, testimonial, faq
- `title`
- `content`
- `stats` JSONB
- `media_urls` JSONB
- `linked_project_ids` UUID[]
- `display_order`
- `is_visible`

### `proposal_events`

Hoiab kasutaja tegevusi.

- `id`
- `proposal_id`
- `event_type`: opened, unlocked, item_added, item_removed, checkout_started, invoice_requested, custom_offer_sent, call_requested, payment_returned
- `metadata` JSONB
- `ip_hash`
- `user_agent_hash`
- `created_at`

### `proposal_submissions`

Hoiab arvepäringuid, custom soove ja kõnebroneeringuid.

- `id`
- `proposal_id`
- `kind`: invoice_request, custom_offer, call_request, question
- `contact_name`
- `contact_email`
- `contact_phone`
- `company_name`
- `message`
- `selected_items_snapshot` JSONB
- `totals_snapshot` JSONB
- `status`: new, contacted, closed
- `created_at`
- `updated_at`

### `proposal_orders`

Hoiab maksete ja tellimuste infot.

- `id`
- `proposal_id`
- `provider`: montonio
- `provider_order_id`
- `status`: pending, paid, abandoned, voided, refunded, partially_refunded, failed
- `currency`
- `subtotal_cents`
- `discount_cents`
- `vat_cents`
- `total_cents`
- `selected_items_snapshot` JSONB
- `checkout_url`
- `payment_method`
- `paid_at`
- `raw_provider_payload` JSONB
- `created_at`
- `updated_at`

### `proposal_acceptances`

Hoiab hetke, mil klient pakkumise kinnitab.

- `id`
- `proposal_id`
- `order_id`
- `accepted_by_name`
- `accepted_by_email`
- `selected_items_snapshot` JSONB
- `totals_snapshot` JSONB
- `terms_version`
- `accepted_at`

### `proposal_assets`

Kui statistika screenshotid või graafikud ei peaks olema avalikud, võiks neid hoida eraldi private storage bucketis.

- `id`
- `proposal_id`
- `category`
- `title`
- `storage_path`
- `asset_type`: image, pdf, video
- `display_order`
- `created_at`

Kliendile saab neid näidata serveri kaudu või signed URL-idega.

## Supabase turvareeglid

Oluline: hinnapakkumiste tabelid sisaldavad tundlikku äriinfot. Neid ei tohiks teha avalikult loetavaks sama mustriga nagu portfoolio nähtavad tööd.

Soovitatud turvamudel:

- Admini vaated kasutavad Supabase Authi.
- Kui tulevikus on rohkem kasutajaid kui ainult Kozipi admin, võiks lisada `admin_users` tabeli või rollipõhise kontrolli.
- Kliendivaade ei tee otse Supabase päringuid tundlikele tabelitele.
- Kliendivaade kutsub Next.js route handlerit, mis valideerib tokeni/PIN-i.
- Server kasutab teenusevõtit ainult serveris.
- Brauserisse saadetakse ainult selle konkreetse pakkumise jaoks vajalik sisu.
- Makse summa arvutatakse alati serveris uuesti, mitte ei usaldata brauserist saadetud summat.
- Pakkumise sündmuste salvestamisel tuleks piirata liigset spämmimist ja mitte hoida toorest IP-aadressi, vaid räsi.

Supabase'i enda dokumentatsioon rõhutab, et RLS tuleb tundlike tabelite puhul korrektselt lubada ning service role key peab jääma ainult serveripoolseks kasutuseks.

## Montonio maksevoog

Montonio tuleks integreerida pärast seda, kui pakkumise ja kalkulaatori põhiloogika töötab.

Soovitatud voog:

1. Klient valib teenused ja vajutab "Maksa kohe".
2. Frontend saadab valitud teenuste ID-d ja kogused serverisse.
3. Server valideerib pakkumise tokeni, staatuse ja kehtivuse.
4. Server arvutab hinna uuesti Supabase'i andmete põhjal.
5. Server loob `proposal_orders` kirje staatusega `pending`.
6. Server loob Montonio orderi.
7. Klient suunatakse Montonio checkouti.
8. Montonio saadab webhooki staatuse muutuse kohta.
9. Webhook valideeritakse serveris.
10. Kui staatus on `PAID`, uuendatakse `proposal_orders` ja `proposals`.
11. Adminile ja kliendile saadetakse kinnituse e-kiri.

Montonio praegune ametlik dokumentatsioon kirjeldab Stargate API kaudu orderi loomist, checkouti suunamist ning webhooke makse staatuste jaoks. Dokumentatsioonis on makse staatustena muu hulgas `PENDING`, `PAID`, `VOIDED`, `PARTIALLY_REFUNDED`, `REFUNDED` ja `ABANDONED`. Toetatud maksemeetodid sõltuvad valuutast ja konfiguratsioonist; EUR puhul on dokumentatsioonis nimetatud muu hulgas pangamaksed, kaardimaksed, BNPL ja hire purchase.

Alguses soovitus:

- Phase 1: "Palun saatke arve" ja "Custom soov" ilma online-makseta.
- Phase 2: Montonio makse + webhookid.
- Phase 3: refundide haldus adminis.

Nii saab müügikogemuse kiiresti valmis ja maksete osa lisada kontrollitult.

## Lehe marsruudid ja komponendid

Soovitatud uued lehed:

- `/admin/pakkumised`
- `/admin/pakkumised/new`
- `/admin/pakkumised/[id]`
- `/pakkumine/[token]`

Soovitatud API route'id:

- `/api/proposals/[token]/unlock`
- `/api/proposals/[token]/calculate`
- `/api/proposals/[token]/invoice-request`
- `/api/proposals/[token]/custom-offer`
- `/api/proposals/[token]/call-request`
- `/api/proposals/[token]/checkout`
- `/api/montonio/webhook`

Soovitatud komponendid:

- `ProposalShell`
- `ProposalServiceTabs`
- `ProposalServicePanel`
- `OfferCalculator`
- `StickyOfferSummary`
- `ProposalStatsBlock`
- `ProposalPortfolioBlock`
- `ProposalGuarantee`
- `AdminProposalList`
- `AdminProposalForm`
- `DiscountRuleEditor`
- `ProposalPreview`

## Sisu taaskasutus olemasolevalt avalehelt

Olemasoleva avalehe teenuste tekstid sobivad aluseks, aga privaatne pakkumise leht peaks olema konkreetsem.

Soovitus:

- Avaleht jääb brändi ja usalduse loomiseks.
- Pakkumise leht kasutab samu põhiargumente, aga lühendatud ja ostuotsuse jaoks struktureeritud kujul.
- Portfoolio näited tuleks siduda olemasolevate `projects` tabeli töödega.
- Statistika screenshotid ja graafikud võiksid tulla uutest `proposal_content_blocks` või `proposal_assets` kirjetest.
- Kui sama statistikat kasutatakse paljudes pakkumistes, võiks sellest teha korduvkasutatavad blokid või mallid.

## Rakendamise faasid

### Faas 1: Privaatne pakkumine ilma online-makseta

Eesmärk: klient saab personaalse lingi, valida teenuseid, näha hinda ja paluda arvet või saata custom soovi.

Töö:

- Supabase tabelid klientidele, pakkumistele, pakkumise teenustele, soodustusreeglitele ja submissionitele.
- Admini pakkumiste list.
- Admini pakkumise loomise/muutmise vorm.
- Kliendi privaatne pakkumise leht.
- Kalkulaator ja sticky kokkuvõte.
- Arvepäring ja custom soovi vorm.
- E-kirja teavitused.

### Faas 2: Montonio maksed

Eesmärk: klient saab valitud pakkumise eest kohe maksta.

Töö:

- Serveripoolne checkout route.
- Montonio orderi loomine.
- Webhook route ja makse staatuste salvestamine.
- Makse õnnestumise / ebaõnnestumise vaated.
- Adminis maksete staatus.

### Faas 3: Müügianalüütika ja mallid

Eesmärk: teha admini töö kiiremaks ja follow-up targemaks.

Töö:

- Pakkumise avamise ja tegevuste tracking.
- Pakkumise mallid.
- Dubleerimine.
- Statistika- ja portfoolioblokkide korduvkasutus.
- Aegumise ja follow-up teavitused.

### Faas 4: Peenemad ärifunktsioonid

Võimalikud lisad:

- PDF export sama pakkumise põhjal.
- Digitaalne kinnitamine.
- Refundide haldus adminis.
- Calendar integratsioon.
- E-mail magic link.
- Eraldi kliendi kommentaarid või küsimused pakkumise sees.

## Enne ehitamist otsustamist vajavad küsimused

- Kas hinnad kuvatakse käibemaksuga või käibemaksuta?
- Kas kliendile peab alati parooli/PIN-i saatma või piisab unikaalsest lingist?
- Kas raha tagasi garantii on tingimusteta või kindlate tingimustega?
- Kas "Maksa kohe" tähendab kogu summa maksmist või saab teha ettemaksu?
- Kas 6 kuu koostöö puhul maksab klient kogu summa ette või iga kuu?
- Kas Montonio maksed peaksid alguses olema ainult pangalingid või ka kaardid?
- Kas arve väljastamine toimub käsitsi või soovid hiljem raamatupidamistarkvara integratsiooni?
- Kas pakkumise statistika screenshotid võivad olla avaliku URL-iga või peavad olema private storage'is?
- Kas ingliskeelseid personaalseid pakkumisi on vaja kohe esimeses versioonis?

## Riskid ja soovitused

### Tundlikud hinnad lekivad

Risk: klient või keegi teine saab ligi teiste klientide hindadele.

Soovitus: tokenipõhine serveripoolne ligipääs, optional PIN, aegumine, revoked status, mitte avalikud Supabase selectid.

### Klient manipuleerib hinnaga brauseris

Risk: frontendist saadetakse odavam summa.

Soovitus: kõik summad arvutada serveris uuesti enne orderi loomist.

### Soodustused lähevad segaseks

Risk: klient ei saa aru, miks hind muutus.

Soovitus: näidata soodustust eraldi ridadena ja hoida reegleid lihtsana.

### Makse staatus jääb valeks

Risk: klient suunatakse tagasi enne, kui makse on päriselt kinnitatud.

Soovitus: webhook on tõeallikas; return page võib näidata "kontrollime makset".

### Garantiitekst tekitab õigusliku riski

Risk: "raha tagasi garantii" on liiga üldine.

Soovitus: lisada selged tingimused ja kinnituse checkbox enne makset.

### Admini õigused on liiga laiad

Risk: iga authenticated user saab liiga palju õigusi.

Soovitus: lisada admin-rolli kontroll, kui Supabase Authi tekib rohkem kasutajaid.

## Soovitatud MVP

Kui eesmärk on kiiresti päriselt kasulik asi valmis saada, siis MVP võiks olla:

1. Admin saab luua kliendi ja pakkumise.
2. Admin saab valida teenused, muuta hindu ja lisada manual discounti.
3. Klient saab avada privaatse lingi.
4. Klient saab teenuseid valida ja näha kogusummat.
5. Klient saab vajutada "Palun saatke arve" või "Soovin custom lahendust".
6. Admin saab e-kirja ja näeb päringut Supabase'is.
7. Pakkumise lehel on YouTube, lühivideo ja esinemise info koos portfoolio näidetega.

Montonio lisada teises etapis, sest see nõuab webhookide, makse staatusete ja turvalise serveripoolse hinnaarvutuse korralikku läbimõtlemist.

## Allikad

- Montonio Stargate API ülevaade: https://docs.montonio.com/api/stargate/overview
- Montonio orderi loomise ja valideerimise juhend: https://docs.montonio.com/api/stargate/guides/orders
- Supabase Row Level Security juhend: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase API turvalisuse juhend: https://supabase.com/docs/guides/api/securing-your-api
