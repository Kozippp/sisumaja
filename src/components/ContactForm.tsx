'use client';

import { ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

/**
 * Same contact form as on /kontakt page – copy, not a new component.
 * Used on the homepage contact section.
 */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (executeRecaptcha) {
      try {
        const token = await executeRecaptcha('contact');
        formData.set('recaptcha_token', token);
      } catch {
        // reCAPTCHA failed, continue without – server will use other checks
      }
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      form.reset();
    } catch (error: any) {
      console.error('Submission error:', error);
      setStatus('error');

      if (error.message === 'missing_fields') {
        setErrorMessage('Palun veendu, et oled täitnud kõik vajalikud väljad (nimi, e-mail ja sõnum).');
      } else if (error.message === 'email_failed') {
        setErrorMessage('Kahjuks tekkis sõnumi saatmisel tehniline tõrge. Palun proovi hiljem uuesti või kirjuta meile otse aadressil info@kozip.ee.');
      } else {
        setErrorMessage('Midagi läks valesti. Palun proovi uuesti või võta meiega ühendust aadressil info@kozip.ee.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-neutral-900/50 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-4 uppercase">Saada meile kiri</h2>

      {status === 'success' && (
        <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 px-4 py-3 text-sm flex items-start gap-3">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">Sõnum saadetud!</p>
            <p>Aitäh kirja eest! Sinu sõnum jõudis meieni ja vastame Sulle esimesel võimalusel.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">Viga saatmisel</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="home-name" className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sinu nimi</label>
            <input
              type="text"
              id="home-name"
              name="name"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ees- ja perekonnanimi"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="home-email" className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sinu e-mail</label>
            <input
              type="email"
              id="home-email"
              name="email"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="nimi@ettevote.ee"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Honeypot – hidden from users, bots fill it */}
        <div className="absolute -left-[9999px] w-1 h-1 overflow-hidden" aria-hidden="true">
          <label htmlFor="home-website">Website</label>
          <input type="text" id="home-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="space-y-2">
          <label htmlFor="home-phone" className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Sinu telefon <span className="normal-case text-gray-500">(valikuline)</span>
          </label>
          <input
            type="tel"
            id="home-phone"
            name="phone"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="+372 5xxxxx"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="home-message" className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sõnum</label>
          <textarea
            id="home-message"
            name="message"
            rows={6}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Kirjelda oma ideed..."
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={!mounted || isSubmitting}
          className="w-full bg-primary text-white font-bold py-5 rounded-xl hover:bg-fuchsia-600 transition-all uppercase tracking-wide flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saadan...
            </>
          ) : (
            <>
              Saada sõnum <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
