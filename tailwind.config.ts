import type { Config } from "tailwindcss";
import { appConfig } from "./src/theme/colors";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: appConfig.colors,
      fontFamily: {
        "space-mono": "var(--font-space-mono)",
        "adlam-display": "var(--font-adlam-display)",
      },
    },
  },
  plugins: [],
};

export default config;
