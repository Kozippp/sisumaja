'use client';

import { useState } from 'react';
import { Youtube, Video, Mic, Check, Minus, Plus, ShoppingCart, X, ChevronRight, Phone, FileText, Sparkles } from 'lucide-react';

type ProposalItem = {
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
};

type DiscountRule = {
  id: string;
  label: string;
  kind: string;
  discount_type: string;
  discount_value: number;
  min_quantity: number | null;
  applicable_categories: string[] | null;
  is_active: boolean;
};

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
  proposal_clients: { company_name: string; contact_name: string; email: string } | null;
};

type CartItem = {
  itemId: string;
  quantity: number;
};

type SubmitKind = 'invoice_request' | 'custom_offer' | 'call_request';

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.FC<{ className?: string }>; accent: string }> = {
  youtube:     { label: 'YouTube', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: Youtube, accent: '#ef4444' },
  short_video: { label: 'Lühivideo', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20', icon: Video, accent: '#d946ef' },
  instagram:   { label: 'Instagram', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', icon: Video, accent: '#ec4899' },
  event:       { label: 'Esinemine', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: Mic, accent: '#22c55e' },
  custom:      { label: 'Custom', color: 'text-gray-300', bg: 'bg-white/5 border-white/10', icon: Sparkles, accent: '#a855f7' },
};

function formatEur(cents: number) {
  return (cents / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €';
}

function calcDiscounts(
  cart: CartItem[],
  items: ProposalItem[],
  rules: DiscountRule[]
): { label: string; amount_cents: number }[] {
  const discounts: { label: string; amount_cents: number }[] = [];
  const subtotal = cart.reduce((sum, ci) => {
    const item = items.find(i => i.id === ci.itemId);
    return sum + (item ? item.offered_price_cents * ci.quantity : 0);
  }, 0);

  for (const rule of rules.filter(r => r.is_active)) {
    let amount = 0;
    if (rule.kind === 'manual' || rule.kind === 'quantity' || rule.kind === 'bundle' || rule.kind === 'commitment') {
      if (rule.discount_type === 'percent') {
        amount = Math.round(subtotal * (rule.discount_value / 100));
      } else {
        amount = Math.round(rule.discount_value * 100);
      }
    }
    if (amount > 0) {
      discounts.push({ label: rule.label, amount_cents: amount });
    }
  }
  return discounts;
}

export default function ProposalClient({
  proposal,
  items,
  discountRules,
}: {
  proposal: ProposalData;
  items: ProposalItem[];
  discountRules: DiscountRule[];
}) {
  const [cart, setCart] = useState<CartItem[]>(
    items.map(item => ({ itemId: item.id, quantity: item.default_quantity }))
  );
  const [activeCategory, setActiveCategory] = useState<string>(items[0]?.category || '');
  const [cartOpen, setCartOpen] = useState(false);
  const [submitKind, setSubmitKind] = useState<SubmitKind | null>(null);
  const [submitForm, setSubmitForm] = useState({ contact_name: '', contact_email: '', contact_phone: '', company_name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = Array.from(new Set(items.map(i => i.category)));

  const getItemQty = (id: string) => cart.find(c => c.itemId === id)?.quantity ?? 0;

  const setQty = (itemId: string, qty: number) => {
    const item = items.find(i => i.id === itemId)!;
    const clamped = Math.max(item.min_quantity, Math.min(item.max_quantity, qty));
    setCart(prev => {
      const existing = prev.find(c => c.itemId === itemId);
      if (existing) return prev.map(c => c.itemId === itemId ? { ...c, quantity: clamped } : c);
      return [...prev, { itemId, quantity: clamped }];
    });
  };

  const activeItems = cart.filter(c => {
    const item = items.find(i => i.id === c.itemId);
    return item && c.quantity > 0 && c.quantity >= item.min_quantity;
  });

  const subtotal = activeItems.reduce((sum, ci) => {
    const item = items.find(i => i.id === ci.itemId)!;
    return sum + item.offered_price_cents * ci.quantity;
  }, 0);

  const discounts = calcDiscounts(activeItems, items, discountRules);
  const totalDiscount = discounts.reduce((s, d) => s + d.amount_cents, 0);
  const afterDiscount = subtotal - totalDiscount;

  let vatAmount = 0;
  let total = afterDiscount;
  if (proposal.vat_mode === 'excludes_vat') {
    vatAmount = Math.round(afterDiscount * (proposal.vat_rate / 100));
    total = afterDiscount + vatAmount;
  } else if (proposal.vat_mode === 'includes_vat') {
    vatAmount = Math.round(afterDiscount - afterDiscount / (1 + proposal.vat_rate / 100));
    total = afterDiscount;
  }

  const handleSubmit = async () => {
    if (!submitKind) return;
    setSubmitting(true);
    const selectedSnapshot = activeItems.map(ci => {
      const item = items.find(i => i.id === ci.itemId)!;
      return { title: item.title, quantity: ci.quantity, subtotal_cents: item.offered_price_cents * ci.quantity };
    });
    try {
      const res = await fetch(`/api/proposals/${proposal.access_token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: submitKind,
          ...submitForm,
          selected_items: selectedSnapshot,
          totals: { subtotal_cents: subtotal, discount_cents: totalDiscount, vat_cents: vatAmount, total_cents: total },
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setSubmitKind(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Sõnum saadetud!</h1>
        <p className="text-gray-400 max-w-md">
          Kozip võtab sinuga ühendust esimesel võimalusel. Aitäh huvi eest!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight">KOZIP</span>
            <span className="text-gray-600 hidden sm:block">×</span>
            <span className="text-gray-400 text-sm hidden sm:block truncate max-w-[180px]">
              {proposal.proposal_clients?.company_name}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-bold text-sm">{formatEur(total)}</span>
            {activeItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-fuchsia-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {activeItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="max-w-3xl">
          {proposal.proposal_clients && (
            <p className="text-fuchsia-400 font-bold text-sm uppercase tracking-widest mb-3">
              Personaalne pakkumine — {proposal.proposal_clients.company_name}
            </p>
          )}
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-5">
            {proposal.title}
          </h1>
          {proposal.intro_text && (
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{proposal.intro_text}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {proposal.expires_at && (
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                Kehtib kuni {new Date(proposal.expires_at).toLocaleDateString('et-EE', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            )}
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {items.length} teenust selles pakkumises
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="border-y border-white/5 bg-white/3">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Keskm. vaatamist / video', value: '60 000+' },
            { label: 'Retention reklaami ajal', value: '95–99%' },
            { label: 'Lühivideo levik / video', value: '~100 000' },
            { label: 'Aastaid kogemust', value: '4+' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map(cat => {
              const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.custom;
              const Icon = cfg.icon;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    activeCategory === cat ? `${cfg.bg} ${cfg.color}` : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items
            .filter(item => categories.length <= 1 || item.category === activeCategory)
            .map(item => {
              const cfg = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.custom;
              const Icon = cfg.icon;
              const qty = getItemQty(item.id);
              const isSelected = qty >= item.min_quantity;
              const deliverables = Array.isArray(item.deliverables) ? item.deliverables as string[] : [];

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-6 transition-all ${
                    isSelected ? 'border-fuchsia-500/50 bg-fuchsia-500/5' : 'border-white/10 bg-white/3 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} mb-2`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      {item.description && <p className="text-sm text-gray-400 mt-1">{item.description}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-white">{formatEur(item.offered_price_cents)}</div>
                      <div className="text-xs text-gray-500">/ {item.unit_label}</div>
                    </div>
                  </div>

                  {deliverables.length > 0 && (
                    <ul className="space-y-1.5 mb-5">
                      {deliverables.slice(0, 5).map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center gap-3 mt-auto">
                    {item.max_quantity > 1 ? (
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1">
                        <button
                          onClick={() => setQty(item.id, qty - 1)}
                          disabled={qty <= item.min_quantity}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-12 text-center font-bold text-sm">{qty} {item.unit_label}</span>
                        <button
                          onClick={() => setQty(item.id, qty + 1)}
                          disabled={qty >= item.max_quantity}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">{qty} {item.unit_label}</div>
                    )}

                    <div className={`ml-auto text-sm font-bold ${isSelected ? 'text-green-400' : 'text-gray-600'}`}>
                      {isSelected ? `= ${formatEur(item.offered_price_cents * qty)}` : '—'}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${activeItems.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-neutral-900 border-t border-white/10 backdrop-blur-xl px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-white">{formatEur(total)}</span>
                  {proposal.vat_mode === 'excludes_vat' && (
                    <span className="text-xs text-gray-500">+ {proposal.vat_rate}% KM = {formatEur(total)}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {activeItems.map(ci => {
                    const item = items.find(i => i.id === ci.itemId)!;
                    return `${item.title} ×${ci.quantity}`;
                  }).join(' · ')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCartOpen(true)}
                  className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/15 transition-colors text-sm"
                >
                  Vaata kokkuvõtet
                </button>
                <button
                  onClick={() => { setSubmitKind('invoice_request'); setCartOpen(false); }}
                  className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-fuchsia-700 transition-colors text-sm flex items-center gap-2"
                >
                  Soovin koostööd
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative bg-neutral-900 border border-white/10 rounded-t-3xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-neutral-900 border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-3xl md:rounded-t-2xl">
              <h2 className="text-lg font-bold text-white">Pakkumise kokkuvõte</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {activeItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Ühtegi teenust ei ole valitud.</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {activeItems.map(ci => {
                      const item = items.find(i => i.id === ci.itemId)!;
                      return (
                        <div key={ci.itemId} className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-white text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500">{ci.quantity} × {formatEur(item.offered_price_cents)}</p>
                          </div>
                          <span className="font-bold text-white text-sm shrink-0">
                            {formatEur(item.offered_price_cents * ci.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {discounts.length > 0 && (
                    <div className="border-t border-white/10 pt-3 space-y-2">
                      {discounts.map((d, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-green-400">{d.label}</span>
                          <span className="text-green-400 font-bold">−{formatEur(d.amount_cents)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-3 space-y-2">
                    {proposal.vat_mode !== 'no_vat' && (
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>
                          KM {proposal.vat_rate}%
                          {proposal.vat_mode === 'includes_vat' ? ' (sisaldub)' : ''}
                        </span>
                        <span>{formatEur(vatAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-white">Kokku</span>
                      <span className="text-2xl font-black text-white">{formatEur(total)}</span>
                    </div>
                  </div>

                  {proposal.guarantee_text && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-sm text-green-300">
                      <Check className="w-4 h-4 mb-1.5" />
                      {proposal.guarantee_text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <button
                      onClick={() => { setSubmitKind('invoice_request'); setCartOpen(false); }}
                      className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-fuchsia-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Palun saatke arve
                    </button>
                    <button
                      onClick={() => { setSubmitKind('custom_offer'); setCartOpen(false); }}
                      className="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      Soovin teha oma pakkumise
                    </button>
                    <button
                      onClick={() => { setSubmitKind('call_request'); setCartOpen(false); }}
                      className="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      Broneeri kõne
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit form modal */}
      {submitKind && (
        <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSubmitKind(null)} />
          <div className="relative bg-neutral-900 border border-white/10 rounded-t-3xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-neutral-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {submitKind === 'invoice_request' && 'Arvepäring'}
                {submitKind === 'custom_offer' && 'Custom soov'}
                {submitKind === 'call_request' && 'Broneeri kõne'}
              </h2>
              <button onClick={() => setSubmitKind(null)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nimi" value={submitForm.contact_name} onChange={v => setSubmitForm(p => ({ ...p, contact_name: v }))} placeholder="Mari Mets" />
                <FormField label="E-post" value={submitForm.contact_email} onChange={v => setSubmitForm(p => ({ ...p, contact_email: v }))} type="email" placeholder="mari@ettevote.ee" />
                <FormField label="Telefon" value={submitForm.contact_phone} onChange={v => setSubmitForm(p => ({ ...p, contact_phone: v }))} placeholder="+372 5..." />
                <FormField label="Ettevõte" value={submitForm.company_name} onChange={v => setSubmitForm(p => ({ ...p, company_name: v }))} placeholder="Ettevõte AS" />
              </div>
              <FormField
                label={
                  submitKind === 'invoice_request' ? 'Lisainfo arve jaoks' :
                  submitKind === 'custom_offer' ? 'Mida soovid saavutada?' :
                  'Soovitud aeg / kommentaar'
                }
                value={submitForm.message}
                onChange={v => setSubmitForm(p => ({ ...p, message: v }))}
                textarea
                placeholder={
                  submitKind === 'custom_offer'
                    ? 'Kirjelda oma eesmärki, ligikaudset eelarvet ja soovitud ajastust...'
                    : ''
                }
              />

              {activeItems.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-400">
                  <p className="font-medium text-gray-300 mb-2">Valitud teenused:</p>
                  {activeItems.map(ci => {
                    const item = items.find(i => i.id === ci.itemId)!;
                    return (
                      <p key={ci.itemId}>{item.title} ×{ci.quantity} — {formatEur(item.offered_price_cents * ci.quantity)}</p>
                    );
                  })}
                  <p className="text-white font-bold mt-2 pt-2 border-t border-white/10">Kokku: {formatEur(total)}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-fuchsia-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saadan...' : 'Saada'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom padding for sticky bar */}
      {activeItems.length > 0 && <div className="h-24" />}
    </div>
  );
}

function FormField({
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
  const cls = "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-fuchsia-500 placeholder-gray-600";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      {textarea ? (
        <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}
