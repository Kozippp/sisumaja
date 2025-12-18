import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="block mb-6 w-auto max-w-[220px]">
              <Image
                src="/LOGOTRANSPARENT.png"
                alt="Sisumaja logo"
                width={220}
                height={90}
                className="w-full h-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              Sisumaja pakub uuenduslikku meelelahutust Eesti rahvale ning efektiivset turunduskanalit ettevõtetele, kelle väärtused kattuvad meie omadega.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://www.youtube.com/@Sisumajatv" icon={Youtube} />
              <SocialLink href="https://www.instagram.com/sisumaja.tv/" icon={Instagram} />
              <SocialLink href="https://www.tiktok.com/@sisumaja.tv" icon={TikTokIcon} />
              <SocialLink href="mailto:info@sisumaja.ee" icon={Mail} />
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
              <li>
                <a href="mailto:info@sisumaja.ee" className="hover:text-white transition-colors">
                  info@sisumaja.ee
                </a>
              </li>
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

function SocialLink({ href, icon: Icon }: { href: string; icon: React.ElementType }) {
  return (
    <a 
      href={href}
      className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white hover:bg-primary transition-all duration-300 border border-neutral-800"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8.5c-1.1 0-2.1-.3-3-.8v5.3a4 4 0 1 1-2-3.5v2.2a2 2 0 1 0 1 1.7V4h2a4 4 0 0 0 4 4" />
    </svg>
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
