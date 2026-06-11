/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#DA291C',
          'red-dark': '#B71C1C',
          'red-light': '#FF5252',
          yellow: '#FFC72C',
          'yellow-dark': '#F9A825',
          'yellow-light': '#FFE57F',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0f0f10',
          card: '#f8f8f9',
          'card-dark': '#1a1a1c',
          border: '#e5e5e7',
          'border-dark': '#2c2c2e',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        pulseDot: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.12)',
        'brand': '0 4px 20px rgba(218,41,28,0.3)',
        'yellow': '0 4px 20px rgba(255,199,44,0.35)',
      }
    },
  },
  plugins: [],
}
