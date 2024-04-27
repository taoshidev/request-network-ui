import type { Config } from "tailwindcss";
import { appConfig } from "./src/theme/colors";
import plugin from "tailwindcss/plugin";
// import plugin from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "2xs": "375px",
        xs: "480px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1600px",
      },
      colors: appConfig.colors,
      fontFamily: {
        "space-mono": "var(--font-space-mono)",
        "adlam-display": "var(--font-adlam-display)",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
};

export default config;
