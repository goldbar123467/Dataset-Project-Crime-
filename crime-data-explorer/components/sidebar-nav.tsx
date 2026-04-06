"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Home,
  Skull,
  Briefcase,
  GitBranch,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/crime", label: "Crime & Incarceration", icon: BarChart3 },
  { href: "/murder", label: "Murder Rates", icon: Skull },
  { href: "/unemployment", label: "Unemployment", icon: Briefcase },
  { href: "/correlations", label: "Correlations", icon: GitBranch },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function SidebarNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 lg:hidden">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Crime Data Explorer</h2>
            </div>
            <NavLinks onClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="text-sm font-semibold">Crime Data Explorer</h1>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-sidebar-background">
        <div className="flex h-14 items-center border-b px-6">
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            Crime Data Explorer
          </h2>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <NavLinks />
        </div>
        <div className="border-t p-4">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
