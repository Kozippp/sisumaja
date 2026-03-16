'use client';

import { useTransition, useState, useEffect } from 'react';
import { setLocale } from '@/actions/locale';
import { useRouter } from 'next/navigation';
import { Globe, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

interface LanguageSwitcherProps {
  currentLocale: string;
  variant?: 'navbar' | 'footer';
  onLocaleChange?: (locale: string) => void;
}

export function LanguageSwitcher({ currentLocale: initialLocale, variant = 'navbar', onLocaleChange }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLocale, setOptimisticLocale] = useState(initialLocale);
  const router = useRouter();

  useEffect(() => {
    setOptimisticLocale(initialLocale);
  }, [initialLocale]);

  const handleLanguageChange = (locale: string) => {
    if (locale === optimisticLocale || isPending) return;
    
    setOptimisticLocale(locale);
    
    if (onLocaleChange) {
      onLocaleChange(locale);
    }
    
    startTransition(async () => {
      try {
        await setLocale(locale);
        Cookies.set('NEXT_LOCALE', locale, { path: '/', expires: 365 });
        router.refresh();
      } catch (error) {
        console.error('Language change failed:', error);
        setOptimisticLocale(initialLocale);
      }
    });
  };

  if (variant === 'footer') {
    return (
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-gray-400" />
        <div className="flex gap-2 relative">
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded z-10">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          )}
          <button
            onClick={() => handleLanguageChange('et')}
            disabled={isPending}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              optimisticLocale === 'et'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            EST
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            disabled={isPending}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              optimisticLocale === 'en'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ENG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 relative">
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full z-10">
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        </div>
      )}
      <button
        onClick={() => handleLanguageChange('et')}
        disabled={isPending}
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
          optimisticLocale === 'et'
            ? 'bg-white/10 text-white border border-white/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        EST
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isPending}
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
          optimisticLocale === 'en'
            ? 'bg-white/10 text-white border border-white/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        ENG
      </button>
    </div>
  );
}
