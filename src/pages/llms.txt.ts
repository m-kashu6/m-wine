import type { APIContext } from "astro";
import { getBlogs, wineTypeOf, wineTypeLabel } from "../libs/microcms";

const plain = (html?: string) =>
  (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// llms.txt — a concise, LLM-friendly index of the site.
// Spec: https://llmstxt.org/
export async function GET(context: APIContext) {
  const site = context.site?.toString().replace(/\/$/, "") ?? "https://m-wine.netlify.app";
  const res = await getBlogs({ limit: 100 });

  const wines = res.contents
    .map((b) => {
      const t = wineTypeOf(b);
      const tag = t ? `[${wineTypeLabel(t)}] ` : "";
      const note = plain(b.title2).slice(0, 90);
      return `- [${b.title}](${site}/${b.id}): ${tag}${note}`.trim();
    })
    .join("\n");

  const body = `# M's Wine Record

> 大阪在住の Maki Kashu が飲んだワインを記録するワインジャーナル。赤(Red)・白(White)・オレンジ(Orange)・ロゼ(Rosé)・スパークリング(Sparkling)を、産地・品種・5段階評価とともに紹介しています。

## About
- 著者: Maki Kashu（大阪）
- 内容: 個人のワインテイスティングノート / 飲んだワインの記録
- 言語: 日本語
- サイト: ${site}/

## Wines (${res.contents.length})
${wines}

## Feeds
- RSS: ${site}/rss.xml
- Sitemap: ${site}/sitemap-index.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
