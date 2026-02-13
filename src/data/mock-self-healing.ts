import type { SimulationStep } from "@/types/agent.types";
import { SIMULATION } from "@/config/simulation.config";

// ---------------------------------------------------------------------------
// Timing constants for simulation step delays (in milliseconds)
// ---------------------------------------------------------------------------

const DELAY = {
  userInput: 300,
  thinking: SIMULATION.thinkingDelayMs,
  reasoning: SIMULATION.defaultStepDelayMs,
  toolCall: SIMULATION.toolCallResultDelayMs,
  toolResult: 500,
  finalResponse: 400,
} as const;

// ---------------------------------------------------------------------------
// SQL Self-Healing Simulation: Error -> Analyze -> Fix -> Retry
// ---------------------------------------------------------------------------

export const SQL_SELF_HEALING_STEPS: SimulationStep[] = [
  {
    id: "sh-1",
    type: "user-input",
    actor: "user",
    content: "Show me total revenue by department",
    delayMs: DELAY.userInput,
  },
  {
    id: "sh-2",
    type: "llm-thinking",
    actor: "llm",
    content: "Analyzing the question...",
    delayMs: DELAY.thinking,
  },
  {
    id: "sh-3",
    type: "reasoning",
    actor: "Generate SQL",
    content:
      "The user wants revenue grouped by department. I will query the dept_revenue table for aggregated totals.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "sh-4",
    type: "tool-call",
    actor: "execute_sql",
    content: "Executing SQL query...",
    delayMs: DELAY.toolCall,
    metadata: {
      input: {
        query:
          "SELECT department, SUM(revenue) AS total_revenue FROM dept_revenue GROUP BY department ORDER BY total_revenue DESC",
      },
    },
  },
  {
    id: "sh-5",
    type: "tool-result",
    actor: "execute_sql",
    content: "Query execution failed",
    delayMs: DELAY.toolResult,
    metadata: {
      result: {
        error:
          "Table 'dept_revenue' does not exist. Available tables: employees, departments, orders, products",
      },
    },
  },
  {
    id: "sh-6",
    type: "reasoning",
    actor: "Analyze Error",
    content:
      "The query failed because table 'dept_revenue' does not exist. The error message lists available tables: employees, departments, orders, products. I need to inspect the schema of relevant tables to build a correct query.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "sh-7",
    type: "tool-call",
    actor: "get_schema",
    content: "Fetching schema for departments and orders tables...",
    delayMs: DELAY.toolCall,
    metadata: {
      input: {
        tables: ["departments", "orders"],
      },
    },
  },
  {
    id: "sh-8",
    type: "tool-result",
    actor: "get_schema",
    content: "Schema retrieved successfully",
    delayMs: DELAY.toolResult,
    metadata: {
      result: {
        departments: {
          columns: ["id INT PK", "name VARCHAR(100)"],
        },
        orders: {
          columns: [
            "id INT PK",
            "department_id INT FK -> departments.id",
            "amount DECIMAL(10,2)",
            "date DATE",
          ],
        },
      },
    },
  },
  {
    id: "sh-9",
    type: "reasoning",
    actor: "Fix Query",
    content:
      "Now I understand the schema. I need to JOIN departments with orders on department_id and SUM the order amounts. Let me generate the corrected query.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "sh-10",
    type: "tool-call",
    actor: "execute_sql",
    content: "Executing corrected SQL query...",
    delayMs: DELAY.toolCall,
    metadata: {
      input: {
        query:
          "SELECT d.name, SUM(o.amount) AS total_revenue FROM departments d JOIN orders o ON d.id = o.department_id GROUP BY d.name ORDER BY total_revenue DESC",
      },
    },
  },
  {
    id: "sh-11",
    type: "tool-result",
    actor: "execute_sql",
    content: "Query executed successfully",
    delayMs: DELAY.toolResult,
    metadata: {
      result: [
        { name: "Engineering", total_revenue: 125000 },
        { name: "Sales", total_revenue: 98000 },
        { name: "Marketing", total_revenue: 67500 },
        { name: "Support", total_revenue: 43200 },
      ],
    },
  },
  {
    id: "sh-12",
    type: "final-response",
    actor: "assistant",
    content:
      "Here are the total revenue figures by department:\n\n1. Engineering: 125,000\n2. Sales: 98,000\n3. Marketing: 67,500\n4. Support: 43,200\n\nEngineering leads with the highest revenue, followed by Sales. Note: I initially referenced a non-existent table but corrected the query after reviewing the actual database schema.",
    delayMs: DELAY.finalResponse,
  },
];

// ---------------------------------------------------------------------------
// Error Classification Data
// ---------------------------------------------------------------------------

export interface ErrorClassification {
  id: string;
  type: string;
  iconName: string;
  color: string;
  example: string;
  recovery: string;
  canSelfHeal: boolean;
}

export const ERROR_CLASSIFICATIONS: ErrorClassification[] = [
  {
    id: "schema",
    type: "Schema",
    iconName: "Database",
    color: "text-blue-600 bg-blue-100",
    example: "Table 'dept_revenue' does not exist",
    recovery: "Fetch available tables and column schema, then regenerate the query using correct names",
    canSelfHeal: true,
  },
  {
    id: "syntax",
    type: "Syntax",
    iconName: "Code",
    color: "text-purple-600 bg-purple-100",
    example: "Syntax error near 'GROUPP BY'",
    recovery: "Parse the error message, identify the typo or malformed clause, and regenerate valid SQL",
    canSelfHeal: true,
  },
  {
    id: "permission",
    type: "Permission",
    iconName: "ShieldAlert",
    color: "text-red-600 bg-red-100",
    example: "Access denied for user 'readonly' to table 'admin_logs'",
    recovery: "Cannot resolve without elevated privileges. Inform the user and suggest contacting an administrator",
    canSelfHeal: false,
  },
  {
    id: "timeout",
    type: "Timeout",
    iconName: "Clock",
    color: "text-amber-600 bg-amber-100",
    example: "Query execution exceeded 30s timeout",
    recovery: "Simplify the query by adding LIMIT, removing unnecessary JOINs, or breaking into smaller queries",
    canSelfHeal: true,
  },
  {
    id: "data",
    type: "Data",
    iconName: "AlertTriangle",
    color: "text-orange-600 bg-orange-100",
    example: "Division by zero in column 'avg_price'",
    recovery: "Add NULLIF or CASE WHEN guards to handle edge cases in the data, then retry",
    canSelfHeal: true,
  },
  {
    id: "rate-limit",
    type: "Rate Limit",
    iconName: "Ban",
    color: "text-gray-600 bg-gray-100",
    example: "API rate limit exceeded. Retry after 60 seconds",
    recovery: "Cannot bypass rate limits. Wait for the cooldown period or escalate to the user for manual retry",
    canSelfHeal: false,
  },
];

// ---------------------------------------------------------------------------
// Broader Self-Healing Scenario Data
// ---------------------------------------------------------------------------

export interface ScenarioStep {
  label: string;
  content: string;
  isError: boolean;
}

export interface SelfHealingScenario {
  id: string;
  name: string;
  description: string;
  steps: ScenarioStep[];
}

export const SELF_HEALING_SCENARIOS: SelfHealingScenario[] = [
  {
    id: "sql",
    name: "SQL",
    description: "Agent corrects a wrong table reference after receiving a database error",
    steps: [
      {
        label: "Generate",
        content: "SELECT * FROM sales_summary WHERE quarter = 'Q4'",
        isError: false,
      },
      {
        label: "Execute",
        content: "Running query against database...",
        isError: false,
      },
      {
        label: "Error",
        content: "Table 'sales_summary' does not exist. Available: orders, products, departments",
        isError: true,
      },
      {
        label: "Analyze",
        content: "The table name is wrong. Checking schema for correct tables...",
        isError: false,
      },
      {
        label: "Fix",
        content:
          "SELECT d.name, SUM(o.amount) FROM departments d JOIN orders o ON d.id = o.department_id GROUP BY d.name",
        isError: false,
      },
      {
        label: "Success",
        content: "Query returned 4 rows with department revenue data",
        isError: false,
      },
    ],
  },
  {
    id: "api",
    name: "API",
    description: "Agent handles a changed API endpoint by discovering the new URL from docs",
    steps: [
      {
        label: "Generate",
        content: "GET /api/v1/users/profile",
        isError: false,
      },
      {
        label: "Execute",
        content: "Sending HTTP request to API endpoint...",
        isError: false,
      },
      {
        label: "Error",
        content: "404 Not Found - Endpoint /api/v1/users/profile has been deprecated. See /api/v2/",
        isError: true,
      },
      {
        label: "Analyze",
        content: "The endpoint was moved to v2. Reading API documentation for the new path...",
        isError: false,
      },
      {
        label: "Fix",
        content: "GET /api/v2/users/me",
        isError: false,
      },
      {
        label: "Success",
        content: "200 OK - User profile data retrieved successfully",
        isError: false,
      },
    ],
  },
  {
    id: "codegen",
    name: "Code Gen",
    description: "Agent fixes generated code after a runtime type error",
    steps: [
      {
        label: "Generate",
        content: "data.map(item => item.price.toFixed(2))",
        isError: false,
      },
      {
        label: "Execute",
        content: "Running generated code in sandbox...",
        isError: false,
      },
      {
        label: "Error",
        content: "TypeError: Cannot read property 'toFixed' of null at item index 3",
        isError: true,
      },
      {
        label: "Analyze",
        content: "Some items have null price values. Need to add null-safety checks...",
        isError: false,
      },
      {
        label: "Fix",
        content: "data.map(item => item.price != null ? item.price.toFixed(2) : 'N/A')",
        isError: false,
      },
      {
        label: "Success",
        content: "Code executed successfully, 10 items processed with 1 null handled",
        isError: false,
      },
    ],
  },
];
