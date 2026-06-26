'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, ExternalLink, Ban, Trash2, Plus, Save } from 'lucide-react';

type ProposalItem = {
  id?: string;
  service_catalog_id: string | null;
  category: string;
  title: string;
  description: string;
  offered_price_cents: number;
  base_price_cents: number;
  unit_label: string;
  min_quantity: number;
  max_quantity: number;
  default_quantity: number;
  billing_interval: string;
  deliverables: string[];
};

type DiscountRule = {
  id?: string;
  label: string;
  kind: string;
  discount_type: string;
  discount_value: number;
  min_quantity: number | null;
  applicable_categories: string[];
};

type Submission = {
  id: string;
  kind: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  company_name: string | null;
  message: string | null;
  totals_snapshot: { total_cents?: number } | null;
  status: string;
  created_at: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  youtube: 'YouTube',
  short_video: 'Lühivideo',
  instagram: 'Instagram',
  event: 'Esinemine / Koolitus',
  custom: 'Custom',
};

const KIND_LABELS: Record<string, string> = {
  invoice_request: 'Arvepäring',
  custom_offer: 'Custom soov',
  call_request: 'Kõne broneering',
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

export default function EditProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [proposal, setProposal] = useState<{
    title: string;
    intro_text: string;
    guarantee_text: string;
    internal_notes: string;
    vat_mode: string;
    vat_rate: number;
    expires_at: string;
    status: string;
    access_token: string;
  } | null>(null);

  const [client, setClient] = useState<{ company_name: string; contact_name: string; email: string; phone?: string | null } | null>(null);
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/admin/login'); return; }
      setAccessToken(session.access_token);

      const res = await fetch(`/api/admin/proposals/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) { router.push('/admin/pakkumised'); return; }
      const data = await res.json();
      const p = data.proposal;

      setProposal({
        title: p.title || '',
        intro_text: p.intro_text || '',
        guarantee_text: p.guarantee_text || '',
        internal_notes: p.internal_notes || '',
        vat_mode: p.vat_mode || 'excludes_vat',
        vat_rate: p.vat_rate || 22,
        expires_at: p.expires_at ? p.expires_at.split('T')[0] : '',
        status: p.status,
        access_token: p.access_token,
      });
      setClient(p.proposal_clients);
      setItems((p.proposal_items || []).map((item: Record<string, unknown>) => ({
        id: item.id as string,
        service_catalog_id: item.service_catalog_id as string | null,
        category: item.category as string,
        title: item.title as string,
        description: (item.description as string) || '',
        offered_price_cents: item.offered_price_cents as number,
        base_price_cents: item.base_price_cents as number,
        unit_label: item.unit_label as string,
        min_quantity: item.min_quantity as number,
        max_quantity: item.max_quantity as number,
        default_quantity: item.default_quantity as number,
        billing_interval: item.billing_interval as string,
        deliverables: Array.isArray(item.deliverables) ? item.deliverables as string[] : [],
      })));
      setDiscountRules((p.proposal_discount_rules || []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        label: r.label as string,
        kind: r.kind as string,
        discount_type: r.discount_type as string,
        discount_value: r.discount_value as number,
        min_quantity: r.min_quantity as number | null,
        applicable_categories: (r.applicable_categories as string[]) || [],
      })));
      setSubmissions(p.proposal_submissions || []);
      setLoading(false);
    };
    init();
  }, [id, router]);

  const updateItem = (i: number, field: keyof ProposalItem, value: unknown) => {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const addCustomItem = () => {
    setItems(prev => [...prev, {
      service_catalog_id: null,
      category: 'custom',
      title: 'Uus teenus',
      description: '',
      offered_price_cents: 0,
      base_price_cents: 0,
      unit_label: 'ühik',
      min_quantity: 1,
      max_quantity: 12,
      default_quantity: 1,
      billing_interval: 'one_time',
      deliverables: [],
    }]);
  };

  const handleSave = async (publishAction?: boolean | 'revoke') => {
    if (!proposal || !accessToken) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        title: proposal.title,
        intro_text: proposal.intro_text || null,
        guarantee_text: proposal.guarantee_text || null,
        internal_notes: proposal.internal_notes || null,
        vat_mode: proposal.vat_mode,
        vat_rate: proposal.vat_rate,
        expires_at: proposal.expires_at || null,
        items,
        discount_rules: discountRules,
      };
      if (publishAction === true) body.publish = true;
      if (publishAction === 'revoke') body.revoke = true;

      const res = await fetch(`/api/admin/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        if (publishAction === 'revoke') router.push('/admin/pakkumised');
        else {
          setProposal(p => p ? { ...p, status: publishAction === true ? 'published' : p.status } : p);
          alert('Salvestatud!');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    if (!proposal) return;
    await navigator.clipboard.writeText(`${window.location.origin}/pakkumine/${proposal.access_token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Laen...</div>;
  }
  if (!proposal) return null;

  const statusInfo = STATUS_LABELS[proposal.status] || STATUS_LABELS.draft;

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <Link href="/admin/pakkumised" className="p-2 rounded-lg bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors mt-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{proposal.title}</h1>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            {client && (
              <p className="text-gray-500 text-sm mt-1">{client.company_name} · {client.contact_name}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/pakkumine/${proposal.access_token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-800 text-gray-400 hover:text-white transition-colors"
              title="Ava pakkumine"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={copyLink}
              className="p-2 rounded-lg bg-neutral-800 text-gray-400 hover:text-white transition-colors"
              title="Kopeeri link"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Link box */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Kliendi link</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-sm text-fuchsia-400 bg-black/50 rounded-lg px-4 py-2 truncate">
                {typeof window !== 'undefined' ? `${window.location.origin}/pakkumine/${proposal.access_token}` : `/pakkumine/${proposal.access_token}`}
              </code>
              <button
                onClick={copyLink}
                className="shrink-0 flex items-center gap-2 px-4 py-2 bg-fuchsia-600 text-white rounded-lg text-sm font-bold hover:bg-fuchsia-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Kopeeri
              </button>
            </div>
          </div>

          {/* Submissions */}
          {submissions.length > 0 && (
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-800">
                <h2 className="text-lg font-bold text-white">Kliendi päringud ({submissions.length})</h2>
              </div>
              <div className="divide-y divide-neutral-800">
                {submissions.map(sub => (
                  <div key={sub.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-fuchsia-400 uppercase">{KIND_LABELS[sub.kind] || sub.kind}</span>
                        <p className="text-white font-medium mt-1">{sub.contact_name || '—'}</p>
                        <p className="text-sm text-gray-400">{sub.contact_email} · {sub.contact_phone}</p>
                        {sub.message && <p className="text-sm text-gray-300 mt-2 bg-white/5 rounded-lg p-3">{sub.message}</p>}
                        {sub.totals_snapshot?.total_cents && (
                          <p className="text-sm text-gray-500 mt-1">Summa: {(sub.totals_snapshot.total_cents / 100).toFixed(2)} €</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-600">{new Date(sub.created_at).toLocaleDateString('et-EE')}</p>
                        <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-bold ${sub.status === 'new' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                          {sub.status === 'new' ? 'Uus' : sub.status === 'contacted' ? 'Kontakteeritud' : 'Suletud'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposal fields */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white mb-4">Pakkumise detailid</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field label="Pealkiri *" value={proposal.title} onChange={v => setProposal(p => p ? { ...p, title: v } : p)} />
              </div>
              <div className="md:col-span-2">
                <Field label="Sissejuhatustekst" value={proposal.intro_text} onChange={v => setProposal(p => p ? { ...p, intro_text: v } : p)} textarea />
              </div>
              <div className="md:col-span-2">
                <Field label="Garantiitekst" value={proposal.guarantee_text} onChange={v => setProposal(p => p ? { ...p, guarantee_text: v } : p)} textarea />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Kehtib kuni</label>
                <input
                  type="date"
                  value={proposal.expires_at}
                  onChange={e => setProposal(p => p ? { ...p, expires_at: e.target.value } : p)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Käibemaks</label>
                <select
                  value={proposal.vat_mode}
                  onChange={e => setProposal(p => p ? { ...p, vat_mode: e.target.value } : p)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                >
                  <option value="excludes_vat">+ KM {proposal.vat_rate}%</option>
                  <option value="includes_vat">KM sisaldub hindades</option>
                  <option value="no_vat">Ei rakendu</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Field label="Sisemised märkused" value={proposal.internal_notes} onChange={v => setProposal(p => p ? { ...p, internal_notes: v } : p)} textarea />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Teenused ja hinnad</h2>
            {items.map((item, i) => (
              <div key={i} className="bg-black/30 rounded-xl border border-white/10 p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Teenuse nimi *" value={item.title} onChange={v => updateItem(i, 'title', v)} />
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Kategooria</label>
                      <select
                        value={item.category}
                        onChange={e => updateItem(i, 'category', e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-fuchsia-500"
                      >
                        {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <Field label="Kirjeldus" value={item.description} onChange={v => updateItem(i, 'description', v)} textarea />
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Hind (EUR / {item.unit_label})</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.offered_price_cents / 100}
                          onChange={e => updateItem(i, 'offered_price_cents', Math.round(parseFloat(e.target.value) * 100) || 0)}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Min</label>
                          <input type="number" min="1" value={item.min_quantity}
                            onChange={e => updateItem(i, 'min_quantity', parseInt(e.target.value) || 1)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Max</label>
                          <input type="number" min="1" value={item.max_quantity}
                            onChange={e => updateItem(i, 'max_quantity', parseInt(e.target.value) || 1)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Vaikimisi</label>
                          <input type="number" min={item.min_quantity} max={item.max_quantity} value={item.default_quantity}
                            onChange={e => updateItem(i, 'default_quantity', parseInt(e.target.value) || 1)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-6">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addCustomItem}
              className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Lisa teenus
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-800 text-white font-bold hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Salvesta
            </button>
            {proposal.status === 'draft' && (
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-fuchsia-700 transition-colors disabled:opacity-50"
              >
                Avalda ja genereeri link
              </button>
            )}
            {proposal.status !== 'revoked' && (
              <button
                onClick={() => handleSave('revoke')}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-400 font-bold hover:bg-red-500/10 transition-colors disabled:opacity-50 ml-auto"
              >
                <Ban className="w-4 h-4" />
                Tühista pakkumine
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  const cls = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-fuchsia-500 placeholder-gray-600";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}
