"use client";

import { Anchor } from "@mantine/core";

export const components = {
  Input: {
    styles: () => ({
      input: {
        borderColor: "black",
        borderStyle: "dashed",
      },
    }),
  },
  Checkbox: {
    styles: () => ({
      input: {
        borderColor: "black",
        borderStyle: "dashed",
      },
    }),
  },
  Badge: {
    styles: () => ({
      root: {
        borderRadius: 0,
      },
    }),
  },
  Card: {
    styles: () => ({
      root: {
        borderRadious: 0,
        border: "1px dashed black",
      },
    }),
  },
};
