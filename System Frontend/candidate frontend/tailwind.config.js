
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
    theme: {
      extend: {
        // ...existing extensions...
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'float': 'float 3s ease-in-out infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
          }
        },
        boxShadow: {
          'glow': '0 0 15px -3px rgb(var(--color-primary-500) / 0.3), 0 0 6px -2px rgb(var(--color-primary-500) / 0.2)',
        },
      },
    },
  },
  plugins: [],
  extend: {
    // ...existing extensions...
    animation: {
      'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
      'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      'pulse-reverse': 'pulse-reverse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      'glow-travel': 'glow-travel 8s linear infinite',
    },
    keyframes: {
      'subtle-bounce': {
        '0%, 100%': { transform: 'translateY(0) scale(1)' },
        '50%': { transform: 'translateY(-3px) scale(1.05)' },
      },
      'pulse-reverse': {
        '0%, 100%': { opacity: '0.4' },
        '50%': { opacity: '0.1' },
      },
      'glow-travel': {
        '0%': { transform: 'translate(0, 0)' },
        '25%': { transform: 'translate(calc(100% + 20px), calc(100% + 20px))' },
        '50%': { transform: 'translate(calc(100% + 20px), 0)' },
        '75%': { transform: 'translate(0, calc(100% + 20px))' },
        '100%': { transform: 'translate(0, 0)' },
      }
    },
    
  },
    extend: {
      // ...existing extensions...
      animation: {
        // ...existing animations...
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
    extend: {
      // ...existing extensions...
      animation: {
        // ...existing animations...
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rotate-slow': 'rotate 8s linear infinite',
        'float-slow': 'float 3s ease-in-out infinite',
        'float-slow-reverse': 'float 4s ease-in-out infinite reverse',
      },
      keyframes: {
        // ...existing keyframes...
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
}

