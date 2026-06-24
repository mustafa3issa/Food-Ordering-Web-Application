import { getTranslations } from "next-intl/server";
import { OrdersTable } from "@/features/admin/orders-table";
import { PageHeader } from "@/components/shared/page-header";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return {
    title: t("orders") + " | " + t("adminPanel"),
  };
}

export default async function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <div className="space-y-8">
      <PageHeader title={t("orders")} />
      <OrdersTable />
    </div>
  );
}
