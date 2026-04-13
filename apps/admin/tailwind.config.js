/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'crisis-dark': '#0B1220',
        'crisis-cyan': '#00D9FF',
        'crisis-blue': '#0066FF',
        'crisis-danger': '#FF0033',
        'crisis-warning': '#FFB800',
        'crisis-safe': '#00DD66',
        'crisis-panel': 'rgba(15, 18, 32, 0.7)',
        'crisis-edge': 'rgba(0, 217, 255, 0.1)',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.25)',
        'glow-red': '0 0 20px rgba(255, 0, 51, 0.25)',
        'glow-amber': '0 0 20px rgba(255, 184, 0, 0.25)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift': 'drift 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            'box-shadow': '0 0 10px rgba(0, 217, 255, 0.4)',
          },
          '50%': {
            'box-shadow': '0 0 20px rgba(0, 217, 255, 0.8)',
          },
        },
        'drift': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};
