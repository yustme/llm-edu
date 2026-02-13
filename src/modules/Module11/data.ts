/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction to Text-to-SQL",
  "The Pipeline",
  "Schema Context",
  "Simple Query Demo",
  "Complex Query Demo",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "The challenge of translating natural language to SQL",
  "Question → Schema → SQL → Execute → Answer pipeline",
  "Why schema context is critical for correct SQL generation",
  "Simple single-table query demonstration",
  "Complex multi-table JOIN query demonstration",
  "Challenges, solutions, and connection to semantic layer",
] as const;

/** A single stage in the Text-to-SQL pipeline */
export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  iconName: "MessageSquare" | "Database" | "Code" | "Play" | "MessageCircle";
}

/** Five stages of the Text-to-SQL pipeline */
export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "question",
    label: "Natural Language Question",
    description: "User asks a question in plain English",
    iconName: "MessageSquare",
  },
  {
    id: "schema",
    label: "Schema Context",
    description: "LLM receives table definitions, column types, and relationships",
    iconName: "Database",
  },
  {
    id: "sql-gen",
    label: "SQL Generation",
    description: "LLM translates the question into a valid SQL query",
    iconName: "Code",
  },
  {
    id: "execute",
    label: "Query Execution",
    description: "Generated SQL is executed against the database",
    iconName: "Play",
  },
  {
    id: "answer",
    label: "Natural Language Answer",
    description: "Raw results are formatted into a human-readable response",
    iconName: "MessageCircle",
  },
];

/** Example NL question with its corresponding SQL */
export interface SqlExample {
  id: string;
  question: string;
  sql: string;
  description: string;
}

/** Example NL-to-SQL translations for the intro step */
export const SQL_EXAMPLES: SqlExample[] = [
  {
    id: "count-orders",
    question: "How many orders were placed in December?",
    sql: `SELECT COUNT(*)
FROM orders
WHERE order_date >= '2024-12-01'
  AND order_date <= '2024-12-31';`,
    description: "Simple aggregation with date filtering",
  },
  {
    id: "top-customers",
    question: "Who are our top 5 customers by total spend?",
    sql: `SELECT c.name, SUM(o.order_amount) AS total_spend
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'completed'
GROUP BY c.name
ORDER BY total_spend DESC
LIMIT 5;`,
    description: "JOIN with aggregation and sorting",
  },
  {
    id: "category-revenue",
    question: "What is the revenue by product category?",
    sql: `SELECT p.category,
       SUM(o.order_amount - o.discount) AS revenue
FROM orders o
JOIN products p ON o.product_id = p.product_id
WHERE o.status = 'completed'
GROUP BY p.category
ORDER BY revenue DESC;`,
    description: "Multi-table JOIN with computed column",
  },
  {
    id: "monthly-trend",
    question: "Show me the monthly order trend for Q4 2024.",
    sql: `SELECT DATE_TRUNC('month', order_date) AS month,
       COUNT(*) AS order_count,
       SUM(order_amount) AS total_amount
FROM orders
WHERE order_date >= '2024-10-01'
  AND order_date <= '2024-12-31'
GROUP BY month
ORDER BY month;`,
    description: "Time-series aggregation with date truncation",
  },
];

/** Challenge and solution pair */
export interface ChallengeItem {
  id: string;
  challenge: string;
  solution: string;
}

/** Challenges and solutions for the summary step */
export const CHALLENGES_AND_SOLUTIONS: ChallengeItem[] = [
  {
    id: "ambiguity",
    challenge: "Ambiguous natural language",
    solution: "Use a semantic layer to define canonical metrics and resolve ambiguity before SQL generation",
  },
  {
    id: "complex-schemas",
    challenge: "Complex database schemas",
    solution: "Provide focused schema context with only relevant tables and explicit column descriptions",
  },
  {
    id: "sql-injection",
    challenge: "SQL injection risk",
    solution: "Use parameterized queries, read-only connections, and query validation guardrails",
  },
  {
    id: "hallucination",
    challenge: "Hallucinated columns and tables",
    solution: "Include full schema definitions in the prompt and validate generated SQL against the schema",
  },
  {
    id: "performance",
    challenge: "Inefficient generated queries",
    solution: "Add query execution limits, EXPLAIN plan analysis, and iterative query refinement",
  },
];
