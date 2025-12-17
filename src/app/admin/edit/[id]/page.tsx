'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { Database } from '@/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Unwrap params using React.use() or await in useEffect if not Server Component
  // Since this is a client component, we need to handle the promise correctly.
  // In Next 15/16 client components, params is a promise.
  const { id } = use(params);

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setProject(data);
      } else {
        // Handle 404
        alert('Projekti ei leitud');
        router.push('/admin/dashboard');
      }
      setLoading(false);
    };
    
    checkUserAndFetch();
  }, [id, router]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Laen...</div>;
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white uppercase mb-8">Muuda tööd: {project.title}</h1>
        <ProjectForm initialData={project} />
      </div>
    </div>
  );
}

