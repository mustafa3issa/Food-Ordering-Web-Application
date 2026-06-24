import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return {
    title: t("settings") + " | " + t("adminPanel"),
  };
}

export default async function AdminSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <div className="space-y-8">
      <PageHeader title={t("settings")} />
      
      <Card>
        <CardHeader>
          <CardTitle>{t("settings")}</CardTitle>
          <CardDescription>
            {locale === "ar" 
              ? "هذه الصفحة قيد التطوير. سيتم توفير إعدادات المتجر العامة هنا قريباً."
              : "This page is under development. General store settings will be available here soon."}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center border-t border-dashed bg-muted/20">
          <p className="text-muted-foreground">
            {locale === "ar" ? "قريباً (Coming Soon)" : "Coming Soon"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
