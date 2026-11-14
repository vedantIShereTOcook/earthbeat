import React from 'react';
import { Info, Award, Accessibility, Code2, Heart, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-mono">
      
      {/* Title */}
      <div className="pb-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400">
          <Info className="w-4 h-4" />
          <span>NASA Space Apps Challenge 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          ABOUT EARTHBEAT
        </h1>
        <p className="text-sm text-slate-300 mt-1 font-sans">
          "The Earth Information Jukebox: See the Earth change. Hear the Earth change."
        </p>
      </div>

      {/* Official Project Description */}
      <section className="bg-space-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-hud space-y-4">
        <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase text-sm">
          <Award className="w-5 h-5 text-cyan-400" />
          <span>Project Identity & Mission</span>
        </div>
        <blockquote className="text-sm sm:text-base text-slate-200 font-sans italic border-l-2 border-cyan-400 pl-4 py-1 leading-relaxed">
          "EARTHBEAT is an interactive Earth science application that transforms NASA Earth Information Center visualisations and scientific measurements into real-time sound. By synchronising Earth visual frames with data-driven audio, the application allows users to explore our planet through both sight and hearing. It aims to make complex Earth science more accessible, engaging and understandable."
        </blockquote>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          The challenge asks developers to pair NASA Earth Information Center visual frames with dynamic sonifications generated in real time from scientific data. EARTHBEAT fulfills this mission by coupling high-resolution NASA visual models (such as ECCO2 ocean circulation and VIIRS Black Marble night lights) directly to the Web Audio API synthesis engine.
        </p>
      </section>

      {/* Accessibility Statement (WCAG 2.1 AA) */}
      <section className="bg-space-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-hud space-y-4">
        <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase text-sm">
          <Accessibility className="w-5 h-5 text-stellar-400" />
          <span>Accessibility Statement</span>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Data sonification is fundamentally an assistive and multi-sensory technology. EARTHBEAT is intentionally engineered to help people who cannot easily access visual information experience Earth science through auditory perception and structured text:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
          <div className="flex items-start gap-2 bg-space-950 p-3 rounded-xl border border-cyan-500/20">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="font-sans"><strong>Keyboard Navigation:</strong> Full control of playback via Spacebar, arrow keys, and shortcuts without requiring a mouse.</span>
          </div>
          <div className="flex items-start gap-2 bg-space-950 p-3 rounded-xl border border-cyan-500/20">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="font-sans"><strong>Screen-Reader Tags:</strong> ARIA labels, semantic roles, and live data announcements on all interactive controls.</span>
          </div>
          <div className="flex items-start gap-2 bg-space-950 p-3 rounded-xl border border-cyan-500/20">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="font-sans"><strong>Visible Sound Explanations:</strong> Clear textual descriptions explaining exactly which variable causes each acoustic shift.</span>
          </div>
          <div className="flex items-start gap-2 bg-space-950 p-3 rounded-xl border border-cyan-500/20">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="font-sans"><strong>High-Contrast Scientific UI:</strong> Strict contrast ratios ensuring readable telemetry numbers and charts.</span>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-space-900 border border-cyan-500/20 rounded-2xl p-6 shadow-hud space-y-3">
        <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase text-sm">
          <Code2 className="w-5 h-5 text-electric-400" />
          <span>Technology & Architecture</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-space-950 border border-cyan-500/20">
            <span className="text-cyan-400 font-bold block">Frontend</span>
            <span className="text-slate-300 font-sans">React 18 + TypeScript</span>
          </div>
          <div className="p-3 rounded-xl bg-space-950 border border-cyan-500/20">
            <span className="text-cyan-400 font-bold block">Audio Engine</span>
            <span className="text-slate-300 font-sans">Native Web Audio API</span>
          </div>
          <div className="p-3 rounded-xl bg-space-950 border border-cyan-500/20">
            <span className="text-cyan-400 font-bold block">3D Visualisation</span>
            <span className="text-slate-300 font-sans">Three.js + Canvas</span>
          </div>
          <div className="p-3 rounded-xl bg-space-950 border border-cyan-500/20">
            <span className="text-cyan-400 font-bold block">Styling</span>
            <span className="text-slate-300 font-sans">Tailwind CSS</span>
          </div>
        </div>
      </section>

      {/* NASA Disclaimer */}
      <section className="p-5 rounded-2xl bg-space-950 border border-amber-500/30 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase">
          <ShieldAlert className="w-4 h-4" />
          <span>NASA Challenge Disclaimer</span>
        </div>
        <p className="font-sans leading-relaxed text-slate-400">
          EARTHBEAT is an independent software submission developed for the NASA Space Apps Challenge 2026 (The Earth Information Jukebox). This project is not an official NASA website, and the developers do not claim to represent NASA or the Earth Information Center. All NASA imagery, datasets, and visualizations remain the intellectual property of NASA, JPL, GSFC, and contributing research institutions.
        </p>
      </section>

    </div>
  );
};
