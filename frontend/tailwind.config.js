/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nền Gỗ Mun Trầm & Than Củi
        'wood': {
          950: '#141210',
          900: '#19120C',
          850: '#1E1610',
          800: '#261E18',
          700: '#312822',
          600: '#3D332C',
        },
        // Vàng Kim Hoàng Gia
        'gold': {
          300: '#FFE088',
          400: '#F2CA50',
          500: '#D4AF37',
          600: '#997D24',
          700: '#735C00',
        },
        // Đỏ Sơn Son Cung Đình
        'cinnabar': {
          400: '#FFB3AE',
          500: '#BB3E03',
          600: '#9B2226',
          700: '#8F191F',
          900: '#5F1215',
        },
        // Ngọc Bích Hoàng Tộc
        'jade': {
          400: '#82C0A0',
          500: '#52B788',
          600: '#2D6A4F',
          800: '#1B4332',
        },
        // Giấy Dó & Mực Nho
        'parchment': {
          100: '#FDFBF7',
          200: '#F0DFD5',
          300: '#E8D8B8',
          400: '#D0C5AF',
        },
      },
      fontFamily: {
        headline: ['"Noto Serif"', 'serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.35)',
        'cinnabar-glow': '0 0 25px rgba(187, 62, 3, 0.4)',
        'jade-glow': '0 0 20px rgba(45, 106, 79, 0.35)',
      },
    },
  },
  plugins: [],
};
