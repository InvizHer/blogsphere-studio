import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Share2, Check, ExternalLink, ArrowLeft, Clock, Shield, ChevronLeft, ChevronRight, Calendar, RefreshCw } from "lucide-react";
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

const DOWNLOAD_TIMER = 10;

export default function AppDetail() {
  const { slug } = useParams();
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(0);
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

  const previewCount = app?.preview_images.length || 0;
  const publishedDate = app ? new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
  const updatedDate = app ? new Date(app.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  if (loading) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-screen pt-14 md:pt-16">
          <div className="border-b border-border bg-card">
            <div className="mx-auto max-w-7xl px-5 py-3">
              <div className="h-4 w-48 rounded bg-muted animate-pulse" />
            </div>
          </div>
          <div className="mx-auto max-w-2xl px-5 py-8">
            {/* Hero skeleton */}
            <div className="flex flex-col items-center text-center animate-pulse">
              <div className="h-24 w-24 rounded-3xl bg-muted" />
              <div className="mt-5 h-7 w-40 rounded bg-muted" />
              <div className="mt-3 h-5 w-32 rounded bg-muted" />
              <div className="mt-6 h-12 w-full max-w-xs rounded-2xl bg-muted" />
              <div className="mt-3 h-4 w-44 rounded bg-muted" />
            </div>
            {/* Preview skeleton */}
            <div className="mt-10 animate-pulse">
              <div className="h-5 w-40 rounded bg-muted mb-4" />
              <div className="flex gap-3 overflow-hidden">
                {[1, 2].map((i) => (
                  <div key={i} className="h-56 w-44 shrink-0 rounded-2xl bg-muted" />
                ))}
              </div>
            </div>
            {/* Info skeleton */}
            <div className="mt-8 grid grid-cols-2 gap-3 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 rounded-xl bg-muted" />
              ))}
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

        <div className="mx-auto max-w-2xl px-5 py-6 md:py-10">
          {/* ─── Hero: Centered App Card ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon */}
            {app.icon_url ? (
              <img
                src={app.icon_url}
                alt={app.name}
                className="h-24 w-24 md:h-28 md:w-28 rounded-3xl object-cover border border-border shadow-lg"
              />
            ) : (
              <div className="flex h-24 w-24 md:h-28 md:w-28 items-center justify-center rounded-3xl bg-primary/10 border border-border shadow-lg">
                <i className="fa-solid fa-cube text-3xl md:text-4xl text-primary"></i>
              </div>
            )}

            {/* Name */}
            <h1 className="mt-5 font-display text-2xl font-bold text-foreground md:text-3xl">{app.name}</h1>

            {/* Version & Downloads */}
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              {app.version && (
                <>
                  <span className="font-medium">v{app.version}</span>
                  <span className="text-border">•</span>
                </>
              )}
              <span>{app.download_count.toLocaleString()} downloads</span>
            </div>

            {/* Download Section */}
            {app.download_url && (
              <div className="mt-6 w-full max-w-sm">
                {!downloadStarted ? (
                  <button
                    onClick={startDownload}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98]"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Download className="h-4.5 w-4.5" />
                    Download Now
                  </button>
                ) : !downloadReady ? (
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm mb-2.5">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary animate-pulse" />
                        Preparing download...
                      </span>
                      <span className="font-mono font-bold text-primary">{countdown}s</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <p className="mt-2.5 text-xs text-muted-foreground text-center">
                      Verifying file & preparing secure link
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleFinalDownload}
                      className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98]"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <Download className="h-4.5 w-4.5" />
                      Click to Download
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Safe badge */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Safe & Verified</span>
              {app.version && (
                <>
                  <span>•</span>
                  <span>v{app.version}</span>
                </>
              )}
            </div>
          </motion.section>

          {/* ─── Preview Screenshots ─── */}
          {previewCount > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <i className="fa-solid fa-images text-primary text-base"></i>
                    Preview Screenshots
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{previewCount} screens</p>
                </div>
                {previewCount > 2 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPreview(Math.max(0, currentPreview - 1))}
                      disabled={currentPreview === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPreview(Math.min(previewCount - 1, currentPreview + 1))}
                      disabled={currentPreview === previewCount - 1}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Scrollable preview row */}
              <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-5 px-5">
                {app.preview_images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPreview(i)}
                    className={`shrink-0 snap-start overflow-hidden rounded-2xl border-2 transition-all ${
                      currentPreview === i ? "border-primary shadow-lg" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${app.name} screenshot ${i + 1}`}
                      className="h-56 w-[170px] object-cover bg-muted/30"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>

              {/* Dots indicator */}
              {previewCount > 1 && (
                <div className="flex justify-center gap-1.5 mt-3">
                  {app.preview_images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPreview(i)}
                      className={`h-2 rounded-full transition-all ${
                        currentPreview === i ? "w-5 bg-primary" : "w-2 bg-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Enlarged preview */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-sm">
                <img
                  src={app.preview_images[currentPreview]}
                  alt={`${app.name} preview`}
                  className="w-full max-h-[420px] md:max-h-[500px] object-contain"
                />
              </div>
            </motion.section>
          )}

          {/* ─── Info Cards ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 grid grid-cols-2 gap-3"
          >
            <div className="rounded-xl border border-border bg-card p-3.5 text-center">
              <Download className="mx-auto h-4 w-4 text-primary mb-1.5" />
              <p className="text-sm font-bold text-foreground">{app.download_count.toLocaleString()}</p>
              <p className="text-[11px] text-muted-foreground">Downloads</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3.5 text-center">
              <Calendar className="mx-auto h-4 w-4 text-primary mb-1.5" />
              <p className="text-sm font-bold text-foreground">{publishedDate}</p>
              <p className="text-[11px] text-muted-foreground">Published</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3.5 text-center">
              <RefreshCw className="mx-auto h-4 w-4 text-primary mb-1.5" />
              <p className="text-sm font-bold text-foreground">{updatedDate}</p>
              <p className="text-[11px] text-muted-foreground">Updated</p>
            </div>
            {app.version && (
              <div className="rounded-xl border border-border bg-card p-3.5 text-center">
                <Shield className="mx-auto h-4 w-4 text-primary mb-1.5" />
                <p className="text-sm font-bold text-foreground">v{app.version}</p>
                <p className="text-[11px] text-muted-foreground">Version</p>
              </div>
            )}
          </motion.section>

          {/* ─── Description ─── */}
          {app.description && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <h2 className="mb-3 font-display text-base font-bold text-foreground">About this app</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                {app.description}
              </div>
            </motion.section>
          )}

          {/* ─── Share ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm"
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
          </motion.section>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
