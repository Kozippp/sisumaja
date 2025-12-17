import { Mail, MapPin, Instagram, Youtube, ArrowRight } from 'lucide-react';

export default function ContactPage() {
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
              Sul on idee? Kirjuta meile ja teeme midagi ägedat koos. Oleme avatud koostööpakkumistele ja uutele väljakutsetele.
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
                <SocialButton icon={<Instagram className="w-6 h-6" />} href="#" />
                <SocialButton icon={<Youtube className="w-6 h-6" />} href="#" />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="relative">
            <div className="bg-neutral-900/50 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-8 uppercase">Saada meile kiri</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sinu nimi</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                      placeholder="Ees- ja perekonnanimi"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sinu e-mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                      placeholder="nimi@ettevote.ee"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sõnum</label>
                  <textarea 
                    id="message" 
                    rows={6}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 resize-none"
                    placeholder="Kirjelda oma ideed..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-primary text-white font-bold py-5 rounded-xl hover:bg-fuchsia-600 transition-all uppercase tracking-wide flex items-center justify-center gap-2 group"
                >
                  Saada sõnum <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
    >
      {icon}
    </a>
  );
}
