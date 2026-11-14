import React, { useState, useEffect, useRef } from 'react';
import { NASA_ECCO2_OCEAN_DATA, OCEAN_REGIONS } from '../data/oceanData';
import { ScientificDataPoint, SonificationMode } from '../types';
import { audioSonifier } from '../audio/sonificationEngine';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { TelemetryPanel } from '../components/TelemetryPanel';
import { TimelineController } from '../components/TimelineController';
import { MappingSelector } from '../components/MappingSelector';
import { CustomDataImporter } from '../components/CustomDataImporter';
import { 
  Compass, 
  ExternalLink, 
  Upload, 
  RotateCcw, 
  Layers, 
  ShieldCheck, 
  Info, 
  FileSpreadsheet,
  MapPin,
  Sparkles
} from 'lucide-react';

export const OceanSymphony: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<ScientificDataPoint[]>(NASA_ECCO2_OCEAN_DATA);
  const [datasetTitle, setDatasetTitle] = useState('NASA ECCO2 Surface Flow & SST (SVS 3912)');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isLooping, setIsLooping] = useState(true);
  const [activeMapping, setActiveMapping] = useState<SonificationMode>('symphony');
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentPoint = dataPoints[currentIndex] || dataPoints[0];
  const totalDuration = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].timeSeconds : 112;

  // Sync audio sonification engine with current data point
  useEffect(() => {
    if (isPlaying) {
      audioSonifier.updateScientificData(currentPoint, playbackRate);
    }
  }, [currentIndex, isPlaying, currentPoint, playbackRate]);

  // Video time update event synchronisation
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    
    // Find closest data point in timeline
    const idx = Math.min(
      dataPoints.length - 1,
      Math.max(0, Math.floor(time * (dataPoints.length / (totalDuration || 112))))
    );
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
    }
  };

  const handleVideoEnded = () => {
    if (isLooping) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
      setCurrentIndex(0);
    } else {
      setIsPlaying(false);
      audioSonifier.pause();
    }
  };

  // Playback Control Handlers
  const handlePlay = async () => {
    await audioSonifier.initAudio();
    audioSonifier.resume();
    audioSonifier.setVolume(volume);
    audioSonifier.setMute(isMuted);

    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
      videoRef.current.play().catch(err => {
        console.warn('Video play was prevented:', err);
      });
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    audioSonifier.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    audioSonifier.stop();
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    setCurrentIndex(0);
    if (!isPlaying) {
      handlePlay();
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    const idx = Math.min(
      dataPoints.length - 1,
      Math.max(0, Math.floor(time * (dataPoints.length / (totalDuration || 112))))
    );
    setCurrentIndex(idx);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    audioSonifier.setVolume(vol);
    if (isMuted && vol > 0) {
      setIsMuted(false);
      audioSonifier.setMute(false);
    }
  };

  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioSonifier.setMute(next);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const jumpToRegion = (regionId: string) => {
    let targetTime = 0;
    if (regionId === 'gulf_stream') targetTime = 5;
    else if (regionId === 'subpolar') targetTime = 32;
    else if (regionId === 'kuroshio') targetTime = 55;
    else if (regionId === 'antarctic') targetTime = 80;
    else if (regionId === 'agulhas') targetTime = 99;

    handleSeek(targetTime);
  };

  const handleCustomDataLoaded = (customPoints: ScientificDataPoint[], customName: string) => {
    setDataPoints(customPoints);
    setDatasetTitle(customName);
    setCurrentIndex(0);
    handleSeek(0);
  };

  const restoreNasaData = () => {
    setDataPoints(NASA_ECCO2_OCEAN_DATA);
    setDatasetTitle('NASA ECCO2 Surface Flow & SST (SVS 3912)');
    setCurrentIndex(0);
    handleSeek(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Experience Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-500/40 text-[11px] font-mono tracking-widest uppercase text-cyan-300 font-bold">
              Flagship Experience
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Verified NASA Scientific Model
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2 font-mono">
            OCEAN <span className="text-cyan-400">SYMPHONY</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Global Sea Surface Currents & Temperature from the joint NASA Jet Propulsion Laboratory (JPL) & MIT ECCO2 model. Watch the circulation; hear the velocity and temperature changes in real time.
          </p>
        </div>

        {/* Action Buttons: Import Data & Metadata */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsImporterOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-space-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-space-850 hover:border-cyan-400 transition-all shadow-hud"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV/JSON</span>
          </button>
          
          {dataPoints !== NASA_ECCO2_OCEAN_DATA && (
            <button
              onClick={restoreNasaData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-400 hover:bg-cyan-900/60 transition-all"
              title="Reset to default NASA ECCO2 data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset NASA Baseline</span>
            </button>
          )}

          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-space-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:bg-space-850 transition-all"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showMetadata ? 'Hide Specs' : 'Scientific Specs'}</span>
          </button>
        </div>
      </div>

      {/* Scientific Specifications Drawer */}
      {showMetadata && (
        <div className="p-5 rounded-2xl bg-space-900/95 border border-cyan-500/30 font-mono text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-hud animate-fadeIn">
          <div>
            <span className="text-cyan-400 font-bold block mb-1">MODEL & SATELLITE INPUTS:</span>
            <p>MIT General Circulation Model (MITgcm) synthesizing TOPEX/Poseidon & Jason-1 altimetry, GRACE gravity, ARGO profiling floats, and AMSR-E/MODIS Sea Surface Temperature.</p>
          </div>
          <div>
            <span className="text-cyan-400 font-bold block mb-1">SPATIO-TEMPORAL COVERAGE:</span>
            <p>Global ocean surface grid (0.02 - 2.85 m/s). Time range: 2007-03-25T12:00Z to 2008-03-03T12:00Z. Resolution: ~1/6° eddy-resolving ocean dynamics.</p>
          </div>
          <div>
            <span className="text-cyan-400 font-bold block mb-1">PROVENANCE & CITATIONS:</span>
            <p>NASA Scientific Visualization Studio Catalog ID 3912. Jet Propulsion Laboratory ECCO2 Project. DOI: 10.5067/ECCO2-MIT40.</p>
            <a
              href="https://svs.gsfc.nasa.gov/3912"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-cyan-300 hover:underline mt-2"
            >
              <span>Visit NASA SVS 3912 Catalog</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Flagship Interactive Stage: Visualisation + Live HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Genuine NASA Visual Frame & Video Stage */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-space-950 shadow-2xl group">
            
            {/* HTML5 Synchronised Video Element */}
            <video
              ref={videoRef}
              src="/media/ecco2_ocean.mp4"
              poster="/media/nightlights.jpg"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              playsInline
              muted // video audio track is muted so pure Web Audio engine handles sonification
              className="w-full aspect-[16/9] object-cover block"
            />

            {/* Live Visual Overlay Labels (NASA Frame HUD) */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
              <span className="bg-space-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-hud">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                NASA EIC FRAME: SVS #3912
              </span>
              <span className="bg-space-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/30 text-[11px] font-mono text-slate-200">
                {currentPoint.region}
              </span>
            </div>

            {/* Current Coordinate & Scientific Scale Watermark */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300 pointer-events-none bg-space-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">
                  {currentPoint.timestamp.replace('T', ' ').replace('Z', ' UTC')}
                </span>
                <span>Lat: {currentPoint.lat > 0 ? `+${currentPoint.lat.toFixed(1)}°` : `${currentPoint.lat.toFixed(1)}°`}</span>
                <span>Lon: {currentPoint.lon > 0 ? `+${currentPoint.lon.toFixed(1)}°` : `${currentPoint.lon.toFixed(1)}°`}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-cyan-300">
                <span>Color: SST (°C)</span>
                <span>•</span>
                <span>Motion: Current Velocity (m/s)</span>
              </div>
            </div>

            {/* Play Overlay Button if Paused */}
            {!isPlaying && (
              <div 
                onClick={handlePlay}
                className="absolute inset-0 bg-space-950/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all hover:bg-space-950/20"
              >
                <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-cyan-500/90 text-space-950 font-mono text-sm font-bold shadow-glow-cyan hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 fill-space-950" />
                  <span>START OCEAN SONIFICATION</span>
                </div>
              </div>
            )}
          </div>

          {/* Regional Quick-Jump Waypoint Selector */}
          <div className="bg-space-900/90 border border-cyan-500/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5 font-bold">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              FOCUS REGIONS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {OCEAN_REGIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => jumpToRegion(r.id)}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    currentPoint.region.includes(r.name.split(' ')[0])
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-space-950 border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-500/40'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Acoustic Signal Telemetry & Active Waveform */}
        <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
          
          {/* Real-time Oscilloscope & FFT Spectrum */}
          <AudioVisualizer isPlaying={isPlaying} />

          {/* Sonification Mapping Model Selector */}
          <MappingSelector
            activeMode={activeMapping}
            onModeChange={(mode) => setActiveMapping(mode)}
          />

        </div>
      </div>

      {/* Synchronised Timeline Controller Bar */}
      <TimelineController
        currentTime={videoRef.current ? videoRef.current.currentTime : currentPoint.timeSeconds}
        duration={totalDuration}
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        playbackRate={playbackRate}
        isLooping={isLooping}
        timestamp={currentPoint.timestamp}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
        onReplay={handleReplay}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
        onPlaybackRateChange={handlePlaybackRateChange}
        onLoopToggle={() => setIsLooping(!isLooping)}
      />

      {/* Real-time Calibrated Scientific Telemetry HUD */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
          <span className="flex items-center gap-1.5 font-bold tracking-wider uppercase">
            <Layers className="w-4 h-4 text-cyan-400" />
            Live Scientific Variable Stream
          </span>
          <span className="text-slate-400">
            Source: {datasetTitle}
          </span>
        </div>
        <TelemetryPanel
          currentData={currentPoint}
          metrics={audioSonifier.getMetrics()}
        />
      </div>

      {/* Custom Data Importer Modal */}
      {isImporterOpen && (
        <CustomDataImporter
          onDataLoaded={handleCustomDataLoaded}
          onClose={() => setIsImporterOpen(false)}
        />
      )}

    </div>
  );
};
