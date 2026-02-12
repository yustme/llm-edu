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

/** Available pre-built queries for the simulation */
export const PREBUILT_QUERIES = [
  "What was Q4 revenue?",
  "Show top 5 customers by revenue",
  "What's the monthly sales trend?",
] as const;

export type PrebuiltQuery = (typeof PREBUILT_QUERIES)[number];

// ---------------------------------------------------------------------------
// Plain LLM simulation steps (no tools, just text response)
// ---------------------------------------------------------------------------

const plainLlmSteps: Record<PrebuiltQuery, SimulationStep[]> = {
  "What was Q4 revenue?": [
    {
      id: "plain-q4-1",
      type: "user-input",
      actor: "user",
      content: "What was Q4 revenue?",
      delayMs: DELAY.userInput,
    },
    {
      id: "plain-q4-2",
      type: "llm-thinking",
      actor: "llm",
      content: "Processing the question...",
      delayMs: DELAY.thinking,
    },
    {
      id: "plain-q4-3",
      type: "final-response",
      actor: "assistant",
      content:
        "I'm sorry, but I don't have access to your company's database or financial records. As a language model, I can only work with the information provided in our conversation or from my training data. To get Q4 revenue figures, you would need to query your internal database or contact your finance team directly.",
      delayMs: DELAY.finalResponse,
    },
  ],

  "Show top 5 customers by revenue": [
    {
      id: "plain-top5-1",
      type: "user-input",
      actor: "user",
      content: "Show top 5 customers by revenue",
      delayMs: DELAY.userInput,
    },
    {
      id: "plain-top5-2",
      type: "llm-thinking",
      actor: "llm",
      content: "Processing the question...",
      delayMs: DELAY.thinking,
    },
    {
      id: "plain-top5-3",
      type: "final-response",
      actor: "assistant",
      content:
        "I apologize, but I don't have access to your customer database or revenue data. I'm a language model that works with text, so I cannot query databases or retrieve real-time business data. You would need to run a SQL query against your CRM or data warehouse to get this information.",
      delayMs: DELAY.finalResponse,
    },
  ],

  "What's the monthly sales trend?": [
    {
      id: "plain-trend-1",
      type: "user-input",
      actor: "user",
      content: "What's the monthly sales trend?",
      delayMs: DELAY.userInput,
    },
    {
      id: "plain-trend-2",
      type: "llm-thinking",
      actor: "llm",
      content: "Processing the question...",
      delayMs: DELAY.thinking,
    },
    {
      id: "plain-trend-3",
      type: "final-response",
      actor: "assistant",
      content:
        "Unfortunately, I don't have access to your sales data or any external databases. I can help you write a SQL query to calculate monthly sales trends, or explain how to analyze trends in general, but I cannot retrieve or display your actual data.",
      delayMs: DELAY.finalResponse,
    },
  ],
};

// ---------------------------------------------------------------------------
// Agent simulation steps (with tools, reasoning loop)
// ---------------------------------------------------------------------------

const agentSteps: Record<PrebuiltQuery, SimulationStep[]> = {
  "What was Q4 revenue?": [
    {
      id: "agent-q4-1",
      type: "user-input",
      actor: "user",
      content: "What was Q4 revenue?",
      delayMs: DELAY.userInput,
    },
    {
      id: "agent-q4-2",
      type: "reasoning",
      actor: "agent",
      content:
        "I need to query the database for Q4 2024 revenue data. I'll use the execute_sql tool to get the total revenue for October through December 2024, filtering for completed orders only.",
      delayMs: DELAY.reasoning,
    },
    {
      id: "agent-q4-3",
      type: "tool-call",
      actor: "agent",
      content: "execute_sql",
      metadata: {
        toolName: "execute_sql",
        input: {
          query:
            "SELECT SUM(order_amount - discount) as revenue FROM orders WHERE order_date >= '2024-10-01' AND order_date <= '2024-12-31' AND status = 'completed'",
        },
      },
      delayMs: DELAY.toolCall,
    },
    {
      id: "agent-q4-4",
      type: "tool-result",
      actor: "tool",
      content: '{"revenue": 173380}',
      metadata: {
        toolName: "execute_sql",
        output: { revenue: 173380 },
      },
      delayMs: DELAY.toolResult,
    },
    {
      id: "agent-q4-5",
      type: "reasoning",
      actor: "agent",
      content:
        "Got the total Q4 revenue: 173,380 CZK. Let me also get a monthly breakdown to provide more useful context.",
      delayMs: DELAY.reasoning,
    },
    {
      id: "agent-q4-6",
      type: "tool-call",
      actor: "agent",
      content: "execute_sql",
      metadata: {
        toolName: "execute_sql",
        input: {
          query:
            "SELECT MONTHNAME(order_date) as month, SUM(order_amount - discount) as revenue FROM orders WHERE order_date >= '2024-10-01' AND order_date <= '2024-12-31' AND status = 'completed' GROUP BY MONTH(order_date) ORDER BY MONTH(order_date)",
        },
      },
      delayMs: DELAY.toolCall,
    },
    {
      id: "agent-q4-7",
      type: "tool-result",
      actor: "tool",
      content:
        '[{"month": "October", "revenue": 52450}, {"month": "November", "revenue": 58120}, {"month": "December", "revenue": 62810}]',
      metadata: {
        toolName: "execute_sql",
        output: [
          { month: "October", revenue: 52450 },
          { month: "November", revenue: 58120 },
          { month: "December", revenue: 62810 },
        ],
      },
      delayMs: DELAY.toolResult,
    },
    {
      id: "agent-q4-8",
      type: "final-response",
      actor: "assistant",
      content:
        "Q4 2024 total revenue was 173,380 CZK (completed orders only).\n\nMonthly breakdown:\n- October: 52,450 CZK\n- November: 58,120 CZK (+10.8% MoM)\n- December: 62,810 CZK (+8.1% MoM)\n\nRevenue showed consistent growth throughout the quarter, with a total increase of 19.8% from October to December.",
      delayMs: DELAY.finalResponse,
    },
  ],

  "Show top 5 customers by revenue": [
    {
      id: "agent-top5-1",
      type: "user-input",
      actor: "user",
      content: "Show top 5 customers by revenue",
      delayMs: DELAY.userInput,
    },
    {
      id: "agent-top5-2",
      type: "reasoning",
      actor: "agent",
      content:
        "I need to find the top 5 customers ranked by total revenue. I'll join the orders and customers tables, filtering for completed orders, and aggregate by customer.",
      delayMs: DELAY.reasoning,
    },
    {
      id: "agent-top5-3",
      type: "tool-call",
      actor: "agent",
      content: "execute_sql",
      metadata: {
        toolName: "execute_sql",
        input: {
          query:
            "SELECT c.name, c.segment, SUM(o.order_amount - o.discount) as total_revenue, COUNT(o.order_id) as order_count FROM customers c JOIN orders o ON c.customer_id = o.customer_id WHERE o.status = 'completed' GROUP BY c.customer_id ORDER BY total_revenue DESC LIMIT 5",
        },
      },
      delayMs: DELAY.toolCall,
    },
    {
      id: "agent-top5-4",
      type: "tool-result",
      actor: "tool",
      content:
        '[{"name": "Acme Corp", "segment": "Enterprise", "total_revenue": 45200, "order_count": 8}, {"name": "TechStart s.r.o.", "segment": "SMB", "total_revenue": 38750, "order_count": 12}, {"name": "Global Industries", "segment": "Enterprise", "total_revenue": 31400, "order_count": 5}, {"name": "DataFlow a.s.", "segment": "Enterprise", "total_revenue": 28900, "order_count": 6}, {"name": "Creative Labs", "segment": "SMB", "total_revenue": 22100, "order_count": 9}]',
      metadata: {
        toolName: "execute_sql",
        output: [
          { name: "Acme Corp", segment: "Enterprise", total_revenue: 45200, order_count: 8 },
          { name: "TechStart s.r.o.", segment: "SMB", total_revenue: 38750, order_count: 12 },
          { name: "Global Industries", segment: "Enterprise", total_revenue: 31400, order_count: 5 },
          { name: "DataFlow a.s.", segment: "Enterprise", total_revenue: 28900, order_count: 6 },
          { name: "Creative Labs", segment: "SMB", total_revenue: 22100, order_count: 9 },
        ],
      },
      delayMs: DELAY.toolResult,
    },
    {
      id: "agent-top5-5",
      type: "reasoning",
      actor: "agent",
      content:
        "I have the top 5 customers. Let me format this into a clear, readable response with revenue amounts and key insights.",
      delayMs: DELAY.reasoning,
    },
    {
      id: "agent-top5-6",
      type: "final-response",
      actor: "assistant",
      content:
        "Top 5 customers by revenue (completed orders):\n\n1. Acme Corp (Enterprise) - 45,200 CZK (8 orders)\n2. TechStart s.r.o. (SMB) - 38,750 CZK (12 orders)\n3. Global Industries (Enterprise) - 31,400 CZK (5 orders)\n4. DataFlow a.s. (Enterprise) - 28,900 CZK (6 orders)\n5. Creative Labs (SMB) - 22,100 CZK (9 orders)\n\nKey insight: Enterprise customers dominate the top 5 (3 of 5), but TechStart s.r.o. from the SMB segment is #2 with the highest order count (12 orders), suggesting strong engagement.",
      delayMs: DELAY.finalResponse,
    },
  ],

  "What's the monthly sales trend?": [
    {
      id: "agent-trend-1",
      type: "user-input",
      actor: "user",
      content: "What's the monthly sales trend?",
      delayMs: DELAY.userInput,
    },
    {
      id: "agent-trend-2",
      type: "reasoning",
      actor: "agent",
      content:
        "The user wants to see monthly sales trends. I'll query for monthly aggregated revenue over the past year to show the trend clearly.",
      delayMs: DELAY.reasoning,
    },
    {
      id: "agent-trend-3",
      type: "tool-call",
      actor: "agent",
      content: "execute_sql",
      metadata: {
        toolName: "execute_sql",
        input: {
          query:
            "SELECT DATE_FORMAT(order_date, '%Y-%m') as month, COUNT(order_id) as orders, SUM(order_amount - discount) as revenue FROM orders WHERE status = 'completed' AND order_date >= '2024-01-01' GROUP BY DATE_FORMAT(order_date, '%Y-%m') ORDER BY month",
        },
      },
      delayMs: DELAY.toolCall,
    },
    {
      id: "agent-trend-4",
      type: "tool-result",
      actor: "tool",
      content:
        '[{"month": "2024-07", "orders": 15, "revenue": 42300}, {"month": "2024-08", "orders": 18, "revenue": 48900}, {"month": "2024-09", "orders": 20, "revenue": 51200}, {"month": "2024-10", "orders": 22, "revenue": 52450}, {"month": "2024-11", "orders": 25, "revenue": 58120}, {"month": "2024-12", "orders": 28, "revenue": 62810}]',
      metadata: {
        toolName: "execute_sql",
        output: [
          { month: "2024-07", orders: 15, revenue: 42300 },
          { month: "2024-08", orders: 18, revenue: 48900 },
          { month: "2024-09", orders: 20, revenue: 51200 },
          { month: "2024-10", orders: 22, revenue: 52450 },
          { month: "2024-11", orders: 25, revenue: 58120 },
          { month: "2024-12", orders: 28, revenue: 62810 },
        ],
      },
      delayMs: DELAY.toolResult,
    },
    {
      id: "agent-trend-5",
      type: "reasoning",
      actor: "agent",
      content:
        "The data shows a clear upward trend. Let me calculate growth rates and provide a comprehensive analysis.",
      delayMs: DELAY.reasoning,
    },
    {
      id: "agent-trend-6",
      type: "tool-call",
      actor: "agent",
      content: "execute_sql",
      metadata: {
        toolName: "execute_sql",
        input: {
          query:
            "SELECT ROUND(AVG(monthly_revenue), 0) as avg_monthly, ROUND(((MAX(monthly_revenue) - MIN(monthly_revenue)) / MIN(monthly_revenue)) * 100, 1) as growth_pct FROM (SELECT SUM(order_amount - discount) as monthly_revenue FROM orders WHERE status = 'completed' AND order_date >= '2024-07-01' GROUP BY DATE_FORMAT(order_date, '%Y-%m')) sub",
        },
      },
      delayMs: DELAY.toolCall,
    },
    {
      id: "agent-trend-7",
      type: "tool-result",
      actor: "tool",
      content: '{"avg_monthly": 52630, "growth_pct": 48.5}',
      metadata: {
        toolName: "execute_sql",
        output: { avg_monthly: 52630, growth_pct: 48.5 },
      },
      delayMs: DELAY.toolResult,
    },
    {
      id: "agent-trend-8",
      type: "final-response",
      actor: "assistant",
      content:
        "Monthly sales trend (H2 2024):\n\n- Jul: 42,300 CZK (15 orders)\n- Aug: 48,900 CZK (18 orders) +15.6%\n- Sep: 51,200 CZK (20 orders) +4.7%\n- Oct: 52,450 CZK (22 orders) +2.4%\n- Nov: 58,120 CZK (25 orders) +10.8%\n- Dec: 62,810 CZK (28 orders) +8.1%\n\nOverall: Revenue grew 48.5% from July to December. Average monthly revenue is 52,630 CZK. The trend is consistently positive with acceleration in Q4, driven by increasing order volume.",
      delayMs: DELAY.finalResponse,
    },
  ],
};

/**
 * Get the plain LLM simulation steps for a given query.
 */
export function getPlainLlmSteps(query: PrebuiltQuery): SimulationStep[] {
  return plainLlmSteps[query];
}

/**
 * Get the agent simulation steps for a given query.
 */
export function getAgentSteps(query: PrebuiltQuery): SimulationStep[] {
  return agentSteps[query];
}

/**
 * Get the final (apologetic) LLM response text for a given query.
 */
export function getPlainLlmFinalResponse(query: PrebuiltQuery): string {
  const steps = plainLlmSteps[query];
  const final = steps.find((s) => s.type === "final-response");
  return final?.content ?? "";
}

/**
 * Get the final agent response text for a given query.
 */
export function getAgentFinalResponse(query: PrebuiltQuery): string {
  const steps = agentSteps[query];
  const final = steps.find((s) => s.type === "final-response");
  return final?.content ?? "";
}
