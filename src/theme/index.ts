import { createTheme } from "@mantine/core";

import { orange, grey, appConfig } from "./colors";
import { fonts } from "./fonts";
import { components } from "./components";

export const theme = createTheme({
  colors: {
    primary: [
      appConfig.colors.primary[50],
      appConfig.colors.primary[100],
      appConfig.colors.primary[200],
      appConfig.colors.primary[300],
      appConfig.colors.primary[500], // base
      appConfig.colors.primary[600],
      appConfig.colors.primary[700],
      appConfig.colors.primary[800],
      appConfig.colors.primary[900],
      appConfig.colors.primary[950],
    ],
    orange,
    grey,
  },
  components,
  defaultRadius: "0",
  black: appConfig.colors.black,
  primaryColor: "primary",
  primaryShade: 4,
  fontFamily: "DM Sans', sans-serif",
  headings: { fontFamily: "DM Sans', sans-serif" },
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

});

export { fonts };
