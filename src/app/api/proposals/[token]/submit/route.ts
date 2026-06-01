import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import nodemailer from 'nodemailer';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const sb = getSupabaseServer();

  const body = await req.json();
  const { kind, contact_name, contact_email, contact_phone, company_name, message, selected_items, totals } = body;

  if (!kind || !['invoice_request', 'custom_offer', 'call_request'].includes(kind)) {
    return NextResponse.json({ error: 'invalid_kind' }, { status: 400 });
  }

  // Validate proposal
  const { data: proposal, error } = await sb
    .from('proposals')
    .select('id, title, status, expires_at, proposal_clients(*)')
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

  // Save submission
  const { error: insertError } = await sb.from('proposal_submissions').insert({
    proposal_id: proposal.id,
    kind,
    contact_name: contact_name || null,
    contact_email: contact_email || null,
    contact_phone: contact_phone || null,
    company_name: company_name || null,
    message: message || null,
    selected_items_snapshot: selected_items || [],
    totals_snapshot: totals || {},
  });

  if (insertError) {
    console.error('Submission insert error:', insertError);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  // Update proposal status if invoice requested
  if (kind === 'invoice_request') {
    await sb.from('proposals').update({ status: 'invoice_requested' }).eq('id', proposal.id);
  }

  // Send email notification
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'Kozip <info@kozip.ee>';
  const to = (process.env.CONTACT_EMAIL_TO || 'info@kozip.ee').trim();

  const kindLabel = kind === 'invoice_request' ? 'Arvepäring' : kind === 'custom_offer' ? 'Custom soov' : 'Kõne broneering';
  const clientName = (proposal.proposal_clients as { company_name?: string } | null)?.company_name || 'Tundmatu';

  if (host && port && user && pass) {
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    const selectedSummary = Array.isArray(selected_items)
      ? selected_items.map((i: { title: string; quantity: number; subtotal_cents: number }) =>
          `• ${i.title} × ${i.quantity} — ${(i.subtotal_cents / 100).toFixed(2)} €`
        ).join('\n')
      : '';
    const totalStr = totals?.total_cents ? `${(totals.total_cents / 100).toFixed(2)} €` : '—';

    try {
      await transporter.sendMail({
        from,
        to,
        replyTo: contact_email || undefined,
        subject: `[Kozip] ${kindLabel} – ${proposal.title} (${clientName})`,
        text: [
          `Uus ${kindLabel.toLowerCase()} hinnapakkumisele "${proposal.title}"`,
          '',
          `Klient: ${clientName}`,
          contact_name ? `Kontakt: ${contact_name}` : '',
          contact_email ? `E-post: ${contact_email}` : '',
          contact_phone ? `Telefon: ${contact_phone}` : '',
          company_name ? `Ettevõte: ${company_name}` : '',
          message ? `\nSõnum:\n${message}` : '',
          selectedSummary ? `\nValitud teenused:\n${selectedSummary}` : '',
          `\nKogu: ${totalStr}`,
        ].filter(Boolean).join('\n'),
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }
  }

  return NextResponse.json({ success: true });
}
