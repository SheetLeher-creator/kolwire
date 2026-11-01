import { Link } from "@tanstack/react-router";
import { Info, Linkedin, Twitter } from "lucide-react";
import type { ReactNode } from "react";
import type { Kol, Platform, Sentiment } from "@/data/types";
import { SENTIMENT_LABEL } from "@/lib/intel";
import { cn } from "@/lib/utils";
import { assetName, companyName, indicationName } from "@/data/entities";

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden>
      <defs><linearGradient id="kw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--electric)" /><stop offset="1" stopColor="var(--teal)" /></linearGradient></defs>
      <rect width="32" height="32" rx="9" fill="url(#kw)" />
      <path d="M9 22c2.5-3 4-8 7-8s4.5 5 7 8" stroke="var(--primary-foreground)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="9" cy="22" r="2.2" fill="var(--primary-foreground)" /><circle cx="16" cy="14" r="2.2" fill="var(--primary-foreground)" /><circle cx="23" cy="22" r="2.2" fill="var(--primary-foreground)" />
      <path d="M20 8.5a5 5 0 0 1 3.5 3.5M21 5.5a8 8 0 0 1 5.5 5.5" stroke="var(--primary-foreground)" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".85" />
    </svg>
  );
}

const S_CLS: Record<Sentiment, string> = {
  positive: "bg-positive/12 text-positive border-positive/30",
  neutral: "bg-neutral/12 text-neutral border-neutral/30",
  negative: "bg-negative/12 text-negative border-negative/30",
  mixed: "bg-mixed/15 text-mixed border-mixed/40",
};
export function SentimentBadge({ s, size = "sm" }: { s: Sentiment; size?: "sm" | "lg" }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border font-semibold", S_CLS[s], size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs")}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />{SENTIMENT_LABEL[s]}
    </span>
  );
}

export function PlatformIcon({ p, className }: { p: Platform; className?: string }) {
  return p === "linkedin"
    ? <Linkedin className={cn("h-4 w-4 text-linkedin", className)} aria-label="LinkedIn" />
    : <Twitter className={cn("h-4 w-4 text-foreground", className)} aria-label="X (formerly Twitter)" />;
}

export function Avatar({ kol, size = 40 }: { kol: Kol; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-primary-foreground ring-2 ring-card"
      style={{ width: size, height: size, fontSize: size * 0.36, background: `linear-gradient(135deg, oklch(0.55 0.15 ${kol.hue}), oklch(0.7 0.12 ${kol.hue + 40}))` }}
      aria-label={`Avatar for ${kol.name}`}
    >{kol.initials}</div>
  );
}

type TagKind = "indication" | "asset" | "company" | "hashtag" | "plain";
export function Tag({ kind, slug, label }: { kind: TagKind; slug?: string; label?: string }) {
  const base = "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors";
  if (kind === "indication" && slug) return <Link to="/indications/$slug" params={{ slug }} className={cn(base, "bg-accent text-accent-foreground hover:bg-teal/20")}>{indicationName(slug)}</Link>;
  if (kind === "asset" && slug) return <Link to="/assets/$slug" params={{ slug }} className={cn(base, "bg-primary/10 text-primary hover:bg-primary/20")}>{assetName(slug)}</Link>;
  if (kind === "company" && slug) return <Link to="/companies/$slug" params={{ slug }} className={cn(base, "bg-secondary text-secondary-foreground border hover:bg-muted")}>{companyName(slug)}</Link>;
  if (kind === "hashtag") return <Link to="/feed" search={{ q: label }} className={cn(base, "text-muted-foreground hover:text-primary")}>{label}</Link>;
  return <span className={cn(base, "bg-muted text-muted-foreground")}>{label}</span>;
}

export function DemoLabel({ className }: { className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border border-mixed/40 bg-mixed/10 px-2 py-0.5 text-[11px] font-medium text-mixed", className)}><Info className="h-3 w-3" />Illustrative demo</span>;
}

export function PageHeader({ eyebrow, title, desc, children }: { eyebrow?: string; title: string; desc?: string; children?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal">{eyebrow}</p>}
        <h1 className="text-3xl font-bold text-navy md:text-4xl">{title}</h1>
        {desc && <p className="mt-2 max-w-2xl text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </header>
  );
}

export function Card({ children, className, title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={cn("card-surface p-5", className)}>
      {title && <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold text-navy">{title}</h2>{action}</div>}
      {children}
    </section>
  );
}

export function Empty({ title, desc }: { title: string; desc?: string }) {
  return <div className="rounded-xl border border-dashed p-10 text-center"><p className="font-semibold text-navy">{title}</p>{desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}</div>;
}

export function Bar({ value, max, color = "var(--electric)" }: { value: number; max: number; color?: string }) {
  return <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${(value / Math.max(1, max)) * 100}%`, background: color }} /></div>;
}
