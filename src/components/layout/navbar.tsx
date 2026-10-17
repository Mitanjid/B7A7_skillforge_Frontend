"use client";

import { List, Moon, Sun } from "@phosphor-icons/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/hooks/use-logout";
import { ROLE_HOME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, isLoading } = useAuth();
  const logout = useLogout();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-heading text-lg font-semibold">
          SkillForge
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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

          {user ? (
            <>
              <Link
                href={ROLE_HOME[user.role]}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hidden sm:inline-flex",
                )}
              >
                Dashboard
              </Link>
              <Button
                className="hidden sm:inline-flex"
                disabled={logout.isPending}
                onClick={() => logout.mutate()}
              >
                Log out
              </Button>
            </>
          ) : (
            !isLoading && (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "hidden sm:inline-flex",
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants(), "hidden sm:inline-flex")}
                >
                  Get started
                </Link>
              </>
            )
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <List className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-8 flex flex-col gap-4 px-4">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  {user ? (
                    <>
                      <Link
                        href={ROLE_HOME[user.role]}
                        onClick={() => setOpen(false)}
                        className={buttonVariants({ variant: "outline" })}
                      >
                        Dashboard
                      </Link>
                      <Button
                        disabled={logout.isPending}
                        onClick={() => {
                          setOpen(false);
                          logout.mutate();
                        }}
                      >
                        Log out
                      </Button>
                    </>
                  ) : (
                    !isLoading && (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setOpen(false)}
                          className={buttonVariants({ variant: "outline" })}
                        >
                          Log in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setOpen(false)}
                          className={buttonVariants()}
                        >
                          Get started
                        </Link>
                      </>
                    )
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
