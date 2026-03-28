import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Download, ArrowRight, Sparkles } from "lucide-react";
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
  download_count: number;
  version: string | null;
}

export default function AppStore() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchApps = async () => {
      const { data } = await supabase
        .from("apps")
        .select("id, name, slug, icon_url, description, download_url, download_count, version")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      setApps((data as any[]) || []);
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
        <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          </div>
          <div className="relative mx-auto max-w-7xl px-5 py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-xl text-center"
            >
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white/80" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white md:text-4xl">
                App Store
              </h1>
              <p className="mt-3 text-sm text-white/60 md:text-base">
                Discover and download premium apps curated for you
              </p>
              <div className="relative mx-auto mt-6 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search apps..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/10 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/40 backdrop-blur-sm focus:border-white/25 focus:bg-white/[0.12]"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Apps */}
        <section className="mx-auto max-w-7xl px-5 py-8 md:py-12">
          {loading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-28 rounded bg-muted" />
                      <div className="h-3 w-20 rounded bg-muted" />
                    </div>
                    <div className="h-8 w-16 rounded-lg bg-muted" />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-2/3 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <i className="fa-solid fa-box-open text-2xl text-muted-foreground/30"></i>
              </div>
              <p className="text-sm text-muted-foreground">
                {query ? "No apps match your search." : "No apps available yet."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={`/app/${app.slug}`}
                    className="group flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]"
                  >
                    {/* Icon */}
                    {app.icon_url ? (
                      <img
                        src={app.icon_url}
                        alt={app.name}
                        className="h-12 w-12 md:h-14 md:w-14 rounded-xl object-cover border border-border shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                        <i className="fa-solid fa-cube text-lg text-primary"></i>
                      </div>
                    )}

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 md:text-base">
                        {app.name}
                      </h3>
                      {app.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {app.description}
                        </p>
                      )}
                      <div className="mt-1.5 flex items-center gap-2.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {app.download_count.toLocaleString()}
                        </span>
                        {app.version && (
                          <>
                            <span className="text-border">•</span>
                            <span>v{app.version}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowRight className="h-3.5 w-3.5" />
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
