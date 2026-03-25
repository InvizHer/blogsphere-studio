import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Download } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { SEOHead } from "@/components/SEOHead";

interface AppItem {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  description: string | null;
  download_url: string | null;
  view_count: number;
}

export default function AppStore() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchApps = async () => {
      const { data } = await supabase
        .from("apps")
        .select("id, name, slug, icon_url, description, download_url, view_count")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      setApps(data || []);
      setLoading(false);
    };
    fetchApps();
  }, []);

  const filtered = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      (app.description || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <SEOHead
        title="App Store - Download Best Apps"
        description="Discover and download the best apps curated for you. Free downloads with detailed previews and reviews."
        canonicalUrl="/app"
      />
      <PublicHeader />
      <main className="min-h-screen pt-14 md:pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          </div>
          <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h1 className="font-display text-3xl font-bold text-white md:text-5xl">
                App Store
              </h1>
              <p className="mt-4 text-base text-white/70 md:text-lg">
                Discover and download the best apps curated just for you
              </p>
              <div className="relative mx-auto mt-8 max-w-md">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search apps..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 pl-5 pr-12 text-sm text-white outline-none placeholder:text-white/50 backdrop-blur-sm focus:border-white/30 focus:ring-2 focus:ring-white/10"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                  <Search className="h-4 w-4 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Apps Grid */}
        <section className="mx-auto max-w-7xl px-5 py-10 md:py-16">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 rounded bg-muted" />
                      <div className="h-3 w-1/3 rounded bg-muted" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-3/4 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <i className="fa-solid fa-box-open mb-4 text-4xl text-muted-foreground/20"></i>
              <p className="text-muted-foreground">
                {query ? "No apps match your search." : "No apps available yet."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/app/${app.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/20 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
                  >
                    <div className="flex items-center gap-4">
                      {app.icon_url ? (
                        <img
                          src={app.icon_url}
                          alt={app.name}
                          className="h-16 w-16 rounded-2xl object-cover border border-border transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                          <i className="fa-solid fa-cube text-xl text-primary"></i>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
                          {app.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {app.view_count}</span>
                          {app.download_url && <span className="flex items-center gap-1"><Download className="h-3 w-3" /> Free</span>}
                        </div>
                      </div>
                    </div>
                    {app.description && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {app.description}
                      </p>
                    )}
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        View Details →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
