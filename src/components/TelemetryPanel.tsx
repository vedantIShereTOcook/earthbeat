import React from 'react';
import { ScientificDataPoint, AudioEngineMetrics } from '../types';
import { Compass, Waves, Thermometer, Zap, MapPin, Gauge } from 'lucide-react';

interface TelemetryPanelProps {
  currentData: ScientificDataPoint;
  metrics: AudioEngineMetrics;
  className?: string;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  currentData,
  metrics,
  className = '',
}) => {
  // Speed gauge percentage (0 to 2.85 m/s max)
  const speedPct = Math.min(100, Math.round((currentData.speed / 2.85) * 100));

  // Temperature color styling (-2°C to 32°C)
  const sstClamped = Math.max(-2, Math.min(32, currentData.temperature));
  const tempPct = Math.round(((sstClamped - (-2)) / (32 - (-2))) * 100);

  // Direction compass cardinal
  const getCardinal = (deg: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round((deg % 360) / 45) % 8;
    return directions[idx];
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-slate-200 ${className}`}>
      
      {/* 1. CURRENT VELOCITY */}
      <div className="bg-space-900/90 border border-cyan-500/25 rounded-xl p-3.5 shadow-hud flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-cyan-400 mb-1">
          <span className="flex items-center gap-1.5 font-semibold">
            <Waves className="w-4 h-4 text-cyan-400" />
            CURRENT SPEED
          </span>
          <span className="text-[10px] text-slate-400">ECCO2</span>
        </div>
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl font-bold tracking-tight text-white">
            {currentData.speed.toFixed(2)}
          </span>
          <span className="text-xs text-cyan-300">m/s</span>
          <span className="text-[11px] text-slate-400 ml-auto">
            ({(currentData.speed * 1.94384).toFixed(1)} kts)
          </span>
        </div>
        {/* Speed Bar Gauge */}
        <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden mt-1 border border-cyan-500/20">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-electric-400 rounded-full transition-all duration-300"
            style={{ width: `${speedPct}%` }}
          />
        </div>
        <div className="text-[10px] text-cyan-300/70 mt-1 flex justify-between">
          <span>Pulse: {metrics.bpm} BPM</span>
          <span>{speedPct}% Jet Max</span>
        </div>
      </div>

      {/* 2. SEA SURFACE TEMPERATURE */}
      <div className="bg-space-900/90 border border-cyan-500/25 rounded-xl p-3.5 shadow-hud flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-cyan-400 mb-1">
          <span className="flex items-center gap-1.5 font-semibold">
            <Thermometer className="w-4 h-4 text-stellar-400" />
            SURFACE TEMP
          </span>
          <span className="text-[10px] text-slate-400">MODIS/SST</span>
        </div>
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl font-bold tracking-tight text-white">
            {currentData.temperature > 0 ? `+${currentData.temperature.toFixed(1)}` : currentData.temperature.toFixed(1)}
          </span>
          <span className="text-xs text-stellar-300">°C</span>
          <span className="text-[11px] text-slate-400 ml-auto">
            ({(currentData.temperature * 1.8 + 32).toFixed(1)}°F)
          </span>
        </div>
        {/* Temperature Thermal Bar */}
        <div className="w-full bg-space-950 h-1.5 rounded-full overflow-hidden mt-1 border border-cyan-500/20">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${tempPct}%` }}
          />
        </div>
        <div className="text-[10px] text-stellar-300/80 mt-1 flex justify-between">
          <span>Tone: {metrics.frequency} Hz</span>
          <span>Filter: {metrics.filterCutoff} Hz</span>
        </div>
      </div>

      {/* 3. FLOW DIRECTION & COMPASS */}
      <div className="bg-space-900/90 border border-cyan-500/25 rounded-xl p-3.5 shadow-hud flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-cyan-400 mb-1">
          <span className="flex items-center gap-1.5 font-semibold">
            <Compass className="w-4 h-4 text-cyan-400" />
            FLOW HEADING
          </span>
          <span className="text-[10px] text-slate-400">AZIMUTH</span>
        </div>
        <div className="flex items-center justify-between my-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-white">
              {Math.round(currentData.direction)}°
            </span>
            <span className="text-xs text-cyan-300 font-bold">
              {getCardinal(currentData.direction)}
            </span>
          </div>
          {/* Rotating Compass Indicator */}
          <div className="relative w-8 h-8 rounded-full border border-cyan-500/40 bg-space-950 flex items-center justify-center">
            <div
              className="w-1 h-5 bg-gradient-to-t from-transparent via-cyan-400 to-rose-400 rounded-full transform origin-center transition-transform duration-300"
              style={{ transform: `rotate(${currentData.direction}deg)` }}
            />
          </div>
        </div>
        <div className="text-[10px] text-cyan-300/70 mt-1 flex justify-between">
          <span>Pan: {metrics.pan > 0 ? `+${metrics.pan} R` : `${metrics.pan} L`}</span>
          <span>u: {currentData.u.toFixed(2)} | v: {currentData.v.toFixed(2)}</span>
        </div>
      </div>

      {/* 4. KINETIC ENERGY & LOCATION */}
      <div className="bg-space-900/90 border border-cyan-500/25 rounded-xl p-3.5 shadow-hud flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-cyan-400 mb-1">
          <span className="flex items-center gap-1.5 font-semibold">
            <Zap className="w-4 h-4 text-amber-400" />
            KINETIC FLUX
          </span>
          <span className="text-[10px] text-slate-400">½ρv²</span>
        </div>
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl font-bold tracking-tight text-white">
            {currentData.energyFlux.toFixed(2)}
          </span>
          <span className="text-xs text-amber-300">kJ/m³</span>
        </div>
        <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-1 truncate">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{currentData.region}</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
          <span>
            {Math.abs(currentData.lat).toFixed(1)}°{currentData.lat >= 0 ? 'N' : 'S'},{' '}
            {Math.abs(currentData.lon).toFixed(1)}°{currentData.lon >= 0 ? 'E' : 'W'}
          </span>
          <span className="text-cyan-400">SYNCED</span>
        </div>
      </div>

    </div>
  );
};
