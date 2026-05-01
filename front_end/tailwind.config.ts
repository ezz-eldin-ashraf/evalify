import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode by toggling the "dark" class on the html element
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
        },
        accent: 'var(--accent)',
        bg: {
          main: 'var(--bg-main)',
          surface: 'var(--bg-surface)',
          input: 'var(--bg-input)',
          disabled: 'var(--bg-disabled)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          disabled: 'var(--text-disabled)',
        },
        border: 'var(--border)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        focus: 'var(--focus-ring)',
      },
      boxShadow: {
        'light': '0 4px 6px -1px var(--shadow-light), 0 2px 4px -2px var(--shadow-light)',
        'strong': '0 10px 15px -3px var(--shadow-strong), 0 4px 6px -4px var(--shadow-strong)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-up-delay': 'fadeInUp 0.8s ease-out 0.2s forwards',
        'fade-in-up-delay-2': 'fadeInUp 0.8s ease-out 0.4s forwards',
      }
    },
  },
  plugins: [],
} satisfies Config;
