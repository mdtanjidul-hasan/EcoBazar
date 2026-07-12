import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'teal-brand': '#1ABC9C',
        'gold': '#D4AF37',
        'dark': '#0A0A0A',
      },
    },
  },
  plugins: [],
} satisfies Config;
