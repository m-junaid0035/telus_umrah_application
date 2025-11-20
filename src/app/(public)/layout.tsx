import { Header } from "@/components/Header";
import { AuthProvider } from '@/components/AuthContext';
import { Footer } from "@/components/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Header />
      {children}
      <Footer/>
    </AuthProvider>
  );
}
