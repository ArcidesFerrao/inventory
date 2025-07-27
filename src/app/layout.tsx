import type { Metadata } from "next";
import { Sansation } from "next/font/google";
import "./globals.css";
import "./icons.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ProviderWrapper from "@/components/ProviderWrapper";

const sansationSans = Sansation({
  variable: "--font-sansation-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "auto",
});

export const metadata: Metadata = {
  title: "Inventory App",
  description: "Manage Stock Efficiently",
  icons: {
    icon: [{ url: "/favicon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sansationSans.variable}  antialiased`}>
        <ProviderWrapper>
          <Header />
          {children}
          <Footer />
        </ProviderWrapper>
      </body>
    </html>
  );
}
