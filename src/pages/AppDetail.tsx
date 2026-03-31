import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Share2, Check, ExternalLink, ArrowLeft, Clock, Shield, ChevronLeft, ChevronRight, Calendar, RefreshCw, Info, X } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

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
    { icon: "fa-brands fa-x-twitter", label: "X", href: `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(app?.name || "")}` },
    { icon: "fa-solid fa-link", label: "Copy", onClick: copyLink },
  ];

  const progressPercent = downloadStarted ? ((DOWNLOAD_TIMER - countdown) / DOWNLOAD_TIMER) * 100 : 0;
  const previewCount = app?.preview_images.length || 0;
  const publishedDate = app ? new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
  const updatedDate = app ? new Date(app.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  const scrollToImage = (index: number) => {
    setCurrentPreview(index);
    const container = scrollRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-screen pt-14 md:pt-16 bg-background">
          <div className="mx-auto max-w-5xl px-5 py-6 md:py-10 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-40 rounded-lg bg-muted" />
                <div className="h-4 w-28 rounded bg-muted" />
              </div>
            </div>
            {/* Screenshots skeleton */}
            <div className="flex gap-3 overflow-hidden mb-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="shrink-0 w-[120px] md:w-[160px] aspect-[9/16] rounded-2xl bg-muted" />
              ))}
            </div>
            {/* Download skeleton */}
            <div className="h-14 w-full rounded-2xl bg-muted mb-4" />
            {/* Info skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-muted" />)}
            </div>
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-36 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-4/5 rounded bg-muted" />
              <div className="h-3 w-2/3 rounded bg-muted" />
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

  return (
    <>
      <SEOHead
        title={`${app.name} - Download Free`}
        description={app.description || `Download ${app.name} for free.`}
        canonicalUrl={`/app/${app.slug}`}
      />
      <PublicHeader />
      <main className="min-h-screen pt-14 md:pt-16 bg-background">
        <div className="mx-auto max-w-5xl px-5 py-5 md:py-10">

          {/* ── App Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6 md:mb-8"
          >
            {app.icon_url ? (
              <img
                src={app.icon_url}
                alt={app.name}
                className="h-16 w-16 md:h-24 md:w-24 rounded-[18px] md:rounded-[22px] object-cover border border-border shadow-lg shrink-0"
              />
            ) : (
              <div className="flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-[18px] md:rounded-[22px] bg-primary/10 border border-border shadow-lg shrink-0">
                <i className="fa-solid fa-cube text-xl md:text-3xl text-primary"></i>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-lg md:text-2xl font-bold text-foreground leading-tight">{app.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {app.version && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    v{app.version}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {app.download_count.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-500" />
                  Verified
                </span>
              </div>
              {/* Share icons - desktop */}
              <div className="hidden md:flex items-center gap-1.5 mt-2.5">
                {sharePlatforms.map((p) =>
                  p.onClick ? (
                    <button
                      key={p.label}
                      onClick={p.onClick}
                      aria-label={p.label}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/20 text-[11px]"
                    >
                      {copied && p.label === "Copy" ? <Check className="h-3 w-3" /> : <i className={p.icon}></i>}
                    </button>
                  ) : (
                    <a
                      key={p.label}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.label}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/20 text-[11px]"
                    >
                      <i className={p.icon}></i>
                    </a>
                  )
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Screenshots Carousel ── */}
          {previewCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-6 md:mb-8"
            >
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0"
              >
                {app.preview_images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentPreview(i); setLightboxOpen(true); }}
                    className={`shrink-0 snap-start overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                      currentPreview === i
                        ? "border-primary shadow-lg scale-[1.02]"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${app.name} screenshot ${i + 1}`}
                      className="w-[120px] md:w-[160px] aspect-[9/16] object-cover bg-muted/20"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
              {/* Dots */}
              {previewCount > 1 && (
                <div className="flex justify-center gap-1.5 mt-2">
                  {app.preview_images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToImage(i)}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        currentPreview === i ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Download Button ── */}
          {app.download_url && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 md:mb-8"
            >
              {!downloadStarted ? (
                <button
                  onClick={startDownload}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.99]"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Download className="h-5 w-5" />
                  Download {app.name}
                </button>
              ) : !downloadReady ? (
                <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary animate-pulse" />
                      Preparing your download...
                    </span>
                    <span className="font-mono text-lg font-bold text-primary">{countdown}s</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="mt-2 text-[11px] text-muted-foreground text-center">
                    Please wait while we verify the file
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleFinalDownload}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.99]"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Download className="h-5 w-5 animate-bounce" />
                  Click to Download Now
                </button>
              )}
            </motion.div>
          )}

          {/* ── Info Cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mb-6 md:mb-8"
          >
            {[
              { icon: Download, label: "Downloads", value: app.download_count.toLocaleString(), color: "text-primary" },
              { icon: Calendar, label: "Published", value: publishedDate, color: "text-blue-500" },
              { icon: RefreshCw, label: "Updated", value: updatedDate, color: "text-emerald-500" },
              { icon: Info, label: "Version", value: app.version ? `v${app.version}` : "1.0", color: "text-amber-500" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card p-3 md:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                  <span className="text-[11px] text-muted-foreground">{item.label}</span>
                </div>
                <p className="text-sm font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </motion.div>

          {/* ── About ── */}
          {app.description && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 md:mb-8"
            >
              <h2 className="font-display text-base md:text-lg font-bold text-foreground mb-3">About this app</h2>
              <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {app.description}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Share (Mobile) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="md:hidden mb-6"
          >
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                <Share2 className="h-3.5 w-3.5 text-primary" />
                Share this app
              </h3>
              <div className="flex items-center gap-2">
                {sharePlatforms.map((p) =>
                  p.onClick ? (
                    <button
                      key={p.label}
                      onClick={p.onClick}
                      aria-label={p.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      {copied && p.label === "Copy" ? <Check className="h-3.5 w-3.5" /> : <i className={`${p.icon} text-xs`}></i>}
                    </button>
                  ) : (
                    <a
                      key={p.label}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <i className={`${p.icon} text-xs`}></i>
                    </a>
                  )
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && previewCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.img
              key={currentPreview}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={app.preview_images[currentPreview]}
              alt={`${app.name} preview`}
              className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            {previewCount > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentPreview((p) => (p - 1 + previewCount) % previewCount); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentPreview((p) => (p + 1) % previewCount); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {/* Bottom dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {app.preview_images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCurrentPreview(i); }}
                      className={`h-2 rounded-full transition-all ${currentPreview === i ? "w-6 bg-white" : "w-2 bg-white/30"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <PublicFooter />
    </>
  );
}
