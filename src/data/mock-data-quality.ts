import type { DatasetTable } from "@/types/semantic.types";

/** Detected quality issue in the dataset */
export interface QualityIssue {
  id: string;
  type: "missing_values" | "duplicates" | "inconsistencies" | "outliers";
  row: number;
  column: string;
  currentValue: string;
  severity: "high" | "medium" | "low";
  description: string;
}

/** Aggregate quality report */
export interface QualityReportData {
  score: number;
  totalRows: number;
  issuesFound: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
}

/** Dirty dataset with intentional quality issues */
export const DIRTY_DATASET: DatasetTable = {
  name: "orders_dirty",
  columns: [
    { name: "order_id", type: "VARCHAR", description: "Unique order identifier" },
    { name: "customer_id", type: "VARCHAR", description: "Reference to customer" },
    { name: "product_id", type: "VARCHAR", description: "Reference to product" },
    { name: "order_amount", type: "INTEGER", description: "Order amount in CZK" },
    { name: "discount", type: "INTEGER", description: "Applied discount in CZK" },
    { name: "status", type: "VARCHAR", description: "Order status" },
    { name: "order_date", type: "DATE", description: "Order creation date" },
  ],
  rows: [
    { order_id: "O001", customer_id: "C001", product_id: "P001", order_amount: 24500, discount: 1200, status: "completed", order_date: "2024-10-05" },
    { order_id: "O001", customer_id: "C001", product_id: "P001", order_amount: 24500, discount: 1200, status: "completed", order_date: "2024-10-05" },
    { order_id: "O002", customer_id: "", product_id: "P003", order_amount: 18900, discount: 0, status: "Completed", order_date: "2024-10-12" },
    { order_id: "O003", customer_id: "C003", product_id: "P002", order_amount: 32000, discount: 3200, status: "cancelled", order_date: "2024-10-18" },
    { order_id: "O004", customer_id: "C001", product_id: "P005", order_amount: 12800, discount: 640, status: "completed", order_date: "2024-11-02" },
    { order_id: "O005", customer_id: "C004", product_id: "P001", order_amount: 24500, discount: 2450, status: "Completed", order_date: "2024-11-08" },
    { order_id: "O006", customer_id: "", product_id: "P004", order_amount: 45000, discount: 4500, status: "returned", order_date: "2024-11-15" },
    { order_id: "O007", customer_id: "C002", product_id: "P006", order_amount: 8900, discount: 0, status: "completed", order_date: "2024-11-20" },
    { order_id: "O008", customer_id: "C006", product_id: "P002", order_amount: 32000, discount: 1600, status: "completed", order_date: "2024-12-01" },
    { order_id: "O099", customer_id: "C007", product_id: "P003", order_amount: 999999, discount: 0, status: "completed", order_date: "2024-12-10" },
  ],
  rowCount: 10,
};

/** Clean dataset with quality issues resolved */
export const CLEAN_DATASET: DatasetTable = {
  name: "orders_clean",
  columns: [
    { name: "order_id", type: "VARCHAR", description: "Unique order identifier" },
    { name: "customer_id", type: "VARCHAR", description: "Reference to customer" },
    { name: "product_id", type: "VARCHAR", description: "Reference to product" },
    { name: "order_amount", type: "INTEGER", description: "Order amount in CZK" },
    { name: "discount", type: "INTEGER", description: "Applied discount in CZK" },
    { name: "status", type: "VARCHAR", description: "Order status" },
    { name: "order_date", type: "DATE", description: "Order creation date" },
  ],
  rows: [
    { order_id: "O001", customer_id: "C001", product_id: "P001", order_amount: 24500, discount: 1200, status: "completed", order_date: "2024-10-05" },
    { order_id: "O002", customer_id: "C002", product_id: "P003", order_amount: 18900, discount: 0, status: "completed", order_date: "2024-10-12" },
    { order_id: "O003", customer_id: "C003", product_id: "P002", order_amount: 32000, discount: 3200, status: "cancelled", order_date: "2024-10-18" },
    { order_id: "O004", customer_id: "C001", product_id: "P005", order_amount: 12800, discount: 640, status: "completed", order_date: "2024-11-02" },
    { order_id: "O005", customer_id: "C004", product_id: "P001", order_amount: 24500, discount: 2450, status: "completed", order_date: "2024-11-08" },
    { order_id: "O006", customer_id: "C005", product_id: "P004", order_amount: 45000, discount: 4500, status: "returned", order_date: "2024-11-15" },
    { order_id: "O007", customer_id: "C002", product_id: "P006", order_amount: 8900, discount: 0, status: "completed", order_date: "2024-11-20" },
    { order_id: "O008", customer_id: "C006", product_id: "P002", order_amount: 32000, discount: 1600, status: "completed", order_date: "2024-12-01" },
    { order_id: "O099", customer_id: "C007", product_id: "P003", order_amount: 18900, discount: 0, status: "completed", order_date: "2024-12-10" },
  ],
  rowCount: 9,
};

/** Detected quality issues in the dirty dataset */
export const QUALITY_ISSUES: QualityIssue[] = [
  {
    id: "issue-1",
    type: "duplicates",
    row: 1,
    column: "order_id",
    currentValue: "O001",
    severity: "high",
    description: "Duplicate order O001 - appears twice with identical data",
  },
  {
    id: "issue-2",
    type: "missing_values",
    row: 2,
    column: "customer_id",
    currentValue: "(empty)",
    severity: "high",
    description: "Missing customer_id for order O002 - cannot attribute revenue",
  },
  {
    id: "issue-3",
    type: "inconsistencies",
    row: 2,
    column: "status",
    currentValue: "Completed",
    severity: "medium",
    description: "Inconsistent casing: 'Completed' instead of 'completed'",
  },
  {
    id: "issue-4",
    type: "inconsistencies",
    row: 5,
    column: "status",
    currentValue: "Completed",
    severity: "medium",
    description: "Inconsistent casing: 'Completed' instead of 'completed'",
  },
  {
    id: "issue-5",
    type: "missing_values",
    row: 6,
    column: "customer_id",
    currentValue: "(empty)",
    severity: "medium",
    description: "Missing customer_id for order O006 - cannot attribute to customer",
  },
  {
    id: "issue-6",
    type: "outliers",
    row: 9,
    column: "order_amount",
    currentValue: "999,999",
    severity: "high",
    description: "Order amount 999,999 CZK is 22x the maximum product price - likely data entry error",
  },
];

/** Aggregate quality report for the dirty dataset */
export const QUALITY_REPORT: QualityReportData = {
  score: 72,
  totalRows: 10,
  issuesFound: 6,
  byType: {
    missing_values: 2,
    duplicates: 1,
    inconsistencies: 2,
    outliers: 1,
  },
  bySeverity: {
    high: 3,
    medium: 2,
    low: 1,
  },
};
