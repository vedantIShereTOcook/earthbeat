import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { OceanSymphony } from './pages/OceanSymphony';
import { Explore } from './pages/Explore';
import { ExperienceDetail } from './pages/ExperienceDetail';
import { HowItWorks } from './pages/HowItWorks';
import { DataSources } from './pages/DataSources';
import { About } from './pages/About';
import { Disc3, Globe2, Heart, ExternalLink } from 'lucide-react';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedExperienceId, setSelectedExperienceId] = useState<string>('night-frequencies');
  const [isMuted, setIsMuted] = useState(false);

  const handleNavigate = (page: string, experienceId?: string) => {
    if (experienceId) {
      setSelectedExperienceId(experienceId);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-space-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <Home onNavigate={handleNavigate} />
        )}
        {activePage === 'ocean-symphony' && (
          <OceanSymphony />
        )}
        {activePage === 'explore' && (
          <Explore onNavigate={handleNavigate} />
        )}
        {activePage === 'experience-detail' && (
          <ExperienceDetail
            experienceId={selectedExperienceId}
            onBack={() => handleNavigate('explore')}
          />
        )}
        {activePage === 'how-it-works' && (
          <HowItWorks />
        )}
        {activePage === 'data-sources' && (
          <DataSources />
        )}
        {activePage === 'about' && (
          <About />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/15 bg-space-950/90 py-12 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-cyan-400" />
              <span className="text-lg font-bold tracking-wider text-white">
                EARTH<span className="text-cyan-400">BEAT</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-[10px] text-cyan-300 border border-cyan-500/30">
                NASA Space Apps 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-md">
              "An interactive Earth science experience that transforms NASA's visualisations and scientific data into real-time sound, allowing people to explore our changing planet through both sight and hearing."
            </p>
            <p className="text-[11px] text-slate-500">
              Official Challenge: The Earth Information Jukebox • NASA Goddard & EIC
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Applications
            </span>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => handleNavigate('ocean-symphony')} className="hover:text-cyan-300 transition-colors">
                  Ocean Symphony (Flagship)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('experience-detail', 'night-frequencies')} className="hover:text-cyan-300 transition-colors">
                  Night Frequencies (VIIRS)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('experience-detail', 'lightning-pulse')} className="hover:text-cyan-300 transition-colors">
                  Lightning Pulse (ISS-LIS)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('experience-detail', 'carbon-soundscape')} className="hover:text-cyan-300 transition-colors">
                  Carbon Soundscape (DYAMOND)
                </button>
              </li>
            </ul>
          </div>

          {/* Supporting Resources */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              NASA Resources
            </span>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li>
                <a href="https://www.earth.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 flex items-center gap-1">
                  <span>Earth Information Center</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://svs.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 flex items-center gap-1">
                  <span>NASA SVS Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.earthdata.nasa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 flex items-center gap-1">
                  <span>NASA Earthdata</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button onClick={() => handleNavigate('how-it-works')} className="hover:text-cyan-300">
                  Sonification Methodology
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 EARTHBEAT Project. Independent NASA Space Apps Challenge Submission.</p>
          <p className="flex items-center gap-1">
            Built with Web Audio API, Three.js & genuine NASA Earth science data.
          </p>
        </div>
      </footer>

    </div>
  );
};
