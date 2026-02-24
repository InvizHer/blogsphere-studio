import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Code2, Layers, TrendingUp, Hash } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { PostCard } from "@/components/PostCard";
import { ProjectCard } from "@/components/ProjectCard";
import { SEOHead } from "@/components/SEOHead";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { PostCardSkeleton } from "@/components/skeletons/PostCardSkeleton";
import { ProjectCardSkeleton } from "@/components/skeletons/ProjectCardSkeleton";
import { TopicCardSkeleton } from "@/components/skeletons/TopicCardSkeleton";

interface PostWithCategories {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  created_at: string;
  categories: string[];
}

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

const topicIcons: Record<string, string> = {
  javascript: "fa-brands fa-js",
  python: "fa-brands fa-python",
  react: "fa-brands fa-react",
  css: "fa-brands fa-css3-alt",
  html: "fa-brands fa-html5",
  node: "fa-brands fa-node-js",
  git: "fa-brands fa-git-alt",
  docker: "fa-brands fa-docker",
  linux: "fa-brands fa-linux",
  aws: "fa-brands fa-aws",
};

function getTopicIcon(name: string) {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(topicIcons)) {
    if (lower.includes(key)) return icon;
  }
  const fallbacks = [
    "fa-solid fa-code", "fa-solid fa-terminal", "fa-solid fa-microchip",
    "fa-solid fa-database", "fa-solid fa-server", "fa-solid fa-globe",
    "fa-solid fa-bolt", "fa-solid fa-cube",
  ];
  return fallbacks[name.charCodeAt(0) % fallbacks.length];
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

export default function Index() {
  const site = useSiteSettings();
  const navigate = useNavigate();
  const [recentPosts, setRecentPosts] = useState<PostWithCategories[]>([]);
  const [recentProjects, setRecentProjects] = useState<PostWithCategories[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: posts } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, thumbnail_url, published_at, created_at")
        .eq("status", "published")
        .eq("is_project", false)
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(3);

      if (posts) {
        const postsWithCats = await Promise.all(
          posts.map(async (post) => {
            const { data: pc } = await supabase
              .from("post_categories")
              .select("category_id, categories(name)")
              .eq("post_id", post.id);
            return {
              ...post,
              categories: pc?.map((p: any) => p.categories?.name).filter(Boolean) ?? [],
            };
          })
        );
        setRecentPosts(postsWithCats);
      }

      const { data: projects } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, thumbnail_url, published_at, created_at")
        .eq("status", "published")
        .eq("is_project", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(3);

      if (projects) {
        const projectsWithCats = await Promise.all(
          projects.map(async (post) => {
            const { data: pc } = await supabase
              .from("post_categories")
              .select("category_id, categories(name)")
              .eq("post_id", post.id);
            return {
              ...post,
              categories: pc?.map((p: any) => p.categories?.name).filter(Boolean) ?? [],
            };
          })
        );
        setRecentProjects(projectsWithCats);
      }

      const { data: cats } = await supabase.from("categories").select("id, name, slug");
      if (cats) {
        const { data: pcAll } = await supabase.from("post_categories").select("category_id");
        const countMap = new Map<string, number>();
        pcAll?.forEach((pc: any) => {
          countMap.set(pc.category_id, (countMap.get(pc.category_id) || 0) + 1);
        });
        const catsWithCount: CategoryWithCount[] = cats.map((c) => ({
          ...c,
          postCount: countMap.get(c.id) || 0,
        }));
        catsWithCount.sort((a, b) => b.postCount - a.postCount);
        setCategories(catsWithCount);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const visibleTopics = categories.filter(c => c.postCount > 0);

  const handleTerminalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/posts?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <SEOHead
        title="Home"
        description={site.site_description || "Inkwell — A modern platform for coding tutorials, programming resources, tech articles and developer knowledge."}
        canonicalUrl={typeof window !== "undefined" ? window.location.origin : undefined}
      />
      <PublicHeader />

      <main className="pt-16">
        {/* ───── Hero ───── */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full opacity-[0.07]" style={{ background: "var(--gradient-primary)", filter: "blur(100px)" }} />

          <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 md:pb-24 md:pt-20 lg:pb-28">
            {/* Mobile: centered layout */}
            <div className="lg:hidden">
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="flex flex-col items-center text-center">
                <motion.h1 variants={fadeUp} custom={0} className="mb-6 font-display text-4xl font-extrabold leading-[1.08] text-foreground sm:text-5xl">
                  Code. Create.<br />
                  <span className="gradient-text">Innovate.</span>
                </motion.h1>

                <motion.p variants={fadeUp} custom={1} className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
                  Your gateway to programming tutorials, innovative projects, and cutting-edge development resources.
                </motion.p>

                <motion.div variants={fadeUp} custom={2} className="mb-8 w-full max-w-md">
                  <TerminalSearch query={searchQuery} setQuery={setSearchQuery} onSubmit={handleTerminalSearch} />
                </motion.div>

                <motion.div variants={fadeUp} custom={3} className="flex gap-3">
                  <Link
                    to="/projects"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Layers className="h-4 w-4" /> Projects
                  </Link>
                  <Link
                    to="/posts"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
                  >
                    Browse Posts <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center">
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                <motion.h1 variants={fadeUp} custom={0} className="mb-6 font-display text-5xl font-extrabold leading-[1.08] text-foreground md:text-6xl lg:text-7xl">
                  Code. Create.<br />
                  <span className="gradient-text">Innovate.</span>
                </motion.h1>

                <motion.p variants={fadeUp} custom={1} className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Your gateway to programming tutorials, innovative projects, and cutting-edge development resources.
                </motion.p>

                <motion.div variants={fadeUp} custom={2} className="flex flex-row gap-3">
                  <Link
                    to="/projects"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Layers className="h-4 w-4" /> Projects
                  </Link>
                  <Link
                    to="/posts"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
                  >
                    Browse Posts <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <TerminalSearch query={searchQuery} setQuery={setSearchQuery} onSubmit={handleTerminalSearch} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ───── Latest Articles (3 posts) ───── */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
          <div className="mb-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">Fresh Content</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              Latest <span className="gradient-text">Articles</span>
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">Fresh perspectives, tutorials, and developer insights.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
              : recentPosts.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                    <PostCard id={post.id} {...post} publishedAt={post.published_at || post.created_at} thumbnailUrl={post.thumbnail_url} />
                  </motion.div>
                ))}
          </div>

          {!loading && recentPosts.length > 0 && (
            <div className="mt-10 flex justify-center">
              <Link
                to="/posts"
                className="group inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--gradient-primary)" }}
              >
                View All Articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </section>

        {/* ───── Explore Topics ───── */}
        {visibleTopics.length > 0 && (
          <section className="border-t border-border/40 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ background: "radial-gradient(ellipse at 30% 20%, hsl(var(--primary)), transparent 70%), radial-gradient(ellipse at 70% 80%, hsl(var(--accent)), transparent 70%)" }} />

            <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
              <div className="mb-12 flex flex-col items-center text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Browse by Topic</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                  Explore <span className="gradient-text">Topics</span>
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                  Curated collections organized by technology and subject.
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TopicCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {visibleTopics.slice(0, 8).map((cat, i) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Link
                        to={`/posts?category=${encodeURIComponent(cat.slug)}`}
                        className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 text-center transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.2)]"
                      >
                        {/* Hover glow */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.08), transparent 70%)" }}
                        />
                        {/* Icon */}
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-xl text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10 group-hover:shadow-[0_0_24px_hsl(var(--primary)/0.2)]">
                          <i className={getTopicIcon(cat.name)}></i>
                        </div>
                        {/* Label */}
                        <div className="relative">
                          <h3 className="font-display text-sm font-bold text-foreground transition-colors group-hover:text-primary sm:text-base">
                            {cat.name}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {cat.postCount} {cat.postCount === 1 ? "article" : "articles"}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-10 flex justify-center">
                <Link
                  to="/posts"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-7 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                >
                  <Hash className="h-4 w-4 text-primary" />
                  View All Categories
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary">
                    {categories.filter(c => c.postCount > 0).length}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ───── Recent Projects ───── */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
            <div className="mb-10">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1.5">
                <Layers className="h-3.5 w-3.5 text-accent" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">Showcase</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                Recent <span className="gradient-text">Projects</span>
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">Featured projects, demos, and real-world implementations.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
                : recentProjects.map((post, i) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                      <ProjectCard {...post} publishedAt={post.published_at || post.created_at} thumbnailUrl={post.thumbnail_url} />
                    </motion.div>
                  ))}
            </div>

            {!loading && recentProjects.length > 0 && (
              <div className="mt-10 flex justify-center">
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  View All Projects <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ───── Let's Connect ───── */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="mb-3 font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                  Let's <span className="gradient-text">Connect</span>
                </h2>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                  Follow along for tutorials, insights, and behind-the-scenes updates.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { icon: "fa-brands fa-instagram", label: "Instagram", handle: "@inkwell", href: "#", gradient: "linear-gradient(135deg, hsl(330, 80%, 55%), hsl(280, 70%, 55%), hsl(30, 90%, 55%))" },
                  { icon: "fa-brands fa-telegram", label: "Telegram", handle: "Join Channel", href: "#", gradient: "linear-gradient(135deg, hsl(200, 75%, 50%), hsl(210, 80%, 60%))" },
                  { icon: "fa-brands fa-github", label: "GitHub", handle: "Star & Fork", href: "#", gradient: "linear-gradient(135deg, hsl(220, 15%, 25%), hsl(220, 20%, 40%))" },
                  { icon: "fa-brands fa-youtube", label: "YouTube", handle: "Subscribe", href: "#", gradient: "linear-gradient(135deg, hsl(0, 80%, 50%), hsl(350, 85%, 45%))" },
                ].map((s, i) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.07]" style={{ background: s.gradient }} />
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110" style={{ background: s.gradient }}>
                      <i className={`${s.icon} text-lg`}></i>
                    </div>
                    <div className="text-center">
                      <p className="font-display text-sm font-bold text-foreground">{s.label}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{s.handle}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}

/* ── Terminal Search Component ── */
function TerminalSearch({ query, setQuery, onSubmit }: { query: string; setQuery: (v: string) => void; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div className="rounded-2xl border border-border bg-[hsl(225,35%,8%)] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <span className="font-mono text-xs text-white/40">search.sh</span>
      </div>
      <form onSubmit={onSubmit} className="p-5 sm:p-6 font-mono text-sm leading-relaxed">
        <p className="text-green-400 text-left">→ ~ search</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-green-400 shrink-0">$</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            className="flex-1 bg-transparent text-white/70 placeholder:text-white/30 outline-none caret-green-400 text-left"
          />
        </div>
        <p className="mt-3 text-white/30 text-left">
          Press{" "}
          <button
            type="submit"
            className="inline rounded border border-white/20 px-2 py-0.5 text-xs text-white/60 transition-colors hover:border-white/40 hover:text-white/80"
          >
            Enter
          </button>
          {" "}to search
        </p>
      </form>
    </div>
  );
}
