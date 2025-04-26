import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3060FF',
          50: '#E7EDFF',
          100: '#D4DEFF',
          200: '#AABBFF',
          300: '#8199FF',
          400: '#5777FF',
          500: '#3060FF',
          600: '#0A41FF',
          700: '#002CD6',
          800: '#0021A1',
          900: '#00166C',
        },
        accent: {
          DEFAULT: '#FF6060',
          50: '#FFFFFF',
          100: '#FFF0F0',
          200: '#FFC3C3',
          300: '#FF9595',
          400: '#FF7878',
          500: '#FF6060',
          600: '#FF2828',
          700: '#EF0000',
          800: '#B70000',
          900: '#7F0000',
        },
        purple: {
          500: '#6E48AA',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function ({ addComponents }: { addComponents: Function }) {
      addComponents({
        '.aspect-w-16': {
          aspectRatio: '16 / 9',
        },
        '.aspect-h-9': {
          aspectRatio: '16 / 9',
        },
        '.aspect-w-1': {
          aspectRatio: '1 / 1',
        },
        '.aspect-h-1': {
          aspectRatio: '1 / 1',
        },
      });
    },
  ],
};

export default config;
