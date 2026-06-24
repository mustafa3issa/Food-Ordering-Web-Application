"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMenuStore } from "@/stores/menu-store";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function MenuList() {
  const locale = useLocale();
  const t = useTranslations("Menu");
  
  const { 
    categories, 
    searchQuery, 
    selectedCategoryId, 
    setSearchQuery, 
    setSelectedCategory, 
    getFilteredItems 
  } = useMenuStore();

  const filteredItems = getFilteredItems();

  return (
    <div className="space-y-8">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:max-w-xs">
          <Search className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground", locale === "ar" ? "right-3" : "left-3")} />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            className={cn("w-full", locale === "ar" ? "pr-9" : "pl-9")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button
          variant={selectedCategoryId === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="whitespace-nowrap rounded-full"
        >
          {t("all")}
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap rounded-full"
          >
            {locale === "ar" ? category.nameAr : category.nameEn}
          </Button>
        ))}
      </div>

      {/* Menu Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-lg font-semibold text-muted-foreground">
            {t("noItemsFound")}
          </h3>
        </div>
      )}
    </div>
  );
}
