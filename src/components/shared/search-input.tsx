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
  const searchParam = params.get("search") ?? "";

  const [value, setValue] = useState(searchParam);

  // Keep the box in sync when the URL changes (back/forward, clear filters)
  useEffect(() => {
    setValue(searchParam);
  }, [searchParam]);

  // Push to the URL only when the typed value really differs from it
  useEffect(() => {
    if (value === searchParam) return;

    const id = setTimeout(() => {
      const sp = new URLSearchParams(window.location.search);

      if (value) sp.set("search", value);
      else sp.delete("search");
      sp.delete("page"); // a new search always starts from page 1

      const query = sp.toString();
      router.push(query ? `?${query}` : "?");
    }, 400);

    return () => clearTimeout(id);
  }, [value, searchParam, router]);

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
