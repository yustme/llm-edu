/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction",
  "Explore the Dataset",
  "Without Semantic Layer",
  "With Semantic Layer",
  "Comparison",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "The consistency problem - same question, different answers",
  "Explore the TechShop e-commerce dataset",
  "3 agent runs, 3 different answers",
  "Adding a semantic layer for consistency",
  "Side-by-side comparison of results",
  "Key takeaways and semantic layer tools",
] as const;

/** Text content for the inconsistency explanation */
export const INCONSISTENCY_EXPLANATION = {
  intro:
    "When you ask different agents (or even the same agent at different times) the same business question, each one may interpret the query differently. Without a shared definition, every agent writes its own SQL with its own assumptions.",
  run1Problem:
    "This agent simply sums all order amounts without filtering by status. Cancelled, returned, and pending orders are all included.",
  run2Problem:
    "This agent correctly filters for completed orders but mistakenly adds tax_amount to revenue. Tax is collected for the government, not company revenue.",
  run3Problem:
    "This agent applies discounts correctly but only excludes cancelled orders. Returned and pending orders are still counted as revenue.",
  solution:
    "A semantic layer solves this by providing a single, authoritative definition for every business metric. When an agent needs 'total revenue', it uses the semantic layer's definition instead of guessing.",
} as const;

/** Semantic layer tool examples for the summary step */
export const SEMANTIC_TOOLS = [
  { name: "dbt Semantic Layer", description: "Define metrics in dbt models, query via APIs" },
  { name: "Cube.dev", description: "Headless BI with semantic layer and caching" },
  { name: "Looker (LookML)", description: "Modeling language for business metrics" },
  { name: "AtScale", description: "Enterprise semantic layer platform" },
] as const;

/** Key takeaways for the summary step */
export const KEY_TAKEAWAYS = [
  {
    title: "A semantic layer is a single source of truth for business metrics.",
    detail:
      "It defines exactly how metrics like 'revenue' are calculated, including which filters and transformations to apply.",
  },
  {
    title: "Without it, every agent invents its own interpretation.",
    detail:
      "Different SQL queries lead to different results, eroding trust in AI-generated answers.",
  },
  {
    title: "Consistency is essential for data-driven decisions.",
    detail:
      "When every agent uses the same metric definitions, stakeholders can trust the numbers and act on them confidently.",
  },
  {
    title: "Semantic layers work as a bridge between raw data and AI agents.",
    detail:
      "The agent asks for a metric, the semantic layer translates it into the correct query, and the database returns a consistent result.",
  },
] as const;
