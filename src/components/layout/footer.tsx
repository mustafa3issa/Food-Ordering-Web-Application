import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, MessageCircle, PhoneCall, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const t = useTranslations("Footer");
  
  return (
    <footer className="bg-muted/40 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <UtensilsCrossed className="h-6 w-6" />
              <span>{t("brand")}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("description")}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary">
                <PhoneCall className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/menu" className="hover:text-primary transition-colors">{t("menu")}</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">{t("cart")}</Link></li>
              <li><Link href="/orders" className="hover:text-primary transition-colors">{t("orders")}</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">{t("admin")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t("support")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("faq")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("contact")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("terms")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("privacy")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t("contactUs")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("address")}</li>
              <li>{t("phone")}</li>
              <li>{t("email")}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {t("brand")}. {t("allRightsReserved")}</p>
          <p>{t("madeWithLove")}</p>
        </div>
      </div>
    </footer>
  );
}
