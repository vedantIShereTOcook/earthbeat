import React from 'react';
import { EarthGlobe } from '../components/EarthGlobe';
import { EXPERIENCES_METADATA } from '../data/experiencesData';
import { 
  Play, 
  Disc3, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Volume2, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Globe2,
  Waves,
  Eye
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string, experienceId?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const flagship = EXPERIENCES_METADATA[0];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16">
        
        {/* Ambient atmospheric background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-electric-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-stellar-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left 7 Cols: Typography, Tagline, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-hud backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>NASA SPACE APPS CHALLENGE 2026 SUBMISSION</span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-mono leading-[1.08]">
                EARTH<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-electric-400 to-stellar-400">BEAT</span>
              </h1>
              <p className="text-lg sm:text-xl font-bold tracking-widest text-cyan-300 uppercase font-mono">
                THE SOUND OF OUR PLANET
              </p>
            </div>

            {/* Core Tagline */}
            <blockquote className="text-xl sm:text-2xl text-slate-200 font-medium italic border-l-2 border-cyan-400/60 pl-4 py-1 text-left">
              "Every change on Earth has a story. Now, you can hear it."
            </blockquote>

            {/* Core Description */}
            <p className="text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              An interactive Earth science laboratory that transforms NASA Earth Information Center scientific visualisations and real measurements into dynamic, real-time sound. Experience planetary change through both sight and hearing.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => onNavigate('ocean-symphony')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-electric-500 text-space-950 font-mono text-sm font-bold shadow-glow-cyan hover:scale-105 transition-all"
              >
                <Disc3 className="w-5 h-5 fill-space-950 animate-spin-slow" />
                <span>LAUNCH OCEAN SYMPHONY</span>
              </button>

              <button
                onClick={() => onNavigate('explore')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-space-900 border border-cyan-500/30 text-slate-200 font-mono text-sm font-semibold hover:border-cyan-400 hover:text-white transition-all shadow-hud"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>EXPLORE ALL EXPERIENCES</span>
              </button>

              <button
                onClick={() => onNavigate('how-it-works')}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-slate-400 hover:text-cyan-300 font-mono text-xs transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>How It Works</span>
              </button>
            </div>

            {/* Challenge Acceptance Criterion Pill */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>100% Genuine NASA Data</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Real-Time Web Audio API</span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Interactive 3D Earth Globe with Ocean Telemetry Beacons */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-[480px] aspect-square rounded-3xl bg-space-900/60 border border-cyan-500/25 p-4 shadow-hud relative backdrop-blur-xl">
              <EarthGlobe onSelectRegion={() => onNavigate('ocean-symphony')} />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-space-950 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 shadow-hud whitespace-nowrap">
                Drag to rotate globe • Click beacon to sonify
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. WHAT IS EARTHBEAT? SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-space-900/80 border border-cyan-500/25 p-8 sm:p-12 shadow-hud relative overflow-hidden">
          
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
              <Activity className="w-4 h-4" />
              <span>THE SCIENTIFIC OBJECTIVE</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              SEE THE EARTH CHANGE. <br />
              <span className="text-cyan-400">HEAR THE EARTH CHANGE.</span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              NASA's Earth Information Center produces breathtaking scientific visualisations of our evolving climate, oceans, and atmosphere. But until now, people experienced these insights almost exclusively through sight.
            </p>

            <p className="text-base text-slate-300 leading-relaxed">
              <strong className="text-cyan-300">EARTHBEAT</strong> transforms NASA's visualisations and underlying numeric datasets into synchronized, real-time sound. We do not use arbitrary background music, sound effects, or prerecorded nature tracks. Every pitch shift, rhythmic pulse, filter cutoff, and stereo movement is calculated in real time directly from genuine scientific measurements.
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-cyan-500/15">
            <div className="bg-space-950/70 p-5 rounded-2xl border border-cyan-500/20 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">1. Visual Continuity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We retain original NASA Scientific Visualization Studio (SVS) video and image sequences, preserving scientific color calibrations and geographic projections.
              </p>
            </div>

            <div className="bg-space-950/70 p-5 rounded-2xl border border-cyan-500/20 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-stellar-500/10 border border-stellar-500/30 flex items-center justify-center text-stellar-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">2. Dynamic Sonification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The Web Audio API generates sound in the browser at 48kHz. Mathematical transfer curves translate physical variables into acoustic parameters without latency.
              </p>
            </div>

            <div className="bg-space-950/70 p-5 rounded-2xl border border-cyan-500/20 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-electric-500/10 border border-electric-500/30 flex items-center justify-center text-electric-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">3. Strict Synchronisation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Audio and visual progressions follow the exact same data timeline. Pause, seek, or change playback speed: the sound and visual remain in lockstep.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FLAGSHIP EXPERIENCE SPOTLIGHT: OCEAN SYMPHONY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-space-900 via-space-950 to-space-900 border-2 border-cyan-500/40 p-8 sm:p-12 shadow-glow-cyan/20">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950 border border-cyan-500/50 text-xs font-mono text-cyan-300 font-bold uppercase">
                <Waves className="w-4 h-4" />
                Featured Flagship Experience
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
                OCEAN SYMPHONY
              </h2>

              <p className="text-base text-slate-300 leading-relaxed">
                Explore global ocean circulation and sea surface temperature from the NASA ECCO2 model. As western boundary currents like the Gulf Stream and Kuroshio surge across the ocean basins, hear their kinetic speeds translate into rhythmic pulses and thermal temperatures into harmonic pitches.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-space-950 border border-cyan-500/20">
                  <span className="text-slate-400 block text-[10px]">SPEED (0.02 - 2.85 m/s)</span>
                  <span className="text-cyan-300 font-bold">Rhythmic Pulse Rate</span>
                </div>
                <div className="p-2.5 rounded-lg bg-space-950 border border-cyan-500/20">
                  <span className="text-slate-400 block text-[10px]">SST (-1.8 - 32.0 °C)</span>
                  <span className="text-stellar-300 font-bold">Melodic Pitch Range</span>
                </div>
                <div className="p-2.5 rounded-lg bg-space-950 border border-cyan-500/20">
                  <span className="text-slate-400 block text-[10px]">FLOW AZIMUTH (0 - 360°)</span>
                  <span className="text-electric-300 font-bold">Stereo Panning</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('ocean-symphony')}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-cyan-400 text-space-950 font-mono text-sm font-bold shadow-glow-cyan hover:bg-cyan-300 transition-all"
                >
                  <Play className="w-4 h-4 fill-space-950" />
                  <span>EXPERIENCE OCEAN SYMPHONY NOW</span>
                </button>
              </div>
            </div>

            {/* Video Preview Poster Card */}
            <div className="lg:col-span-5 relative group">
              <div className="rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl relative aspect-video bg-space-950">
                <img
                  src="/media/nightlights.jpg"
                  alt="NASA Ocean Symphony Visualization Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-space-950/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/90 flex items-center justify-center shadow-glow-cyan group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-space-950 ml-1 text-space-950" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-space-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/20 text-xs font-mono text-cyan-300 flex justify-between">
                  <span>NASA SVS #3912</span>
                  <span>100% Synced Audio Engine</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. EXPERIENCES CATALOGUE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
              <Layers className="w-4 h-4" />
              <span>THE NASA JUKEBOX COLLECTION</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white font-mono tracking-tight mt-1">
              EXPLORE PLANETARY FREQUENCIES
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Every experience below is powered by genuine scientific datasets and real-time audio synthesis.
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPERIENCES_METADATA.map((exp) => (
            <div
              key={exp.id}
              className="bg-space-900 border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-between shadow-hud group"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-space-950">
                  <img
                    src={exp.mediaUrl}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-space-950/85 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 uppercase font-semibold">
                      {exp.domain}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                      {exp.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between text-[10px] font-mono text-slate-300 bg-space-950/80 backdrop-blur-md px-2 py-1 rounded border border-cyan-500/20">
                    <span>NASA SVS #{exp.svsId}</span>
                    <span className="text-cyan-400">{exp.variables[0].name}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-cyan-400/80 font-mono mt-0.5">
                      {exp.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="pt-2 border-t border-cyan-500/10">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Acoustic Mapping:
                    </span>
                    <p className="text-[11px] font-mono text-slate-200 line-clamp-2">
                      {exp.sonificationDesign}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    if (exp.id === 'ocean-symphony') onNavigate('ocean-symphony');
                    else onNavigate('experience-detail', exp.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-space-950 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold hover:bg-cyan-500 hover:text-space-950 transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>EXPERIENCE {exp.title.toUpperCase()}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </section>

    </div>
  );
};
