import type { SimulationStep } from "@/types/agent.types";
import { SIMULATION } from "@/config/simulation.config";
import { MULTI_AGENT } from "@/config/multi-agent.config";

/** Timing constants for multi-agent simulation step delays (in milliseconds) */
const DELAY = {
  userInput: 300,
  reasoning: SIMULATION.defaultStepDelayMs,
  agentMessage: SIMULATION.defaultStepDelayMs,
  toolCall: SIMULATION.toolCallResultDelayMs,
  toolResult: 500,
  finalResponse: 400,
} as const;

/** Agent actor identifiers matching config keys */
export const ACTOR = {
  user: "user",
  dataAnalyst: "data-analyst",
  dataEngineer: "data-engineer",
  reportingAgent: "reporting-agent",
} as const;

export type AgentActor = (typeof ACTOR)[keyof typeof ACTOR];

/** The task used in the multi-agent demo */
export const DEMO_TASK = MULTI_AGENT.demoTask;

/**
 * Complete multi-agent simulation message sequence (14 messages).
 * Task: "Show monthly sales trend by category for 2025"
 *
 * Flow:
 * User -> Data Analyst -> Data Engineer -> Data Analyst -> Reporting Agent -> User
 */
export const MULTI_AGENT_STEPS: SimulationStep[] = [
  // 1. User sends the request
  {
    id: "ma-1",
    type: "user-input",
    actor: ACTOR.user,
    content: MULTI_AGENT.demoTask,
    delayMs: DELAY.userInput,
  },

  // 2. Data Analyst reasons about the request
  {
    id: "ma-2",
    type: "reasoning",
    actor: ACTOR.dataAnalyst,
    content:
      "I need to break down this request into specific data requirements. The user wants monthly sales aggregated by product category for the year 2025. I'll need to coordinate with the Data Engineer to get the right SQL query and then pass the results to the Reporting Agent for visualization.",
    metadata: {
      toolName: "analyze_query",
    },
    delayMs: DELAY.reasoning,
  },

  // 3. Data Analyst sends instructions to Data Engineer
  {
    id: "ma-3",
    type: "agent-message",
    actor: ACTOR.dataAnalyst,
    content:
      "I need monthly aggregated sales data by product category for 2025. Please write an optimized SQL query that: (1) Joins orders with products table, (2) Filters for completed orders in 2025, (3) Groups by month and product category, (4) Calculates total revenue as SUM(order_amount - discount). Order results by month ascending, then category.",
    metadata: {
      from: ACTOR.dataAnalyst,
      to: ACTOR.dataEngineer,
    },
    delayMs: DELAY.agentMessage,
  },

  // 4. Data Engineer reasons about the SQL approach
  {
    id: "ma-4",
    type: "reasoning",
    actor: ACTOR.dataEngineer,
    content:
      "I'll write an optimized SQL query with GROUP BY on both month and category. I'll use DATE_FORMAT for monthly aggregation, join the products table for category names, and filter for completed orders only. Adding ORDER BY for consistent output.",
    delayMs: DELAY.reasoning,
  },

  // 5. Data Engineer executes SQL
  {
    id: "ma-5",
    type: "tool-call",
    actor: ACTOR.dataEngineer,
    content: "execute_sql",
    metadata: {
      toolName: "execute_sql",
      toolInput: `SELECT
  DATE_FORMAT(o.order_date, '%Y-%m') AS month,
  p.category,
  COUNT(o.order_id) AS order_count,
  SUM(o.order_amount - o.discount) AS revenue
FROM orders o
JOIN products p ON o.product_id = p.product_id
WHERE o.status = 'completed'
  AND o.order_date >= '2025-01-01'
  AND o.order_date < '2026-01-01'
GROUP BY DATE_FORMAT(o.order_date, '%Y-%m'), p.category
ORDER BY month ASC, p.category ASC`,
    },
    delayMs: DELAY.toolCall,
  },

  // 6. Tool result with monthly data
  {
    id: "ma-6",
    type: "tool-result",
    actor: ACTOR.dataEngineer,
    content: "Query executed successfully. 24 rows returned.",
    metadata: {
      toolName: "execute_sql",
      toolOutput: JSON.stringify(
        [
          { month: "2025-01", category: "Electronics", order_count: 12, revenue: 45200 },
          { month: "2025-01", category: "Software", order_count: 8, revenue: 22400 },
          { month: "2025-02", category: "Electronics", order_count: 15, revenue: 52100 },
          { month: "2025-02", category: "Software", order_count: 10, revenue: 28300 },
          { month: "2025-03", category: "Electronics", order_count: 18, revenue: 61400 },
          { month: "2025-03", category: "Software", order_count: 12, revenue: 33800 },
          { month: "2025-04", category: "Electronics", order_count: 14, revenue: 48900 },
          { month: "2025-04", category: "Software", order_count: 11, revenue: 30200 },
          { month: "2025-05", category: "Electronics", order_count: 20, revenue: 68500 },
          { month: "2025-05", category: "Software", order_count: 14, revenue: 38900 },
          { month: "2025-06", category: "Electronics", order_count: 22, revenue: 74200 },
          { month: "2025-06", category: "Software", order_count: 16, revenue: 42100 },
        ],
        null,
        2,
      ),
    },
    delayMs: DELAY.toolResult,
  },

  // 7. Data Engineer sends results back to Data Analyst
  {
    id: "ma-7",
    type: "agent-message",
    actor: ACTOR.dataEngineer,
    content:
      "Query completed successfully. Here are the monthly sales by category for H1 2025 (24 rows total). The data shows Electronics and Software categories with monthly revenue and order counts. Electronics ranges from 45,200 to 74,200 CZK/month, Software from 22,400 to 42,100 CZK/month. Both show an upward trend.",
    metadata: {
      from: ACTOR.dataEngineer,
      to: ACTOR.dataAnalyst,
    },
    delayMs: DELAY.agentMessage,
  },

  // 8. Data Analyst analyzes the trends
  {
    id: "ma-8",
    type: "reasoning",
    actor: ACTOR.dataAnalyst,
    content:
      "Let me analyze the trends in this data. Electronics grew from 45,200 to 74,200 CZK (+64.2% over 6 months). Software grew from 22,400 to 42,100 CZK (+87.9%). Both categories show strong growth, with Software growing faster percentage-wise. Total revenue increased from 67,600 to 116,300 CZK. I'll pass this analysis to the Reporting Agent for visualization.",
    metadata: {
      toolName: "interpret_results",
    },
    delayMs: DELAY.reasoning,
  },

  // 9. Data Analyst sends report request to Reporting Agent
  {
    id: "ma-9",
    type: "agent-message",
    actor: ACTOR.dataAnalyst,
    content:
      "Please create a comprehensive report with: (1) A monthly trend line chart showing revenue by category over H1 2025, (2) Category breakdown summary with growth rates, (3) Key insights: Electronics +64.2% growth, Software +87.9% growth, total H1 revenue 596,000 CZK. Highlight that May-June showed the strongest performance.",
    metadata: {
      from: ACTOR.dataAnalyst,
      to: ACTOR.reportingAgent,
    },
    delayMs: DELAY.agentMessage,
  },

  // 10. Reporting Agent reasons about report format
  {
    id: "ma-10",
    type: "reasoning",
    actor: ACTOR.reportingAgent,
    content:
      "I'll format this into a clear, executive-ready report. I'll create a trend chart showing both categories month over month, add a summary table with growth metrics, and highlight the key insights the analyst identified.",
    delayMs: DELAY.reasoning,
  },

  // 11. Reporting Agent creates chart and formats report
  {
    id: "ma-11",
    type: "tool-call",
    actor: ACTOR.reportingAgent,
    content: "create_chart + format_report",
    metadata: {
      toolName: "create_chart",
      toolInput: "Line chart: Monthly Revenue by Category (Jan-Jun 2025)",
    },
    delayMs: DELAY.toolCall,
  },

  // 12. Tool result - chart created
  {
    id: "ma-12",
    type: "tool-result",
    actor: ACTOR.reportingAgent,
    content: "Chart and report generated successfully.",
    metadata: {
      toolName: "format_report",
      toolOutput: "Report formatted with trend chart, category breakdown, and key insights.",
    },
    delayMs: DELAY.toolResult,
  },

  // 13. Reporting Agent delivers the final report to user
  {
    id: "ma-13",
    type: "final-response",
    actor: ACTOR.reportingAgent,
    content: `Monthly Sales Trend by Category - H1 2025

TREND OVERVIEW:
Jan: Electronics 45,200 CZK | Software 22,400 CZK | Total 67,600 CZK
Feb: Electronics 52,100 CZK | Software 28,300 CZK | Total 80,400 CZK
Mar: Electronics 61,400 CZK | Software 33,800 CZK | Total 95,200 CZK
Apr: Electronics 48,900 CZK | Software 30,200 CZK | Total 79,100 CZK
May: Electronics 68,500 CZK | Software 38,900 CZK | Total 107,400 CZK
Jun: Electronics 74,200 CZK | Software 42,100 CZK | Total 116,300 CZK

CATEGORY PERFORMANCE:
- Electronics: +64.2% growth (45,200 -> 74,200 CZK), 101 total orders
- Software: +87.9% growth (22,400 -> 42,100 CZK), 71 total orders

KEY INSIGHTS:
1. Total H1 2025 revenue: 545,900 CZK across both categories
2. Software is growing faster (+87.9%) despite lower absolute numbers
3. May-June showed the strongest performance with combined revenue of 223,700 CZK
4. April dip in Electronics was temporary - recovered strongly in May
5. Both categories show consistent upward trajectory`,
    metadata: {
      from: ACTOR.reportingAgent,
      to: ACTOR.user,
    },
    delayMs: DELAY.finalResponse,
  },
];

/**
 * Get the actor display info for the workflow visualization.
 */
export function getActorDisplayName(actor: string): string {
  switch (actor) {
    case ACTOR.dataAnalyst:
      return "Data Analyst";
    case ACTOR.dataEngineer:
      return "Data Engineer";
    case ACTOR.reportingAgent:
      return "Reporting Agent";
    case ACTOR.user:
      return "User";
    default:
      return actor;
  }
}

/**
 * Get the message target for display purposes.
 */
export function getMessageTarget(step: SimulationStep): string | null {
  return (step.metadata?.to as string) ?? null;
}

/**
 * Get the message source for display purposes.
 */
export function getMessageSource(step: SimulationStep): string | null {
  return (step.metadata?.from as string) ?? null;
}
