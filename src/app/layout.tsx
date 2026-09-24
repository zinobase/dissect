import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dissect | Autonomous Generative B-Roll & Social Clip Re-Cutter",
  description: "Repurpose long-form video into high-retention 9:16 vertical cuts with autonomous Livepeer generative B-roll insertion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07080d] text-zinc-100 antialiased min-h-screen selection:bg-[#84cc16]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
