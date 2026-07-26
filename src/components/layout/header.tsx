"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Gem, Menu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SearchBar } from "@/components/layout/search-bar";
import { WHATSAPP_CHAT_URL, SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/products", label: "Products" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Gem className="size-6 text-primary" />
          <span className="font-heading text-lg font-semibold text-gradient-gold">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 max-w-sm md:block">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            size="icon"
            className="bg-luxury-gradient hidden text-white hover:opacity-90 sm:inline-flex"
            render={<a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" />}
            nativeButton={false}
          >
            <MessageCircle />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              size="icon"
              variant="outline"
              className="md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </Button>
            <SheetContent side="right" className="p-0">
              <SheetHeader className="border-b border-border/60">
                <SheetTitle className="text-gradient-gold">{SITE_NAME}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-4">
                <Suspense fallback={null}>
                  <SearchBar />
                </Suspense>
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <Button
                  className="bg-luxury-gradient text-white hover:opacity-90"
                  render={<a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" />}
                  nativeButton={false}
                >
                  <MessageCircle />
                  Chat on WhatsApp
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
