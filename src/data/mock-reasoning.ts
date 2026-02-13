import type { SimulationStep } from "@/types/agent.types";
import { SIMULATION } from "@/config/simulation.config";

// ---------------------------------------------------------------------------
// Timing constants for simulation step delays (in milliseconds)
// ---------------------------------------------------------------------------

const DELAY = {
  userInput: 300,
  thinking: SIMULATION.thinkingDelayMs,
  reasoning: SIMULATION.defaultStepDelayMs,
  finalResponse: 400,
} as const;

// ---------------------------------------------------------------------------
// Direct answer vs Chain-of-Thought comparison
// ---------------------------------------------------------------------------

export interface ReasoningComparison {
  question: string;
  directAnswer: {
    response: string;
    correct: boolean;
  };
  cotAnswer: {
    steps: string[];
    response: string;
    correct: boolean;
  };
}

export const REASONING_COMPARISON: ReasoningComparison = {
  question:
    "A store sells a jacket for $80 after applying a 20% discount. What was the original price?",
  directAnswer: {
    response:
      "The original price was $96. (80 + 20% of 80 = 80 + 16 = 96)",
    correct: false,
  },
  cotAnswer: {
    steps: [
      "The jacket is sold at $80 after a 20% discount.",
      "If the original price is P, then the discounted price is P - 0.20 * P = 0.80 * P.",
      "We know 0.80 * P = $80.",
      "Solving for P: P = $80 / 0.80 = $100.",
    ],
    response: "The original price was $100.",
    correct: true,
  },
};

// ---------------------------------------------------------------------------
// Chain-of-Thought variants
// ---------------------------------------------------------------------------

export interface CoTVariant {
  id: string;
  name: string;
  description: string;
  whenToUse: string;
  promptExample: string;
  promptLanguage: "python" | "typescript";
}

export const COT_VARIANTS: CoTVariant[] = [
  {
    id: "zero-shot",
    name: "Zero-Shot CoT",
    description:
      "Add a simple instruction like 'Let's think step by step' to the prompt. No examples are provided -- the model generates its own reasoning chain from scratch. Surprisingly effective for many tasks despite its simplicity.",
    whenToUse:
      "Quick prototyping, general-purpose reasoning tasks, when you do not have labeled examples with reasoning traces.",
    promptExample: `prompt = """
Q: If a store sells 340 apples on Monday
and 1.5 times that on Tuesday, how many
apples were sold in total?

Let's think step by step.
"""`,
    promptLanguage: "python",
  },
  {
    id: "few-shot",
    name: "Few-Shot CoT",
    description:
      "Provide several worked examples that include step-by-step reasoning traces before asking the actual question. The model learns the reasoning pattern from the demonstrations and applies it to the new problem.",
    whenToUse:
      "When you need consistent reasoning format, domain-specific logic, or when zero-shot CoT does not produce reliable results.",
    promptExample: `prompt = """
Q: Roger has 5 tennis balls. He buys 2
more cans of 3. How many does he have?
A: Roger starts with 5 balls. 2 cans of
3 balls each is 6 balls. 5 + 6 = 11.
The answer is 11.

Q: The cafeteria had 23 apples. They used
20 for lunch and bought 6 more. How many?
A: Start with 23. Used 20, so 23 - 20 = 3.
Bought 6 more, so 3 + 6 = 9.
The answer is 9.

Q: {user_question}
A:"""`,
    promptLanguage: "python",
  },
  {
    id: "auto-cot",
    name: "Auto-CoT",
    description:
      "The model automatically generates diverse reasoning demonstrations by clustering similar questions and sampling one from each cluster. Eliminates the manual effort of writing few-shot examples while maintaining quality.",
    whenToUse:
      "Large-scale deployment where manually crafting examples for every question type is impractical. Works well when you have a diverse question dataset.",
    promptExample: `# Auto-CoT Pipeline (Zhang et al., 2022)
# 1. Cluster questions by similarity
clusters = cluster_questions(dataset)

# 2. For each cluster, pick a representative
#    question and generate reasoning via
#    zero-shot CoT
demos = []
for cluster in clusters:
    q = select_representative(cluster)
    reasoning = llm(q + " Let's think step"
                    " by step.")
    demos.append((q, reasoning))

# 3. Use generated demos as few-shot context
prompt = build_few_shot_prompt(demos, query)`,
    promptLanguage: "python",
  },
];

// ---------------------------------------------------------------------------
// Advanced reasoning patterns
// ---------------------------------------------------------------------------

export interface ReasoningPatternNode {
  id: string;
  label: string;
  type: "start" | "process" | "decision" | "end";
}

export interface ReasoningPatternEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ReasoningPattern {
  id: "tree-of-thought" | "self-consistency" | "reflection" | "react";
  name: string;
  shortName: string;
  description: string;
  whenToUse: string;
  nodes: ReasoningPatternNode[];
  edges: ReasoningPatternEdge[];
}

export const REASONING_PATTERNS: ReasoningPattern[] = [
  {
    id: "tree-of-thought",
    name: "Tree of Thought (ToT)",
    shortName: "ToT",
    description:
      "Explores multiple reasoning paths simultaneously, evaluates intermediate states, and prunes unpromising branches. The model deliberates over different approaches before committing to the best path. Inspired by how humans explore and backtrack when solving complex problems.",
    whenToUse:
      "Complex planning tasks, puzzles, creative writing where the solution space is large and backtracking is necessary.",
    nodes: [
      { id: "start", label: "Problem", type: "start" },
      { id: "a1", label: "Path A", type: "process" },
      { id: "a2", label: "Path B", type: "process" },
      { id: "a3", label: "Path C", type: "process" },
      { id: "eval1", label: "Evaluate", type: "decision" },
      { id: "b1", label: "A-1", type: "process" },
      { id: "b2", label: "A-2", type: "process" },
      { id: "b3", label: "B-1", type: "process" },
      { id: "eval2", label: "Evaluate", type: "decision" },
      { id: "end", label: "Best Answer", type: "end" },
    ],
    edges: [
      { from: "start", to: "a1" },
      { from: "start", to: "a2" },
      { from: "start", to: "a3" },
      { from: "a1", to: "eval1" },
      { from: "a2", to: "eval1" },
      { from: "a3", to: "eval1", label: "pruned" },
      { from: "eval1", to: "b1" },
      { from: "eval1", to: "b2" },
      { from: "eval1", to: "b3" },
      { from: "b1", to: "eval2" },
      { from: "b2", to: "eval2" },
      { from: "b3", to: "eval2" },
      { from: "eval2", to: "end" },
    ],
  },
  {
    id: "self-consistency",
    name: "Self-Consistency",
    shortName: "SC",
    description:
      "Generates multiple independent chain-of-thought reasoning paths for the same question, then uses majority voting to select the most consistent answer. Different reasoning paths may use different approaches but should converge on the correct answer.",
    whenToUse:
      "Mathematical reasoning, common-sense reasoning, multiple-choice questions where you want higher confidence in the final answer.",
    nodes: [
      { id: "start", label: "Question", type: "start" },
      { id: "p1", label: "CoT Path 1", type: "process" },
      { id: "p2", label: "CoT Path 2", type: "process" },
      { id: "p3", label: "CoT Path 3", type: "process" },
      { id: "a1", label: "Answer: X", type: "process" },
      { id: "a2", label: "Answer: X", type: "process" },
      { id: "a3", label: "Answer: Y", type: "process" },
      { id: "vote", label: "Majority Vote", type: "decision" },
      { id: "end", label: "Final: X", type: "end" },
    ],
    edges: [
      { from: "start", to: "p1" },
      { from: "start", to: "p2" },
      { from: "start", to: "p3" },
      { from: "p1", to: "a1" },
      { from: "p2", to: "a2" },
      { from: "p3", to: "a3" },
      { from: "a1", to: "vote" },
      { from: "a2", to: "vote" },
      { from: "a3", to: "vote" },
      { from: "vote", to: "end" },
    ],
  },
  {
    id: "reflection",
    name: "Reflection / Self-Critique",
    shortName: "Reflect",
    description:
      "The model generates an initial response, then critically evaluates its own output for errors, gaps, or inconsistencies. Based on the critique, it produces a revised and improved response. This cycle can repeat multiple times.",
    whenToUse:
      "Code generation (find bugs in own code), essay writing, complex analysis where the first draft is likely imperfect and iterative refinement adds value.",
    nodes: [
      { id: "start", label: "Problem", type: "start" },
      { id: "gen", label: "Generate Answer", type: "process" },
      { id: "critique", label: "Self-Critique", type: "decision" },
      { id: "revise", label: "Revise Answer", type: "process" },
      { id: "end", label: "Final Answer", type: "end" },
    ],
    edges: [
      { from: "start", to: "gen" },
      { from: "gen", to: "critique" },
      { from: "critique", to: "revise", label: "issues found" },
      { from: "critique", to: "end", label: "looks good" },
      { from: "revise", to: "critique" },
    ],
  },
  {
    id: "react",
    name: "ReAct (Reasoning + Acting)",
    shortName: "ReAct",
    description:
      "Interleaves reasoning traces with concrete actions. The model thinks about what to do (Thought), executes an action such as a tool call (Action), observes the result (Observation), and repeats until it has enough information to answer.",
    whenToUse:
      "Tasks requiring external information retrieval, multi-step research, any scenario where the model needs to interact with tools or environments to gather facts.",
    nodes: [
      { id: "start", label: "Question", type: "start" },
      { id: "think", label: "Thought", type: "process" },
      { id: "act", label: "Action", type: "process" },
      { id: "obs", label: "Observation", type: "process" },
      { id: "check", label: "Enough Info?", type: "decision" },
      { id: "end", label: "Final Answer", type: "end" },
    ],
    edges: [
      { from: "start", to: "think" },
      { from: "think", to: "act" },
      { from: "act", to: "obs" },
      { from: "obs", to: "check" },
      { from: "check", to: "think", label: "no" },
      { from: "check", to: "end", label: "yes" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Reasoning demo problem sets (used with useSimulation)
// ---------------------------------------------------------------------------

export interface ReasoningProblem {
  id: string;
  label: string;
  category: "math" | "logic" | "code";
}

export const REASONING_PROBLEMS: ReasoningProblem[] = [
  { id: "math", label: "Math", category: "math" },
  { id: "logic", label: "Logic", category: "logic" },
  { id: "code", label: "Code", category: "code" },
];

export function getReasoningSimulationSteps(
  problemId: string,
): SimulationStep[] {
  switch (problemId) {
    case "math":
      return MATH_SIMULATION_STEPS;
    case "logic":
      return LOGIC_SIMULATION_STEPS;
    case "code":
      return CODE_SIMULATION_STEPS;
    default:
      return MATH_SIMULATION_STEPS;
  }
}

const MATH_SIMULATION_STEPS: SimulationStep[] = [
  {
    id: "math-1",
    type: "user-input",
    actor: "user",
    content:
      "If a shirt costs $25 after a 20% discount, what was the original price?",
    delayMs: DELAY.userInput,
  },
  {
    id: "math-2",
    type: "llm-thinking",
    actor: "llm",
    content: "Analyzing the problem...",
    delayMs: DELAY.thinking,
  },
  {
    id: "math-3",
    type: "reasoning",
    actor: "Understand the Problem",
    content:
      "The shirt's final price is $25 after a 20% discount was applied. I need to find the original price before the discount.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "math-4",
    type: "reasoning",
    actor: "Set Up the Equation",
    content:
      "If the original price is P, a 20% discount means the customer pays 80% of P. So: 0.80 * P = $25.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "math-5",
    type: "reasoning",
    actor: "Solve for P",
    content:
      "Dividing both sides by 0.80: P = $25 / 0.80 = $31.25.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "math-6",
    type: "reasoning",
    actor: "Verify the Answer",
    content:
      "Let me check: 20% of $31.25 = $6.25. Original price $31.25 - $6.25 discount = $25.00. This matches the given price.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "math-7",
    type: "reasoning",
    actor: "Identify Common Mistake",
    content:
      "A common error is to compute 25 + 20% of 25 = $30. This is wrong because 20% of 30 is $6, not $5, so $30 - $6 = $24, not $25. The discount percentage applies to the original price, not the discounted price.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "math-8",
    type: "final-response",
    actor: "assistant",
    content:
      "The original price of the shirt was $31.25.\n\nReasoning: A 20% discount means you pay 80% of the original price. So if 80% of P = $25, then P = $25 / 0.80 = $31.25.\n\nVerification: 20% of $31.25 = $6.25, and $31.25 - $6.25 = $25.00.",
    delayMs: DELAY.finalResponse,
  },
];

const LOGIC_SIMULATION_STEPS: SimulationStep[] = [
  {
    id: "logic-1",
    type: "user-input",
    actor: "user",
    content:
      "Three friends -- Alice, Bob, and Carol -- each have a different pet: a dog, a cat, and a fish. Alice does not have a dog. Bob does not have a cat or a fish. Who has which pet?",
    delayMs: DELAY.userInput,
  },
  {
    id: "logic-2",
    type: "llm-thinking",
    actor: "llm",
    content: "Processing the logic puzzle...",
    delayMs: DELAY.thinking,
  },
  {
    id: "logic-3",
    type: "reasoning",
    actor: "List the Constraints",
    content:
      "Constraint 1: Alice does not have a dog. Constraint 2: Bob does not have a cat. Constraint 3: Bob does not have a fish. Each person has exactly one pet, and each pet belongs to exactly one person.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "logic-4",
    type: "reasoning",
    actor: "Deduce Bob's Pet",
    content:
      "Bob does not have a cat and does not have a fish. The only remaining option for Bob is the dog. So: Bob has the dog.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "logic-5",
    type: "reasoning",
    actor: "Deduce Alice's Pet",
    content:
      "Alice does not have a dog (given constraint). Bob already has the dog. The remaining pets for Alice are cat or fish. No constraint prevents Alice from having either, but we need to check Carol too.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "logic-6",
    type: "reasoning",
    actor: "Determine Remaining Assignments",
    content:
      "With Bob having the dog, Alice and Carol share the cat and the fish. Alice does not have a dog (already satisfied). No further constraints on Alice, so Alice can have either cat or fish. But wait -- there are no more constraints, so let me re-read... Actually, the only constraints are about Alice and Bob. Alice can have cat or fish. Let me assign: Alice gets the cat, Carol gets the fish. Or Alice gets the fish, Carol gets the cat. Both satisfy the constraints. However, puzzles like this typically have a unique solution. Let me recheck -- with no additional constraints beyond those given, Alice could have cat or fish. I will note both are valid but conventionally the first available assignment is: Alice has the cat, Carol has the fish.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "logic-7",
    type: "reasoning",
    actor: "Verify the Solution",
    content:
      "Solution: Bob = dog, Alice = cat, Carol = fish. Check: Alice does not have a dog -- correct (she has cat). Bob does not have a cat -- correct (he has dog). Bob does not have a fish -- correct (he has dog). All constraints are satisfied and each person has a unique pet.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "logic-8",
    type: "final-response",
    actor: "assistant",
    content:
      "Here is the solution:\n- Bob has the dog (he cannot have cat or fish, so dog is the only option)\n- Alice has the cat (she cannot have a dog, and Bob took the dog)\n- Carol has the fish (the only pet left)\n\nAll constraints are satisfied: Alice has no dog, Bob has neither cat nor fish.",
    delayMs: DELAY.finalResponse,
  },
];

const CODE_SIMULATION_STEPS: SimulationStep[] = [
  {
    id: "code-1",
    type: "user-input",
    actor: "user",
    content:
      "Write a function to find the longest palindrome substring in a given string.",
    delayMs: DELAY.userInput,
  },
  {
    id: "code-2",
    type: "llm-thinking",
    actor: "llm",
    content: "Breaking down the problem...",
    delayMs: DELAY.thinking,
  },
  {
    id: "code-3",
    type: "reasoning",
    actor: "Understand the Problem",
    content:
      "I need to find the longest contiguous substring that reads the same forwards and backwards. For example, in 'babad', the longest palindrome is 'bab' or 'aba' (length 3). In 'cbbd', it is 'bb' (length 2).",
    delayMs: DELAY.reasoning,
  },
  {
    id: "code-4",
    type: "reasoning",
    actor: "Consider Approaches",
    content:
      "Approach 1: Brute force -- check all substrings. O(n^3) time. Too slow. Approach 2: Dynamic programming -- build a table of palindrome substrings. O(n^2) time, O(n^2) space. Approach 3: Expand around center -- for each character (and each pair of characters), expand outward while characters match. O(n^2) time, O(1) space. I will use approach 3 as it is efficient and easy to implement.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "code-5",
    type: "reasoning",
    actor: "Design the Algorithm",
    content:
      "For each index i in the string: (a) expand around center i for odd-length palindromes, (b) expand around centers i and i+1 for even-length palindromes. Track the start index and maximum length found. Return the substring using the tracked start and length.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "code-6",
    type: "reasoning",
    actor: "Handle Edge Cases",
    content:
      "Edge cases to consider: empty string (return empty), single character (return that character), string with all identical characters (entire string is a palindrome), no palindrome longer than 1 (return first character).",
    delayMs: DELAY.reasoning,
  },
  {
    id: "code-7",
    type: "reasoning",
    actor: "Verify with Example",
    content:
      'Trace through "babad": i=0 (b): odd expand gives "b", even gives "". i=1 (a): odd expand gives "bab" (length 3), even gives "". i=2 (b): odd expand gives "aba" (length 3), even gives "". i=3 (a): odd gives "a", even gives "". i=4 (d): odd gives "d", even gives "". Longest is "bab" (or "aba"), length 3. Correct.',
    delayMs: DELAY.reasoning,
  },
  {
    id: "code-8",
    type: "final-response",
    actor: "assistant",
    content:
      'def longest_palindrome(s: str) -> str:\n    if len(s) < 2:\n        return s\n\n    start, max_len = 0, 1\n\n    def expand(left: int, right: int) -> None:\n        nonlocal start, max_len\n        while left >= 0 and right < len(s) and s[left] == s[right]:\n            length = right - left + 1\n            if length > max_len:\n                start = left\n                max_len = length\n            left -= 1\n            right += 1\n\n    for i in range(len(s)):\n        expand(i, i)      # odd-length palindromes\n        expand(i, i + 1)  # even-length palindromes\n\n    return s[start : start + max_len]\n\nTime complexity: O(n^2) -- we expand from each of the n centers.\nSpace complexity: O(1) -- only tracking start index and max length.',
    delayMs: DELAY.finalResponse,
  },
];

// ---------------------------------------------------------------------------
// Reasoning model comparison data
// ---------------------------------------------------------------------------

export interface ReasoningModel {
  name: string;
  provider: string;
  approach: string;
  latencyNote: string;
  costNote: string;
  strengths: string[];
  color: string;
}

export const REASONING_MODELS: ReasoningModel[] = [
  {
    name: "o1 / o3",
    provider: "OpenAI",
    approach: "Trained chain-of-thought with reinforcement learning. The model learns to produce internal reasoning tokens before answering.",
    latencyNote: "High -- generates many hidden reasoning tokens before the visible answer",
    costNote: "High -- reasoning tokens are billed but hidden from the user",
    strengths: [
      "Strong mathematical reasoning",
      "Complex multi-step logic",
      "Science and coding competitions",
    ],
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    name: "DeepSeek-R1",
    provider: "DeepSeek",
    approach: "Open-weight reasoning model trained with RL on chain-of-thought. Reasoning trace is visible to the user.",
    latencyNote: "Moderate to high -- visible reasoning chain adds output tokens",
    costNote: "Low -- open-weight model, can self-host",
    strengths: [
      "Transparent reasoning trace",
      "Strong math and code performance",
      "Self-hostable, cost-effective",
    ],
    color: "bg-blue-50 border-blue-200",
  },
  {
    name: "Claude (Extended Thinking)",
    provider: "Anthropic",
    approach: "Extended thinking mode produces a detailed internal thinking block before the final answer. Uses a dedicated thinking budget.",
    latencyNote: "Moderate -- configurable thinking budget controls latency",
    costNote: "Moderate -- thinking tokens billed at reduced rate",
    strengths: [
      "Configurable thinking depth",
      "Strong at nuanced analysis",
      "Good at coding and instruction following",
    ],
    color: "bg-violet-50 border-violet-200",
  },
  {
    name: "Gemini 2.0 Flash Thinking",
    provider: "Google",
    approach: "Fast reasoning model that shows its thinking process. Optimized for speed while maintaining reasoning quality.",
    latencyNote: "Low to moderate -- optimized for fast reasoning",
    costNote: "Moderate -- competitive pricing for reasoning capabilities",
    strengths: [
      "Fast reasoning output",
      "Good multimodal reasoning",
      "Strong at STEM tasks",
    ],
    color: "bg-amber-50 border-amber-200",
  },
];

// ---------------------------------------------------------------------------
// Use case recommendations for summary
// ---------------------------------------------------------------------------

export interface UseCaseRecommendation {
  useCase: string;
  useReasoning: boolean;
  explanation: string;
}

export const USE_CASE_RECOMMENDATIONS: UseCaseRecommendation[] = [
  {
    useCase: "Complex math word problems",
    useReasoning: true,
    explanation:
      "Multi-step calculations benefit significantly from explicit reasoning chains that track intermediate results.",
  },
  {
    useCase: "Multi-step logic puzzles",
    useReasoning: true,
    explanation:
      "Constraint satisfaction and deductive reasoning require systematic exploration that CoT enables.",
  },
  {
    useCase: "Code generation and debugging",
    useReasoning: true,
    explanation:
      "Planning the algorithm, considering edge cases, and verifying correctness all benefit from structured thinking.",
  },
  {
    useCase: "Strategic planning and analysis",
    useReasoning: true,
    explanation:
      "Breaking down complex decisions into sub-problems and evaluating tradeoffs is a natural fit for reasoning models.",
  },
  {
    useCase: "Simple factual Q&A",
    useReasoning: false,
    explanation:
      "Questions like 'What is the capital of France?' do not need reasoning -- they add latency and cost for no accuracy gain.",
  },
  {
    useCase: "Text classification and sentiment",
    useReasoning: false,
    explanation:
      "Pattern-matching tasks are handled well by standard models. Reasoning tokens add unnecessary overhead.",
  },
  {
    useCase: "Named entity extraction",
    useReasoning: false,
    explanation:
      "Extracting entities is a recognition task, not a reasoning task. Standard models are sufficient and faster.",
  },
  {
    useCase: "Simple text reformatting",
    useReasoning: false,
    explanation:
      "Tasks like summarization or translation of straightforward text do not require chain-of-thought decomposition.",
  },
];

// ---------------------------------------------------------------------------
// Best practices for summary
// ---------------------------------------------------------------------------

export const REASONING_BEST_PRACTICES: string[] = [
  "Use chain-of-thought prompting for tasks requiring multi-step logic",
  "Start with zero-shot CoT ('Let's think step by step') and escalate to few-shot only if needed",
  "Include a verification step in the reasoning chain to catch errors",
  "Use self-consistency (multiple reasoning paths + majority vote) for critical decisions",
  "Monitor reasoning token usage -- they directly impact cost and latency",
  "Not every task needs reasoning; simple Q&A and classification are better without it",
  "Test reasoning models against standard models on your specific use case before committing",
  "Consider the cost-accuracy tradeoff: reasoning tokens are expensive but improve accuracy on hard problems",
  "Use tree-of-thought for creative or planning tasks with large solution spaces",
  "Implement ReAct when the model needs to interact with external tools during reasoning",
];
