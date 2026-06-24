"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/stores/auth-store";
import { useOrderStore } from "@/stores/order-store";
import { OrderCard } from "./order-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export function OrderList() {
  const t = useTranslations("Orders");
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const { user, isAuthenticated } = useAuthStore();
  const getOrdersByUserId = useOrderStore((state) => state.getOrdersByUserId);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && !isAuthenticated) {
      router.push("/login?redirect=/orders");
    }
  }, [isAuthenticated, isMounted, router]);

  if (!isMounted || !isAuthenticated || !user) {
    return null;
  }

  const userOrders = getOrdersByUserId(user.id);

  if (userOrders.length === 0) {
    return (
      <div className="py-12">
        <PageHeader title={t("pageTitle")} />
        <EmptyState
          icon={<Receipt className="h-12 w-12 text-muted-foreground" />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          actionLabel={t("startOrdering")}
          actionHref="/menu"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
