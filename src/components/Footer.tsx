import Link from 'next/link';
import { Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-bold uppercase tracking-widest text-white block mb-6">
              Sisumaja<span className="text-primary">.</span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              Sisumaja pakub uuenduslikku meelelahutust Eesti rahvale ning efektiivset turunduskanalit ettevõtetele, kelle väärtused kattuvad meie omadega.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://www.youtube.com/@Sisumajatv" icon={<Youtube />} />
              <SocialLink href="https://www.instagram.com/sisumaja.tv/" icon={<Instagram />} />
              <SocialLink href="https://www.tiktok.com/@sisumaja.tv" icon={<span className="text-xs font-semibold">TT</span>} />
              <SocialLink href="mailto:info@sisumaja.ee" icon={<Mail />} />
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Navigatsioon</h4>
            <ul className="space-y-4">
              <FooterLink href="/">Avaleht</FooterLink>
              <FooterLink href="/tehtud-tood">Tehtud tööd</FooterLink>
              <FooterLink href="/kontakt">Kontakt</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Kontakt</h4>
            <ul className="space-y-4 text-gray-400">
              <li>Tallinn, Eesti</li>
              <li>info@sisumaja.ee</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Sisumaja. Kõik õigused kaitstud.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privaatsuspoliitika</Link>
            <Link href="#" className="hover:text-white transition-colors">Kasutustingimused</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href}
      className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white hover:bg-primary transition-all duration-300 border border-neutral-800"
    >
      <div className="w-5 h-5">{icon}</div>
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">
        {children}
      </Link>
    </li>
  );
}
