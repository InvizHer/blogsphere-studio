import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml; charset=utf-8",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get the site URL from the request origin or referer
    const url = new URL(req.url);
    const siteUrl = url.searchParams.get("site_url") || "https://example.com";

    // Fetch all published posts
    const { data: posts } = await supabase
      .from("posts")
      .select("slug, updated_at, published_at, created_at")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    // Fetch all categories
    const { data: categories } = await supabase
      .from("categories")
      .select("slug, updated_at");

    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "daily" },
      { loc: "/posts", priority: "0.9", changefreq: "daily" },
      { loc: "/projects", priority: "0.8", changefreq: "weekly" },
      { loc: "/about", priority: "0.6", changefreq: "monthly" },
      { loc: "/contact", priority: "0.5", changefreq: "monthly" },
      { loc: "/faq", priority: "0.5", changefreq: "monthly" },
      { loc: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
      { loc: "/disclaimer", priority: "0.3", changefreq: "yearly" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${siteUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Post pages
    if (posts) {
      for (const post of posts) {
        const lastmod = post.updated_at || post.published_at || post.created_at;
        xml += `  <url>
    <loc>${siteUrl}/posts/${post.slug}.html</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    }

    // Category pages
    if (categories) {
      for (const cat of categories) {
        xml += `  <url>
    <loc>${siteUrl}/posts?category=${encodeURIComponent(cat.slug)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
