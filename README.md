# EARTHBEAT: THE SOUND OF OUR PLANET
### NASA Space Apps Challenge 2026 Submission
### Official Challenge: The Earth Information Jukebox
**"See the Earth change. Hear the Earth change."**

[![NASA Space Apps 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Challenge-00f0ff?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio-48kHz%20Native-3b82f6?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black?style=for-the-badge&logo=three.js)](https://threejs.org/)

---

## 1. Project Overview

**EARTHBEAT** is an interactive Earth science application that transforms NASA Earth Information Center (EIC) scientific visualisations and underlying numerical observations into dynamic, real-time sound. 

By pairing high-resolution scientific visual frames with parameter-mapped sonifications (PMSon) running in real time via the native Web Audio API, EARTHBEAT allows users to explore planetary dynamics through both sight and hearing.

Unlike artistic music projects, **EARTHBEAT does not use arbitrary background music, sound effects, or prerecorded nature tracks**. Every acoustic pulse rate, melodic frequency, resonance sweep, and stereo panning coordinate is generated deterministically from genuine NASA peer-reviewed datasets and models.

---

## 2. Flagship Experience: Ocean Symphony

The centerpiece of EARTHBEAT is **Ocean Symphony**, built from NASA Scientific Visualization Studio (SVS) ID #3912 (*Global Sea Surface Currents and Temperature*) and the joint NASA Jet Propulsion Laboratory (JPL) & MIT **ECCO2** (*Estimating the Circulation and Climate of the Ocean, Phase II*) model.

```
                      NASA ECCO2 SYNTHESIS PIPELINE
                                
  Satellite Altimetry (TOPEX/Jason) ──┐
  GRACE Ocean Mass Gravity        ────┼──> [ MIT General Circulation Model ]
  Satellite SST (AMSR-E/MODIS)     ───┤               │
  In-situ ARGO Profiling Floats   ────┘               ▼
                                            [ NASA SVS #3912 Frames ]
                                            [ 112s Synchronised Data ]
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼                                                             ▼
            [ Visual Stage & Telemetry ]                                [ Real-Time Sonification Engine ]
            • Surface Current Flow Vectors                              • Current Speed  ──> Rhythmic BPM (40-220)
            • Sea Surface Temp Heatmap                                  • Surface Temp   ──> Musical Pitch (130-660Hz)
            • Flow Direction (0-360°)                                   • Flow Heading   ──> Stereo Panning (-1.0 to +1.0)
            • Kinetic Energy Flux (kJ/m³)                               • Energy Flux    ──> Filter Cutoff (250-4800Hz)
```

### Supported Sonification Mappings:
1. **Ocean Symphony (Balanced Mode):** Current speed governs rhythmic pulse rate (40–220 BPM) and low-pass filter cutoff; Sea Surface Temperature drives modal pitch voicing (130–660 Hz); flow direction controls stereo field panning.
2. **Thermal Waves (Melodic Focus):** Focuses on thermal ocean mass. SST drives dual-oscillator harmonic chord roots with rich fifths; speed subtly modulates resonant shimmer.
3. **Kinetic Pulses (Rhythm Focus):** Emphasizes turbulent kinetic velocity. High-speed boundary currents trigger crisp acoustic sonar impulses whose decay times reflect kinetic flux.
4. **Spectral Ambient (Deep Space Drone):** Continuous planetary ambient drone where SST controls the modal harmonic root and current speeds sweep resonant bandpass filters.

---

## 3. The NASA Jukebox Collection

Beyond the flagship Ocean Symphony, EARTHBEAT provides a curated suite of official challenge experiences:

| Experience | Domain | NASA Resource | SVS ID | Key Scientific Variables | Acoustic Translation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Ocean Symphony** | Ocean | ECCO2 / MODIS | SVS #3912 | Current Speed ($m/s$), SST ($^\circ C$), Azimuth ($^\circ$) | Speed $\to$ Pulse BPM; SST $\to$ Musical Pitch; Heading $\to$ Panning | **Flagship (Available)** |
| **Night Frequencies** | Human Impact | VIIRS Black Marble | SVS #5276 | Radiance ($nW \cdot cm^{-2} \cdot sr^{-1}$), Decadal $\Delta\%$ | Radiance $\to$ Bell overtone frequency; Brightening $\to$ Harmonic shimmer | **Available** |
| **Lightning Pulse** | Atmosphere | ISS Lightning Sensor | SVS #5011 | Flash Radiance ($\mu J \cdot m^{-2} \cdot sr^{-1}$), Duration ($ms$) | Optical radiance $\to$ Electrostatic clicks; Duration $\to$ Decay envelope | **Available** |
| **Atmospheric Waves**| Atmosphere | GEOS Aerosol Models | SVS #12772 | Aerosol Optical Depth ($550nm$), $PM_{2.5}$ ($\mu g/m^3$) | AOD $\to$ Bandpass filter sweep; Particle density $\to$ Noise texture | **Available** |
| **Carbon Soundscape**| Biosphere | DYAMOND $CO_2$ Simulation| SVS #5196 | Carbon Dioxide ($ppm$), Seasonal Drawdown ($ppm/yr$) | $CO_2$ level $\to$ Deep fundamental drone ($55-110Hz$); Seasonal breathing | **Available** |
| **Forest Frequencies**| Biosphere | GEDI Spaceborne Lidar| SVS #13904| Canopy Height $RH_{100}$ ($m$), Plant Area Index ($m^2/m^2$)| Tree height $\to$ Vertical harmonic ladder (tall trees trigger flutes) | **Available** |
| **Atmospheric River**| Atmosphere | Earth System Model 3D| SVS #4884 | Integrated Vapor Transport ($kg \cdot m^{-1} \cdot s^{-1}$), TPW ($mm$)| Moisture flux $\to$ Rushing vapor filtration and resonant pitch tension | **Available** |

---

## 4. Technical Architecture & Modularity

EARTHBEAT is built with a strictly modular, client-side reactive architecture running on standard modern web primitives:

```
src/
├── audio/
│   └── sonificationEngine.ts    # Web Audio API engine (Oscillators, BiquadFilter, Panner, Compressor, Analyser)
├── components/
│   ├── AudioVisualizer.tsx       # Live 60fps HTML5 Canvas Oscilloscope & FFT Spectrum
│   ├── CustomDataImporter.tsx    # Drag-and-drop CSV/JSON parser with variable mapping & validation
│   ├── EarthGlobe.tsx            # Three.js interactive 3D Earth globe with telemetry beacons
│   ├── MappingSelector.tsx       # Interactive sonification model selector with signal diagrams
│   ├── Navbar.tsx                # Sci-fi glassmorphism header with global mute toggle
│   ├── TelemetryPanel.tsx        # Calibrated scientific metrics HUD with compass & gauges
│   └── TimelineController.tsx    # Synchronised scrubber, speed selector, transport controls
├── data/
│   ├── additionalDatasets.ts     # Verified scientific datasets for Night Lights, ISS-LIS, DYAMOND, GEDI
│   ├── experiencesData.ts        # Comprehensive metadata, variable units, and SVS citations
│   └── oceanData.ts              # High-resolution NASA ECCO2 SVS #3912 time series
├── pages/
│   ├── About.tsx                 # Mission, challenge description, WCAG 2.1 AA accessibility statement
│   ├── DataSources.tsx           # Scientific provenance directory, DAAC references, and DOIs
│   ├── ExperienceDetail.tsx      # Interactive player for individual NASA challenge experiences
│   ├── Explore.tsx               # Filterable planetary catalog with live search
│   ├── Home.tsx                  # Landing page with 3D Globe, Hero, and Sonification explainer
│   ├── HowItWorks.tsx            # Mathematics, PMSon transfer equations, and psychoacoustics
│   └── OceanSymphony.tsx         # Flagship interactive experience stage
└── types/
    └── index.ts                  # TypeScript data interfaces, metrics, and experience definitions
```

### Psychoacoustic Safety & Audio Limiting:
- **Zero Audio Pops/Clicks:** Every parameter change is interpolated across a $50ms$ time constant using `setTargetAtTime` and exponential ramps.
- **Hardware Compressor/Limiter:** A native `DynamicsCompressorNode` with $-18dB$ threshold, $30dB$ knee, and $12:1$ compression ratio guarantees that sudden data anomalies can never clip or damage user hearing.
- **Autoplay Compliance:** Strictly honors browser audio policies: audio context remains suspended until an explicit user interaction.

---

## 5. Mathematical Transfer Functions

### A. Sea Surface Temperature $\to$ Melodic Frequency
Normalized temperature $T_{norm} \in [0, 1]$ maps logarithmically to human musical range (C3 $130.81Hz$ to E5 $659.25Hz$):
$$f(T) = 130.81 \times 2^{(T_{norm} \times 2.3)} \text{ Hz}$$
Quantized to modal pentatonic degrees to preserve physical monotonicity while maintaining harmonic beauty.

### B. Current Velocity $\to$ Rhythmic Tempo & Cutoff Frequency
Speed $v \in [0.02, 2.85] \text{ m/s}$ dictates pulse BPM and filter cutoff brightness:
$$\text{BPM}(v) = 40 + (v_{norm} \times 180) \quad [40 - 220 \text{ BPM}]$$
$$f_c(v) = 250 + (v_{norm}^{1.4} \times 4500) \text{ Hz} \quad [250 - 4800 \text{ Hz}]$$

### C. Azimuth Heading $\to$ Stereo Field Panning
Current heading $\theta \in [0^\circ, 360^\circ]$ determines left/right spatialization:
$$\text{Pan}(\theta) = \sin\left(\frac{\theta \times \pi}{180}\right) \times 0.85 \quad [-0.85 \text{ (West)} \text{ to } +0.85 \text{ (East)}]$$

---

## 6. Accessibility Statement (WCAG 2.1 AA)

Accessibility is foundational to EARTHBEAT. By translating Earth observations into audio, the application acts as an assistive scientific platform for blind and visually impaired individuals:
- **Full Keyboard Navigation:** Spacebar toggles playback; Left/Right arrow keys seek; `M` toggles mute.
- **Screen Reader Announcements:** ARIA labels, semantic roles, and dynamic live updates announce numeric measurements.
- **Visible Sound Explanations:** Every experience clearly explains in text what physical variable causes each sound characteristic.
- **High-Contrast Laboratory Palette:** Adheres to WCAG 2.1 AA contrast standards for all labels, gauges, and graphs.

---

## 7. Setup & Local Development Instructions

### Prerequisites
- Node.js (v20.0.0 or higher)
- npm (v10.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/vpedapati/EARTHBEAT-NASA-SpaceApps.git
cd EARTHBEAT-NASA-SpaceApps

# Install dependencies
npm install

# Start local development server
npm run dev
```
The application will be live at `http://localhost:5173/`.

### Production Build
```bash
npm run build
npm run preview
```

### Automated End-to-End Verification Suite
EARTHBEAT includes an automated 15-point headless verification suite testing all challenge criteria:
```bash
node test-e2e.js
```

---

## 8. Verification & Test Results

All 15 official acceptance tests were performed on an active browser instance:

1. **Homepage Loading:** Verified title, 3D Earth globe, navigation links, and mission badge.
2. **Navigation to Ocean Symphony:** Verified routing and header rendering.
3. **NASA Visual Asset:** Verified SVS #3912 video stream (`ecco2_ocean.mp4`, 12.6MB) loaded.
4. **Scientific Telemetry Panel:** Verified initial calibrated values ($1.82 m/s$, $24.2^\circ C$, $48^\circ$).
5. **Playback Activation:** AudioContext initialized without browser autoplay blocking.
6. **Data-to-Sound Synthesis:** Verified Web Audio graph generating 48kHz tones and pulses.
7. **Synchronised Progression:** Verified audio and video timeline progressing in exact lockstep.
8. **Mapping Selection:** Switched between Symphony, Thermal Waves, Kinetic Pulses, and Ambient.
9. **Sonification Variation:** Verified harmonic chords and filter responses changing dynamically.
10. **Pause & Resume:** Verified instant audio ramp-down on pause and seamless resume.
11. **Timeline Seeking:** Seeked to Kuroshio waypoint ($t = 55s$); verified video and telemetry updated in sync.
12. **Lockstep Verification:** Confirmed telemetry values updated to match Kuroshio jet values ($2.45 m/s$, $29.8^\circ C$).
13. **Volume & Mute:** Verified smooth gain transitions without clicks.
14. **Mobile Responsiveness:** Verified viewport reflow on iPhone X ($375 \times 812$).
15. **Console Integrity:** Verified zero unhandled exceptions or critical errors during run.

---

## 9. Demonstration Script (3-Minute Tour)

1. **0:00 - 0:30 (Landing Page):**
   - Open homepage. Observe the 3D rotating Earth globe. Notice the glowing telemetry beacons marking the Gulf Stream, Kuroshio, and Antarctic Circumpolar Current.
   - Click "LAUNCH OCEAN SYMPHONY".
2. **0:30 - 1:30 (Ocean Symphony Playback):**
   - Click "START OCEAN SONIFICATION".
   - Notice the high-resolution SVS #3912 ocean currents animation begin playing.
   - Listen to the rhythmic pulse: as the Gulf Stream accelerates toward $2.44 m/s$, the pulse quickens (up to 215 BPM).
   - Listen to the pitch: as the current moves from tropical waters ($26.5^\circ C$) into subpolar northern waters ($4.2^\circ C$), hear the musical pitch drop gracefully into deep resonant tones.
   - Watch the live Oscilloscope and FFT spectrum reflect the exact acoustic frequencies.
3. **1:30 - 2:00 (Mapping & Seeking):**
   - Switch mode from "Ocean Symphony" to "Thermal Waves". Hear the sound transform into warm, dense fifth chords.
   - Click the "Antarctic Circumpolar (ACC)" waypoint. The timeline immediately seeks to $t = 80s$. Watch the video and telemetry jump in exact synchronization.
4. **2:00 - 2:30 (Custom Data Import):**
   - Click "Import CSV/JSON". Click "ARGO Float 4902325 (Kuroshio)".
   - Notice the automated column detection. Click "SONIFY IMPORTED DATA".
   - Hear the custom in-situ float data audified in real time!
5. **2:30 - 3:00 (Planetary Catalog):**
   - Navigate to "Explore Earth". Select "Night Frequencies".
   - Click "SONIFY" to hear 11 years of VIIRS Black Marble nighttime illumination changes.

---

## 10. Known Limitations

- **Browser Audio Context Gesture Gate:** Modern web browsers require an initial user click before allowing audio playback. EARTHBEAT gracefully handles this with a prominent "START OCEAN SONIFICATION" play button.
- **Hardware Acceleration:** The 3D Earth globe uses WebGL via Three.js. On low-end mobile devices without WebGL enabled, the application gracefully renders high-resolution 2D fallback visual frames.

---

## 11. NASA Attribution & Credits

- **NASA Scientific Visualization Studio (SVS):**
  - SVS #3912: *Global Sea Surface Currents and Temperature* (Horace Mitchell, ECCO2 Team)
  - SVS #5276: *Change in Night Lights between 2012 and 2023* (VIIRS Black Marble Team)
  - SVS #5011: *Lightning Events Detected from the ISS* (ISS-LIS Science Team)
  - SVS #12772: *Tracking Aerosols Over Land and Water* (GEOS Model, GMAO)
  - SVS #5196: *DYAMOND Global Carbon Dioxide* (GEOS Atmospheric Simulation)
  - SVS #13904: *GEDI Forest Canopy Height* (GEDI Science Team, UMD/NASA GSFC)
  - SVS #4884: *A 3D View of an Atmospheric River from an Earth System Model*
- **NASA Earth Information Center (EIC):** [https://www.earth.gov/](https://www.earth.gov/)
- **NASA Earthdata:** [https://www.earthdata.nasa.gov/](https://www.earthdata.nasa.gov/)

---

### Challenge Submission Notice
*This project is an independent submission created for the NASA Space Apps Challenge 2026. It is not an official product of the National Aeronautics and Space Administration.*
