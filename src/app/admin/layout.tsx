// app/admin/layout.tsx
import AdminLayout from "./admin_layout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "../globals.css"

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPageLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // if (!token) {
  //   redirect("/auth/login");
  // }

  return (
    <html lang="en">
      <head />
      <body>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
