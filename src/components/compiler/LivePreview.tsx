import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

interface LivePreviewProps {
  html: string;
  css: string;
  language: "html" | "css";
}

export function LivePreview({ html, css, language }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);

  const getDocument = () => {
    if (language === "html") return html;
    return `<!DOCTYPE html>
<html><head><style>${css}</style></head>
<body><div class="box"></div></body></html>`;
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(getDocument());
    doc.close();
  }, [html, css, language, key]);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-[hsl(222,30%,14%)] bg-[hsl(222,47%,6%)] px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(220,20%,45%)]">
          Preview
        </span>
        <button
          onClick={() => setKey((k) => k + 1)}
          className="rounded p-1 text-[hsl(220,20%,50%)] transition-colors hover:bg-[hsl(222,40%,13%)] hover:text-white"
          title="Refresh"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
      <iframe
        ref={iframeRef}
        key={key}
        className="flex-1 w-full"
        sandbox="allow-scripts allow-modals"
        title="Live Preview"
      />
    </div>
  );
}
