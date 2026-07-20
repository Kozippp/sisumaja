import { permanentRedirect } from 'next/navigation';

export default async function LegacyKoostooPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(locale === 'en' ? '/en/kellele_sobime' : '/kellele_sobime');
}
