"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useMenuStore } from "@/stores/menu-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, User, LogOut, Globe, Menu as MenuIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const menuT = useTranslations("Menu");

  const [isMounted, setIsMounted] = useState(false);

  const searchQuery = useMenuStore((state) => state.searchQuery);
  const setSearchQuery = useMenuStore((state) => state.setSearchQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (pathname !== "/menu") {
      router.push("/menu");
    }
  };

  const { user, isAuthenticated, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const NavLinks = () => (
    <>
      <Link href="/menu" className="text-sm font-medium transition-colors hover:text-primary">
        {t("menu")}
      </Link>
      {isMounted && isAuthenticated && (
        <Link href="/orders" className="text-sm font-medium transition-colors hover:text-primary">
          {t("myOrders")}
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        
        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="me-2" />}>
              <MenuIcon className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "right" : "left"} className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-6 mt-6">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="font-bold text-xl text-primary">
            {t("brand")}
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-bold text-2xl text-primary tracking-tight">
            {t("brand")}
          </Link>
          <nav className="flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md px-6">
          <div className="relative w-full">
            <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground start-3" />
            <Input
              type="search"
              placeholder={menuT("searchPlaceholder")}
              className="w-full ps-9 rounded-full bg-muted/50 focus-visible:bg-background"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleLocale} aria-label="Toggle language">
            <Globe className="h-5 w-5" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {!isMounted ? (
            <Skeleton className="h-9 w-9 rounded-full ms-2" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full border border-border bg-muted/50 ms-2" />}>
                <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {user?.role === "admin" && (
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    {t("dashboard")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="me-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex gap-2 ms-2">
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                {t("login")}
              </Link>
              <Link href="/register" className={buttonVariants()}>
                {t("register")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
