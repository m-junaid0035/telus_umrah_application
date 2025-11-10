"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, Users, Home, LogOut, Hotel, Feather } from "lucide-react";
import { logoutAdminAction } from "@/actions/authActions"; // your server action
import { features } from "process";

type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logoutAdminAction(); // call server action
      router.push("/auth/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems: NavItem[] = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/applications", label: "Applications", icon: Users },
    { path: "/admin/hotels", label: "Hotels", icon: Hotel },
    { path: "/admin/features", label: "Features", icon: Feather },
  ];

  const isActive = (path: string) =>
    pathname === path || (path !== "/admin" && pathname.startsWith(path));

  const linkClasses = (path: string) =>
    `flex items-center gap-3 py-3 px-4 rounded-lg transition-all font-medium text-sm ${
      isActive(path)
        ? "bg-primary text-primary-foreground shadow-md"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-extrabold text-center mb-8 text-primary tracking-tight">
        Admin Panel
      </h2>

      <nav className="flex flex-col gap-2 flex-1">
        <Link
          href="/"
          className="flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
          onClick={() => setDrawerOpen(false)}
        >
          <Home className="w-5 h-5" />
          Home
        </Link>

        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            href={path}
            className={linkClasses(path)}
            onClick={() => setDrawerOpen(false)}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="mt-auto w-full bg-destructive hover:bg-destructive/90 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex w-72 bg-card border-r border-border shadow-lg p-6 flex-col rounded-tr-3xl rounded-br-3xl sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <header className="sm:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Admin Panel
          </h1>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation drawer"
            className="rounded-lg p-2 hover:bg-muted active:scale-95 transition-all"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </header>

        {/* Mobile drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.aside
                key="mobileSidebar"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.22 }}
                className="fixed top-0 left-0 z-40 w-72 h-full bg-card p-6 flex flex-col rounded-tr-2xl shadow-lg sm:hidden border-r border-border"
              >
                <button
                  className="mb-4 ml-auto rounded-lg p-2 hover:bg-muted"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation drawer"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
                <SidebarContent />
              </motion.aside>

              <motion.button
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-30 sm:hidden"
                aria-label="Close drawer overlay"
                onClick={() => setDrawerOpen(false)}
              />
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 p-6 sm:p-8">
          <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)] bg-card rounded-3xl shadow-md border border-border p-6 sm:p-8 transition-all">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
