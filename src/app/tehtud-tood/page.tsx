import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import { Database } from "@/types/database.types";
import WorkPageClient from "./WorkPageClient";

type Project = Database['public']['Tables']['projects']['Row'];

export const metadata: Metadata = {
  title: "Tehtud tööd | Sisumaja",
  description: "Vaata Sisumaja tehtud töid ja koostööprojekte.",
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
