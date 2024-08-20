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
        primecolor: "#5DC9A8",
        secondcolor: "#f5f5f5",
        accountcolor: "#EE6071",
      },
    },
  },
  plugins: [],
};
export default config;
