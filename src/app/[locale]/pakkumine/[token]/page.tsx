import { notFound } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase-server';
import ProposalClient from './ProposalClient';

export const dynamic = 'force-dynamic';

type ProposalData = {
  id: string;
  title: string;
  intro_text: string | null;
  guarantee_text: string | null;
  status: string;
  access_token: string;
  expires_at: string | null;
  vat_mode: string;
  vat_rate: number;
  currency: string;
  proposal_clients: {
    company_name: string;
    contact_name: string;
    email: string;
  } | null;
  proposal_items: Array<{
    id: string;
    category: string;
    title: string;
    description: string | null;
    deliverables: unknown;
    offered_price_cents: number;
    unit_label: string;
    min_quantity: number;
    max_quantity: number;
    default_quantity: number;
    billing_interval: string;
    is_enabled: boolean;
    display_order: number;
  }>;
  proposal_discount_rules: Array<{
    id: string;
    label: string;
    kind: string;
    discount_type: string;
    discount_value: number;
    min_quantity: number | null;
    applicable_categories: string[] | null;
    is_active: boolean;
  }>;
};

export default async function ProposalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const sb = getSupabaseServer();

  const { data: proposal, error } = await sb
    .from('proposals')
    .select(`
      id, title, intro_text, guarantee_text, status, access_token, expires_at,
      first_opened_at, vat_mode, vat_rate, currency,
      proposal_clients (company_name, contact_name, email),
      proposal_items (*),
      proposal_discount_rules (*)
    `)
    .eq('access_token', token)
    .single();

  if (error || !proposal) return notFound();
  if (proposal.status === 'revoked') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <p className="text-4xl mb-4">🔒</p>
        <h1 className="text-2xl font-bold text-white mb-3">Pakkumine on tühistatud</h1>
        <p className="text-gray-400 mb-8">See pakkumine pole enam saadaval. Võta meiega ühendust uue pakkumise saamiseks.</p>
        <a href="/kontakt" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-fuchsia-700 transition-colors">
          Võta ühendust
        </a>
      </div>
    );
  }
  if (proposal.expires_at && new Date(proposal.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <p className="text-4xl mb-4">⏰</p>
        <h1 className="text-2xl font-bold text-white mb-3">Pakkumine on aegunud</h1>
        <p className="text-gray-400 mb-8">See pakkumine on kehtivusaja ületanud. Võta meiega ühendust värske pakkumise saamiseks.</p>
        <a href="/kontakt" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-fuchsia-700 transition-colors">
          Võta ühendust
        </a>
      </div>
    );
  }

  // Track opening server-side
  const now = new Date().toISOString();
  const update: Record<string, string> = { last_opened_at: now };
  if (!proposal.first_opened_at) update.first_opened_at = now;
  if (proposal.status === 'draft' || proposal.status === 'published') update.status = 'opened';
  await sb.from('proposals').update(update).eq('id', proposal.id);

  const enabledItems = (proposal.proposal_items as ProposalData['proposal_items'])
    .filter(item => item.is_enabled)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <ProposalClient
      proposal={proposal as unknown as ProposalData}
      items={enabledItems}
      discountRules={proposal.proposal_discount_rules as ProposalData['proposal_discount_rules']}
    />
  );
}
