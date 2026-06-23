import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // The dmv-* classes below are defined in globals.css and referenced from
  // HTML strings inside src/data/blog_posts.json. Tailwind's content scanner
  // doesn't look in JSON, so without the safelist these get purged in
  // production builds and the styles silently disappear.
  safelist: [
    'dmv-stats',
    'dmv-stat',
    'dmv-stat-value',
    'dmv-stat-label',
    'dmv-callout',
    'dmv-callout-tip',
    'dmv-callout-warning',
    'dmv-callout-required',
    'dmv-callout-law',
    'dmv-callout-icon',
    'dmv-callout-header',
    'dmv-callout-body',
    'dmv-callout-title',
    'dmv-table',
    'dmv-table-wrap',
    'dmv-roadmap',
    'dmv-roadmap-list',
    'dmv-roadmap-title',
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
        // DMV blue — used by the keyword SEO hubs (the rest of the site stays
        // on the orange `primary`). Base is rgb(78,128,196) = #4e80c4.
        dmv: {
          DEFAULT: "#4e80c4",
          50: "#eef3fa",
          100: "#d8e4f3",
          200: "#b9cfe9",
          300: "#8fb0db",
          400: "#6a94cd",
          500: "#4e80c4",
          600: "#3d68a8",
          700: "#345488",
          800: "#2f4870",
          900: "#2b3f5e",
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
