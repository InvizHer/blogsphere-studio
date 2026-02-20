import { Link } from "react-router-dom";
import {
  Play,
  Sun,
  Moon,
  Download,
  Minus,
  Plus,
  Home,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { LanguageConfig } from "./compiler-utils";
import { LANGUAGES } from "./compiler-utils";

interface CompilerHeaderProps {
  language: LanguageConfig;
  theme: "vs-dark" | "light";
  fontSize: number;
  isRunning: boolean;
  isFullscreen: boolean;
  showExplorer: boolean;
  onRun: () => void;
  onToggleTheme: () => void;
  onFontSizeChange: (size: number) => void;
  onDownload: () => void;
  onToggleFullscreen: () => void;
  onToggleExplorer: () => void;
}

export function CompilerHeader({
  language,
  theme,
  fontSize,
  isRunning,
  isFullscreen,
  showExplorer,
  onRun,
  onToggleTheme,
  onFontSizeChange,
  onDownload,
  onToggleFullscreen,
  onToggleExplorer,
}: CompilerHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-[hsl(222,30%,14%)] bg-[hsl(222,47%,8%)] px-3 py-1.5">
      <div className="flex items-center gap-2">
        <Link
          to="/online-compiler"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[hsl(220,20%,55%)] transition-colors hover:bg-[hsl(222,40%,13%)] hover:text-white"
          title="All compilers"
        >
          <Home className="h-4 w-4" />
        </Link>

        <button
          onClick={onToggleExplorer}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[hsl(220,20%,55%)] transition-colors hover:bg-[hsl(222,40%,13%)] hover:text-white"
          title={showExplorer ? "Hide explorer" : "Show explorer"}
        >
          {showExplorer ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>

        <div className="mx-1 h-5 w-px bg-[hsl(222,30%,18%)]" />

        <div className="flex items-center gap-1.5 rounded-lg bg-[hsl(222,40%,12%)] px-2.5 py-1">
          <span className="text-base">{language.icon}</span>
          <span className="text-sm font-medium text-white">{language.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Language switcher icons */}
        <div className="hidden items-center gap-0.5 rounded-lg bg-[hsl(222,40%,10%)] p-0.5 md:flex">
          {LANGUAGES.map((l) => (
            <Link
              key={l.id}
              to={`/online-compiler/${l.id}`}
              className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
                l.id === language.id
                  ? "bg-[hsl(217,91%,60%/0.2)] text-white"
                  : "text-[hsl(220,20%,45%)] hover:bg-[hsl(222,40%,14%)] hover:text-white"
              }`}
              title={l.name}
            >
              {l.icon}
            </Link>
          ))}
        </div>

        <div className="mx-1 hidden h-5 w-px bg-[hsl(222,30%,18%)] md:block" />

        {/* Font size */}
        <div className="hidden items-center gap-1 md:flex">
          <button
            onClick={() => onFontSizeChange(Math.max(10, fontSize - 1))}
            className="flex h-7 w-7 items-center justify-center rounded text-[hsl(220,20%,55%)] hover:bg-[hsl(222,40%,13%)] hover:text-white"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-[2rem] text-center text-xs text-[hsl(220,20%,55%)]">{fontSize}</span>
          <button
            onClick={() => onFontSizeChange(Math.min(24, fontSize + 1))}
            className="flex h-7 w-7 items-center justify-center rounded text-[hsl(220,20%,55%)] hover:bg-[hsl(222,40%,13%)] hover:text-white"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <button
          onClick={onToggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[hsl(220,20%,55%)] transition-colors hover:bg-[hsl(222,40%,13%)] hover:text-white"
          title="Toggle theme"
        >
          {theme === "vs-dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          onClick={onDownload}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[hsl(220,20%,55%)] transition-colors hover:bg-[hsl(222,40%,13%)] hover:text-white"
          title="Download file"
        >
          <Download className="h-4 w-4" />
        </button>

        <button
          onClick={onToggleFullscreen}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[hsl(220,20%,55%)] transition-colors hover:bg-[hsl(222,40%,13%)] hover:text-white"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="ml-1 flex h-8 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: "var(--gradient-primary)" }}
          title="Run (Ctrl+Enter)"
        >
          <Play className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Run</span>
        </button>
      </div>
    </div>
  );
}
