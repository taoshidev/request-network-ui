import { Space_Mono } from "next/font/google";
import localFont from "next/font/local";

export const ADLaMDisplay = localFont({
  src: "../fonts/ADLaMDisplay-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-adlam",
});

export const SpaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const fonts = {
  heading: ADLaMDisplay,
  body: SpaceMono,
};
