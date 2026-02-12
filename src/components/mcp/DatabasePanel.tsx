import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Table, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import {
  MOCK_TABLES,
  MOCK_QUERY_RESULT,
  type MockTable,
  type MockQueryResult,
} from "@/data/mock-mcp-flows";

const LOADING_DELAY_MS = 800;

interface DatabasePanelProps {
  /** Whether a query is currently being executed */
  isExecuting?: boolean;
  /** Whether to show the query result */
  showResult?: boolean;
  className?: string;
}

/**
 * Mock database visualization.
 * Shows table names with row counts, and when a query is "executed",
 * displays the SQL and result table with loading animation.
 */
export function DatabasePanel({
  isExecuting = false,
  showResult = false,
  className,
}: DatabasePanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayResult, setDisplayResult] = useState(false);

  // Handle the loading animation when executing
  useEffect(() => {
    if (isExecuting && !displayResult) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, LOADING_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [isExecuting, displayResult]);

  // Show result after loading
  useEffect(() => {
    if (showResult && !isLoading) {
      setDisplayResult(true);
    }
    if (!showResult) {
      setDisplayResult(false);
    }
  }, [showResult, isLoading]);

  return (
    <div className={cn("rounded-lg border bg-slate-50 p-3", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Database className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-semibold text-slate-700">
          PostgreSQL Database
        </span>
      </div>

      {/* Tables list */}
      <div className="space-y-1.5 mb-3">
        {MOCK_TABLES.map((table: MockTable) => (
          <TableRow key={table.name} table={table} />
        ))}
      </div>

      {/* Query execution area */}
      <AnimatePresence mode="wait">
        {isExecuting && isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2 py-4"
          >
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-[10px] text-muted-foreground">
              Executing query...
            </span>
          </motion.div>
        )}

        {displayResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* SQL Query */}
            <CodeBlock
              code={MOCK_QUERY_RESULT.sql}
              language="sql"
              title="Executed SQL"
              className="mb-2 text-[11px]"
            />

            {/* Result table */}
            <QueryResultTable result={MOCK_QUERY_RESULT} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Single table row showing name, columns, and row count */
function TableRow({ table }: { table: MockTable }) {
  return (
    <div className="flex items-center justify-between rounded bg-white px-2 py-1.5 border border-slate-200">
      <div className="flex items-center gap-1.5">
        <Table className="h-3 w-3 text-slate-400" />
        <span className="text-[11px] font-medium text-slate-700">
          {table.name}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground">
        {table.rowCount} rows
      </span>
    </div>
  );
}

/** Query result displayed as a simple table */
function QueryResultTable({ result }: { result: MockQueryResult }) {
  return (
    <div className="rounded border border-green-200 bg-green-50 p-2">
      <div className="text-[10px] font-medium text-green-700 mb-1">
        Query Result
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr>
            {result.headers.map((header) => (
              <th
                key={header}
                className="border-b border-green-200 pb-1 text-left font-semibold text-green-800"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="pt-1 font-mono text-green-900"
                >
                  {typeof cell === "number"
                    ? cell.toLocaleString("cs-CZ")
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
