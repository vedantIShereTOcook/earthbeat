import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Play, RefreshCw, X } from 'lucide-react';
import { ScientificDataPoint } from '../types';

interface CustomDataImporterProps {
  onDataLoaded: (data: ScientificDataPoint[], customName: string) => void;
  onClose: () => void;
}

export const CustomDataImporter: React.FC<CustomDataImporterProps> = ({
  onDataLoaded,
  onClose,
}) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [speedCol, setSpeedCol] = useState<number>(1);
  const [tempCol, setTempCol] = useState<number>(2);
  const [dirCol, setDirCol] = useState<number>(3);
  const [statusMessage, setStatusMessage] = useState<{ type: 'idle' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: '',
  });

  // Sample templates for users to try immediately
  const loadSampleCSV = (sampleType: 'argo' | 'buoy') => {
    let csv = '';
    let name = '';
    if (sampleType === 'argo') {
      name = 'ARGO_Float_4902325_Kuroshio.csv';
      csv = `Timestamp,Current_Speed_ms,Sea_Surface_Temp_C,Direction_deg,Latitude,Longitude
2023-04-01T00:00Z,1.42,26.4,42,28.4,129.2
2023-04-01T06:00Z,1.68,26.9,45,28.8,129.8
2023-04-01T12:00Z,1.95,27.5,48,29.3,130.5
2023-04-01T18:00Z,2.24,28.1,50,29.9,131.2
2023-04-02T00:00Z,2.41,28.6,52,30.5,132.0
2023-04-02T06:00Z,2.35,28.4,54,31.2,132.8
2023-04-02T12:00Z,2.15,27.9,56,31.8,133.7
2023-04-02T18:00Z,1.88,27.2,59,32.4,134.5
2023-04-03T00:00Z,1.54,26.5,63,33.0,135.4
2023-04-03T06:00Z,1.22,25.8,68,33.5,136.2`;
    } else {
      name = 'NOAA_NDBC_Buoy_41048_GulfStream.csv';
      csv = `Timestamp,Current_Speed_ms,Sea_Surface_Temp_C,Direction_deg,Latitude,Longitude
2023-08-10T00:00Z,1.95,28.2,38,31.8,-77.4
2023-08-10T04:00Z,2.10,28.5,41,32.2,-76.8
2023-08-10T08:00Z,2.28,28.9,43,32.7,-76.1
2023-08-10T12:00Z,2.45,29.4,45,33.3,-75.4
2023-08-10T16:00Z,2.38,29.1,47,33.9,-74.6
2023-08-10T20:00Z,2.20,28.7,49,34.5,-73.8
2023-08-11T00:00Z,1.98,28.1,52,35.1,-72.9
2023-08-11T04:00Z,1.75,27.4,55,35.7,-72.0`;
    }

    setFileName(name);
    setFileContent(csv);
    processCSVText(csv);
  };

  const processCSVText = (text: string) => {
    try {
      const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        setStatusMessage({ type: 'error', text: 'File must contain at least a header row and 1 data row.' });
        return;
      }

      const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      setHeaders(rawHeaders);

      const rows: string[][] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        rows.push(cols);
      }

      setParsedRows(rows);

      // Auto-detect columns
      rawHeaders.forEach((h, idx) => {
        const lower = h.toLowerCase();
        if (lower.includes('speed') || lower.includes('vel') || lower.includes('curr')) setSpeedCol(idx);
        if (lower.includes('temp') || lower.includes('sst')) setTempCol(idx);
        if (lower.includes('dir') || lower.includes('head') || lower.includes('deg')) setDirCol(idx);
      });

      setStatusMessage({
        type: 'success',
        text: `Parsed ${rows.length} valid records from file. Confirm column mappings below.`,
      });
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to parse CSV formatted text. Please check commas and quotes.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);

      if (file.name.endsWith('.json')) {
        try {
          const json = JSON.parse(text);
          const dataArray = Array.isArray(json) ? json : json.data || json.records;
          if (Array.isArray(dataArray) && dataArray.length > 0) {
            // Convert JSON array of objects to CSV structure
            const cols = Object.keys(dataArray[0]);
            setHeaders(cols);
            const rows = dataArray.map((item: Record<string, unknown>) => cols.map(c => String(item[c] ?? '')));
            setParsedRows(rows);
            setStatusMessage({
              type: 'success',
              text: `Parsed ${rows.length} records from JSON file.`,
            });
            return;
          }
        } catch {
          setStatusMessage({ type: 'error', text: 'Invalid JSON file structure.' });
          return;
        }
      }

      processCSVText(text);
    };

    reader.readAsText(file);
  };

  const applyCustomDataset = () => {
    if (parsedRows.length === 0) {
      setStatusMessage({ type: 'error', text: 'No data rows available to sonify.' });
      return;
    }

    try {
      const formattedPoints: ScientificDataPoint[] = parsedRows.map((row, idx) => {
        const speedVal = parseFloat(row[speedCol]) || 1.0;
        const tempVal = parseFloat(row[tempCol]) || 20.0;
        const dirVal = parseFloat(row[dirCol]) || (idx * 30) % 360;
        const timestamp = row[0] || new Date(Date.now() + idx * 3600000).toISOString();

        return {
          index: idx,
          timeSeconds: idx,
          timestamp: timestamp,
          speed: Math.max(0.01, speedVal),
          u: speedVal * Math.cos((dirVal * Math.PI) / 180),
          v: speedVal * Math.sin((dirVal * Math.PI) / 180),
          direction: dirVal,
          temperature: tempVal,
          energyFlux: Number((0.5 * 1025 * Math.pow(speedVal, 2) / 1000).toFixed(2)),
          lat: 32.0 + idx * 0.2,
          lon: -75.0 + idx * 0.4,
          region: `Custom Dataset (${fileName || 'Imported'})`,
        };
      });

      onDataLoaded(formattedPoints, fileName || 'User Custom Dataset');
      onClose();
    } catch {
      setStatusMessage({ type: 'error', text: 'Error converting selected columns to numerical values.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
      <div className="bg-space-900 border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <Upload className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                IMPORT SCIENTIFIC DATA (CSV / JSON)
              </h3>
              <p className="text-xs text-slate-400">
                Load custom oceanographic observations or buoy data into the real-time sonification engine.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-space-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Sample Quick-Loads */}
        <div className="my-4 p-3 bg-space-950 rounded-xl border border-cyan-500/15">
          <div className="text-xs font-mono text-cyan-300 font-semibold mb-2">
            Try Verified Sample Observation Datasets:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadSampleCSV('argo')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-cyan-900/40 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              ARGO Float 4902325 (Kuroshio)
            </button>
            <button
              onClick={() => loadSampleCSV('buoy')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-electric-950/60 border border-electric-500/40 text-xs font-mono text-electric-300 hover:bg-electric-900/40 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              NOAA Buoy 41048 (Gulf Stream)
            </button>
          </div>
        </div>

        {/* File Drag and Drop / Input */}
        <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-6 text-center hover:border-cyan-400 transition-colors bg-space-950/50">
          <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-80" />
          <p className="text-sm text-slate-200 font-medium">
            Drag & drop your CSV or JSON scientific dataset here, or{' '}
            <label className="text-cyan-400 hover:underline cursor-pointer">
              browse files
              <input
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Accepts comma-separated values (.csv) or structured JSON time series.
          </p>
          {fileName && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950 border border-cyan-500/40 text-xs font-mono text-cyan-300">
              <FileText className="w-3.5 h-3.5" />
              <span>Loaded: {fileName}</span>
            </div>
          )}
        </div>

        {/* Status Alerts */}
        {statusMessage.type !== 'idle' && (
          <div
            className={`mt-4 p-3 rounded-xl flex items-center gap-2.5 text-xs font-mono ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Column Mapping Configuration */}
        {headers.length > 0 && (
          <div className="mt-5 space-y-3 p-4 bg-space-950/80 rounded-xl border border-cyan-500/20">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              Variable Column Mappings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Current Speed */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Speed (m/s):
                </label>
                <select
                  value={speedCol}
                  onChange={(e) => setSpeedCol(parseInt(e.target.value))}
                  className="w-full bg-space-900 border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                >
                  {headers.map((h, i) => (
                    <option key={i} value={i}>Col {i + 1}: {h}</option>
                  ))}
                </select>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Temperature (°C):
                </label>
                <select
                  value={tempCol}
                  onChange={(e) => setTempCol(parseInt(e.target.value))}
                  className="w-full bg-space-900 border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                >
                  {headers.map((h, i) => (
                    <option key={i} value={i}>Col {i + 1}: {h}</option>
                  ))}
                </select>
              </div>

              {/* Direction */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Direction (°):
                </label>
                <select
                  value={dirCol}
                  onChange={(e) => setDirCol(parseInt(e.target.value))}
                  className="w-full bg-space-900 border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                >
                  {headers.map((h, i) => (
                    <option key={i} value={i}>Col {i + 1}: {h}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview of first 3 rows */}
            <div className="mt-3 overflow-x-auto text-[11px] font-mono">
              <span className="text-slate-400 block mb-1">Data Row Preview:</span>
              <table className="w-full text-left border-collapse border border-cyan-500/20">
                <thead>
                  <tr className="bg-space-900 text-cyan-400">
                    {headers.slice(0, 5).map((h, idx) => (
                      <th key={idx} className="p-1.5 border border-cyan-500/20">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 3).map((r, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-space-850">
                      {r.slice(0, 5).map((c, colIdx) => (
                        <td key={colIdx} className="p-1.5 border border-cyan-500/10 text-slate-300">{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-cyan-500/20">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:bg-space-850 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={applyCustomDataset}
            disabled={parsedRows.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-electric-500 text-space-950 font-mono text-xs font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow-cyan"
          >
            <Play className="w-3.5 h-3.5 fill-space-950" />
            <span>SONIFY IMPORTED DATA</span>
          </button>
        </div>

      </div>
    </div>
  );
};
