import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-border-shadow-soft-blue': 'pulse-border-shadow-soft-blue 2s infinite ease-in-out',
        'pulse-border-shadow-bright-purple': 'pulse-border-shadow-bright-purple 2s infinite ease-in-out',
        'pulse-border-shadow-green': 'pulse-border-shadow-green 2s infinite ease-in-out',
        'pulse-border-shadow-red': 'pulse-border-shadow-red 2s infinite ease-in-out',
        'pulse-border-shadow-orange': 'pulse-border-shadow-orange 2s infinite ease-in-out',
        'pulse-border-shadow-yellow': 'pulse-border-shadow-yellow 2s infinite ease-in-out',
        'pulse-border-shadow-pink': 'pulse-border-shadow-pink 2s infinite ease-in-out',
        'pulse-border-shadow-cyan': 'pulse-border-shadow-cyan 2s infinite ease-in-out',
        'pulse-border-shadow-violet': 'pulse-border-shadow-violet 2s infinite ease-in-out',
        'pulse-border-shadow-soft-pink': 'pulse-border-shadow-soft-pink 2s infinite ease-in-out',
      },
      keyframes: {
        'pulse-border-shadow-soft-blue': {
          '0%, 100%': { boxShadow: '0 4px 10px rgba(32, 32, 255, 0.6)' },
          '50%': { boxShadow: '0 8px 20px rgba(32, 32, 255, 0.2)' },
        },
        'pulse-border-shadow-bright-purple': {
          '0%, 100%': { boxShadow: '0 4px 12px rgba(95, 32, 255, 1)' },
          '50%': { boxShadow: '0 10px 30px rgba(95, 32, 255, 0.6)' },
        },
        'pulse-border-shadow-green': {
          '0%, 100%': { boxShadow: '0 4px 10px rgba(16, 185, 129, 0.6)' },
          '50%': { boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' },
        },
        'pulse-border-shadow-red': {
          '0%, 100%': { boxShadow: '0 4px 10px rgba(239, 68, 68, 0.8)' },
          '50%': { boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)' },
        },
        'pulse-border-shadow-orange': {
          '0%, 100%': { boxShadow: '0 4px 10px rgba(251, 146, 60, 0.8)' },
          '50%': { boxShadow: '0 8px 20px rgba(251, 146, 60, 0.5)' },
        },
        'pulse-border-shadow-yellow': {
          '0%, 100%': { boxShadow: '0 4px 10px rgba(245, 158, 11, 0.8)' },
          '50%': { boxShadow: '0 8px 20px rgba(245, 158, 11, 0.5)' },
        },
        'pulse-border-shadow-pink': {
          '0%, 100%': { boxShadow: '0 4px 10px rgba(236, 72, 153, 0.8)' },
          '50%': { boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)' },
        },
        'pulse-border-shadow-cyan': {
          '0%, 100%': { boxShadow: '0 4px 10px rgba(6, 182, 212, 0.8)' },
          '50%': { boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)' },
        },
        'pulse-border-shadow-violet': {
          '0%, 100%': { boxShadow: '0 4px 10px rgba(148, 0, 211, 0.8)' },
          '50%': { boxShadow: '0 8px 20px rgba(148, 0, 211, 0.4)' },
        },
        'pulse-border-shadow-soft-pink': {
          '0%, 100%': { boxShadow: '0 4px 10px rgba(255, 105, 180, 0.8)' },
          '50%': { boxShadow: '0 8px 20px rgba(255, 105, 180, 0.3), 0 0 15px rgba(255, 255, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
