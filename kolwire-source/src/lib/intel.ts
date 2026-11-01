import { POSTS } from "@/data/posts";
import { KOLS } from "@/data/kols";
import type { Post, Sentiment } from "@/data/types";

export const SENTIMENTS: Sentiment[] = ["positive", "neutral", "negative", "mixed"];
export const SENTIMENT_LABEL: Record<Sentiment, string> = { positive: "Positive", neutral: "Neutral", negative: "Negative", mixed: "Mixed" };
export const SENTIMENT_VAR: Record<Sentiment, string> = { positive: "var(--positive)", neutral: "var(--neutral)", negative: "var(--negative)", mixed: "var(--mixed)" };
const SCORE: Record<Sentiment, number> = { positive: 1, neutral: 0, negative: -1, mixed: 0 };

export const byDateDesc = (a: Post, b: Post) => b.publishedAt.localeCompare(a.publishedAt);
export const sortedPosts = () => [...POSTS].sort(byDateDesc);

export function sentimentCounts(posts: Post[]) {
  const c = { positive: 0, neutral: 0, negative: 0, mixed: 0 } as Record<Sentiment, number>;
  posts.forEach((p) => c[p.sentiment]++);
  return c;
}
export const sentimentPie = (posts: Post[]) => {
  const c = sentimentCounts(posts);
  return SENTIMENTS.map((s) => ({ name: SENTIMENT_LABEL[s], key: s, value: c[s], fill: SENTIMENT_VAR[s] }));
};
export const netScore = (posts: Post[]) => posts.length ? Math.round((posts.reduce((a, p) => a + SCORE[p.sentiment], 0) / posts.length) * 100) : 0;

/** Monthly sentiment trend. */
export function monthlyTrend(posts: Post[]) {
  const m = new Map<string, Record<Sentiment, number>>();
  posts.forEach((p) => {
    const k = p.publishedAt.slice(0, 7);
    const r: Record<Sentiment, number> = m.get(k) ?? { positive: 0, neutral: 0, negative: 0, mixed: 0 };
    r[p.sentiment]++;
    m.set(k, r);
  });
  return [...m.entries()].sort().map(([k, v]) => ({
    month: new Date(k + "-01").toLocaleDateString("en", { month: "short", year: "2-digit" }), ...v,
    net: Math.round(((v.positive - v.negative) / Math.max(1, v.positive + v.neutral + v.negative + v.mixed)) * 100),
  }));
}

export function countTags(posts: Post[], field: "assetTags" | "companyTags" | "indicationTags" | "hashtags" | "conferenceTags" | "topic") {
  const m = new Map<string, number>();
  posts.forEach((p) => {
    const v = p[field];
    (Array.isArray(v) ? v : [v]).forEach((t) => m.set(t, (m.get(t) ?? 0) + 1));
  });
  return [...m.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
}

export const postsFor = (field: "assetTags" | "companyTags" | "indicationTags", slug: string) => sortedPosts().filter((p) => p[field].includes(slug));
export const postsByKol = (id: string) => sortedPosts().filter((p) => p.kolId === id);

export function topKols(posts: Post[], n = 5) {
  const m = new Map<string, number>();
  posts.forEach((p) => m.set(p.kolId, (m.get(p.kolId) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([id, count]) => ({ kol: KOLS.find((k) => k.id === id)!, count }));
}

/** Similarity score for related-post recommendations. */
export function overlap(a: Post, b: Post) {
  const inter = (x: string[], y: string[]) => x.filter((v) => y.includes(v)).length;
  return inter(a.assetTags, b.assetTags) * 3 + inter(a.indicationTags, b.indicationTags) * 2 + inter(a.companyTags, b.companyTags) + (a.topic === b.topic ? 2 : 0);
}

export function related(post: Post) {
  const others = POSTS.filter((p) => p.id !== post.id);
  const pick = (f: (p: Post) => boolean, n = 3) => others.filter(f).sort((x, y) => overlap(post, y) - overlap(post, x)).slice(0, n);
  return {
    sameDrug: pick((p) => p.assetTags.some((a) => post.assetTags.includes(a)) && p.kolId !== post.kolId),
    sameIndication: pick((p) => p.indicationTags.some((a) => post.indicationTags.includes(a))),
    sameCompany: pick((p) => p.companyTags.some((a) => post.companyTags.includes(a))),
    similarSentiment: pick((p) => p.sentiment === post.sentiment && overlap(post, p) > 0),
    contrasting: pick((p) => p.sentiment !== post.sentiment && p.sentiment !== "neutral" && overlap(post, p) > 1),
    timeline: [post, ...others.filter((p) => p.topic === post.topic || overlap(post, p) >= 4)].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt)).slice(0, 8),
  };
}

export const fmtDate = (d: string) => new Date(d).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });
