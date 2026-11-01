import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { POSTS } from "@/data/posts";
import { ASSETS, assetName } from "@/data/entities";
import { countTags, netScore, postsFor, sentimentCounts, sortedPosts, topKols } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { Card, DemoLabel, PageHeader, SentimentBadge } from "@/components/kol/ui";

export const Route = createFileRoute("/snapshot")({
  head: () => seo("Executive Snapshot", "One-page executive summary of oncology KOL sentiment, top assets and must-read commentary."),
  component: Page,
});

function Page() {
  const sc = sentimentCounts(POSTS);
  const assets = ASSETS.map((a) => ({ a, ps: postsFor("assetTags", a.slug) })).sort((x, y) => y.ps.length - x.ps.length);
  const mustRead = sortedPosts().filter((p) => p.sentimentConfidence >= 0.8).slice(0, 5);
  return (
    <div>
      <PageHeader eyebrow="Briefing" title="Executive snapshot" desc="A printable one-page summary of the current expert landscape.">
        <div className="flex gap-2"><DemoLabel /><button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-secondary"><Printer className="h-4 w-4" />Print</button></div>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-xs text-muted-foreground">Posts analyzed</p><p className="text-3xl font-bold text-navy">{POSTS.length}</p></Card>
        <Card><p className="text-xs text-muted-foreground">Net sentiment</p><p className="text-3xl font-bold text-navy">{netScore(POSTS)}</p></Card>
        <Card><p className="text-xs text-muted-foreground">Positive / Negative</p><p className="text-3xl font-bold text-navy">{sc.positive} / {sc.negative}</p></Card>
        <Card><p className="text-xs text-muted-foreground">Top hashtag</p><p className="text-2xl font-bold text-navy">{countTags(POSTS, "hashtags")[0]?.key}</p></Card>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card title="Asset scorecard">
          <table className="w-full text-sm"><thead><tr className="text-left text-xs text-muted-foreground"><th className="py-1">Asset</th><th>Posts</th><th>Net</th></tr></thead>
            <tbody>{assets.map(({ a, ps }) => <tr key={a.slug} className="border-t"><td className="py-2"><Link to="/assets/$slug" params={{ slug: a.slug }} className="hover:text-primary">{assetName(a.slug)}</Link></td><td>{ps.length}</td><td className={netScore(ps) >= 0 ? "text-positive" : "text-negative"}>{netScore(ps)}</td></tr>)}</tbody></table>
        </Card>
        <Card title="Most active voices">
          <ul className="space-y-2 text-sm">{topKols(POSTS, 6).map(({ kol, count }) => <li key={kol.id} className="flex justify-between"><Link to="/kols/$id" params={{ id: kol.id }} className="hover:text-primary">{kol.name}</Link><span className="text-muted-foreground">{count} posts</span></li>)}</ul>
        </Card>
        <Card title="Must-read commentary" className="lg:col-span-2">
          <ul className="divide-y">{mustRead.map((p) => <li key={p.id} className="flex items-start justify-between gap-3 py-3"><div><Link to="/posts/$slug" params={{ slug: p.slug }} className="font-medium text-navy hover:text-primary">{p.title}</Link><p className="text-sm text-muted-foreground">{p.keyTakeaways[0]}</p></div><SentimentBadge s={p.sentiment} /></li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
