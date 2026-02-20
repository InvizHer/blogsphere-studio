import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rextester API - free, no API key needed
const REXTESTER_URL = "https://rextester.com/rundotnet/api";

// Rextester language IDs
const LANGUAGE_MAP: Record<string, number> = {
  c: 6,       // C (gcc)
  cpp: 7,     // C++ (g++)
  java: 4,    // Java
  python: 5,  // Python 3
  javascript: 23, // Node.js
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { language, files } = await req.json();

    const langId = LANGUAGE_MAP[language];
    if (langId === undefined) {
      return new Response(
        JSON.stringify({ error: `Unsupported language: ${language}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return new Response(
        JSON.stringify({ error: "No files provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const totalSize = files.reduce((sum: number, f: any) => sum + (f.content?.length || 0), 0);
    if (totalSize > 65536) {
      return new Response(
        JSON.stringify({ error: "Code size exceeds 64KB limit" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Combine all files into one (Rextester is single-file)
    const code = files.map((f: any) => f.content || "").join("\n");

    const formData = new URLSearchParams();
    formData.append("LanguageChoice", String(langId));
    formData.append("Program", code);
    formData.append("Input", "");
    formData.append("CompilerArgs", language === "cpp" ? "-std=c++17 -o a.out source_file.cpp" : "");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(REXTESTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      const msg = fetchErr.name === "AbortError" ? "Execution timed out (15s limit)" : fetchErr.message;
      return new Response(
        JSON.stringify({ error: msg }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    clearTimeout(timeout);
    const text = await response.text();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Compiler service error (${response.status})` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: `Invalid response from compiler` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rextester returns: { Result, Warnings, Errors, Stats, Files }
    const result: any = { run: { stdout: "", stderr: "", output: "" } };

    if (data.Errors) {
      result.compile = { stderr: data.Errors };
      result.run.stderr = data.Errors;
    }

    if (data.Result !== null && data.Result !== undefined) {
      result.run.stdout = data.Result;
      result.run.output = data.Result;
    }

    if (data.Warnings) {
      result.run.output = (result.run.output || "") + "\n⚠️ Warnings:\n" + data.Warnings;
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
