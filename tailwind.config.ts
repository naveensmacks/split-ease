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
        primecolor: "#2C9676",
        secondcolor: "#f5f5f5",
        accountcolor: "#d15867",
      },
    },
  },
  plugins: [],
};
export default config;
