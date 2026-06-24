"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/stores/auth-store";
import { useOrderStore } from "@/stores/order-store";
import { OrderTimeline } from "@/features/order/order-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, MapPin, Phone, Receipt } from "lucide-react";
import { use } from "react";

export default function OrderTrackingPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("Orders");
  const locale = useLocale();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const { user, isAuthenticated } = useAuthStore();
  const orders = useOrderStore((state) => state.orders);
  
  const BackIcon = locale === "ar" ? ArrowRight : ArrowLeft;

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isMounted, router]);

  if (!isMounted || !isAuthenticated || !user) {
    return null;
  }

  const order = orders.find(o => o.id === id && o.userId === user.id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("notFoundTitle")}</h1>
        <p className="text-muted-foreground mb-8">{t("notFoundDescription")}</p>
        <Link href="/orders">
          <Button>{t("backToOrders")}</Button>
        </Link>
      </div>
    );
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP",
    }).format(amount / 100);
  };

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(isoString));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div>
        <Link href="/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <BackIcon className="me-2 h-4 w-4" />
          {t("backToOrders")}
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t("orderId")}: {order.id}</h1>
            <p className="text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("trackingTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline currentStatus={order.status} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {t("orderSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground me-4">
                    <span className="font-medium text-foreground">{item.quantity}x</span>{" "}
                    {locale === "ar" ? item.nameAr : item.nameEn}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>{t("total")}</span>
              <span className="text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t("deliveryDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">{t("customerName")}</p>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">{t("shippingAddress")}</p>
              <p className="text-sm text-muted-foreground">{order.deliveryAddress || t("noAddressProvided")}</p>
            </div>
            <div>
              <p className="text-sm font-medium">{t("paymentMethod")}</p>
              <p className="text-sm text-muted-foreground uppercase">{order.paymentMethod || "CASH"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
