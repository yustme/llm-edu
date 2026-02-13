import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

type CodeLanguage = "json" | "sql" | "yaml" | "typescript" | "python";

interface CodeBlockProps {
  code: string;
  language: CodeLanguage;
  /** Optional title displayed above the code block */
  title?: string;
  /** Show line numbers (default: false) */
  showLineNumbers?: boolean;
  className?: string;
}

/**
 * Syntax-highlighted code block using react-syntax-highlighter
 * with a dark theme. Wrapped in a card with an optional title header.
 */
export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  return (
    <div
      className={cn("overflow-hidden rounded-lg border bg-[#1e1e1e]", className)}
    >
      {title && (
        <div className="border-b border-white/10 px-4 py-2">
          <span className="text-xs font-medium text-gray-400">{title}</span>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          background: "transparent",
        }}
        codeTagProps={{
          style: {
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
