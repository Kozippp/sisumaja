import React from 'react';
import { Youtube, Tv, Smartphone } from 'lucide-react';

export function YouTubeComparisonTable() {
  return (
    <div className="w-full overflow-x-auto bg-neutral-900/50 rounded-3xl border border-white/10 p-6 backdrop-blur-sm">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Kanal</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Kui palju vaadatakse</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Usaldus</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Kui kaua töötab</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Kuidas vaadatakse</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {/* Row 1: Meie YouTube */}
          <tr className="border-b border-white/5 bg-white/5">
            <td className="py-6 px-4 font-bold text-lg flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500 flex-shrink-0">
                <Youtube className="w-6 h-6" />
              </div>
              <span className="whitespace-nowrap">Meie YouTube</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">95-99%</span>
              <div className="text-xs text-gray-400">Reklaam on osa loost - vaatajad jälgivad tähelepanelikult</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Väga kõrge</span>
              <div className="text-xs text-gray-400">Nagu sõbra soovitus - sisuloojat juba usaldatakse</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Aastad</span>
              <div className="text-xs text-gray-400">Videot vaadatakse ka pärast aastat - sisu ei aegu</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Rahulikult</span>
              <div className="text-xs text-gray-400">51% vaatab telerist, perega koos diivanil</div>
            </td>
          </tr>

          {/* Row 2: TV-reklaam */}
          <tr className="border-b border-white/5">
            <td className="py-6 px-4 font-medium text-gray-300 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 flex-shrink-0">
                <Tv className="w-5 h-5" />
              </div>
              <span className="whitespace-nowrap">TV-reklaamid</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Madal</span>
              <div className="text-xs text-gray-500">Reklaami ajal võetakse telefon kätte või vahetatakse kanalit</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Keskmine</span>
              <div className="text-xs text-gray-500">Tuttav ja ametlik, aga selgelt tavalinen reklaam</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Kampaania ajal</span>
              <div className="text-xs text-gray-500">Töötab ainult siis, kui eetrisse maksad</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Katkendlik</span>
              <div className="text-xs text-gray-500">Segab saate vaatamist - enamasti ignoreeritakse</div>
            </td>
          </tr>

          {/* Row 3: Meta/TikTok reklaamid */}
          <tr>
            <td className="py-6 px-4 font-medium text-gray-300 flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 flex-shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="whitespace-nowrap">Meta/TikTok reklaamid</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Väga madal</span>
              <div className="text-xs text-gray-500">Keritud kohe edasi - keegi ei taha reklaame näha</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Madal</span>
              <div className="text-xs text-gray-500">Tundmatu bränd, mis segab oma voogu</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Mõni päev</span>
              <div className="text-xs text-gray-500">Algoritm matab sisu kiiresti ära</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Kiirelt</span>
              <div className="text-xs text-gray-500">Keritakse voogu, tähelepanu on mujal</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
