import { FORMATTING } from "@/config/simulation.config";

/** SQL keywords to uppercase during formatting */
const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "AND",
  "OR",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "ALTER",
  "DROP",
  "TABLE",
  "INTO",
  "VALUES",
  "SET",
  "JOIN",
  "LEFT",
  "RIGHT",
  "INNER",
  "OUTER",
  "ON",
  "AS",
  "ORDER",
  "BY",
  "GROUP",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "UNION",
  "ALL",
  "DISTINCT",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "BETWEEN",
  "IN",
  "NOT",
  "NULL",
  "IS",
  "LIKE",
  "EXISTS",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "ASC",
  "DESC",
  "WITH",
] as const;

/**
 * Format a number as currency with thousand separators.
 * Default currency is CZK.
 * Example: formatCurrency(173380) => "173,380 CZK"
 */
export function formatCurrency(
  amount: number,
  currency: string = FORMATTING.defaultCurrency,
): string {
  const formatted = formatNumber(amount);
  return `${formatted} ${currency}`;
}

/**
 * Format a number with thousand separators.
 * Example: formatNumber(173380) => "173,380"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Basic SQL formatter that uppercases SQL keywords.
 * Example: formatSQL("select * from orders where status = 'completed'")
 *   => "SELECT * FROM orders WHERE status = 'completed'"
 */
export function formatSQL(sql: string): string {
  // Build a regex pattern matching all SQL keywords as whole words (case-insensitive)
  const pattern = new RegExp(
    `\\b(${SQL_KEYWORDS.join("|")})\\b`,
    "gi",
  );
  return sql.replace(pattern, (match) => match.toUpperCase());
}

/**
 * Pretty-print JSON data with indentation.
 */
export function formatJSON(data: unknown): string {
  return JSON.stringify(data, null, FORMATTING.jsonIndentSpaces);
}
