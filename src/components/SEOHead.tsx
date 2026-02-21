import { Helmet } from "react-helmet-async";
import { useSiteSettings } from "@/hooks/use-site-settings";

interface SEOHeadProps {
  title: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: "website" | "article";
  publishedAt?: string;
  modifiedAt?: string;
  articleTags?: string[];
  jsonLd?: Record<string, any>;
  noindex?: boolean;
}

export function SEOHead({ title, description, ogImage, canonicalUrl, type = "website", publishedAt, modifiedAt, articleTags, jsonLd, noindex }: SEOHeadProps) {
  const site = useSiteSettings();
  const fullTitle = `${title} | ${site.site_title}`;
  const desc = description || site.site_description || "A modern blogging platform for sharing ideas and stories.";
  const image = ogImage || site.og_image_url;
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Build JSON-LD structured data
  const baseJsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    ...(type === "article"
      ? {
          "@type": "Article",
          headline: title,
          description: desc,
          ...(image && { image: [image] }),
          ...(publishedAt && { datePublished: publishedAt }),
          ...(modifiedAt && { dateModified: modifiedAt }),
          ...(site.meta_author && {
            author: { "@type": "Person", name: site.meta_author },
          }),
          publisher: {
            "@type": "Organization",
            name: site.site_title,
            ...(site.site_icon_url && {
              logo: { "@type": "ImageObject", url: site.site_icon_url },
            }),
          },
          ...(canonicalUrl && { mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl } }),
          ...(articleTags && articleTags.length > 0 && { keywords: articleTags.join(", ") }),
        }
      : {
          "@type": "WebSite",
          name: site.site_title,
          description: desc,
          url: siteUrl,
          ...(site.meta_author && {
            author: { "@type": "Person", name: site.meta_author },
          }),
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/posts?q={search_term_string}` },
            "query-input": "required name=search_term_string",
          },
        }),
  };

  const finalJsonLd = jsonLd || baseJsonLd;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {site.meta_keywords && <meta name="keywords" content={site.meta_keywords} />}
      {site.meta_author && <meta name="author" content={site.meta_author} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.site_title} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:width" content="1200" />}
      {image && <meta property="og:image:height" content="630" />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {type === "article" && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === "article" && modifiedAt && (
        <meta property="article:modified_time" content={modifiedAt} />
      )}
      {type === "article" && articleTags && articleTags.map((tag) => (
        <meta property="article:tag" content={tag} key={tag} />
      ))}
      {type === "article" && site.meta_author && (
        <meta property="article:author" content={site.meta_author} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
      {site.social_twitter && <meta name="twitter:site" content={site.social_twitter.includes("@") ? site.social_twitter : `@${site.social_twitter.split("/").pop()}`} />}
      {site.favicon_url && <link rel="icon" href={site.favicon_url} />}
      <script type="application/ld+json">{JSON.stringify(finalJsonLd)}</script>
      {site.google_analytics_id && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.google_analytics_id}`} />
          <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.google_analytics_id}');`}</script>
        </>
      )}
    </Helmet>
  );
}
