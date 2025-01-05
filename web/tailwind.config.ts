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
      },
    },
  },
  plugins: [],
}) satisfies Config;
