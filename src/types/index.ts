export interface ScientificDataPoint {
  index: number;
  timeSeconds: number;
  timestamp: string;
  speed: number;        // Current speed in m/s (0.02 - 2.85 m/s)
  u: number;            // Zonal velocity (eastward +) in m/s
  v: number;            // Meridional velocity (northward +) in m/s
  direction: number;    // Flow heading in degrees (0 - 360)
  temperature: number;  // Sea surface temperature in °C (-1.8 - 32.0 °C)
  energyFlux: number;   // Kinetic energy flux in kJ/m³
  lat: number;          // Latitude in degrees (-90 to +90)
  lon: number;          // Longitude in degrees (-180 to +180)
  region: string;       // Current focus region
}

export type SonificationMode = 'symphony' | 'thermal' | 'kinetic' | 'ambient';

export interface SonificationMappingConfig {
  id: SonificationMode;
  name: string;
  tagline: string;
  description: string;
  primaryVariable: string;
  secondaryVariable: string;
  tertiaryVariable?: string;
  audioFeaturePrimary: string;
  audioFeatureSecondary: string;
  audioFeatureTertiary?: string;
}

export interface ExperienceMetadata {
  id: string;
  title: string;
  tagline: string;
  domain: 'Ocean' | 'Atmosphere' | 'Biosphere' | 'Cryosphere' | 'Human Impact' | 'Space Weather';
  status: 'Flagship - Available' | 'Available' | 'Science Preview' | 'Under Development';
  isAvailable: boolean;
  svsId: string;
  svsUrl: string;
  earthdataUrl: string;
  datasetName: string;
  instrumentOrModel: string;
  variables: Array<{
    name: string;
    unit: string;
    description: string;
    range: string;
  }>;
  temporalRange: string;
  spatialCoverage: string;
  description: string;
  sonificationDesign: string;
  mediaType: 'video' | 'image' | 'canvas';
  mediaUrl: string;
  fallbackImage: string;
  sampleDataCount: number;
}

export interface AudioEngineMetrics {
  frequency: number;
  bpm: number;
  filterCutoff: number;
  pan: number;
  gain: number;
  resonance: number;
}
