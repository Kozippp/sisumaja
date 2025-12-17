import { Mail, MapPin, Instagram, Youtube } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Võta ühendust</h1>
            <p className="text-xl text-gray-400 mb-12">
              Sul on idee? Kirjuta meile ja teeme midagi ägedat koos.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-neutral-900 p-4 rounded-xl mr-6 border border-neutral-800">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Kirjuta meile</h3>
                  <a href="mailto:info@sisumaja.ee" className="text-gray-400 hover:text-white transition-colors">info@sisumaja.ee</a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-neutral-900 p-4 rounded-xl mr-6 border border-neutral-800">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Asukoht</h3>
                  <p className="text-gray-400">Tallinn, Eesti</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-bold text-white mb-4">Jälgi meid</h3>
              <div className="flex gap-4">
                <a href="#" className="bg-neutral-900 p-4 rounded-full text-white hover:bg-primary transition-colors border border-neutral-800">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="bg-neutral-900 p-4 rounded-full text-white hover:bg-primary transition-colors border border-neutral-800">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" className="bg-neutral-900 p-4 rounded-full text-white hover:bg-primary transition-colors border border-neutral-800">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.58-1.09-.65 2.58-.71 5.3-.17 7.92.56 2.73 2.18 5.17 4.5 6.64-1.35 1.05-2.96 1.76-4.66 1.95-2.8.31-5.71-.5-7.9-2.3C6.3 20.37 5.01 17.5 5.5 14.5c.34-2.13 1.39-4.13 2.98-5.71 1.58-1.57 3.75-2.47 5.98-2.5v4.03c-1.39.05-2.73.68-3.64 1.76-.94 1.13-1.39 2.63-1.19 4.1.25 1.83 1.34 3.48 2.96 4.39 1.69.95 3.8.84 5.39-.27.87-.6 1.56-1.45 1.95-2.43.51-1.32.61-2.78.3-4.19H12.52v-13.8z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Sinu nimi</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ees- ja perekonnanimi"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Sinu e-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="nimi@ettevote.ee"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Sõnum</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Kirjelda oma ideed..."
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-fuchsia-700 transition-colors uppercase tracking-wide"
              >
                Saada sõnum
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

