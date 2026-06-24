import { getTranslations } from "next-intl/server";
import { MenuTable } from "@/features/admin/menu-table";
import { PageHeader } from "@/components/shared/page-header";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return {
    title: t("menuItems") + " | " + t("adminPanel"),
  };
}

export default async function AdminMenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <div className="space-y-8">
      <PageHeader title={t("menuItems")} />
      <MenuTable />
    </div>
  );
}
