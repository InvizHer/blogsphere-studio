import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SEOHead } from "@/components/SEOHead";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60000; // 1 minute

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const attemptsRef = useRef(0);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Rate limiting check
    if (lockedUntil && Date.now() < lockedUntil) {
      const seconds = Math.ceil((lockedUntil - Date.now()) / 1000);
      setError(`Too many attempts. Try again in ${seconds}s.`);
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION);
        attemptsRef.current = 0;
        setError("Too many failed attempts. Locked for 60 seconds.");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } else {
      attemptsRef.current = 0;
      navigate("/inz");
    }
    setLoading(false);
  };

  return (
    <>
      <SEOHead title="Login" noindex />
      <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--gradient-hero)" }}>
        <div className="w-full max-w-sm rounded-2xl border border-border/10 bg-card p-6 shadow-[var(--shadow-elevated)] sm:p-8">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "var(--gradient-primary)" }}>
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-card-foreground">Secure Access</h1>
            <p className="mt-1 text-sm text-muted-foreground">Authenticate to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || (!!lockedUntil && Date.now() < lockedUntil)}
              className="h-11 w-full rounded-xl font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
