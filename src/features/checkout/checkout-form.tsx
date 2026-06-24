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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
      items: [...items],
      status: "pending",
      totalAmount: total,
      createdAt: new Date().toISOString(),
      shippingAddress: `${values.address}, ${values.city}`,
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fullName")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("fullNamePlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phone")}</FormLabel>
                        <FormControl>
                          <Input placeholder="01X XXXX XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t("address")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t("addressPlaceholder")} 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("city")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("cityPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("paymentMethod")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t("cashOnDelivery")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0">
                            <FormControl>
                              <RadioGroupItem value="card" disabled />
                            </FormControl>
                            <FormLabel className="font-normal text-muted-foreground">
                              {t("creditCard")} ({t("comingSoon")})
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>{t("orderSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 mr-4">
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
