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
// Grounding technique definitions
// ---------------------------------------------------------------------------

export interface GroundingTechnique {
  id: string;
  name: string;
  icon: string;
  description: string;
  whenToUse: string;
  strengths: string[];
}

export const GROUNDING_TECHNIQUES: GroundingTechnique[] = [
  {
    id: "rag",
    name: "RAG-Based Grounding",
    icon: "BookOpen",
    description:
      "Retrieve relevant documents from a knowledge base before generating a response. The LLM synthesizes its answer from the retrieved context, anchoring every claim to real source material.",
    whenToUse:
      "When you have a curated document corpus (internal docs, research papers, product catalogs) and need answers grounded in that specific knowledge.",
    strengths: [
      "Answers are traceable to source documents",
      "Easy to update by re-indexing new documents",
      "Reduces hallucination by constraining the generation context",
    ],
  },
  {
    id: "tool-use",
    name: "Tool-Use Grounding",
    icon: "Wrench",
    description:
      "The LLM calls external APIs, databases, or calculators to fetch live data and verify facts in real time. Instead of relying on parametric memory, the model grounds its answer in up-to-date external systems.",
    whenToUse:
      "When facts change frequently (stock prices, weather, live scores) or when the answer requires a precise calculation or database lookup.",
    strengths: [
      "Always up-to-date with live data",
      "Exact numerical answers from authoritative APIs",
      "No stale knowledge problem",
    ],
  },
  {
    id: "self-consistency",
    name: "Self-Consistency Checking",
    icon: "RefreshCw",
    description:
      "Generate multiple independent responses to the same question, then check whether they agree. If most responses converge on the same answer, confidence is high. Divergence signals potential hallucination.",
    whenToUse:
      "When no external knowledge base is available and you need a confidence estimate for the model's own output. Useful for reasoning-heavy tasks.",
    strengths: [
      "Works without external data sources",
      "Provides a built-in confidence signal",
      "Catches inconsistent or unstable reasoning",
    ],
  },
  {
    id: "citation",
    name: "Citation Generation",
    icon: "Quote",
    description:
      "Instruct the LLM to annotate every factual claim with an explicit citation pointing to a specific source, paragraph, or URL. Citations allow downstream verification and build user trust.",
    whenToUse:
      "When transparency and auditability are critical -- legal research, academic writing, medical information, financial analysis.",
    strengths: [
      "Every claim is verifiable by the reader",
      "Builds trust through transparency",
      "Enables automated citation checking pipelines",
    ],
  },
];

// ---------------------------------------------------------------------------
// Example grounded response with citations
// ---------------------------------------------------------------------------

export interface CitationSource {
  id: number;
  title: string;
  content: string;
  url: string;
}

export interface GroundedResponse {
  question: string;
  response: string;
  sources: CitationSource[];
}

export const EXAMPLE_GROUNDED_RESPONSE: GroundedResponse = {
  question:
    "What are the main environmental impacts of lithium mining for EV batteries?",
  response:
    "Lithium mining for electric vehicle batteries has several significant environmental impacts. The extraction process requires large amounts of water -- approximately 500,000 gallons per tonne of lithium produced [1]. In arid regions like the Atacama Desert, this has led to measurable groundwater depletion affecting local agriculture and ecosystems [2]. The chemical processing of lithium ore generates toxic byproducts including hydrochloric acid, which can contaminate soil and waterways if not properly managed [1]. Additionally, open-pit mining operations cause habitat disruption and biodiversity loss in sensitive ecosystems [3]. However, recent advances in direct lithium extraction (DLE) technology have shown potential to reduce water usage by up to 90% compared to traditional evaporation methods [2]. Industry experts also note that the lifecycle carbon footprint of lithium-ion batteries, including mining, is still significantly lower than the emissions from combustion engines over a vehicle's lifetime [3].",
  sources: [
    {
      id: 1,
      title: "Environmental Impacts of Lithium Mining -- USGS Report 2024",
      content:
        "Water consumption averages 500,000 gallons per tonne of lithium carbonate equivalent. Chemical processing produces hydrochloric acid and other corrosive byproducts requiring careful containment.",
      url: "https://pubs.usgs.gov/lithium-environmental-2024",
    },
    {
      id: 2,
      title:
        "Water Scarcity and Mining in the Atacama -- Nature Sustainability",
      content:
        "Groundwater levels near brine operations have declined by 3-5 meters over the past decade. Direct lithium extraction pilots demonstrate 85-90% reduction in freshwater consumption.",
      url: "https://nature.com/articles/atacama-lithium-water",
    },
    {
      id: 3,
      title: "Lifecycle Analysis of EV Batteries -- IEA Global EV Outlook",
      content:
        "Open-pit mining affects approximately 1,600 hectares per major operation. Despite mining impacts, total lifecycle emissions for EVs are 50-70% lower than comparable ICE vehicles.",
      url: "https://iea.org/reports/global-ev-outlook-lifecycle",
    },
  ],
};

// ---------------------------------------------------------------------------
// Ungrounded vs grounded comparison data
// ---------------------------------------------------------------------------

export interface ComparisonExample {
  label: string;
  ungrounded: string;
  grounded: string;
}

export const GROUNDING_COMPARISONS: ComparisonExample[] = [
  {
    label: "Factual claim",
    ungrounded:
      "The Great Wall of China is the only man-made structure visible from space.",
    grounded:
      "Contrary to popular belief, the Great Wall is generally not visible from low Earth orbit without aid. Astronauts have confirmed this, including Chris Hadfield [NASA, 2013].",
  },
  {
    label: "Medical info",
    ungrounded:
      "Vitamin C cures the common cold and you should take 5000mg daily.",
    grounded:
      "A Cochrane review of 29 trials found that regular vitamin C supplementation does not prevent colds in the general population, though it may slightly reduce duration [Hemila & Chalker, 2013].",
  },
  {
    label: "Financial data",
    ungrounded: "Apple's revenue last quarter was around $90 billion.",
    grounded:
      "According to Apple's Q4 2024 earnings report filed with the SEC, quarterly revenue was $94.9 billion, a 6% year-over-year increase [Apple 10-Q, Oct 2024].",
  },
];

// ---------------------------------------------------------------------------
// Hallucination consequences data
// ---------------------------------------------------------------------------

export interface HallucinationConsequence {
  domain: string;
  example: string;
  impact: string;
  color: string;
}

export const HALLUCINATION_CONSEQUENCES: HallucinationConsequence[] = [
  {
    domain: "Legal",
    example: "LLM fabricated non-existent court cases cited in a legal brief",
    impact:
      "Lawyer sanctioned by court, client case damaged, firm reputation harmed",
    color: "bg-red-100 border-red-300 text-red-800",
  },
  {
    domain: "Medical",
    example: "Chatbot recommended a dangerous drug interaction as safe",
    impact: "Patient harm, potential liability, erosion of trust in AI health tools",
    color: "bg-orange-100 border-orange-300 text-orange-800",
  },
  {
    domain: "Financial",
    example:
      "AI analyst fabricated earnings figures in an investment recommendation",
    impact:
      "Investor losses, regulatory violations, potential securities fraud charges",
    color: "bg-amber-100 border-amber-300 text-amber-800",
  },
  {
    domain: "Education",
    example:
      "AI tutor presented incorrect historical dates and fabricated quotes",
    impact:
      "Students learn false information, undermines educational integrity",
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
  },
];

// ---------------------------------------------------------------------------
// Hallucination detection example
// ---------------------------------------------------------------------------

export type ClaimStatus = "verified" | "partial" | "hallucinated";

export interface Claim {
  id: string;
  text: string;
  status: ClaimStatus;
  sourceRef: string | null;
  explanation: string;
}

export interface HallucinationExample {
  question: string;
  response: string;
  claims: Claim[];
}

export const HALLUCINATION_DETECTION_EXAMPLE: HallucinationExample = {
  question: "Tell me about the founding of OpenAI and its key milestones.",
  response:
    "OpenAI was founded in December 2015 by Sam Altman, Elon Musk, Greg Brockman, and others. The organization started as a non-profit AI research lab with $1 billion in pledged funding. In 2019, OpenAI created a capped-profit subsidiary called OpenAI LP to attract additional investment. Microsoft invested $1 billion in OpenAI in 2019. GPT-2 was released in February 2019, and GPT-3 followed in June 2020 with 175 billion parameters. ChatGPT launched on November 30, 2022, and reached 100 million monthly active users within two months. In January 2023, Microsoft invested an additional $10 billion in OpenAI. OpenAI's GPT-4 was trained on over 1 trillion parameters and was released in March 2023. Elon Musk served as co-chairman until 2020 when he stepped down due to conflicts of interest.",
  claims: [
    {
      id: "c1",
      text: "OpenAI was founded in December 2015 by Sam Altman, Elon Musk, Greg Brockman, and others",
      status: "verified",
      sourceRef: "OpenAI founding announcement, December 2015",
      explanation:
        "This is accurate. OpenAI was announced in December 2015 with Sam Altman and Elon Musk as co-chairs, Greg Brockman as CTO, and several other co-founders.",
    },
    {
      id: "c2",
      text: "The organization started as a non-profit with $1 billion in pledged funding",
      status: "verified",
      sourceRef: "OpenAI blog announcement, 2015",
      explanation:
        "Correct. The founding announcement stated $1 billion in committed funding from the group of founders and backers.",
    },
    {
      id: "c3",
      text: "In 2019, OpenAI created a capped-profit subsidiary called OpenAI LP",
      status: "verified",
      sourceRef: "OpenAI blog: 'OpenAI LP', March 2019",
      explanation:
        "Accurate. OpenAI transitioned to a capped-profit model in March 2019 to attract investment while maintaining its mission.",
    },
    {
      id: "c4",
      text: "Microsoft invested $1 billion in OpenAI in 2019",
      status: "verified",
      sourceRef: "Microsoft press release, July 2019",
      explanation:
        "Confirmed. Microsoft announced a $1 billion investment in OpenAI in July 2019.",
    },
    {
      id: "c5",
      text: "GPT-2 was released in February 2019",
      status: "verified",
      sourceRef: "OpenAI blog: 'Better Language Models', Feb 2019",
      explanation:
        "Correct. GPT-2 was announced in February 2019, though the full model was released in stages due to safety concerns.",
    },
    {
      id: "c6",
      text: "GPT-3 followed in June 2020 with 175 billion parameters",
      status: "verified",
      sourceRef: "OpenAI research paper, 'Language Models are Few-Shot Learners', June 2020",
      explanation:
        "Accurate. The GPT-3 paper was published in June 2020 and the model has 175 billion parameters.",
    },
    {
      id: "c7",
      text: "ChatGPT launched on November 30, 2022, and reached 100 million users within two months",
      status: "partial",
      sourceRef: "Various news reports, early 2023",
      explanation:
        "The launch date of November 30, 2022 is correct. The 100 million users figure was reported by UBS in February 2023, but it referred to monthly active users -- the exact timeline of 'two months' is approximate and some sources say it was closer to 2.5 months.",
    },
    {
      id: "c8",
      text: "Microsoft invested an additional $10 billion in January 2023",
      status: "partial",
      sourceRef: "Semafor, Bloomberg reports, Jan 2023",
      explanation:
        "The investment was widely reported as $10 billion, but the deal was announced to be a multi-year, multi-phase investment. The exact structure was not fully disclosed publicly.",
    },
    {
      id: "c9",
      text: "GPT-4 was trained on over 1 trillion parameters",
      status: "hallucinated",
      sourceRef: null,
      explanation:
        "OpenAI has never officially disclosed the parameter count of GPT-4. The '1 trillion parameters' figure is unverified speculation. This is a fabricated detail that cannot be attributed to any authoritative source.",
    },
    {
      id: "c10",
      text: "Elon Musk served as co-chairman until 2020 when he stepped down",
      status: "hallucinated",
      sourceRef: null,
      explanation:
        "Elon Musk departed the OpenAI board in February 2018, not 2020. He cited potential conflicts of interest with Tesla's AI work. Stating he left in 2020 is factually incorrect.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Grounding pipeline simulation steps
// ---------------------------------------------------------------------------

export const GROUNDING_PIPELINE_STEPS: SimulationStep[] = [
  {
    id: "gp-1",
    type: "user-input",
    actor: "user",
    content:
      "What percentage of global electricity is generated from renewable sources, and how has this changed in the last decade?",
    delayMs: DELAY.userInput,
  },
  {
    id: "gp-2",
    type: "llm-thinking",
    actor: "llm",
    content: "Processing the query and determining required sources...",
    delayMs: DELAY.thinking,
  },
  {
    id: "gp-3",
    type: "reasoning",
    actor: "Query Analysis",
    content:
      "The user is asking for a specific statistic (percentage of global electricity from renewables) and a trend over time (last decade). I need authoritative energy data sources. I will search the knowledge base for IEA, IRENA, and other energy authority reports.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "gp-4",
    type: "tool-call",
    actor: "search_knowledge_base",
    content: "Searching knowledge base for renewable energy statistics...",
    delayMs: DELAY.toolCall,
    metadata: {
      input: {
        query: "global electricity renewable sources percentage 2014-2024",
        top_k: 3,
        filters: { category: "energy-statistics" },
      },
    },
  },
  {
    id: "gp-5",
    type: "tool-result",
    actor: "search_knowledge_base",
    content: "Retrieved 3 relevant documents",
    delayMs: DELAY.toolResult,
    metadata: {
      result: {
        documents: [
          {
            id: "doc-1",
            title: "IEA World Energy Outlook 2024",
            relevance: 0.94,
            excerpt:
              "Renewable sources accounted for 30% of global electricity generation in 2023, up from 22% in 2015...",
          },
          {
            id: "doc-2",
            title: "IRENA Renewable Capacity Statistics 2024",
            relevance: 0.91,
            excerpt:
              "Global renewable electricity capacity reached 3,870 GW by end of 2023. Solar and wind together contributed 14% of total generation...",
          },
          {
            id: "doc-3",
            title: "Our World in Data: Electricity Mix",
            relevance: 0.88,
            excerpt:
              "The share of renewables in global electricity rose from 21.3% in 2012 to 29.9% in 2023. Solar grew fastest at 25% CAGR...",
          },
        ],
      },
    },
  },
  {
    id: "gp-6",
    type: "reasoning",
    actor: "Cross-Reference Sources",
    content:
      "Comparing the three sources: IEA says 30% in 2023 (up from 22% in 2015). Our World in Data says 29.9% in 2023 (from 21.3% in 2012). IRENA confirms capacity growth but focuses on capacity rather than generation share. The IEA and OWID figures are consistent (30% vs 29.9%). I will use the IEA figure as the primary source since it is the most authoritative, and OWID as a corroborating source.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "gp-7",
    type: "reasoning",
    actor: "Claim Verification",
    content:
      "Verifying each claim I plan to make:\n- '30% of global electricity from renewables in 2023' -- confirmed by IEA [doc-1] and OWID [doc-3]\n- 'Up from ~22% in 2015' -- confirmed by IEA [doc-1]\n- 'Solar grew fastest' -- confirmed by OWID [doc-3] at 25% CAGR\n- 'Total capacity 3,870 GW' -- confirmed by IRENA [doc-2]\nAll claims have at least one source. No unsupported assertions detected.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "gp-8",
    type: "llm-thinking",
    actor: "llm",
    content: "Composing response with inline citations...",
    delayMs: DELAY.thinking,
  },
  {
    id: "gp-9",
    type: "final-response",
    actor: "assistant",
    content:
      "According to the IEA World Energy Outlook 2024, renewable sources accounted for approximately 30% of global electricity generation in 2023 [1]. This represents a significant increase from around 22% in 2015 [1], meaning renewables gained roughly 8 percentage points of market share in less than a decade.\n\nThe growth has been driven primarily by solar and wind energy. Solar power has been the fastest-growing source, expanding at a compound annual growth rate of approximately 25% [3]. By the end of 2023, total global renewable electricity capacity reached 3,870 GW [2].\n\nThese figures are corroborated by independent data from Our World in Data, which reports the renewable share rising from 21.3% in 2012 to 29.9% in 2023 [3].\n\n---\nSources:\n[1] IEA World Energy Outlook 2024\n[2] IRENA Renewable Capacity Statistics 2024\n[3] Our World in Data: Electricity Mix",
    delayMs: DELAY.finalResponse,
  },
  {
    id: "gp-10",
    type: "reasoning",
    actor: "Post-Generation Fact Check",
    content:
      "Final verification pass:\n- Claim '30% in 2023': Matches IEA doc-1 (30%) and OWID doc-3 (29.9%) -- PASS\n- Claim '22% in 2015': Matches IEA doc-1 -- PASS\n- Claim '25% CAGR for solar': Matches OWID doc-3 -- PASS\n- Claim '3,870 GW capacity': Matches IRENA doc-2 -- PASS\n- No claims made without source support -- PASS\nAll 5 claims verified. Confidence: HIGH.",
    delayMs: DELAY.reasoning,
  },
];

// ---------------------------------------------------------------------------
// Grounding pipeline stages (for the visual diagram)
// ---------------------------------------------------------------------------

export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const GROUNDING_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "query",
    label: "Query",
    description: "User asks a factual question",
    icon: "MessageSquare",
  },
  {
    id: "search",
    label: "Search Sources",
    description: "Retrieve relevant documents from knowledge base",
    icon: "Search",
  },
  {
    id: "cross-ref",
    label: "Cross-Reference",
    description: "Compare and validate across multiple sources",
    icon: "GitCompare",
  },
  {
    id: "generate",
    label: "Generate with Citations",
    description: "Compose answer with inline source attributions",
    icon: "FileText",
  },
  {
    id: "verify",
    label: "Verify Claims",
    description: "Check every claim against the retrieved sources",
    icon: "ShieldCheck",
  },
];

// ---------------------------------------------------------------------------
// Summary: strategy selection guide
// ---------------------------------------------------------------------------

export interface StrategyGuideRow {
  useCase: string;
  approach: string;
  reasoning: string;
}

export const STRATEGY_GUIDE: StrategyGuideRow[] = [
  {
    useCase: "Enterprise knowledge Q&A",
    approach: "RAG + Citation Generation",
    reasoning: "Internal docs as source of truth, citations enable audit trail",
  },
  {
    useCase: "Real-time data queries",
    approach: "Tool-Use Grounding",
    reasoning:
      "Live APIs provide current data that parametric knowledge cannot",
  },
  {
    useCase: "Creative / reasoning tasks",
    approach: "Self-Consistency Checking",
    reasoning:
      "No single source of truth; convergence across samples indicates reliability",
  },
  {
    useCase: "Legal / medical / financial",
    approach: "RAG + Citation + Fact-Check",
    reasoning:
      "High stakes require traceable sources and explicit verification steps",
  },
  {
    useCase: "Customer support chatbot",
    approach: "RAG + Tool-Use",
    reasoning:
      "Ground in product docs (RAG) and query order/account systems (tools)",
  },
  {
    useCase: "Research summarization",
    approach: "Citation Generation + Cross-Reference",
    reasoning:
      "Readers need to trace claims to original papers; cross-referencing prevents misattribution",
  },
];

// ---------------------------------------------------------------------------
// Summary: best practices
// ---------------------------------------------------------------------------

export const GROUNDING_BEST_PRACTICES: string[] = [
  "Always provide source attribution for factual claims",
  "Use multiple independent sources to cross-reference critical facts",
  "Implement a post-generation verification step to catch hallucinations",
  "Instruct the model to say 'I don't know' rather than fabricate answers",
  "Log and monitor hallucination rates in production systems",
  "Design retrieval to return small, focused chunks rather than full documents",
  "Include confidence scores alongside generated answers",
  "Regularly update your knowledge base to prevent stale information",
  "Use structured citation formats that enable automated verification",
  "Test with adversarial questions designed to trigger hallucination",
];
