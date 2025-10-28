import type { Config } from "tailwindcss";

const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-green-50",
    "bg-red-50",
    "bg-orange-50",
    "border-green-500",
    "border-red-500",
    "border-orange-500",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#f0f1f4',
          100: '#e1e4e9',
          200: '#c3c9d3',
          300: '#a5aebd',
          400: '#8793a7',
          500: '#697891',
          600: '#4b5d7b',
          700: '#2d4265',
          800: '#1a2a3d',
          900: '#0b1020',
          950: '#070b14',
        },
        gold: {
          50: '#fefdf5',
          100: '#fefaeb',
          200: '#fcf2cd',
          300: '#fae6a0',
          400: '#f8d66b',
          500: '#f4c430',
          600: '#e3ae1a',
          700: '#bd8b16',
          800: '#996f18',
          900: '#7c5a19',
          950: '#472f0a',
        },
      },
    },
  },
  plugins: [],
}) satisfies Config;
