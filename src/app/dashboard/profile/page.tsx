"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotch } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ProfileImageUpload } from "@/components/shared/profile-image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ME_KEY, useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string(),
  skills: z.string(),
  resumeUrl: z.union([z.url("Enter a valid URL"), z.literal("")]),
});
type ProfileValues = z.infer<typeof schema>;

export default function CandidateProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(schema),
    values: {
      fullName: user?.candidateProfile?.fullName ?? "",
      phone: user?.candidateProfile?.phone ?? "",
      skills: user?.candidateProfile?.skills.join(", ") ?? "",
      resumeUrl: user?.candidateProfile?.resumeUrl ?? "",
    },
  });

  const update = useMutation({
    mutationFn: (values: ProfileValues) =>
      api.patch("/users/me", {
        fullName: values.fullName,
        phone: values.phone || undefined,
        resumeUrl: values.resumeUrl || undefined,
        skills: values.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
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
          <CardTitle className="text-base">Your details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((v) => update.mutate(v))}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Textarea id="skills" rows={3} {...register("skills")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input
                id="resumeUrl"
                placeholder="https://..."
                {...register("resumeUrl")}
              />
              {errors.resumeUrl && (
                <p className="text-sm text-destructive">
                  {errors.resumeUrl.message}
                </p>
              )}
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
