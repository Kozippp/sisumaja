import React from 'react';
import { Youtube, Tv, Smartphone } from 'lucide-react';

export function YouTubeComparisonTable() {
  return (
    <div className="w-full overflow-x-auto bg-neutral-900/50 rounded-3xl border border-white/10 p-6 backdrop-blur-sm">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Platvorm</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Tähelepanu haaratus</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Usaldusväärsus</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Sisu eluiga</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Vaatamiskontekst</th>
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
              <div className="text-xs text-gray-400">Saatejuhi lugemine segunevad loomulikus sisu, vaatajad aktiivselt kaasatud</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Väga kõrge</span>
              <div className="text-xs text-gray-400">Isiklik soovitus usaldusväärselt sisuloojalt</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Aastad</span>
              <div className="text-xs text-gray-400">Aegumatu sisu, avastatakse ja vaadatakse pikalt</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Tagasitõmmutud</span>
              <div className="text-xs text-gray-400">TV/diivanilt vaatamine (51%), täielik tähelepanu, perega koos</div>
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
              <div className="text-xs text-gray-500">Inimesed haaravad reklaamipausi ajal telefoni, vahetavad kanaleid</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Keskmine</span>
              <div className="text-xs text-gray-500">Traditsiooniline autoriteet, kuid selgelt reklaamiiv</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Ajutine</span>
              <div className="text-xs text-gray-500">Nähtav ainult aktiivselt kampaania ajal</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Katkestatud</span>
              <div className="text-xs text-gray-500">Katkestab soovitud sisu, tavaliselt ignoreeritud</div>
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
              <div className="text-xs text-gray-500">Kiire vahetamise refleks, keritud ära käitumisviis</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Madal</span>
              <div className="text-xs text-gray-500">Võõras sisu, mis katkestab kasutaja voogu</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Päevad</span>
              <div className="text-xs text-gray-500">Algoritmi sõltuv, kiiresti voo alla mattunud</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Hajutatud</span>
              <div className="text-xs text-gray-500">Kiire kerimine, minimaalne kaasatusaeg</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
