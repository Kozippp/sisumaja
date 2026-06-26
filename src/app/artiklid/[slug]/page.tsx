import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { getLocale } from "@/lib/locale";
import { getArticleBySlug, localizeArticle, readingMinutes } from "@/lib/articles";
import JsonLd from "@/components/JsonLd";
import ArticleTracker from "@/components/ArticleTracker";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const article = await getArticleBySlug(slug);
  if (!article) return { title: locale === "en" ? "Article not found" : "Artiklit ei leitud" };
  const a = localizeArticle(article, locale);
  return {
    title: a.title,
    description: a.excerpt || undefined,
    alternates: { canonical: `/artiklid/${slug}` },
    openGraph: {
      title: `${a.title} | Kozip`,
      description: a.excerpt || undefined,
      url: `/artiklid/${slug}`,
      type: "article",
      ...(a.cover_image_url ? { images: [{ url: a.cover_image_url }] } : {}),
    },
  };
}

/** Lihtne sisu-renderdaja: ## ja ### pealkirjad, ülejäänu lõikudena. */
function renderContent(content: string) {
  const blocks = content.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("### ")) {
      return <h3 key={i} className="text-xl font-bold text-white mt-8 mb-3">{trimmed.slice(4)}</h3>;
    }
    if (trimmed.startsWith("## ")) {
      return <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">{trimmed.slice(3)}</h2>;
    }
    return (
      <p key={i} className="text-gray-300 leading-relaxed mb-5 whitespace-pre-wrap">{trimmed}</p>
    );
  });
}

function formatDate(date: string | null, locale: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(locale === "en" ? "en-GB" : "et-EE", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const en = locale === "en";
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const a = localizeArticle(article, locale);
  const minutes = readingMinutes(a.content);

  return (
    <article className="min-h-screen bg-black text-white">
      <ArticleTracker slug={slug} locale={locale} />
      <JsonLd
        data={[
          articleSchema({
            title: a.title,
            description: a.excerpt,
            path: `/artiklid/${slug}`,
            image: a.cover_image_url,
            datePublished: a.published_at,
            dateModified: a.updated_at,
            locale,
          }),
          breadcrumbSchema([
            { name: en ? "Home" : "Avaleht", path: "/" },
            { name: en ? "Articles" : "Artiklid", path: "/artiklid" },
            { name: a.title, path: `/artiklid/${slug}` },
          ]),
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <Link href="/artiklid" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> {en ? "Back to articles" : "Tagasi artiklite juurde"}
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">{a.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {a.published_at && <time>{formatDate(a.published_at, locale)}</time>}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {minutes} min {en ? "read" : "lugemist"}
            </span>
          </div>
        </header>

        {a.cover_image_url && (
          <div className="relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden mb-10">
            <Image src={a.cover_image_url} alt={a.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        )}

        {a.excerpt && <p className="text-lg text-gray-400 leading-relaxed mb-8">{a.excerpt}</p>}

        <div className="prose-content">
          {a.content ? renderContent(a.content) : null}
        </div>
      </div>
    </article>
  );
}
