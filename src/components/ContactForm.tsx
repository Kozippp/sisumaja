'use client';

import { ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslations } from 'next-intl';

/**
 * Same contact form as on /kontakt page – copy, not a new component.
 * Used on the homepage contact section.
 */
export function ContactForm() {
  const t = useTranslations('contactPage');
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
        // reCAPTCHA failed, continue without
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
        setErrorMessage(t('errorMissingFields'));
      } else if (error.message === 'email_failed') {
        setErrorMessage(t('errorEmailFailed'));
      } else {
        setErrorMessage(t('errorGeneric'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-neutral-900/50 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-4 uppercase">{t('sendMessage')}</h2>

      {status === 'success' && (
        <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 px-4 py-3 text-sm flex items-start gap-3">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">{t('messageSent')}</p>
            <p>{t('messageSentDesc')}</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">{t('sendError')}</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="home-name" className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t('yourName')}</label>
            <input
              type="text"
              id="home-name"
              name="name"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={t('namePlaceholder')}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="home-email" className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t('yourEmail')}</label>
            <input
              type="email"
              id="home-email"
              name="email"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={t('emailPlaceholder')}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Honeypot */}
        <div className="absolute -left-[9999px] w-1 h-1 overflow-hidden" aria-hidden="true">
          <label htmlFor="home-website">Website</label>
          <input type="text" id="home-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="space-y-2">
          <label htmlFor="home-phone" className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {t('yourPhone')} <span className="normal-case text-gray-500">{t('optional')}</span>
          </label>
          <input
            type="tel"
            id="home-phone"
            name="phone"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={t('phonePlaceholder')}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="home-message" className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t('message')}</label>
          <textarea
            id="home-message"
            name="message"
            rows={6}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={t('messagePlaceholder')}
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
              {t('sending')}
            </>
          ) : (
            <>
              {t('sendButton')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
