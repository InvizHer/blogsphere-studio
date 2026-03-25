import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, Calendar, Download, Share2, Check, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";

interface AppData {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  description: string | null;
  download_url: string | null;
  preview_images: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
}

export default function AppDetail() {
  const { slug } = useParams();
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(0);

  useEffect(() => {
    const fetchApp = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("apps")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (data) {
        setApp({
          ...data,
          preview_images: (data.preview_images as string[]) || [],
        });
        // Increment views
        supabase.rpc("increment_app_views", { p_app_id: data.id });
      }
      setLoading(false);
    };
    fetchApp();
  }, [slug]);

  const shareUrl = `${window.location.origin}/app/${slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${app?.name}\n${shareUrl}`);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const sharePlatforms = [
    { icon: "fa-brands fa-whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent((app?.name || "") + " " + shareUrl)}`, accent: "hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/30" },
    { icon: "fa-brands fa-telegram", label: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(app?.name || "")}`, accent: "hover:bg-blue-400/10 hover:text-blue-500 hover:border-blue-400/30" },
    { icon: "fa-brands fa-linkedin-in", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, accent: "hover:bg-blue-600/10 hover:text-blue-700 hover:border-blue-600/30" },
    { icon: "fa-solid fa-envelope", label: "Email", href: `mailto:?subject=${encodeURIComponent(app?.name || "")}&body=${encodeURIComponent(shareUrl)}`, accent: "hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/30" },
  ];

  if (loading) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-screen pt-14 md:pt-16">
          <div className="mx-auto max-w-4xl px-5 py-10">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-5">
                <div className="h-20 w-20 rounded-2xl bg-muted" />
                <div className="space-y-3 flex-1">
                  <div className="h-6 w-1/3 rounded bg-muted" />
                  <div className="h-4 w-1/4 rounded bg-muted" />
                </div>
              </div>
              <div className="h-64 rounded-2xl bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </>
    );
  }

  if (!app) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-screen pt-14 md:pt-16">
          <div className="flex flex-col items-center justify-center py-32 text-center px-5">
            <i className="fa-solid fa-box-open mb-4 text-5xl text-muted-foreground/20"></i>
            <h1 className="font-display text-2xl font-bold text-foreground">App Not Found</h1>
            <p className="mt-2 text-muted-foreground">The app you're looking for doesn't exist or has been removed.</p>
            <Link to="/app" className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <ArrowLeft className="h-4 w-4" /> Back to App Store
            </Link>
          </div>
        </main>
        <PublicFooter />
      </>
    );
  }

  const previewCount = app.preview_images.length;

  return (
    <>
      <SEOHead
        title={`${app.name} - Download Free`}
        description={app.description || `Download ${app.name} for free. Get the latest version with all features.`}
        canonicalUrl={`/app/${app.slug}`}
      />
      <PublicHeader />
      <main className="min-h-screen pt-14 md:pt-16">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link to="/app" className="hover:text-foreground">App Store</Link>
              <span>/</span>
              <span className="text-foreground font-medium line-clamp-1">{app.name}</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* App Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-start gap-5"
              >
                {app.icon_url ? (
                  <img src={app.icon_url} alt={app.name} className="h-24 w-24 rounded-3xl object-cover border border-border shadow-[var(--shadow-card)]" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 border border-border">
                    <i className="fa-solid fa-cube text-3xl text-primary"></i>
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{app.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" /> {app.view_count.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  {app.download_url && (
                    <a
                      href={app.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <Download className="h-4 w-4" /> Download Now
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Preview Images */}
              {previewCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
                >
                  <h2 className="mb-4 font-display text-lg font-bold text-foreground">Screenshots</h2>
                  <div className="relative">
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src={app.preview_images[currentPreview]}
                        alt={`${app.name} screenshot ${currentPreview + 1}`}
                        className="w-full rounded-xl object-cover"
                      />
                    </div>
                    {previewCount > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentPreview((prev) => (prev === 0 ? previewCount - 1 : prev - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-sm hover:bg-background"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setCurrentPreview((prev) => (prev === previewCount - 1 ? 0 : prev + 1))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-sm hover:bg-background"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                  {previewCount > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {app.preview_images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPreview(i)}
                          className={`shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                            currentPreview === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={img} alt={`Thumb ${i + 1}`} className="h-14 w-20 object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Description */}
              {app.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
                >
                  <h2 className="mb-3 font-display text-lg font-bold text-foreground">About this app</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                    {app.description}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Download card */}
              {app.download_url && (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                  <h3 className="mb-3 font-display text-sm font-bold text-foreground">Download</h3>
                  <a
                    href={app.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Download className="h-4 w-4" /> Download Free
                  </a>
                </div>
              )}

              {/* Share */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                    <Share2 className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground">Share this app</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sharePlatforms.map((p) => (
                    <a
                      key={p.label}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Share on ${p.label}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all duration-200 ${p.accent}`}
                    >
                      <i className={`${p.icon} text-sm`}></i>
                    </a>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate text-xs text-muted-foreground">{shareUrl}</span>
                  <button onClick={copyLink} className="shrink-0 text-xs font-medium text-primary hover:text-primary/80">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* App Info */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="mb-3 font-display text-sm font-bold text-foreground">App Info</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Views</dt>
                    <dd className="font-medium text-foreground">{app.view_count.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Added</dt>
                    <dd className="font-medium text-foreground">{new Date(app.created_at).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Updated</dt>
                    <dd className="font-medium text-foreground">{new Date(app.updated_at).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Screenshots</dt>
                    <dd className="font-medium text-foreground">{previewCount}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
