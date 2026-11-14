import React, { useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Clock, 
  SlidersHorizontal 
} from 'lucide-react';

interface TimelineControllerProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  isLooping: boolean;
  timestamp: string;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onReplay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onMuteToggle: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onLoopToggle: () => void;
  className?: string;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  currentTime,
  duration,
  isPlaying,
  isMuted,
  volume,
  playbackRate,
  isLooping,
  timestamp,
  onPlay,
  onPause,
  onStop,
  onReplay,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onPlaybackRateChange,
  onLoopToggle,
  className = '',
}) => {
  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) onPause();
        else onPlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onSeek(Math.max(0, currentTime - 2));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onSeek(Math.min(duration, currentTime + 2));
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        onMuteToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, duration, onPlay, onPause, onSeek, onMuteToggle]);

  const rates = [0.5, 0.75, 1.0, 1.5, 2.0];

  return (
    <div className={`bg-space-900/95 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-hud backdrop-blur-xl ${className}`}>
      
      {/* 1. SCRUBBER TIMELINE BAR */}
      <div className="relative mb-4 group">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
              NASA Timestamp: {timestamp ? timestamp.replace('T', ' ').replace('Z', ' UTC') : 'Loading...'}
            </span>
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>

        {/* Interactive Progress Slider */}
        <div className="relative w-full h-3 bg-space-950 rounded-full cursor-pointer flex items-center overflow-hidden border border-cyan-500/25">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            aria-label="Seek Timeline"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          {/* Progress bar fill */}
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-electric-500 to-stellar-500 rounded-full pointer-events-none transition-all duration-75 relative"
            style={{ width: `${progressPct}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-glow-cyan" />
          </div>
        </div>
      </div>

      {/* 2. PLAYBACK CONTROLS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Transport buttons */}
        <div className="flex items-center gap-2">
          {/* Replay */}
          <button
            onClick={onReplay}
            aria-label="Replay from start"
            title="Replay from start"
            className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-space-800 rounded-lg transition-colors border border-transparent hover:border-cyan-500/20"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back 1s */}
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 1))}
            aria-label="Step back 1 second"
            title="Step Back 1s (←)"
            className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-space-800 rounded-lg transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          {isPlaying ? (
            <button
              onClick={onPause}
              aria-label="Pause"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/50 hover:bg-amber-500/30 transition-all shadow-glow-cyan/20 font-mono text-sm font-bold"
            >
              <Pause className="w-4 h-4 fill-amber-300" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              aria-label="Play"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-electric-500 text-space-950 hover:brightness-110 transition-all shadow-glow-cyan font-mono text-sm font-bold"
            >
              <Play className="w-4 h-4 fill-space-950" />
              <span>PLAY</span>
            </button>
          )}

          {/* Step Forward 1s */}
          <button
            onClick={() => onSeek(Math.min(duration, currentTime + 1))}
            aria-label="Step forward 1 second"
            title="Step Forward 1s (→)"
            className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-space-800 rounded-lg transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Stop */}
          <button
            onClick={onStop}
            aria-label="Stop playback"
            title="Stop"
            className="p-2 text-slate-300 hover:text-rose-400 hover:bg-space-800 rounded-lg transition-colors"
          >
            <Square className="w-4 h-4" />
          </button>

          {/* Loop Toggle */}
          <button
            onClick={onLoopToggle}
            aria-label={isLooping ? 'Disable Loop' : 'Enable Loop'}
            title={isLooping ? 'Loop: ON' : 'Loop: OFF'}
            className={`p-2 rounded-lg transition-colors border ${
              isLooping
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Playback Speed Buttons */}
        <div className="flex items-center gap-1 bg-space-950 p-1 rounded-xl border border-cyan-500/20">
          <span className="text-[10px] font-mono text-slate-400 px-1.5 hidden sm:inline">SPEED:</span>
          {rates.map((rate) => (
            <button
              key={rate}
              onClick={() => onPlaybackRateChange(rate)}
              className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors ${
                playbackRate === rate
                  ? 'bg-cyan-500 text-space-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-space-850'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Right: Volume & Mute Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onMuteToggle}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            className="p-2 text-slate-300 hover:text-cyan-300 rounded-lg"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            aria-label="Volume Slider"
            className="w-20 sm:w-24 h-1.5 bg-space-950 accent-cyan-400 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] font-mono text-slate-400 w-8">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>

      </div>

      {/* Helper Shortcut Bar */}
      <div className="mt-3 pt-3 border-t border-cyan-500/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span><kbd className="px-1.5 py-0.5 rounded bg-space-950 border border-slate-700 text-cyan-300">Space</kbd> Play/Pause</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-space-950 border border-slate-700 text-cyan-300">← / →</kbd> Seek 2s</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-space-950 border border-slate-700 text-cyan-300">M</kbd> Mute</span>
        </div>
        <div className="flex items-center gap-1 text-cyan-400/80">
          <SlidersHorizontal className="w-3 h-3" />
          <span>Synchronised Audio & Visual Clock</span>
        </div>
      </div>

    </div>
  );
};
