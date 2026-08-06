import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { CookieConsentBanner } from "@/components/system/CookieConsentBanner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 page-enter">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieConsentBanner />
    </div>
  );
}

