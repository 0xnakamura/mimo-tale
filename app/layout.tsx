import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "mimo-tale · interactive illustrated audiobook",
  description:
    "Tell a story you've never read. Each chapter is reasoned, illustrated, and narrated by Xiaomi MiMo V2.5.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
