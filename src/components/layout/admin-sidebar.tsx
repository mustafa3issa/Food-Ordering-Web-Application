"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Settings, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

export function AdminSidebar() {
  const t = useTranslations("Admin");
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: t("dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/orders",
      label: t("orders"),
      icon: ShoppingBag,
    },
    {
      href: "/dashboard/menu",
      label: t("menuItems"),
      icon: UtensilsCrossed,
    },
    {
      href: "/dashboard/settings",
      label: t("settings"),
      icon: Settings,
    },
  ];

  return (
    <div className="flex flex-col h-full border-r bg-muted/20 w-64 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Store className="h-5 w-5" />
        </div>
        <span className="font-bold text-xl">{t("adminPanel")}</span>
      </div>

      <nav className="flex-1 space-y-2">
        {routes.map((route) => {
          const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
          return (
            <Link key={route.href} href={route.href}>
              <span
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                  isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground"
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}>
          <Store className="mr-2 h-4 w-4" />
          {t("backToStore")}
        </Link>
      </div>
    </div>
  );
}
