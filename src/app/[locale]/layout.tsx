import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import PageTransition from "@/components/layout/PageTransition";
import ThreeBackground from "@/components/three/ThreeBackground";
import { isValidLocale, locales } from "@/lib/i18n";
import "../globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sihong Shen",
  description: "Sihong Shen's portfolio website.",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-[var(--terminal-primary)]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen bg-black text-[var(--terminal-primary)] flex flex-col relative w-full">
            <ThreeBackground />
            <PageTransition>{children}</PageTransition>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
