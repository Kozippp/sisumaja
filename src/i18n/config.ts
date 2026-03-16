export const locales = ['et', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'et';

export const localeNames: Record<Locale, string> = {
  et: 'Eesti',
  en: 'English',
};
