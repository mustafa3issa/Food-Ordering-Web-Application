import { MenuList } from "@/features/menu/menu-list";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Menu" });
  return {
    title: t("pageTitle"),
  };
}

export default function MenuPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MenuList />
    </div>
  );
}
