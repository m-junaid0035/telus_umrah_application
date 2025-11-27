"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserCheck,
  Home,
  LogOut,
  Hotel,
  ListChecks,
  Scroll,
  Route,
  CheckSquare,
  XSquare,
  FileText,
  Package,
  BookOpen,
  Calendar,
  Settings,
  Sparkles,
} from "lucide-react";
import { logoutAdminAction } from "@/actions/authActions";
import telusBlueLogo from "@/assets/telus-umrah-blue.png";
import telusWhiteLogo from "@/assets/telus-umrah-white.png";

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
      await logoutAdminAction();
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems: NavItem[] = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: UserCheck },
    { path: "/admin/packages", label: "Packages", icon: Package },
    { path: "/admin/hotels", label: "Hotels", icon: Hotel },
    { path: "/admin/form-options", label: "Form Options", icon: Settings },
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
    `group flex items-center gap-3 py-2.5 px-4 rounded-2xl border transition-all font-medium text-sm ${
      isActive(path)
        ? "bg-gradient-to-r from-blue-500/90 via-sky-500/90 to-sky-400/80 text-white border-white/30 shadow-lg shadow-blue-900/30"
        : "text-white/70 border-white/5 hover:text-white hover:border-white/25 hover:bg-white/5"
    }`;

  const sectionHeadingClass =
    "text-[0.7rem] font-semibold text-white/50 uppercase tracking-[0.4em] px-4 mb-3";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-8 pb-6 border-b border-white/10">
        <div className="flex flex-col items-center text-center gap-3">
          <Image
            src={telusWhiteLogo}
            alt="Telus Umrah"
            width={160}
            height={48}
            priority
            className="h-12 w-auto object-contain"
          />
          <span className="admin-sidebar__badge text-[0.65rem] uppercase tracking-[0.45em] px-4 py-1 rounded-full">
            Admin Panel
          </span>
          <p className="text-xs text-white/60">
            Command every booking, package, and partnership from one polished workspace.
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-6 flex-1 overflow-y-auto pr-1">
        <Link
          href="/"
          className="flex items-center gap-3 py-2.5 px-4 rounded-2xl border border-white/5 font-medium text-sm text-white/75 hover:text-white hover:border-white/20 hover:bg-white/5 transition-colors"
          onClick={() => setDrawerOpen(false)}
        >
          <Home className="w-4 h-4" />
          Go to Website
        </Link>

        <div className="mb-2">
          <p className={sectionHeadingClass}>Main</p>
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
          <Link
            href="/admin/hotels"
            className={linkClasses("/admin/hotels")}
            onClick={() => setDrawerOpen(false)}
          >
            <Hotel className="w-4 h-4" />
            Hotels
          </Link>
        </div>

        <div className="mb-2">
          <p className={sectionHeadingClass}>Bookings</p>
          <Link
            href="/admin/package-bookings"
            className={linkClasses("/admin/package-bookings")}
            onClick={() => setDrawerOpen(false)}
          >
            <BookOpen className="w-4 h-4" />
            Package Bookings
          </Link>
          <Link
            href="/admin/hotel-bookings"
            className={linkClasses("/admin/hotel-bookings")}
            onClick={() => setDrawerOpen(false)}
          >
            <Calendar className="w-4 h-4" />
            Hotel Bookings
          </Link>
          <Link
            href="/admin/custom-umrah-requests"
            className={linkClasses("/admin/custom-umrah-requests")}
            onClick={() => setDrawerOpen(false)}
          >
            <FileText className="w-4 h-4" />
            Custom Requests
          </Link>
        </div>

        <div className="mb-2">
          <p className={sectionHeadingClass}>Content</p>
          <Link
            href="/admin/form-options"
            className={linkClasses("/admin/form-options")}
            onClick={() => setDrawerOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Form Options
          </Link>
          <Link
            href="/admin/additional-services"
            className={linkClasses("/admin/additional-services")}
            onClick={() => setDrawerOpen(false)}
          >
            <Sparkles className="w-4 h-4" />
            Additional Services
          </Link>
          <Link
            href="/admin/service-types"
            className={linkClasses("/admin/service-types")}
            onClick={() => setDrawerOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Service Types
          </Link>
          <Link
            href="/admin/features"
            className={linkClasses("/admin/features")}
            onClick={() => setDrawerOpen(false)}
          >
            <ListChecks className="w-4 h-4" />
            Features
          </Link>
          <Link
            href="/admin/itineraries"
            className={linkClasses("/admin/itineraries")}
            onClick={() => setDrawerOpen(false)}
          >
            <Route className="w-4 h-4" />
            Itineraries
          </Link>
          <Link
            href="/admin/includes"
            className={linkClasses("/admin/includes")}
            onClick={() => setDrawerOpen(false)}
          >
            <CheckSquare className="w-4 h-4" />
            Includes
          </Link>
          <Link
            href="/admin/excludes"
            className={linkClasses("/admin/excludes")}
            onClick={() => setDrawerOpen(false)}
          >
            <XSquare className="w-4 h-4" />
            Excludes
          </Link>
          <Link
            href="/admin/policies"
            className={linkClasses("/admin/policies")}
            onClick={() => setDrawerOpen(false)}
          >
            <Scroll className="w-4 h-4" />
            Policies
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 hover:from-rose-400 hover:to-amber-300 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>
    </div>
  );

  return (
    <div className="admin-theme flex min-h-screen overflow-hidden">
      <aside className="hidden sm:flex admin-sidebar w-72 flex-shrink-0 p-6 flex-col fixed top-0 left-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 sm:ml-72 relative">

        <header className="sm:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-900/90 via-indigo-900/85 to-blue-900/80 text-white border-b border-white/10 shadow-lg shadow-blue-950/40 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Image
              src={telusBlueLogo}
              alt="Telus Umrah"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold">Admin</span>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation drawer"
            className="rounded-full p-2 hover:bg-white/10 active:scale-95 transition-all"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </header>

        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.aside
                key="mobileSidebar"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.22 }}
                className="fixed top-0 left-0 z-40 w-72 h-full bg-[#030b1e] p-6 flex flex-col rounded-tr-2xl shadow-lg shadow-blue-950/60 sm:hidden border-r border-white/10 overflow-y-auto"
              >
                <button
                  className="mb-4 ml-auto rounded-lg p-2 hover:bg-white/10"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation drawer"
                >
                  <X className="w-6 h-6 text-white/70" />
                </button>
                <SidebarContent />
              </motion.aside>

              <motion.button
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/70 z-30 sm:hidden"
                aria-label="Close drawer overlay"
                onClick={() => setDrawerOpen(false)}
              />
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-10 sm:py-10">
          <div className="admin-content-shell w-full p-4 sm:p-8">
            <div className="admin-surface">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

