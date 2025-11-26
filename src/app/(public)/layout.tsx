import { Header } from "@/components/Header";
import { AuthProvider } from '@/components/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Footer } from "@/components/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Header />
        {children}
        <Footer/>
      </AuthProvider>
    </LanguageProvider>
  );
}
