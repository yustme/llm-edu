import type { DatasetTable } from "@/types/semantic.types";

/** Order record in the TechShop e-commerce dataset */
export interface OrderRow {
  order_id: string;
  customer_id: string;
  product_id: string;
  order_amount: number;
  discount: number;
  tax_amount: number;
  status: "completed" | "cancelled" | "returned" | "pending";
  order_date: string;
}

/** Product record in the TechShop e-commerce dataset */
export interface ProductRow {
  product_id: string;
  name: string;
  category: string;
  price: number;
}

/** Customer record in the TechShop e-commerce dataset */
export interface CustomerRow {
  customer_id: string;
  name: string;
  email: string;
  segment: string;
}

/** TechShop orders data (15 rows) */
export const ORDERS: OrderRow[] = [
  { order_id: "O001", customer_id: "C001", product_id: "P001", order_amount: 24500, discount: 1200, tax_amount: 4900, status: "completed", order_date: "2024-10-05" },
  { order_id: "O002", customer_id: "C002", product_id: "P003", order_amount: 18900, discount: 0, tax_amount: 3780, status: "completed", order_date: "2024-10-12" },
  { order_id: "O003", customer_id: "C003", product_id: "P002", order_amount: 32000, discount: 3200, tax_amount: 6400, status: "cancelled", order_date: "2024-10-18" },
  { order_id: "O004", customer_id: "C001", product_id: "P005", order_amount: 12800, discount: 640, tax_amount: 2560, status: "completed", order_date: "2024-11-02" },
  { order_id: "O005", customer_id: "C004", product_id: "P001", order_amount: 24500, discount: 2450, tax_amount: 4900, status: "completed", order_date: "2024-11-08" },
  { order_id: "O006", customer_id: "C005", product_id: "P004", order_amount: 45000, discount: 4500, tax_amount: 9000, status: "returned", order_date: "2024-11-15" },
  { order_id: "O007", customer_id: "C002", product_id: "P006", order_amount: 8900, discount: 0, tax_amount: 1780, status: "completed", order_date: "2024-11-20" },
  { order_id: "O008", customer_id: "C006", product_id: "P002", order_amount: 32000, discount: 1600, tax_amount: 6400, status: "completed", order_date: "2024-12-01" },
  { order_id: "O009", customer_id: "C003", product_id: "P007", order_amount: 5600, discount: 280, tax_amount: 1120, status: "pending", order_date: "2024-12-05" },
  { order_id: "O010", customer_id: "C007", product_id: "P003", order_amount: 18900, discount: 945, tax_amount: 3780, status: "completed", order_date: "2024-12-10" },
  { order_id: "O011", customer_id: "C004", product_id: "P008", order_amount: 15200, discount: 760, tax_amount: 3040, status: "completed", order_date: "2024-12-15" },
  { order_id: "O012", customer_id: "C001", product_id: "P001", order_amount: 24500, discount: 0, tax_amount: 4900, status: "cancelled", order_date: "2024-12-18" },
  { order_id: "O013", customer_id: "C005", product_id: "P005", order_amount: 12800, discount: 1280, tax_amount: 2560, status: "completed", order_date: "2024-12-20" },
  { order_id: "O014", customer_id: "C006", product_id: "P004", order_amount: 45000, discount: 2250, tax_amount: 9000, status: "returned", order_date: "2024-12-22" },
  { order_id: "O015", customer_id: "C002", product_id: "P006", order_amount: 8900, discount: 445, tax_amount: 1780, status: "completed", order_date: "2024-12-28" },
];

/** TechShop products data (8 rows) */
export const PRODUCTS: ProductRow[] = [
  { product_id: "P001", name: "Laptop Pro 15", category: "Electronics", price: 24500 },
  { product_id: "P002", name: "Server Rack X", category: "Hardware", price: 32000 },
  { product_id: "P003", name: "Cloud Suite Pro", category: "Software", price: 18900 },
  { product_id: "P004", name: "Enterprise Switch", category: "Networking", price: 45000 },
  { product_id: "P005", name: "USB Hub Ultra", category: "Accessories", price: 12800 },
  { product_id: "P006", name: "Cable Kit Pro", category: "Accessories", price: 8900 },
  { product_id: "P007", name: "Mouse Wireless", category: "Accessories", price: 5600 },
  { product_id: "P008", name: 'Monitor 27"', category: "Electronics", price: 15200 },
];

/** TechShop customers data (7 rows) */
export const CUSTOMERS: CustomerRow[] = [
  { customer_id: "C001", name: "Acme Corp", email: "info@acme.com", segment: "Enterprise" },
  { customer_id: "C002", name: "Beta Systems", email: "contact@beta.com", segment: "Mid-Market" },
  { customer_id: "C003", name: "Gamma Tech", email: "hello@gamma.com", segment: "Startup" },
  { customer_id: "C004", name: "Delta Solutions", email: "sales@delta.com", segment: "Enterprise" },
  { customer_id: "C005", name: "Epsilon Labs", email: "team@epsilon.com", segment: "Mid-Market" },
  { customer_id: "C006", name: "Zeta Industries", email: "orders@zeta.com", segment: "Enterprise" },
  { customer_id: "C007", name: "Eta Digital", email: "hi@eta.com", segment: "Startup" },
];

/* ---------- Computed query results (derived from actual data) ---------- */

/**
 * Run 1: SUM(order_amount) FROM orders -- includes ALL statuses
 */
export function computeRun1(): number {
  return ORDERS.reduce((sum, o) => sum + o.order_amount, 0);
}

/**
 * Run 2: SUM(order_amount + tax_amount) WHERE status = 'completed'
 * (incorrectly includes tax in revenue)
 */
export function computeRun2(): number {
  return ORDERS
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.order_amount + o.tax_amount, 0);
}

/**
 * Run 3: SUM(order_amount - discount) WHERE status != 'cancelled'
 * (includes returned and pending orders)
 */
export function computeRun3(): number {
  return ORDERS
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.order_amount - o.discount, 0);
}

/**
 * Correct result: SUM(order_amount - discount) WHERE status = 'completed'
 * (only completed orders, after discounts, excluding tax)
 */
export function computeCorrectRevenue(): number {
  return ORDERS
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.order_amount - o.discount, 0);
}

/* ---------- Pre-computed constants for quick access ---------- */

export const REVENUE_RUN1 = computeRun1();
export const REVENUE_RUN2 = computeRun2();
export const REVENUE_RUN3 = computeRun3();
export const REVENUE_CORRECT = computeCorrectRevenue();

/* ---------- DatasetTable definitions for the UI ---------- */

export const ORDERS_TABLE: DatasetTable = {
  name: "orders",
  columns: [
    { name: "order_id", type: "VARCHAR", description: "Unique order identifier" },
    { name: "customer_id", type: "VARCHAR", description: "Reference to customer" },
    { name: "product_id", type: "VARCHAR", description: "Reference to product" },
    { name: "order_amount", type: "INTEGER", description: "Order amount in CZK" },
    { name: "discount", type: "INTEGER", description: "Applied discount in CZK" },
    { name: "tax_amount", type: "INTEGER", description: "Tax amount in CZK" },
    { name: "status", type: "ENUM", description: "Order status: completed, cancelled, returned, pending" },
    { name: "order_date", type: "DATE", description: "Order creation date" },
  ],
  rows: ORDERS as unknown as Record<string, unknown>[],
  rowCount: ORDERS.length,
};

export const PRODUCTS_TABLE: DatasetTable = {
  name: "products",
  columns: [
    { name: "product_id", type: "VARCHAR", description: "Unique product identifier" },
    { name: "name", type: "VARCHAR", description: "Product name" },
    { name: "category", type: "VARCHAR", description: "Product category" },
    { name: "price", type: "INTEGER", description: "Unit price in CZK" },
  ],
  rows: PRODUCTS as unknown as Record<string, unknown>[],
  rowCount: PRODUCTS.length,
};

export const CUSTOMERS_TABLE: DatasetTable = {
  name: "customers",
  columns: [
    { name: "customer_id", type: "VARCHAR", description: "Unique customer identifier" },
    { name: "name", type: "VARCHAR", description: "Company name" },
    { name: "email", type: "VARCHAR", description: "Contact email" },
    { name: "segment", type: "VARCHAR", description: "Business segment: Enterprise, Mid-Market, Startup" },
  ],
  rows: CUSTOMERS as unknown as Record<string, unknown>[],
  rowCount: CUSTOMERS.length,
};

/** All dataset tables for the DatasetTable component */
export const DATASET_TABLES = [ORDERS_TABLE, PRODUCTS_TABLE, CUSTOMERS_TABLE] as const;

/** Columns to highlight in the orders table (key columns for the revenue demo) */
export const HIGHLIGHT_COLUMNS = ["order_amount", "discount", "status"] as const;
