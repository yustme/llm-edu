import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueryPanelProps {
  /** The query text to display */
  query: string;
  /** Optional label shown above the query */
  label?: string;
  className?: string;
}

/**
 * Prominent display card showing the query being asked.
 * Styled with an icon and the query text in a highlighted box.
 */
export function QueryPanel({ query, label, className }: QueryPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4",
        className,
      )}
    >
      {label && (
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      )}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <Search className="h-4 w-4 text-blue-600" />
        </div>
        <p className="text-base font-semibold text-foreground">
          &ldquo;{query}&rdquo;
        </p>
      </div>
    </div>
  );
}
