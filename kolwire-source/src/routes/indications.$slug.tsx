import { createFileRoute, notFound } from "@tanstack/react-router";
import { INDICATIONS } from "@/data/entities";
import { postsFor } from "@/lib/intel";
import { seo } from "@/lib/seo";
import { EntityView, NotFoundBlock } from "@/components/kol/EntityView";

export const Route = createFileRoute("/indications/$slug")({
  loader: ({ params }) => {
    const e = INDICATIONS.find((x) => x.slug === params.slug);
    if (!e) throw notFound();
    return e;
  },
  head: ({ loaderData }) => seo(loaderData ? `${loaderData.name} KOL commentary` : "Indication", loaderData?.description ?? "Indication intelligence"),
  component: Page,
  notFoundComponent: () => <NotFoundBlock what="Indication" />,
  errorComponent: () => <NotFoundBlock what="Indication" />,
});

function Page() {
  const e = Route.useLoaderData();
  return <EntityView eyebrow="Indication" title={e.name} desc={e.description} posts={postsFor("indicationTags", e.slug)} />;
}
