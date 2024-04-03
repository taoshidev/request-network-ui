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
  fontFamily: fonts.body.style.fontFamily,
  headings: { fontFamily: fonts.heading.style.fontFamily },
});

export { fonts };
