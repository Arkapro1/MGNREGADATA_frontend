import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MGNREGA Dashboard - Our Voice, Our Rights",
  description: "Comprehensive dashboard for MGNREGA performance data across Indian states",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <Navbar />
        <main className="pt-24 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
