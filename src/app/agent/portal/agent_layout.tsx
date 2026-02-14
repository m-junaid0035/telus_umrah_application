"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Hotel,
  LogOut,
  Briefcase,
  User,
  Home,
} from "lucide-react";
import Image from "next/image";
import telusBlueLogo from "@/assets/telus-umrah-blue.png";
import telusWhiteLogo from "@/assets/telus-umrah-white.png";

type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface AgentLayoutProps {
  children: React.ReactNode;
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/agent/logout', { method: 'POST' });
      router.push("/agent/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems: NavItem[] = [
    { path: "/agent/portal", label: "Dashboard", icon: LayoutDashboard },
    { path: "/agent/portal/packages", label: "Packages", icon: Package },
    { path: "/agent/portal/hotels", label: "Hotels", icon: Hotel },
  ];

  const isActive = (path: string) =>
    pathname === path || (path !== "/agent/portal" && pathname.startsWith(path));

  const linkClasses = (path: string) =>
    `group flex items-center gap-3 py-2.5 px-4 rounded-2xl border transition-all font-medium text-sm ${
      isActive(path)
        ? "bg-gradient-to-r from-purple-500/90 via-blue-500/90 to-blue-400/80 text-white border-white/30 shadow-lg shadow-purple-900/30"
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
          <span className="agent-sidebar__badge text-[0.65rem] uppercase tracking-[0.45em] px-4 py-1 rounded-full bg-purple-500/20 text-white border border-white/10">
            Agent Portal
          </span>
          <p className="text-xs text-white/60">
            Access exclusive packages and manage your bookings efficiently.
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
          <p className={sectionHeadingClass}>Main Menu</p>
          {navItems.map(({ path, label, icon: Icon }) => (
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
          className="mt-auto w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 hover:from-rose-400 hover:to-amber-300 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>
    </div>
  );

  return (
    <div className="agent-theme flex min-h-screen overflow-hidden">
      <aside className="hidden min-[900px]:flex agent-sidebar w-72 flex-shrink-0 p-6 flex-col fixed top-0 left-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-[900px]:ml-72 relative">
        <header className="min-[900px]:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-900/90 via-indigo-900/85 to-purple-900/80 text-white border-b border-white/10 shadow-lg shadow-purple-950/40 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Image
              src={telusBlueLogo}
              alt="Telus Umrah"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold">Agent</span>
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
                key="agentSidebar"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.22 }}
                className="fixed top-0 left-0 z-40 w-72 h-full bg-[#1a0b2e] p-6 flex flex-col rounded-tr-2xl shadow-lg shadow-purple-950/60 min-[900px]:hidden border-r border-white/10 overflow-y-auto"
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
                className="fixed inset-0 bg-black/70 z-30 min-[900px]:hidden"
                aria-label="Close drawer overlay"
                onClick={() => setDrawerOpen(false)}
              />
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto px-4 py-6 min-[900px]:px-10 min-[900px]:py-10">
          <div className="agent-content-shell w-full p-4 min-[900px]:p-8">
            <div className="agent-surface">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
