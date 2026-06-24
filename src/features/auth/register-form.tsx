"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export function RegisterForm() {
  const t = useTranslations("Common");
  const authT = useTranslations("Auth");
  const router = useRouter();
  const registerAction = useAuthStore((state) => state.register);
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(8, { message: "Phone must be at least 8 characters" }),
    address: z.string().min(5, { message: "Address must be at least 5 characters" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    try {
      await registerAction(data.name, data.email, data.phone, data.address);
      toast.success(authT("registerSuccess"));
      router.push("/menu");
    } catch (error) {
      toast.error(t("error"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{authT("registerTitle")}</CardTitle>
        <CardDescription>{authT("registerDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{authT("nameLabel")}</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{authT("emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{authT("phoneLabel")}</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              {...register("phone")}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{authT("addressLabel")}</Label>
            <Input
              id="address"
              placeholder="123 Main St, City"
              {...register("address")}
              disabled={isLoading}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{authT("passwordLabel")}</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {authT("registerButton")}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground w-full text-center">
          {authT("hasAccount")}{" "}
          <Link href="/login" className="text-primary hover:underline">
            {authT("loginLink")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
