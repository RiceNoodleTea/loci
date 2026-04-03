"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useUserStore } from "@/lib/store/user";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setProfile = useUserStore((s) => s.setProfile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setProfile({
        id: "demo",
        email: "scholar@loci.app",
        display_name: "The Archivist",
        avatar_url: null,
      });
      return;
    }

    const supabase = createClient();

    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setProfile({
            id: user.id,
            email: user.email || "",
            display_name:
              user.user_metadata?.display_name ||
              user.email?.split("@")[0] ||
              "Scholar",
            avatar_url: user.user_metadata?.avatar_url || null,
          });
        }
      } catch {
        // Supabase unavailable — use demo profile
        setProfile({
          id: "demo",
          email: "scholar@loci.app",
          display_name: "The Archivist",
          avatar_url: null,
        });
      }
    }

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setProfile({
          id: session.user.id,
          email: session.user.email || "",
          display_name:
            session.user.user_metadata?.display_name ||
            session.user.email?.split("@")[0] ||
            "Scholar",
          avatar_url: session.user.user_metadata?.avatar_url || null,
        });
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setProfile]);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 lg:ml-[220px] flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
