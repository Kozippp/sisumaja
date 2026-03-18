'use client';

import React from 'react';
import { Youtube, Tv, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function YouTubeComparisonTable() {
  const t = useTranslations('youtubeComparison');
  
  return (
    <div className="w-full overflow-x-auto bg-neutral-900/50 rounded-3xl border border-white/10 p-6 backdrop-blur-sm">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">{t('channel')}</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">{t('trust')}</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">{t('attention')}</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">{t('longevity')}</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {/* Row 1: Meie YouTube */}
          <tr className="border-b border-white/5 bg-white/5">
            <td className="py-6 px-4 font-bold text-lg flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500 flex-shrink-0">
                <Youtube className="w-6 h-6" />
              </div>
              <span className="whitespace-nowrap">{t('kozipYT')}</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">{t('veryHigh')}</span>
              <div className="text-xs text-gray-400">{t('veryHighTrust')}</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">{t('veryHigh')}</span>
              <div className="text-xs text-gray-400">{t('veryHighAttention')}</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">{t('years')}</span>
              <div className="text-xs text-gray-400">{t('yearsDesc')}</div>
            </td>
          </tr>

          {/* Row 2: TV-reklaam */}
          <tr className="border-b border-white/5">
            <td className="py-6 px-4 font-medium text-gray-300 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 flex-shrink-0">
                <Tv className="w-5 h-5" />
              </div>
              <span className="whitespace-nowrap">{t('tvAds')}</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">{t('standard')}</span>
              <div className="text-xs text-gray-500">{t('standardDesc')}</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">{t('veryLow')}</span>
              <div className="text-xs text-gray-500">{t('veryLowDesc')}</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">{t('campaignTime')}</span>
              <div className="text-xs text-gray-500">{t('campaignTimeDesc')}</div>
            </td>
          </tr>

          {/* Row 3: Meta/TikTok reklaamid */}
          <tr>
            <td className="py-6 px-4 font-medium text-gray-300 flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 flex-shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="whitespace-nowrap">{t('metaAds')}</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">{t('medium')}</span>
              <div className="text-xs text-gray-500">{t('mediumDesc')}</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">{t('low')}</span>
              <div className="text-xs text-gray-500">{t('lowDesc')}</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">{t('temporary')}</span>
              <div className="text-xs text-gray-500">{t('temporaryDesc')}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
