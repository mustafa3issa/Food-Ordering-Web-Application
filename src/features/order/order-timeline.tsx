import { OrderStatus } from "@/types";
import { CheckCircle2, Clock, ChefHat, PackageCheck, Truck, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const t = useTranslations("Orders.timeline");

  // If cancelled, show a different UI or just highlight cancelled. For simplicity, we'll hide timeline if cancelled
  if (currentStatus === "cancelled") {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg font-medium text-center">
        {t("orderCancelled")}
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  const steps = [
    { id: "pending", icon: Clock, label: t("pending") },
    { id: "confirmed", icon: CheckCircle2, label: t("confirmed") },
    { id: "preparing", icon: ChefHat, label: t("preparing") },
    { id: "ready", icon: PackageCheck, label: t("ready") },
    { id: "out_for_delivery", icon: Truck, label: t("out_for_delivery") },
    { id: "delivered", icon: Home, label: t("delivered") },
  ];

  return (
    <div className="relative border-s border-muted-foreground/20 ms-4 md:ms-0 md:border-s-0 md:border-t md:flex md:justify-between pt-6 md:pt-12">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;

        return (
          <div 
            key={step.id} 
            className="mb-8 md:mb-0 ms-6 md:ms-0 relative flex flex-col md:items-center w-full"
          >
            {/* Dot/Icon */}
            <div 
              className={cn(
                "absolute -start-10 md:static md:mb-3 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-background z-10 transition-colors",
                isCompleted 
                  ? "border-primary text-primary" 
                  : "border-muted text-muted-foreground",
                isCurrent && "bg-primary text-primary-foreground border-primary"
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            
            {/* Connecting line for desktop */}
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "hidden md:block absolute top-4 start-1/2 w-full h-[2px] -z-0",
                  index < currentIndex ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}

            <div className="md:text-center">
              <h4 className={cn("text-sm font-semibold", isCompleted ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
              </h4>
              {isCurrent && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t("currentStage")}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
