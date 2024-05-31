import type { Config } from "tailwindcss";
import { appConfig } from "./src/theme/colors";
import plugin from "tailwindcss/plugin";

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
        // "adlam-display": "var(--font-adlam-display)",
        "adlam-display": ['ADLaM Display'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        grow: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        "slide-down": "slideDown 0.3s ease-out forwards",
        "grow": "grow 0.3s ease-in-out forwards",
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
