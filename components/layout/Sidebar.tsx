"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  HelpCircle,
  Archive,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/lib/store/user";

const navItems = [
  { href: "/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/study", label: "Study Tools", icon: BookOpen },
  { href: "/groups", label: "Groups", icon: Users },
];

const bottomItems = [
  { href: "/help", label: "Help", icon: HelpCircle },
  { href: "/archive", label: "Archive", icon: Archive },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initial = profile?.display_name?.charAt(0).toUpperCase() || "?";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-[220px] bg-parchment-dark border-r border-border flex flex-col z-30 transition-transform duration-200",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 pb-3 flex items-center justify-between">
          <Link href="/home" className="text-xl font-serif font-bold text-charcoal">
            Loci
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-muted hover:text-charcoal hover:bg-parchment transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-full bg-olive text-white flex items-center justify-center text-sm font-semibold shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">
                {profile?.display_name || "Scholar"}
              </p>
              <p className="label-caps text-[10px]">Curator Profile</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-olive text-white"
                    : "text-muted hover:text-charcoal hover:bg-parchment"
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-2 space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:text-charcoal hover:bg-parchment transition-colors"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
