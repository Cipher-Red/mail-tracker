import "@/styles/globals.css";
import React from "react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
import { DevtoolsProvider } from 'creatr-devtools';
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
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning data-unique-id="d15e94ee-cdf0-46bd-8943-a7b129a97b55" data-file-name="app/layout.tsx">
      <body className="min-h-screen flex flex-col" data-unique-id="9b50c698-4b80-456f-9050-4a468405b319" data-file-name="app/layout.tsx">
        <ThemeProviderWrapper defaultTheme="system">
          <div className="flex-1" data-unique-id="efb17767-43a6-4b2c-8620-50cffcb0f668" data-file-name="app/layout.tsx" data-dynamic-text="true">
            {children}
          </div>
          <footer className="py-4 border-t border-border bg-accent/10" data-unique-id="79303450-b469-42d9-ab27-3b289e474447" data-file-name="app/layout.tsx">
            <div className="container mx-auto text-center text-sm text-muted-foreground" data-unique-id="69691683-754c-4091-b12a-9025034d5f5b" data-file-name="app/layout.tsx">
              <p data-unique-id="08621093-1a8e-4c62-9709-16e642d5e834" data-file-name="app/layout.tsx">
                <span className="editable-text" data-unique-id="d9a56cfb-d804-4fa2-89c8-bce6ac815be6" data-file-name="app/layout.tsx">Developed by </span>
                <a href="https://ctrl-department.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors" data-unique-id="810e4f27-075a-45e6-88ad-5279ed6209b7" data-file-name="app/layout.tsx">
                  <span className="editable-text" data-unique-id="d39acc83-4a1d-47b5-82ad-0c864af8a7ce" data-file-name="app/layout.tsx">Ctrl-Department</span>
                </a>
                <a href="/admin" className="ml-4 px-3 py-1 bg-primary text-white rounded-md text-xs hover:bg-primary/90 transition-colors" data-unique-id="f92676a9-c995-4ebc-b9c4-0ef25f1539b9" data-file-name="app/layout.tsx">
                  <span className="editable-text" data-unique-id="65e83b2d-7c50-4a64-a946-38151dde0acd" data-file-name="app/layout.tsx">Admin Panel</span>
                </a>
              </p>
            </div>
          </footer>
        </ThemeProviderWrapper>
      </body>
    </html>;
}