import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim() || null;
    const message = (formData.get('message') || '').toString().trim();
    const honeypot = (formData.get('website') || '').toString().trim();

    // Honeypot: bots fill hidden fields, humans don't
    if (honeypot) {
      return NextResponse.json({ success: true }); // Pretend success to not alert bots
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'missing_fields', message: 'Palun täida vähemalt nimi, e-mail ja sõnum.' },
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

    // Salvestame Supabase'i backupiks
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
      // Me ei katkesta siin, kui ainult andmebaasi salvestamine ebaõnnestub, proovime ikka e-kirja saata
    }

    // Saadame e-kirja Zoho kaudu
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT
      ? Number(process.env.SMTP_PORT)
      : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'Kozip <info@kozip.ee>';
    // Saaja aadress – kasuta CONTACT_EMAIL_TO (nt Vercelis), vaikimisi info@kozip.ee
    const to = (process.env.CONTACT_EMAIL_TO || 'info@kozip.ee').trim();

    if (host && port && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // Zoho: tavaliselt 465 (SSL) või 587 (STARTTLS)
        auth: {
          user,
          pass,
        },
      });

      const subject = `Uus kontaktivormi sõnum - ${name}`;

      const textBody = [
        'Uus sõnum Kozip kontaktivormist:',
        '',
        `Nimi: ${name}`,
        `E-mail: ${email}`,
        `Telefon: ${phone || '—'}`,
        '',
        'Sõnum:',
        message,
      ].join('\n');

      const htmlBody = `
        <h2>Uus sõnum Kozip kontaktivormist</h2>
        <p><strong>Nimi:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || '—'}</p>
        <p><strong>Sõnum:</strong></p>
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

        // Kinnitus kirjutajale: sinu kiri jõudis meieni
        const confirmSubject = 'Kozip – Sinu sõnum jõudis meieni';
        const confirmText = [
          `Tere ${name},`,
          '',
          'Täname Sind, et võtsid meiega ühendust!',
          'Sinu sõnum on meieni jõudnud ja vastame Sulle esimesel võimalusel.',
          '',
          'Parimate soovidega,',
          'Kozip meeskond',
        ].join('\n');
        const confirmHtml = `
          <p>Tere ${name},</p>
          <p>Täname Sind, et võtsid meiega ühendust! Sinu sõnum on meieni jõudnud ja vastame Sulle esimesel võimalusel.</p>
          <p>Parimate soovidega,<br /><strong>Kozip meeskond</strong></p>
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
          { error: 'email_failed', message: 'Sõnumi saatmine ebaõnnestus.' },
          { status: 500 }
        );
      }
    } else {
      console.warn(
        'SMTP env muutujad puuduvad, e-kirja ei saadetud. Lisa SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.'
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'unknown', message: 'Tekkis tundmatu viga.' },
      { status: 500 }
    );
  }
}
