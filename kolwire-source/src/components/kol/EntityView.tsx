import type { Post } from "@/data/types";
import { countTags, netScore, topKols } from "@/lib/intel";
import { assetName, companyName, indicationName } from "@/data/entities";
import { Avatar, Card, DemoLabel, Empty, PageHeader, Tag } from "./ui";
import { HBar, SentimentDonut, SentimentTrend } from "./charts";
import { PostCard } from "./PostCard";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function EntityView({ eyebrow, title, desc, posts, extra }: { eyebrow: string; title: string; desc: string; posts: Post[]; extra?: ReactNode }) {
  const kols = topKols(posts, 6);
  const assets = countTags(posts, "assetTags").slice(0, 6).map((x) => ({ name: assetName(x.key), value: x.count }));
  const inds = countTags(posts, "indicationTags").slice(0, 5);
  const cos = countTags(posts, "companyTags").slice(0, 5);
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} desc={desc}><DemoLabel /></PageHeader>
      {extra}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card><p className="text-xs text-muted-foreground">Posts</p><p className="text-3xl font-bold text-navy">{posts.length}</p></Card>
        <Card><p className="text-xs text-muted-foreground">KOLs discussing</p><p className="text-3xl font-bold text-navy">{new Set(posts.map((p) => p.kolId)).size}</p></Card>
        <Card><p className="text-xs text-muted-foreground">Net sentiment score</p><p className="text-3xl font-bold text-navy">{netScore(posts)}</p></Card>
      </div>
      {posts.length === 0 ? <Empty title="No commentary yet" desc="No demo posts are tagged with this item." /> : (
        <>
          <div className="mb-6 grid gap-4 lg:grid-cols-3">
            <Card title="Sentiment mix"><SentimentDonut posts={posts} /></Card>
            <Card title="Sentiment over time" className="lg:col-span-2"><SentimentTrend posts={posts} /></Card>
          </div>
          <div className="mb-6 grid gap-4 lg:grid-cols-3">
            <Card title="Most active KOLs">
              <ul className="space-y-3">{kols.map(({ kol, count }) => (
                <li key={kol.id}><Link to="/kols/$id" params={{ id: kol.id }} className="flex items-center gap-3 hover:text-primary"><Avatar kol={kol} size={32} /><span className="flex-1 text-sm font-medium">{kol.name}</span><span className="text-xs text-muted-foreground">{count}</span></Link></li>
              ))}</ul>
            </Card>
            <Card title="Assets mentioned"><HBar data={assets} height={200} /></Card>
            <Card title="Related tags">
              <div className="flex flex-wrap gap-1.5">
                {inds.map((x) => <Tag key={x.key} kind="indication" slug={x.key} />)}
                {cos.map((x) => <Tag key={x.key} kind="company" slug={x.key} />)}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{inds.map((x) => indicationName(x.key)).join(", ")} · {cos.map((x) => companyName(x.key)).join(", ")}</p>
            </Card>
          </div>
          <h2 className="mb-4 text-lg font-semibold text-navy">Latest commentary</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <PostCard key={p.id} post={p} compact />)}</div>
        </>
      )}
    </div>
  );
}

export function NotFoundBlock({ what }: { what: string }) {
  return <Empty title={`${what} not found`} desc="It may have been removed from the demo dataset." />;
}
