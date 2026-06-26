'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

type ServiceCatalogItem = {
  id: string;
  code: string;
  category: string;
  title: string;
  short_description: string | null;
  default_price_cents: number;
  unit_label: string;
  deliverables: string[];
  default_min_quantity: number;
  default_max_quantity: number;
};

type ProposalItem = {
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
  label: string;
  kind: string;
  discount_type: string;
  discount_value: number;
  min_quantity: number | null;
  applicable_categories: string[];
};

const CATEGORY_LABELS: Record<string, string> = {
  youtube: 'YouTube',
  short_video: 'Lühivideo',
  instagram: 'Instagram',
  event: 'Esinemine / Koolitus',
  custom: 'Custom',
};

export default function NewProposalPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<ServiceCatalogItem[]>([]);
  const [existingClients, setExistingClients] = useState<{ id: string; company_name: string; contact_name: string }[]>([]);

  // Client
  const [useExistingClient, setUseExistingClient] = useState(false);
  const [existingClientId, setExistingClientId] = useState('');
  const [clientData, setClientData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    notes: '',
  });

  // Proposal
  const [proposalData, setProposalData] = useState({
    title: '',
    intro_text: '',
    guarantee_text: 'Kozip tagab kvaliteetse sisu ja strateegilise lähenemise igale koostööle.',
    internal_notes: '',
    vat_mode: 'excludes_vat',
    vat_rate: 22,
    expires_at: '',
  });

  // Items
  const [items, setItems] = useState<ProposalItem[]>([]);

  // Discounts
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>([]);

  const [expandedSections, setExpandedSections] = useState({
    client: true,
    proposal: true,
    items: true,
    discounts: false,
  });

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setAccessToken(session.access_token);

      const [catalogRes, clientsRes] = await Promise.all([
        fetch('/api/admin/service-catalog', { headers: { Authorization: `Bearer ${session.access_token}` } }),
        fetch('/api/admin/proposal-clients', { headers: { Authorization: `Bearer ${session.access_token}` } }),
      ]);
      if (catalogRes.ok) {
        const d = await catalogRes.json();
        setCatalog(d.services || []);
      }
      if (clientsRes.ok) {
        const d = await clientsRes.json();
        setExistingClients(d.clients || []);
      }
    };
    init();
  }, [router]);

  const addItemFromCatalog = (service: ServiceCatalogItem) => {
    setItems(prev => [...prev, {
      service_catalog_id: service.id,
      category: service.category,
      title: service.title,
      description: service.short_description || '',
      offered_price_cents: service.default_price_cents,
      base_price_cents: service.default_price_cents,
      unit_label: service.unit_label,
      min_quantity: service.default_min_quantity,
      max_quantity: service.default_max_quantity,
      default_quantity: service.default_min_quantity,
      billing_interval: 'one_time',
      deliverables: Array.isArray(service.deliverables) ? service.deliverables : [],
    }]);
  };

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

  const updateItem = (i: number, field: keyof ProposalItem, value: unknown) => {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  const removeItem = (i: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  };

  const toggleSection = (s: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [s]: !prev[s] }));
  };

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);
    try {
      const clientPayload = useExistingClient
        ? { id: existingClientId }
        : {
            company_name: clientData.company_name,
            contact_name: clientData.contact_name,
            email: clientData.email,
            phone: clientData.phone || null,
            notes: clientData.notes || null,
          };

      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          client: clientPayload,
          ...proposalData,
          expires_at: proposalData.expires_at || null,
          items,
          discount_rules: discountRules,
          publish,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert('Viga: ' + (err.error || 'Tundmatu viga'));
        return;
      }

      const { id } = await res.json();
      router.push(`/admin/pakkumised/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ title, section }: { title: string; section: keyof typeof expandedSections }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-6 text-left"
    >
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {expandedSections[section] ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/admin/pakkumised"
            className="p-2 rounded-lg bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-white uppercase">Uus Pakkumine</h1>
        </div>

        <div className="space-y-4">
          {/* CLIENT SECTION */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <SectionHeader title="1. Klient" section="client" />
            {expandedSections.client && (
              <div className="px-6 pb-6 space-y-4">
                {existingClients.length > 0 && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useExistingClient}
                      onChange={e => setUseExistingClient(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-600 text-fuchsia-500"
                    />
                    <span className="text-sm text-gray-300">Kasuta olemasolevat klienti</span>
                  </label>
                )}

                {useExistingClient ? (
                  <select
                    value={existingClientId}
                    onChange={e => setExistingClientId(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                  >
                    <option value="">Vali klient...</option>
                    {existingClients.map(c => (
                      <option key={c.id} value={c.id}>{c.company_name} — {c.contact_name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Ettevõte *" value={clientData.company_name} onChange={v => setClientData(p => ({ ...p, company_name: v }))} placeholder="nt. Swedbank AS" />
                    <Field label="Kontaktisik *" value={clientData.contact_name} onChange={v => setClientData(p => ({ ...p, contact_name: v }))} placeholder="nt. Mari Mets" />
                    <Field label="E-post *" value={clientData.email} onChange={v => setClientData(p => ({ ...p, email: v }))} placeholder="mari@ettevote.ee" type="email" />
                    <Field label="Telefon" value={clientData.phone} onChange={v => setClientData(p => ({ ...p, phone: v }))} placeholder="+372 5..." />
                    <div className="md:col-span-2">
                      <Field label="Märkused (ainult adminile)" value={clientData.notes} onChange={v => setClientData(p => ({ ...p, notes: v }))} placeholder="Sisemised märkmed..." textarea />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PROPOSAL DETAILS */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <SectionHeader title="2. Pakkumise detailid" section="proposal" />
            {expandedSections.proposal && (
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Field
                      label="Pakkumise pealkiri *"
                      value={proposalData.title}
                      onChange={v => setProposalData(p => ({ ...p, title: v }))}
                      placeholder="nt. Kozip × Swedbank koostööpakkumine"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Field
                      label="Sissejuhatustekst"
                      value={proposalData.intro_text}
                      onChange={v => setProposalData(p => ({ ...p, intro_text: v }))}
                      placeholder="Lühike tekst, miks see pakkumine sellele kliendile sobib..."
                      textarea
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Field
                      label="Garantiitekst"
                      value={proposalData.guarantee_text}
                      onChange={v => setProposalData(p => ({ ...p, guarantee_text: v }))}
                      textarea
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Kehtib kuni</label>
                    <input
                      type="date"
                      value={proposalData.expires_at}
                      onChange={e => setProposalData(p => ({ ...p, expires_at: e.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Käibemaks</label>
                    <select
                      value={proposalData.vat_mode}
                      onChange={e => setProposalData(p => ({ ...p, vat_mode: e.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                    >
                      <option value="excludes_vat">+ KM {proposalData.vat_rate}%</option>
                      <option value="includes_vat">KM sisaldub hindades</option>
                      <option value="no_vat">Ei rakendu (väikeettevõte)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Field
                      label="Sisemised märkused (ainult adminile)"
                      value={proposalData.internal_notes}
                      onChange={v => setProposalData(p => ({ ...p, internal_notes: v }))}
                      textarea
                      placeholder="Müügistrateegia, järgmised sammud..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ITEMS */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <SectionHeader title="3. Teenused ja hinnad" section="items" />
            {expandedSections.items && (
              <div className="px-6 pb-6 space-y-4">
                {/* Catalog quick-add */}
                {catalog.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-3">Lisa kataloogist:</p>
                    <div className="flex flex-wrap gap-2">
                      {catalog.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => addItemFromCatalog(s)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-sm hover:bg-white/10 border border-white/10 transition-colors"
                        >
                          + {s.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items list */}
                {items.map((item, i) => (
                  <div key={i} className="bg-black/30 rounded-xl border border-white/10 p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
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
                        <Field
                          label="Kirjeldus"
                          value={item.description}
                          onChange={v => updateItem(i, 'description', v)}
                          textarea
                        />
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Hind kliendile (EUR)</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.offered_price_cents / 100}
                                onChange={e => updateItem(i, 'offered_price_cents', Math.round(parseFloat(e.target.value) * 100) || 0)}
                                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                              />
                              <span className="text-gray-400 text-sm">€ / {item.unit_label}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Min</label>
                              <input
                                type="number"
                                min="1"
                                value={item.min_quantity}
                                onChange={e => updateItem(i, 'min_quantity', parseInt(e.target.value) || 1)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Max</label>
                              <input
                                type="number"
                                min="1"
                                value={item.max_quantity}
                                onChange={e => updateItem(i, 'max_quantity', parseInt(e.target.value) || 1)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Vaikimisi</label>
                              <input
                                type="number"
                                min={item.min_quantity}
                                max={item.max_quantity}
                                value={item.default_quantity}
                                onChange={e => updateItem(i, 'default_quantity', parseInt(e.target.value) || 1)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-6"
                      >
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
                  Lisa custom teenus
                </button>
              </div>
            )}
          </div>

          {/* DISCOUNTS */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <SectionHeader title="4. Soodustused (valikuline)" section="discounts" />
            {expandedSections.discounts && (
              <div className="px-6 pb-6 space-y-4">
                {discountRules.map((rule, i) => (
                  <div key={i} className="bg-black/30 rounded-xl border border-white/10 p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input
                      value={rule.label}
                      onChange={e => setDiscountRules(prev => prev.map((r, idx) => idx === i ? { ...r, label: e.target.value } : r))}
                      placeholder="Soodustuse nimi"
                      className="col-span-2 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500"
                    />
                    <select
                      value={rule.discount_type}
                      onChange={e => setDiscountRules(prev => prev.map((r, idx) => idx === i ? { ...r, discount_type: e.target.value } : r))}
                      className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500"
                    >
                      <option value="percent">%</option>
                      <option value="fixed">EUR</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={rule.discount_value}
                        onChange={e => setDiscountRules(prev => prev.map((r, idx) => idx === i ? { ...r, discount_value: parseFloat(e.target.value) || 0 } : r))}
                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500"
                      />
                      <button
                        type="button"
                        onClick={() => setDiscountRules(prev => prev.filter((_, idx) => idx !== i))}
                        className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setDiscountRules(prev => [...prev, { label: '', kind: 'manual', discount_type: 'percent', discount_value: 0, min_quantity: null, applicable_categories: [] }])}
                  className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Lisa soodustus
                </button>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex-1 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Salvesta mustandina
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex-1 py-4 rounded-xl bg-primary text-white font-bold hover:bg-fuchsia-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvestan...' : 'Avalda ja genereeri link'}
            </button>
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
