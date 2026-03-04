export interface ThemePreset {
  id: string;
  name: string;
  type: "gradient" | "solid";
  preview: string; // CSS gradient/color for the picker swatch
  vars: {
    "--primary": string;
    "--accent": string;
    "--ring": string;
    "--primary-dark": string;
    "--accent-dark": string;
    "--ring-dark": string;
    "--gradient-primary": string;
    "--gradient-hero": string;
    "--gradient-subtle": string;
    "--shadow-elevated": string;
    "--shadow-glow": string;
    "--sidebar-primary": string;
    "--sidebar-primary-dark": string;
    "--sidebar-accent-bg": string;
    "--sidebar-ring": string;
  };
}

export const themePresets: ThemePreset[] = [
  // ── Gradients ──
  {
    id: "blue-purple",
    name: "Blue → Purple",
    type: "gradient",
    preview: "linear-gradient(135deg, hsl(217,91%,60%), hsl(271,81%,56%))",
    vars: {
      "--primary": "217 91% 60%",
      "--accent": "271 81% 56%",
      "--ring": "217 91% 60%",
      "--primary-dark": "217 91% 65%",
      "--accent-dark": "271 81% 62%",
      "--ring-dark": "217 91% 65%",
      "--gradient-primary": "linear-gradient(135deg, hsl(217,91%,60%), hsl(271,81%,56%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(225,35%,6%) 0%, hsl(220,50%,14%) 40%, hsl(271,45%,20%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(217,91%,60%/0.05), hsl(271,81%,56%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(217 91% 60%/0.12), 0 8px 16px -8px hsl(225 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(217 91% 60%/0.15)",
      "--sidebar-primary": "217 91% 65%",
      "--sidebar-primary-dark": "217 91% 65%",
      "--sidebar-accent-bg": "225 30% 12%",
      "--sidebar-ring": "217 91% 60%",
    },
  },
  {
    id: "emerald-teal",
    name: "Emerald → Teal",
    type: "gradient",
    preview: "linear-gradient(135deg, hsl(152,76%,44%), hsl(180,70%,40%))",
    vars: {
      "--primary": "152 76% 44%",
      "--accent": "180 70% 40%",
      "--ring": "152 76% 44%",
      "--primary-dark": "152 76% 50%",
      "--accent-dark": "180 70% 48%",
      "--ring-dark": "152 76% 50%",
      "--gradient-primary": "linear-gradient(135deg, hsl(152,76%,44%), hsl(180,70%,40%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(160,35%,6%) 0%, hsl(155,50%,12%) 40%, hsl(180,45%,16%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(152,76%,44%/0.05), hsl(180,70%,40%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(152 76% 44%/0.12), 0 8px 16px -8px hsl(160 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(152 76% 44%/0.15)",
      "--sidebar-primary": "152 76% 50%",
      "--sidebar-primary-dark": "152 76% 50%",
      "--sidebar-accent-bg": "160 30% 12%",
      "--sidebar-ring": "152 76% 44%",
    },
  },
  {
    id: "rose-orange",
    name: "Rose → Orange",
    type: "gradient",
    preview: "linear-gradient(135deg, hsl(346,77%,56%), hsl(25,95%,53%))",
    vars: {
      "--primary": "346 77% 56%",
      "--accent": "25 95% 53%",
      "--ring": "346 77% 56%",
      "--primary-dark": "346 77% 62%",
      "--accent-dark": "25 95% 60%",
      "--ring-dark": "346 77% 62%",
      "--gradient-primary": "linear-gradient(135deg, hsl(346,77%,56%), hsl(25,95%,53%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(346,30%,6%) 0%, hsl(350,40%,14%) 40%, hsl(25,40%,18%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(346,77%,56%/0.05), hsl(25,95%,53%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(346 77% 56%/0.12), 0 8px 16px -8px hsl(346 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(346 77% 56%/0.15)",
      "--sidebar-primary": "346 77% 62%",
      "--sidebar-primary-dark": "346 77% 62%",
      "--sidebar-accent-bg": "346 30% 12%",
      "--sidebar-ring": "346 77% 56%",
    },
  },
  {
    id: "amber-yellow",
    name: "Amber → Yellow",
    type: "gradient",
    preview: "linear-gradient(135deg, hsl(38,92%,50%), hsl(48,96%,53%))",
    vars: {
      "--primary": "38 92% 50%",
      "--accent": "48 96% 53%",
      "--ring": "38 92% 50%",
      "--primary-dark": "38 92% 56%",
      "--accent-dark": "48 96% 58%",
      "--ring-dark": "38 92% 56%",
      "--gradient-primary": "linear-gradient(135deg, hsl(38,92%,50%), hsl(48,96%,53%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(38,30%,6%) 0%, hsl(40,45%,12%) 40%, hsl(48,40%,16%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(38,92%,50%/0.05), hsl(48,96%,53%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(38 92% 50%/0.12), 0 8px 16px -8px hsl(38 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(38 92% 50%/0.15)",
      "--sidebar-primary": "38 92% 56%",
      "--sidebar-primary-dark": "38 92% 56%",
      "--sidebar-accent-bg": "38 30% 12%",
      "--sidebar-ring": "38 92% 50%",
    },
  },
  {
    id: "indigo-cyan",
    name: "Indigo → Cyan",
    type: "gradient",
    preview: "linear-gradient(135deg, hsl(239,84%,67%), hsl(187,92%,50%))",
    vars: {
      "--primary": "239 84% 67%",
      "--accent": "187 92% 50%",
      "--ring": "239 84% 67%",
      "--primary-dark": "239 84% 72%",
      "--accent-dark": "187 92% 56%",
      "--ring-dark": "239 84% 72%",
      "--gradient-primary": "linear-gradient(135deg, hsl(239,84%,67%), hsl(187,92%,50%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(239,35%,6%) 0%, hsl(235,50%,14%) 40%, hsl(187,45%,16%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(239,84%,67%/0.05), hsl(187,92%,50%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(239 84% 67%/0.12), 0 8px 16px -8px hsl(239 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(239 84% 67%/0.15)",
      "--sidebar-primary": "239 84% 72%",
      "--sidebar-primary-dark": "239 84% 72%",
      "--sidebar-accent-bg": "239 30% 12%",
      "--sidebar-ring": "239 84% 67%",
    },
  },
  // ── Solids ──
  {
    id: "blue-solid",
    name: "Blue",
    type: "solid",
    preview: "hsl(217,91%,60%)",
    vars: {
      "--primary": "217 91% 60%",
      "--accent": "217 91% 60%",
      "--ring": "217 91% 60%",
      "--primary-dark": "217 91% 65%",
      "--accent-dark": "217 91% 65%",
      "--ring-dark": "217 91% 65%",
      "--gradient-primary": "linear-gradient(135deg, hsl(217,91%,60%), hsl(217,91%,52%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(217,35%,6%) 0%, hsl(217,50%,14%) 40%, hsl(217,45%,20%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(217,91%,60%/0.05), hsl(217,91%,52%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(217 91% 60%/0.12), 0 8px 16px -8px hsl(217 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(217 91% 60%/0.15)",
      "--sidebar-primary": "217 91% 65%",
      "--sidebar-primary-dark": "217 91% 65%",
      "--sidebar-accent-bg": "217 30% 12%",
      "--sidebar-ring": "217 91% 60%",
    },
  },
  {
    id: "purple-solid",
    name: "Purple",
    type: "solid",
    preview: "hsl(271,81%,56%)",
    vars: {
      "--primary": "271 81% 56%",
      "--accent": "271 81% 56%",
      "--ring": "271 81% 56%",
      "--primary-dark": "271 81% 62%",
      "--accent-dark": "271 81% 62%",
      "--ring-dark": "271 81% 62%",
      "--gradient-primary": "linear-gradient(135deg, hsl(271,81%,56%), hsl(271,81%,48%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(271,30%,6%) 0%, hsl(271,45%,14%) 40%, hsl(271,40%,20%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(271,81%,56%/0.05), hsl(271,81%,48%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(271 81% 56%/0.12), 0 8px 16px -8px hsl(271 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(271 81% 56%/0.15)",
      "--sidebar-primary": "271 81% 62%",
      "--sidebar-primary-dark": "271 81% 62%",
      "--sidebar-accent-bg": "271 30% 12%",
      "--sidebar-ring": "271 81% 56%",
    },
  },
  {
    id: "green-solid",
    name: "Green",
    type: "solid",
    preview: "hsl(142,71%,45%)",
    vars: {
      "--primary": "142 71% 45%",
      "--accent": "142 71% 45%",
      "--ring": "142 71% 45%",
      "--primary-dark": "142 71% 52%",
      "--accent-dark": "142 71% 52%",
      "--ring-dark": "142 71% 52%",
      "--gradient-primary": "linear-gradient(135deg, hsl(142,71%,45%), hsl(142,71%,38%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(142,30%,6%) 0%, hsl(142,45%,12%) 40%, hsl(142,40%,18%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(142,71%,45%/0.05), hsl(142,71%,38%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(142 71% 45%/0.12), 0 8px 16px -8px hsl(142 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(142 71% 45%/0.15)",
      "--sidebar-primary": "142 71% 52%",
      "--sidebar-primary-dark": "142 71% 52%",
      "--sidebar-accent-bg": "142 30% 12%",
      "--sidebar-ring": "142 71% 45%",
    },
  },
  {
    id: "rose-solid",
    name: "Rose",
    type: "solid",
    preview: "hsl(346,77%,56%)",
    vars: {
      "--primary": "346 77% 56%",
      "--accent": "346 77% 56%",
      "--ring": "346 77% 56%",
      "--primary-dark": "346 77% 62%",
      "--accent-dark": "346 77% 62%",
      "--ring-dark": "346 77% 62%",
      "--gradient-primary": "linear-gradient(135deg, hsl(346,77%,56%), hsl(346,77%,48%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(346,30%,6%) 0%, hsl(346,40%,14%) 40%, hsl(346,35%,20%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(346,77%,56%/0.05), hsl(346,77%,48%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(346 77% 56%/0.12), 0 8px 16px -8px hsl(346 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(346 77% 56%/0.15)",
      "--sidebar-primary": "346 77% 62%",
      "--sidebar-primary-dark": "346 77% 62%",
      "--sidebar-accent-bg": "346 30% 12%",
      "--sidebar-ring": "346 77% 56%",
    },
  },
  {
    id: "orange-solid",
    name: "Orange",
    type: "solid",
    preview: "hsl(25,95%,53%)",
    vars: {
      "--primary": "25 95% 53%",
      "--accent": "25 95% 53%",
      "--ring": "25 95% 53%",
      "--primary-dark": "25 95% 60%",
      "--accent-dark": "25 95% 60%",
      "--ring-dark": "25 95% 60%",
      "--gradient-primary": "linear-gradient(135deg, hsl(25,95%,53%), hsl(25,95%,45%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(25,30%,6%) 0%, hsl(25,45%,12%) 40%, hsl(25,40%,18%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(25,95%,53%/0.05), hsl(25,95%,45%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(25 95% 53%/0.12), 0 8px 16px -8px hsl(25 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(25 95% 53%/0.15)",
      "--sidebar-primary": "25 95% 60%",
      "--sidebar-primary-dark": "25 95% 60%",
      "--sidebar-accent-bg": "25 30% 12%",
      "--sidebar-ring": "25 95% 53%",
    },
  },
  {
    id: "teal-solid",
    name: "Teal",
    type: "solid",
    preview: "hsl(180,70%,40%)",
    vars: {
      "--primary": "180 70% 40%",
      "--accent": "180 70% 40%",
      "--ring": "180 70% 40%",
      "--primary-dark": "180 70% 48%",
      "--accent-dark": "180 70% 48%",
      "--ring-dark": "180 70% 48%",
      "--gradient-primary": "linear-gradient(135deg, hsl(180,70%,40%), hsl(180,70%,33%))",
      "--gradient-hero": "linear-gradient(160deg, hsl(180,30%,6%) 0%, hsl(180,45%,12%) 40%, hsl(180,40%,18%) 100%)",
      "--gradient-subtle": "linear-gradient(135deg, hsl(180,70%,40%/0.05), hsl(180,70%,33%/0.05))",
      "--shadow-elevated": "0 10px 40px -10px hsl(180 70% 40%/0.12), 0 8px 16px -8px hsl(180 30% 8%/0.06)",
      "--shadow-glow": "0 0 40px hsl(180 70% 40%/0.15)",
      "--sidebar-primary": "180 70% 48%",
      "--sidebar-primary-dark": "180 70% 48%",
      "--sidebar-accent-bg": "180 30% 12%",
      "--sidebar-ring": "180 70% 40%",
    },
  },
];

export function getPresetById(id: string): ThemePreset | undefined {
  return themePresets.find((p) => p.id === id);
}

export function applyTheme(themeId: string) {
  const preset = getPresetById(themeId);
  if (!preset) return;

  const root = document.documentElement;
  const isDark = root.classList.contains("dark");

  // Apply light-mode values to :root
  root.style.setProperty("--primary", isDark ? preset.vars["--primary-dark"] : preset.vars["--primary"]);
  root.style.setProperty("--accent", isDark ? preset.vars["--accent-dark"] : preset.vars["--accent"]);
  root.style.setProperty("--ring", isDark ? preset.vars["--ring-dark"] : preset.vars["--ring"]);
  root.style.setProperty("--gradient-primary", preset.vars["--gradient-primary"]);
  root.style.setProperty("--gradient-hero", preset.vars["--gradient-hero"]);
  root.style.setProperty("--gradient-subtle", preset.vars["--gradient-subtle"]);
  root.style.setProperty("--shadow-elevated", preset.vars["--shadow-elevated"]);
  root.style.setProperty("--shadow-glow", preset.vars["--shadow-glow"]);
  root.style.setProperty("--sidebar-primary", isDark ? preset.vars["--sidebar-primary-dark"] : preset.vars["--sidebar-primary"]);
  root.style.setProperty("--sidebar-accent", preset.vars["--sidebar-accent-bg"]);
  root.style.setProperty("--sidebar-ring", preset.vars["--sidebar-ring"]);
}
