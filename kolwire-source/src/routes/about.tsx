import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { Card, PageHeader } from "@/components/kol/ui";

export const Route = createFileRoute("/about")({
  head: () => seo("About KOLwire", "What KOLwire is, how its demo data works, and the compliance principles behind it."),
  component: Page,
});

function Page() {
  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="About" title="About KOLwire" desc="Expert Voices. Smarter Intelligence." />
      <div className="space-y-4">
        <Card title="What it is"><p className="text-sm">KOLwire organizes public commentary from oncology key opinion leaders on LinkedIn and X into searchable, tagged, sentiment-scored intelligence for medical affairs, competitive intelligence and commercial teams.</p></Card>
        <Card title="Demo data"><p className="text-sm">Every KOL, post and metric in this build is fictional and illustrative. Company and drug names are used as educational examples only and do not reflect actual statements or market intelligence.</p></Card>
        <Card title="Compliance principles"><ul className="list-disc space-y-1 pl-5 text-sm"><li>Experts' own words are kept separate from analyst/AI interpretation.</li><li>Original post links and embeds appear only when authorized or verified.</li><li>Sentiment shows a confidence score and review status.</li><li>No scraping — content enters through official embeds or authorized manual entry.</li></ul></Card>
      </div>
    </div>
  );
}
