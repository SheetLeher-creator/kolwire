export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} · KOLwire` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · KOLwire` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
