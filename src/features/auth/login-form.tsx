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
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const t = useTranslations("Common");
  const authT = useTranslations("Auth");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  // We define the schema inside the component to use translations, or use simple static messages
  const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      // For prototype: we simulate login. Anyone can login with any password.
      // If email contains "admin", we make them admin.
      const role = data.email.toLowerCase().includes("admin") ? "admin" : "customer";
      await login(data.email, role);
      
      toast.success(authT("loginSuccess"));
      
      // Redirect based on role
      if (role === "admin") {
        router.push("/dashboard");
      } else if (redirect) {
        router.push(redirect);
      } else {
        router.push("/menu");
      }
    } catch (error) {
      toast.error(t("error"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{authT("loginTitle")}</CardTitle>
        <CardDescription>{authT("loginDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-2">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Customer:</span><br />
              <code className="text-xs">user@example.com</code>
            </div>
            <div>
              <span className="font-medium">Admin:</span><br />
              <code className="text-xs">admin@example.com</code>
            </div>
          </div>
          <p className="text-xs mt-2 italic">* Password can be anything (min 6 chars)</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{authT("passwordLabel")}</Label>
            </div>
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
            {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {authT("loginButton")}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground w-full text-center">
          {authT("noAccount")}{" "}
          <Link href={redirect ? `/register?redirect=${redirect}` : "/register"} className="text-primary hover:underline">
            {authT("registerLink")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
