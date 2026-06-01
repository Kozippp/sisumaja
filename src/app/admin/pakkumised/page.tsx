'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Copy, Check, ExternalLink, Ban, Trash2, FileText, Clock, DollarSign } from 'lucide-react';

type Proposal = {
  id: string;
  title: string;
  status: string;
  access_token: string;
  expires_at: string | null;
  published_at: string | null;
  last_opened_at: string | null;
  created_at: string;
  proposal_clients: { company_name: string; contact_name: string; email: string } | null;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:             { label: 'Mustand',       color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
  published:         { label: 'Avaldatud',      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  opened:            { label: 'Avatud',          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  accepted:          { label: 'Kinnitatud',      color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  invoice_requested: { label: 'Arve soovitud',   color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  payment_pending:   { label: 'Makse ootel',     color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  paid:              { label: 'Makstud',          color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  expired:           { label: 'Aegunud',          color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  revoked:           { label: 'Tühistatud',       color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

export default function ProposalsListPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  const fetchProposals = useCallback(async (token: string) => {
    const res = await fetch('/api/admin/proposals', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setProposals(data.proposals || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      fetchProposals(session.access_token);
    };
    checkUser();
  }, [router, fetchProposals]);

  const copyLink = async (token: string, id: string) => {
    const url = `${window.location.origin}/pakkumine/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Tühista pakkumine? Klient ei saa enam linki avada.')) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch(`/api/admin/proposals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ revoke: true }),
    });
    fetchProposals(session.access_token);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Kustuta pakkumine jäädavalt?')) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch(`/api/admin/proposals/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    fetchProposals(session.access_token);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Laen...</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 rounded-lg bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white uppercase">Hinnapakkumised</h1>
              <p className="text-gray-500 text-sm mt-1">Personaalsed pakkumised klientidele</p>
            </div>
          </div>
          <Link
            href="/admin/pakkumised/new"
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-fuchsia-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Uus pakkumine
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-16 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Ühtegi pakkumist pole veel loodud</p>
            <p className="text-gray-600 text-sm mb-6">Loo esimene personaalne hinnapakkumine kliendile</p>
            <Link
              href="/admin/pakkumised/new"
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-fuchsia-700 transition-colors inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Loo esimene pakkumine
            </Link>
          </div>
        ) : (
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-950 text-gray-400 border-b border-neutral-800 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Klient / Pakkumine</th>
                  <th className="px-6 py-4 font-medium">Staatus</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Avati viimati</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Kehtib kuni</th>
                  <th className="px-6 py-4 font-medium text-right">Tegevused</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {proposals.map((p) => {
                  const statusInfo = STATUS_LABELS[p.status] || STATUS_LABELS.draft;
                  const isExpired = p.expires_at && new Date(p.expires_at) < new Date();
                  return (
                    <tr key={p.id} className="text-gray-300 hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{p.title}</div>
                        {p.proposal_clients && (
                          <div className="text-sm text-gray-500 mt-0.5">
                            {p.proposal_clients.company_name} · {p.proposal_clients.contact_name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-500">
                        {p.last_opened_at
                          ? new Date(p.last_opened_at).toLocaleDateString('et-EE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
                          : '—'
                        }
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-sm">
                        {p.expires_at ? (
                          <span className={isExpired ? 'text-red-400' : 'text-gray-400'}>
                            {new Date(p.expires_at).toLocaleDateString('et-EE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-1">
                          <a
                            href={`/pakkumine/${p.access_token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Ava pakkumine"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => copyLink(p.access_token, p.id)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Kopeeri link"
                          >
                            {copiedId === p.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <Link
                            href={`/admin/pakkumised/${p.id}`}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title="Muuda"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          {p.status !== 'revoked' && (
                            <button
                              onClick={() => handleRevoke(p.id)}
                              className="p-2 text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors"
                              title="Tühista pakkumine"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Kustuta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
