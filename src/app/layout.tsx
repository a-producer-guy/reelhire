import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReelHire - Reelarc Timecard & Payroll",
  description:
    "Timecard approval and payroll management for filmmaking contractors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
