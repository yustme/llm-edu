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

/** The domain-specific question used in both simulations */
export const RAG_DEMO_QUERY =
  "What is our refund policy for enterprise customers?" as const;

// ---------------------------------------------------------------------------
// Retrieved document chunks (shown in the With-RAG step)
// ---------------------------------------------------------------------------

export interface RetrievedChunk {
  id: string;
  title: string;
  content: string;
  source: string;
  relevanceScore: number;
}

export const RETRIEVED_CHUNKS: RetrievedChunk[] = [
  {
    id: "chunk-1",
    title: "Enterprise Refund Policy",
    content:
      "Enterprise customers are entitled to a full refund within 60 days of purchase. After 60 days, a prorated refund is available based on the remaining contract term. Refund requests must be submitted through the account manager or via the enterprise support portal.",
    source: "policies/refund-policy-v3.md",
    relevanceScore: 0.94,
  },
  {
    id: "chunk-2",
    title: "Enterprise SLA Terms",
    content:
      "All enterprise contracts include a 60-day satisfaction guarantee. If the customer is not satisfied, they may request a full refund. Partial refunds after the guarantee period are calculated as (remaining_months / total_months) * contract_value, minus any usage-based charges already incurred.",
    source: "contracts/enterprise-sla-template.md",
    relevanceScore: 0.87,
  },
  {
    id: "chunk-3",
    title: "Billing FAQ - Enterprise",
    content:
      "Q: How long does an enterprise refund take? A: Refund requests are processed within 5-10 business days after approval by the finance team. The refund is issued to the original payment method. For wire transfers, allow an additional 3-5 business days for bank processing.",
    source: "support/billing-faq.md",
    relevanceScore: 0.79,
  },
];

// ---------------------------------------------------------------------------
// WITHOUT RAG: LLM answers without external knowledge
// ---------------------------------------------------------------------------

export const WITHOUT_RAG_STEPS: SimulationStep[] = [
  {
    id: "no-rag-1",
    type: "user-input",
    actor: "user",
    content: RAG_DEMO_QUERY,
    delayMs: DELAY.userInput,
  },
  {
    id: "no-rag-2",
    type: "llm-thinking",
    actor: "llm",
    content: "Processing the question...",
    delayMs: DELAY.thinking,
  },
  {
    id: "no-rag-3",
    type: "final-response",
    actor: "assistant",
    content:
      "Based on my general knowledge, most enterprise software companies offer a 30-day refund window. Typically, enterprise customers can request a refund by contacting their sales representative. However, I don't have access to your specific company's refund policy, so these details may not be accurate. I'd recommend checking your internal documentation or asking your legal/finance team for the exact terms.",
    delayMs: DELAY.finalResponse,
  },
];

// ---------------------------------------------------------------------------
// WITH RAG: Same question with retrieval-augmented generation
// ---------------------------------------------------------------------------

export const WITH_RAG_STEPS: SimulationStep[] = [
  {
    id: "rag-1",
    type: "user-input",
    actor: "user",
    content: RAG_DEMO_QUERY,
    delayMs: DELAY.userInput,
  },
  {
    id: "rag-2",
    type: "reasoning",
    actor: "agent",
    content:
      "I need to search the knowledge base for refund policy information specific to enterprise customers.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "rag-3",
    type: "tool-call",
    actor: "agent",
    content: "search_knowledge_base",
    metadata: {
      toolName: "search_knowledge_base",
      input: {
        query: "refund policy enterprise customers",
        top_k: 3,
      },
    },
    delayMs: DELAY.toolCall,
  },
  {
    id: "rag-4",
    type: "tool-result",
    actor: "tool",
    content: JSON.stringify(
      RETRIEVED_CHUNKS.map((c) => ({
        title: c.title,
        source: c.source,
        relevance: c.relevanceScore,
        excerpt: c.content.slice(0, 80) + "...",
      })),
      null,
      2,
    ),
    metadata: {
      toolName: "search_knowledge_base",
      output: RETRIEVED_CHUNKS.map((c) => ({
        title: c.title,
        source: c.source,
        relevance: c.relevanceScore,
      })),
    },
    delayMs: DELAY.toolResult,
  },
  {
    id: "rag-5",
    type: "reasoning",
    actor: "agent",
    content:
      "Found 3 relevant policy documents with high relevance scores. Let me synthesize an accurate answer from these sources.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "rag-6",
    type: "final-response",
    actor: "assistant",
    content:
      "According to our internal policy documents, the enterprise refund policy works as follows:\n\n1. **60-day full refund**: Enterprise customers can request a full refund within 60 days of purchase under the satisfaction guarantee.\n\n2. **Prorated refund after 60 days**: After the guarantee period, refunds are calculated as (remaining_months / total_months) x contract_value, minus any usage-based charges.\n\n3. **How to request**: Submit through your account manager or the enterprise support portal.\n\n4. **Processing time**: 5-10 business days after approval. Wire transfers may take an additional 3-5 business days.\n\n_Sources: policies/refund-policy-v3.md, contracts/enterprise-sla-template.md, support/billing-faq.md_",
    delayMs: DELAY.finalResponse,
  },
];

/**
 * Get the final response text from the without-RAG simulation.
 */
export function getWithoutRagFinalResponse(): string {
  const step = WITHOUT_RAG_STEPS.find((s) => s.type === "final-response");
  return step?.content ?? "";
}

/**
 * Get the final response text from the with-RAG simulation.
 */
export function getWithRagFinalResponse(): string {
  const step = WITH_RAG_STEPS.find((s) => s.type === "final-response");
  return step?.content ?? "";
}
