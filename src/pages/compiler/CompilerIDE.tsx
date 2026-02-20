import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Play } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { CompilerHeader } from "@/components/compiler/CompilerHeader";
import { FileExplorer } from "@/components/compiler/FileExplorer";
import { CodeEditor } from "@/components/compiler/CodeEditor";
import { OutputPanel } from "@/components/compiler/OutputPanel";
import { LivePreview } from "@/components/compiler/LivePreview";
import { SqlOutput } from "@/components/compiler/SqlOutput";
import {
  getLanguageById,
  createFile,
  saveFilesToStorage,
  loadFilesFromStorage,
  type CompilerFile,
  type LanguageConfig,
} from "@/components/compiler/compiler-utils";
import { supabase } from "@/integrations/supabase/client";

export default function CompilerIDE() {
  const { language: langId } = useParams<{ language: string }>();
  const language = getLanguageById(langId || "");

  if (!language) return <Navigate to="/online-compiler" replace />;

  return <CompilerIDEInner language={language} key={language.id} />;
}

function CompilerIDEInner({ language }: { language: LanguageConfig }) {
  const [files, setFiles] = useState<CompilerFile[]>(() => {
    const saved = loadFilesFromStorage(language.id);
    if (saved && saved.length > 0) return saved;
    return [createFile(language.defaultFile, language.template, language.monacoLang)];
  });
  const [activeFileId, setActiveFileId] = useState(files[0].id);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [sqlResults, setSqlResults] = useState<{ columns: string[]; values: any[][] }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExplorer, setShowExplorer] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  useEffect(() => {
    saveFilesToStorage(language.id, files);
  }, [files, language.id]);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput("");
    setError("");
    setSqlResults([]);

    try {
      if (language.executionType === "browser") {
        setOutput("Preview updated.");
        setIsRunning(false);
        return;
      }

      if (language.executionType === "js-eval") {
        // Run JS in a sandboxed iframe
        const code = files.map((f) => f.content).join("\n");
        const iframe = document.createElement("iframe");
        iframe.sandbox.add("allow-scripts");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const logs: string[] = [];
        const html = `<script>
          const __logs = [];
          const __origLog = console.log;
          console.log = (...a) => { __logs.push(a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')); };
          console.error = console.log;
          console.warn = console.log;
          try { ${code.replace(/<\/script>/gi, "<\\/script>")} } catch(e) { __logs.push("Error: " + e.message); }
          parent.postMessage({ type: '__js_result', logs: __logs }, '*');
        <\/script>`;
        const p = new Promise<string>((resolve) => {
          const handler = (e: MessageEvent) => {
            if (e.data?.type === "__js_result") {
              window.removeEventListener("message", handler);
              resolve(e.data.logs.join("\n"));
            }
          };
          window.addEventListener("message", handler);
          setTimeout(() => { window.removeEventListener("message", handler); resolve("Execution timed out"); }, 5000);
        });
        const doc = iframe.contentDocument;
        if (doc) { doc.open(); doc.write(html); doc.close(); }
        const result = await p;
        document.body.removeChild(iframe);
        setOutput(result || "Program finished with no output.");
        setIsRunning(false);
        return;
      }

      if (language.executionType === "pyodide") {
        // Run Python via Pyodide (WASM)
        const code = files.map((f) => f.content).join("\n");
        const iframe = document.createElement("iframe");
        iframe.sandbox.add("allow-scripts");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const p = new Promise<{ output: string; error: string }>((resolve) => {
          const handler = (e: MessageEvent) => {
            if (e.data?.type === "__py_result") {
              window.removeEventListener("message", handler);
              resolve({ output: e.data.output || "", error: e.data.error || "" });
            }
          };
          window.addEventListener("message", handler);
          setTimeout(() => { window.removeEventListener("message", handler); resolve({ output: "", error: "Execution timed out (30s)" }); }, 30000);
        });
        const pyHtml = `<script src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js"><\/script>
        <script>
          async function run() {
            try {
              const pyodide = await loadPyodide();
              pyodide.setStdout({ batched: (t) => { output += t + "\\n"; } });
              pyodide.setStderr({ batched: (t) => { errOut += t + "\\n"; } });
              let output = "", errOut = "";
              await pyodide.runPythonAsync(${JSON.stringify(code)});
              parent.postMessage({ type: '__py_result', output, error: errOut }, '*');
            } catch(e) {
              parent.postMessage({ type: '__py_result', output: '', error: e.message }, '*');
            }
          }
          run();
        <\/script>`;
        const doc = iframe.contentDocument;
        if (doc) { doc.open(); doc.write(pyHtml); doc.close(); }
        const pyResult = await p;
        document.body.removeChild(iframe);
        if (pyResult.error) setError(pyResult.error);
        else setOutput(pyResult.output || "Program finished with no output.");
        setIsRunning(false);
        return;
      }

      if (language.executionType === "sql") {
        try {
          const initSqlJs = (await import("sql.js")).default;
          const SQL = await initSqlJs({ locateFile: (file: string) => `https://sql.js.org/dist/${file}` });
          const db = new SQL.Database();
          const code = files.map((f) => f.content).join("\n");
          const statements = code.split(";").map((s) => s.trim()).filter((s) => s.length > 0);
          const results: { columns: string[]; values: any[][] }[] = [];
          for (const stmt of statements) {
            try {
              const res = db.exec(stmt);
              if (res.length > 0) results.push(...res);
            } catch (e: any) { setError(e.message); setIsRunning(false); db.close(); return; }
          }
          setSqlResults(results);
          if (results.length === 0) setOutput("Query executed successfully (no results).");
          db.close();
        } catch (e: any) { setError(e.message); }
        finally { setIsRunning(false); }
        return;
      }

      // Piston (C, C++, Java) via edge function
      const { data, error: fnError } = await supabase.functions.invoke("execute-code", {
        body: { language: language.id, files: files.map((f) => ({ name: f.name, content: f.content })) },
      });

      if (fnError) {
        setError(fnError.message || "Execution failed");
      } else if (data) {
        const run = data.run || data;
        const compile = data.compile;
        if (compile?.stderr) setError(`Compile Error:\n${compile.stderr}`);
        else if (run?.stderr) setError(run.stderr);
        else if (run?.output) setOutput(run.output);
        else if (run?.stdout) setOutput(run.stdout);
        else if (data.error) setError(data.error);
        else setOutput("Program finished with no output.");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setIsRunning(false);
    }
  }, [files, language]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runCode]);

  const updateFileContent = useCallback(
    (content: string) => {
      setFiles((prev) => prev.map((f) => (f.id === activeFileId ? { ...f, content } : f)));
    },
    [activeFileId]
  );

  const addFile = (name: string) => {
    const f = createFile(name, "", language.monacoLang);
    setFiles((prev) => [...prev, f]);
    setActiveFileId(f.id);
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (activeFileId === id && next.length > 0) setActiveFileId(next[0].id);
      return next;
    });
  };

  const renameFile = (id: string, newName: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: newName } : f)));
  };

  const downloadFile = () => {
    const blob = new Blob([activeFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const getPreviewContent = () => {
    if (language.id === "html") return { html: activeFile.content, css: "" };
    if (language.id === "css") return { html: "", css: activeFile.content };
    return { html: "", css: "" };
  };

  const preview = getPreviewContent();
  const isBrowser = language.executionType === "browser";
  const isSql = language.executionType === "sql";

  return (
    <>
      <SEOHead
        title={`${language.name} Online Compiler`}
        description={`Write, compile and run ${language.name} code online. Free ${language.name} playground with VS Code-like editor.`}
      />
      <div ref={containerRef} className="flex h-screen w-full flex-col bg-[hsl(222,47%,6%)]">
        <CompilerHeader
          language={language}
          theme={theme}
          fontSize={fontSize}
          isRunning={isRunning}
          isFullscreen={isFullscreen}
          showExplorer={showExplorer}
          onRun={runCode}
          onToggleTheme={() => setTheme((t) => (t === "vs-dark" ? "light" : "vs-dark"))}
          onFontSizeChange={setFontSize}
          onDownload={downloadFile}
          onToggleFullscreen={toggleFullscreen}
          onToggleExplorer={() => setShowExplorer((s) => !s)}
        />

        <div className="flex flex-1 overflow-hidden">
          {showExplorer && (
            <div className="hidden w-48 shrink-0 border-r border-[hsl(222,30%,14%)] md:block">
              <FileExplorer
                files={files}
                activeFileId={activeFileId}
                language={language}
                onSelectFile={setActiveFileId}
                onAddFile={addFile}
                onDeleteFile={deleteFile}
                onRenameFile={renameFile}
              />
            </div>
          )}

          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            <div className="flex flex-1 flex-col min-h-0">
              <div className="flex items-center gap-0.5 overflow-x-auto border-b border-[hsl(222,30%,14%)] bg-[hsl(222,47%,7%)] px-1 py-0.5">
                {files.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFileId(f.id)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-t px-3 py-1.5 text-xs transition-colors ${
                      f.id === activeFileId
                        ? "bg-[hsl(222,47%,6%)] text-white"
                        : "text-[hsl(220,20%,50%)] hover:text-[hsl(220,20%,70%)]"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  value={activeFile.content}
                  language={language.monacoLang}
                  theme={theme}
                  fontSize={fontSize}
                  onChange={updateFileContent}
                />
              </div>
            </div>

            <div className="h-[40vh] shrink-0 border-t border-[hsl(222,30%,14%)] md:h-auto md:w-[40%] md:border-l md:border-t-0">
              {isBrowser ? (
                <LivePreview html={preview.html} css={preview.css} language={language.id as "html" | "css"} />
              ) : isSql ? (
                <SqlOutput results={sqlResults} error={error} isRunning={isRunning} />
              ) : (
                <OutputPanel output={output} error={error} isRunning={isRunning} onClear={() => { setOutput(""); setError(""); }} />
              )}
            </div>
          </div>
        </div>

        {/* Mobile bottom bar */}
        <div className="flex items-center justify-between border-t border-[hsl(222,30%,14%)] bg-[hsl(222,47%,8%)] px-3 py-1.5 md:hidden">
          <button
            onClick={() => setShowExplorer((s) => !s)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-[hsl(220,20%,55%)] transition-colors hover:bg-[hsl(222,40%,13%)] hover:text-white"
          >
            Files
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Play className="h-3 w-3" />
            Run
          </button>
        </div>

        {/* Mobile file explorer overlay */}
        {showExplorer && (
          <div className="fixed inset-0 z-50 md:hidden" onClick={() => setShowExplorer(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute left-0 top-0 h-full w-64" onClick={(e) => e.stopPropagation()}>
              <FileExplorer
                files={files}
                activeFileId={activeFileId}
                language={language}
                onSelectFile={(id) => { setActiveFileId(id); setShowExplorer(false); }}
                onAddFile={addFile}
                onDeleteFile={deleteFile}
                onRenameFile={renameFile}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
