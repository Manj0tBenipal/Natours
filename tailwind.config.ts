import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input|navbar).js",
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
  fontFamily: {
    poppins: ["var(--font-poppins)", "sans-serif"],
  },
};
export default config;
