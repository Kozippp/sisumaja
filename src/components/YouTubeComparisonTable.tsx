import React from 'react';
import { Youtube, Tv, Smartphone, Check, X, Minus } from 'lucide-react';

export function YouTubeComparisonTable() {
  return (
    <div className="w-full overflow-x-auto bg-neutral-900/50 rounded-3xl border border-white/10 p-6 backdrop-blur-sm">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider w-1/4">Kanal</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider w-1/4">Tähelepanu haaratus</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider w-1/4">Usaldusväärsus</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider w-1/4">Kestvus</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {/* Row 1: Meie YouTube */}
          <tr className="border-b border-white/5 bg-white/5">
            <td className="py-6 px-4 font-bold text-lg flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                <Youtube className="w-6 h-6" />
              </div>
              Meie YouTube
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg">95-99%</span>
              <div className="text-xs text-gray-400 mt-1">(Host-read)</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg">Kõrge</span>
              <div className="text-xs text-gray-400 mt-1">(Sõbra soovitus)</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg">Aastaid</span>
              <div className="text-xs text-gray-400 mt-1">(Evergreen)</div>
            </td>
          </tr>

          {/* Row 2: TV-reklaam */}
          <tr className="border-b border-white/5">
            <td className="py-6 px-4 font-medium text-gray-300 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Tv className="w-5 h-5" />
              </div>
              TV-reklaam
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium">Madal</span>
              <div className="text-xs text-gray-500 mt-1">(Telefonis olemine)</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium">Keskmine</span>
              <div className="text-xs text-gray-500 mt-1">(Autoriteetne)</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium">Hetkeline</span>
            </td>
          </tr>

          {/* Row 3: Meta/TikTok Ads */}
          <tr>
            <td className="py-6 px-4 font-medium text-gray-300 flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Smartphone className="w-5 h-5" />
              </div>
              Meta/TikTok Ads
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium">Madal</span>
              <div className="text-xs text-gray-500 mt-1">(Kiire skippimine)</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium">Madal</span>
              <div className="text-xs text-gray-500 mt-1">(Võõras sisu)</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium">Hetkeline</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
