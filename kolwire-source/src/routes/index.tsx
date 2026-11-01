import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, Hash, MessageSquareText, Search, Sparkles, Stethoscope, Users } from "lucide-react";
import { useState } from "react";
import { POSTS } from "@/data/posts";
import { KOLS } from "@/data/kols";
import { assetName, companyName, COMPANIES, indicationName, INDICATIONS } from "@/data/entities";
import { countTags, sentimentCounts, sortedPosts } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { Card, DemoLabel, Tag } from "@/components/kol/ui";
import { PostCard } from "@/components/kol/PostCard";
import { HBar, SentimentDonut, SentimentTrend } from "@/components/kol/charts";
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/")({
  head: () => seo("Oncology KOL Intelligence Dashboard", "Discover the expert conversations shaping oncology — structured, searchable KOL intelligence from LinkedIn and X."),
  component: Home,
});

function Home() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const sc = sentimentCounts(POSTS);
  const pct = (n: number) => Math.round((n / POSTS.length) * 100);
  const platform = [
    { name: "LinkedIn", value: POSTS.filter((p) => p.platform === "linkedin").length, fill: "var(--linkedin)" },
    { name: "X", value: POSTS.filter((p) => p.platform === "x").length, fill: "var(--navy)" },
  ];
  const kpis = [
    { icon: Users, label: "KOLs tracked", value: KOLS.length },
    { icon: MessageSquareText, label: "Posts analyzed", value: POSTS.length },
    { icon: Building2, label: "Companies discussed", value: COMPANIES.length },
    { icon: Stethoscope, label: "Indications monitored", value: INDICATIONS.length },
    { icon: Sparkles, label: "Emerging conversations", value: 6 },
  ];
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border bg-card bg-hero px-6 py-14 md:px-12 md:py-20">
        <div className="max-w-3xl fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />KOLwire · Expert Voices. Smarter Intelligence.</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-navy md:text-6xl">Discover the conversations <span className="text-brand">shaping oncology</span></h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">KOLwire transforms scattered expert commentary on LinkedIn and X into structured, searchable competitive intelligence — tagged by indication, asset, company and sentiment.</p>
          <form className="mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border bg-card p-2 shadow-card" onSubmit={(e) => { e.preventDefault(); nav({ to: "/feed", search: { q } }); }} role="search">
            <Search className="ml-2 h-5 w-5 text-muted-foreground" />
            <label htmlFor="hero-q" className="sr-only">Search</label>
            <input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search KOLs, drugs, companies, indications, or topics" className="h-11 flex-1 bg-transparent text-sm outline-none" />
            <button className="h-11 rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground">Search</button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/feed" className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-background hover:opacity-90">Explore KOL Insights <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/analytics" className="inline-flex items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-semibold text-navy hover:bg-secondary">View Intelligence Dashboard</Link>
          </div>
        </div>
      </section>

      <section aria-label="Key metrics">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-navy">At a glance</h2><DemoLabel /></div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {kpis.map((k) => (
            <div key={k.label} className="card-surface p-4"><k.icon className="h-5 w-5 text-teal" /><p className="mt-3 text-3xl font-bold text-navy">{k.value}</p><p className="text-xs text-muted-foreground">{k.label}</p></div>
          ))}
          <div className="card-surface col-span-2 p-4 md:col-span-1">
            <p className="text-xs text-muted-foreground">Sentiment mix</p>
            <div className="mt-2 flex h-2.5 overflow-hidden rounded-full">
              <div className="bg-positive" style={{ width: `${pct(sc.positive)}%` }} /><div className="bg-neutral" style={{ width: `${pct(sc.neutral)}%` }} /><div className="bg-mixed" style={{ width: `${pct(sc.mixed)}%` }} /><div className="bg-negative" style={{ width: `${pct(sc.negative)}%` }} />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-2 text-[11px]"><span className="text-positive">+ {pct(sc.positive)}%</span><span className="text-neutral">○ {pct(sc.neutral)}%</span><span className="text-mixed">± {pct(sc.mixed)}%</span><span className="text-negative">− {pct(sc.negative)}%</span></div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Sentiment trend over time" className="lg:col-span-2"><SentimentTrend posts={POSTS} /></Card>
        <Card title="Overall sentiment"><SentimentDonut posts={POSTS} /></Card>
        <Card title="Most discussed assets"><HBar data={countTags(POSTS, "assetTags").slice(0, 6).map((x) => ({ name: assetName(x.key), value: x.count }))} /></Card>
        <Card title="Top companies by KOL attention"><HBar color="var(--teal)" data={countTags(POSTS, "companyTags").slice(0, 6).map((x) => ({ name: companyName(x.key), value: x.count }))} /></Card>
        <Card title="Indications generating discussion"><HBar color="var(--chart-3)" data={countTags(POSTS, "indicationTags").map((x) => ({ name: indicationName(x.key), value: x.count }))} /></Card>
        <Card title="LinkedIn vs. X distribution">
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={platform} dataKey="value" nameKey="name" outerRadius="80%" stroke="none">{platform.map((p) => <Cell key={p.name} fill={p.fill} />)}</Pie><Tooltip /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} /></PieChart></ResponsiveContainer>
        </Card>
        <Card title="Trending hashtags & topics" className="lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {countTags(POSTS, "hashtags").slice(0, 16).map((h) => (
              <Link key={h.key} to="/feed" search={{ q: h.key }} className="inline-flex items-center gap-1.5 rounded-full border bg-surface px-3 py-1.5 text-sm hover:border-primary hover:text-primary"><Hash className="h-3 w-3" />{h.key.slice(1)}<span className="text-xs text-muted-foreground">{h.count}</span></Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">{countTags(POSTS, "topic").slice(0, 8).map((t) => <Tag key={t.key} kind="plain" label={`${t.key} · ${t.count}`} />)}</div>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between"><div><h2 className="text-2xl font-bold text-navy">Latest KOL insights</h2><p className="text-sm text-muted-foreground">Illustrative demo content — not actual KOL statements.</p></div><Link to="/feed" className="text-sm font-semibold text-primary hover:underline">Open full feed →</Link></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{sortedPosts().slice(0, 9).map((p) => <PostCard key={p.id} post={p} />)}</div>
      </section>
    </div>
  );
}
