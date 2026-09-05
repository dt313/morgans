import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/hooks/use-language";
import { ChatWidget } from "@/components/chat/chat-widget";
import logo from "@/assets/imgs/logo.png";

export const metadata: Metadata = {
  title: "Morgans — Your daily news",
  description: "A thoughtfully curated news feed.",
  icons: {
    icon: { url: logo.src, type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
        <ChatWidget />
      </body>
    </html>
  );
}
