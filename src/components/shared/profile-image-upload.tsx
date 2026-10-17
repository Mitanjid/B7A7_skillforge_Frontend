"use client";

import { Camera, CircleNotch, UserCircle } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ME_KEY } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export function ProfileImageUpload({
  src,
  name,
}: {
  src: string | null;
  name: string;
}) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const upload = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("profileImage", file);
      return api.post("/users/me/profile-image", form);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ME_KEY });
      toast.success("Profile photo updated");
    },
    onSettled: () => setPreview(null),
  });

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      toast.error("Use a JPG, PNG or WebP image");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be 5MB or smaller");
      return;
    }
    setPreview(URL.createObjectURL(file));
    upload.mutate(file);
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-20">
        <AvatarImage src={preview ?? src ?? undefined} alt={name} />
        <AvatarFallback>
          <UserCircle className="size-10 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(",")}
          className="hidden"
          onChange={onFile}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={upload.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {upload.isPending ? (
            <CircleNotch className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" />
          )}
          {upload.isPending ? "Uploading…" : "Change photo"}
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, PNG or WebP, up to 5MB.
        </p>
      </div>
    </div>
  );
}
