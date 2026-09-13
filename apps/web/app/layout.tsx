import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "agent-logs — Zero-config AI session logger",
  description:
    "Wrap once, record silently, and export clean, self-contained HTML traces for interviews, debugging, audits, and portfolios.",
  icons: {
    icon: "/applog.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#121212]">
      <body className="min-h-screen bg-[#121212] text-[#ededed] antialiased selection:bg-[#f5a623] selection:text-black">
        {children}
      </body>
    </html>
  );
}
