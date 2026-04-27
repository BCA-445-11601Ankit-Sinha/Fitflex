import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "FitFlex",
    template: "%s | FitFlex",
  },
  description:
    "FitFlex — workouts, gym buddy supplements, and tools to plan and track your fitness.",
  applicationName: "FitFlex",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
