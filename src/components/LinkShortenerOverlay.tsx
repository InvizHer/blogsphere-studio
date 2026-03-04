import { useState, useEffect, useRef, createContext, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ArrowDown, ExternalLink, Timer, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LinkData {
  id: string;
  link_name: string;
  original_url: string;
  password: string | null;
}

/** Top section: timer + "scroll down" button */
export function LinkShortenerTop() {
  const ctx = useLinkShortenerContext();
  if (!ctx) return null;
  const { link, phase, timeLeft, handleContinue } = ctx;
  if (!link || (phase !== "timer" && phase !== "ready")) return null;

  const progress = ((15 - timeLeft) / 15) * 100;

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-4 pb-2">
      <AnimatePresence mode="wait">
        {phase === "timer" ? (
          <motion.div
            key="timer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-border bg-card p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Timer className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Preparing your link
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please wait while we get things ready
                  </p>
                </div>
              </div>
              <motion.span
                key={timeLeft}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-lg font-bold tabular-nums text-primary"
              >
                {timeLeft}s
              </motion.span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-primary/20 bg-card p-4 sm:p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {link.link_name} link is ready
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scroll down to access your link
                  </p>
                </div>
              </div>
              <Button
                onClick={handleContinue}
                size="sm"
                className="gap-1.5"
              >
                Continue
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Bottom section: password prompt + access button */
export function LinkShortenerBottom() {
  const ctx = useLinkShortenerContext();
  const { link, phase, passwordInput, setPasswordInput, passwordError, handlePassword } =
    ctx ?? { link: null, phase: "timer" as const, passwordInput: "", setPasswordInput: () => {}, passwordError: false, handlePassword: () => {} };
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === "password" || phase === "access") {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [phase]);

  if (!link || (phase !== "password" && phase !== "access")) return null;

  return (
    <div ref={bottomRef} className="mx-auto max-w-7xl px-5 sm:px-8 pb-10">
      <AnimatePresence mode="wait">
        {phase === "password" && (
          <motion.div
            key="password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Password required</p>
                <p className="text-xs text-muted-foreground">Enter the password to access this link</p>
              </div>
            </div>

            <div className="flex gap-2 max-w-sm">
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePassword()}
                placeholder="Enter password"
              />
              <Button onClick={handlePassword}>
                Submit
              </Button>
            </div>

            {passwordError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-destructive"
              >
                Incorrect password. Please try again.
              </motion.p>
            )}
          </motion.div>
        )}

        {phase === "access" && (
          <motion.div
            key="access"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-primary/20 bg-card p-5 sm:p-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ExternalLink className="h-5 w-5 text-primary" />
            </div>
            <p className="mb-1 text-sm font-semibold text-foreground">Your link is ready</p>
            <p className="mb-4 text-xs text-muted-foreground">
              Click below to open <span className="font-medium text-foreground">{link.link_name}</span>
            </p>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => window.open(link.original_url, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Open Link
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Context ──

interface LinkShortenerContextValue {
  link: LinkData | null;
  phase: "timer" | "ready" | "password" | "access";
  timeLeft: number;
  passwordInput: string;
  setPasswordInput: (v: string) => void;
  passwordError: boolean;
  handleContinue: () => void;
  handlePassword: () => void;
}

const LinkShortenerContext = createContext<LinkShortenerContextValue | null>(null);

function useLinkShortenerContext() {
  return useContext(LinkShortenerContext);
}

export function LinkShortenerProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [link, setLink] = useState<LinkData | null>(null);
  const [found, setFound] = useState(true);
  const [phase, setPhase] = useState<"timer" | "ready" | "password" | "access">("timer");
  const [timeLeft, setTimeLeft] = useState(15);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchLink = async () => {
      const { data } = await supabase
        .from("shortened_links")
        .select("id, link_name, original_url, password")
        .or(`alias.eq.${token},token.eq.${token}`)
        .maybeSingle();
      if (data) {
        setLink(data as LinkData);
      } else {
        setFound(false);
      }
    };
    fetchLink();
  }, [token]);

  useEffect(() => {
    if (!link || phase !== "timer") return;
    if (timeLeft <= 0) {
      setPhase("ready");
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [link, phase, timeLeft]);

  const handleContinue = async () => {
    try {
      await supabase.functions.invoke("increment-link-click", {
        body: { link_id: link!.id },
      });
    } catch {}
    if (link!.password) {
      setPhase("password");
    } else {
      setPhase("access");
    }
  };

  const handlePassword = () => {
    if (passwordInput === link!.password) {
      setPasswordError(false);
      setPhase("access");
    } else {
      setPasswordError(true);
    }
  };

  if (!token || !found || !link) {
    return <>{children}</>;
  }

  return (
    <LinkShortenerContext.Provider
      value={{ link, phase, timeLeft, passwordInput, setPasswordInput, passwordError, handleContinue, handlePassword }}
    >
      {children}
    </LinkShortenerContext.Provider>
  );
}
