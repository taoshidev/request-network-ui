"use client";

export const components = {
  Input: {
    styles: () => ({
      input: {
        // borderColor: "black",
        // borderStyle: "dashed",
      },
    }),
  },
  Checkbox: {
    styles: () => ({
      input: {
        // borderColor: "black",
        // borderStyle: "dashed",
      },
    }),
  },
  Badge: {
    styles: () => ({
      root: {
        borderRadius: 3,
      },
    }),
  },
  Card: {
    styles: () => ({
      root: {
        borderRadius: 3,
      },
    }),
  },
  AppShell: {
    styles: () => ({
      header: {
        height: 89,
      },
      main: {
        // height: "100%",
        // paddingTop: 60, // header height
        // paddingBottom: 160,
      },
    }),
  },
  Stepper: {
    styles: () => ({
      stepIcon: {
        borderRadius: 3,
      },
    }),
  },
  Alert: {
    styles: () => ({
      root: {
        borderRadius: 3,
        borderLeft: "4px solid #E56E39",
        background: "white",
        padding: "16px",
        fontSize: "1rem" /* 16px */,
        lineHeight: "1.5rem" /* 24px */,
      },
    }),
  },
};
