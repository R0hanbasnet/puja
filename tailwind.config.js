tailwind.config = {
      theme: {
        extend: {
          colors: {
            velvet: {
              950: '#0d060a',
              900: '#160910',
              850: '#1f0c16',
              800: '#2b101e',
            },
            rosegold: {
              200: '#f7d9d4',
              300: '#eeb9b0',
              400: '#e29587',
              500: '#c97466',
              600: '#a35245',
            },
            champagne: {
              100: '#fdf8f3',
              200: '#f8ece0',
              300: '#efd8c0',
              400: '#e2bd96',
              500: '#d4a373',
            },
            amberGlow: '#ffb74d',
          },
          fontFamily: {
            serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
            cormorant: ['"Cormorant Garamond"', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            nepali: ['"Noto Sans Devanagari"', 'sans-serif'],
          },
          animation: {
            'float-slow': 'floatSlow 8s ease-in-out infinite',
            'float-delayed': 'floatSlow 10s ease-in-out 3s infinite',
            'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
            'spin-slow': 'spin 24s linear infinite',
            'flicker': 'flicker 0.18s infinite alternate',
            'heartbeat': 'heartbeat 1.3s ease-in-out infinite',
          },
          keyframes: {
            floatSlow: {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-18px) rotate(1.5deg)' },
            },
            pulseGlow: {
              '0%, 100%': { boxShadow: '0 0 22px rgba(255, 183, 77, 0.35), 0 0 45px rgba(226, 149, 135, 0.2)' },
              '50%': { boxShadow: '0 0 38px rgba(255, 183, 77, 0.75), 0 0 70px rgba(226, 149, 135, 0.45)' },
            },
            flicker: {
              '0%': { transform: 'scale(1) rotate(-2deg)', opacity: '0.94' },
              '50%': { transform: 'scale(1.06, 0.96) rotate(1deg)', opacity: '1' },
              '100%': { transform: 'scale(0.97, 1.05) rotate(2deg)', opacity: '0.9' },
            },
            heartbeat: {
              '0%, 100%': { transform: 'scale(1)' },
              '14%': { transform: 'scale(1.18)' },
              '28%': { transform: 'scale(1)' },
              '42%': { transform: 'scale(1.14)' },
              '70%': { transform: 'scale(1)' },
            }
          }
        }
      }
    };
