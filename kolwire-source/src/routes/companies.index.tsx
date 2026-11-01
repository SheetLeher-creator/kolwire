import { createFileRoute, Link } from "@tanstack/react-router";
import { ASSETS, COMPANIES } from "@/data/entities";
import { netScore, postsFor } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/kol/ui";

export const Route = createFileRoute("/companies/")({
  head: () => seo("Companies & Assets", "Pharma companies and oncology assets discussed by tracked KOLs."),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader eyebrow="Landscape" title="Companies & Assets" desc="Who and what the experts are talking about." />
      <h2 className="mb-3 text-lg font-semibold text-navy">Companies</h2>
      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {COMPANIES.map((c) => {
          const ps = postsFor("companyTags", c.slug);
          return (
            <Link key={c.slug} to="/companies/$slug" params={{ slug: c.slug }} className="card-surface lift block p-5">
              <h3 className="font-semibold text-navy">{c.name}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{c.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">{ps.length} posts · Net {netScore(ps)}</p>
            </Link>
          );
        })}
      </div>
      <h2 className="mb-3 text-lg font-semibold text-navy">Assets</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {ASSETS.map((a) => {
          const ps = postsFor("assetTags", a.slug);
          return (
            <Link key={a.slug} to="/assets/$slug" params={{ slug: a.slug }} className="card-surface lift block p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">{a.modality} · {a.target}</p>
              <h3 className="mt-1 font-semibold text-navy">{a.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">{ps.length} posts · Net {netScore(ps)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
