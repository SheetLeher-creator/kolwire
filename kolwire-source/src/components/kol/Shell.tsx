import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTheme } from "@/lib/hooks";
import { Logo } from "./ui";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/feed", label: "Feed" },
  { to: "/kols", label: "KOLs" },
  { to: "/indications", label: "Indications" },
  { to: "/companies", label: "Companies & Assets" },
  { to: "/analytics", label: "Analytics" },
  { to: "/compare", label: "Compare" },
  { to: "/explorer", label: "Explorer" },
  { to: "/snapshot", label: "Exec Snapshot" },
  { to: "/about", label: "About" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-card focus:p-2">Skip to content</a>
      <div className="bg-navy px-4 py-1.5 text-center text-[11px] font-medium text-background">
        Demonstration build · All KOLs, posts and analytics are fictional, illustrative sample data — not actual KOL statements or market intelligence.
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label="KOLwire home">
            <Logo />
            <div className="leading-tight"><span className="text-lg font-bold tracking-tight text-navy">KOL<span className="text-brand">wire</span></span><span className="hidden text-[10px] text-muted-foreground sm:block">Expert Voices. Smarter Intelligence.</span></div>
          </Link>
          <nav className="hidden flex-1 items-center gap-1 xl:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-navy" activeProps={{ className: "bg-secondary !text-navy font-semibold" }}>{n.label}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggle} className="rounded-lg border p-2 hover:bg-secondary" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
            <button onClick={() => setOpen(!open)} className="rounded-lg border p-2 xl:hidden" aria-label="Toggle menu" aria-expanded={open}>{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
          </div>
        </div>
        {open && (
          <nav className="grid grid-cols-2 gap-1 border-t px-4 py-3 xl:hidden" aria-label="Mobile">
            {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-secondary" activeOptions={{ exact: n.to === "/" }} activeProps={{ className: "bg-secondary font-semibold" }}>{n.label}</Link>)}
          </nav>
        )}
      </header>
      <main id="main" className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="mt-16 border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2"><Logo className="h-6 w-6" /><span className="font-semibold text-navy">KOLwire</span> · Expert Voices. Smarter Intelligence.</div>
          <p className="max-w-xl text-xs">Internal innovation demo. Company and drug names are used as educational examples only; all commentary is simulated and any clinical framing is hypothetical.</p>
        </div>
      </footer>
    </div>
  );
}
