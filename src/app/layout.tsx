import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { theme, fonts } from "@/theme";
import clsx from "clsx";
import "./styles/styles.css";
import "@mantine/tiptap/styles.css";
import { DM_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Taoshi",
  description:
    "Decentralized Financial Market Forecasting Through the Power of AI",
};

const dmSans = DM_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={clsx(
        "scroll-smooth",
        fonts.heading.variable,
        fonts.body.variable,
        dmSans.className
      )}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="RN Marketplace" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <ColorSchemeScript />
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Notifications position="top-right" zIndex={1000} />
            {children}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
