import { createFileRoute } from "@tanstack/react-router";
import { POSTS } from "@/data/posts";
import { ASSETS, assetName, COMPANIES, companyName, INDICATIONS } from "@/data/entities";
import { countTags, postsFor, sentimentCounts } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { Card, DemoLabel, PageHeader } from "@/components/kol/ui";
import { HBar, SentimentDonut, SentimentTrend, StackedSentimentBar } from "@/components/kol/charts";

export const Route = createFileRoute("/analytics")({
  head: () => seo("Analytics", "Sentiment trends, share of voice and topic analytics across illustrative oncology KOL commentary."),
  component: Page,
});

function Page() {
  const byInd = INDICATIONS.map((i) => ({ name: i.name, ...sentimentCounts(postsFor("indicationTags", i.slug)) }));
  const byCo = COMPANIES.map((c) => ({ name: c.name, ...sentimentCounts(postsFor("companyTags", c.slug)) }));
  return (
    <div>
      <PageHeader eyebrow="Insights" title="Analytics" desc="Aggregate view of expert sentiment and share of voice."><DemoLabel /></PageHeader>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Overall sentiment"><SentimentDonut posts={POSTS} /></Card>
        <Card title="Monthly sentiment trend" className="lg:col-span-2"><SentimentTrend posts={POSTS} /></Card>
        <Card title="Sentiment by indication" className="lg:col-span-3"><StackedSentimentBar data={byInd} /></Card>
        <Card title="Sentiment by company" className="lg:col-span-3"><StackedSentimentBar data={byCo} /></Card>
        <Card title="Asset share of voice"><HBar data={ASSETS.map((a) => ({ name: assetName(a.slug), value: postsFor("assetTags", a.slug).length })).sort((a, b) => b.value - a.value)} height={280} /></Card>
        <Card title="Company share of voice"><HBar data={countTags(POSTS, "companyTags").map((x) => ({ name: companyName(x.key), value: x.count }))} height={280} color="var(--teal)" /></Card>
        <Card title="Top topics"><HBar data={countTags(POSTS, "topic").slice(0, 8).map((x) => ({ name: x.key, value: x.count }))} height={280} /></Card>
      </div>
    </div>
  );
}
