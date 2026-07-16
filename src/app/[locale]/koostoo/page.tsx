import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  ArrowUpRight,
  UtensilsCrossed,
  TrendingUp,
  Cpu,
  Flame,
  Dumbbell,
  Car,
  Radio,
  Gamepad2,
  Plane,
  Shirt,
  Youtube,
  Clapperboard,
  Instagram,
  Mic,
  Plus,
} from "lucide-react";
import { getKoostooContent } from "@/lib/koostoo-content";
import { buildAlternates, localePath } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import JsonLd from "@/components/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 300;

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  toit: UtensilsCrossed,
  finants: TrendingUp,
  tehnoloogia: Cpu,
  seiklus: Flame,
  sport: Dumbbell,
  auto: Car,
  telekom: Radio,
  mangud: Gamepad2,
  reisi: Plane,
  rivad: Shirt,
};

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

  // Fetch real thumbnails for the example case studies
  const exampleSlugs = c.categories.flatMap((cat) => cat.examples.map((e) => e.slug));
  const { data: exampleProjects } = await supabase
    .from("projects")
    .select("slug, thumbnail_url")
    .in("slug", exampleSlugs)
    .eq("is_visible", true);
  const thumbBySlug = new Map(
    (exampleProjects || []).map((p) => [p.slug, p.thumbnail_url as string | null])
  );

  const platforms = [
    { icon: Youtube, label: "YouTube" },
    { icon: Clapperboard, label: "TikTok" },
    { icon: Instagram, label: "Instagram Reels" },
    { icon: Mic, label: locale === "en" ? "Trainings & events" : "Koolitused ja üritused" },
  ];

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
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(192,38,211,0.12),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            {c.h1}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            {c.intro}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {platforms.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
              >
                <Icon className="w-4 h-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured categories with real case studies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            {c.categoriesHeading}
          </h2>
        </div>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-8">
          {c.categoriesSubheading}
        </p>

        {c.categories.map((cat, i) => {
          const Icon = CATEGORY_ICONS[cat.id] || Flame;
          const reversed = i % 2 === 1;
          return (
            <article
              key={cat.id}
              className="py-14 border-b border-neutral-900 last:border-b-0"
            >
              <div
                className={`grid gap-10 lg:gap-16 items-center lg:grid-cols-[1fr_1.2fr]`}
              >
                {/* Text side */}
                <div className={reversed ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/15 border border-primary/25">
                      <Icon className="w-5 h-5 text-primary" />
                    </span>
                    <span className="text-sm font-mono text-gray-600">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">
                    {cat.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{cat.body}</p>
                </div>

                {/* Case study cards */}
                <div
                  className={`${reversed ? "lg:order-1" : ""} ${
                    cat.examples.length === 1
                      ? "max-w-md w-full mx-auto lg:mx-0"
                      : "grid grid-cols-2 gap-4"
                  }`}
                >
                  {cat.examples.map((ex) => {
                    const thumb = thumbBySlug.get(ex.slug);
                    return (
                      <Link
                        key={ex.slug}
                        href={`/tehtud-tood/${ex.slug}`}
                        className="group block"
                      >
                        <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden relative border border-white/5 group-hover:border-primary/50 transition-all duration-500">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={ex.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950">
                              <Icon className="w-8 h-8 text-neutral-700" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1 group-hover:translate-y-0">
                            <ArrowUpRight className="w-4 h-4 text-white" />
                          </div>
                          <p className="absolute bottom-3 left-3 right-3 text-sm font-bold text-white leading-snug drop-shadow">
                            {ex.label}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* More categories — compact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center mb-3">
          {c.moreHeading}
        </h2>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
          {c.moreSubheading}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {c.moreCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Flame;
            return (
              <div
                key={cat.id}
                className="flex items-start gap-4 bg-neutral-950 border border-neutral-900 rounded-2xl p-5 hover:border-neutral-700 transition-colors"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
                  <Icon className="w-[18px] h-[18px] text-primary" />
                </span>
                <div>
                  <h3 className="font-bold text-white mb-1">{cat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{cat.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ — accordion */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center mb-10">
          {c.faqHeading}
        </h2>
        <div className="space-y-3">
          {c.faq.map((item, i) => (
            <details
              key={i}
              className="group bg-neutral-950 border border-neutral-900 rounded-2xl open:border-neutral-700 transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base md:text-lg font-bold text-white">
                  {item.question}
                </h3>
                <Plus className="w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="text-gray-400 leading-relaxed px-5 pb-5 -mt-1">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <div className="relative bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-3xl p-10 md:p-14 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(192,38,211,0.1),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
              {c.ctaHeading}
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto">
              {c.ctaText}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300 uppercase tracking-wide text-sm"
              >
                {c.ctaButton}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tehtud-tood"
                className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-neutral-700 text-white font-bold rounded-full hover:border-white transition-all duration-300 uppercase tracking-wide text-sm"
              >
                {c.ctaSecondary}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
