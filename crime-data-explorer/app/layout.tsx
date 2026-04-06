import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarNav } from "@/components/sidebar-nav";

export const metadata: Metadata = {
  title: {
    default: "Crime Data Explorer",
    template: "%s | Crime Data Explorer",
  },
  description:
    "Explore crime, incarceration, murder rates, and unemployment data across US states and counties.",
  openGraph: {
    title: "Crime Data Explorer",
    description:
      "Interactive data exploration platform for US crime, incarceration, and unemployment statistics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <SidebarNav />
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto p-4 lg:p-6">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
