import type { SimulationStep } from "@/types/agent.types";
import { SIMULATION } from "@/config/simulation.config";

/** Timing constants for simulation step delays (in milliseconds) */
const DELAY = {
  userInput: 300,
  thinking: SIMULATION.thinkingDelayMs,
  reasoning: SIMULATION.defaultStepDelayMs,
  toolCall: SIMULATION.toolCallResultDelayMs,
  toolResult: 500,
  finalResponse: 400,
} as const;

// ---------------------------------------------------------------------------
// Simple single-table query: "How many orders in December?"
// ---------------------------------------------------------------------------

export const SIMPLE_QUERY_STEPS: SimulationStep[] = [
  {
    id: "simple-1",
    type: "user-input",
    actor: "user",
    content: "How many orders were placed in December?",
    delayMs: DELAY.userInput,
  },
  {
    id: "simple-2",
    type: "llm-thinking",
    actor: "llm",
    content: "Analyzing the question...",
    delayMs: DELAY.thinking,
  },
  {
    id: "simple-3",
    type: "reasoning",
    actor: "Analyze Question",
    content:
      "The user wants a count of orders filtered by month. This requires a COUNT aggregation with a date range filter on the orders table.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "simple-4",
    type: "reasoning",
    actor: "Identify Table",
    content:
      "Only the 'orders' table is needed. The relevant columns are 'order_date' for filtering. No JOINs required.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "simple-5",
    type: "tool-call",
    actor: "execute_sql",
    content: "Executing SQL query...",
    delayMs: DELAY.toolCall,
    metadata: {
      input: {
        query:
          "SELECT COUNT(*) AS order_count FROM orders WHERE order_date >= '2024-12-01' AND order_date <= '2024-12-31'",
      },
    },
  },
  {
    id: "simple-6",
    type: "tool-result",
    actor: "execute_sql",
    content: "Query executed successfully",
    delayMs: DELAY.toolResult,
    metadata: {
      result: { order_count: 8 },
    },
  },
  {
    id: "simple-7",
    type: "final-response",
    actor: "assistant",
    content:
      "There were 8 orders placed in December 2024. This includes all order statuses (completed, cancelled, returned, and pending).",
    delayMs: DELAY.finalResponse,
  },
];

// ---------------------------------------------------------------------------
// Complex multi-table JOIN: "Revenue by product category?"
// ---------------------------------------------------------------------------

export const COMPLEX_QUERY_STEPS: SimulationStep[] = [
  {
    id: "complex-1",
    type: "user-input",
    actor: "user",
    content: "What is the revenue by product category?",
    delayMs: DELAY.userInput,
  },
  {
    id: "complex-2",
    type: "llm-thinking",
    actor: "llm",
    content: "Analyzing the question...",
    delayMs: DELAY.thinking,
  },
  {
    id: "complex-3",
    type: "reasoning",
    actor: "Analyze Question",
    content:
      "The user wants revenue broken down by product category. 'Revenue' means order_amount minus discount for completed orders. Categories are in the products table, so a JOIN is needed.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "complex-4",
    type: "reasoning",
    actor: "Identify Tables",
    content:
      "Two tables required: 'orders' (for order_amount, discount, status) and 'products' (for category). JOIN on product_id.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "complex-5",
    type: "reasoning",
    actor: "Plan JOIN Strategy",
    content:
      "Use INNER JOIN between orders and products on product_id. Filter orders WHERE status = 'completed'. GROUP BY category, ORDER BY revenue DESC.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "complex-6",
    type: "tool-call",
    actor: "execute_sql",
    content: "Executing SQL query...",
    delayMs: DELAY.toolCall,
    metadata: {
      input: {
        query:
          "SELECT p.category, SUM(o.order_amount - o.discount) AS revenue FROM orders o JOIN products p ON o.product_id = p.product_id WHERE o.status = 'completed' GROUP BY p.category ORDER BY revenue DESC",
      },
    },
  },
  {
    id: "complex-7",
    type: "tool-result",
    actor: "execute_sql",
    content: "Query executed successfully",
    delayMs: DELAY.toolResult,
    metadata: {
      result: [
        { category: "Electronics", revenue: 62500 },
        { category: "Hardware", revenue: 30400 },
        { category: "Software", revenue: 36855 },
        { category: "Accessories", revenue: 32275 },
      ],
    },
  },
  {
    id: "complex-8",
    type: "final-response",
    actor: "assistant",
    content:
      "Revenue by product category (completed orders only):\n\n• Electronics: 62,500 CZK\n• Software: 36,855 CZK\n• Accessories: 32,275 CZK\n• Hardware: 30,400 CZK\n\nElectronics leads with the highest revenue, driven by Laptop Pro 15 and Monitor 27\" sales.",
    delayMs: DELAY.finalResponse,
  },
];

// ---------------------------------------------------------------------------
// Schema context comparison (hallucinated vs correct SQL)
// ---------------------------------------------------------------------------

/** SQL generated without schema context - references non-existent columns/tables */
export const HALLUCINATED_SQL = `-- Without schema context the LLM hallucinates
SELECT category, SUM(revenue) AS total_revenue
FROM sales
WHERE year = 2024 AND quarter = 'Q4'
GROUP BY category
ORDER BY total_revenue DESC;

-- Problems:
-- ✗ Table 'sales' does not exist (actual: 'orders')
-- ✗ Column 'revenue' does not exist
-- ✗ Columns 'year' and 'quarter' do not exist
-- ✗ No JOIN to products table for category`;

/** SQL generated with proper schema context */
export const CORRECT_SQL = `-- With schema context the LLM generates valid SQL
SELECT p.category,
       SUM(o.order_amount - o.discount) AS revenue
FROM orders o
JOIN products p ON o.product_id = p.product_id
WHERE o.status = 'completed'
GROUP BY p.category
ORDER BY revenue DESC;

-- Correct:
-- ✓ Uses actual table names (orders, products)
-- ✓ Uses actual column names
-- ✓ Proper JOIN on product_id
-- ✓ Filters by status = 'completed'`;
