'use client';

import { Mail, MapPin, Instagram, Youtube, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

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
        setErrorMessage('Palun täida vähemalt nimi, e-mail ja sõnum.');
      } else if (error.message === 'email_failed') {
        setErrorMessage('Sõnum salvestus, kuid e-kirja saatmine ebaõnnestus. Proovi hiljem uuesti või kirjuta otse info@sisumaja.ee.');
      } else {
        setErrorMessage('Midagi läks valesti. Proovi palun uuesti või kirjuta otse info@sisumaja.ee.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] -z-10" />
       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-none">
              Võta <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600">ühendust</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-lg">
              Sul on idee koostööks? Kirjuta meile ja kui teie Bränd Sisumaja väärtustega klapib, siis ehk saame midagi väga vinget ellu viia!
            </p>

            <div className="space-y-8 mb-16">
              <div className="flex items-center group">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mr-6 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                  <Mail className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Kirjuta meile</h3>
                  <a href="mailto:info@sisumaja.ee" className="text-gray-400 hover:text-white transition-colors text-lg">info@sisumaja.ee</a>
                </div>
              </div>

              <div className="flex items-center group">
                 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mr-6 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                  <MapPin className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Asukoht</h3>
                  <p className="text-gray-400 text-lg">Tallinn, Eesti</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Jälgi meid</h3>
              <div className="flex gap-4">
                <SocialButton icon={<Instagram className="w-6 h-6" />} href="https://www.instagram.com/sisumaja.tv/" />
                <SocialButton icon={<Youtube className="w-6 h-6" />} href="https://www.youtube.com/@Sisumajatv" />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="relative">
            <div className="bg-neutral-900/50 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase">Saada meile kiri</h2>

              {status === 'success' && (
                <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 px-4 py-3 text-sm flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Sõnum saadetud!</p>
                    <p>Täname kirjast. Sõnum on edukalt meieni jõudnud ja vastame sulle peagi.</p>
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

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sinu nimi</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Ees- ja perekonnanimi"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sinu e-mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="nimi@ettevote.ee"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Sinu telefon <span className="normal-case text-gray-500">(valikuline)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="+372 5xxxxx"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sõnum</label>
                  <textarea 
                    id="message" 
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
                  disabled={isSubmitting}
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
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href} 
      className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all duration-300 border border-white/10 hover:scale-110"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}
