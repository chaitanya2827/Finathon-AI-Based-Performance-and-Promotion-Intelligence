/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040d1a',
          900: '#061426', // Primary base background
          850: '#07172b',
          800: '#081A2F', // Dark navy
          750: '#0a1e36',
          700: '#0B223D', // Secondary navy
          600: '#0F2C4C',
          500: '#153A62',
          400: '#1F4B7A',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9', // Light cyan
          400: '#22d3ee', // Primary accent cyan
          500: '#06b6d4', // Bright cyan
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        slate: {
          850: '#0c1626',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
        'glass-hover': '0 12px 40px 0 rgba(6, 182, 212, 0.16)',
        'cyan-glow': '0 0 20px -2px rgba(34, 211, 238, 0.35)',
        'cyan-glow-sm': '0 0 12px 0 rgba(34, 211, 238, 0.25)',
        'cyan-glow-lg': '0 0 35px 2px rgba(34, 211, 238, 0.2)',
      },
      borderColor: {
        'glass': 'rgba(103, 232, 249, 0.18)',
        'glass-bright': 'rgba(34, 211, 238, 0.35)',
      },
      backgroundColor: {
        'glass': 'rgba(10, 30, 55, 0.55)',
        'glass-light': 'rgba(15, 40, 70, 0.55)',
        'glass-hover': 'rgba(20, 55, 90, 0.65)',
      }
    },
  },
  plugins: [],
}
