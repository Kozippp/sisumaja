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

    if (!name || !email || !message) {
      return NextResponse.redirect(
        new URL('/kontakt?error=missing_fields', req.url),
        303
      );
    }

    // Salvestame Supabase'i backupiks
    const { error: dbError } = await supabase.from('contact_messages').insert({
      name,
      email,
      phone,
      message,
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
    }

    // Saadame e-kirja Zoho kaudu
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT
      ? Number(process.env.SMTP_PORT)
      : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'Sisumaja <info@sisumaja.ee>';
    const to = 'info@sisumaja.ee';

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
        'Uus sõnum Sisumaja kontaktivormist:',
        '',
        `Nimi: ${name}`,
        `E-mail: ${email}`,
        `Telefon: ${phone || '—'}`,
        '',
        'Sõnum:',
        message,
      ].join('\n');

      const htmlBody = `
        <h2>Uus sõnum Sisumaja kontaktivormist</h2>
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
      } catch (emailError) {
        console.error('Email send error:', emailError);
        return NextResponse.redirect(
          new URL('/kontakt?error=email_failed', req.url),
          303
        );
      }
    } else {
      console.warn(
        'SMTP env muutujad puuduvad, e-kirja ei saadetud. Lisa SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.'
      );
    }

    return NextResponse.redirect(
      new URL('/kontakt?success=1', req.url),
      303
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.redirect(
      new URL('/kontakt?error=unknown', req.url),
      303
    );
  }
}


