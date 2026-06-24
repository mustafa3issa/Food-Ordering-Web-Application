import { getTranslations } from "next-intl/server";
import { OrderList } from "@/features/order/order-list";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Orders" });
  return {
    title: t("pageTitle"),
  };
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <OrderList />
    </div>
  );
}
