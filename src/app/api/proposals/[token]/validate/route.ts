import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const sb = getSupabaseServer();

  const { data: proposal, error } = await sb
    .from('proposals')
    .select(`
      *,
      proposal_clients (*),
      proposal_items (*),
      proposal_discount_rules (*)
    `)
    .eq('access_token', token)
    .single();

  if (error || !proposal) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (proposal.status === 'revoked') {
    return NextResponse.json({ error: 'revoked' }, { status: 410 });
  }

  if (proposal.expires_at && new Date(proposal.expires_at) < new Date()) {
    return NextResponse.json({ error: 'expired' }, { status: 410 });
  }

  // Track opening
  const now = new Date().toISOString();
  const update: Record<string, string> = { last_opened_at: now };
  if (!proposal.first_opened_at) {
    update.first_opened_at = now;
  }
  if (proposal.status === 'published') {
    update.status = 'opened';
  }
  await sb.from('proposals').update(update).eq('id', proposal.id);

  return NextResponse.json({ proposal });
}
