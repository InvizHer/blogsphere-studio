export interface LanguageConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  monacoLang: string;
  extension: string;
  executionType: "piston" | "browser" | "sql" | "js-eval" | "pyodide";
  description: string;
  defaultFile: string;
  template: string;
}

export const LANGUAGES: LanguageConfig[] = [
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    color: "hsl(210, 70%, 50%)",
    monacoLang: "python",
    extension: ".py",
    executionType: "pyodide",
    description: "General-purpose programming language",
    defaultFile: "main.py",
    template: `# Python Playground\nprint("Hello, World!")\n\n# Try some Python code\nfor i in range(5):\n    print(f"Number: {i}")\n`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "⚡",
    color: "hsl(50, 90%, 50%)",
    monacoLang: "javascript",
    extension: ".js",
    executionType: "js-eval",
    description: "Web scripting & server-side language",
    defaultFile: "index.js",
    template: `// JavaScript Playground\nconsole.log("Hello, World!");\n\n// Try some JavaScript\nconst nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconsole.log("Doubled:", doubled);\n`,
  },
  {
    id: "c",
    name: "C",
    icon: "⚙️",
    color: "hsl(200, 60%, 45%)",
    monacoLang: "c",
    extension: ".c",
    executionType: "piston",
    description: "Low-level systems programming",
    defaultFile: "main.c",
    template: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    \n    for (int i = 0; i < 5; i++) {\n        printf("Number: %d\\n", i);\n    }\n    \n    return 0;\n}\n`,
  },
  {
    id: "cpp",
    name: "C++",
    icon: "🔧",
    color: "hsl(220, 70%, 55%)",
    monacoLang: "cpp",
    extension: ".cpp",
    executionType: "piston",
    description: "Object-oriented systems language",
    defaultFile: "main.cpp",
    template: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    \n    vector<int> nums = {1, 2, 3, 4, 5};\n    for (int n : nums) {\n        cout << "Number: " << n << endl;\n    }\n    \n    return 0;\n}\n`,
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
    color: "hsl(15, 80%, 50%)",
    monacoLang: "java",
    extension: ".java",
    executionType: "piston",
    description: "Enterprise & Android development",
    defaultFile: "Main.java",
    template: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        \n        int[] nums = {1, 2, 3, 4, 5};\n        for (int n : nums) {\n            System.out.println("Number: " + n);\n        }\n    }\n}\n`,
  },
  {
    id: "html",
    name: "HTML",
    icon: "🌐",
    color: "hsl(15, 90%, 55%)",
    monacoLang: "html",
    extension: ".html",
    executionType: "browser",
    description: "Web page structure & markup",
    defaultFile: "index.html",
    template: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Page</title>\n  <style>\n    body {\n      font-family: system-ui, sans-serif;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      min-height: 100vh;\n      margin: 0;\n      background: linear-gradient(135deg, #667eea, #764ba2);\n      color: white;\n    }\n    .card {\n      background: rgba(255,255,255,0.15);\n      backdrop-filter: blur(10px);\n      border-radius: 16px;\n      padding: 2rem;\n      text-align: center;\n    }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <h1>Hello, World! 👋</h1>\n    <p>Edit this HTML to see live changes</p>\n  </div>\n</body>\n</html>`,
  },
  {
    id: "css",
    name: "CSS",
    icon: "🎨",
    color: "hsl(200, 90%, 50%)",
    monacoLang: "css",
    extension: ".css",
    executionType: "browser",
    description: "Styling & visual design",
    defaultFile: "style.css",
    template: `/* CSS Playground */\nbody {\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n  background: linear-gradient(135deg, #1a1a2e, #16213e);\n}\n\n.box {\n  width: 200px;\n  height: 200px;\n  background: linear-gradient(45deg, #e94560, #533483);\n  border-radius: 20px;\n  animation: spin 3s ease-in-out infinite;\n  box-shadow: 0 20px 60px rgba(233, 69, 96, 0.4);\n}\n\n@keyframes spin {\n  0%, 100% { transform: rotate(0deg) scale(1); }\n  50% { transform: rotate(180deg) scale(1.1); }\n}`,
  },
  {
    id: "sql",
    name: "SQL",
    icon: "🗄️",
    color: "hsl(35, 80%, 50%)",
    monacoLang: "sql",
    extension: ".sql",
    executionType: "sql",
    description: "Database queries & management",
    defaultFile: "query.sql",
    template: `-- SQL Playground (SQLite)\n-- Sample tables are pre-loaded\n\nCREATE TABLE IF NOT EXISTS users (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  email TEXT,\n  age INTEGER\n);\n\nINSERT INTO users (name, email, age) VALUES\n  ('Alice', 'alice@example.com', 28),\n  ('Bob', 'bob@example.com', 34),\n  ('Charlie', 'charlie@example.com', 22);\n\nSELECT * FROM users WHERE age > 25;\n`,
  },
];

export function getLanguageById(id: string): LanguageConfig | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

export interface CompilerFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

export function createFile(name: string, content: string, language: string): CompilerFile {
  return { id: crypto.randomUUID(), name, content, language };
}

export function getStorageKey(langId: string) {
  return `compiler_files_${langId}`;
}

export function saveFilesToStorage(langId: string, files: CompilerFile[]) {
  localStorage.setItem(getStorageKey(langId), JSON.stringify(files));
}

export function loadFilesFromStorage(langId: string): CompilerFile[] | null {
  const raw = localStorage.getItem(getStorageKey(langId));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
