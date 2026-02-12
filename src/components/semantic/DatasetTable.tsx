import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { DatasetTable as DatasetTableType } from "@/types/semantic.types";

interface DatasetTableProps {
  /** Array of table definitions to show as tabs */
  tables: readonly DatasetTableType[];
  /** Column names to highlight (e.g., key columns for the demo) */
  highlightColumns?: readonly string[];
  className?: string;
}

/**
 * Tabbed table component for displaying dataset tables.
 * Shows data in a scrollable table with headers and optional column highlighting.
 */
export function DatasetTable({
  tables,
  highlightColumns = [],
  className,
}: DatasetTableProps) {
  return (
    <Tabs defaultValue={tables[0]?.name} className={cn("w-full", className)}>
      <TabsList>
        {tables.map((table) => (
          <TabsTrigger key={table.name} value={table.name}>
            {table.name}
            <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">
              {table.rowCount}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>

      {tables.map((table) => (
        <TabsContent key={table.name} value={table.name}>
          {/* Schema info row */}
          <div className="mb-2 flex flex-wrap gap-1.5">
            {table.columns.map((col) => (
              <span
                key={col.name}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono",
                  highlightColumns.includes(col.name)
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-muted text-muted-foreground",
                )}
                title={col.description}
              >
                {col.name}
                <span className="opacity-60">{col.type}</span>
              </span>
            ))}
          </div>

          {/* Data table */}
          <ScrollArea className="h-[340px] rounded-md border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
                <tr>
                  {table.columns.map((col) => (
                    <th
                      key={col.name}
                      className={cn(
                        "whitespace-nowrap px-3 py-2 text-left text-xs font-semibold",
                        highlightColumns.includes(col.name) &&
                          "text-amber-700 bg-amber-50/50",
                      )}
                    >
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    {table.columns.map((col) => {
                      const value = row[col.name];
                      const isHighlighted = highlightColumns.includes(col.name);
                      const isStatus = col.name === "status";

                      return (
                        <td
                          key={col.name}
                          className={cn(
                            "whitespace-nowrap px-3 py-1.5 text-xs font-mono",
                            isHighlighted && "bg-amber-50/30 font-medium",
                          )}
                        >
                          {isStatus ? (
                            <StatusBadge status={String(value)} />
                          ) : (
                            String(value ?? "")
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}

/** Color-coded badge for order status values */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    returned: "bg-amber-100 text-amber-700 border-amber-200",
    pending: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
        styles[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}
