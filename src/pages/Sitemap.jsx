import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

const SITE_URL = "https://thecodehelper.com";

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/about", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", priority: "0.6", changefreq: "monthly" },
  { loc: "/projects", priority: "0.8", changefreq: "daily" },
  { loc: "/freelancer", priority: "0.7", changefreq: "weekly" },
  { loc: "/client", priority: "0.7", changefreq: "weekly" },
  { loc: "/blog", priority: "0.9", changefreq: "daily" },
  { loc: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms-and-conditions", priority: "0.3", changefreq: "yearly" },
  { loc: "/register", priority: "0.6", changefreq: "monthly" },
  { loc: "/login", priority: "0.5", changefreq: "monthly" },
];

const Sitemap = () => {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (rendered) return;
    setRendered(true);

    const generate = async () => {
      let blogEntries = [];
      try {
        const res = await apiRequest("GET", "/blog/sitemap");
        if (res.data?.status && res.data.data) {
          blogEntries = res.data.data.map((post) => ({
            loc: `/blog/${post.slug}`,
            lastmod: (post.updated_at || post.published_at || "").split("T")[0],
            priority: "0.8",
            changefreq: "weekly",
          }));
        }
      } catch (err) {
        // Blog posts unavailable — generate sitemap without them
      }

      const today = new Date().toISOString().split("T")[0];
      const allPages = [
        ...staticPages.map((p) => ({ ...p, lastmod: today })),
        ...blogEntries,
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      for (const page of allPages) {
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
        if (page.lastmod) xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
      }
      xml += `</urlset>`;

      // Replace the entire document with XML
      document.open("text/xml");
      document.write(xml);
      document.close();
    };

    generate();
  }, [rendered]);

  return null;
};

export default Sitemap;
