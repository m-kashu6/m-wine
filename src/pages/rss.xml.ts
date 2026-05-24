import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getBlogs } from "../libs/microcms";

const plain = (html?: string) =>
  (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export async function GET(context: APIContext) {
  const res = await getBlogs({ limit: 100 });

  return rss({
    title: "M's Wine Record",
    description:
      "Maki K. が飲んだワインの記録。産地・品種・評価とともに綴る、大阪発のワインジャーナル。",
    site: context.site ?? "https://m-wine.netlify.app",
    items: res.contents.map((blog) => ({
      title: blog.title,
      link: `/${blog.id}`,
      pubDate: new Date(blog.publishedAt ?? blog.createdAt),
      description: plain(blog.title2).slice(0, 200),
    })),
    customData: `<language>ja</language>`,
  });
}
