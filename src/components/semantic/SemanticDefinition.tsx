import { Layers, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/presentation/CodeBlock";

interface SemanticDefinitionProps {
  /** Name of the metric or dimension */
  name: string;
  /** Human-readable description */
  description: string;
  /** Calculation formula (for metrics) */
  calculation?: string;
  /** Applied filters (for metrics) */
  filters?: string[];
  /** Source field (for dimensions) */
  source?: string;
  /** Allowed values (for dimensions) */
  values?: string[];
  /** Whether this is a metric or dimension definition */
  type: "metric" | "dimension";
  className?: string;
}

/**
 * Card showing a single semantic layer metric or dimension definition.
 * Displays in a YAML-like format using CodeBlock.
 */
export function SemanticDefinition({
  name,
  description,
  calculation,
  filters,
  source,
  values,
  type,
  className,
}: SemanticDefinitionProps) {
  const Icon = type === "metric" ? BarChart3 : Layers;
  const iconColor = type === "metric" ? "text-indigo-600" : "text-emerald-600";
  const iconBg = type === "metric" ? "bg-indigo-100" : "bg-emerald-100";
  const badge = type === "metric" ? "Metric" : "Dimension";
  const badgeColor =
    type === "metric"
      ? "bg-indigo-100 text-indigo-700 border-indigo-200"
      : "bg-emerald-100 text-emerald-700 border-emerald-200";

  // Build YAML representation
  const yamlLines: string[] = [`${name}:`];
  yamlLines.push(`  description: "${description}"`);
  if (calculation) {
    yamlLines.push(`  calculation: "${calculation}"`);
  }
  if (source) {
    yamlLines.push(`  source: "${source}"`);
  }
  if (filters && filters.length > 0) {
    yamlLines.push("  filters:");
    for (const filter of filters) {
      yamlLines.push(`    - "${filter}"`);
    }
  }
  if (values && values.length > 0) {
    yamlLines.push(`  values: [${values.join(", ")}]`);
  }

  const yamlCode = yamlLines.join("\n");

  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            iconBg,
          )}
        >
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <span
          className={cn(
            "inline-block rounded-md border px-2 py-0.5 text-[10px] font-medium",
            badgeColor,
          )}
        >
          {badge}
        </span>
      </div>

      {/* YAML definition */}
      <div className="p-3">
        <CodeBlock code={yamlCode} language="yaml" />
      </div>
    </div>
  );
}
