import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { SEOHead } from "@/components/SEOHead";

const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <>
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist." noindex />
      <PublicHeader />

      <main className="pt-16">
        <section className="relative flex min-h-[calc(100vh-4rem-200px)] items-center justify-center overflow-hidden">
          {/* Animated background blobs */}
          <motion.div
            className="pointer-events-none absolute h-[500px] w-[500px] rounded-full opacity-[0.06]"
            style={{ background: "hsl(var(--primary))", filter: "blur(120px)" }}
            animate={{ x: mousePos.x * 2, y: mousePos.y * 2 }}
            transition={{ type: "spring", damping: 30, stiffness: 80 }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-[0.04]"
            style={{ background: "hsl(var(--accent))", filter: "blur(100px)" }}
            animate={{ x: mousePos.x * -1.5, y: mousePos.y * -1.5 }}
            transition={{ type: "spring", damping: 30, stiffness: 80 }}
          />

          <div className="relative mx-auto max-w-2xl px-5 py-16 text-center sm:px-8 sm:py-24">
            {/* Glitch-style 404 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6"
            >
              <div className="relative inline-block">
                <h1 className="font-display text-[8rem] font-black leading-none tracking-tighter sm:text-[12rem]">
                  <span className="gradient-text">4</span>
                  <motion.span
                    className="relative inline-block"
                    animate={{ rotate: [0, 5, -5, 3, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                  >
                    <span className="gradient-text">0</span>
                  </motion.span>
                  <span className="gradient-text">4</span>
                </h1>
                {/* Decorative line */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 h-1 -translate-x-1/2 rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                Oops! Lost in the void
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                The page you're looking for doesn't exist or may have been moved to another dimension.
              </p>
            </motion.div>

            {/* Terminal-style error */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mx-auto mt-8 max-w-md overflow-hidden rounded-xl border border-border bg-[hsl(225,35%,8%)]"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-2 font-mono text-[11px] text-white/30">error.log</span>
              </div>
              <div className="p-4 font-mono text-xs leading-relaxed text-left">
                <p className="text-red-400">Error: PAGE_NOT_FOUND</p>
                <p className="mt-1 text-white/40">→ The requested route could not be resolved.</p>
                <p className="mt-1 text-green-400">Suggestion: Navigate to a valid page ↓</p>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <Link
                to="/"
                className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Home className="h-4 w-4" /> Back to Home
              </Link>
              <Link
                to="/posts"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                <Search className="h-4 w-4" /> Browse Articles
              </Link>
            </motion.div>

            {/* Go back */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="mt-5"
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
