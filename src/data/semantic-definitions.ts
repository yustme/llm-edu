import type { SemanticDefinition } from "@/types/semantic.types";
import { REVENUE_CORRECT } from "./sample-dataset";
import { formatCurrency } from "@/lib/formatters";

/** Semantic layer metric definitions for the TechShop dataset */
export const METRIC_DEFINITIONS: SemanticDefinition[] = [
  {
    metricName: "total_revenue",
    displayName: "Total Revenue",
    description: "Total revenue from completed orders after discounts",
    calculation: "SUM(order_amount - discount)",
    filters: ["status = 'completed'"],
    expectedResult: REVENUE_CORRECT,
    formattedResult: formatCurrency(REVENUE_CORRECT),
  },
  {
    metricName: "average_order_value",
    displayName: "Average Order Value",
    description: "Average order value for completed orders after discounts",
    calculation: "AVG(order_amount - discount)",
    filters: ["status = 'completed'"],
    expectedResult: REVENUE_CORRECT / 10,
    formattedResult: formatCurrency(REVENUE_CORRECT / 10),
  },
];

/** Semantic layer dimension definitions */
export interface DimensionDefinition {
  name: string;
  displayName: string;
  description: string;
  source: string;
  values?: string[];
}

export const DIMENSION_DEFINITIONS: DimensionDefinition[] = [
  {
    name: "customer_segment",
    displayName: "Customer Segment",
    description: "Customer business segment",
    source: "customers.segment",
    values: ["Enterprise", "Mid-Market", "Startup"],
  },
  {
    name: "product_category",
    displayName: "Product Category",
    description: "Product category classification",
    source: "products.category",
    values: ["Electronics", "Hardware", "Software", "Networking", "Accessories"],
  },
  {
    name: "order_status",
    displayName: "Order Status",
    description: "Current order fulfillment status",
    source: "orders.status",
    values: ["completed", "cancelled", "returned", "pending"],
  },
];

/** YAML representation of the total_revenue metric for display */
export const TOTAL_REVENUE_YAML = `metrics:
  total_revenue:
    description: "Total revenue from completed orders after discounts"
    calculation: "SUM(order_amount - discount)"
    filters:
      - "status = 'completed'"

  average_order_value:
    description: "Average order value for completed orders"
    calculation: "AVG(order_amount - discount)"
    filters:
      - "status = 'completed'"

dimensions:
  customer_segment:
    description: "Customer business segment"
    source: "customers.segment"

  product_category:
    description: "Product category classification"
    source: "products.category"

  order_status:
    description: "Current order fulfillment status"
    source: "orders.status"
    values: [completed, cancelled, returned, pending]`;

/** What the semantic layer provides - for the comparison table */
export const SEMANTIC_LAYER_FEATURES = [
  {
    feature: "Metric Definitions",
    without: "Each agent invents its own calculation",
    with: "Single source of truth for every metric",
  },
  {
    feature: "Filter Logic",
    without: "Inconsistent status filtering across queries",
    with: "Predefined filters applied automatically",
  },
  {
    feature: "Business Context",
    without: "Agent guesses what 'revenue' means",
    with: "Documented definitions with descriptions",
  },
  {
    feature: "Consistency",
    without: "Different results every run",
    with: "Same result every time, guaranteed",
  },
  {
    feature: "Maintainability",
    without: "Fix logic in every agent/query",
    with: "Update once in the semantic layer",
  },
] as const;
