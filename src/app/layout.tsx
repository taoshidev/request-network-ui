import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { theme } from "@/theme";

import "./global.css";

export const metadata: Metadata = {
  title: "Taoshi",
  description:
    "Decentralized Financial Market Forecasting Through the Power of AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <NextTopLoader color="#BB572A" />
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
