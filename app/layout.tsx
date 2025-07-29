import type { Metadata, Viewport } from "next";
import { Inter, PT_Sans } from "next/font/google";


import TanstackProvider from "@/components/providers/tanstack-query-provider";
import "@/assets/globals.css";
import { Toaster } from "@/components/ui/sonner";
import AppContext from "@/components/contexts/app-context";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-ptSans-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Retro Builder | Build with AI ✨",
  description:
    "Retro Builder is a web development tool that helps you build websites with AI, no code required. Let's deploy your website with Retro Builder and enjoy the magic of AI.",
  openGraph: {
    title: "Retro Builder | Build with AI ✨",
    description:
      "Retro Builder is a web development tool that helps you build websites with AI, no code required. Let's deploy your website with Retro Builder and enjoy the magic of AI.",
    url: "https://retrobuilder.app", // TODO: Update to actual Retro Builder URL if different
    siteName: "Retro Builder",
    images: [
      {
        url: "https://retrobuilder.app/banner.png", // TODO: Update to actual Retro Builder banner if different
        width: 1200,
        height: 630,
        alt: "Retro Builder Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Retro Builder | Build with AI ✨",
    description:
      "Retro Builder is a web development tool that helps you build websites with AI, no code required. Let's deploy your website with Retro Builder and enjoy the magic of AI.",
    images: ["https://retrobuilder.app/banner.png"], // TODO: Update to actual Retro Builder banner if different
  },
  appleWebApp: {
    capable: true,
    title: "Retro Builder",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        defer
        data-domain="retrobuilder.app" // TODO: Update to actual Retro Builder analytics domain if different
        src="https://plausible.io/js/script.js"
      ></Script>
      <body
        className={`${inter.variable} ${ptSans.variable} antialiased bg-black dark h-[100dvh] overflow-hidden`}
      >
        <Toaster richColors position="bottom-center" />
        <TanstackProvider>
          <AppContext>{children}</AppContext>
        </TanstackProvider>
      </body>
    </html>
  );
}
