import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal, TrendingUp, X as XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { POSTS } from "@/data/posts";
import { getKol } from "@/data/kols";
import { ASSETS, assetName, COMPANIES, companyName, CONFERENCES, INDICATIONS, indicationName, SPECIALTIES } from "@/data/entities";
import type { Post } from "@/data/types";
import { countTags, SENTIMENT_LABEL, SENTIMENTS, topKols } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { PostCard } from "@/components/kol/PostCard";
import { Avatar, Card, Empty, PageHeader } from "@/components/kol/ui";

type FeedSearch = { q?: string | undefined; platform?: string | undefined; indication?: string | undefined; company?: string | undefined; asset?: string | undefined; sentiment?: string | undefined; specialty?: string | undefined; conference?: string | undefined; type?: string | undefined; from?: string | undefined; to?: string | undefined; sort?: string | undefined; page?: number | undefined };

export const Route = createFileRoute("/feed")({
  validateSearch: (s: Record<string, unknown>): FeedSearch => {
    const out: FeedSearch = {};
    for (const k of ["q", "platform", "indication", "company", "asset", "sentiment", "specialty", "conference", "type", "from", "to", "sort"] as const) if (typeof s[k] === "string" && s[k]) out[k] = s[k] as string;
    if (s["page"]) out.page = Number(s["page"]) || 1;
    return out;
  },
  head: () => seo("KOL Intelligence Feed", "Search and filter illustrative oncology KOL commentary by platform, indication, company, asset, sentiment and conference."),
  component: Feed,
});

const PAGE = 8;
const POST_TYPES = ["Clinical data", "Regulatory", "Safety", "Competitive landscape", "Expert opinion"];

function matches(p: Post, q: string) {
  const k = getKol(p.kolId)!;
  const hay = [p.title, p.fullContent, p.topic, k.name, k.institution, k.specialty, ...p.hashtags, ...p.indicationTags.map(indicationName), ...p.assetTags.map(assetName), ...p.companyTags.map(companyName), ...p.conferenceTags, ...p.modalityTags].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w.replace(/^#/, "")) || hay.includes(w));
}

function Feed() {
  const s = Route.useSearch();
  const nav = useNavigate({ from: "/feed" });
  const [showFilters, setShowFilters] = useState(false);
  const set = (patch: Partial<FeedSearch>) => nav({ search: (prev) => ({ ...prev, ...patch, page: undefined }), replace: true });

  const results = useMemo(() => {
    let r = POSTS.filter((p) => {
      const k = getKol(p.kolId)!;
      return (!s.q || matches(p, s.q)) && (!s.platform || p.platform === s.platform) && (!s.indication || p.indicationTags.includes(s.indication))
        && (!s.company || p.companyTags.includes(s.company)) && (!s.asset || p.assetTags.includes(s.asset)) && (!s.sentiment || p.sentiment === s.sentiment)
        && (!s.specialty || k.specialty === s.specialty) && (!s.conference || p.conferenceTags.includes(s.conference)) && (!s.type || p.postType === s.type)
        && (!s.from || p.publishedAt >= s.from) && (!s.to || p.publishedAt <= s.to);
    });
    const eng = (p: Post) => (p.engagement ? p.engagement.likes + p.engagement.reposts * 2 + p.engagement.comments * 2 : 0);
    if (s.sort === "engagement") r = r.sort((a, b) => eng(b) - eng(a));
    else if (s.sort === "relevant" && s.q) r = r.sort((a, b) => b.title.toLowerCase().includes(s.q!.toLowerCase()) ? 1 : 0 - (a.title.toLowerCase().includes(s.q!.toLowerCase()) ? 1 : 0) || b.sentimentConfidence - a.sentimentConfidence);
    else r = r.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return r;
  }, [s]);

  const page = s.page ?? 1;
  const pages = Math.max(1, Math.ceil(results.length / PAGE));
  const shown = results.slice((page - 1) * PAGE, page * PAGE);
  const active = Object.entries(s).filter(([k, v]) => v && !["sort", "page"].includes(k));

  const Select = ({ label, k, opts }: { label: string; k: keyof FeedSearch; opts: { v: string; l: string }[] }) => (
    <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      <select value={(s[k] as string) ?? ""} onChange={(e) => set({ [k]: e.target.value || undefined })} className="h-9 w-full rounded-lg border bg-card px-2 text-sm">
        <option value="">All</option>{opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select></label>
  );

  return (
    <div>
      <PageHeader eyebrow="Intelligence feed" title="KOL Intelligence Feed" desc="Every expert post, structured and searchable. All items are illustrative demo content." />
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border bg-card px-3 shadow-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <label htmlFor="feed-q" className="sr-only">Search feed</label>
          <input id="feed-q" value={s.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Search KOLs, drugs, companies, indications, topics…" className="h-11 flex-1 bg-transparent text-sm outline-none" />
        </div>
        <label className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Sort</span>
          <select value={s.sort ?? "newest"} onChange={(e) => set({ sort: e.target.value })} className="h-11 rounded-xl border bg-card px-3 text-sm"><option value="newest">Newest</option><option value="relevant">Most relevant</option><option value="engagement">Highest engagement (illustrative)</option></select>
        </label>
        <button onClick={() => setShowFilters(!showFilters)} className="inline-flex h-11 items-center gap-2 rounded-xl border bg-card px-4 text-sm lg:hidden" aria-expanded={showFilters}><SlidersHorizontal className="h-4 w-4" />Filters</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr_260px]">
        <aside className={`${showFilters ? "block" : "hidden"} space-y-4 lg:block`} aria-label="Filters">
          <div className="card-surface space-y-3 p-4">
            <div><span className="mb-1 block text-xs font-semibold text-muted-foreground">Platform</span>
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">{[["", "All"], ["linkedin", "LinkedIn"], ["x", "X"]].map(([v, l]) => <button key={v} onClick={() => set({ platform: v || undefined })} className={`rounded-md py-1 text-xs font-medium ${(s.platform ?? "") === v ? "bg-card shadow-card text-navy" : "text-muted-foreground"}`}>{l}</button>)}</div></div>
            <Select label="Indication" k="indication" opts={INDICATIONS.map((i) => ({ v: i.slug, l: i.name }))} />
            <Select label="Company" k="company" opts={COMPANIES.map((i) => ({ v: i.slug, l: i.name }))} />
            <Select label="Drug / asset" k="asset" opts={ASSETS.map((i) => ({ v: i.slug, l: i.name }))} />
            <Select label="Sentiment" k="sentiment" opts={SENTIMENTS.map((x) => ({ v: x, l: SENTIMENT_LABEL[x] }))} />
            <Select label="KOL specialty" k="specialty" opts={SPECIALTIES.map((x) => ({ v: x, l: x }))} />
            <Select label="Conference" k="conference" opts={CONFERENCES.map((x) => ({ v: x, l: x }))} />
            <Select label="Post type" k="type" opts={POST_TYPES.map((x) => ({ v: x, l: x }))} />
            <div className="grid grid-cols-2 gap-2">
              <label><span className="mb-1 block text-xs font-semibold text-muted-foreground">From</span><input type="date" value={s.from ?? ""} onChange={(e) => set({ from: e.target.value || undefined })} className="h-9 w-full rounded-lg border bg-card px-1 text-xs" /></label>
              <label><span className="mb-1 block text-xs font-semibold text-muted-foreground">To</span><input type="date" value={s.to ?? ""} onChange={(e) => set({ to: e.target.value || undefined })} className="h-9 w-full rounded-lg border bg-card px-1 text-xs" /></label>
            </div>
            <button onClick={() => nav({ search: {} })} className="w-full rounded-lg border py-2 text-xs font-semibold hover:bg-secondary">Reset all filters</button>
          </div>
        </aside>
        <section aria-live="polite">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span><b className="text-navy">{results.length}</b> results</span>
            {active.map(([k, v]) => <button key={k} onClick={() => set({ [k]: undefined })} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{k}: {String(v)}<XIcon className="h-3 w-3" /></button>)}
          </div>
          {shown.length === 0 ? <Empty title="No posts match these filters" desc="Try removing a filter or broadening your search." /> : <div className="grid gap-4 md:grid-cols-2">{shown.map((p) => <PostCard key={p.id} post={p} />)}</div>}
          {pages > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-1" aria-label="Pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <button key={n} onClick={() => nav({ search: (prev) => ({ ...prev, page: n }) })} aria-current={n === page} className={`h-9 w-9 rounded-lg text-sm font-medium ${n === page ? "bg-navy text-background" : "border bg-card hover:bg-secondary"}`}>{n}</button>)}
            </nav>
          )}
        </section>
        <aside className="space-y-4" aria-label="Trends">
          <Card title="Trending oncology topics"><ul className="space-y-2 text-sm">{countTags(POSTS, "topic").slice(0, 6).map((t) => <li key={t.key}><button onClick={() => set({ q: t.key })} className="flex w-full justify-between text-left hover:text-primary"><span>{t.key}</span><span className="text-muted-foreground">{t.count}</span></button></li>)}</ul></Card>
          <Card title="Most active KOLs"><ul className="space-y-3">{topKols(POSTS, 5).map(({ kol, count }) => <li key={kol.id}><Link to="/kols/$id" params={{ id: kol.id }} className="flex items-center gap-2 hover:text-primary"><Avatar kol={kol} size={28} /><span className="flex-1 truncate text-sm">{kol.name}</span><span className="text-xs text-muted-foreground">{count}</span></Link></li>)}</ul></Card>
          <Card title="Most discussed assets"><ul className="space-y-2 text-sm">{countTags(POSTS, "assetTags").slice(0, 5).map((a) => <li key={a.key}><Link to="/assets/$slug" params={{ slug: a.key }} className="flex justify-between hover:text-primary"><span>{assetName(a.key)}</span><span className="text-muted-foreground">{a.count}</span></Link></li>)}</ul></Card>
          <Card title="Emerging CI signals"><ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2"><TrendingUp className="h-4 w-4 shrink-0 text-teal" />TROP2 ADC crowding debate rising across breast & NSCLC</li>
            <li className="flex gap-2"><TrendingUp className="h-4 w-4 shrink-0 text-mixed" />Pancreatic KRAS sentiment shifting from positive to cautious</li>
            <li className="flex gap-2"><TrendingUp className="h-4 w-4 shrink-0 text-electric" />ESMO ovarian ADC buzz concentrated on FRα eligibility</li>
          </ul><p className="mt-3 text-[10px] text-muted-foreground">Derived from illustrative dataset.</p></Card>
        </aside>
      </div>
    </div>
  );
}
