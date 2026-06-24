"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CartList() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);

  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP",
    }).format(amount / 100);
  };

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted p-6 rounded-full mb-6">
          <Trash2 className="h-12 w-12 text-muted-foreground opacity-50" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t("emptyTitle")}</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {t("emptyDescription")}
        </p>
        <Link href="/menu" className={buttonVariants({ size: "lg" })}>
          {t("browseMenu")}
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 1500; // 15 SAR Mock delivery fee
  const total = subtotal + deliveryFee;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold mb-4">{t("pageTitle")}</h2>
        {items.map((item) => {
          const menuItem = item.menuItem;
          const name = locale === "ar" ? menuItem.nameAr : menuItem.nameEn;
          
          return (
            <Card key={menuItem.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-32 h-32 bg-muted shrink-0">
                  <Image
                    src={menuItem.image}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-grow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{name}</h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {formatPrice(menuItem.price)}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => removeItem(menuItem.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(menuItem.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(menuItem.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold">
                      {formatPrice(menuItem.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>{t("orderSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("deliveryFee")}</span>
              <span className="font-medium">{formatPrice(deliveryFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>{t("total")}</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              {t("proceedToCheckout")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
