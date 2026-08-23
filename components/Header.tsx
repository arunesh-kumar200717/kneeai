"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Layers, Disc, LayoutDashboard, Menu, X, Database, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMock = apiClient.isMockMode();

  const navItems = [
    {
      href: "/",
      label: "Research Hub",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      href: "/meniscus",
      label: "Module 1: Meniscus MRI",
      icon: Disc,
      active: pathname === "/meniscus",
    },
    {
      href: "/segmentation",
      label: "Module 2: X-Ray Bone Segmentation",
      icon: Layers,
      active: pathname === "/segmentation",
    },
    {
      href: "/implant",
      label: "Module 3: Implant Matching",
      icon: Database,
      active: pathname === "/implant",
    },
  ];

  return (
    <header className="w-full bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 border-b border-border sticky top-0 z-40 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo & Clinical Title */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-clinical rounded-md p-1"
            >
              <div className="w-8 h-8 rounded-md bg-navy-800 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-clinical transition-colors">
                <Activity className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base tracking-tight leading-tight">
                    Knee AI
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-surface-muted text-slate-300 border border-border">
                    v1.0.4-rc
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline leading-none mt-0.5">
                  Osteoarthritis Imaging & Anatomical Segmentation
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      item.active
                        ? "bg-clinical-light text-clinical border border-clinical-border font-semibold shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-surface-muted"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${item.active ? "text-clinical" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Status / Mode Indicators */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-muted border border-border text-[11px] text-slate-300">
              <Database className="w-3 h-3 text-slate-400" />
              <span>Backend:</span>
              {isMock ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  MOCK FIXTURES
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-clinical font-semibold bg-clinical-light px-1.5 py-0.5 rounded border border-clinical-border text-[10px]">
                  LIVE ({apiClient.getApiBaseUrl().replace(/https?:\/\//, "")})
                </span>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-surface-muted border border-border"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 px-4 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                  item.active
                    ? "bg-clinical-light text-clinical font-semibold"
                    : "text-slate-300 hover:bg-surface-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border mt-2">
            <div className="flex items-center justify-between text-xs px-3 py-1.5 text-slate-300 bg-surface-muted rounded">
              <span>Environment:</span>
              <span className="font-mono font-medium text-white">
                {isMock ? "Mock Fixtures (Zero Server)" : "Live FastAPI"}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
