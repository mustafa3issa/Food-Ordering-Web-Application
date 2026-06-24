import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";
import { useTranslations } from "next-intl";

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("Orders.status");

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return { label: t("pending"), variant: "outline" as const };
      case "confirmed":
        return { label: t("confirmed"), variant: "secondary" as const };
      case "preparing":
        return { label: t("preparing"), variant: "default" as const };
      case "ready":
        return { label: t("ready"), variant: "secondary" as const };
      case "out_for_delivery":
        return { label: t("out_for_delivery"), variant: "default" as const };
      case "delivered":
        return { label: t("delivered"), variant: "outline" as const, className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" };
      case "cancelled":
        return { label: t("cancelled"), variant: "destructive" as const };
      default:
        return { label: status, variant: "outline" as const };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
