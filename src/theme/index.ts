import { createTheme } from "@mantine/core";

import { orange, grey } from "./colors";
import { fonts } from "./fonts";
import { components } from "./components";

export const theme = createTheme({
  defaultRadius: "0",
  black: "#000",
  primaryColor: "orange",
  colors: {
    orange,
    grey,
  },
  components,
  fontFamily: fonts.body.style.fontFamily,
  headings: { fontFamily: fonts.heading.style.fontFamily },
});
