import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/layouts/site-header";
import { SiteFooter } from "@/components/layouts/site-footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReduxProvider } from "@/lib/redux/provider";
import { ClerkThemeProvider } from "@/components/providers/clerk-theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AeroForge Labs – Next-Gen Drones, Aeronautics & Rapid Prototyping",
  description:
    "AeroForge Labs – Advanced e-commerce and engineering hub for high-performance drones, RC planes, precision parts, on-demand 3D printing, and hardware repair.",
  openGraph: {
    title: "AeroForge Labs – Next-Gen Drones, Aeronautics & Rapid Prototyping",
    description:
      "Explore high-performance drones, custom 3D printing pipelines, and expert hardware diagnostics on AeroForge Labs.",
    url: "https://aeroforge-labs.vercel.app",
    siteName: "AeroForge Labs",
    images: [
      {
        url: "/public/vercel.svg",
        width: 1200,
        height: 630,
        alt: "AeroForge Labs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroForge Labs – Next-Gen Drones & Rapid Prototyping",
    description:
      "Advanced e-commerce platform for drones, RC aeronautics, 3D printing, and hardware repair services.",
    images: ["/public/vercel.svg"],
  },
  keywords: [
    "Drones",
    "RC Airplanes",
    "3D Printing",
    "Rapid Prototyping",
    "Hardware Repair Services",
    "E-commerce",
    "AeroForge Labs",
    "Robotics",
    "Custom Engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkThemeProvider>
            <ReduxProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </ReduxProvider>
            <Toaster />
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
