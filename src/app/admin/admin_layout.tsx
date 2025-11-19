"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, Users, Home, LogOut, Hotel, ListChecks, Scroll, Route, CheckSquare, XSquare, FileText, Package, BookOpen, Calendar} from "lucide-react";
import { logoutAdminAction } from "@/actions/authActions";

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
    { path: "/admin/packages", label: "Packages", icon: Package },
    { path: "/admin/hotels", label: "Hotels", icon: Hotel },
    { path: "/admin/package-bookings", label: "Package Bookings", icon: BookOpen },
    { path: "/admin/hotel-bookings", label: "Hotel Bookings", icon: Calendar },
    { path: "/admin/custom-umrah-requests", label: "Custom Requests", icon: FileText },
    { path: "/admin/features", label: "Features", icon: ListChecks },
    { path: "/admin/itineraries", label: "Itineraries", icon: Route },
    { path: "/admin/includes", label: "Includes", icon: CheckSquare },
    { path: "/admin/excludes", label: "Excludes", icon: XSquare },
    { path: "/admin/policies", label: "Policies", icon: Scroll },
    { path: "/admin/applications", label: "Applications", icon: Users },
  ];

  const isActive = (path: string) =>
    pathname === path || (path !== "/admin" && pathname.startsWith(path));

  const linkClasses = (path: string) =>
    `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all font-medium text-sm ${
      isActive(path)
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-8 pb-6 border-b border-border">
        <h2 className="text-2xl font-bold text-center text-foreground tracking-tight mb-2">
          Admin Panel
        </h2>
        <p className="text-xs text-center text-muted-foreground">
          Umrah Portal Management
        </p>
      </div>

      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        <Link
          href="/"
          className="flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mb-2"
          onClick={() => setDrawerOpen(false)}
        >
          <Home className="w-4 h-4" />
          Home
        </Link>

        <div className="mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Main
          </p>
          {navItems.slice(0, 3).map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              className={linkClasses(path)}
              onClick={() => setDrawerOpen(false)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        <div className="mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Bookings
          </p>
          {navItems.slice(3, 6).map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              className={linkClasses(path)}
              onClick={() => setDrawerOpen(false)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        <div className="mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Content
          </p>
          {navItems.slice(6).map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              className={linkClasses(path)}
              onClick={() => setDrawerOpen(false)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex w-64 bg-card border-r border-border shadow-sm p-5 flex-col sticky top-0 h-screen overflow-hidden">
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
