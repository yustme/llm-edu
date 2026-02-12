import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentChunkProps {
  title: string;
  content: string;
  source: string;
  relevanceScore: number;
  className?: string;
}

const CONTENT_TRUNCATE_LENGTH = 150;
const SCORE_THRESHOLDS = { high: 0.85, medium: 0.7 } as const;

/**
 * Card component showing a retrieved document chunk with
 * title, truncated content, source label, and a relevance score bar.
 */
export function DocumentChunk({
  title,
  content,
  source,
  relevanceScore,
  className,
}: DocumentChunkProps) {
  const truncatedContent =
    content.length > CONTENT_TRUNCATE_LENGTH
      ? content.slice(0, CONTENT_TRUNCATE_LENGTH) + "..."
      : content;

  const scorePercent = Math.round(relevanceScore * 100);

  const barColor =
    relevanceScore >= SCORE_THRESHOLDS.high
      ? "bg-green-500"
      : relevanceScore >= SCORE_THRESHOLDS.medium
        ? "bg-yellow-500"
        : "bg-red-500";

  const scoreColor =
    relevanceScore >= SCORE_THRESHOLDS.high
      ? "text-green-700"
      : relevanceScore >= SCORE_THRESHOLDS.medium
        ? "text-yellow-700"
        : "text-red-700";

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 shadow-sm space-y-3",
        className,
      )}
    >
      {/* Title */}
      <div className="flex items-start gap-2">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <h4 className="text-sm font-bold text-foreground leading-tight">
          {title}
        </h4>
      </div>

      {/* Content */}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {truncatedContent}
      </p>

      {/* Source */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Source:
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
          {source}
        </span>
      </div>

      {/* Relevance score bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Relevance
          </span>
          <span className={cn("text-xs font-semibold", scoreColor)}>
            {scorePercent}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
