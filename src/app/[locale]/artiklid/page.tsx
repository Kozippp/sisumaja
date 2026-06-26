import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { getPublishedArticles, localizeArticle } from "@/lib/articles";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl, buildAlternates, localePath } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en ? "Articles — influencer marketing insights" : "Artiklid — influencer-turunduse teadmised",
    description: en
      ? "Articles and insights on influencer marketing, YouTube and short-form video, and reaching young audiences in Estonia — by Kozip."
      : "Artiklid ja teadmised influencer-turundusest, YouTube’ist ja lühivideotest ning noorte sihtrühmani jõudmisest Eestis — Kozipilt.",
    alternates: buildAlternates("/artiklid", locale),
    openGraph: {
      title: en ? "Articles | Kozip" : "Artiklid | Kozip",
      url: localePath("/artiklid", locale),
      type: "website",
    },
  };
}

function formatDate(date: string | null, locale: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(locale === "en" ? "en-GB" : "et-EE", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === "en";
  const articles = (await getPublishedArticles()).map((a) => localizeArticle(a, locale));

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: en ? "Articles | Kozip" : "Artiklid | Kozip",
    url: absoluteUrl("/artiklid"),
    inLanguage: en ? "en" : "et",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbSchema([
            { name: en ? "Home" : "Avaleht", path: "/" },
            { name: en ? "Articles" : "Artiklid", path: "/artiklid" },
          ]),
        ]}
      />

      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
          {en ? "Articles" : "Artiklid"}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {en
            ? "Insights on influencer marketing, YouTube and reaching young audiences."
            : "Teadmised influencer-turundusest, YouTube’ist ja noorte sihtrühmani jõudmisest."}
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {articles.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            {en ? "No articles published yet — coming soon." : "Artikleid pole veel avaldatud — varsti tulekul."}
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/artiklid/${a.slug}`}
                className="group bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden hover:border-neutral-700 transition-colors flex flex-col"
              >
                {a.cover_image_url && (
                  <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                    <Image
                      src={a.cover_image_url}
                      alt={a.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  {a.published_at && (
                    <time className="text-xs text-gray-500 mb-2">{formatDate(a.published_at, locale)}</time>
                  )}
                  <h2 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {a.title}
                  </h2>
                  {a.excerpt && <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{a.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
