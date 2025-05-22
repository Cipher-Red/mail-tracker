import "@/styles/globals.css";
import React from "react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { DevtoolsProvider } from 'creatr-devtools';
import { ThemeProvider } from "@/components/theme-provider";
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};
export const metadata: Metadata = {
  title: {
    default: "Detroit Axle Email Builder",
    template: "%s | Detroit Axle Email Builder"
  },
  description: "A modern email template builder for Detroit Axle customer communications",
  applicationName: "Detroit Axle Email Builder",
  keywords: ["next.js", "react", "typescript", "email", "template", "builder", "detroit axle"],
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
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning data-unique-id="964423a3-d11e-49fc-b8f0-1cc96b3e17f1" data-file-name="app/layout.tsx">
      <body data-unique-id="b32c7296-fd94-4826-9498-7e999483c43c" data-file-name="app/layout.tsx">
        <ThemeProvider defaultTheme="system">
          <DevtoolsProvider>{children}</DevtoolsProvider>
        </ThemeProvider>
      </body>
    </html>;
}