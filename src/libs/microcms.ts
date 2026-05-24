import {
  createClient,
  type MicroCMSQueries,
  type MicroCMSListContent,
  type MicroCMSImage,
} from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.VITE_SERVICE_DOMAIN, // ←ここが超重要
  apiKey: import.meta.env.VITE_API_KEY,
});

/** ワインのタイプ（microCMSのセレクトフィールド `type`。値は英語小文字） */
export type WineType =
  | "red"
  | "white"
  | "orange"
  | "rose"
  | "sparkling"
  | "other";

/** フィルタ表示順とラベル */
export const WINE_TYPES: { key: WineType; label: string }[] = [
  { key: "red", label: "Red" },
  { key: "white", label: "White" },
  { key: "orange", label: "Orange" },
  { key: "rose", label: "Rosé" },
  { key: "sparkling", label: "Sparkling" },
  { key: "other", label: "Other" },
];

const TYPE_LABELS: Record<WineType, string> = Object.fromEntries(
  WINE_TYPES.map((t) => [t.key, t.label]),
) as Record<WineType, string>;

/** microCMSの生の値（red/Red/rosé 等の表記ゆれ）を正規化 */
export const normalizeWineType = (raw?: string): WineType | undefined => {
  if (!raw) return undefined;
  const v = raw.toLowerCase().trim();
  if (v === "rosé" || v === "rosado" || v === "rosato") return "rose";
  const keys: WineType[] = ["red", "white", "orange", "rose", "sparkling", "other"];
  return keys.includes(v as WineType) ? (v as WineType) : undefined;
};

/** 表示用ラベル（Red / White …） */
export const wineTypeLabel = (key?: WineType): string =>
  key ? TYPE_LABELS[key] : "";

/**
 * `blogs` API の1件分。
 * title / title2 / image / content / description は既存フィールド。
 * type / rating / region / grape / vintage は今後 microCMS に追加する想定で、
 * 未設定でも壊れないよう全て optional にしている。
 */
export type Blog = {
  title: string;
  title2?: string;
  image?: MicroCMSImage;
  content?: string;
  description?: string;
  /** セレクト（red/white/orange/rose/sparkling/other）。microCMSは配列で返す */
  type?: string | string[];
  /** 1〜5 の星評価 */
  rating?: number;
  /** 産地 */
  region?: string;
  /** 品種 */
  grape?: string;
  /** ヴィンテージ */
  vintage?: string | number;
} & MicroCMSListContent;

/** microCMSのtypeフィールド（文字列/配列/表記ゆれ）を正規化して1つ返す */
export const wineTypeOf = (blog: Pick<Blog, "type">): WineType | undefined => {
  const raw = Array.isArray(blog.type) ? blog.type[0] : blog.type;
  return normalizeWineType(raw);
};

export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.getList<Blog>({ endpoint: "blogs", queries });
};

export const getBlogsDetail = async (
  blogId: string,
  queries?: MicroCMSQueries,
) => {
  return await client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId: blogId,
    queries,
  });
};
