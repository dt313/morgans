import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/hooks/use-language";
import { ChatWidget } from "@/components/chat/chat-widget";

export const metadata: Metadata = {
  title: "Briefly — Your daily news",
  description: "A thoughtfully curated news feed.",
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
