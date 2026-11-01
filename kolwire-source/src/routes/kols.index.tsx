import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { KOLS } from "@/data/kols";
import { SPECIALTIES } from "@/data/entities";
import { netScore, postsByKol } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { Avatar, DemoLabel, Empty, PageHeader } from "@/components/kol/ui";

export const Route = createFileRoute("/kols/")({
  head: () => seo("KOL Directory", "Directory of fictional oncology key opinion leaders tracked in the KOLwire demo."),
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const [sp, setSp] = useState("");
  const list = KOLS.filter((k) => (!sp || k.specialty === sp) && `${k.name} ${k.institution} ${k.specialty} ${k.region}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader eyebrow="Experts" title="KOL Directory" desc="Fictional oncology experts used to demonstrate the platform."><DemoLabel /></PageHeader>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, institution, region…" aria-label="Search KOLs" className="flex-1 rounded-lg border bg-card px-3 py-2 text-sm" />
        <select value={sp} onChange={(e) => setSp(e.target.value)} aria-label="Specialty" className="rounded-lg border bg-card px-3 py-2 text-sm">
          <option value="">All specialties</option>{SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      {list.length === 0 ? <Empty title="No KOLs match" /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((k) => {
            const ps = postsByKol(k.id);
            return (
              <Link key={k.id} to="/kols/$id" params={{ id: k.id }} className="card-surface lift block p-5">
                <div className="flex items-center gap-3"><Avatar kol={k} size={48} /><div className="min-w-0"><h2 className="font-semibold text-navy">{k.name}</h2><p className="truncate text-xs text-muted-foreground">{k.title}</p></div></div>
                <p className="mt-3 text-sm text-muted-foreground">{k.institution}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="rounded-md bg-accent px-2 py-0.5 text-accent-foreground">{k.specialty}</span><span className="rounded-md bg-muted px-2 py-0.5">{k.region}</span></div>
                <p className="mt-3 text-xs text-muted-foreground">{ps.length} posts · Net sentiment {netScore(ps)}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
