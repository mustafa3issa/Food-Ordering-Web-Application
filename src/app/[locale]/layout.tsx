import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansArabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-noto-arabic" });

export const metadata: Metadata = {
  title: "Food Ordering App",
  description: "Delicious food, delivered fast.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${notoSansArabic.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <DirectionProvider dir={dir}>
            {children}
            <Toaster />
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
