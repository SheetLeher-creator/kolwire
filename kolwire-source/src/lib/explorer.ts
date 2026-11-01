import { POSTS } from "@/data/posts";
export { netScore } from "./intel";
export const POSTS_FOR_MATRIX = (asset: string, ind: string) => POSTS.filter((p) => p.assetTags.includes(asset) && p.indicationTags.includes(ind));
