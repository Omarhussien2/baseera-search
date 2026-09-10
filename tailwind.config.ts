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
        brand: {
          50: '#e8edf5',
          100: '#c5d1e6',
          200: '#9eb3d5',
          300: '#7795c4',
          400: '#597fb7',
          500: '#3b69aa',
          600: '#3561a3',
          700: '#2d5699',
          800: '#264c90',
          900: '#1a365d',
        },
        accent: {
          50: '#fdf8e8',
          100: '#faedc6',
          200: '#f6e1a0',
          300: '#f2d57a',
          400: '#efcc5e',
          500: '#ecc341',
          600: '#d69e2e',
          700: '#b7791f',
          800: '#975a16',
          900: '#744210',
        },
        success: '#38a169',
        danger: '#e53e3e',
      },
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
