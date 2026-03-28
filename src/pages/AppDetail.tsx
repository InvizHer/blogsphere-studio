import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Share2, Check, ExternalLink, ArrowLeft, Clock, Shield, ChevronLeft, ChevronRight, Calendar, RefreshCw, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
    { icon: "fa-brands fa-whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent((app?.name || "") + " " + shareUrl)}` },
    { icon: "fa-brands fa-telegram", label: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(app?.name || "")}` },
    { icon: "fa-brands fa-linkedin-in", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { icon: "fa-solid fa-envelope", label: "Email", href: `mailto:?subject=${encodeURIComponent(app?.name || "")}&body=${encodeURIComponent(shareUrl)}` },
  ];

  const progressPercent = downloadStarted ? ((DOWNLOAD_TIMER - countdown) / DOWNLOAD_TIMER) * 100 : 0;
  const previewCount = app?.preview_images.length || 0;
  const publishedDate = app ? new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
  const updatedDate = app ? new Date(app.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  // ── Loading skeleton ──
  if (loading) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-screen pt-14 md:pt-16 bg-background">
          <div className="border-b border-border bg-card">
            <div className="mx-auto max-w-7xl px-5 py-3">
              <div className="h-4 w-48 rounded bg-muted animate-pulse" />
            </div>
          </div>
          <div className="mx-auto max-w-5xl px-5 py-8">
            {/* Desktop skeleton */}
            <div className="hidden md:flex gap-8 animate-pulse">
              <div className="w-72 shrink-0 space-y-4">
                <div className="h-72 w-72 rounded-3xl bg-muted" />
                <div className="h-12 w-full rounded-2xl bg-muted" />
                <div className="h-20 w-full rounded-xl bg-muted" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-8 w-64 rounded bg-muted" />
                <div className="h-4 w-40 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-48 w-full rounded-2xl bg-muted mt-6" />
              </div>
            </div>
            {/* Mobile skeleton */}
            <div className="md:hidden animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-32 rounded bg-muted" />
                  <div className="h-4 w-24 rounded bg-muted" />
                </div>
              </div>
              <div className="h-12 w-full rounded-2xl bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="flex gap-3 mt-4">
                <div className="h-44 w-32 rounded-xl bg-muted shrink-0" />
                <div className="h-44 w-32 rounded-xl bg-muted shrink-0" />
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </>
    );
  }

  // ── Not found ──
  if (!app) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-screen pt-14 md:pt-16">
          <div className="flex flex-col items-center justify-center py-32 text-center px-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
              <i className="fa-solid fa-box-open text-2xl text-muted-foreground/30"></i>
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">App Not Found</h1>
            <p className="mt-2 text-sm text-muted-foreground">This app doesn't exist or has been removed.</p>
            <Link to="/app" className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <ArrowLeft className="h-4 w-4" /> Back to Apps
            </Link>
          </div>
        </main>
        <PublicFooter />
      </>
    );
  }

  // ── Download button component ──
  const DownloadButton = () => {
    if (!app.download_url) return null;

    if (!downloadStarted) {
      return (
        <button
          onClick={startDownload}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Download className="h-4 w-4" />
          Download Now
        </button>
      );
    }

    if (!downloadReady) {
      return (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary animate-pulse" />
              Preparing...
            </span>
            <span className="font-mono font-bold text-primary">{countdown}s</span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      );
    }

    return (
      <button
        onClick={handleFinalDownload}
        className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98] animate-pulse"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Download className="h-4 w-4" />
        Click to Download
      </button>
    );
  };

  // ── Info pills ──
  const InfoGrid = ({ compact = false }: { compact?: boolean }) => (
    <div className={`grid ${compact ? "grid-cols-2 gap-2" : "grid-cols-4 gap-3"}`}>
      {[
        { icon: Download, label: "Downloads", value: app.download_count.toLocaleString() },
        { icon: Calendar, label: "Published", value: publishedDate },
        { icon: RefreshCw, label: "Updated", value: updatedDate },
        { icon: Shield, label: "Version", value: app.version ? `v${app.version}` : "1.0" },
      ].map((item) => (
        <div key={item.label} className="rounded-xl border border-border bg-card p-3 text-center">
          <item.icon className="mx-auto h-3.5 w-3.5 text-primary mb-1" />
          <p className="text-xs font-bold text-foreground">{item.value}</p>
          <p className="text-[10px] text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );

  // ── Share section ──
  const ShareSection = () => (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
        <Share2 className="h-3.5 w-3.5 text-primary" />
        Share
      </h3>
      <div className="flex items-center gap-2">
        {sharePlatforms.map((p) => (
          <a
            key={p.label}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${p.label}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/20"
          >
            <i className={`${p.icon} text-xs`}></i>
          </a>
        ))}
        <button
          onClick={copyLink}
          className="ml-auto flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          {copied ? <Check className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );

  // ── Preview screenshots ──
  const PreviewSection = () => {
    if (previewCount === 0) return null;

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Screenshots</h2>
          {previewCount > 1 && (
            <span className="text-[11px] text-muted-foreground">
              {currentPreview + 1} / {previewCount}
            </span>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0">
          {app.preview_images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentPreview(i)}
              className={`shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-all ${
                currentPreview === i
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-border"
              }`}
            >
              <img
                src={img}
                alt={`${app.name} screenshot ${i + 1}`}
                className="h-[120px] w-[80px] md:h-[140px] md:w-[100px] object-cover bg-muted/30"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {/* Main preview */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="mt-3 w-full overflow-hidden rounded-2xl border border-border bg-muted/10 cursor-zoom-in"
        >
          <img
            src={app.preview_images[currentPreview]}
            alt={`${app.name} preview`}
            className="w-full max-h-[350px] md:max-h-[450px] object-contain"
          />
        </button>

        {/* Dots */}
        {previewCount > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {app.preview_images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPreview(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentPreview === i ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <SEOHead
        title={`${app.name} - Download Free`}
        description={app.description || `Download ${app.name} for free.`}
        canonicalUrl={`/app/${app.slug}`}
      />
      <PublicHeader />
      <main className="min-h-screen pt-14 md:pt-16 bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-2.5">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/app" className="hover:text-foreground transition-colors">Apps</Link>
              <span>/</span>
              <span className="text-foreground font-medium line-clamp-1">{app.name}</span>
            </nav>
          </div>
        </div>

        {/* ═══════════ DESKTOP LAYOUT ═══════════ */}
        <div className="hidden md:block">
          <div className="mx-auto max-w-5xl px-5 py-8">
            <div className="flex gap-8">
              {/* Left sidebar */}
              <div className="w-64 shrink-0 space-y-4">
                {/* App icon */}
                <div className="flex flex-col items-center">
                  {app.icon_url ? (
                    <img
                      src={app.icon_url}
                      alt={app.name}
                      className="h-32 w-32 rounded-3xl object-cover border border-border shadow-lg"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-primary/10 border border-border shadow-lg">
                      <i className="fa-solid fa-cube text-4xl text-primary"></i>
                    </div>
                  )}
                </div>

                {/* Download */}
                <DownloadButton />

                {/* Safe badge */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Safe & Verified</span>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Download, label: "Downloads", value: app.download_count.toLocaleString() },
                    { icon: Shield, label: "Version", value: app.version ? `v${app.version}` : "1.0" },
                    { icon: Calendar, label: "Published", value: publishedDate },
                    { icon: RefreshCw, label: "Updated", value: updatedDate },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-border bg-card p-2.5 text-center">
                      <item.icon className="mx-auto h-3.5 w-3.5 text-primary mb-1" />
                      <p className="text-[11px] font-bold text-foreground leading-tight">{item.value}</p>
                      <p className="text-[9px] text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Share */}
                <ShareSection />
              </div>

              {/* Right content */}
              <div className="flex-1 min-w-0">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Title */}
                  <h1 className="font-display text-2xl font-bold text-foreground">{app.name}</h1>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                    {app.version && <span className="font-medium">Version {app.version}</span>}
                    <span>{app.download_count.toLocaleString()} downloads</span>
                  </div>

                  {/* Description */}
                  {app.description && (
                    <div className="mt-5 rounded-2xl border border-border bg-card p-5">
                      <h2 className="text-sm font-bold text-foreground mb-2">About this app</h2>
                      <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {app.description}
                      </div>
                    </div>
                  )}

                  {/* Screenshots */}
                  {previewCount > 0 && (
                    <div className="mt-5">
                      <PreviewSection />
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ MOBILE LAYOUT ═══════════ */}
        <div className="md:hidden">
          <div className="px-5 py-5 space-y-5">
            {/* App header */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4">
              {app.icon_url ? (
                <img
                  src={app.icon_url}
                  alt={app.name}
                  className="h-20 w-20 rounded-2xl object-cover border border-border shadow-md shrink-0"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-border shadow-md shrink-0">
                  <i className="fa-solid fa-cube text-2xl text-primary"></i>
                </div>
              )}
              <div className="min-w-0 pt-1">
                <h1 className="font-display text-lg font-bold text-foreground leading-tight">{app.name}</h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  {app.version && <span>v{app.version}</span>}
                  <span>•</span>
                  <span>{app.download_count.toLocaleString()} downloads</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Safe & Verified</span>
                </div>
              </div>
            </motion.div>

            {/* Download */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <DownloadButton />
            </motion.div>

            {/* Info grid */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <InfoGrid compact />
            </motion.div>

            {/* Description */}
            {app.description && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <h2 className="text-sm font-bold text-foreground mb-2">About this app</h2>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {app.description}
                </div>
              </motion.div>
            )}

            {/* Screenshots */}
            {previewCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PreviewSection />
              </motion.div>
            )}

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <ShareSection />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && previewCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-5"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={app.preview_images[currentPreview]}
              alt={`${app.name} preview`}
              className="max-h-[90vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              ✕
            </button>
            {previewCount > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentPreview((p) => (p - 1 + previewCount) % previewCount); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentPreview((p) => (p + 1) % previewCount); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <PublicFooter />
    </>
  );
}
