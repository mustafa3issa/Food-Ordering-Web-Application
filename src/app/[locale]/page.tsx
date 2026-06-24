import { redirect } from "@/i18n/routing";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Redirect to the shop menu as the default landing page for the prototype
  redirect({ href: "/menu", locale });
}
