import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { POSTS } from "@/data/posts";
import { getKol } from "@/data/kols";
import { fmtDate, related } from "@/lib/intel";
import { useNotes } from "@/lib/hooks";
import { seo } from "@/lib/seo";
import { NotFoundBlock } from "@/components/kol/EntityView";
import { Avatar, Card, DemoLabel, PlatformIcon, SentimentBadge, Tag } from "@/components/kol/ui";
import { PostCard } from "@/components/kol/PostCard";
import type { Post } from "@/data/types";

export const Route = createFileRoute("/posts/$slug")({
  loader: ({ params }) => {
    const p = POSTS.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => seo(loaderData?.title ?? "Post analysis", loaderData?.excerpt ?? "KOL post analysis"),
  component: Page,
  notFoundComponent: () => <NotFoundBlock what="Post" />,
  errorComponent: () => <NotFoundBlock what="Post" />,
});

function Section({ title, posts }: { title: string; posts: Post[] }) {
  if (!posts.length) return null;
  return <div className="mb-8"><h2 className="mb-3 text-lg font-semibold text-navy">{title}</h2><div className="grid gap-4 md:grid-cols-3">{posts.map((p) => <PostCard key={p.id} post={p} compact />)}</div></div>;
}

function Page() {
  const p = Route.useLoaderData();
  const k = getKol(p.kolId)!;
  const r = related(p);
  const { notes, add, remove } = useNotes(p.id);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  return (
    <div>
      <Link to="/feed" className="text-sm text-primary hover:underline">← Back to feed</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <article className="card-surface p-6">
            <div className="flex items-center gap-3">
              <Link to="/kols/$id" params={{ id: k.id }}><Avatar kol={k} size={48} /></Link>
              <div className="flex-1"><Link to="/kols/$id" params={{ id: k.id }} className="font-semibold text-navy hover:text-primary">{k.name}</Link><p className="text-xs text-muted-foreground">{k.title} · {k.institution}</p></div>
              <PlatformIcon p={p.platform} className="h-5 w-5" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-navy">{p.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><time>{fmtDate(p.publishedAt)}</time>·<span>{p.postType}</span>{p.phase && <>·<span>{p.phase}</span></>}<DemoLabel /></div>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">Expert's words (simulated)</p>
            <blockquote className="mt-2 whitespace-pre-line border-l-4 border-teal pl-4 text-foreground">{p.fullContent}</blockquote>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.indicationTags.map((t) => <Tag key={t} kind="indication" slug={t} />)}
              {p.assetTags.map((t) => <Tag key={t} kind="asset" slug={t} />)}
              {p.companyTags.map((t) => <Tag key={t} kind="company" slug={t} />)}
              {p.hashtags.map((h) => <Tag key={h} kind="hashtag" label={h} />)}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{p.originalPostUrl ? <a href={p.originalPostUrl} target="_blank" rel="noreferrer" className="text-primary underline">View original post</a> : "No original post link — this is illustrative demo content."}</p>
          </article>
          <Card title="Analyst interpretation">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">AI / analyst-generated — not the expert's statement</p>
            <p className="mt-2 text-sm">{p.analystSummary}</p>
            <h3 className="mt-4 text-sm font-semibold text-navy">Key takeaways</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{p.keyTakeaways.map((t) => <li key={t}>{t}</li>)}</ul>
            <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
              <div><h4 className="font-semibold text-navy">Clinical</h4><p className="text-muted-foreground">{p.clinicalImplications}</p></div>
              <div><h4 className="font-semibold text-navy">Competitive</h4><p className="text-muted-foreground">{p.competitiveImplications}</p></div>
              <div><h4 className="font-semibold text-navy">Commercial</h4><p className="text-muted-foreground">{p.commercialRelevance}</p></div>
            </div>
          </Card>
        </div>
        <aside className="space-y-6">
          <Card title="Sentiment">
            <SentimentBadge s={p.sentiment} size="lg" />
            <p className="mt-3 text-sm">{p.sentimentRationale}</p>
            <p className="mt-2 text-xs text-muted-foreground">Confidence {Math.round(p.sentimentConfidence * 100)}% · {p.sentimentReviewed ? "Analyst reviewed" : "Not yet reviewed"}</p>
          </Card>
          <Card title="Topic timeline">
            <ol className="space-y-3 border-l pl-4">{r.timeline.map((t) => (
              <li key={t.id} className="text-sm"><p className="text-xs text-muted-foreground">{fmtDate(t.publishedAt)}</p>{t.id === p.id ? <span className="font-semibold text-navy">{t.title}</span> : <Link to="/posts/$slug" params={{ slug: t.slug }} className="hover:text-primary">{t.title}</Link>}</li>
            ))}</ol>
          </Card>
          <Card title="Analyst notes">
            <p className="mb-2 text-xs text-muted-foreground">Saved in this browser only.</p>
            <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { add(text.trim(), author.trim()); setText(""); } }} className="space-y-2">
              <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name" aria-label="Your name" className="w-full rounded-lg border bg-card px-3 py-2 text-sm" />
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a note…" aria-label="Note" rows={3} className="w-full rounded-lg border bg-card px-3 py-2 text-sm" />
              <button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Save note</button>
            </form>
            <ul className="mt-3 space-y-2">{notes.map((n) => (
              <li key={n.id} className="rounded-lg bg-surface p-2 text-sm"><p>{n.text}</p><p className="mt-1 flex justify-between text-xs text-muted-foreground"><span>{n.author} · {fmtDate(n.createdAt)}</span><button onClick={() => remove(n.id)} className="hover:text-negative">Delete</button></p></li>
            ))}</ul>
          </Card>
        </aside>
      </div>
      <div className="mt-10">
        <Section title="Same drug, other experts" posts={r.sameDrug} />
        <Section title="Same indication" posts={r.sameIndication} />
        <Section title="Contrasting views" posts={r.contrasting} />
        <Section title="Same company" posts={r.sameCompany} />
      </div>
    </div>
  );
}
