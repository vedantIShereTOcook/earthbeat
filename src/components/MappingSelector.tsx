import React from 'react';
import { SonificationMode } from '../types';
import { SONIFICATION_MODES } from '../data/oceanData';
import { Sliders, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { audioSonifier } from '../audio/sonificationEngine';

interface MappingSelectorProps {
  activeMode: SonificationMode;
  onModeChange: (mode: SonificationMode) => void;
  className?: string;
}

export const MappingSelector: React.FC<MappingSelectorProps> = ({
  activeMode,
  onModeChange,
  className = '',
}) => {
  const handleSelect = (mode: SonificationMode) => {
    onModeChange(mode);
    audioSonifier.setMode(mode);
  };

  const selectedConfig = SONIFICATION_MODES.find((m) => m.id === activeMode) || SONIFICATION_MODES[0];

  return (
    <div className={`bg-space-900/90 border border-cyan-500/25 rounded-2xl p-5 shadow-hud ${className}`}>
      
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              Data Sonification Mapping
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Select mathematical transfer model mapping scientific variables to audio synthesis.
          </p>
        </div>

        {/* Mode Switch Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 bg-space-950 p-1.5 rounded-xl border border-cyan-500/20">
          {SONIFICATION_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleSelect(mode.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeMode === mode.id
                  ? 'bg-cyan-500 text-space-950 font-bold shadow-glow-cyan/50'
                  : 'text-slate-300 hover:text-white hover:bg-space-850'
              }`}
            >
              {mode.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Active Mapping Interactive Explainer Card */}
      <div className="bg-space-950/70 border border-cyan-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-cyan-300 font-mono">
              {selectedConfig.name}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/70 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            {selectedConfig.tagline}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {selectedConfig.description}
        </p>

        {/* Visual Input-to-Output Signal Mapping Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-cyan-500/10">
          {/* Primary */}
          <div className="bg-space-900/80 p-2.5 rounded-lg border border-cyan-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
              Primary Variable
            </span>
            <div className="text-xs font-bold text-white mt-1">
              {selectedConfig.primaryVariable}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-cyan-300 font-mono">
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{selectedConfig.audioFeaturePrimary}</span>
            </div>
          </div>

          {/* Secondary */}
          <div className="bg-space-900/80 p-2.5 rounded-lg border border-cyan-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stellar-400">
              Secondary Variable
            </span>
            <div className="text-xs font-bold text-white mt-1">
              {selectedConfig.secondaryVariable}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-stellar-300 font-mono">
              <ArrowRight className="w-3.5 h-3.5 text-stellar-400 shrink-0" />
              <span>{selectedConfig.audioFeatureSecondary}</span>
            </div>
          </div>

          {/* Tertiary */}
          <div className="bg-space-900/80 p-2.5 rounded-lg border border-cyan-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-electric-400">
              Tertiary Variable
            </span>
            <div className="text-xs font-bold text-white mt-1">
              {selectedConfig.tertiaryVariable || 'Spatial Flow Coordinates'}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-electric-300 font-mono">
              <ArrowRight className="w-3.5 h-3.5 text-electric-400 shrink-0" />
              <span>{selectedConfig.audioFeatureTertiary || 'Spatial Phase Drift'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Challenge Compliance Explanation Notice */}
      <div className="mt-3.5 flex items-start gap-2.5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-cyan-300">How to interpret this sound:</strong> You are listening to real physical measurements from NASA ECCO2 model synthesis. Faster rhythmic patterns reflect higher measured current velocities, while higher musical pitch reflects warmer sea surface temperatures. The sound is a mathematically designed representation of scientific data, not an acoustic recording of underwater ocean noise.
        </p>
      </div>

    </div>
  );
};
