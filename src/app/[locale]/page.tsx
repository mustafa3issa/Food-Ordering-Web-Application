import { redirect } from "@/i18n/routing";

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  // Redirect to the shop menu as the default landing page for the prototype
  redirect({ href: "/menu", locale });
}
