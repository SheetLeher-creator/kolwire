/**
 * KOLwire data model.
 * Content provenance is explicit: `isDemo` (illustrative), `contentSource`
 * (demo | verified-embed | manual-authorized), and the AI/analyst interpretation
 * fields are kept separate from the expert's own words (`fullContent`).
 */
export type Platform = "linkedin" | "x";
export type Sentiment = "positive" | "neutral" | "negative" | "mixed";
export type PostType = "Clinical data" | "Regulatory" | "Safety" | "Competitive landscape" | "Expert opinion";
export type ContentSource = "demo" | "verified-embed" | "manual-authorized";

export interface Kol {
  id: string;
  name: string;
  title: string;
  institution: string;
  specialty: string;
  region: string;
  bio: string;
  linkedinUrl?: string | undefined; // only set once verified
  xUrl?: string | undefined; // only set once verified
  initials: string;
  hue: number; // avatar color
  isDemo: boolean;
}

export interface Post {
  id: string;
  slug: string;
  kolId: string;
  platform: Platform;
  originalPostUrl?: string | undefined; // real URL only when authorized/verified
  embedHtmlAllowed?: boolean | undefined; // official embed permitted
  contentSource: ContentSource;
  publishedAt: string; // ISO date
  title: string;
  fullContent: string;
  excerpt: string;
  postType: PostType;
  sentiment: Sentiment;
  sentimentRationale: string;
  sentimentConfidence: number; // 0-1
  sentimentReviewed: boolean;
  indicationTags: string[];
  companyTags: string[];
  assetTags: string[];
  modalityTags: string[];
  conferenceTags: string[];
  phase?: string | undefined;
  topic: string;
  hashtags: string[];
  keyTakeaways: string[];
  clinicalImplications: string;
  competitiveImplications: string;
  commercialRelevance: string;
  analystSummary: string;
  relatedPostIds: string[];
  engagement?: { likes: number; reposts: number; comments: number } | undefined; // illustrative only
  isDemo: boolean;
}

export interface Entity { slug: string; name: string; description: string }
export interface Asset extends Entity { company: string; modality: string; target: string }
