import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Database } from "@/types/database.types";
import { buildAlternates, localePath } from "@/lib/site";
import WorkPageClient from "./WorkPageClient";

type Project = Database['public']['Tables']['projects']['Row'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  const title = en
    ? "Portfolio — brand collaborations and campaigns"
    : "Tehtud tööd — brändikoostööd ja kampaaniad";
  const description = en
    ? "See Kozip’s work and brand collaborations: YouTube ad videos, short-form video and campaigns with food, finance, technology and entertainment brands."
    : "Vaata Kozipi tehtud töid ja brändikoostöid: YouTube’i reklaamvideod, lühivideod ja kampaaniad toidu-, finants-, tehnoloogia- ja meelelahutusbrändidega.";
  return {
    title,
    description,
    alternates: buildAlternates("/tehtud-tood", locale),
    openGraph: {
      title: `${title} | Kozip`,
      description,
      url: localePath("/tehtud-tood", locale),
      type: "website",
    },
  };
}

export const revalidate = 60;

async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .order("published_at", { ascending: false });
  return data || [];
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = await getProjects();
  return <WorkPageClient projects={projects} />;
}
