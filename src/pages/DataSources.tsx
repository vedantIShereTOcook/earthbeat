import React from 'react';
import { EXPERIENCES_METADATA } from '../data/experiencesData';
import { Database, ExternalLink, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

export const DataSources: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title */}
      <div className="pb-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
          <Database className="w-4 h-4" />
          <span>Scientific Data Provenance & Citations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
          DATA SOURCES & INTEGRITY
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mt-1">
          Complete documentation of official NASA Earth Information Center (EIC), Scientific Visualization Studio (SVS), and Earthdata Distributed Active Archive Centers (DAACs) powering EARTHBEAT.
        </p>
      </div>

      {/* NASA Data Integrity Principles Card */}
      <div className="p-6 rounded-2xl bg-space-900 border border-cyan-500/30 font-mono text-xs shadow-hud space-y-3">
        <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>NASA Challenge Data Integrity Principles</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 pt-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span><strong>Preserved Units:</strong> All scientific variables preserve original peer-reviewed units (m/s, °C, nW/(cm²·sr), μJ/(m²·sr), ppm, AOD, meters).</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span><strong>No Synthetic Disguise:</strong> We never claim artificial or random noise is NASA data. When custom user data is uploaded, it is clearly labelled.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span><strong>Working Manual Workflows:</strong> If direct API streaming is offline, a full client-side CSV/JSON importer is provided.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span><strong>Official Catalogs:</strong> All visual assets match exact NASA SVS identifiers (SVS #3912, #5276, #5011, #12772, #5196, #13904, #4884).</span>
          </div>
        </div>
      </div>

      {/* Provenance Directory Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-cyan-400" />
          Verified NASA Resources Directory
        </h2>

        <div className="grid grid-cols-1 gap-4 font-mono text-xs">
          {EXPERIENCES_METADATA.map((exp) => (
            <div
              key={exp.id}
              className="bg-space-900 border border-cyan-500/20 rounded-2xl p-5 shadow-hud hover:border-cyan-400/40 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-cyan-500/10">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-bold uppercase text-[10px]">
                    {exp.domain}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {exp.title}
                  </h3>
                  <span className="text-slate-400 text-xs hidden sm:inline">
                    (NASA SVS #{exp.svsId})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={exp.svsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-300 hover:underline"
                  >
                    <span>SVS Catalog</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={exp.earthdataUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-electric-300 hover:underline"
                  >
                    <span>Earthdata DAAC</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Dataset Description & Model */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
                <div>
                  <span className="text-cyan-400 font-bold block mb-1">DATASET NAME:</span>
                  <p>{exp.datasetName}</p>
                </div>
                <div>
                  <span className="text-cyan-400 font-bold block mb-1">INSTRUMENT / MODEL:</span>
                  <p>{exp.instrumentOrModel}</p>
                </div>
                <div>
                  <span className="text-cyan-400 font-bold block mb-1">COVERAGE & TIME:</span>
                  <p>{exp.spatialCoverage}</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{exp.temporalRange}</span>
                </div>
              </div>

              {/* Physical Variables */}
              <div className="pt-2 border-t border-cyan-500/10">
                <span className="text-slate-400 uppercase text-[10px] block mb-1">
                  Supported Scientific Variables & Physical Ranges:
                </span>
                <div className="flex flex-wrap gap-2">
                  {exp.variables.map((v, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-space-950 border border-cyan-500/20 text-[11px] text-slate-200"
                    >
                      <strong className="text-cyan-300">{v.name}:</strong> {v.unit} • <span className="text-slate-400">[{v.range}]</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
