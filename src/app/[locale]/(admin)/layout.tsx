"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "@/i18n/routing";
import { useHydrated } from "@/hooks/use-hydrated";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const isHydrated = useHydrated();

  useEffect(() => {
    // Only run protection after Zustand has hydrated from localStorage
    if (isHydrated) {
      if (!isAuthenticated || user?.role !== "admin") {
        router.push("/login");
      }
    }
  }, [isAuthenticated, user, router, isHydrated]);

  if (!isHydrated) {
    return null; // Wait for hydration
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null; 
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden md:block">
        <AdminSidebar />
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
