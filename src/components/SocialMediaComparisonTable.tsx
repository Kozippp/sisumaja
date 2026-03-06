import React from 'react';
import { User, Building2, Zap, Users, ShieldCheck, Video } from 'lucide-react';

export function SocialMediaComparisonTable() {
  return (
    <div className="w-full overflow-hidden bg-neutral-900/50 rounded-3xl border border-white/10 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="py-6 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider w-1/4">Omadus</th>
              <th className="py-6 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider w-[37.5%]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  Brändi oma kanal
                </div>
              </th>
              <th className="py-6 px-6 text-sm font-bold text-fuchsia-400 uppercase tracking-wider w-[37.5%]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-fuchsia-500" />
                  Koostöö sisuloojaga
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-white divide-y divide-white/5">
            {/* Row 1: Publik */}
            <tr className="group hover:bg-white/5 transition-colors">
              <td className="py-6 px-6 font-medium text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <span>Publik & Levi</span>
                </div>
              </td>
              <td className="py-6 px-6 text-gray-400">
                Tuleb nullist üles ehitada. <br/>
                <span className="text-sm opacity-70">Võtab kuid või aastaid aega.</span>
              </td>
              <td className="py-6 px-6">
                <span className="text-green-400 font-bold block mb-1">Kohene ligipääs</span>
                <span className="text-sm text-gray-300">Rendi koheselt olemasolev ja lojaalne fännibaas.</span>
              </td>
            </tr>

            {/* Row 2: Usaldus */}
            <tr className="group hover:bg-white/5 transition-colors">
              <td className="py-6 px-6 font-medium text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span>Usaldus</span>
                </div>
              </td>
              <td className="py-6 px-6 text-gray-400">
                Korporatiivne kommunikatsioon. <br/>
                <span className="text-sm opacity-70">Inimesed on brändijutu suhtes skeptilised.</span>
              </td>
              <td className="py-6 px-6">
                <span className="text-green-400 font-bold block mb-1">Sõbra soovitus</span>
                <span className="text-sm text-gray-300">94% Gen Z usaldab loojat rohkem kui brändi ennast.</span>
              </td>
            </tr>

            {/* Row 3: Tootmine */}
            <tr className="group hover:bg-white/5 transition-colors">
              <td className="py-6 px-6 font-medium text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                    <Video className="w-5 h-5" />
                  </div>
                  <span>Tootmine</span>
                </div>
              </td>
              <td className="py-6 px-6 text-gray-400">
                Vajab tiimi või agentuuri. <br/>
                <span className="text-sm opacity-70">Kulukas ja ajamahukas protsess.</span>
              </td>
              <td className="py-6 px-6">
                <span className="text-green-400 font-bold block mb-1">"Kõik-ühes" lahendus</span>
                <span className="text-sm text-gray-300">Oleme korraga stsenarist, operaator ja monteerija.</span>
              </td>
            </tr>

            {/* Row 4: Tulemused */}
            <tr className="group hover:bg-white/5 transition-colors">
              <td className="py-6 px-6 font-medium text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span>Tulemused (ROI)</span>
                </div>
              </td>
              <td className="py-6 px-6 text-gray-400">
                Tavapärane ettevõtte tase. <br/>
                <span className="text-sm opacity-70">Reach on sageli piiratud.</span>
              </td>
              <td className="py-6 px-6">
                <span className="text-green-400 font-bold block mb-1">3-5x kõrgem kaasatus</span>
                <span className="text-sm text-gray-300">Kindel tulemus, sest tunneme oma publikut.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
