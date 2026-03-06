import React from 'react';
import { Youtube, Tv, Smartphone } from 'lucide-react';

export function YouTubeComparisonTable() {
  return (
    <div className="w-full overflow-x-auto bg-neutral-900/50 rounded-3xl border border-white/10 p-6 backdrop-blur-sm">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Platform</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Attention Capture</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Trust Level</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Content Lifespan</th>
            <th className="py-4 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Viewing Context</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {/* Row 1: Our YouTube */}
          <tr className="border-b border-white/5 bg-white/5">
            <td className="py-6 px-4 font-bold text-lg flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500 flex-shrink-0">
                <Youtube className="w-6 h-6" />
              </div>
              <span className="whitespace-nowrap">Our YouTube</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">95-99%</span>
              <div className="text-xs text-gray-400">Host reads blend naturally into content, viewers actively engaged</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Very High</span>
              <div className="text-xs text-gray-400">Personal recommendation from trusted creator</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Years</span>
              <div className="text-xs text-gray-400">Evergreen content, discovered & rewatched long-term</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-green-400 font-bold text-lg block mb-1">Lean-back</span>
              <div className="text-xs text-gray-400">TV/couch viewing (51%), full attention, family watching</div>
            </td>
          </tr>

          {/* Row 2: TV Advertising */}
          <tr className="border-b border-white/5">
            <td className="py-6 px-4 font-medium text-gray-300 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 flex-shrink-0">
                <Tv className="w-5 h-5" />
              </div>
              <span className="whitespace-nowrap">TV Ads</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Low</span>
              <div className="text-xs text-gray-500">People switch to phones during ad breaks, skip channels</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Medium</span>
              <div className="text-xs text-gray-500">Traditional authority, but clearly promotional</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Temporary</span>
              <div className="text-xs text-gray-500">Only visible during active campaign period</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-yellow-500 font-medium text-lg block mb-1">Interrupted</span>
              <div className="text-xs text-gray-500">Breaks desired content, typically ignored</div>
            </td>
          </tr>

          {/* Row 3: Meta/TikTok Ads */}
          <tr>
            <td className="py-6 px-4 font-medium text-gray-300 flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 flex-shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="whitespace-nowrap">Meta/TikTok Ads</span>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Very Low</span>
              <div className="text-xs text-gray-500">Instant skip reflex, scroll-through behavior</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Low</span>
              <div className="text-xs text-gray-500">Foreign content interrupting user's feed</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Days</span>
              <div className="text-xs text-gray-500">Algorithm-dependent, quickly buried in feed</div>
            </td>
            <td className="py-6 px-4">
              <span className="text-red-500 font-medium text-lg block mb-1">Distracted</span>
              <div className="text-xs text-gray-500">Rapid scrolling, minimal engagement time</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
