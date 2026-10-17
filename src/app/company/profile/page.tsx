"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotch } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ME_KEY, useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import { ProfileImageUpload } from "@/components/shared/profile-image-upload";

const schema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.union([z.url("Enter a valid URL"), z.literal("")]),
  industry: z.string(),
});
type ProfileValues = z.infer<typeof schema>;

export default function CompanyProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(schema),
    values: {
      companyName: user?.companyProfile?.companyName ?? "",
      website: user?.companyProfile?.website ?? "",
      industry: user?.companyProfile?.industry ?? "",
    },
  });

  const update = useMutation({
    mutationFn: (values: ProfileValues) =>
      api.patch("/users/me", {
        companyName: values.companyName,
        website: values.website || undefined,
        industry: values.industry || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ME_KEY });
      toast.success("Profile updated");
    },
  });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      {user && (
        <ProfileImageUpload
          src={user.profileImage}
          name={
            user.candidateProfile?.fullName ??
            user.companyProfile?.companyName ??
            user.email
          }
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((v) => update.mutate(v))}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input id="companyName" {...register("companyName")} />
              {errors.companyName && (
                <p className="text-sm text-destructive">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://example.com"
                {...register("website")}
              />
              {errors.website && (
                <p className="text-sm text-destructive">
                  {errors.website.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" {...register("industry")} />
            </div>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending && (
                <CircleNotch className="mr-2 size-4 animate-spin" />
              )}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
