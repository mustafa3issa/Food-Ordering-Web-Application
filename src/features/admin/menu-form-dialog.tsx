"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MenuItem } from "@/types";
import { useMenuStore } from "@/stores/menu-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  nameEn: z.string().min(2),
  nameAr: z.string().min(2),
  descriptionEn: z.string().min(10),
  descriptionAr: z.string().min(10),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  image: z.string().url(),
});

type FormValues = z.infer<typeof formSchema>;

interface MenuFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
}

export function MenuFormDialog({ open, onOpenChange, item }: MenuFormDialogProps) {
  const t = useTranslations("Admin.menu");
  const locale = useLocale();
  const { categories, addMenuItem, updateMenuItem } = useMenuStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      descriptionEn: "",
      descriptionAr: "",
      price: 0,
      categoryId: "",
      image: "",
    },
  });

  useEffect(() => {
    if (item && open) {
      reset({
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        descriptionEn: item.descriptionEn,
        descriptionAr: item.descriptionAr,
        price: item.price / 100, // Convert cents to whole
        categoryId: item.categoryId,
        image: item.image,
      });
    } else if (open) {
      reset({
        nameEn: "",
        nameAr: "",
        descriptionEn: "",
        descriptionAr: "",
        price: 0,
        categoryId: "",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500", // Default placeholder
      });
    }
  }, [item, open, reset]);

  const onSubmit = (data: FormValues) => {
    const formattedData = {
      ...data,
      price: Math.round(data.price * 100), // Convert to cents
      isAvailable: item ? item.isAvailable : true,
      isFeatured: item ? item.isFeatured : false,
    };

    if (item) {
      updateMenuItem(item.id, formattedData);
    } else {
      addMenuItem(formattedData);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? t("editMenuItem") : t("addMenuItem")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("nameEn")}</label>
              <Input {...register("nameEn")} />
              {errors.nameEn && <p className="text-sm text-destructive">{errors.nameEn.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("nameAr")}</label>
              <Input {...register("nameAr")} />
              {errors.nameAr && <p className="text-sm text-destructive">{errors.nameAr.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("price")} (EGP)</label>
              <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("category")}</label>
              <Select 
                defaultValue={item?.categoryId} 
                onValueChange={(val) => setValue("categoryId", val as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {locale === "ar" ? cat.nameAr : cat.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("image")} URL</label>
            <Input {...register("image")} />
            {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("descriptionEn")}</label>
            <Textarea {...register("descriptionEn")} />
            {errors.descriptionEn && <p className="text-sm text-destructive">{errors.descriptionEn.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("descriptionAr")}</label>
            <Textarea {...register("descriptionAr")} />
            {errors.descriptionAr && <p className="text-sm text-destructive">{errors.descriptionAr.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {t("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
