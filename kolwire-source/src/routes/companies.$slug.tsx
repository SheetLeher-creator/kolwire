import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ASSETS, COMPANIES } from "@/data/entities";
import { postsFor } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { EntityView, NotFoundBlock } from "@/components/kol/EntityView";

export const Route = createFileRoute("/companies/$slug")({
  loader: ({ params }) => {
    const e = COMPANIES.find((x) => x.slug === params.slug);
    if (!e) throw notFound();
    return e;
  },
  head: ({ loaderData }) => seo(loaderData ? `${loaderData.name} KOL sentiment` : "Company", loaderData?.description ?? "Company intelligence"),
  component: Page,
  notFoundComponent: () => <NotFoundBlock what="Company" />,
  errorComponent: () => <NotFoundBlock what="Company" />,
});

function Page() {
  const e = Route.useLoaderData();
  const assets = ASSETS.filter((a) => a.company === e.slug);
  return (
    <EntityView eyebrow="Company" title={e.name} desc={e.description} posts={postsFor("companyTags", e.slug)}
      extra={assets.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">{assets.map((a) => <Link key={a.slug} to="/assets/$slug" params={{ slug: a.slug }} className="rounded-full border px-3 py-1 text-sm hover:bg-secondary">{a.name}</Link>)}</div>
      )} />
  );
}
