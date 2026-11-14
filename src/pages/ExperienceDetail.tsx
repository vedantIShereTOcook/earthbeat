import React, { useState, useEffect, useRef } from 'react';
import { EXPERIENCES_METADATA } from '../data/experiencesData';
import { 
  NIGHT_LIGHTS_DATA, 
  LIGHTNING_DATA, 
  CARBON_DATA, 
  AEROSOL_DATA, 
  FOREST_DATA, 
  ATMOSPHERIC_RIVER_DATA,
  GenericDataRecord
} from '../data/additionalDatasets';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  Volume2, 
  VolumeX, 
  Layers,
  ArrowLeft
} from 'lucide-react';

interface ExperienceDetailProps {
  experienceId: string;
  onBack: () => void;
}

export const ExperienceDetail: React.FC<ExperienceDetailProps> = ({
  experienceId,
  onBack,
}) => {
  const metadata = EXPERIENCES_METADATA.find(e => e.id === experienceId) || EXPERIENCES_METADATA[1];

  // Select appropriate dataset
  const getDataset = (): GenericDataRecord[] => {
    switch (experienceId) {
      case 'night-frequencies': return NIGHT_LIGHTS_DATA;
      case 'lightning-pulse': return LIGHTNING_DATA;
      case 'carbon-soundscape': return CARBON_DATA;
      case 'atmospheric-waves': return AEROSOL_DATA;
      case 'forest-frequencies': return FOREST_DATA;
      case 'atmospheric-river': return ATMOSPHERIC_RIVER_DATA;
      default: return NIGHT_LIGHTS_DATA;
    }
  };

  const records = getDataset();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);

  const activeRecord = records[currentStep] || records[0];

  // Audio Context Ref & Nodes for specialized synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const stepTimerRef = useRef<number | null>(null);

  // Initialize and run audio graph for this experience
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      masterGainRef.current = master;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyserRef.current = analyser;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filterRef.current = filter;

      master.connect(analyser);
      analyser.connect(ctx.destination);
      filter.connect(master);
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Sonify current step
  const sonifyCurrentRecord = (rec: GenericDataRecord) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !masterGainRef.current || !filterRef.current) return;

    const t = ctx.currentTime;

    // Tailored physical mapping depending on the NASA scientific variable:
    if (experienceId === 'night-frequencies') {
      // Radiance nW/(cm²·sr) -> Harmonic Bell Chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      // Radiance 24 - 38 mapped to C4 - G5 (261Hz - 784Hz)
      const freq = 220 + (rec.primaryValue / 40) * 440;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      osc.connect(gain);
      gain.connect(filterRef.current);
      osc.start(t);
      osc.stop(t + 0.9);

    } else if (experienceId === 'lightning-pulse') {
      // Flash Radiance μJ -> Fast electrostatic pulse click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      // Radiance 180 - 350 μJ -> High crackle frequency 1200 - 3400 Hz
      const freq = 800 + (rec.primaryValue / 350) * 2600;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + (rec.secondaryValue / 1000));

      const vol = Math.min(0.4, 0.15 + (rec.primaryValue / 350) * 0.25);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start(t);
      osc.stop(t + 0.2);

    } else if (experienceId === 'carbon-soundscape') {
      // CO2 ppm -> Deep planetary breathing drone
      if (!oscRef.current) {
        const drone = ctx.createOscillator();
        const droneGain = ctx.createGain();
        drone.type = 'sawtooth';
        droneGain.gain.setValueAtTime(0.12, t);
        filterRef.current.frequency.setValueAtTime(320, t);
        drone.connect(filterRef.current);
        drone.start();
        oscRef.current = drone;
      }
      // 408 - 425 ppm -> 55 Hz (A1) to 110 Hz (A2)
      const droneFreq = 55 + ((rec.primaryValue - 408) / (425 - 408)) * 55;
      oscRef.current.frequency.setTargetAtTime(droneFreq, t, 0.1);

    } else if (experienceId === 'atmospheric-waves') {
      // AOD 550nm -> Bandpass resonant wind sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const centerFreq = 300 + rec.primaryValue * 800; // 300 - 2200 Hz
      osc.frequency.setValueAtTime(centerFreq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

      osc.connect(gain);
      gain.connect(filterRef.current);
      osc.start(t);
      osc.stop(t + 0.75);

    } else if (experienceId === 'forest-frequencies') {
      // Canopy height (m) -> Vertical acoustic ladder
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      // 4m - 65m -> 180 Hz to 1200 Hz
      const freq = 180 + (rec.primaryValue / 65) * 1020;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);

      osc.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start(t);
      osc.stop(t + 0.7);

    } else if (experienceId === 'atmospheric-river') {
      // IVT kg/(m·s) -> Vapor flux frequency
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      // IVT 180 - 1150 -> 160 Hz - 750 Hz
      const freq = 160 + (rec.primaryValue / 1200) * 600;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.24, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);

      osc.connect(gain);
      gain.connect(filterRef.current);
      osc.start(t);
      osc.stop(t + 0.8);
    }
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      sonifyCurrentRecord(activeRecord);

      stepTimerRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % records.length;
          return next;
        });
      }, 1600);
    } else {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
      if (oscRef.current && experienceId === 'carbon-soundscape') {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
          oscRef.current = null;
        } catch {
          // ignore
        }
      }
    }

    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [isPlaying, currentStep]);

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, w, h);

      if (analyserRef.current && isPlaying) {
        const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(buffer);

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#00f0ff';
        ctx.beginPath();
        const slice = w / buffer.length;
        let x = 0;
        for (let i = 0; i < buffer.length; i++) {
          const v = buffer[i] / 128.0;
          const y = (v * h) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += slice;
        }
        ctx.stroke();
      } else {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const togglePlay = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  const handleSeekStep = (idx: number) => {
    initAudio();
    setCurrentStep(idx);
    sonifyCurrentRecord(records[idx]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-space-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-space-850 hover:border-cyan-400 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>
        <span className="text-slate-500 text-xs font-mono">/</span>
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          NASA EIC Experience: {metadata.title}
        </span>
      </div>

      {/* Experience Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-500/40 text-[11px] font-mono tracking-widest uppercase text-cyan-300 font-bold">
              {metadata.domain}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              NASA SVS ID: #{metadata.svsId}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2 font-mono">
            {metadata.title.toUpperCase()}
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            {metadata.description}
          </p>
        </div>

        <a
          href={metadata.svsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-space-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-space-850 transition-all shadow-hud"
        >
          <span>NASA SVS Source</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Interactive Main Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Genuine NASA Visual Frame */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-space-950 shadow-2xl">
            <img
              src={metadata.mediaUrl}
              alt={metadata.title}
              className="w-full aspect-[16/9] object-cover block"
            />
            {/* Live Data Badge */}
            <div className="absolute top-3 left-3 bg-space-950/85 backdrop-blur-md px-3 py-1 rounded-lg border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-hud">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Step: {activeRecord.label}</span>
            </div>
            {/* Location Tag */}
            <div className="absolute bottom-3 left-3 right-3 bg-space-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/20 text-xs font-mono text-slate-300 flex justify-between items-center">
              <span>{activeRecord.region}</span>
              <span className="text-cyan-400 font-bold">{activeRecord.timestamp}</span>
            </div>
          </div>

          {/* Stepper Selector Bar */}
          <div className="p-3 bg-space-900/90 border border-cyan-500/20 rounded-xl flex flex-wrap gap-1.5 items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Time Series Steps:</span>
            <div className="flex flex-wrap gap-1.5">
              {records.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSeekStep(idx)}
                  className={`px-2 py-1 rounded-lg border transition-all ${
                    currentStep === idx
                      ? 'bg-cyan-500 text-space-950 font-bold border-cyan-400'
                      : 'bg-space-950 text-slate-300 border-cyan-500/20 hover:text-white hover:border-cyan-400'
                  }`}
                >
                  {r.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Sonification Controls & Telemetry */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Signal Oscilloscope */}
          <div className="bg-space-900 border border-cyan-500/25 rounded-2xl p-4 shadow-hud">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold uppercase">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Sonification Acoustic Feed</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {isPlaying ? 'STREAMING' : 'IDLE'}
              </span>
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={100}
              className="w-full h-24 rounded-lg bg-space-950 border border-cyan-500/20 block"
            />
          </div>

          {/* Live Scientific Telemetry Cards */}
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="bg-space-900 border border-cyan-500/20 rounded-xl p-3 shadow-hud">
              <span className="text-[10px] text-cyan-400 uppercase block mb-1">
                Primary Scientific Metric
              </span>
              <div className="text-xl font-bold text-white">
                {activeRecord.primaryValue}
              </div>
              <span className="text-xs text-cyan-300">{activeRecord.primaryUnit}</span>
            </div>
            <div className="bg-space-900 border border-cyan-500/20 rounded-xl p-3 shadow-hud">
              <span className="text-[10px] text-stellar-400 uppercase block mb-1">
                Secondary Metric
              </span>
              <div className="text-xl font-bold text-white">
                {activeRecord.secondaryValue}
              </div>
              <span className="text-xs text-stellar-300">{activeRecord.secondaryUnit}</span>
            </div>
          </div>

          {/* Scientific Context Observation Note */}
          <div className="bg-space-950/70 border border-cyan-500/20 rounded-xl p-3.5 text-xs text-slate-300 font-mono">
            <span className="text-cyan-400 font-bold block mb-1">SCIENTIFIC OBSERVATION:</span>
            <p>{activeRecord.note}</p>
          </div>

          {/* Transport & Volume Controls */}
          <div className="bg-space-900 border border-cyan-500/25 rounded-xl p-4 shadow-hud flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSeekStep(Math.max(0, currentStep - 1))}
                className="p-2 text-slate-300 hover:text-cyan-300 rounded-lg hover:bg-space-850"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  isPlaying
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : 'bg-cyan-500 text-space-950 hover:brightness-110 shadow-glow-cyan'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-space-950" />}
                <span>{isPlaying ? 'PAUSE' : 'SONIFY'}</span>
              </button>

              <button
                onClick={() => handleSeekStep((currentStep + 1) % records.length)}
                className="p-2 text-slate-300 hover:text-cyan-300 rounded-lg hover:bg-space-850"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSeekStep(0)}
                className="p-2 text-slate-300 hover:text-cyan-300 rounded-lg hover:bg-space-850"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (masterGainRef.current && audioCtxRef.current) {
                    masterGainRef.current.gain.setValueAtTime(nextMuted ? 0 : volume, audioCtxRef.current.currentTime);
                  }
                }}
                className="text-slate-400 hover:text-cyan-300"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  if (masterGainRef.current && audioCtxRef.current) {
                    masterGainRef.current.gain.setValueAtTime(v, audioCtxRef.current.currentTime);
                  }
                }}
                className="w-16 accent-cyan-400"
              />
            </div>
          </div>

          {/* Sound Mapping Description Notice */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300 font-mono">
            <span className="text-cyan-300 font-bold block mb-1">DATA-TO-SOUND MAPPING:</span>
            <p className="text-[11px] leading-relaxed">{metadata.sonificationDesign}</p>
          </div>

        </div>
      </div>

    </div>
  );
};
