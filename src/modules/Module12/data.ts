/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction to Data Quality",
  "Quality Dimensions",
  "Agent Architecture",
  "Quality Check Demo",
  "Remediation Demo",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why data quality matters for AI agents and analytics",
  "Five dimensions of data quality with examples",
  "How a quality agent scans, detects, reports, and fixes issues",
  "Agent scans dataset and identifies quality issues",
  "Agent proposes and applies fixes to quality issues",
  "Manual vs automated quality management comparison",
] as const;

/** A quality dimension with its score */
export interface QualityDimension {
  id: string;
  name: string;
  description: string;
  example: string;
  score: number;
}

/** Five dimensions of data quality */
export const QUALITY_DIMENSIONS: QualityDimension[] = [
  {
    id: "completeness",
    name: "Completeness",
    description: "All required data fields are populated with valid values",
    example: "2 orders missing customer_id - cannot attribute revenue to customers",
    score: 80,
  },
  {
    id: "accuracy",
    name: "Accuracy",
    description: "Data values correctly represent the real-world entities they model",
    example: "Order O099 has amount 999,999 CZK - likely a data entry error",
    score: 85,
  },
  {
    id: "consistency",
    name: "Consistency",
    description: "Same data does not conflict across different records or systems",
    example: "Status values mix 'Completed' and 'completed' - inconsistent casing",
    score: 70,
  },
  {
    id: "timeliness",
    name: "Timeliness",
    description: "Data is up-to-date and available when needed for decisions",
    example: "All order dates are within expected range - no stale records",
    score: 95,
  },
  {
    id: "uniqueness",
    name: "Uniqueness",
    description: "Each entity is represented only once without duplicates",
    example: "Order O001 appears twice - duplicate record inflates revenue metrics",
    score: 90,
  },
];

/** Issue type definition */
export interface IssueType {
  id: string;
  label: string;
  description: string;
  iconName: "AlertCircle" | "Copy" | "Shuffle" | "TrendingUp";
  color: string;
}

/** Four categories of data quality issues */
export const ISSUE_TYPES: IssueType[] = [
  {
    id: "missing_values",
    label: "Missing Values",
    description: "Required fields that are NULL, empty, or contain placeholder values",
    iconName: "AlertCircle",
    color: "bg-red-100 border-red-300 text-red-700",
  },
  {
    id: "duplicates",
    label: "Duplicates",
    description: "Records that appear more than once, inflating aggregations",
    iconName: "Copy",
    color: "bg-amber-100 border-amber-300 text-amber-700",
  },
  {
    id: "inconsistencies",
    label: "Inconsistencies",
    description: "Values that represent the same thing differently across records",
    iconName: "Shuffle",
    color: "bg-blue-100 border-blue-300 text-blue-700",
  },
  {
    id: "outliers",
    label: "Outliers",
    description: "Values that are statistically improbable and likely erroneous",
    iconName: "TrendingUp",
    color: "bg-purple-100 border-purple-300 text-purple-700",
  },
];

/** Fix proposal for a quality issue */
export interface FixProposal {
  id: string;
  issue: string;
  description: string;
  sql: string;
  impact: string;
}

/** Fix proposals for detected quality issues */
export const FIX_PROPOSALS: FixProposal[] = [
  {
    id: "fix-missing",
    issue: "Missing customer_id values",
    description: "Look up customer by email address to fill in missing customer_id references",
    sql: `UPDATE orders_dirty o
SET customer_id = c.customer_id
FROM customers c
WHERE o.customer_id IS NULL
  AND o.email = c.email;`,
    impact: "Restores 2 records to full completeness",
  },
  {
    id: "fix-duplicate",
    issue: "Duplicate order O001",
    description: "Remove the duplicate row keeping only the first occurrence based on insertion order",
    sql: `DELETE FROM orders_dirty
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM orders_dirty
  GROUP BY order_id
);`,
    impact: "Removes 1 duplicate, corrects revenue by -24,500 CZK",
  },
  {
    id: "fix-inconsistency",
    issue: "Inconsistent status casing",
    description: "Normalize all status values to lowercase to match the expected ENUM values",
    sql: `UPDATE orders_dirty
SET status = LOWER(status)
WHERE status != LOWER(status);`,
    impact: "Fixes 2 records with inconsistent status values",
  },
  {
    id: "fix-outlier",
    issue: "Outlier order amount (999,999 CZK)",
    description: "Flag the outlier for manual review and cap at the maximum product price (45,000 CZK)",
    sql: `UPDATE orders_dirty
SET order_amount = 45000,
    flagged = true
WHERE order_amount > 100000;`,
    impact: "Corrects 1 record, reduces revenue overstatement by 954,999 CZK",
  },
];
