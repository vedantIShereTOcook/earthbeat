import React, { useState } from 'react';
import { EXPERIENCES_METADATA } from '../data/experiencesData';
import { Compass, Search, Filter, Play, ExternalLink, ShieldCheck, Waves, Wind, Trees, Zap, Building } from 'lucide-react';

interface ExploreProps {
  onNavigate: (page: string, experienceId?: string) => void;
}

export const Explore: React.FC<ExploreProps> = ({ onNavigate }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const domains = ['All', 'Ocean', 'Atmosphere', 'Biosphere', 'Human Impact'];

  const filtered = EXPERIENCES_METADATA.filter((exp) => {
    const matchesDomain = selectedDomain === 'All' || exp.domain === selectedDomain;
    const matchesSearch = 
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.datasetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.svsId.includes(searchQuery);
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
            <Compass className="w-4 h-4" />
            <span>NASA EARTH INFORMATION CENTER CATALOG</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
            EXPLORE EARTH FREQUENCIES
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Browse verified NASA Earth science visualisations paired with real-time sonifications generated directly from underlying observations and models.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by variable, SVS ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-space-900 border border-cyan-500/30 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-hud"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          DOMAIN:
        </span>
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              selectedDomain === dom
                ? 'bg-cyan-500 text-space-950 font-bold shadow-glow-cyan/50'
                : 'bg-space-900 border border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-400'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Grid of Experiences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((exp) => (
          <div
            key={exp.id}
            className="bg-space-900 border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between shadow-hud group"
          >
            <div>
              {/* Media Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-space-950">
                <img
                  src={exp.mediaUrl}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-0.5 rounded bg-space-950/85 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 uppercase font-semibold">
                    {exp.domain}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                    {exp.status}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between text-[10px] font-mono text-slate-300 bg-space-950/85 backdrop-blur-md px-2.5 py-1 rounded border border-cyan-500/20">
                  <span>NASA SVS #{exp.svsId}</span>
                  <span className="text-cyan-400">{exp.variables[0].name}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-cyan-400/80 font-mono mt-0.5">
                    {exp.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {exp.description}
                </p>

                {/* Variables Pills */}
                <div className="space-y-1.5 pt-2 border-t border-cyan-500/10">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    Verified Variables:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {exp.variables.map((v, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-space-950 border border-cyan-500/20 text-[10px] font-mono text-cyan-300"
                      >
                        {v.name} ({v.unit})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sonification Mapping Summary */}
                <div className="pt-2 border-t border-cyan-500/10 text-xs font-mono text-slate-300">
                  <span className="text-[10px] text-stellar-400 uppercase block mb-1">
                    Acoustic Formula:
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-200 line-clamp-2">
                    {exp.sonificationDesign}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 flex gap-2">
              <button
                onClick={() => {
                  if (exp.id === 'ocean-symphony') onNavigate('ocean-symphony');
                  else onNavigate('experience-detail', exp.id);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-electric-500 text-space-950 font-mono text-xs font-bold hover:brightness-110 transition-all shadow-glow-cyan/20"
              >
                <Play className="w-3.5 h-3.5 fill-space-950" />
                <span>LAUNCH EXPERIENCE</span>
              </button>

              <a
                href={exp.svsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-space-950 border border-cyan-500/30 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
                title="View NASA SVS Reference"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
