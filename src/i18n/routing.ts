import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['et', 'en'],
  defaultLocale: 'et',
  // 'as-needed': vaikekeel (eesti) ilma prefiksita (/kellele_sobime),
  // inglise keel prefiksiga (/en/kellele_sobime). Olemasolevad eestikeelsed URL-id ei muutu.
  localePrefix: 'as-needed',
  // Ära tuvasta keelt brauseri Accept-Language põhjal — vaikimisi alati eesti,
  // kasutaja valib ise. (Vähem ootamatuid ümbersuunamisi otsingurobotitele.)
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
