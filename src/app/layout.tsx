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
  return <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning data-unique-id="cd7c434e-29f2-4176-a964-7617e37bbec8" data-file-name="app/layout.tsx">
      <body className="min-h-screen flex flex-col" data-unique-id="6319240e-4799-43f6-b70d-4a9e6f67bf0f" data-file-name="app/layout.tsx">
        <ThemeProviderWrapper defaultTheme="system">
          <div className="flex-1" data-unique-id="65af2be8-9c1f-49fa-ae94-5266db77dcbb" data-file-name="app/layout.tsx" data-dynamic-text="true">
            {children}
          </div>
          <footer className="py-4 border-t border-border bg-accent/10" data-unique-id="df2c8f25-df2f-4a80-8e36-150ac67b0004" data-file-name="app/layout.tsx">
            <div className="container mx-auto text-center text-sm text-muted-foreground" data-unique-id="878d8725-e99c-4f56-be4c-ec8d7cecd5bf" data-file-name="app/layout.tsx">
              <p data-unique-id="8258ea60-257e-4203-b8a6-e84a9fc009c5" data-file-name="app/layout.tsx">
                <span className="editable-text" data-unique-id="1e934c78-37d5-4406-a6f5-385e82de5dbf" data-file-name="app/layout.tsx">Developed by </span>
                <a href="https://ctrl-department.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors" data-unique-id="09bdb2f0-113d-4464-bd31-b83b06c0b38a" data-file-name="app/layout.tsx">
                  <span className="editable-text" data-unique-id="b48d19e5-8859-4e4f-ab8a-33a30b4ef806" data-file-name="app/layout.tsx">Ctrl-Department</span>
                </a>
                <a href="/admin" className="ml-4 px-3 py-1 bg-primary text-white rounded-md text-xs hover:bg-primary/90 transition-colors" data-unique-id="a078395b-30ea-4d1d-befd-75dbe3b1546c" data-file-name="app/layout.tsx">
                  <span className="editable-text" data-unique-id="bf184afd-4dfc-405e-b538-4a807b59dccb" data-file-name="app/layout.tsx">Admin Panel</span>
                </a>
              </p>
            </div>
          </footer>
        </ThemeProviderWrapper>
      </body>
    </html>;
}