"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Buildings,
  CircleNotch,
  ShieldCheck,
  UserCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "@/hooks/use-login";
import { useSlowHint } from "@/hooks/use-slow-hint";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import { type LoginInput, loginSchema } from "@/lib/validations/auth";
import type { Role } from "@/types/api";
import { GoogleButton } from "@/components/shared/google-button";
const ROLE_ICON: Record<Role, typeof ShieldCheck> = {
  ADMIN: ShieldCheck,
  CANDIDATE: UserCircle,
  COMPANY: Buildings,
};

export function LoginView() {
  const login = useLogin();
  const slow = useSlowHint(login.isPending);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    fetch("/api/health").catch(() => undefined);
  }, []);

  const pendingEmail = login.isPending ? login.variables?.email : null;

  return (
    <div className="w-full max-w-lg space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back 👋</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((v) => login.mutate(v))}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending && (
                <CircleNotch className="mr-2 size-4 animate-spin" />
              )}
              Login
            </Button>
          </form>
          <div className="my-5 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>
          <GoogleButton />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <section aria-labelledby="demo-heading" className="space-y-3">
        <h2 id="demo-heading" className="text-center text-sm font-medium">
          🚀 Quick Demo Login
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          {DEMO_ACCOUNTS.map((acc) => {
            const Icon = ROLE_ICON[acc.role];
            const loading = pendingEmail === acc.email;
            return (
              <Card key={acc.role} className="text-center">
                <CardContent className="flex h-full flex-col items-center gap-2 p-4">
                  <Icon
                    className="size-6 text-primary"
                    weight="duotone"
                    aria-hidden
                  />
                  <p className="font-semibold">{acc.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {acc.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto w-full"
                    disabled={login.isPending || !acc.email}
                    onClick={() =>
                      login.mutate({ email: acc.email, password: acc.password })
                    }
                  >
                    {loading && (
                      <CircleNotch className="mr-2 size-3 animate-spin" />
                    )}
                    Demo Login
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {slow && (
          <output className="block text-center text-xs text-muted-foreground">
            Waking up the server. The first request can take up to a minute.
          </output>
        )}
      </section>
    </div>
  );
}
