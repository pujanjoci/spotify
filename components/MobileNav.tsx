"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Upload, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/upload", icon: Upload, label: "Upload" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[64px] bg-[#0d0d14]/95 backdrop-blur-xl border-t border-[#2a2a40] flex items-center justify-around z-[99] pb-[env(safe-area-inset-bottom,0px)]">
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 no-underline transition-colors px-4 py-2 rounded-xl min-w-[44px] min-h-[44px] active:scale-95 ${
              active ? "text-[#a78bfa] bg-[#7c3aed]/10" : "text-[#5a5a7a] bg-transparent"
            }`}
          >
            <Icon size={22} />
            <span className="text-[0.625rem] font-semibold tracking-[0.04em]">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
