import "./../globals.css";
import "./../icons.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ProviderWrapper from "@/components/ProviderWrapper";
import { Toaster } from "react-hot-toast";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await import(`../../../messages/${locale}.json`);
  return (
    <NextIntlClientProvider locale={locale} messages={messages.default}>
      <ProviderWrapper>
        <Header />
        <Toaster position="top-right" />
        {children}
        <Footer />
      </ProviderWrapper>
    </NextIntlClientProvider>
  );
}
