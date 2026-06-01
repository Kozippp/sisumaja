import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const sb = getSupabaseServer();
  const { data, error } = await sb
    .from('proposals')
    .select(`*, proposal_clients(*), proposal_items(*), proposal_discount_rules(*), proposal_submissions(*)`)
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ proposal: data });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const sb = getSupabaseServer();
  const body = await req.json();

  const { items, discount_rules, publish, revoke, ...proposalFields } = body;

  // Update proposal fields
  const updateData: Record<string, unknown> = { ...proposalFields, updated_at: new Date().toISOString() };
  if (publish) {
    updateData.status = 'published';
    updateData.published_at = new Date().toISOString();
  }
  if (revoke) {
    updateData.status = 'revoked';
  }

  const { error: updateError } = await sb.from('proposals').update(updateData).eq('id', id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  // Replace items if provided
  if (items !== undefined) {
    await sb.from('proposal_items').delete().eq('proposal_id', id);
    if (items.length > 0) {
      const itemRows = items.map((item: Record<string, unknown>, i: number) => ({
        proposal_id: id,
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
      await sb.from('proposal_items').insert(itemRows);
    }
  }

  // Replace discount rules if provided
  if (discount_rules !== undefined) {
    await sb.from('proposal_discount_rules').delete().eq('proposal_id', id);
    if (discount_rules.length > 0) {
      const ruleRows = discount_rules.map((rule: Record<string, unknown>, i: number) => ({
        proposal_id: id,
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
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const sb = getSupabaseServer();
  const { error } = await sb.from('proposals').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
