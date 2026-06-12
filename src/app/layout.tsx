import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Direktori GPICT, GP DELIMa & GPM Manjung",
  description: "Direktori ringan untuk GPICT, GP DELIMa dan GPM Daerah Manjung.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
