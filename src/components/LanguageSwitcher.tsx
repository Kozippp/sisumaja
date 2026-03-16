'use client';

import { useTransition } from 'react';
import { setLocale } from '@/actions/locale';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLocale: string;
  variant?: 'navbar' | 'footer';
}

export function LanguageSwitcher({ currentLocale, variant = 'navbar' }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLanguageChange = (locale: string) => {
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  };

  if (variant === 'footer') {
    return (
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-gray-400" />
        <div className="flex gap-2">
          <button
            onClick={() => handleLanguageChange('et')}
            disabled={isPending || currentLocale === 'et'}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              currentLocale === 'et'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            EST
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            disabled={isPending || currentLocale === 'en'}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              currentLocale === 'en'
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
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLanguageChange('et')}
        disabled={isPending || currentLocale === 'et'}
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
          currentLocale === 'et'
            ? 'bg-white/10 text-white border border-white/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        EST
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isPending || currentLocale === 'en'}
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
          currentLocale === 'en'
            ? 'bg-white/10 text-white border border-white/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        ENG
      </button>
    </div>
  );
}
