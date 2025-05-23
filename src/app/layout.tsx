import "@/styles/globals.css";
import React from "react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};
export const metadata: Metadata = {
  title: {
    default: "Detroit Axle Tools",
    template: "%s | Detroit Axle Tools"
  },
  description: "Professional tools for Detroit Axle customer communications and order processing",
  applicationName: "Detroit Axle Tools",
  keywords: ["email", "template", "builder", "detroit axle", "customer communications", "order processing"],
  authors: [{
    name: "Detroit Axle Team"
  }],
  creator: "Detroit Axle Team",
  publisher: "Detroit Axle Team",
  icons: {
    icon: [{
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png"
    }, {
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png"
    }, {
      url: "/favicon.ico",
      sizes: "48x48",
      type: "image/x-icon"
    }],
    apple: [{
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    }]
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Detroit Axle Email Builder"
  },
  formatDetection: {
    telephone: false
  }
};
import { SmartGuideProvider } from "@/components/smart-guide-provider";
import { DarkModeGuide } from "@/components/dark-mode-guide";

// ThemeProvider is used in a client component wrapper to avoid hydration issues
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning data-unique-id="d1e403b9-0549-4c46-a4d2-1ca8bef6e081" data-file-name="app/layout.tsx">
      <body data-unique-id="9701c6ab-dfd0-4aa9-99fe-fb6a80d113db" data-file-name="app/layout.tsx">
        <ThemeProviderWrapper defaultTheme="system">
          <SmartGuideProvider>
            <DarkModeGuide />
            {children}
          </SmartGuideProvider>
        </ThemeProviderWrapper>
      </body>
    </html>;
}