import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { supabase } from "@/integrations/supabase/client";
import { applyTheme } from "@/lib/theme-presets";

// Eagerly fetch and apply theme before first render
supabase.from("site_settings").select("theme_color").limit(1).single().then(({ data }) => {
  if (data?.theme_color) applyTheme(data.theme_color);
});

createRoot(document.getElementById("root")!).render(<App />);
