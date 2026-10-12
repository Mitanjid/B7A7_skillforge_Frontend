"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotch, EnvelopeSimple } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
import { useVerifyEmail } from "@/hooks/use-verify-email";
import {
  type VerifyEmailInput,
  verifyEmailSchema,
} from "@/lib/validations/auth";

function VerifyEmailForm() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const verify = useVerifyEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <EnvelopeSimple
          className="mx-auto size-10 text-primary"
          weight="duotone"
        />
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>
          {email
            ? `We sent a 6-digit code to ${email}`
            : "Enter your email and the code we sent you"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((v) => verify.mutate(v))}
          className="space-y-4"
          noValidate
        >
          {!email && (
            <Input
              type="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          )}
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}

          <Input
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            className="text-center text-lg tracking-[0.5em]"
            aria-invalid={!!errors.otp}
            {...register("otp")}
          />
          {errors.otp && (
            <p className="text-sm text-destructive">{errors.otp.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={verify.isPending}>
            {verify.isPending && (
              <CircleNotch className="mr-2 size-4 animate-spin" />
            )}
            Verify email
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
