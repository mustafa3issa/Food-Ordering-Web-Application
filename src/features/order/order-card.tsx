"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Order } from "@/types";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, CalendarIcon, PackageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const Icon = locale === "ar" ? ChevronLeft : ChevronRight;

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoString));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP",
    }).format(amount / 100);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-up">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <PackageIcon className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">{t("orderId")}: {order.id}</span>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{formatDate(order.createdAt)}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="line-clamp-1 me-4">
                {item.quantity}x {locale === "ar" ? item.nameAr : item.nameEn}
              </span>
              <span className="text-muted-foreground whitespace-nowrap">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="text-sm text-muted-foreground pt-2">
              {t("plusMoreItems", { count: order.items.length - 3 })}
            </div>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between items-center p-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase">{t("total")}</span>
          <span className="font-bold">{formatPrice(order.totalAmount)}</span>
        </div>
        <Link href={`/orders/${order.id}`}>
          <Button variant="outline" size="sm" className="gap-1">
            {t("viewDetails")}
            <Icon className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
