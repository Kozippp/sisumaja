"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const [currentLocale, setCurrentLocale] = useState('et');

  useEffect(() => {
    const locale = Cookies.get('NEXT_LOCALE') || 'et';
    setCurrentLocale(locale);
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col items-start">
              <Link href="/" className="block mb-6 w-auto max-w-[220px]">
                <Image
                  src="/kozip-logo.png"
                  alt="Kozip logo"
                  width={220}
                  height={90}
                  className="w-full h-auto object-contain"
                />
              </Link>
              <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                {t('description')}
              </p>
              <div className="flex space-x-4">
                <SocialLink href="https://www.youtube.com/@Sisumajatv" icon={Youtube} />
                <SocialLink href="https://www.instagram.com/sisumaja.tv/" icon={Instagram} />
                <SocialLink href="https://www.tiktok.com/@sisumaja.tv" icon={TikTokIcon} />
                <SocialLink href="mailto:info@kozip.ee" icon={Mail} />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">{t('navigation')}</h4>
            <ul className="space-y-4">
              <FooterLink href="/">{tNav('home')}</FooterLink>
              <FooterLink href="/tehtud-tood">{tNav('portfolio')}</FooterLink>
              <FooterLink href="/kontakt">{tNav('contact')}</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">{t('contactTitle')}</h4>
            <ul className="space-y-4 text-gray-400">
              <li>{t('location')}</li>
              <li>
                <a href="mailto:info@kozip.ee" className="hover:text-white transition-colors">
                  info@kozip.ee
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">
          <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
          <LanguageSwitcher currentLocale={currentLocale} variant="footer" />
          <div className="flex space-x-6 flex-wrap justify-end gap-y-2">
            <Link href="/privaatsuspoliitika" className="hover:text-white transition-colors">{t('privacy')}</Link>
            <Link href="/kasutustingimused" className="hover:text-white transition-colors">{t('terms')}</Link>
            <Link href="/kupsiste-poliitika" className="hover:text-white transition-colors">{t('cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  const isMailto = href.startsWith('mailto:');
  return (
    <a 
      href={href}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noopener noreferrer"}
      className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white hover:bg-primary transition-all duration-300 border border-neutral-800"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="/tiktok_logo.png"
      alt="TikTok"
      width={20}
      height={20}
      className="w-5 h-5 object-contain"
    />
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
