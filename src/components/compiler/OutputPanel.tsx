import { Trash2, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface OutputPanelProps {
  output: string;
  error: string;
  isRunning: boolean;
  onClear: () => void;
}

export function OutputPanel({ output, error, isRunning, onClear }: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col bg-[hsl(222,47%,6%)] text-[hsl(210,30%,82%)]">
      <div className="flex items-center justify-between border-b border-[hsl(222,30%,14%)] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(220,20%,45%)]">
            Output
          </span>
          {isRunning && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
          {!isRunning && !error && output && (
            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
          )}
          {!isRunning && error && (
            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
          )}
        </div>
        <button
          onClick={onClear}
          className="rounded p-1 text-[hsl(220,20%,50%)] transition-colors hover:bg-[hsl(222,40%,13%)] hover:text-white"
          title="Clear output"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed">
        {isRunning ? (
          <div className="flex items-center gap-2 text-[hsl(220,20%,55%)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Running code...
          </div>
        ) : error ? (
          <pre className="whitespace-pre-wrap text-red-400">{error}</pre>
        ) : output ? (
          <pre className="whitespace-pre-wrap">{output}</pre>
        ) : (
          <span className="text-[hsl(220,20%,35%)]">Run your code to see output here...</span>
        )}
      </div>
    </div>
  );
}
