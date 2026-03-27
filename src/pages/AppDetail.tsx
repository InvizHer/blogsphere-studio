import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Download, Share2, Check, ExternalLink, ArrowLeft, Clock, Shield, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { SEOHead } from "@/components/SEOHead";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface AppData {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  description: string | null;
  download_url: string | null;
  preview_images: string[];
  download_count: number;
  version: string | null;
  created_at: string;
  updated_at: string;
}

const DOWNLOAD_TIMER = 10; // seconds

export default function AppDetail() {
  const { slug } = useParams();
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(0);

  // Download timer state
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [countdown, setCountdown] = useState(DOWNLOAD_TIMER);
  const [downloadReady, setDownloadReady] = useState(false);

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
          download_count: (data as any).download_count ?? 0,
          version: (data as any).version ?? null,
        });
        supabase.rpc("increment_app_views", { p_app_id: data.id });
      }
      setLoading(false);
    };
    fetchApp();
  }, [slug]);

  // Countdown timer
  useEffect(() => {
    if (!downloadStarted || downloadReady) return;
    if (countdown <= 0) {
      setDownloadReady(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [downloadStarted, countdown, downloadReady]);

  const startDownload = () => {
    setDownloadStarted(true);
    setCountdown(DOWNLOAD_TIMER);
    setDownloadReady(false);
  };

  const handleFinalDownload = useCallback(async () => {
    if (!app?.download_url || !app?.id) return;
    // Increment download count
    await supabase.rpc("increment_app_downloads", { p_app_id: app.id });
    setApp((prev) => prev ? { ...prev, download_count: prev.download_count + 1 } : prev);
    window.open(app.download_url, "_blank", "noopener,noreferrer");
  }, [app]);

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

  const progressPercent = downloadStarted ? ((DOWNLOAD_TIMER - countdown) / DOWNLOAD_TIMER) * 100 : 0;

  if (loading) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-screen pt-14 md:pt-16">
          <div className="mx-auto max-w-4xl px-5 py-10">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-5">
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-muted" />
                <div className="space-y-3 flex-1">
                  <div className="h-6 w-1/3 rounded bg-muted" />
                  <div className="h-4 w-1/4 rounded bg-muted" />
                </div>
              </div>
              <div className="h-12 w-full rounded-2xl bg-muted" />
              <div className="flex gap-3 overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 w-28 shrink-0 rounded-xl bg-muted" />
                ))}
              </div>
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
  const publishedDate = new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const updatedDate = new Date(app.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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

        <div className="mx-auto max-w-4xl px-5 py-6 md:py-10">
          {/* App Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start gap-4">
              {app.icon_url ? (
                <img src={app.icon_url} alt={app.name} className="h-[72px] w-[72px] md:h-20 md:w-20 rounded-2xl object-cover border border-border shadow-sm shrink-0" />
              ) : (
                <div className="flex h-[72px] w-[72px] md:h-20 md:w-20 items-center justify-center rounded-2xl bg-primary/10 border border-border shrink-0">
                  <i className="fa-solid fa-cube text-2xl md:text-3xl text-primary"></i>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-xl font-bold text-foreground md:text-2xl leading-tight">{app.name}</h1>
                {app.version && (
                  <span className="mt-1 inline-block rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    v{app.version}
                  </span>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" /> {app.download_count.toLocaleString()} downloads
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {publishedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Download Section */}
            {app.download_url && (
              <div className="mt-5">
                {!downloadStarted ? (
                  <button
                    onClick={startDownload}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Download className="h-4 w-4" /> Download Now — Free
                  </button>
                ) : !downloadReady ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary animate-pulse" />
                        Preparing your download...
                      </span>
                      <span className="font-mono font-bold text-primary">{countdown}s</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Please wait while we verify the file and prepare your secure download link.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Download ready! File verified & safe.</span>
                    </div>
                    <button
                      onClick={handleFinalDownload}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 animate-pulse"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <Download className="h-4 w-4" /> Click to Download
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Preview Screenshots - Horizontal scroll */}
          {previewCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6"
            >
              <h2 className="mb-3 font-display text-base font-bold text-foreground">Screenshots</h2>
              <div className="relative">
                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
                  {app.preview_images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPreview(i)}
                      className={`shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-all ${
                        currentPreview === i ? "border-primary shadow-md" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${app.name} screenshot ${i + 1}`}
                        className="h-52 w-32 md:h-64 md:w-40 object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
              {/* Enlarged preview */}
              <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
                <img
                  src={app.preview_images[currentPreview]}
                  alt={`${app.name} preview`}
                  className="w-full max-h-[400px] md:max-h-[500px] object-contain bg-muted/30"
                />
              </div>
            </motion.div>
          )}

          {/* App Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <div className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
              <Download className="mx-auto h-4 w-4 text-primary mb-1" />
              <p className="text-sm font-bold text-foreground">{app.download_count.toLocaleString()}</p>
              <p className="text-[11px] text-muted-foreground">Downloads</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
              <Calendar className="mx-auto h-4 w-4 text-primary mb-1" />
              <p className="text-sm font-bold text-foreground">{publishedDate}</p>
              <p className="text-[11px] text-muted-foreground">Published</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
              <RefreshCw className="mx-auto h-4 w-4 text-primary mb-1" />
              <p className="text-sm font-bold text-foreground">{updatedDate}</p>
              <p className="text-[11px] text-muted-foreground">Updated</p>
            </div>
            {app.version && (
              <div className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
                <Shield className="mx-auto h-4 w-4 text-primary mb-1" />
                <p className="text-sm font-bold text-foreground">v{app.version}</p>
                <p className="text-[11px] text-muted-foreground">Version</p>
              </div>
            )}
          </motion.div>

          {/* Description */}
          {app.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
            >
              <h2 className="mb-3 font-display text-base font-bold text-foreground">About this app</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                {app.description}
              </div>
            </motion.div>
          )}

          {/* Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
          >
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
          </motion.div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
