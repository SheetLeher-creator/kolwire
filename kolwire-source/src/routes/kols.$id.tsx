import { createFileRoute, notFound } from "@tanstack/react-router";
import { getKol } from "@/data/kols";
import { countTags, postsByKol } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { NotFoundBlock } from "@/components/kol/EntityView";
import { Avatar, Card, DemoLabel, Tag } from "@/components/kol/ui";
import { SentimentDonut } from "@/components/kol/charts";
import { PostCard } from "@/components/kol/PostCard";

export const Route = createFileRoute("/kols/$id")({
  loader: ({ params }) => {
    const k = getKol(params.id);
    if (!k) throw notFound();
    return k;
  },
  head: ({ loaderData }) => seo(loaderData ? `${loaderData.name} — KOL profile` : "KOL profile", loaderData?.bio ?? "KOL profile"),
  component: Page,
  notFoundComponent: () => <NotFoundBlock what="KOL" />,
  errorComponent: () => <NotFoundBlock what="KOL" />,
});

function Page() {
  const k = Route.useLoaderData();
  const posts = postsByKol(k.id);
  return (
    <div>
      <div className="card-surface mb-6 flex flex-col gap-5 p-6 md:flex-row md:items-center">
        <Avatar kol={k} size={88} />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-navy">{k.name}</h1>
          <p className="text-muted-foreground">{k.title} · {k.institution}</p>
          <p className="mt-2 max-w-2xl text-sm">{k.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="rounded-md bg-accent px-2 py-0.5 text-accent-foreground">{k.specialty}</span><span className="rounded-md bg-muted px-2 py-0.5">{k.region}</span><DemoLabel /></div>
          <p className="mt-2 text-xs text-muted-foreground">Social profile links are shown only for verified real experts.</p>
        </div>
      </div>
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card title="Sentiment of commentary"><SentimentDonut posts={posts} /></Card>
        <Card title="Frequently discussed" className="lg:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {countTags(posts, "indicationTags").map((x) => <Tag key={x.key} kind="indication" slug={x.key} />)}
            {countTags(posts, "assetTags").map((x) => <Tag key={x.key} kind="asset" slug={x.key} />)}
            {countTags(posts, "companyTags").map((x) => <Tag key={x.key} kind="company" slug={x.key} />)}
          </div>
        </Card>
      </div>
      <h2 className="mb-4 text-lg font-semibold text-navy">Posts ({posts.length})</h2>
      <div className="grid gap-4 md:grid-cols-2">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
    </div>
  );
}
