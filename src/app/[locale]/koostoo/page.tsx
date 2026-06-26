import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getKoostooContent } from "@/lib/koostoo-content";
import { buildAlternates, localePath } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = getKoostooContent(locale);
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: buildAlternates("/koostoo", locale),
    openGraph: {
      title: `${c.metaTitle} | Kozip`,
      description: c.metaDescription,
      url: localePath("/koostoo", locale),
      type: "website",
    },
  };
}

export default async function KoostooPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getKoostooContent(locale);

  return (
    <div className="min-h-screen bg-black text-white">
      <JsonLd
        data={[
          faqSchema(c.faq),
          breadcrumbSchema([
            { name: locale === "en" ? "Home" : "Avaleht", path: "/" },
            { name: c.h1, path: "/koostoo" },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
            {c.h1}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            {c.intro}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-10 text-center">
          {c.categoriesHeading}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {c.categories.map((cat) => (
            <article
              key={cat.id}
              className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 flex flex-col"
            >
              <h3 className="text-xl font-bold mb-3 text-white">{cat.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4 flex-1">{cat.body}</p>
              {cat.examples && cat.examples.length > 0 && (
                <div className="mt-auto pt-4 border-t border-neutral-900">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    {c.examplesLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.examples.map((ex) => (
                      <Link
                        key={ex.slug}
                        href={`/tehtud-tood/${ex.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-primary hover:text-white text-gray-300 transition-colors"
                      >
                        {ex.label}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-10 text-center">
          {c.faqHeading}
        </h2>
        <div className="space-y-4">
          {c.faq.map((item, i) => (
            <div key={i} className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">{item.question}</h3>
              <p className="text-gray-400 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-3xl p-10">
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-4">{c.ctaHeading}</h2>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto">{c.ctaText}</p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300 uppercase tracking-wide text-sm"
          >
            {c.ctaButton}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
