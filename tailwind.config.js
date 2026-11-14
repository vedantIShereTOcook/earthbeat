/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#060a17',
          850: '#0a1024',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          glow: '#00f0ff',
        },
        electric: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          glow: '#38bdf8',
        },
        stellar: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          glow: '#d8b4fe',
        },
        telemetry: {
          green: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444',
          cyan: '#00f0ff',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.35)',
        'glow-blue': '0 0 25px rgba(59, 130, 246, 0.35)',
        'glow-violet': '0 0 25px rgba(168, 85, 247, 0.35)',
        'hud': '0 0 15px rgba(0, 240, 255, 0.15), inset 0 0 15px rgba(0, 240, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 60s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
