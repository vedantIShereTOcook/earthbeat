import { ScientificDataPoint, SonificationMode, AudioEngineMetrics } from '../types';

/**
 * EARTHBEAT Web Audio Sonification Engine
 * Real-time parameter mapping sonification (PMSon) for NASA Earth science data.
 * Pure Web Audio API: Zero external heavy audio libraries, low latency, 100% standards compliant.
 */
export class SonificationEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private isMuted = false;
  private volume = 0.75;
  private currentMode: SonificationMode = 'symphony';
  private isPlayingActive = false;

  // Audio Nodes
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private panner: StereoPannerNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Tone Oscillators
  private carrierOsc: OscillatorNode | null = null;
  private carrierGain: GainNode | null = null;
  private overtoneOsc: OscillatorNode | null = null;
  private overtoneGain: GainNode | null = null;

  // Rhythm scheduler
  private rhythmTimerId: number | null = null;
  private currentBpm = 60;
  private lastPulseTime = 0;
  private lastHarmonicFreq = 220;
  private lastNormSpeed = 0.5;

  // Live Metrics for UI feedback
  private currentMetrics: AudioEngineMetrics = {
    frequency: 220,
    bpm: 60,
    filterCutoff: 1000,
    pan: 0,
    gain: 0.75,
    resonance: 1.0,
  };

  constructor() {
    // AudioContext initialized on user gesture
  }

  public async initAudio(): Promise<boolean> {
    if (this.isInitialized && this.ctx && this.ctx.state === 'running') {
      this.isPlayingActive = true;
      this.startPulseScheduler();
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.setupAudioGraph();
      this.isInitialized = true;
      this.isPlayingActive = true;
      this.startPulseScheduler();
      return true;
    } catch (err) {
      console.error('Failed to initialize Web Audio context:', err);
      return false;
    }
  }

  private setupAudioGraph(): void {
    if (!this.ctx) return;

    // 1. Master Output Chain with Safety Limiter
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // 2. Stereo Panner
    if (this.ctx.createStereoPanner) {
      this.panner = this.ctx.createStereoPanner();
      this.panner.pan.setValueAtTime(0, this.ctx.currentTime);
    }

    // 3. Main Biquad Filter (Lowpass with gentle resonance)
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    // 4. Analyser for Real-time Oscilloscope & Spectrum
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.85;

    // Connect Main Chain
    if (this.panner) {
      this.filter.connect(this.panner);
      this.panner.connect(this.masterGain);
    } else {
      this.filter.connect(this.masterGain);
    }
    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // 5. Continuous Tone Generators (Carrier + Shimmer Overtone)
    this.carrierOsc = this.ctx.createOscillator();
    this.carrierOsc.type = 'sine';
    this.carrierOsc.frequency.setValueAtTime(220, this.ctx.currentTime);

    this.carrierGain = this.ctx.createGain();
    this.carrierGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    this.overtoneOsc = this.ctx.createOscillator();
    this.overtoneOsc.type = 'triangle';
    this.overtoneOsc.frequency.setValueAtTime(440, this.ctx.currentTime);

    this.overtoneGain = this.ctx.createGain();
    this.overtoneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.carrierOsc.connect(this.carrierGain);
    this.carrierGain.connect(this.filter);

    this.overtoneOsc.connect(this.overtoneGain);
    this.overtoneGain.connect(this.filter);

    this.carrierOsc.start();
    this.overtoneOsc.start();
  }

  private startPulseScheduler(): void {
    if (this.rhythmTimerId) return;

    this.rhythmTimerId = window.setInterval(() => {
      if (!this.ctx || this.ctx.state !== 'running' || !this.isPlayingActive) return;

      const now = this.ctx.currentTime;
      const pulseIntervalSeconds = 60 / Math.max(30, this.currentBpm);

      if (now - this.lastPulseTime >= pulseIntervalSeconds) {
        this.lastPulseTime = now;
        this.playAcousticPulse(now, this.lastHarmonicFreq, this.lastNormSpeed);
      }
    }, 25);
  }

  private stopPulseScheduler(): void {
    if (this.rhythmTimerId) {
      clearInterval(this.rhythmTimerId);
      this.rhythmTimerId = null;
    }
  }

  /**
   * Translates scientific ocean variables into real-time sound
   * Speed (m/s) -> Rhythm BPM, Filter Cutoff, Pulse density
   * SST (°C) -> Musical Pitch Frequency, harmonic overtones
   * Direction (deg) -> Stereo Panning (-1.0 to +1.0)
   */
  public updateScientificData(point: ScientificDataPoint, playbackRate = 1.0): void {
    if (!this.ctx || !this.isInitialized) return;

    const t = this.ctx.currentTime;
    const timeConstant = 0.05; // 50ms smoothing avoids clicking

    // --- 1. TEMPERATURE -> PITCH MAPPING ---
    const clampedSst = Math.max(-2, Math.min(34, point.temperature));
    const normSst = (clampedSst - (-2)) / (34 - (-2)); // 0.0 to 1.0

    // Musical frequency range: 130.81 Hz (C3) to 659.25 Hz (E5)
    const baseFreq = 130.81 * Math.pow(2, normSst * 2.3);
    const harmonicFreq = this.quantizeToScale(baseFreq);
    this.lastHarmonicFreq = harmonicFreq;

    if (this.carrierOsc) {
      this.carrierOsc.frequency.setTargetAtTime(harmonicFreq, t, timeConstant);
    }
    if (this.overtoneOsc) {
      const overtoneRatio = this.currentMode === 'thermal' ? 2.0 : 1.5;
      this.overtoneOsc.frequency.setTargetAtTime(harmonicFreq * overtoneRatio, t, timeConstant);
    }

    // --- 2. CURRENT SPEED -> RHYTHM & FILTER CUTOFF MAPPING ---
    const clampedSpeed = Math.max(0.02, Math.min(2.8, point.speed));
    const normSpeed = clampedSpeed / 2.5; // 0.0 to 1.0
    this.lastNormSpeed = normSpeed;

    // Speed maps directly to rhythmic pulse tempo: 40 BPM to 220 BPM
    const calculatedBpm = Math.round(40 + normSpeed * 180 * playbackRate);
    this.currentBpm = calculatedBpm;

    // Filter Cutoff: Faster currents open up brightness (250 Hz - 4800 Hz)
    const cutoff = Math.round(250 + Math.pow(normSpeed, 1.4) * 4500);
    if (this.filter) {
      this.filter.frequency.setTargetAtTime(cutoff, t, timeConstant);
      const resQ = 1.0 + normSpeed * 3.5;
      this.filter.Q.setTargetAtTime(resQ, t, timeConstant);
    }

    // --- 3. DIRECTION -> STEREO PANNING ---
    if (this.panner) {
      const rad = (point.direction * Math.PI) / 180;
      const panValue = Math.sin(rad) * 0.85;
      this.panner.pan.setTargetAtTime(panValue, t, timeConstant);
      this.currentMetrics.pan = Number(panValue.toFixed(2));
    }

    // --- 4. GAIN / MODE ADJUSTMENTS ---
    if (this.carrierGain && this.overtoneGain && this.isPlayingActive) {
      if (this.currentMode === 'thermal') {
        this.carrierGain.gain.setTargetAtTime(0.28, t, timeConstant);
        this.overtoneGain.gain.setTargetAtTime(0.18, t, timeConstant);
      } else if (this.currentMode === 'kinetic') {
        this.carrierGain.gain.setTargetAtTime(0.10, t, timeConstant);
        this.overtoneGain.gain.setTargetAtTime(0.05, t, timeConstant);
      } else if (this.currentMode === 'ambient') {
        this.carrierGain.gain.setTargetAtTime(0.22, t, timeConstant);
        this.overtoneGain.gain.setTargetAtTime(0.14, t, timeConstant);
      } else {
        // Symphony default
        this.carrierGain.gain.setTargetAtTime(0.18, t, timeConstant);
        this.overtoneGain.gain.setTargetAtTime(0.09, t, timeConstant);
      }
    }

    // Store metrics
    this.currentMetrics = {
      frequency: Math.round(harmonicFreq),
      bpm: this.currentBpm,
      filterCutoff: cutoff,
      pan: this.currentMetrics.pan,
      gain: this.volume,
      resonance: Number((1.0 + normSpeed * 3.5).toFixed(1)),
    };
  }

  private playAcousticPulse(time: number, baseFreq: number, normSpeed: number): void {
    if (!this.ctx || !this.filter || !this.isPlayingActive) return;

    const pulseOsc = this.ctx.createOscillator();
    const pulseGain = this.ctx.createGain();

    pulseOsc.type = normSpeed > 0.6 ? 'sine' : 'triangle';
    const pulseFreq = baseFreq * (this.currentMode === 'kinetic' ? 2.0 : 1.5);
    pulseOsc.frequency.setValueAtTime(pulseFreq, time);
    pulseOsc.frequency.exponentialRampToValueAtTime(baseFreq, time + 0.12);

    const pulseVol = (0.08 + normSpeed * 0.14) * (this.isMuted ? 0 : 1);
    pulseGain.gain.setValueAtTime(0.001, time);
    pulseGain.gain.linearRampToValueAtTime(pulseVol, time + 0.015);
    pulseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

    pulseOsc.connect(pulseGain);
    pulseGain.connect(this.filter);

    pulseOsc.start(time);
    pulseOsc.stop(time + 0.2);

    setTimeout(() => {
      try {
        pulseOsc.disconnect();
        pulseGain.disconnect();
      } catch {
        // cleaned
      }
    }, 250);
  }

  private quantizeToScale(freq: number): number {
    const A4 = 440;
    const midi = Math.round(69 + 12 * Math.log2(freq / A4));
    const semitones = [0, 2, 3, 5, 7, 9, 10];
    const octave = Math.floor(midi / 12);
    const noteInOctave = midi % 12;

    let closest = semitones[0];
    let minDiff = 999;
    for (const st of semitones) {
      const diff = Math.abs(st - noteInOctave);
      if (diff < minDiff) {
        minDiff = diff;
        closest = st;
      }
    }

    const quantizedMidi = octave * 12 + closest;
    return A4 * Math.pow(2, (quantizedMidi - 69) / 12);
  }

  // Audio Controls
  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.03);
    }
  }

  public setMute(mute: boolean): void {
    this.isMuted = mute;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.03);
    }
  }

  public setMode(mode: SonificationMode): void {
    this.currentMode = mode;
  }

  public getMode(): SonificationMode {
    return this.currentMode;
  }

  public getMetrics(): AudioEngineMetrics {
    return { ...this.currentMetrics };
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public pause(): void {
    this.isPlayingActive = false;
    this.stopPulseScheduler();
    if (this.carrierGain && this.overtoneGain && this.ctx) {
      this.carrierGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      this.overtoneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }
  }

  public resume(): void {
    this.isPlayingActive = true;
    this.startPulseScheduler();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.carrierGain && this.overtoneGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.carrierGain.gain.setTargetAtTime(0.18, t, 0.05);
      this.overtoneGain.gain.setTargetAtTime(0.09, t, 0.05);
    }
  }

  public stop(): void {
    this.pause();
    this.lastPulseTime = 0;
  }

  public destroy(): void {
    this.stop();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
      this.ctx = null;
    }
    this.isInitialized = false;
  }
}

// Singleton audio engine instance for the application
export const audioSonifier = new SonificationEngine();
