import { createFileRoute, Link } from "@tanstack/react-router";
import { ASSETS, INDICATIONS } from "@/data/entities";
import { netScore, POSTS_FOR_MATRIX } from "@/lib/explorer";
import { seo } from "@/lib/seo";
import { Card, DemoLabel, PageHeader } from "@/components/kol/ui";

export const Route = createFileRoute("/explorer")({
  head: () => seo("Landscape Explorer", "Matrix of oncology assets by indication showing KOL commentary volume and sentiment."),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader eyebrow="Explore" title="Landscape explorer" desc="Asset × indication heatmap. Cell = post count, color = net sentiment."><DemoLabel /></PageHeader>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="p-2 text-left">Asset</th>{INDICATIONS.map((i) => <th key={i.slug} className="p-2 text-xs font-medium text-muted-foreground"><Link to="/indications/$slug" params={{ slug: i.slug }} className="hover:text-primary">{i.name}</Link></th>)}</tr></thead>
            <tbody>
              {ASSETS.map((a) => (
                <tr key={a.slug} className="border-t">
                  <td className="p-2 font-medium"><Link to="/assets/$slug" params={{ slug: a.slug }} className="hover:text-primary">{a.name}</Link></td>
                  {INDICATIONS.map((i) => {
                    const ps = POSTS_FOR_MATRIX(a.slug, i.slug);
                    const n = netScore(ps);
                    const color = n > 20 ? "var(--positive)" : n < -20 ? "var(--negative)" : "var(--mixed)";
                    return <td key={i.slug} className="p-1 text-center">{ps.length ? <span className="inline-flex h-9 w-full min-w-10 items-center justify-center rounded-md font-semibold" style={{ background: `color-mix(in oklch, ${color} ${20 + ps.length * 15}%, transparent)` }} title={`${ps.length} posts · net ${n}`}>{ps.length}</span> : <span className="text-muted-foreground">·</span>}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
