"use client";

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
        borderRadius: 0,
        border: "1px dashed black",
      },
    }),
  },
  AppShell: {
    styles: () => ({
      header: {
        borderBottom: "1px dashed black",
        height: 60,
      },
      main: {
        height: "100%",
        paddingTop: 60, // header height
        paddingBottom: 160,
      },
    }),
  },
  Stepper: {
    styles: () => ({
      stepIcon: {
        borderRadius: 0,
      },
    }),
  },
  Alert: {
    styles: () => ({
      root: {
        borderRadius: 0,
      },
    }),
  },
};
