import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f4511e",
          50: "#fef3f2",
          100: "#fee5e2",
          200: "#fdd0ca",
          300: "#fab0a5",
          400: "#f68371",
          500: "#f4511e",
          600: "#e13b15",
          700: "#bd2e12",
          800: "#9c2814",
          900: "#812617",
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
