export interface GenericDataRecord {
  step: number;
  label: string;
  timestamp: string;
  primaryValue: number;
  primaryUnit: string;
  secondaryValue: number;
  secondaryUnit: string;
  tertiaryValue?: number;
  tertiaryUnit?: string;
  region: string;
  note: string;
}

// 1. NIGHT LIGHTS (VIIRS Black Marble Annual Radiance 2012-2023)
export const NIGHT_LIGHTS_DATA: GenericDataRecord[] = [
  { step: 0, label: '2012 Baseline', timestamp: '2012-07-01', primaryValue: 24.5, primaryUnit: 'nW/(cm²·sr)', secondaryValue: 0.0, secondaryUnit: '% Δ', region: 'Global Urban Core Avg', note: 'Suomi-NPP VIIRS First Baseline' },
  { step: 1, label: '2013 Expansion', timestamp: '2013-07-01', primaryValue: 25.8, primaryUnit: 'nW/(cm²·sr)', secondaryValue: 5.3, secondaryUnit: '% Δ', region: 'East Asia & India', note: 'Rural electrification expansion' },
  { step: 2, label: '2014 Growth', timestamp: '2014-07-01', primaryValue: 27.2, primaryUnit: 'nW/(cm²·sr)', secondaryValue: 11.0, secondaryUnit: '% Δ', region: 'Global Megacities', note: 'LED conversion begins in Europe' },
  { step: 3, label: '2015 Industrial', timestamp: '2015-07-01', primaryValue: 28.9, primaryUnit: 'nW/(cm²·sr)', secondaryValue: 17.9, secondaryUnit: '% Δ', region: 'South Asia Corridor', note: 'Rapid industrial corridor illumination' },
  { step: 4, label: '2016 Peak Shift', timestamp: '2016-07-01', primaryValue: 30.4, primaryUnit: 'nW/(cm²·sr)', secondaryValue: 24.1, secondaryUnit: '% Δ', region: 'Middle East & Gulf', note: 'Infrastructure development' },
  { step: 5, label: '2017 Grid Maturation', timestamp: '2017-07-01', primaryValue: 31.8, primaryUnit: 'nW/(cm²·sr)', secondaryValue: 29.8, secondaryUnit: '% Δ', region: 'North America / East Coast', note: 'Highway and logistics hub lighting' },
  { step: 6, label: '2018 High Electrification', timestamp: '2018-07-01', primaryValue: 33.5, primaryUnit: 'nW/(cm²·sr)', secondaryValue: 36.7, secondaryUnit: '% Δ', region: 'India Subcontinent', note: 'National grid reaches remote villages' },
  { step: 7, label: '2019 Global Apex', timestamp: '2019-07-01', primaryValue: 35.1, primaryUnit: 'nW/(cm²·sr)', secondaryValue: 43.3, secondaryUnit: '% Δ', region: 'Global Aggregates', note: 'Pre-pandemic peak illumination' },
  { step: 8, label: '2020 Pandemic Dips', timestamp: '2020-07-01', primaryValue: 29.4, primaryUnit: 'nW/(cm²·sr)', secondaryValue: -16.2, secondaryUnit: '% Δ', region: 'Commercial & Transport Sectors', note: 'Global lockdowns reduce commercial light' },
  { step: 9, label: '2021 Rebound', timestamp: '2021-07-01', primaryValue: 34.0, primaryUnit: 'nW/(cm²·sr)', secondaryValue: 15.6, secondaryUnit: '% Δ', region: 'Manufacturing Belts', note: 'Industrial activity resumes' },
  { step: 10, label: '2022 Crisis Disruption', timestamp: '2022-07-01', primaryValue: 31.2, primaryUnit: 'nW/(cm²·sr)', secondaryValue: -8.2, secondaryUnit: '% Δ', region: 'Eastern Europe / Ukraine', note: 'Conflict and power grid damage blackouts' },
  { step: 11, label: '2023 Modern Footprint', timestamp: '2023-07-01', primaryValue: 36.8, primaryUnit: 'nW/(cm²·sr)', secondaryValue: 50.2, secondaryUnit: '% Δ', region: 'Global Summary', note: 'Net decadal brightening (+50.2% vs 2012)' },
];

// 2. LIGHTNING PULSE (ISS-LIS 2017-2023 Quality-Controlled Optical Flashes)
export const LIGHTNING_DATA: GenericDataRecord[] = [
  { step: 0, label: 'Lake Maracaibo Hotspot', timestamp: '2018-05-12T03:14:22Z', primaryValue: 320.5, primaryUnit: 'μJ/(m²·sr)', secondaryValue: 42.1, secondaryUnit: 'ms', region: 'Venezuela (Catatumbo)', note: 'Earth’s highest lightning density' },
  { step: 1, label: 'Congo Basin Supercell', timestamp: '2018-09-24T18:45:09Z', primaryValue: 285.0, primaryUnit: 'μJ/(m²·sr)', secondaryValue: 38.4, secondaryUnit: 'ms', region: 'Democratic Republic of Congo', note: 'Massive equatorial convection' },
  { step: 2, label: 'Florida Squall Line', timestamp: '2019-07-08T20:11:45Z', primaryValue: 210.4, primaryUnit: 'μJ/(m²·sr)', secondaryValue: 29.2, secondaryUnit: 'ms', region: 'Gulf Coast, USA', note: 'Sea breeze boundary convergence' },
  { step: 3, label: 'Brahmaputra Pre-Monsoon', timestamp: '2020-04-18T14:20:10Z', primaryValue: 260.8, primaryUnit: 'μJ/(m²·sr)', secondaryValue: 34.7, secondaryUnit: 'ms', region: 'Northeastern India', note: 'Severe orographic pre-monsoon storm' },
  { step: 4, label: 'Amazon Basin Arc', timestamp: '2021-02-15T22:33:18Z', primaryValue: 195.2, primaryUnit: 'μJ/(m²·sr)', secondaryValue: 25.0, secondaryUnit: 'ms', region: 'Rondônia, Brazil', note: 'Rainforest diurnal convection' },
  { step: 5, label: 'Great Plains Mesoscale', timestamp: '2021-06-03T02:08:50Z', primaryValue: 345.0, primaryUnit: 'μJ/(m²·sr)', secondaryValue: 52.3, secondaryUnit: 'ms', region: 'Kansas/Oklahoma, USA', note: 'Nocturnal mesoscale convective system' },
  { step: 6, label: 'Maritime Continent Jet', timestamp: '2022-11-20T16:55:04Z', primaryValue: 230.1, primaryUnit: 'μJ/(m²·sr)', secondaryValue: 31.5, secondaryUnit: 'ms', region: 'Sumatra, Indonesia', note: 'Tropical island boundary interaction' },
  { step: 7, label: 'Northern Australia Hector', timestamp: '2023-01-14T05:42:30Z', primaryValue: 275.6, primaryUnit: 'μJ/(m²·sr)', secondaryValue: 36.8, secondaryUnit: 'ms', region: 'Tiwi Islands, Australia', note: 'Classic "Hector the Convector" storm' },
];

// 3. CARBON SOUNDSCAPE (DYAMOND & OCO-2 Global CO2 in ppm)
export const CARBON_DATA: GenericDataRecord[] = [
  { step: 0, label: 'Winter Accumulation', timestamp: '2020-01-15', primaryValue: 413.2, primaryUnit: 'ppm', secondaryValue: 2.4, secondaryUnit: 'ppm/yr', region: 'Northern Hemisphere Mid-latitudes', note: 'Dormant biosphere, fossil heating emissions' },
  { step: 1, label: 'Northern Spring Peak', timestamp: '2020-05-10', primaryValue: 417.1, primaryUnit: 'ppm', secondaryValue: 2.6, secondaryUnit: 'ppm/yr', region: 'Mauna Loa Observatory Anchor', note: 'Annual peak before vegetation flush' },
  { step: 2, label: 'Summer Drawdown Begins', timestamp: '2020-07-20', primaryValue: 411.5, primaryUnit: 'ppm', secondaryValue: -5.6, secondaryUnit: 'ppm Δ', region: 'Boreal Forests (Taiga / Canada / Siberia)', note: 'Photosynthetic carbon uptake' },
  { step: 3, label: 'Annual Minimum (Breathing)', timestamp: '2020-09-25', primaryValue: 408.8, primaryUnit: 'ppm', secondaryValue: -8.3, secondaryUnit: 'ppm Δ', region: 'Global Arctic/Boreal Tundra', note: 'Maximum terrestrial carbon sink' },
  { step: 4, label: 'Autumn Respiration', timestamp: '2020-11-15', primaryValue: 412.9, primaryUnit: 'ppm', secondaryValue: 4.1, secondaryUnit: 'ppm Δ', region: 'Temperate Deciduous Zone', note: 'Decay of foliage releases CO2 back' },
  { step: 5, label: '2021 Winter Apex', timestamp: '2021-04-30', primaryValue: 419.0, primaryUnit: 'ppm', secondaryValue: 2.5, secondaryUnit: 'ppm/yr', region: 'Northern Continents', note: 'Global atmospheric baseline shifts upward' },
  { step: 6, label: '2022 Summer Trough', timestamp: '2022-09-20', primaryValue: 413.4, primaryUnit: 'ppm', secondaryValue: 2.3, secondaryUnit: 'ppm/yr', region: 'Northern Hemisphere Forests', note: 'Boreal drawdown cannot offset baseline' },
  { step: 7, label: '2023 New High Record', timestamp: '2023-05-15', primaryValue: 424.0, primaryUnit: 'ppm', secondaryValue: 2.8, secondaryUnit: 'ppm/yr', region: 'Global Mean Atmosphere', note: 'Surpasses 424 ppm for first time in human history' },
];

// 4. ATMOSPHERIC WAVES (GEOS Aerosols: Sea Salt, Dust, Smoke, Sulfate)
export const AEROSOL_DATA: GenericDataRecord[] = [
  { step: 0, label: 'Quiet Atmosphere', timestamp: '2017-08-01', primaryValue: 0.12, primaryUnit: 'AOD 550nm', secondaryValue: 8.4, secondaryUnit: 'μg/m³ PM2.5', region: 'North Atlantic Ocean', note: 'Background clean marine troposphere' },
  { step: 1, label: 'Saharan Dust Outbreak', timestamp: '2017-08-15', primaryValue: 1.45, primaryUnit: 'AOD 550nm', secondaryValue: 125.0, secondaryUnit: 'μg/m³ PM2.5', region: 'Cape Verde to Caribbean', note: 'Massive dust plume suppressing cyclones' },
  { step: 2, label: 'Hurricane Harvey Whipping Sea Salt', timestamp: '2017-08-25', primaryValue: 1.95, primaryUnit: 'AOD 550nm', secondaryValue: 180.2, secondaryUnit: 'μg/m³ PM2.5', region: 'Gulf of Mexico', note: 'Hurricane winds aerosolize ocean sea salt' },
  { step: 3, label: 'Pacific Northwest Wildfire Smoke', timestamp: '2017-09-04', primaryValue: 2.30, primaryUnit: 'AOD 550nm', secondaryValue: 285.5, secondaryUnit: 'μg/m³ PM2.5', region: 'Washington & Oregon, USA', note: 'Severe wildfire organic carbon plume' },
  { step: 4, label: 'Hurricane Irma Massive Vortices', timestamp: '2017-09-08', primaryValue: 2.45, primaryUnit: 'AOD 550nm', secondaryValue: 210.0, secondaryUnit: 'μg/m³ PM2.5', region: 'Leeward Islands / Caribbean', note: 'Category 5 wind-driven sea spray' },
  { step: 5, label: 'Transatlantic Smoke Crossing', timestamp: '2017-09-18', primaryValue: 0.85, primaryUnit: 'AOD 550nm', secondaryValue: 48.0, secondaryUnit: 'μg/m³ PM2.5', region: 'Mid-Atlantic to Western Europe', note: 'North American smoke reaches UK and France' },
  { step: 6, label: 'Hurricane Maria Sea Salt Plume', timestamp: '2017-09-20', primaryValue: 2.15, primaryUnit: 'AOD 550nm', secondaryValue: 195.0, secondaryUnit: 'μg/m³ PM2.5', region: 'Puerto Rico', note: 'Intense optical extinction from sea spray' },
  { step: 7, label: 'Fall Clearing Phase', timestamp: '2017-10-25', primaryValue: 0.28, primaryUnit: 'AOD 550nm', secondaryValue: 14.2, secondaryUnit: 'μg/m³ PM2.5', region: 'Atlantic Basin', note: 'Atmospheric aerosols wash out by rain' },
];

// 5. FOREST FREQUENCIES (GEDI Lidar Canopy Height in meters)
export const FOREST_DATA: GenericDataRecord[] = [
  { step: 0, label: 'Savanna / Scrubland', timestamp: '2020-03-01', primaryValue: 4.5, primaryUnit: 'meters', secondaryValue: 0.8, secondaryUnit: 'PAI m²/m²', region: 'Cerrado, Brazil', note: 'Sparse, open woody shrubs' },
  { step: 1, label: 'Miombo Woodland', timestamp: '2020-05-15', primaryValue: 14.2, primaryUnit: 'meters', secondaryValue: 1.9, secondaryUnit: 'PAI m²/m²', region: 'Zambia / Southern Africa', note: 'Dry deciduous woodland' },
  { step: 2, label: 'Boreal Taiga Black Spruce', timestamp: '2020-07-22', primaryValue: 18.5, primaryUnit: 'meters', secondaryValue: 2.4, secondaryUnit: 'PAI m²/m²', region: 'Fairbanks, Alaska', note: 'Cold-adapted conifer forest' },
  { step: 3, label: 'Temperate Mixed Hardwood', timestamp: '2020-09-10', primaryValue: 28.6, primaryUnit: 'meters', secondaryValue: 4.2, secondaryUnit: 'PAI m²/m²', region: 'Great Smoky Mountains, USA', note: 'Oak-hickory multi-layered canopy' },
  { step: 4, label: 'Congo Basin Primary Rainforest', timestamp: '2021-01-18', primaryValue: 44.8, primaryUnit: 'meters', secondaryValue: 5.8, secondaryUnit: 'PAI m²/m²', region: 'Salonga National Park, DRC', note: 'Dense tropical moist forest' },
  { step: 5, label: 'Central Amazonian Emergent Trees', timestamp: '2021-04-12', primaryValue: 52.3, primaryUnit: 'meters', secondaryValue: 6.7, secondaryUnit: 'PAI m²/m²', region: 'Manaus, Brazil', note: 'Giant Angelim vermelho trees' },
  { step: 6, label: 'Pacific Northwest Coast Redwood', timestamp: '2021-08-30', primaryValue: 64.2, primaryUnit: 'meters', secondaryValue: 7.9, secondaryUnit: 'PAI m²/m²', region: 'Humboldt County, California', note: 'Earth’s tallest temperate rainforest' },
];

// 6. ATMOSPHERIC RIVER (SVS 4884 Moisture Flux IVT & TPW)
export const ATMOSPHERIC_RIVER_DATA: GenericDataRecord[] = [
  { step: 0, label: 'Pre-Event Marine State', timestamp: '2020-01-20T00:00Z', primaryValue: 180, primaryUnit: 'kg/(m·s) IVT', secondaryValue: 18.2, secondaryUnit: 'mm TPW', region: 'Subtropical East Pacific', note: 'Normal zonal moisture distribution' },
  { step: 1, label: 'Tropical Moisture Entrainment', timestamp: '2020-01-22T12:00Z', primaryValue: 360, primaryUnit: 'kg/(m·s) IVT', secondaryValue: 29.5, secondaryUnit: 'mm TPW', region: 'Hawaii (Pineapple Express Origin)', note: 'Narrow filament of deep tropical vapor' },
  { step: 2, label: 'AR Cat 1 - Weak Corridor', timestamp: '2020-01-24T06:00Z', primaryValue: 510, primaryUnit: 'kg/(m·s) IVT', secondaryValue: 38.0, secondaryUnit: 'mm TPW', region: 'Eastern Pacific Jet Stream', note: 'Low-level jet accelerates vapor transport' },
  { step: 3, label: 'AR Cat 3 - Strong Moisture Jet', timestamp: '2020-01-25T18:00Z', primaryValue: 820, primaryUnit: 'kg/(m·s) IVT', secondaryValue: 49.4, secondaryUnit: 'mm TPW', region: 'Offshore California/Oregon', note: 'Moisture flux equivalent to 10 Mississippi Rivers' },
  { step: 4, label: 'AR Cat 5 - Extreme Atmospheric River', timestamp: '2020-01-26T12:00Z', primaryValue: 1150, primaryUnit: 'kg/(m·s) IVT', secondaryValue: 62.8, secondaryUnit: 'mm TPW', region: 'Coastal Mountain Approach', note: 'Extreme hazard of debris flow and flooding' },
  { step: 5, label: 'Orographic Landfall & Torrents', timestamp: '2020-01-27T00:00Z', primaryValue: 980, primaryUnit: 'kg/(m·s) IVT', secondaryValue: 55.0, secondaryUnit: 'mm TPW', region: 'Sierra Nevada Western Slopes', note: 'Forced ascent causes torrential rain & snow' },
  { step: 6, label: 'Inland Dissipation', timestamp: '2020-01-28T06:00Z', primaryValue: 280, primaryUnit: 'kg/(m·s) IVT', secondaryValue: 22.1, secondaryUnit: 'mm TPW', region: 'Great Basin Interior', note: 'Atmospheric river moisture exhausted' },
];
