# Kontaktivormi e-kirja seadistus (info@kozip.ee)

**Turvalisus:** Salasõnu ja API võtmeid lisa ainult faili `.env.local` (kohalikult) või Verceli keskkonnamuutujatesse. Ära kunagi commiti `.env.local` ega kirjuta paroole siia dokumentatsiooni – repositooriumis tohib olla ainult `.env.example` placeholderitega.

Kontaktivorm saadab kaks e-kirja:
1. **Sulle (info@kozip.ee)** – sõnumiga vormist (nimi, e-mail, telefon, sõnum).
2. **Kirjutajale** – kinnitus, et sõnum jõudis meieni.

All on kaks võimalust: **Zoho SMTP** (soovitatav, kui e-mail on juba Zohos) ja **Resend**.

---

## Variant A: Zoho SMTP (kiireim, kui e-mail on juba Zohos)

Kuna info@kozip.ee on Zohos, võid kasutada Zoho SMTP – uut teenust vaja pole, domeeni DNS zone.ee-s muuta ei pea.

### 1. Zoho rakendusparool (soovitatav)

- Logi sisse: [https://accounts.zoho.com](https://accounts.zoho.com) → vali oma organisatsioon.
- **Security** → **App Passwords** (või **Application-Specific Passwords**).
- Loo uus app password (näiteks nimi: "Kozip veebileht").  
- **Kopeeri parool** – seda näidatakse ainult üks kord.

Kui App Passwords ei ole näha, kasuta tavalist Zoho kontoparooli (vähem turvaline, aga töötab).

### 2. Keskkonnamuutujad projekti juures

- Kopeeri **`.env.example`** → **`.env.local`** (projekti juurkaustas).
- Täida `.env.local` reaalsete väärtustega. **Ära kunagi commiti `.env.local` ega lisa paroole/võtmeid Git'i – need jäävad ainult kohalikult ja Verceli keskkonnamuutujatesse.**

Vajalikud muutujad (Zoho puhul):

- **SMTP_HOST** – `smtp.zoho.com` (EU konto: `smtp.zoho.eu`).
- **SMTP_PORT** – `465` (või `587` STARTTLS jaoks).
- **SMTP_USER** – täielik e-mail (nt info@kozip.ee).
- **SMTP_PASS** – Zoho app password (või kontoparool). Lisa ainult `.env.local` faili, mitte kunagi repositooriumi.
- **SMTP_FROM** – saatja nimi ja aadress, nt `Kozip <info@kozip.ee>`.
- **CONTACT_EMAIL_TO** (valikuline) – kuhu vormi sõnumid saadavad; vaikimisi info@kozip.ee.

Zoho EU kontode puhul võid kasutada `SMTP_HOST=smtp.zoho.eu` ja porti `587`.

### 3. Taaskäivita dev server

```bash
npm run dev
```

Vormi saatmine `/kontakt` lehel saadab nüüd kirja info@kozip.ee ja kinnituse kirjutaja e-mailile.

### 4. Production (Vercel / teised)

Lisa **Vercel** keskkonnas (**Project → Settings → Environment Variables**) need muutujad:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (nagu ülal)
- **`CONTACT_EMAIL_TO=info@kozip.ee`** – sihtaadress, kuhu vormi sõnumid saadavad. Kui see puudub, kasutatakse vaikimisi info@kozip.ee. Oluline: kui varem kasutati teist aadressi (nt info@sisumaja.ee), seo Vercelis kindlalt `CONTACT_EMAIL_TO=info@kozip.ee`, et production kasutaks õiget aadressi.

Pärast keskkonnamuutujate lisamist või muutmist **taaskäivita deploy** (Redeploy latest), et uued väärtused ja kood jõuaksid reaalselt production’i.

---

## Variant B: Resend

Resendiga saad kirjad API võtme kaudu. Senderi domeen (kozip.ee) tuleb Resendis verifitseerida; DNS kirjed lisa zone.ee-s.

### 1. Resend konto ja domeen

- Registreeru: [https://resend.com](https://resend.com).
- **Domains** → **Add Domain** → sisesta `kozip.ee`.
- Resend näitab vajalikke DNS kirjeid (TXT, võib-olla MX).

### 2. DNS zone.ee-s

- Logi zone.ee sisse → vali domeen **kozip.ee**.
- Lisa **TXT** kirjed täpselt nii, nagu Resend soovitab (copy-paste).
- Kui Resend palub **MX** kirjeid, lisa need ka (muul juhul info@kozip.ee võib jääda Zohosse; Resend kasutab neid saatmiseks).
- Oota 5–30 minutit, seejärel Resendis **Verify**.

### 3. API võti

Resendis: **API Keys** → **Create API Key** → kopeeri võti.

### 4. Koodi muutmine Resendile

Projektis on praegu **nodemailer + SMTP**. Resendiga võid:

- kas installida `resend` ja asendada `/api/contact/route.ts` sees e-kirja saatmine Resend API-ga,  
või  
- jääda Zoho SMTP juurde (ülal toodud).

Kui valid Resendi, lisa projekti:

```bash
npm install resend
```

Seejärel võid route’is SMTP asemel kasutada `Resend.Emails.send()` kahel korral (üks kiri sulle, üks kiri kirjutajale). Keskkonnamuutujaks piisab `RESEND_API_KEY`.

---

## Kokkuvõte

| Eesmärk | Soovitus |
|--------|----------|
| Kiireim lahendus, e-mail juba Zohos | **Zoho SMTP** (Variant A). Loo `.env.local`, lisa 5 muutujat, taaskäivita server. |
| Kinnitus kirjutajale | **Juba sees** – API saadab pärast vormi sõnumit teise kirja kirjutaja aadressile. |
| Zone.ee | Vajalik ainult siis, kui kasutad **Resendit** ja verifitseerid domeeni (DNS TXT/MX). Zoho SMTP jaoks zone.ee seadeid muuta ei pea. |

Kontaktivormi aadress on koodis juba **info@kozip.ee** (nii saaja kui kinnituskirja reply-to). Kinnituse sisu on eesti keeles ja ütleb, et sõnum jõudis meieni ja vastatakse esimesel võimalusel.
