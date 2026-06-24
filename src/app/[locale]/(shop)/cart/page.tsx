import { CartList } from "@/features/cart/cart-list";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Cart" });
  return {
    title: t("pageTitle"),
  };
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CartList />
    </div>
  );
}
