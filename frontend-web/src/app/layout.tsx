import type { Metadata } from "next";
import { Hedvig_Letters_Sans, Hedvig_Letters_Serif } from "next/font/google";
import "./globals.css";
import SupportChatbot from "@/components/SupportChatbot";
import { NotificationProvider } from "@/context/NotificationContext";

const fontSans = Hedvig_Letters_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

const fontSerif = Hedvig_Letters_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "QuickMate - Get help. Gain happiness.",
  description: "Book trusted, background-checked help for cleaning, handyman services, delivery, and everyday tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${fontSans.variable} font-sans min-h-full flex flex-col bg-parchment text-ink tracking-wide`}>
        <NotificationProvider>
          {children}
          <SupportChatbot />
        </NotificationProvider>
      </body>
    </html>
  );
}
