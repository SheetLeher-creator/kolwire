import { createFileRoute, Link } from "@tanstack/react-router";
import { INDICATIONS } from "@/data/entities";
import { netScore, postsFor } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { Bar, PageHeader } from "@/components/kol/ui";

export const Route = createFileRoute("/indications/")({
  head: () => seo("Indications", "Oncology indications monitored by KOLwire with commentary volume and sentiment."),
  component: Page,
});

function Page() {
  const max = Math.max(...INDICATIONS.map((i) => postsFor("indicationTags", i.slug).length));
  return (
    <div>
      <PageHeader eyebrow="Coverage" title="Indications" desc="Tumor types with tracked expert conversation." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {INDICATIONS.map((i) => {
          const ps = postsFor("indicationTags", i.slug);
          return (
            <Link key={i.slug} to="/indications/$slug" params={{ slug: i.slug }} className="card-surface lift block p-5">
              <h2 className="font-semibold text-navy">{i.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{i.description}</p>
              <div className="mt-4 flex justify-between text-xs text-muted-foreground"><span>{ps.length} posts</span><span>Net score {netScore(ps)}</span></div>
              <div className="mt-2"><Bar value={ps.length} max={max} color="var(--teal)" /></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
