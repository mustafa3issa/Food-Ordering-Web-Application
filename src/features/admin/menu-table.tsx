"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useMenuStore } from "@/stores/menu-store";
import { MenuItem } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import Image from "next/image";
import { MenuFormDialog } from "./menu-form-dialog";

export function MenuTable() {
  const t = useTranslations("Admin.menu");
  const locale = useLocale();
  const { items, categories, updateMenuItem, deleteMenuItem } = useMenuStore();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filteredItems = items.filter(item => {
    const q = search.toLowerCase();
    return item.nameEn.toLowerCase().includes(q) || item.nameAr.includes(q);
  });

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return categoryId;
    return locale === "ar" ? cat.nameAr : cat.nameEn;
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t("deleteConfirm"))) {
      deleteMenuItem(id);
    }
  };

  const toggleAvailability = (id: string, currentStatus: boolean) => {
    updateMenuItem(id, { isAvailable: !currentStatus });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="ps-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate}>
          <Plus className="me-2 h-4 w-4" />
          {t("addMenuItem")}
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t("image")}</TableHead>
              <TableHead>{locale === "ar" ? t("nameAr") : t("nameEn")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead>{t("price")}</TableHead>
              <TableHead className="text-center">{t("availability")}</TableHead>
              <TableHead className="text-end">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.nameEn}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {locale === "ar" ? item.nameAr : item.nameEn}
                  </TableCell>
                  <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                  <TableCell>{(item.price / 100).toFixed(2)} EGP</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() => toggleAvailability(item.id, item.isAvailable)}
                    />
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MenuFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        item={editingItem}
      />
    </div>
  );
}
