"use client";

import {
  Bell,
  CaretDown,
  List,
  Moon,
  SignOut,
  Sun,
  UserCircle,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLogout } from "@/hooks/use-logout";
import type { NavItem } from "@/lib/nav-config";
import { ROLE_LABEL } from "@/lib/nav-config";
import type { User } from "@/types/api";
import { Sidebar } from "./sidebar";

interface TopbarProps {
  user: User;
  navItems: NavItem[];
}

export function Topbar({ user, navItems }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const logout = useLogout();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const displayName =
    user.candidateProfile?.fullName ??
    user.companyProfile?.companyName ??
    user.email;

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
            />
          }
        >
          <List className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar
            items={navItems}
            brand={ROLE_LABEL[user.role]}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" className="gap-2 px-2" />}
          >
            <span className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={displayName}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              ) : (
                <UserCircle className="size-4 text-muted-foreground" />
              )}
            </span>
            <span className="hidden text-sm font-medium sm:inline">
              {displayName}
            </span>
            <CaretDown className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="truncate px-2 py-1.5 text-sm text-muted-foreground">
              {user.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout.mutate()}>
              <SignOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
