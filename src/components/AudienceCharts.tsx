"use client";

/**
 * Vaatajaskonna vanuse- ja soojaotus platvormide kaupa (/kellele_sobime leht).
 * Andmed: YouTube Studio / TikTok Analytics / Instagram Insights, juuli 2026.
 * Uuenda numbreid siin, kui analüütika oluliselt muutub.
 */

import { useState } from "react";
import { Youtube, Clapperboard, Instagram, Tv } from "lucide-react";

type PlatformId = "youtube" | "tiktok" | "instagram";

type PlatformData = {
  id: PlatformId;
  name: string;
  icon: React.ElementType;
  age: [string, number][];
  gender: { female: number; male: number; other?: number };
};

const PLATFORMS: PlatformData[] = [
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    age: [
      ["13–17", 22.7],
      ["18–24", 7.9],
      ["25–34", 22.0],
      ["35–44", 33.7],
      ["45–54", 9.8],
      ["55–64", 2.0],
      ["65+", 1.9],
    ],
    gender: { female: 55.8, male: 44.1 },
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Clapperboard,
    age: [
      ["18–24", 40.7],
      ["25–34", 38.6],
      ["35–44", 14.5],
      ["45–54", 3.6],
      ["55+", 2.6],
    ],
    gender: { female: 63, male: 29, other: 8 },
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    age: [
      ["13–17", 13.0],
      ["18–24", 37.3],
      ["25–34", 32.7],
      ["35–44", 11.5],
      ["45–54", 4.1],
      ["55–64", 1.1],
      ["65+", 0.4],
    ],
    gender: { female: 67.3, male: 32.7 },
  },
];

type Props = {
  tvNote: string;
  disclaimer: string;
  genderLabels: { female: string; male: string; other: string };
};

export default function AudienceCharts({ tvNote, disclaimer, genderLabels }: Props) {
  const [active, setActive] = useState<PlatformId>("youtube");
  const platform = PLATFORMS.find((p) => p.id === active)!;
  const maxAge = Math.max(...platform.age.map(([, v]) => v));

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 md:p-10">
      {/* Platform tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PLATFORMS.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
              active === id
                ? "bg-primary text-white border-primary"
                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            {name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
        {/* Age bars */}
        <div className="space-y-3">
          {platform.age.map(([range, pct]) => (
            <div key={range} className="flex items-center gap-4">
              <span className="w-14 flex-shrink-0 text-sm font-mono text-gray-500">
                {range}
              </span>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(pct / maxAge) * 100}%` }}
                />
              </div>
              <span className="w-14 flex-shrink-0 text-right text-sm font-bold text-white">
                {pct.toFixed(1).replace(/\.0$/, "")}%
              </span>
            </div>
          ))}
        </div>

        {/* Gender + note */}
        <div className="flex flex-col justify-between gap-6">
          <div>
            <div className="flex h-3 rounded-full overflow-hidden bg-white/5 mb-3">
              <div
                className="bg-primary"
                style={{ width: `${platform.gender.female}%` }}
              />
              <div
                className="bg-primary/40"
                style={{ width: `${platform.gender.male}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-2 text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                {genderLabels.female} {platform.gender.female}%
              </span>
              <span className="inline-flex items-center gap-2 text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                {genderLabels.male} {platform.gender.male}%
              </span>
              {platform.gender.other ? (
                <span className="text-gray-500">
                  {genderLabels.other} {platform.gender.other}%
                </span>
              ) : null}
            </div>
          </div>

          {active === "youtube" && (
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
              <Tv className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300 leading-relaxed">{tvNote}</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed mt-8">{disclaimer}</p>
    </div>
  );
}
