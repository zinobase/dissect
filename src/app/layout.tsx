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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Geist:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#07080d] text-zinc-100 antialiased min-h-screen selection:bg-[#84cc16]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
