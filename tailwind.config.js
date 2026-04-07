export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        background: {
          DEFAULT: '#F8FAFC'
        },
        border: '#E5E7EB',
        primary: {
          50: '#E7F2FF',
          500: '#4A90E2',
          600: '#3B82F6'
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.08)',
        xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'scale-hover': 'scaleHover 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleHover: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' }
        }
      }
    }
  },
  plugins: []
}
