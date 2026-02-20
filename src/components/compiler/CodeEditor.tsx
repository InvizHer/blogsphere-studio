import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  language: string;
  theme: "vs-dark" | "light";
  fontSize: number;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, language, theme, fontSize, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme={theme}
      onChange={(v) => onChange(v ?? "")}
      options={{
        fontSize,
        fontFamily: "'Space Grotesk', 'Fira Code', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        wordWrap: "on",
        automaticLayout: true,
        tabSize: 2,
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        padding: { top: 12 },
        renderLineHighlight: "all",
        cursorBlinking: "smooth",
        smoothScrolling: true,
        bracketPairColorization: { enabled: true },
      }}
    />
  );
}
