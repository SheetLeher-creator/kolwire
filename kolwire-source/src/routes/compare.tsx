import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ASSETS } from "@/data/entities";
import { netScore, postsFor, sentimentCounts } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { Card, DemoLabel, PageHeader } from "@/components/kol/ui";
import { SentimentDonut } from "@/components/kol/charts";
import { PostCard } from "@/components/kol/PostCard";

export const Route = createFileRoute("/compare")({
  head: () => seo("Compare Assets", "Side-by-side comparison of KOL sentiment and commentary for two oncology assets."),
  component: Page,
});

function Col({ slug }: { slug: string }) {
  const a = ASSETS.find((x) => x.slug === slug)!;
  const ps = postsFor("assetTags", slug);
  const c = sentimentCounts(ps);
  return (
    <div className="space-y-4">
      <Card title={a.name}>
        <p className="text-xs text-muted-foreground">{a.modality} · {a.target}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div><p className="text-2xl font-bold text-navy">{ps.length}</p><p className="text-xs text-muted-foreground">Posts</p></div>
          <div><p className="text-2xl font-bold text-navy">{new Set(ps.map((p) => p.kolId)).size}</p><p className="text-xs text-muted-foreground">KOLs</p></div>
          <div><p className="text-2xl font-bold text-navy">{netScore(ps)}</p><p className="text-xs text-muted-foreground">Net score</p></div>
        </div>
        <SentimentDonut posts={ps} height={200} />
        <p className="text-xs text-muted-foreground">+{c.positive} / ~{c.mixed} / ={c.neutral} / −{c.negative}</p>
      </Card>
      {ps.slice(0, 3).map((p) => <PostCard key={p.id} post={p} compact />)}
    </div>
  );
}

function Page() {
  const [a, setA] = useState(ASSETS[0]!.slug);
  const [b, setB] = useState(ASSETS[2]!.slug);
  const sel = (v: string, f: (s: string) => void, label: string) => (
    <select value={v} onChange={(e) => f(e.target.value)} aria-label={label} className="rounded-lg border bg-card px-3 py-2 text-sm">{ASSETS.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}</select>
  );
  return (
    <div>
      <PageHeader eyebrow="Head to head" title="Compare assets" desc="Pick two assets to compare expert sentiment."><DemoLabel /></PageHeader>
      <div className="mb-6 flex flex-wrap items-center gap-3">{sel(a, setA, "First asset")}<span className="text-muted-foreground">vs</span>{sel(b, setB, "Second asset")}</div>
      <div className="grid gap-6 md:grid-cols-2"><Col slug={a} /><Col slug={b} /></div>
    </div>
  );
}
