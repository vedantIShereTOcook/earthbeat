import React, { useState } from 'react';
import { Volume2, VolumeX, Radio, Compass, Disc3, Info, Database, BookOpen, Menu, X } from 'lucide-react';
import { audioSonifier } from '../audio/sonificationEngine';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  isMuted,
  setIsMuted,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioSonifier.setMute(next);
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: Radio },
    { id: 'ocean-symphony', label: 'Ocean Symphony', icon: Disc3, highlight: true },
    { id: 'explore', label: 'Explore Earth', icon: Compass },
    { id: 'how-it-works', label: 'How It Works', icon: BookOpen },
    { id: 'data-sources', label: 'Data Sources', icon: Database },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-space-950/85 border-b border-cyan-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-electric-500/20 to-stellar-500/20 border border-cyan-400/40 flex items-center justify-center shadow-hud group-hover:border-cyan-300 transition-all duration-300">
            <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm group-hover:bg-cyan-400/20 transition-all"></div>
            <Disc3 className="w-6 h-6 text-cyan-400 animate-spin-slow group-hover:text-cyan-300 transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider text-slate-100 font-mono flex items-center">
                EARTH<span className="text-cyan-400">BEAT</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 rounded">
                NASA Space Apps
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wider font-mono">
              THE SOUND OF OUR PLANET
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 shadow-glow-cyan/20'
                    : link.highlight
                    ? 'text-cyan-400 hover:text-cyan-300 hover:bg-space-850 border border-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-space-850'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {link.label}
                {link.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action: Audio Mute & Telemetry Pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
              isMuted
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-400 hover:bg-rose-900/40'
                : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40 shadow-hud'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">AUDIO LIVE</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-space-850 rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-space-900/95 border-b border-cyan-500/20 backdrop-blur-2xl">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActivePage(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-left transition-all ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-500/30'
                      : 'text-slate-200 hover:bg-space-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
