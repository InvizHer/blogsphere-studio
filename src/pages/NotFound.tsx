import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { SEOHead } from "@/components/SEOHead";

const NotFound = () => {
  return (
    <>
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist." noindex />
      <PublicHeader />

      <main className="pt-16">
        <section className="relative flex min-h-[calc(100vh-4rem-200px)] items-center justify-center overflow-hidden">
          {/* Ambient background */}
          <div
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full opacity-[0.06]"
            style={{ background: "var(--gradient-primary)", filter: "blur(140px)" }}
          />

          <div className="relative mx-auto max-w-xl px-5 py-16 text-center sm:px-8 sm:py-24">
            {/* Glitch-style 404 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative mb-6"
            >
              <h1 className="font-display text-[8rem] font-black leading-none tracking-tighter sm:text-[11rem]">
                <span className="gradient-text">4</span>
                <motion.span
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                  className="inline-block"
                >
                  <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-primary/20 sm:h-28 sm:w-28" style={{ background: "var(--gradient-subtle)" }}>
                    <span className="gradient-text text-[5rem] sm:text-[7rem] font-black leading-none">0</span>
                  </span>
                </motion.span>
                <span className="gradient-text">4</span>
              </h1>
            </motion.div>

            {/* Title & description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                Lost in the void
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                This page doesn't exist or has been moved to a new location.
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <Link
                to="/"
                className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Home className="h-4 w-4" /> Back to Home
              </Link>
              <Link
                to="/posts"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                <Search className="h-4 w-4" /> Browse Articles
              </Link>
            </motion.div>

            {/* Go back link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6"
            >
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Go back
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
};

export default NotFound;
