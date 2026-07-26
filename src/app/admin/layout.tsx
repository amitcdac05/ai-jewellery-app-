import Link from "next/link";
import { Gem, LayoutDashboard, FolderTree, Package, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="bg-luxury-gradient hidden w-64 flex-col p-6 text-white md:flex">
        <Link href="/admin/dashboard" className="mb-10 flex items-center gap-2">
          <Gem className="size-7" />
          <span className="text-lg font-semibold">AI Jewellery</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
          >
            <LogOut className="size-4" />
            Log Out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
