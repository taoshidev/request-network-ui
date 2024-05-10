import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme, fonts } from "@/theme";
import "./styles/styles.css";
import '@mantine/tiptap/styles.css';

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
    <html
      lang="en"
      className={`${fonts.heading.variable} ${fonts.body.variable}`}
    >
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <NextTopLoader color="#D36737" showSpinner={false} shadow={false} />
        <MantineProvider theme={theme}>
          <Notifications position="top-right" zIndex={1000} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
