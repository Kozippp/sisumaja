import React from 'react';
import { Youtube, Tv, Smartphone } from 'lucide-react';

export function YouTubeComparisonTable() {
  return (
    <div className="w-full overflow-x-auto bg-neutral-900/50 rounded-3xl border border-white/10 p-6 backdrop-blur-sm">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Kanal</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Usaldus</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Tähelepanu</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Pikaajalisus</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {/* Row 1: Meie YouTube */}
          <tr className="border-b border-white/5 bg-white/5">
            <td className="py-6 px-4 font-bold text-lg flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500 flex-shrink-0">
                <Youtube className="w-6 h-6" />
              </div>
              <span className="whitespace-nowrap">Kozipi YT reklaam</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Väga kõrge</span>
              <div className="text-xs text-gray-400">Vaataja usaldab sisuloojat kui "sõpra". Soovitus on autentne.</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Väga kõrge</span>
              <div className="text-xs text-gray-400">Reklaam on osa sisust. Seega 95-99% vaatavad reklaami täielikult läbi</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Aastad</span>
              <div className="text-xs text-gray-400">Video jääb YouTube'i ja kogub vaatamisi ka aastaid hiljem.</div>
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
              <span className="text-yellow-500 font-medium text-lg block mb-1">Standardne</span>
              <div className="text-xs text-gray-500">Ametlik, kuid vaataja on harjunud seda ignoreerima kui "tavalist müügimüra"</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Väga madal</span>
              <div className="text-xs text-gray-500">Pausi ajal minnakst kööki, vahetatakse kanalit või haaratakse telefon.</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Kampaania ajal</span>
              <div className="text-xs text-gray-500">Saad nähtavust vaid seni kuni maksad eetriaja eest</div>
            </td>
          </tr>

          {/* Row 3: Meta/TikTok reklaamid */}
          <tr>
            <td className="py-6 px-4 font-medium text-gray-300 flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 flex-shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="whitespace-nowrap">Meta reklaamid</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Keskmine</span>
              <div className="text-xs text-gray-500">Bränd räägib iseendast kui hea ta on</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Madal</span>
              <div className="text-xs text-gray-500">Enamus inimesi scrollivad reklaamist sekundiga mööda</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Ajutine</span>
              <div className="text-xs text-gray-500">Reklaam kaob uudisvoost niipea, kui kampaania eelarve lõppeb.</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
