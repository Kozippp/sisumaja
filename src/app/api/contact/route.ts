import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';
import { getTranslations } from 'next-intl/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim() || null;
    const message = (formData.get('message') || '').toString().trim();
    const honeypot = (formData.get('website') || '').toString().trim();

    // Get locale from cookie
    const locale = req.cookies.get('NEXT_LOCALE')?.value || 'et';
    const t = await getTranslations({ locale, namespace: 'email' });

    // Honeypot: bots fill hidden fields, humans don't
    if (honeypot) {
      return NextResponse.json({ success: true }); // Pretend success to not alert bots
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'missing_fields', message: 'Please fill in at least name, email and message.' },
        { status: 400 }
      );
    }

    // Spam heuristic: random-looking strings (e.g. jPhyNzRdjbwpibOjKA)
    const looksLikeRandomString = (s: string) =>
      s.length >= 15 && !/\s/.test(s) && /^[a-zA-Z0-9]+$/.test(s);
    if (looksLikeRandomString(name) || looksLikeRandomString(message)) {
      return NextResponse.json({ success: true }); // Pretend success
    }

    // reCAPTCHA v3 verification (optional – only when keys are set)
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaToken = (formData.get('recaptcha_token') || '').toString();
    if (recaptchaSecret && recaptchaToken) {
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
      });
      const verify = await verifyRes.json();
      if (!verify.success || (verify.score !== undefined && verify.score < 0.5)) {
        return NextResponse.json({ success: true }); // Pretend success
      }
    }

    // Save to Supabase as backup
    const { error: dbError } = await (supabase as any)
      .from('contact_messages')
      .insert({
        name,
        email,
        phone,
        message,
      });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      // We don't break here if only database save fails, we still try to send the email
    }

    // Send email via Zoho
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT
      ? Number(process.env.SMTP_PORT)
      : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'Kozip <info@kozip.ee>';
    // Recipient address – use CONTACT_EMAIL_TO (e.g. in Vercel), default info@kozip.ee
    const to = (process.env.CONTACT_EMAIL_TO || 'info@kozip.ee').trim();

    if (host && port && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // Zoho: typically 465 (SSL) or 587 (STARTTLS)
        auth: {
          user,
          pass,
        },
      });

      const subject = t('newContactSubject', { name });

      const textBody = [
        t('newContactTitle'),
        '',
        `${t('nameLabel')}: ${name}`,
        `${t('emailLabel')}: ${email}`,
        `${t('phoneLabel')}: ${phone || '—'}`,
        '',
        `${t('messageLabel')}:`,
        message,
      ].join('\n');

      const htmlBody = `
        <h2>${t('newContactTitle')}</h2>
        <p><strong>${t('nameLabel')}:</strong> ${name}</p>
        <p><strong>${t('emailLabel')}:</strong> ${email}</p>
        <p><strong>${t('phoneLabel')}:</strong> ${phone || '—'}</p>
        <p><strong>${t('messageLabel')}:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `;

      try {
        await transporter.sendMail({
          from,
          to,
          replyTo: email,
          subject,
          text: textBody,
          html: htmlBody,
        });

        // Confirmation email to sender: your message reached us
        const confirmSubject = t('confirmSubject');
        const confirmText = [
          t('confirmGreeting', { name }),
          '',
          t('confirmThankYou'),
          t('confirmReceived'),
          '',
          t('confirmSignature'),
          t('confirmTeam'),
        ].join('\n');
        const confirmHtml = `
          <p>${t('confirmGreeting', { name })}</p>
          <p>${t('confirmThankYou')} ${t('confirmReceived')}</p>
          <p>${t('confirmSignature')}<br /><strong>${t('confirmTeam')}</strong></p>
        `;
        await transporter.sendMail({
          from,
          to: email,
          replyTo: 'info@kozip.ee',
          subject: confirmSubject,
          text: confirmText,
          html: confirmHtml,
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
        return NextResponse.json(
          { error: 'email_failed', message: 'Failed to send message.' },
          { status: 500 }
        );
      }
    } else {
      console.warn(
        'SMTP env variables missing, email not sent. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.'
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'unknown', message: 'An unknown error occurred.' },
      { status: 500 }
    );
  }
}
