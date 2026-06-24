"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderStore } from "@/stores/order-store";
import { DollarSign, ShoppingBag, Clock, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function StatsGrid() {
  const t = useTranslations("Admin.stats");
  const locale = useLocale();
  const [isMounted, setIsMounted] = useState(false);
  const orders = useOrderStore((state) => state.orders);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status !== "cancelled") {
      return sum + order.totalAmount;
    }
    return sum;
  }, 0);

  const totalOrders = orders.length;
  
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed" || o.status === "preparing"
  ).length;
  
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const stats = [
    {
      title: t("totalRevenue"),
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      description: t("revenueDescription"),
    },
    {
      title: t("totalOrders"),
      value: totalOrders.toString(),
      icon: ShoppingBag,
      description: t("ordersDescription"),
    },
    {
      title: t("pendingOrders"),
      value: pendingOrders.toString(),
      icon: Clock,
      description: t("pendingDescription"),
    },
    {
      title: t("deliveredOrders"),
      value: deliveredOrders.toString(),
      icon: CheckCircle,
      description: t("deliveredDescription"),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
