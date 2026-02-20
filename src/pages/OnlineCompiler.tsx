import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { SEOHead } from "@/components/SEOHead";
import { LANGUAGES } from "@/components/compiler/compiler-utils";

export default function OnlineCompiler() {
  return (
    <>
      <SEOHead
        title="Online Compiler"
        description="Write, compile and run code online in Python, JavaScript, C, C++, Java, HTML, CSS and SQL. Free online IDE with VS Code-like editor."
      />
      <PublicHeader />

      <main className="container px-4 py-8 pt-24 sm:px-6 md:py-12 md:pt-28">
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">
            <span className="gradient-text">Online Compiler</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Write, compile and run code online — free VS Code-like editor with instant output
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {LANGUAGES.map((lang, i) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to={`/online-compiler/${lang.id}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Gradient accent bar */}
                <div
                  className="absolute left-0 top-0 h-1 w-full transition-all duration-300 group-hover:h-1.5"
                  style={{ background: `linear-gradient(90deg, ${lang.color}, ${lang.color}88)` }}
                />

                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                    style={{ background: `${lang.color}15` }}
                  >
                    {lang.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      {lang.name}
                    </h3>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {lang.executionType === "piston"
                        ? "Compiled"
                        : lang.executionType === "browser"
                        ? "Live Preview"
                        : lang.executionType === "pyodide"
                        ? "Browser WASM"
                        : lang.executionType === "js-eval"
                        ? "Browser Runtime"
                        : "Query Engine"}
                    </span>
                  </div>
                </div>

                <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {lang.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors group-hover:text-primary/80">
                  Open Compiler
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>

                {/* Open in new tab */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(`/online-compiler/${lang.id}`, "_blank");
                  }}
                  className="absolute right-3 top-4 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="mb-4 font-display text-xl font-bold text-foreground">
              Features
            </h2>
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                "VS Code-like editor with syntax highlighting",
                "Auto-completion & code formatting",
                "Multi-file support with file explorer",
                "Dark / Light theme toggle",
                "Live preview for HTML & CSS",
                "SQL playground with table output",
                "Code saved locally (auto-save)",
                "Download your code files",
                "Keyboard shortcuts (Ctrl+Enter)",
                "Mobile-optimized responsive design",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
