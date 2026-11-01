import { createFileRoute, notFound } from "@tanstack/react-router";
import { ASSETS, companyName } from "@/data/entities";
import { postsFor } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { EntityView, NotFoundBlock } from "@/components/kol/EntityView";
import { Tag } from "@/components/kol/ui";

export const Route = createFileRoute("/assets/$slug")({
  loader: ({ params }) => {
    const e = ASSETS.find((x) => x.slug === params.slug);
    if (!e) throw notFound();
    return e;
  },
  head: ({ loaderData }) => seo(loaderData ? `${loaderData.name} expert commentary` : "Asset", loaderData?.description ?? "Asset intelligence"),
  component: Page,
  notFoundComponent: () => <NotFoundBlock what="Asset" />,
  errorComponent: () => <NotFoundBlock what="Asset" />,
});

function Page() {
  const e = Route.useLoaderData();
  return (
    <EntityView eyebrow={`${e.modality} · ${e.target}`} title={e.name} desc={`${e.description} Company: ${companyName(e.company)}.`} posts={postsFor("assetTags", e.slug)}
      extra={<div className="mb-6"><Tag kind="company" slug={e.company} /></div>} />
  );
}
