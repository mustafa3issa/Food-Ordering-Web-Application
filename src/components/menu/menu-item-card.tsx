"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { MenuItem } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const locale = useLocale();
  const t = useTranslations("Menu");
  const addItem = useCartStore((state) => state.addItem);

  const name = locale === "ar" ? item.nameAr : item.nameEn;
  const description = locale === "ar" ? item.descriptionAr : item.descriptionEn;
  
  // Format price (assuming price is in smallest unit, e.g., halalas or cents)
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EGP", // Changed to Egyptian Pound
  }).format(item.price / 100);

  const handleAddToCart = () => {
    addItem(item, 1);
    toast.success(t("addedToCart"), {
      description: name,
    });
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={item.image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {item.isFeatured && (
          <div className="absolute top-2 start-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
            {t("featured")}
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-semibold text-lg line-clamp-1" title={name}>
            {name}
          </h3>
          <span className="font-bold text-primary whitespace-nowrap">
            {formattedPrice}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2" title={description}>
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full gap-2"
          disabled={!item.isAvailable}
        >
          <Plus className="h-4 w-4" />
          {item.isAvailable ? t("addToCart") : t("soldOut")}
        </Button>
      </CardFooter>
    </Card>
  );
}
