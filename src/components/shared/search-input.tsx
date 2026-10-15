"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function SearchInput({
  placeholder = "Search...",
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const searchParams = params.toString();

  const [value, setValue] = useState(params.get("search") ?? "");

  useEffect(() => {
    const id = setTimeout(() => {
      const sp = new URLSearchParams(searchParams);

      if (value) {
        sp.set("search", value);
        sp.set("page", "1");
      } else {
        sp.delete("search");
        sp.delete("page");
      }

      const query = sp.toString();
      router.push(query ? `?${query}` : "?");
    }, 400);

    return () => clearTimeout(id);
  }, [value, searchParams, router]);

  useEffect(() => {
    setValue(params.get("search") ?? "");
  }, [params]);

  return (
    <div className="relative w-full max-w-xs">
      <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
