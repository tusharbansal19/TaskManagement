
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // ... other paths
  ],
  theme: {
    extend: {
      colors: {
        'black': '#0A0A0A', // A richer, deep black for the cosmic theme
        'cosmic-blue': '#2E86C1', // The vibrant, electric cosmic blue
      },
      keyframes: {
        'spin-fast': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-slower': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-fast-reverse': { // New animation for reverse spin
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'star-twinkle': { // New animation for background stars
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'spin-fast': 'spin-fast 1.2s linear infinite',
        'spin-slow': 'spin-slow 2s linear infinite',
        'spin-slower': 'spin-slower 3s linear infinite reverse',
        'spin-fast-reverse': 'spin-fast-reverse 1.5s linear infinite', // New animation
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'star-twinkle': 'star-twinkle 4s ease-in-out infinite alternate', // New animation
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), // Essential for 'fade-in', 'zoom-in', 'slide-in'
    plugin(({ addUtilities, theme }) => {
      // Custom drop-shadow utilities for the glowing effect on arcs
      addUtilities({
        '.drop-shadow-lg': {
          filter: 'drop-shadow(0 0 15px var(--tw-shadow-color))',
          '--tw-shadow-color': 'rgba(46, 134, 193, 0.8)',
        },
        '.drop-shadow-md': {
          filter: 'drop-shadow(0 0 10px var(--tw-shadow-color))',
          '--tw-shadow-color': 'rgba(46, 134, 193, 0.6)',
        },
        '.drop-shadow-sm': {
          filter: 'drop-shadow(0 0 5px var(--tw-shadow-color))',
          '--tw-shadow-color': 'rgba(46, 134, 193, 0.4)',
        },
        '.drop-shadow-xs': { // New smaller shadow for new arc
          filter: 'drop-shadow(0 0 3px var(--tw-shadow-color))',
          '--tw-shadow-color': 'rgba(46, 134, 193, 0.2)',
        },
        '.star-field::before': { // New pseudo-element for star background
           content: '""',
           position: 'absolute',
           top: '0',
           left: '0',
           width: '100%',
           height: '100%',
           background: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 20%), radial-gradient(circle at 40% 60%, rgba(255,255,255,0.12) 0%, transparent 20%)',
           animation: 'star-twinkle 10s ease-in-out infinite alternate',
           pointerEvents: 'none',
           zIndex: '-1',
        },
        '.star-field::after': { // Another pseudo-element for more stars
           content: '""',
           position: 'absolute',
           top: '0',
           left: '0',
           width: '100%',
           height: '100%',
           background: 'radial-gradient(circle at 90% 10%, rgba(255,255,255,0.05) 0%, transparent 20%), radial-gradient(circle at 30% 90%, rgba(255,255,255,0.07) 0%, transparent 20%)',
           animation: 'star-twinkle 8s ease-in-out infinite alternate-reverse',
           pointerEvents: 'none',
           zIndex: '-1',
        },
      });
    }),
  ],
};