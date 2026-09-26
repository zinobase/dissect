import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#07080d",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Dissect | Autonomous Generative B-Roll & Social Clip Re-Cutter",
  description: "Repurpose long-form video into high-retention 9:16 vertical cuts with autonomous Livepeer generative B-roll insertion.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                window.addEventListener('error', function(e) {
                  if (
                    (e.message && (e.message.indexOf('ethereum') !== -1 || e.message.indexOf('redefine property') !== -1)) ||
                    (e.filename && e.filename.indexOf('chrome-extension') !== -1)
                  ) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  var msg = (e.reason && (e.reason.message || e.reason.stack)) || '';
                  if (msg.indexOf('ethereum') !== -1 || msg.indexOf('chrome-extension') !== -1) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
                try {
                  var origDef = Object.defineProperty;
                  Object.defineProperty = function(obj, prop, desc) {
                    if (obj === window && prop === 'ethereum') {
                      try {
                        if (desc && !desc.configurable) desc.configurable = true;
                        return origDef.call(Object, obj, prop, desc);
                      } catch (err) {
                        return obj;
                      }
                    }
                    return origDef.call(Object, obj, prop, desc);
                  };
                } catch (e) {}
              })();
            `,
          }}
        />
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
