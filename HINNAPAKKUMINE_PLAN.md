# Hinnapakkumise moodul — Tööplaan

**Projekt:** reklaam.kozip.ee  
**Viimati uuendatud:** 2026-06-01  
**Plaan:** `KOZIP_HINNAPAKKUMISE_MOODULI_PLAAN.md`  
**Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS · Supabase · nodemailer

---

## Kontekst

Kozip (YouTuber Mihkel + Maia-Liis) müüb brändidele reklaami oma videotes. Eesmärk on ehitada **privaatne, tokenipõhine hinnapakkumise portaal**, kus admin loob personaalsed pakkumised ja saadab klientidele unikaalse lingi. Klient näeb ainult enda jaoks koostatud hindasid, saab teenuseid valida ja saata arvepäringut või custom soovi.

---

## Arhitektuur

```
/admin/pakkumised            ← admin: pakkumiste loend
/admin/pakkumised/new        ← admin: uue pakkumise loomine
/admin/pakkumised/[id]       ← admin: muutmine + päringute vaatamine

/pakkumine/[token]           ← kliendi privaatne pakkumiseleht (server component)
  └── ProposalClient.tsx     ← interaktiivne UI (client component)

/api/admin/proposals         ← admin CRUD (GET kõik, POST uus)
/api/admin/proposals/[id]    ← admin CRUD (GET üks, PATCH, DELETE)
/api/admin/service-catalog   ← teenuste kataloog admin jaoks
/api/admin/proposal-clients  ← klientide loend admin jaoks

/api/proposals/[token]/validate  ← tokeni valideerimine (GET)
/api/proposals/[token]/submit    ← arvepäring / custom soov / kõne (POST)
```

**Andmebaas (Supabase):**
- `proposal_clients` — klientide andmed
- `service_catalog` — Kozipi standardteenused (seeditud)
- `proposals` — pakkumised (tokeniga)
- `proposal_items` — teenused konkreetses pakkumises
- `proposal_discount_rules` — soodustuste reeglid
- `proposal_submissions` — klientide päringud (arve, custom, kõne)

**Turvamudel:** kliendi leht kasutab server componentit (`getSupabaseServer()`), mitte avalikku Supabase clientit. Brauserisse jõuab ainult selle pakkumise andmed. Admin API-d valideerivad Supabase authi JWT tokeni.

---

## Faas 1 — MVP (arve + custom soov, ilma online-makseta)

### A. Infrastruktuur

- [x] ✅ Supabase migratsiooni fail loodud  
  `supabase/migrations/create_proposals_module.sql`  
  Sisaldab: kõik 6 tabelit, RLS poliitikad, 4 vaiketeenust seeditud (youtube_integration, short_video, event_mc, training)

- [x] ✅ Server-only Supabase client  
  `src/lib/supabase-server.ts` — kasutab `SUPABASE_SERVICE_ROLE_KEY`, ainult serveris

- [x] ✅ TypeScript tüübid uuendatud  
  `src/types/database.types.ts` — lisatud kõik 6 uut tabelit

### B. Admin

- [x] ✅ Pakkumiste loend  
  `src/app/admin/pakkumised/page.tsx`  
  — tabel staatustega, link kopeerimise nupp, tühistamine, kustutamine

- [x] ✅ Uue pakkumise loomine  
  `src/app/admin/pakkumised/new/page.tsx`  
  — klient (uus või olemasolev), pakkumise detailid, teenused kataloogist või custom, soodustused, salvesta / avalda

- [x] ✅ Pakkumise muutmine + päringute vaatamine  
  `src/app/admin/pakkumised/[id]/page.tsx`  
  — kõik väljad muudetavad, kliendi päringud kuvatud, avaldamine, tühistamine

- [x] ✅ Dashboard uuendatud  
  `src/app/admin/dashboard/page.tsx` — lisatud "Hinnapakkumised" link

### C. API route'id

- [x] ✅ Admin proposals CRUD  
  `src/app/api/admin/proposals/route.ts` (GET kõik, POST uus)  
  `src/app/api/admin/proposals/[id]/route.ts` (GET üks, PATCH, DELETE)

- [x] ✅ Teenuste kataloog admin jaoks  
  `src/app/api/admin/service-catalog/route.ts`

- [x] ✅ Klientide loend admin jaoks  
  `src/app/api/admin/proposal-clients/route.ts`

- [x] ✅ Tokeni valideerimine  
  `src/app/api/proposals/[token]/validate/route.ts`

- [x] ✅ Päringu saatmine (arve / custom / kõne)  
  `src/app/api/proposals/[token]/submit/route.ts`  
  — salvestab Supabase'i, saadab e-kirja adminile nodemaileriga

### D. Kliendi leht

- [x] ✅ Server Component (tokeni valideerimine, avamise tracking)  
  `src/app/pakkumine/[token]/page.tsx`  
  — tühistatud/aegunud pakkumise vaated, `first_opened_at` ja `last_opened_at` tracking

- [x] ✅ Interaktiivne kliendi UI  
  `src/app/pakkumine/[token]/ProposalClient.tsx`  
  — hero + kiirstatistika, kategooriate tabid (YouTube/Lühivideo/Esinemine), teenusekortid koguse muutmisega, soodustuste arvutus, KM arvutus, sticky bottom bar, ostukorvi modal, päringu modal (arve/custom/kõne)

### E. Deployment eeldused (käsitsi sammud)

- [ ] ⏳ **KOHUSTUSLIK: Supabase SQL migratsioon rakendada**  
  Mine Supabase → SQL Editor → kopeeri ja käivita `supabase/migrations/create_proposals_module.sql`  
  (Loob tabelid, RLS poliitikad, seedib 4 teenust)

- [ ] ⏳ **KOHUSTUSLIK: `.env.local` uuendada**  
  Lisa: `SUPABASE_SERVICE_ROLE_KEY=<service_role_key>`  
  (Leidub Supabase → Project Settings → API → service_role)

---

## Faas 2 — Montonio online-makse

**Eesmärk:** Klient saab pakkumise eest kohe maksta (pangalink, kaart).

- [ ] Montonio API võtmed lisada env-i (`MONTONIO_ACCESS_KEY`, `MONTONIO_SECRET_KEY`, `MONTONIO_ENV`)
- [ ] `proposal_orders` tabeli migratsioon (lisada `create_proposals_module.sql`-le)
- [ ] Serveripoolne checkout route  
  `src/app/api/proposals/[token]/checkout/route.ts`  
  — valideerib tokeni, arvutab hinna uuesti serveris, loob Montonio order, tagastab checkout URL
- [ ] Montonio webhook route  
  `src/app/api/montonio/webhook/route.ts`  
  — valideerib signature, uuendab `proposal_orders.status`, uuendab `proposals.status`
- [ ] Makse staatuse lehed (`/pakkumine/[token]/success`, `/pakkumine/[token]/cancel`)
- [ ] "Maksa kohe" nupp kliendi UI-sse (ProposalClient.tsx)
- [ ] Maksete staatus admin vaatesse

**Viide:** `KOZIP_HINNAPAKKUMISE_MOODULI_PLAAN.md` → "Montonio maksevoog"

---

## Faas 3 — Müügianalüütika ja mallid

**Eesmärk:** Admin töö kiiremaks, pakkumised targemateks.

- [ ] Pakkumise avamiste tracking (millal, mitu korda)
- [ ] Kliendi tegevuste logi (milline teenus lisati, millal checkout alustati)
- [ ] Pakkumiste mallid (`proposal_templates` tabel)
- [ ] Pakkumiste dubleerimine (kopeeri olemasolev)
- [ ] Ühtsed statistikablokid (korduvkasutatavad portfoolio/stats elemendid)
- [ ] Aegumise e-kirja teavitus (kliendile enne aegumist)

---

## Faas 4 — Täiendavad ärifunktsioonid

- [ ] PDF eksport pakkumisest
- [ ] Digitaalne kinnitamine (klient kinnitab pakkumise sisu)
- [ ] Calendar integratsioon kõne broneerimiseks (Calendly vms)
- [ ] Refundide haldus adminis
- [ ] E-mail magic link (klient saab turvalisema juurdepääsu)
- [ ] Ingliskeelne pakkumise vaade (next-intl)

---

## Faadi koodi asukoht

```
src/
  app/
    admin/
      pakkumised/
        page.tsx              ← loend
        new/page.tsx          ← loomine
        [id]/page.tsx         ← muutmine
    pakkumine/
      [token]/
        page.tsx              ← server component
        ProposalClient.tsx    ← client UI
    api/
      admin/
        proposals/
          route.ts            ← GET all, POST new
          [id]/route.ts       ← GET one, PATCH, DELETE
        service-catalog/
          route.ts
        proposal-clients/
          route.ts
      proposals/
        [token]/
          validate/route.ts
          submit/route.ts
  lib/
    supabase-server.ts        ← server-only client
  types/
    database.types.ts         ← uuendatud uute tabelitega

supabase/
  migrations/
    create_proposals_module.sql   ← EI OLE VEEL RAKENDATUD
```

---

## Teadaolevad piirangud / TODO Faas 1 sees

- Admin pakkumise loomisel ei saa praegu portfoolio töid (`projects` tabelist) pakkumisega siduda — plaan olemas (`proposal_content_blocks` tabel), pole veel tehtud
- Statistika screenshotide üleslaadimine pakkumisse pole tehtud (`proposal_assets` tabel)
- Pakkumise eelvaade adminile enne avaldamist pole eraldi modal, aga admin saab ise linki avada
- PIN/parooli lisamine pakkumisele pole tehtud (plaanitud Faas 1-sse, jäi ära MVP lihtsustamiseks)
- `proposal_events` tracking tabel (iga tegevuse logi) pole tehtud — Faas 3 skoopis

---

## Järjekord, kui töö katkeb

1. Loe see fail läbi
2. Loe `KOZIP_HINNAPAKKUMISE_MOODULI_PLAAN.md` algne analüüs
3. Vaata hetke staatust: mis on ✅ ja mis on ⏳
4. **Esimene kohustuslik samm:** Supabase migratsioon rakendada (vt Faas 1 → E)
5. Seejärel testi: loo pakkumine adminiga, ava link kliendina
6. Jätka Faas 2-ga (Montonio)
