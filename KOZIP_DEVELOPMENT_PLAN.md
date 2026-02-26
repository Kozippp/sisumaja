# Kozip Brändi Veebilehe Arendusplaan

See dokument on tegevuskava (roadmap) ja "elav" dokument "Sisumaja" veebilehe ümberkujundamiseks "Kozip" brändi veebileheks. Kozip pakub sarnast teenust (sotsiaalmeedia sisu loomine ja reklaam), kuid on uus ja värske bränd.

**Märkus teostavale AI agendile:** See dokument on sinu peamine tõeallikas. Kui teostad muudatusi, uuenda seda dokumenti (märgi tehtuks 'x', lisa märkmeid). Mõtle kastist välja ("outside the box"), paku futuristlikke lahendusi ja mikroanimatsioone, mis parandavad UX-i. Sinu eesmärk on luua emotsiooni tekitav ja professionaalne veebileht.

---

## 1. Visioon ja Stiil

*   **Bränd:** Kozip (varasemalt Sisumaja põhi).
*   **Stiil:** Futuristlik, dünaamiline, "kastist välja".
*   **Interaktsioonid:** Rõhk mikroanimatsioonidel (hover efektid, sujuvad sissejooksud, scroll-animatsioonid). Kasuta `framer-motion` teeki, mis on projektis juba olemas.
*   **Värvid ja Tüpograafia:** Uuenda vastavalt Kozipi brändile (vaja täpsustada või pakkuda välja stiilne, tume/neoon või puhas/minimalistlik lahendus, mis sobib sisuloome maailma).
*   **Keel:** Eesti keel (kogu leht on eestikeelne).

---

## 2. Arenduse To-Do List

### Ettevalmistus ja Üldine
- [x] **Brändingu vahetus:**
    - [x] Uuenda veebilehe pealkiri (title) ja meta andmed (metadata).
    - [x] Asenda favicon ja logod "Kozip" logodega. (Märkus: Failid on veel vanad, kuid koodis tekst ja alt on uuendatud)
    - [x] Määra kindlaks globaalsed värvid ja fondid `globals.css` või Tailwind konfigurisatsioonis.
- [x] **Navigatsioon (Header/Footer):**
    - [x] Uuenda navigatsiooniriba lingid ja logo.
    - [x] Uuenda footerit (SEO märksõnad, kontaktid, lingid sotsiaalmeediasse).

### Avaleht (Home Page) - Detailne struktuur

Avaleht tuleb ehitada täiesti nullist üles vastavalt uuele Kozipi visioonile.

#### 1. Hero Sektsioon
- [x] **Kujundus:** Kozipi logo, lühike ja lööv *slogan* (kes me oleme, mida pakume).
- [x] **Teenuste tutvustus (3 lahtrit):**
    - [x] Youtube'i videote sisene reklaam.
    - [x] Reklaam lühivideotes (Shorts/TikTok/Reels).
    - [x] Esinemised/koolitused.
    - *Nõue:* Iga lahter peab olema selge, hover-efektiga (nt helendav ääris, suumimine või värvimuutus), et oleks arusaadav, et need on interaktiivsed.
- [x] **Brändi "Quote" / Missioon:** Selge lause, mis seob teenused ja brändi olemuse.
- [x] **Kliendi Logo Karusell:**
    - [x] Loo lõputu (infinite) karusell klientide logodega.
    - [x] *Interaktsioon:* Hover peal peatab karuselli või toob logo esile.
    - [x] *Linkimine:* Tulevikus viib tehtud tööde lehele filtriga (hetkel piisab visuaalsest poolest).

#### 2. "Kes on Kozip" Sektsioon
- [x] **Sisu:** Tutvustus neile, kes meid ei tea.
- [x] **Visuaal:** Pildid meeskonnast/tegevusest, äge kollaaž.
- [x] **Video valmidus:** Jäta koht (placeholder) või võimalus tuleviku treiler-videoks. Disain peab töötama ka ilma videota (nt piltide ja graafikaga).

#### 3. Social Proof (Usaldusväärsus)
- [x] **Kommentaarid ja Fännid:** Pildid/kuvatõmmised fännide kirjadest, kommentaaridest.
- [x] **Üritused:** Fotod fännidega üritustelt.
- [x] **Tagasiside:** Klientide tsitaadid.
- *Eesmärk:* Näidata, et Kozipil on reaalne, aktiivne ja lojaalne jälgijaskond.

#### 4. Teenuste Detailne Lahtikirjutamine (3 Sektsiooni)
Iga teenuse sektsioon peab olema visuaalselt eristuv ja selgitav.

**Teenus 1: Youtube'i videote sisene reklaam**
- [x] **Copywriting:** "Kas reklaam Kozipi Youtube'i kanalil oleks sulle kasulik?". Selgita kasu kliendi vaatenurgast.
- [x] **Portfoolio (Mini-galerii):**
    - [x] Kuva viimased Youtube'i koostööd (väikesed lahtrid/thumbnailid).
    - [x] Klikkides avaneb detailsem vaade või video (kasuta olemasolevat "tehtud tööd" loogikat).
- [x] **CTA:** "Võta ühendust" nupp.

**Teenus 2: Reklaam lühivideotes**
- [x] **Copywriting:** Selgitus lühivideote (Shorts/TikTok) potentsiaalist.
- [x] **Portfoolio:** Näited lühivideotest.
- [x] **CTA:** "Võta ühendust" nupp.

**Teenus 3: Esinemine ja Koolitused**
- [x] **Teemad:** Investeerimine, sotsiaalmeedia, ettevõtlus, suhted, sisuloome, turundus (noortele turundamine).
- [x] **Sihtgrupp:** Konverentsid, õhtujuhtimine, ettevõttesisesed koolitused.
- [x] **Portfoolio (Karusell):**
    - [x] Ühe kohaline suur karusell.
    - [x] Suur pilt + pealkiri + lühike sissejuhatav tekst (...).
    - [x] Automaatne kerimine.
- [x] **CTA:** "Võta ühendust" nupp.

#### 5. Kontaktvorm
- [x] **Asukoht:** Kõikide teenuste sektsioonide all (enne footerit ja viimaseid töid).
- [x] **Vorm:** Lihtne ja selge vorm koostöösoovideks (Nimi, Email, Sõnum/Teema).

#### 6. Viimased Tehtud Tööd (Footer-i eelne)
- [x] **Funktsionaalsus:** Sarnane praegusele Sisumaja lahendusele, kuvab kronoloogiliselt viimaseid töid.
- [x] **Disain:** Ühtne uue Kozipi stiiliga.

### Muud Lehed (Tuleviku faas)
- [ ] `/tehtud-tood` - Vajab uut disaini ja filtrite süsteemi.
- [ ] `/meist` - Detailsem meeskonna tutvustus (kui vaja eraldi lehte).

---

## 3. Tehnilised Märkmed ja Juhised Agendile

1.  **Framework:** Next.js (App Router), React, Tailwind CSS.
2.  **Animatsioonid:** Kasuta `framer-motion` komponentide sisse toomiseks (fade-in, slide-up) ja interaktiivseteks elementideks.
3.  **Komponendid:** Loo korduvkasutatavad UI komponendid (nupud, kaardid, sektsioonid) kaustas `src/components`.
4.  **Andmed:** Kasuta olemasolevat Supabase backendi loogikat (kui see on rakendatav) tööde kuvamiseks. Kui andmestruktuur vajab muutmist, märgi see siia dokumenti.
5.  **Pildid:** Kasuta `next/image` optimeerimiseks.
6.  **Responsive:** Veendu, et kõik lahendused töötavad suurepäraselt nii mobiilis kui desktopis.

**Kui oled midagi valmis saanud:**
1.  Märgi siin dokumendis ruut [x].
2.  Lisa vajadusel kommentaar või täpsustus sektsiooni alla.
3.  Commiti muudatused git-i mõistliku sõnumiga.

---
**Algus:** 26.02.2026
