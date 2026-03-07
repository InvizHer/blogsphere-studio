import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, Calendar, BookOpen, Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { SEOHead } from "@/components/SEOHead";
import { CommentSection } from "@/components/CommentSection";
import { SharePost } from "@/components/SharePost";
import { RelatedPosts } from "@/components/RelatedPosts";
import { PostDetailSkeleton } from "@/components/skeletons/PostDetailSkeleton";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { toast } from "sonner";
import {
  LinkShortenerProvider,
  LinkShortenerTop,
  LinkShortenerBottom,
} from "@/components/LinkShortenerOverlay";

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  view_count: number;
  categories: string[];
  comments_enabled: boolean;
}

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const cleanSlug = slug?.replace(/\.html$/, "") || "";

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", cleanSlug)
        .eq("status", "published")
        .single();

      if (data) {
        supabase.rpc("increment_post_views", { p_post_id: data.id }).then();

        const { data: pc } = await supabase
          .from("post_categories")
          .select("categories(name)")
          .eq("post_id", data.id);

        setPost({
          ...data,
          categories: pc?.map((p: any) => p.categories?.name).filter(Boolean) ?? [],
        });
      }
      setLoading(false);
    };
    if (cleanSlug) fetchPost();
  }, [cleanSlug]);

  // Enhance code blocks with sticky header + copy button
  useEffect(() => {
    if (!contentRef.current || !post) return;

    const preBlocks = contentRef.current.querySelectorAll("pre");
    preBlocks.forEach((pre) => {
      if (pre.querySelector(".code-header")) return;

      const code = pre.querySelector("code");
      if (!code) return;

      const header = document.createElement("div");
      header.className = "code-header";

      const label = document.createElement("span");
      label.className = "code-header-label";
      label.textContent = "CODE";

      const copyBtn = document.createElement("button");
      copyBtn.className = "code-copy-btn";
      copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy`;

      let copied = false;
      copyBtn.addEventListener("click", async () => {
        if (copied) return;
        try {
          await navigator.clipboard.writeText(code.textContent || "");
          copied = true;
          copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
          copyBtn.style.color = "hsl(142, 70%, 55%)";
          setTimeout(() => {
            copied = false;
            copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy`;
            copyBtn.style.color = "";
          }, 2000);
        } catch {}
      });

      header.appendChild(label);
      header.appendChild(copyBtn);
      pre.insertBefore(header, code);
    });
  }, [post, contentRef]);


  if (loading) return <PostDetailSkeleton />;

  if (!post) {
    return (
      <>
        <PublicHeader />
        <div className="container px-4 py-20 pt-36 text-center">
          <i className="fa-solid fa-file-circle-question mb-4 text-5xl text-muted-foreground/30"></i>
          <h1 className="mb-3 font-display text-3xl font-bold text-foreground">Article Not Found</h1>
          <p className="mb-6 text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Link to="/posts" className="text-primary hover:underline">← Back to articles</Link>
        </div>
        <PublicFooter />
      </>
    );
  }

  const postDate = post.published_at || post.created_at;
  const saved = isBookmarked(post.id);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const articleUrl = `${siteUrl}/posts/${post.slug}.html`;

  const handleBookmark = () => {
    if (saved) {
      removeBookmark(post.id);
      toast.info("Removed from bookmarks");
    } else {
      addBookmark({ id: post.id, title: post.title, slug: post.slug, thumbnailUrl: post.thumbnail_url, excerpt: post.excerpt });
      toast.success("Added to bookmarks", {
        action: { label: "View", onClick: () => window.dispatchEvent(new CustomEvent("open-bookmarks")) },
      });
    }
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${siteUrl}/posts` },
      { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
    ],
  };

  return (
    <LinkShortenerProvider>
      <SEOHead
        title={post.title}
        description={post.excerpt || undefined}
        ogImage={post.thumbnail_url || undefined}
        canonicalUrl={articleUrl}
        type="article"
        publishedAt={post.published_at || undefined}
        modifiedAt={post.updated_at || undefined}
        articleTags={post.categories}
      />
      {/* Extra breadcrumb structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PublicHeader />

      <div className="pt-20 md:pt-28">
        <LinkShortenerTop />

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="py-10 md:py-14"
          >
            <h1 className="mb-8 max-w-3xl lg:max-w-none font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl text-foreground">
              {post.title}
            </h1>

            {/* Desktop metadata */}
            <div className="hidden sm:flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">Published</p>
                  <time dateTime={postDate} className="font-medium text-foreground">
                    {new Date(postDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                </div>
              </div>

              <div className="h-8 w-px bg-border" />

              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <Eye className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">Views</p>
                  <span className="font-medium text-foreground">{post.view_count.toLocaleString()}</span>
                </div>
              </div>

              <div className="h-8 w-px bg-border" />

              <button
                onClick={handleBookmark}
                className="flex items-center gap-2.5 text-sm text-muted-foreground group"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  saved ? "bg-primary/15" : "bg-muted hover:bg-primary/10"
                }`}>
                  {saved
                    ? <BookmarkCheck className="h-4 w-4 text-primary" />
                    : <Bookmark className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  }
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">Bookmark</p>
                  <span className={`font-medium transition-colors ${saved ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                    {saved ? "Saved" : "Save"}
                  </span>
                </div>
              </button>
            </div>

            {/* Mobile metadata — equal three-column cards */}
            <div className="grid sm:hidden grid-cols-3 gap-2.5 mt-1">
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-muted/50 px-2 py-3">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                <time dateTime={postDate} className="text-sm font-semibold text-foreground text-center leading-tight">
                  {new Date(postDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </time>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Published</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-muted/50 px-2 py-3">
                <Eye className="h-4.5 w-4.5 text-primary" />
                <span className="text-sm font-semibold text-foreground">{post.view_count.toLocaleString()}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Views</span>
              </div>

              <button
                onClick={handleBookmark}
                className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 transition-colors ${
                  saved
                    ? "border-primary/30 bg-primary/10"
                    : "border-border bg-muted/50 hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                {saved
                  ? <BookmarkCheck className="h-4.5 w-4.5 text-primary" />
                  : <Bookmark className="h-4.5 w-4.5 text-muted-foreground" />
                }
                <span className={`text-sm font-semibold ${saved ? "text-primary" : "text-foreground"}`}>
                  {saved ? "Saved" : "Save"}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Bookmark</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="h-px w-full bg-border/60" />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14">
        <div className="lg:flex lg:gap-10 xl:gap-14">
          <article className="min-w-0 flex-1 overflow-hidden lg:max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              ref={contentRef}
              className="prose-content max-w-none text-foreground [&_img]:max-w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:max-w-full [&_table]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {/* Categories — below article content, visible on ALL screen sizes */}
            {post.categories.length > 0 && (
              <div className="mt-10 border-t border-border pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/posts?category=${encodeURIComponent(cat.toLowerCase())}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile only: share, comments, related stacked */}
            <div className="mt-8 space-y-6 lg:hidden">
              <SharePost title={post.title} slug={post.slug} />
              <div data-comment-section>
                <CommentSection postId={post.id} commentsEnabled={post.comments_enabled} />
              </div>
              <RelatedPosts currentPostId={post.id} categoryNames={post.categories} />
            </div>
          </article>

          {/* Sidebar — desktop only: share, comments, related */}
          <aside className="hidden lg:block lg:w-80 xl:w-96">
            <div className="sticky top-24 space-y-6">
              <SharePost title={post.title} slug={post.slug} />
              <div data-comment-section>
                <CommentSection postId={post.id} commentsEnabled={post.comments_enabled} />
              </div>
              <RelatedPosts currentPostId={post.id} categoryNames={post.categories} />
            </div>
          </aside>
        </div>
      </div>

      <LinkShortenerBottom />
      <PublicFooter />
    </LinkShortenerProvider>
  );
}
