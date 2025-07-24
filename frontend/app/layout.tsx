import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workflow Builder",
  description: "A beautiful workflow builder application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Header removed: no auth links */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}