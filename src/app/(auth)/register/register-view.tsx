"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Buildings,
  Check,
  CircleNotch,
  UserCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleButton } from "@/components/shared/google-button";
import { PasswordInput } from "@/components/shared/password-input";
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
import { useRegister } from "@/hooks/use-register";
import { cn } from "@/lib/utils";
import { type RegisterInput, registerSchema } from "@/lib/validations/auth";

// ADMIN can't self-register, so the form only deals with these two roles.
type SelfServeRole = RegisterInput["role"];

const ROLE_OPTIONS: {
  role: SelfServeRole;
  label: string;
  description: string;
  icon: typeof UserCircle;
}[] = [
  {
    role: "CANDIDATE",
    label: "Candidate",
    description: "I want to take assessments",
    icon: UserCircle,
  },
  {
    role: "COMPANY",
    label: "Company",
    description: "I want to hire and assess",
    icon: Buildings,
  },
];

export function RegisterView() {
  const registerMutation = useRegister();
  const [role, setRole] = useState<SelfServeRole>("CANDIDATE");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CANDIDATE" },
  });

  const pickRole = (next: SelfServeRole) => {
    setRole(next);
    setValue("role", next, { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Join SkillForge in a minute</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((v) => registerMutation.mutate(v))}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label>I am a</Label>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = role === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => pickRole(opt.role)}
                    className={cn(
                      "relative flex flex-col items-center gap-1 rounded-lg border p-4 text-center transition-colors",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    {active && (
                      <Check
                        weight="bold"
                        className="absolute right-2 top-2 size-4 text-primary"
                      />
                    )}
                    <Icon className="size-6 text-primary" weight="duotone" />
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

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
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending && (
              <CircleNotch className="mr-2 size-4 animate-spin" />
            )}
            Create account
          </Button>
        </form>
        <div className="my-5 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>
        <GoogleButton role={role} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
