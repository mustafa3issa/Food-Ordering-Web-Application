"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Basic route protection for prototype
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null; // or a loading spinner
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
