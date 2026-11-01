import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Heart, MessageCircle, Repeat2 } from "lucide-react";
import type { Post } from "@/data/types";
import { getKol } from "@/data/kols";
import { fmtDate } from "@/lib/intel";
import { Avatar, DemoLabel, PlatformIcon, SentimentBadge, Tag } from "./ui";

export function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const kol = getKol(post.kolId)!;
  return (
    <article className="card-surface lift fade-up flex flex-col p-5">
      <div className="flex items-start gap-3">
        <Link to="/kols/$id" params={{ id: kol.id }}><Avatar kol={kol} /></Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link to="/kols/$id" params={{ id: kol.id }} className="truncate font-semibold text-navy hover:text-primary">{kol.name}</Link>
            <PlatformIcon p={post.platform} />
          </div>
          <p className="truncate text-xs text-muted-foreground">{kol.title} · {kol.institution}</p>
        </div>
        <SentimentBadge s={post.sentiment} />
      </div>
      <Link to="/posts/$slug" params={{ slug: post.slug }} className="mt-4 block">
        <h3 className="font-semibold leading-snug text-navy hover:text-primary">{post.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
      </Link>
      {!compact && (
        <p className="mt-3 rounded-lg bg-surface p-2.5 text-xs text-foreground"><span className="font-semibold text-teal">Takeaway · </span>{post.keyTakeaways[0]}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.indicationTags.map((t) => <Tag key={t} kind="indication" slug={t} />)}
        {post.assetTags.slice(0, 2).map((t) => <Tag key={t} kind="asset" slug={t} />)}
        {post.companyTags.slice(0, compact ? 1 : 2).map((t) => <Tag key={t} kind="company" slug={t} />)}
      </div>
      {!compact && <div className="mt-2 flex flex-wrap gap-2">{post.hashtags.slice(0, 3).map((h) => <Tag key={h} kind="hashtag" label={h} />)}</div>}
      <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <time dateTime={post.publishedAt}>{fmtDate(post.publishedAt)}</time>
          {post.engagement && !compact && (
            <span className="hidden items-center gap-2 sm:flex" title="Illustrative engagement">
              <Heart className="h-3 w-3" />{post.engagement.likes}<Repeat2 className="h-3 w-3" />{post.engagement.reposts}<MessageCircle className="h-3 w-3" />{post.engagement.comments}
            </span>
          )}
        </div>
        <Link to="/posts/$slug" params={{ slug: post.slug }} className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
          View full analysis <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {!compact && <DemoLabel className="mt-3 self-start" />}
    </article>
  );
}
