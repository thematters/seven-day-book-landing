import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// 正式網址：https://freewriting.matters.town（custom domain，base = /）
// 仍透過 GH Actions repo vars 覆寫：SITE_URL / BASE_PATH
const site = process.env.SITE_URL ?? "https://freewriting.matters.town";
const rawBase = process.env.BASE_PATH ?? "/";
const base =
  rawBase === "/" ? "/" : `/${rawBase.replace(/^\/+|\/+$/g, "")}`;

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  output: "static",
  build: { format: "directory" },
  // 金句牆已收進博物館主頁（/museum/#memo-wall），舊的獨立頁網址一律轉址過去，避免舊連結 404
  redirects: {
    "/memo-wall": "/museum/#memo-wall",
    "/museum/memo-wall": "/museum/#memo-wall",
  },
  integrations: [sitemap()],
});
