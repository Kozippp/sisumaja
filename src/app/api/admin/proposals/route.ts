import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  const accessToken = authHeader.slice(7);
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await sb.auth.getUser(accessToken);
  return !!user;
}

export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const sb = getSupabaseServer();
  const { data, error } = await sb
    .from('proposals')
    .select('*, proposal_clients(company_name, contact_name, email)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ proposals: data });
}

export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const sb = getSupabaseServer();
  const body = await req.json();
  const {
    client, // { company_name, contact_name, email, phone, notes } or { id }
    title,
    intro_text,
    guarantee_text,
    internal_notes,
    vat_mode,
    vat_rate,
    expires_at,
    items, // [{ service_catalog_id?, category, title, description, offered_price_cents, base_price_cents, unit_label, min_quantity, max_quantity, default_quantity, deliverables, billing_interval }]
    discount_rules, // [{ label, kind, discount_type, discount_value, min_quantity, applicable_categories }]
    publish,
  } = body;

  // Upsert client
  let clientId: string;
  if (client.id) {
    clientId = client.id;
  } else {
    const { data: newClient, error: clientError } = await sb
      .from('proposal_clients')
      .insert({
        company_name: client.company_name,
        contact_name: client.contact_name,
        email: client.email,
        phone: client.phone || null,
        notes: client.notes || null,
      })
      .select('id')
      .single();
    if (clientError || !newClient) {
      return NextResponse.json({ error: clientError?.message || 'client_error' }, { status: 500 });
    }
    clientId = newClient.id;
  }

  const token = generateToken();
  const { data: proposal, error: proposalError } = await sb
    .from('proposals')
    .insert({
      client_id: clientId,
      title,
      intro_text: intro_text || null,
      guarantee_text: guarantee_text || null,
      internal_notes: internal_notes || null,
      status: publish ? 'published' : 'draft',
      access_token: token,
      expires_at: expires_at || null,
      vat_mode: vat_mode || 'excludes_vat',
      vat_rate: vat_rate ?? 22,
      published_at: publish ? new Date().toISOString() : null,
    })
    .select('id, access_token')
    .single();

  if (proposalError || !proposal) {
    return NextResponse.json({ error: proposalError?.message || 'proposal_error' }, { status: 500 });
  }

  // Insert items
  if (items?.length) {
    const itemRows = items.map((item: Record<string, unknown>, i: number) => ({
      proposal_id: proposal.id,
      service_catalog_id: item.service_catalog_id || null,
      category: item.category,
      title: item.title,
      description: item.description || null,
      deliverables: item.deliverables || [],
      base_price_cents: item.base_price_cents || 0,
      offered_price_cents: item.offered_price_cents || 0,
      unit_label: item.unit_label || 'video',
      billing_interval: item.billing_interval || 'one_time',
      min_quantity: item.min_quantity ?? 1,
      max_quantity: item.max_quantity ?? 12,
      default_quantity: item.default_quantity ?? 1,
      is_enabled: true,
      display_order: i,
    }));
    const { error: itemsError } = await sb.from('proposal_items').insert(itemRows);
    if (itemsError) console.error('Items insert error:', itemsError);
  }

  // Insert discount rules
  if (discount_rules?.length) {
    const ruleRows = discount_rules.map((rule: Record<string, unknown>, i: number) => ({
      proposal_id: proposal.id,
      label: rule.label,
      kind: rule.kind,
      discount_type: rule.discount_type,
      discount_value: rule.discount_value || 0,
      min_quantity: rule.min_quantity || null,
      applicable_categories: rule.applicable_categories || null,
      is_active: true,
      display_order: i,
    }));
    await sb.from('proposal_discount_rules').insert(ruleRows);
  }

  return NextResponse.json({ id: proposal.id, access_token: proposal.access_token });
}
