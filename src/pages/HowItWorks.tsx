import React from 'react';
import { BookOpen, Cpu, Sliders, ArrowDown, ShieldAlert, Sparkles, CheckCircle2, Layers } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Title */}
      <div className="pb-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
          <BookOpen className="w-4 h-4" />
          <span>Scientific Sonification Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
          HOW EARTHBEAT WORKS
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mt-1">
          The engineering, mathematics, and psychoacoustics behind turning NASA Earth observations into real-time sound.
        </p>
      </div>

      {/* 1. ARCHITECTURAL PIPELINE */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          1. Data & Sonification Architecture Pipeline
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          EARTHBEAT implements a modular, deterministic signal flow running entirely in the client browser at zero latency:
        </p>

        {/* Pipeline Flowchart Visual */}
        <div className="p-6 rounded-2xl bg-space-900 border border-cyan-500/30 font-mono text-xs shadow-hud space-y-3">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-space-950 border border-cyan-500/40 text-center">
              <span className="text-cyan-400 font-bold block">NASA EIC VISUAL FRAMES</span>
              <span className="text-[10px] text-slate-400">High-res SVS 3912/5276 Video & Image Sequences</span>
            </div>
            <div className="p-3 rounded-xl bg-space-950 border border-cyan-500/40 text-center">
              <span className="text-cyan-400 font-bold block">VERIFIED SCIENTIFIC DATA</span>
              <span className="text-[10px] text-slate-400">ECCO2, VIIRS, ISS-LIS, GEOS, GEDI Observations</span>
            </div>
          </div>

          <div className="flex justify-center text-cyan-400">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          <div className="p-3 rounded-xl bg-space-950/80 border border-cyan-500/20 text-center">
            <span className="text-white font-bold block">DATA VALIDATION & QUALITY CONTROL</span>
            <span className="text-[10px] text-slate-400">Boundary checking, unit preservation, missing value interpolation</span>
          </div>

          <div className="flex justify-center text-cyan-400">
            <ArrowDown className="w-5 h-5" />
          </div>

          <div className="p-3 rounded-xl bg-space-950/80 border border-cyan-500/20 text-center">
            <span className="text-white font-bold block">FRAME & TIMESTAMP SYNCHRONIZATION</span>
            <span className="text-[10px] text-slate-400">Bidirectional lock between visual timestamp and audio scheduler</span>
          </div>

          <div className="flex justify-center text-cyan-400">
            <ArrowDown className="w-5 h-5" />
          </div>

          <div className="p-3 rounded-xl bg-space-950/80 border border-cyan-500/20 text-center">
            <span className="text-white font-bold block">SCIENTIFIC NORMALISATION & TRANSFER CURVES</span>
            <span className="text-[10px] text-slate-400">Logarithmic frequency quantization (Dorian/Pentatonic) & velocity linear scaling</span>
          </div>

          <div className="flex justify-center text-cyan-400">
            <ArrowDown className="w-5 h-5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-center">
              <span className="text-cyan-300 font-bold block">WEB AUDIO API GRAPH</span>
              <span className="text-[10px] text-slate-300">Carrier Osc + FM Overtones + Biquad Filter + Panner</span>
            </div>
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-center">
              <span className="text-cyan-300 font-bold block">SAFETY & LIMITING CHAIN</span>
              <span className="text-[10px] text-slate-300">DynamicsCompressorNode + 50ms Linear Smoothing Ramps</span>
            </div>
          </div>

          <div className="flex justify-center text-cyan-400">
            <ArrowDown className="w-5 h-5" />
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-electric-500/20 border border-cyan-400 text-center font-bold text-cyan-300">
            REAL-TIME DYNAMIC ACOUSTIC OUTPUT (48 kHz)
          </div>

        </div>
      </section>

      {/* 2. MATHEMATICAL MAPPINGS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Sliders className="w-5 h-5 text-stellar-400" />
          2. Mathematical Parameter Mappings (PMSon)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Rather than assigning arbitrary sound effects, EARTHBEAT employs Parameter Mapping Sonification (PMSon), where specific physical variables modulate exact synthesis nodes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          
          {/* Temperature Equation */}
          <div className="bg-space-900 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
            <span className="text-cyan-400 font-bold block uppercase">
              A. Sea Surface Temperature → Melodic Frequency
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Temperature varies from -1.8°C (polar ice edge) to 32.0°C (equatorial warm pool). We normalize $T$ to $[0, 1]$ and calculate base frequency using logarithmic pitch scaling:
            </p>
            <div className="p-2.5 rounded-lg bg-space-950 border border-cyan-500/30 text-cyan-300 text-[11px]">
              f(T) = 130.81 &times; 2^(T_norm &times; 2.3) Hz
            </div>
            <p className="text-slate-400 text-[10px]">
              The frequency is quantized to modal pentatonic intervals (C3 to E5) to ensure harmonic elegance without losing physical monotonicity.
            </p>
          </div>

          {/* Speed Equation */}
          <div className="bg-space-900 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
            <span className="text-cyan-400 font-bold block uppercase">
              B. Current Speed → Rhythmic Pulse Rate & Filter Cutoff
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Speed v ranges from 0.02 m/s to 2.85 m/s. It modulates tempo (BPM) and dynamic low-pass filter cutoff (fc):
            </p>
            <div className="p-2.5 rounded-lg bg-space-950 border border-cyan-500/30 text-cyan-300 text-[11px]">
              BPM(v) = 40 + (v_norm &times; 180)<br />
              fc(v) = 250 + (v_norm^1.4 &times; 4500) Hz
            </div>
            <p className="text-slate-400 text-[10px]">
              Faster ocean jets generate crisper, rapid acoustic sonar pings and brighter acoustic brilliance.
            </p>
          </div>

          {/* Heading Equation */}
          <div className="bg-space-900 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
            <span className="text-cyan-400 font-bold block uppercase">
              C. Current Heading → Stereo Field Panning
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Current flow azimuth θ clockwise from North dictates the StereoPannerNode value:
            </p>
            <div className="p-2.5 rounded-lg bg-space-950 border border-cyan-500/30 text-cyan-300 text-[11px]">
              Pan(θ) = sin(θ &times; π / 180) &times; 0.85
            </div>
            <p className="text-slate-400 text-[10px]">
              Eastward currents pan right; westward currents pan left; polar/equatorial flows sit centered.
            </p>
          </div>

          {/* Limiter Safeguard */}
          <div className="bg-space-900 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
            <span className="text-cyan-400 font-bold block uppercase">
              D. Psychoacoustic Safeguards & Anti-Clicking
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Sudden parameter jumps when seeking or scrubbing could create harsh clicks or loud bursts. We enforce:
            </p>
            <div className="p-2.5 rounded-lg bg-space-950 border border-cyan-500/30 text-cyan-300 text-[11px]">
              τ = 0.05s exponential smoothing via setTargetAtTime()<br />
              DynamicsCompressor limiter at -18 dB threshold
            </div>
            <p className="text-slate-400 text-[10px]">
              Zero audio clipping; no autoplay before explicit user gesture; silky transitions during timeline scrubbing.
            </p>
          </div>

        </div>
      </section>

      {/* 3. CODE MODULARITY BREAKDOWN */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Layers className="w-5 h-5 text-electric-400" />
          3. Modular Code Architecture
        </h2>
        <div className="p-5 rounded-2xl bg-space-900 border border-cyan-500/20 font-mono text-xs space-y-3">
          <div className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-cyan-300">dataLoader:</strong> Loads verified NASA CSV/JSON archives and formats timestamps and variable arrays.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-cyan-300">dataValidator:</strong> Validates numeric ranges, prevents NaN values, and verifies physical bounds.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-cyan-300">frameSynchronizer:</strong> Locks HTML5 video playback currentTime with data index progression.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-cyan-300">sonificationEngine:</strong> Pure Web Audio API synthesis engine handling oscillators, filters, panner, and audio visualizer.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-cyan-300">audioController:</strong> Manages volume, mute, playback speed (0.5x - 2.0x), looping, and keyboard shortcuts.</span>
          </div>
        </div>
      </section>

    </div>
  );
};
