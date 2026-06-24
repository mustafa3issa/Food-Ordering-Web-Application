import { getTranslations } from "next-intl/server";
import { StatsGrid } from "@/features/admin/stats-grid";
import { PageHeader } from "@/components/shared/page-header";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return {
    title: t("dashboard") + " | " + t("adminPanel"),
  };
}

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <div className="space-y-8">
      <PageHeader title={t("dashboard")} />
      <StatsGrid />
    </div>
  );
}
