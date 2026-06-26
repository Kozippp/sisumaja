import { ReactNode } from 'react';

// Juur-layout on tahtlikult minimaalne: tegelik <html>/<body> ja kõik pakkujad
// renderdatakse [locale]/layout.tsx-is (next-intl i18n-routingu muster).
// See fail on olemas, et rahuldada Next.js juur-layouti nõuet.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
