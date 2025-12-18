'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setChecking(false);
      }
    };
    checkUser();
  }, [router]);

  if (checking) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Kontrollin õigusi...</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white uppercase mb-8">Lisa uus töö</h1>
        <ProjectForm />
      </div>
    </div>
  );
}

