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
  agentMessage: 600,
  finalResponse: 400,
} as const;

// ---------------------------------------------------------------------------
// Autonomy Spectrum Levels
// ---------------------------------------------------------------------------

export interface AutonomyLevel {
  id: string;
  label: string;
  description: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  examples: string[];
  color: string;
}

export const AUTONOMY_LEVELS: AutonomyLevel[] = [
  {
    id: "manual",
    label: "Fully Manual",
    description:
      "Human performs every action. AI provides no assistance. All decisions and executions are done by the operator.",
    riskLevel: "low",
    examples: ["Manual data entry", "Hand-written reports"],
    color: "bg-green-500",
  },
  {
    id: "assisted",
    label: "AI-Assisted",
    description:
      "AI suggests actions, but human must approve and execute each one. The agent drafts, the human decides.",
    riskLevel: "low",
    examples: ["Auto-complete suggestions", "Spell check", "Code copilot"],
    color: "bg-emerald-500",
  },
  {
    id: "supervised",
    label: "Supervised Autonomy",
    description:
      "AI executes routine tasks automatically but escalates uncertain or high-impact decisions to a human for approval.",
    riskLevel: "medium",
    examples: [
      "Automated email sorting with escalation",
      "Data cleanup with human review for deletions",
    ],
    color: "bg-amber-500",
  },
  {
    id: "autonomous-bounded",
    label: "Bounded Autonomy",
    description:
      "AI operates independently within predefined guardrails. Humans set policies and review outcomes periodically.",
    riskLevel: "high",
    examples: [
      "Automated trading within risk limits",
      "CI/CD pipeline with rollback",
    ],
    color: "bg-orange-500",
  },
  {
    id: "fully-autonomous",
    label: "Fully Autonomous",
    description:
      "AI makes all decisions and executes without human intervention. No approval gates. Maximum risk if unchecked.",
    riskLevel: "critical",
    examples: [
      "Self-driving vehicles",
      "Autonomous weapons systems",
      "Unmonitored trading bots",
    ],
    color: "bg-red-500",
  },
];

// ---------------------------------------------------------------------------
// Approval Patterns
// ---------------------------------------------------------------------------

export interface ApprovalPatternNode {
  id: string;
  label: string;
  type: "agent" | "action" | "human" | "result" | "decision";
}

export interface ApprovalPatternEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ApprovalPattern {
  id: "pre-action" | "post-action" | "escalation";
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  nodes: ApprovalPatternNode[];
  edges: ApprovalPatternEdge[];
}

export const APPROVAL_PATTERNS: ApprovalPattern[] = [
  {
    id: "pre-action",
    name: "Pre-Action Approval",
    description:
      "The agent analyzes the situation and proposes an action, then waits for human approval before executing. Safest pattern for high-stakes operations.",
    pros: [
      "Maximum safety - nothing happens without approval",
      "Human maintains full control",
      "Clear audit trail of decisions",
    ],
    cons: [
      "Slower execution due to wait times",
      "Can create bottlenecks if humans are unavailable",
      "Approval fatigue on repetitive tasks",
    ],
    nodes: [
      { id: "agent-analyze", label: "Agent Analyzes", type: "agent" },
      { id: "propose", label: "Propose Action", type: "action" },
      { id: "human-review", label: "Human Reviews", type: "human" },
      { id: "execute", label: "Execute", type: "result" },
    ],
    edges: [
      { from: "agent-analyze", to: "propose" },
      { from: "propose", to: "human-review" },
      { from: "human-review", to: "execute", label: "Approve" },
    ],
  },
  {
    id: "post-action",
    name: "Post-Action Review",
    description:
      "The agent executes the action immediately, then presents results for human review. Human can undo or correct if needed. Best for reversible, low-risk operations.",
    pros: [
      "Fast execution with no waiting",
      "Human can review at their own pace",
      "Good for reversible operations",
    ],
    cons: [
      "Risk of irreversible mistakes",
      "Human must review every action",
      "Undo may not fully reverse side effects",
    ],
    nodes: [
      { id: "agent-decide", label: "Agent Decides", type: "agent" },
      { id: "execute", label: "Execute Action", type: "action" },
      { id: "human-review", label: "Human Reviews", type: "human" },
      { id: "result", label: "Keep / Undo", type: "result" },
    ],
    edges: [
      { from: "agent-decide", to: "execute" },
      { from: "execute", to: "human-review" },
      { from: "human-review", to: "result", label: "Verify" },
    ],
  },
  {
    id: "escalation",
    name: "Confidence-Based Escalation",
    description:
      "The agent handles high-confidence tasks autonomously but escalates uncertain or novel situations to a human. Balances speed with safety.",
    pros: [
      "Efficient for routine tasks",
      "Humans focus on hard decisions only",
      "Scales well with volume",
    ],
    cons: [
      "Requires well-calibrated confidence scores",
      "Threshold tuning can be tricky",
      "Mis-calibrated confidence leads to errors",
    ],
    nodes: [
      { id: "agent-analyze", label: "Agent Analyzes", type: "agent" },
      { id: "confidence", label: "Check Confidence", type: "decision" },
      { id: "auto-execute", label: "Auto-Execute", type: "result" },
      { id: "escalate", label: "Escalate to Human", type: "human" },
    ],
    edges: [
      { from: "agent-analyze", to: "confidence" },
      { from: "confidence", to: "auto-execute", label: "High" },
      { from: "confidence", to: "escalate", label: "Low" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Feedback & Learning Cycle
// ---------------------------------------------------------------------------

export interface FeedbackCycleStep {
  id: string;
  label: string;
  description: string;
  icon: "bot" | "user" | "refresh" | "trending-up";
}

export const FEEDBACK_CYCLE_STEPS: FeedbackCycleStep[] = [
  {
    id: "act",
    label: "Agent Acts",
    description:
      "The agent processes a request and generates an output (answer, action, recommendation).",
    icon: "bot",
  },
  {
    id: "rate",
    label: "Human Rates",
    description:
      "A human evaluator provides feedback: thumbs up/down, preference ranking, or correction.",
    icon: "user",
  },
  {
    id: "learn",
    label: "Model Updates",
    description:
      "Feedback is aggregated into training data. The model is fine-tuned or its prompts are adjusted.",
    icon: "refresh",
  },
  {
    id: "improve",
    label: "Performance Improves",
    description:
      "The updated model produces better outputs, which are evaluated again, continuing the cycle.",
    icon: "trending-up",
  },
];

export interface FeedbackSignal {
  name: string;
  description: string;
  strength: "weak" | "medium" | "strong";
}

export const FEEDBACK_SIGNALS: FeedbackSignal[] = [
  {
    name: "Binary Rating",
    description: "Thumbs up / thumbs down on agent outputs",
    strength: "weak",
  },
  {
    name: "Preference Ranking",
    description: "Compare two outputs and pick the better one (used in RLHF)",
    strength: "medium",
  },
  {
    name: "Corrections",
    description: "Human edits the agent output to show the ideal response",
    strength: "strong",
  },
  {
    name: "Detailed Critique",
    description:
      "Written explanation of what was wrong and how to improve it",
    strength: "strong",
  },
  {
    name: "Implicit Signals",
    description:
      "User accepts suggestion, clicks away, or re-asks the question",
    strength: "weak",
  },
];

// ---------------------------------------------------------------------------
// Interactive Approval Demo Simulation Steps
// ---------------------------------------------------------------------------

export const APPROVAL_DEMO_STEPS: SimulationStep[] = [
  {
    id: "hitl-1",
    type: "user-input",
    actor: "user",
    content: "Clean up the customer database - remove duplicates and fix formatting issues.",
    delayMs: DELAY.userInput,
  },
  {
    id: "hitl-2",
    type: "llm-thinking",
    actor: "llm",
    content: "Analyzing the customer database for issues...",
    delayMs: DELAY.thinking,
  },
  {
    id: "hitl-3",
    type: "tool-call",
    actor: "analyze_database",
    content: "Scanning customer records for duplicates and formatting issues...",
    delayMs: DELAY.toolCall,
    metadata: {
      input: {
        table: "customers",
        checks: ["duplicates", "formatting", "missing_fields"],
      },
    },
  },
  {
    id: "hitl-4",
    type: "tool-result",
    actor: "analyze_database",
    content: "Analysis complete",
    delayMs: DELAY.toolResult,
    metadata: {
      result: {
        total_records: 12847,
        duplicates_found: 53,
        formatting_issues: 127,
        missing_emails: 34,
      },
    },
  },
  {
    id: "hitl-5",
    type: "reasoning",
    actor: "Plan Actions",
    content:
      "Found 53 duplicate records and 127 formatting issues. Deleting duplicates is destructive and irreversible. I should request human approval before proceeding with the deletion. Formatting fixes are safer but still need review.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "hitl-6",
    type: "agent-message",
    actor: "assistant",
    content:
      "I found 53 duplicate records and 127 formatting issues in the customer database (12,847 total records). I propose the following actions:\n\n1. DELETE 53 duplicate records (confidence: 0.85)\n2. FIX 127 email formatting issues (confidence: 0.92)\n3. FLAG 34 records with missing emails for review\n\nAction #1 is destructive and irreversible. Awaiting your approval before proceeding.",
    delayMs: DELAY.agentMessage,
    metadata: {
      awaitApproval: true,
      proposedActions: [
        {
          id: "delete-dupes",
          label: "Delete 53 duplicates",
          confidence: 0.85,
          risk: "high",
        },
        {
          id: "fix-formatting",
          label: "Fix 127 formatting issues",
          confidence: 0.92,
          risk: "low",
        },
        {
          id: "flag-missing",
          label: "Flag 34 missing emails",
          confidence: 0.97,
          risk: "low",
        },
      ],
    },
  },
  {
    id: "hitl-7",
    type: "user-input",
    actor: "user",
    content: "Approved. Go ahead with all three actions.",
    delayMs: DELAY.userInput,
    metadata: { approvalResponse: "approved" },
  },
  {
    id: "hitl-8",
    type: "tool-call",
    actor: "execute_cleanup",
    content: "Executing approved cleanup actions...",
    delayMs: DELAY.toolCall,
    metadata: {
      input: {
        actions: [
          "delete_duplicates",
          "fix_formatting",
          "flag_missing_emails",
        ],
        approved_by: "human_operator",
      },
    },
  },
  {
    id: "hitl-9",
    type: "tool-result",
    actor: "execute_cleanup",
    content: "All actions completed successfully",
    delayMs: DELAY.toolResult,
    metadata: {
      result: {
        duplicates_deleted: 53,
        formatting_fixed: 127,
        records_flagged: 34,
        remaining_records: 12794,
      },
    },
  },
  {
    id: "hitl-10",
    type: "final-response",
    actor: "assistant",
    content:
      "Cleanup complete. Here is the summary:\n\n- 53 duplicate records deleted\n- 127 email formatting issues fixed\n- 34 records flagged for missing email review\n\nThe database now has 12,794 clean records. All actions were logged with your approval timestamp for audit purposes.",
    delayMs: DELAY.finalResponse,
  },
];

// ---------------------------------------------------------------------------
// Confidence Routing - Example Actions
// ---------------------------------------------------------------------------

export interface RoutingAction {
  id: string;
  label: string;
  description: string;
  confidence: number;
  category: string;
}

export const ROUTING_ACTIONS: RoutingAction[] = [
  {
    id: "ra-1",
    label: "Fix typo in email field",
    description: "Change 'gmial.com' to 'gmail.com'",
    confidence: 0.97,
    category: "Data Correction",
  },
  {
    id: "ra-2",
    label: "Merge duplicate contacts",
    description: "Combine 2 records with matching name + phone",
    confidence: 0.91,
    category: "Deduplication",
  },
  {
    id: "ra-3",
    label: "Archive inactive accounts",
    description: "Move 230 accounts with no activity for 2+ years",
    confidence: 0.83,
    category: "Data Lifecycle",
  },
  {
    id: "ra-4",
    label: "Update product pricing",
    description: "Apply 5% increase to 340 product records",
    confidence: 0.76,
    category: "Business Logic",
  },
  {
    id: "ra-5",
    label: "Delete flagged spam records",
    description: "Remove 89 records marked as spam by ML classifier",
    confidence: 0.68,
    category: "Data Cleanup",
  },
  {
    id: "ra-6",
    label: "Reclassify customer segments",
    description: "Reassign 1,200 customers based on new criteria",
    confidence: 0.54,
    category: "Segmentation",
  },
  {
    id: "ra-7",
    label: "Approve refund request",
    description: "Process $2,400 refund based on return policy match",
    confidence: 0.62,
    category: "Financial",
  },
  {
    id: "ra-8",
    label: "Standardize address format",
    description: "Reformat 500 addresses to USPS standard",
    confidence: 0.95,
    category: "Data Correction",
  },
];

// ---------------------------------------------------------------------------
// Confidence Routing - Zone Configuration
// ---------------------------------------------------------------------------

export interface ConfidenceZone {
  id: "auto" | "suggest" | "escalate";
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const CONFIDENCE_ZONES: ConfidenceZone[] = [
  {
    id: "auto",
    label: "Auto-Execute",
    description: "High confidence - agent proceeds without human input",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: "suggest",
    label: "Suggest & Wait",
    description: "Medium confidence - agent proposes action and waits for approval",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: "escalate",
    label: "Escalate to Human",
    description: "Low confidence - agent defers entirely to human judgment",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
];

// ---------------------------------------------------------------------------
// Summary Comparison Data
// ---------------------------------------------------------------------------

export const WITHOUT_HITL = [
  { metric: "Error Rate", value: "Unchecked mistakes in high-stakes tasks" },
  { metric: "Trust", value: "Users hesitant to delegate critical work" },
  { metric: "Accountability", value: "No clear audit trail for decisions" },
  { metric: "Adaptability", value: "Agent repeats same mistakes" },
] as const;

export const WITH_HITL = [
  { metric: "Error Rate", value: "Humans catch agent mistakes before damage" },
  { metric: "Trust", value: "Users confident in supervised delegation" },
  { metric: "Accountability", value: "Clear approval logs and audit trail" },
  { metric: "Adaptability", value: "Feedback loop improves agent over time" },
] as const;

export const DESIGN_CHECKLIST_HITL = [
  "Define which actions require approval vs auto-execute",
  "Calibrate confidence thresholds with real-world testing",
  "Provide clear context when requesting human approval",
  "Log all approval decisions for audit and training",
  "Implement timeout handling when humans are unavailable",
  "Design graceful degradation for approval queue overflow",
  "Collect structured feedback to improve future performance",
] as const;
