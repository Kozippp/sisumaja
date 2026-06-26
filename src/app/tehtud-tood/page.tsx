import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import { Database } from "@/types/database.types";
import WorkPageClient from "./WorkPageClient";

type Project = Database['public']['Tables']['projects']['Row'];

export const metadata: Metadata = {
  title: "Tehtud tööd — brändikoostööd ja kampaaniad",
  description:
    "Vaata Kozipi tehtud töid ja brändikoostöid: YouTube’i reklaamvideod, lühivideod ja kampaaniad toidu-, finants-, tehnoloogia- ja meelelahutusbrändidega.",
  alternates: { canonical: "/tehtud-tood" },
  openGraph: {
    title: "Tehtud tööd — brändikoostööd ja kampaaniad | Kozip",
    description:
      "Kozipi brändikoostööd ja kampaaniad YouTube’is ja lühivideotes — päris näited ja tulemused.",
    url: "/tehtud-tood",
    type: "website",
  },
};

export const revalidate = 60;

async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .order("published_at", { ascending: false });
  return data || [];
}

export default async function WorkPage() {
  const projects = await getProjects();
  return <WorkPageClient projects={projects} />;
}
