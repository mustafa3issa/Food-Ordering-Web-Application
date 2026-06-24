"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/stores/cart-store";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import { Order } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CheckoutForm() {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const { user, isAuthenticated } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, isMounted, router]);

  const formSchema = z.object({
    fullName: z.string().min(2, { message: t("errors.nameRequired") }),
    phone: z.string().min(8, { message: t("errors.phoneRequired") }),
    address: z.string().min(5, { message: t("errors.addressRequired") }),
    city: z.string().min(2, { message: t("errors.cityRequired") }),
    paymentMethod: z.enum(["cash", "card"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.name || "",
      phone: "",
      address: "",
      city: "",
      paymentMethod: "cash",
    },
  });

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP",
    }).format(amount / 100);
  };

  if (!isMounted || !isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 1500; // 15 EGP
  const total = subtotal + deliveryFee;

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      userId: user!.id,
      items: items.map(item => ({
        menuItemId: item.menuItem.id,
        nameEn: item.menuItem.nameEn,
        nameAr: item.menuItem.nameAr,
        quantity: item.quantity,
        unitPrice: item.menuItem.price,
        image: item.menuItem.image
      })),
      status: "pending",
      totalAmount: total,
      createdAt: new Date().toISOString(),
      deliveryAddress: `${values.address}, ${values.city}`,
      deliveryFee: deliveryFee,
      notes: "",
      paymentMethod: values.paymentMethod as "cash" | "card",
      estimatedDeliveryMinutes: 45,
    };

    addOrder(newOrder);
    clearCart();
    
    toast.success(t("successMessage"), {
      description: `${t("orderId")}: ${newOrder.id}`,
    });
    
    router.push("/orders");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("shippingDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium leading-none">{t("fullName")}</label>
                  <Input 
                    id="fullName" 
                    placeholder={t("fullNamePlaceholder")} 
                    {...form.register("fullName")} 
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium leading-none">{t("phone")}</label>
                  <Input 
                    id="phone" 
                    placeholder="01X XXXX XXXX" 
                    {...form.register("phone")} 
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="address" className="text-sm font-medium leading-none">{t("address")}</label>
                  <Textarea 
                    id="address" 
                    placeholder={t("addressPlaceholder")} 
                    className="resize-none" 
                    {...form.register("address")} 
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium leading-none">{t("city")}</label>
                  <Input 
                    id="city" 
                    placeholder={t("cityPlaceholder")} 
                    {...form.register("city")} 
                  />
                  {form.formState.errors.city && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <Separator />
              
              <div className="space-y-3">
                <label className="text-sm font-medium leading-none">{t("paymentMethod")}</label>
                <RadioGroup
                  defaultValue={form.getValues("paymentMethod")}
                  onValueChange={(value) => form.setValue("paymentMethod", value as "cash" | "card")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="cash" id="cash" />
                    <label htmlFor="cash" className="font-normal text-sm cursor-pointer">
                      {t("cashOnDelivery")}
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="card" id="card" disabled />
                    <label htmlFor="card" className="font-normal text-sm text-muted-foreground">
                      {t("creditCard")} ({t("comingSoon")})
                    </label>
                  </div>
                </RadioGroup>
                {form.formState.errors.paymentMethod && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.paymentMethod.message}
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>{t("orderSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-h-60 overflow-y-auto pe-2">
              {items.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 me-4">
                    {item.quantity}x {locale === "ar" ? item.menuItem.nameAr : item.menuItem.nameEn}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {formatPrice(item.menuItem.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("deliveryFee")}</span>
              <span className="font-medium">{formatPrice(deliveryFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>{t("total")}</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={form.handleSubmit(onSubmit)}
            >
              {t("placeOrder")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
