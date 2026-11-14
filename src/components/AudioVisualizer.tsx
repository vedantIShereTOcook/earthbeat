import React, { useEffect, useRef, useState } from 'react';
import { Activity, BarChart3 } from 'lucide-react';
import { audioSonifier } from '../audio/sonificationEngine';

interface AudioVisualizerProps {
  className?: string;
  isPlaying: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  className = '',
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visMode, setVisMode] = useState<'waveform' | 'spectrum'>('waveform');
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = audioSonifier.getAnalyser();

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark telemetry background
      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle telemetry grid lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.beginPath();
      // Horizontal grid
      for (let y = height / 4; y < height; y += height / 4) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      // Vertical grid
      for (let x = width / 8; x < width; x += width / 8) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      if (!analyser || !isPlaying) {
        // Idle heartbeat / baseline line when stopped
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.beginPath();
        const midY = height / 2;
        ctx.moveTo(0, midY);
        const time = Date.now() * 0.003;
        for (let x = 0; x < width; x++) {
          const y = midY + Math.sin(x * 0.02 + time) * 3;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        animFrameId.current = requestAnimationFrame(render);
        return;
      }

      if (visMode === 'waveform') {
        // --- 1. OSCILLOSCOPE TIME-DOMAIN WAVEFORM ---
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        // Ambient glow pass
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.beginPath();
        let sliceWidth = width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();

        // Sharp core laser pass
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00f0ff';
        ctx.beginPath();
        x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();

      } else {
        // --- 2. FFT FREQUENCY SPECTRUM BARS ---
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barCount = 48;
        const barWidth = (width / barCount) - 2;
        let x = 1;

        // Render frequency bands with cyan-to-violet gradient
        for (let i = 0; i < barCount; i++) {
          // Logarithmic frequency bin distribution
          const binIndex = Math.min(bufferLength - 1, Math.floor(Math.pow(i / barCount, 2.2) * (bufferLength / 3)));
          const barHeight = (dataArray[binIndex] / 255) * (height - 10);

          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, '#00f0ff');
          grad.addColorStop(0.6, '#3b82f6');
          grad.addColorStop(1, '#a855f7');

          ctx.fillStyle = grad;
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);

          // Peak cap
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, height - barHeight - 1, barWidth, 1.5);

          x += barWidth + 2;
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isPlaying, visMode]);

  return (
    <div className={`relative bg-space-900 border border-cyan-500/25 rounded-xl p-3 shadow-hud ${className}`}>
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider text-cyan-300 uppercase">
            Acoustic Signal Telemetry
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
            {isPlaying ? 'ACTIVE 48kHz' : 'STANDBY'}
          </span>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-space-950 p-0.5 rounded-lg border border-cyan-500/20">
          <button
            onClick={() => setVisMode('waveform')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-colors ${
              visMode === 'waveform'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Time-Domain Oscilloscope"
          >
            <Activity className="w-3 h-3" />
            Wave
          </button>
          <button
            onClick={() => setVisMode('spectrum')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-colors ${
              visMode === 'spectrum'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Frequency FFT Spectrum"
          >
            <BarChart3 className="w-3 h-3" />
            FFT
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-lg overflow-hidden border border-cyan-500/15">
        <canvas
          ref={canvasRef}
          width={640}
          height={120}
          className="w-full h-28 block bg-space-950"
        />
        {/* Visual Frequency labels on overlay */}
        <div className="absolute bottom-1 left-2 right-2 flex justify-between pointer-events-none text-[9px] font-mono text-cyan-400/40">
          <span>{visMode === 'waveform' ? '-1.0 V' : '60 Hz'}</span>
          <span>{visMode === 'waveform' ? '0.0' : '500 Hz'}</span>
          <span>{visMode === 'waveform' ? '+1.0 V' : '4 kHz'}</span>
          <span>{visMode === 'waveform' ? 'Time Domain' : '16 kHz'}</span>
        </div>
      </div>
    </div>
  );
};
