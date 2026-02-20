import { useState } from "react";
import { FilePlus, Trash2, Pencil, Check, X, FileCode } from "lucide-react";
import type { CompilerFile, LanguageConfig } from "./compiler-utils";

interface FileExplorerProps {
  files: CompilerFile[];
  activeFileId: string;
  language: LanguageConfig;
  onSelectFile: (id: string) => void;
  onAddFile: (name: string) => void;
  onDeleteFile: (id: string) => void;
  onRenameFile: (id: string, newName: string) => void;
}

export function FileExplorer({
  files,
  activeFileId,
  language,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onRenameFile,
}: FileExplorerProps) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleAdd = () => {
    const name = newName.trim();
    if (name) {
      const finalName = name.includes(".") ? name : `${name}${language.extension}`;
      onAddFile(finalName);
    }
    setAdding(false);
    setNewName("");
  };

  const handleRename = (id: string) => {
    const name = renameValue.trim();
    if (name) onRenameFile(id, name);
    setRenamingId(null);
    setRenameValue("");
  };

  return (
    <div className="flex h-full flex-col bg-[hsl(222,47%,6%)] text-[hsl(220,20%,75%)]">
      <div className="flex items-center justify-between border-b border-[hsl(222,30%,14%)] px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(220,20%,45%)]">
          Files
        </span>
        <button
          onClick={() => setAdding(true)}
          className="rounded p-1 transition-colors hover:bg-[hsl(222,40%,13%)] hover:text-white"
          title="New file"
        >
          <FilePlus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5">
        {files.map((file) => (
          <div
            key={file.id}
            className={`group flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm cursor-pointer transition-colors ${
              file.id === activeFileId
                ? "bg-[hsl(217,91%,60%/0.15)] text-white"
                : "hover:bg-[hsl(222,40%,10%)] text-[hsl(220,20%,65%)]"
            }`}
            onClick={() => onSelectFile(file.id)}
          >
            <FileCode className="h-3.5 w-3.5 shrink-0 text-[hsl(217,91%,60%)]" />

            {renamingId === file.id ? (
              <div className="flex flex-1 items-center gap-1">
                <input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename(file.id)}
                  className="flex-1 rounded bg-[hsl(222,40%,10%)] px-1.5 py-0.5 text-xs text-white outline-none"
                  autoFocus
                />
                <button onClick={() => handleRename(file.id)} className="text-green-400 hover:text-green-300">
                  <Check className="h-3 w-3" />
                </button>
                <button onClick={() => setRenamingId(null)} className="text-red-400 hover:text-red-300">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 truncate text-xs">{file.name}</span>
                <div className="hidden items-center gap-0.5 group-hover:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingId(file.id);
                      setRenameValue(file.name);
                    }}
                    className="rounded p-0.5 hover:bg-[hsl(222,40%,16%)]"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  {files.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(file.id);
                      }}
                      className="rounded p-0.5 text-red-400 hover:bg-[hsl(222,40%,16%)]"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        {adding && (
          <div className="mt-1 flex items-center gap-1 px-2.5">
            <FileCode className="h-3.5 w-3.5 shrink-0 text-[hsl(217,91%,60%)]" />
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder={`file${language.extension}`}
              className="flex-1 rounded bg-[hsl(222,40%,10%)] px-1.5 py-0.5 text-xs text-white outline-none placeholder:text-[hsl(220,20%,35%)]"
              autoFocus
            />
            <button onClick={handleAdd} className="text-green-400"><Check className="h-3 w-3" /></button>
            <button onClick={() => { setAdding(false); setNewName(""); }} className="text-red-400"><X className="h-3 w-3" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
